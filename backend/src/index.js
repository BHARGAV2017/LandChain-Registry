import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import landParcelsRoutes from "./routes/landParcels.routes.js";
import * as ipfs from "./services/ipfs.service.js";
import * as blockchain from "./services/blockchain.service.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

function corsOrigins() {
  const raw =
    process.env.FRONTEND_URLS ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const allowedOrigins = corsOrigins();

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (no Origin) and listed frontends
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);
app.use(express.json());

app.get("/health", async (_req, res) => {
  const ipfsOk = await ipfs.checkIpfsConnection();
  const chain = await blockchain.getBlockchainStatus();
  res.json({
    status: "ok",
    ipfs: ipfsOk,
    blockchain: chain,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/config", (_req, res) => {
  const deployment = blockchain.getDeployment();
  if (!deployment) {
    return res.status(503).json({
      success: false,
      message:
        "Contract not configured. Set CONTRACT_ADDRESS (+ shared/abi.json) or run deploy.",
    });
  }
  res.json({
    success: true,
    data: {
      contractAddress: deployment.contractAddress,
      chainId: deployment.chainId,
      abi: deployment.abi,
      rpcUrl: process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545",
      chainName: process.env.CHAIN_NAME || undefined,
      currencySymbol: process.env.CURRENCY_SYMBOL || undefined,
      blockExplorerUrl: process.env.BLOCK_EXPLORER_URL || undefined,
    },
  });
});

app.use("/api/land-parcels", landParcelsRoutes);

fs.mkdirSync(path.join(__dirname, "../uploads"), { recursive: true });

app.listen(PORT, () => {
  console.log(`Land Registry API running on port ${PORT}`);
  const dep = blockchain.getDeployment();
  if (dep) {
    console.log(`Contract: ${dep.contractAddress} (chain ${dep.chainId})`);
  } else {
    console.log("Warning: contract not configured");
  }
});
