import { Router } from "express";
import multer from "multer";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import * as ipfs from "../services/ipfs.service.js";
import * as blockchain from "../services/blockchain.service.js";
import {
  generateParcelId,
  hashGPS,
  hashMetadata,
  parcelIdToBytes32,
} from "../utils/hash.js";

const router = Router();
const prisma = new PrismaClient();

const upload = multer({ dest: "uploads/", limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/prepare", upload.fields([{ name: "images", maxCount: 5 }, { name: "documents", maxCount: 5 }]), async (req, res) => {
  try {
    const {
      gps_latitude,
      gps_longitude,
      area_square_meters,
      address,
      city,
      state,
      country,
    } = req.body;

    if (!gps_latitude || !gps_longitude) {
      return res.status(400).json({ success: false, message: "GPS coordinates required" });
    }

    const parcelId = req.body.parcel_id?.trim() || generateParcelId();
    const parcelIdBytes32 = parcelIdToBytes32(parcelId);
    const gpsHash = hashGPS(gps_latitude, gps_longitude);

    const imageCids = [];
    const documentCids = [];

    if (req.files?.images) {
      const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const file of images) {
        const buffer = fs.readFileSync(file.path);
        const result = await ipfs.uploadBuffer(buffer, file.originalname);
        imageCids.push(result.cid);
        fs.unlinkSync(file.path);
      }
    }

    if (req.files?.documents) {
      const docs = Array.isArray(req.files.documents) ? req.files.documents : [req.files.documents];
      for (const file of docs) {
        const buffer = fs.readFileSync(file.path);
        const result = await ipfs.uploadBuffer(buffer, file.originalname);
        documentCids.push(result.cid);
        fs.unlinkSync(file.path);
      }
    }

    const metadata = {
      parcelId,
      gps: { latitude: parseFloat(gps_latitude), longitude: parseFloat(gps_longitude) },
      area: area_square_meters ? parseFloat(area_square_meters) : null,
      address: { street: address, city, state, country },
      images: imageCids,
      documents: documentCids,
      registeredAt: new Date().toISOString(),
    };

    const metadataUpload = await ipfs.uploadJSON(metadata);
    const metadataHash = hashMetadata(metadata);

    res.json({
      success: true,
      data: {
        parcelId,
        parcelIdBytes32,
        gpsHash,
        metadataHash,
        metadataHashBytes32: `0x${metadataHash}`,
        gpsHashBytes32: `0x${gpsHash}`,
        metadataIpfsCid: metadataUpload.cid,
        imageCids,
        documentCids,
        metadata,
      },
    });
  } catch (error) {
    console.error("Prepare error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/confirm-registration", async (req, res) => {
  try {
    const {
      parcelId,
      parcelIdBytes32,
      ownerWallet,
      gps_latitude,
      gps_longitude,
      gpsHash,
      metadataHash,
      metadataIpfsCid,
      imageCids,
      documentCids,
      area_square_meters,
      address,
      city,
      state,
      country,
      txHash,
      blockNumber,
    } = req.body;

    if (!parcelId || !ownerWallet || !txHash) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const parcel = await prisma.landParcel.create({
      data: {
        parcelId,
        parcelIdBytes32,
        ownerWallet: ownerWallet.toLowerCase(),
        gpsLatitude: parseFloat(gps_latitude),
        gpsLongitude: parseFloat(gps_longitude),
        gpsHash,
        metadataHash,
        metadataIpfsCid,
        imageCids: imageCids || [],
        documentCids: documentCids || [],
        areaSquareMeters: area_square_meters ? parseFloat(area_square_meters) : null,
        address,
        city,
        state,
        country,
        registrationTxHash: txHash,
        registrationBlockNumber: blockNumber ? parseInt(blockNumber, 10) : null,
      },
    });

    res.status(201).json({ success: true, data: parcel });
  } catch (error) {
    console.error("Confirm registration error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { owner } = req.query;
    const where = owner ? { ownerWallet: owner.toLowerCase() } : {};
    const parcels = await prisma.landParcel.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: parcels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/verify/:parcelId", async (req, res) => {
  try {
    const parcel = await prisma.landParcel.findUnique({
      where: { parcelId: req.params.parcelId },
      include: { transfers: { orderBy: { createdAt: "asc" } } },
    });

    if (!parcel) {
      return res.status(404).json({ success: false, message: "Parcel not found in database" });
    }

    const onChain = await blockchain.getOnChainParcel(parcel.parcelIdBytes32);

    res.json({
      success: true,
      data: {
        ...parcel,
        metadataUrl: ipfs.getIpfsUrl(parcel.metadataIpfsCid),
        imageUrls: parcel.imageCids.map((c) => ipfs.getIpfsUrl(c)),
        documentUrls: parcel.documentCids.map((c) => ipfs.getIpfsUrl(c)),
        onChain,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/confirm-transfer", async (req, res) => {
  try {
    const { parcelId, fromWallet, toWallet, txHash, transferHash } = req.body;

    const parcel = await prisma.landParcel.findUnique({ where: { parcelId } });
    if (!parcel) {
      return res.status(404).json({ success: false, message: "Parcel not found" });
    }

    await prisma.$transaction([
      prisma.landParcel.update({
        where: { id: parcel.id },
        data: {
          ownerWallet: toWallet.toLowerCase(),
          lastTransferTxHash: txHash,
        },
      }),
      prisma.transferRecord.create({
        data: {
          landParcelId: parcel.id,
          parcelId,
          fromWallet: fromWallet.toLowerCase(),
          toWallet: toWallet.toLowerCase(),
          transferTxHash: txHash,
          transferHash: transferHash || null,
        },
      }),
    ]);

    res.json({ success: true, message: "Transfer recorded" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
