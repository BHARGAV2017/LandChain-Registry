import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let deployment = null;
let provider = null;
let contract = null;

function loadAbi() {
  const abiPath = path.join(__dirname, "../../../shared/abi.json");
  if (fs.existsSync(abiPath)) {
    return JSON.parse(fs.readFileSync(abiPath, "utf8"));
  }
  return null;
}

function loadDeployment() {
  // Production: CONTRACT_ADDRESS (+ optional CHAIN_ID) with shared/abi.json
  if (process.env.CONTRACT_ADDRESS) {
    const abi = loadAbi();
    if (!abi) {
      console.warn("CONTRACT_ADDRESS set but shared/abi.json missing");
      return null;
    }
    const next = {
      contractAddress: process.env.CONTRACT_ADDRESS,
      chainId: process.env.CHAIN_ID || "80002",
      abi,
    };
    if (!deployment || deployment.contractAddress !== next.contractAddress) {
      deployment = next;
      contract = null;
    }
    return deployment;
  }

  const deploymentPath = path.join(__dirname, "../../../shared/deployment.json");
  if (!fs.existsSync(deploymentPath)) {
    return null;
  }
  const fresh = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  if (!deployment || deployment.contractAddress !== fresh.contractAddress) {
    deployment = fresh;
    contract = null;
  }
  return deployment;
}

export function getDeployment() {
  return loadDeployment();
}

export function getProvider() {
  if (!provider) {
    const rpc = process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545";
    provider = new ethers.JsonRpcProvider(rpc);
  }
  return provider;
}

export function getContract() {
  const dep = loadDeployment();
  if (!dep) return null;
  if (!contract) {
    contract = new ethers.Contract(dep.contractAddress, dep.abi, getProvider());
  }
  return contract;
}

export async function getOnChainParcel(parcelIdBytes32) {
  const c = getContract();
  if (!c) return null;
  const exists = await c.parcelExistsCheck(parcelIdBytes32);
  if (!exists) return null;

  const [owner, gpsHash, metadataHash, registrationDate, lastTransferDate] =
    await c.getParcelDetails(parcelIdBytes32);

  const history = await c.getOwnershipHistory(parcelIdBytes32);

  return {
    owner,
    gpsHash,
    metadataHash,
    registrationDate: Number(registrationDate),
    lastTransferDate: Number(lastTransferDate),
    history: history.map((r) => ({
      owner: r.owner,
      timestamp: Number(r.timestamp),
      transferHash: r.transferHash,
      metadataHash: r.metadataHash,
      gpsHash: r.gpsHash,
      isActive: r.isActive,
    })),
  };
}

export async function getBlockchainStatus() {
  const dep = loadDeployment();
  const provider = getProvider();
  try {
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    return {
      connected: true,
      chainId: Number(network.chainId),
      blockNumber,
      contractAddress: dep?.contractAddress || null,
    };
  } catch {
    return { connected: false, contractAddress: dep?.contractAddress || null };
  }
}
