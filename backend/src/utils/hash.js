import crypto from "crypto";
import { ethers } from "ethers";

export function hashGPS(latitude, longitude) {
  const payload = `${Number(latitude).toFixed(8)},${Number(longitude).toFixed(8)}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

export function hashMetadata(metadata) {
  const json = JSON.stringify(metadata);
  return crypto.createHash("sha256").update(json).digest("hex");
}

export function generateParcelId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `LP-${ts}-${rand}`;
}

export function parcelIdToBytes32(parcelId) {
  return ethers.id(parcelId);
}

export function hashToBytes32(hexHash) {
  return `0x${hexHash.slice(0, 64).padEnd(64, "0")}`;
}

export function bytes32ToParcelId(bytes32) {
  try {
    return ethers.decodeBytes32String(bytes32);
  } catch {
    return bytes32;
  }
}
