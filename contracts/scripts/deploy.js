const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const LandRegistry = await hre.ethers.getContractFactory("LandRegistry");
  const landRegistry = await LandRegistry.deploy();
  await landRegistry.waitForDeployment();

  const address = await landRegistry.getAddress();
  console.log("LandRegistry deployed to:", address);

  const artifact = await hre.artifacts.readArtifact("LandRegistry");
  const deployment = {
    contractAddress: address,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    abi: artifact.abi,
  };

  const sharedDir = path.join(__dirname, "..", "..", "shared");
  fs.mkdirSync(sharedDir, { recursive: true });
  fs.writeFileSync(
    path.join(sharedDir, "deployment.json"),
    JSON.stringify(deployment, null, 2)
  );

  console.log("Saved deployment.json to shared/");

  // Keep committed ABI in sync for cloud deploys (CONTRACT_ADDRESS env)
  const abiJson = JSON.stringify(artifact.abi, null, 2);
  fs.writeFileSync(path.join(sharedDir, "abi.json"), abiJson);
  console.log("Updated shared/abi.json");

  // Also under backend/ so Render (rootDir=backend) always finds it
  const backendAbi = path.join(__dirname, "..", "..", "backend", "abi.json");
  fs.writeFileSync(backendAbi, abiJson);
  console.log("Updated backend/abi.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
