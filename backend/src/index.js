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

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
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
      message: "Contract not deployed. Run: cd contracts && npm run deploy:local",
    });
  }
  res.json({
    success: true,
    data: {
      contractAddress: deployment.contractAddress,
      chainId: deployment.chainId,
      abi: deployment.abi,
      rpcUrl: process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545",
    },
  });
});

app.use("/api/land-parcels", landParcelsRoutes);

fs.mkdirSync(path.join(__dirname, "../uploads"), { recursive: true });

app.listen(PORT, () => {
  console.log(`Land Registry API running on http://localhost:${PORT}`);
  const dep = blockchain.getDeployment();
  if (dep) {
    console.log(`Contract: ${dep.contractAddress}`);
  } else {
    console.log("Warning: shared/deployment.json not found — deploy contract first");
  }
});
