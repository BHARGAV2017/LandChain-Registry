/**
 * Seed demo land parcels into IPFS + blockchain + database.
 *
 * Prerequisites (all running):
 *   - docker compose up
 *   - npm run node (contracts/)
 *   - npm run deploy:local (contracts/) — if not deployed
 *   - npm run dev (backend/)
 *
 * Usage:
 *   cd proto
 *   node demo-data/seed-demo.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API = process.env.API_URL || "http://localhost:3001";
const RPC = process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545";

// Hardhat default Account #0 private key (local demo only)
const OWNER_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const BUYER_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

const PARCELS = [
  {
    parcelId: "LP-DEMO-001",
    gps: { lat: 28.6139, lng: 77.209 },
    area: 2450,
    address: "Survey No. 1247/2, Hauz Khas",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    images: ["land-aerial-LP-DEMO-001.svg", "land-boundary-LP-DEMO-001.svg", "property-photo-LP-DEMO-001.svg"],
    documents: ["deed-of-sale-LP-DEMO-001.html", "survey-report-LP-DEMO-001.html"],
  },
  {
    parcelId: "LP-DEMO-002",
    gps: { lat: 28.4595, lng: 77.0266 },
    area: 10200,
    address: "Khasra 89/2, Village Sikandarpur",
    city: "Gurugram",
    state: "Haryana",
    country: "India",
    images: ["land-aerial-LP-DEMO-002.svg"],
    documents: ["deed-of-sale-LP-DEMO-002.html"],
  },
];

function loadDeployment() {
  const p = path.join(__dirname, "../shared/deployment.json");
  if (!fs.existsSync(p)) throw new Error("Run: cd contracts && npm run deploy:local");
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function hashToBytes32(hexHash) {
  const hex = hexHash.startsWith("0x") ? hexHash.slice(2) : hexHash;
  return ethers.zeroPadValue(`0x${hex.slice(0, 64)}`, 32);
}

async function prepareParcel(parcel) {
  const form = new FormData();
  form.append("gps_latitude", String(parcel.gps.lat));
  form.append("gps_longitude", String(parcel.gps.lng));
  form.append("area_square_meters", String(parcel.area));
  form.append("address", parcel.address);
  form.append("city", parcel.city);
  form.append("state", parcel.state);
  form.append("country", parcel.country);
  form.append("parcel_id", parcel.parcelId);

  for (const img of parcel.images) {
    const buf = fs.readFileSync(path.join(__dirname, "images", img));
    form.append("images", new Blob([buf]), img);
  }
  for (const doc of parcel.documents) {
    const buf = fs.readFileSync(path.join(__dirname, "documents", doc));
    form.append("documents", new Blob([buf]), doc);
  }

  const res = await fetch(`${API}/api/land-parcels/prepare`, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Prepare failed");
  return data.data;
}

async function registerOnChain(wallet, prep, parcelId) {
  const deployment = loadDeployment();
  const contract = new ethers.Contract(deployment.contractAddress, deployment.abi, wallet);
  const parcelIdBytes32 = ethers.id(parcelId);
  const nonce = await wallet.provider.getTransactionCount(wallet.address, "latest");
  const tx = await contract.registerLand(
    parcelIdBytes32,
    hashToBytes32(prep.gpsHash),
    hashToBytes32(prep.metadataHash),
    { nonce }
  );
  const receipt = await tx.wait();
  return { txHash: receipt.hash, blockNumber: receipt.blockNumber, parcelIdBytes32 };
}

async function confirmDb(prep, parcel, ownerWallet, chain) {
  const res = await fetch(`${API}/api/land-parcels/confirm-registration`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      parcelId: parcel.parcelId,
      parcelIdBytes32: chain.parcelIdBytes32,
      ownerWallet,
      gps_latitude: parcel.gps.lat,
      gps_longitude: parcel.gps.lng,
      gpsHash: prep.gpsHash,
      metadataHash: prep.metadataHash,
      metadataIpfsCid: prep.metadataIpfsCid,
      imageCids: prep.imageCids,
      documentCids: prep.documentCids,
      area_square_meters: parcel.area,
      address: parcel.address,
      city: parcel.city,
      state: parcel.state,
      country: parcel.country,
      txHash: chain.txHash,
      blockNumber: chain.blockNumber,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Confirm failed");
  return data.data;
}

async function transferParcel(wallet, parcelId, newOwner) {
  const deployment = loadDeployment();
  const contract = new ethers.Contract(deployment.contractAddress, deployment.abi, wallet);
  const parcelIdBytes32 = ethers.id(parcelId);
  const nonce = await wallet.provider.getTransactionCount(wallet.address, "latest");
  const tx = await contract.transferOwnership(
    parcelIdBytes32,
    newOwner,
    ethers.ZeroHash,
    { nonce }
  );
  const receipt = await tx.wait();
  return { txHash: receipt.hash };
}

async function parcelExistsInDb(parcelId) {
  const res = await fetch(`${API}/api/land-parcels/verify/${parcelId}`);
  return res.ok;
}

async function main() {
  console.log("Land Registry — Demo Seed\n");

  const health = await fetch(`${API}/health`).then((r) => r.json());
  if (!health.ipfs) throw new Error("IPFS not connected. Is docker compose up?");
  if (!health.blockchain?.connected) throw new Error("Blockchain not connected. Is hardhat node running?");

  const provider = new ethers.JsonRpcProvider(RPC);
  const wallet = new ethers.Wallet(OWNER_KEY, provider);
  console.log("Owner wallet:", wallet.address);
  console.log("Contract:", loadDeployment().contractAddress);

  for (const parcel of PARCELS) {
    console.log(`\nRegistering ${parcel.parcelId}...`);
    if (await parcelExistsInDb(parcel.parcelId)) {
      console.log(`  ↷ already in database — skipping register`);
      continue;
    }
    const prep = await prepareParcel(parcel);
    const chain = await registerOnChain(wallet, prep, parcel.parcelId);
    await confirmDb(prep, parcel, wallet.address, chain);
    console.log(`  ✓ ${parcel.parcelId} | tx: ${chain.txHash}`);
    console.log(`  ✓ IPFS metadata: ${prep.metadataIpfsCid}`);
  }

  const firstId = PARCELS[0].parcelId;
  console.log(`\nTransferring ${firstId} → buyer ${BUYER_ADDRESS}...`);
  const verifyRes = await fetch(`${API}/api/land-parcels/verify/${firstId}`).then((r) => r.json());
  const currentOwner = verifyRes.data?.ownerWallet?.toLowerCase();
  if (currentOwner === BUYER_ADDRESS.toLowerCase()) {
    console.log(`  ↷ already owned by buyer — skipping transfer`);
  } else {
    const transfer = await transferParcel(wallet, firstId, BUYER_ADDRESS);
    await fetch(`${API}/api/land-parcels/confirm-transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parcelId: firstId,
        fromWallet: wallet.address,
        toWallet: BUYER_ADDRESS,
        txHash: transfer.txHash,
      }),
    });
    console.log(`  ✓ Transfer tx: ${transfer.txHash}`);
  }

  console.log("\n--- Demo ready ---");
  console.log("Open http://localhost:5173");
  console.log("Verify parcels:");
  console.log("  LP-DEMO-001 (transferred to Account #1)");
  console.log("  LP-DEMO-002 (still owned by Account #0)");
  console.log("\nMetaMask Account #0:", wallet.address);
  console.log("MetaMask Account #1:", BUYER_ADDRESS);
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
