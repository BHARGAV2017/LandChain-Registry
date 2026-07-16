import crypto from "crypto";

const IPFS_API = process.env.IPFS_API_URL || "http://127.0.0.1:5001";
const PINATA_JWT = process.env.PINATA_JWT || "";
const PINATA_GATEWAY =
  process.env.PINATA_GATEWAY ||
  process.env.IPFS_GATEWAY_URL ||
  "https://gateway.pinata.cloud";

function usePinata() {
  return Boolean(PINATA_JWT);
}

export async function checkIpfsConnection() {
  if (usePinata()) {
    try {
      const res = await fetch("https://api.pinata.cloud/data/testAuthentication", {
        headers: { Authorization: `Bearer ${PINATA_JWT}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  try {
    const res = await fetch(`${IPFS_API}/api/v0/id`, { method: "POST" });
    return res.ok;
  } catch {
    return false;
  }
}

async function uploadBufferViaPinata(buffer, fileName) {
  const formData = new FormData();
  formData.append("file", new Blob([buffer]), fileName);

  const metadata = JSON.stringify({ name: fileName });
  formData.append("pinataMetadata", metadata);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: { Authorization: `Bearer ${PINATA_JWT}` },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pinata upload failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  return json.IpfsHash;
}

async function uploadBufferViaLocal(buffer, fileName) {
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
  return json.Hash;
}

export async function uploadBuffer(buffer, fileName) {
  const fileHash = crypto.createHash("sha256").update(buffer).digest("hex");
  const cid = usePinata()
    ? await uploadBufferViaPinata(buffer, fileName)
    : await uploadBufferViaLocal(buffer, fileName);

  return {
    cid,
    hash: fileHash,
    size: buffer.length,
  };
}

export async function uploadJSON(metadata) {
  const buffer = Buffer.from(JSON.stringify(metadata, null, 2));
  return uploadBuffer(buffer, "metadata.json");
}

export function getIpfsUrl(cid) {
  if (usePinata()) {
    const gateway = PINATA_GATEWAY.replace(/\/$/, "");
    // Dedicated Pinata gateways often use /ipfs/<cid>
    if (gateway.includes("mypinata.cloud") || gateway.includes("pinata.cloud")) {
      return `${gateway}/ipfs/${cid}`;
    }
    return `${gateway}/ipfs/${cid}`;
  }
  const gateway = process.env.IPFS_GATEWAY_URL || "http://127.0.0.1:8080";
  return `${gateway}/ipfs/${cid}`;
}
