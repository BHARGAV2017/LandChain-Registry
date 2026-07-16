import crypto from "crypto";

const IPFS_API = process.env.IPFS_API_URL || "http://127.0.0.1:5001";

export async function checkIpfsConnection() {
  try {
    const res = await fetch(`${IPFS_API}/api/v0/id`, { method: "POST" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function uploadBuffer(buffer, fileName) {
  const fileHash = crypto.createHash("sha256").update(buffer).digest("hex");

  const formData = new FormData();
  formData.append("file", new Blob([buffer]), fileName);

  const res = await fetch(`${IPFS_API}/api/v0/add?pin=true`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`IPFS upload failed: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();
  const lastLine = text.trim().split("\n").pop();
  const json = JSON.parse(lastLine);

  return {
    cid: json.Hash,
    hash: fileHash,
    size: buffer.length,
  };
}

export async function uploadJSON(metadata) {
  const buffer = Buffer.from(JSON.stringify(metadata, null, 2));
  return uploadBuffer(buffer, "metadata.json");
}

export function getIpfsUrl(cid) {
  const gateway = process.env.IPFS_GATEWAY_URL || "http://127.0.0.1:8080";
  return `${gateway}/ipfs/${cid}`;
}
