import { BrowserProvider, Contract, id, zeroPadValue, toBeHex } from "ethers";

let provider = null;
let signer = null;
let contract = null;
let config = null;

function hashToBytes32(hexHash) {
  const hex = hexHash.startsWith("0x") ? hexHash.slice(2) : hexHash;
  return zeroPadValue(`0x${hex.slice(0, 64)}`, 32);
}

export async function loadConfig(fetchConfig) {
  const res = await fetchConfig();
  config = res.data;
  return config;
}

async function ensureNetwork() {
  provider = new BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();

  if (config && Number(network.chainId) !== Number(config.chainId)) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toBeHex(Number(config.chainId)) }],
      });
    } catch (err) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: toBeHex(Number(config.chainId)),
              chainName: config.chainName || `Chain ${config.chainId}`,
              rpcUrls: [config.rpcUrl],
              nativeCurrency: {
                name: config.currencySymbol || "ETH",
                symbol: config.currencySymbol || "ETH",
                decimals: 18,
              },
              blockExplorerUrls: config.blockExplorerUrl
                ? [config.blockExplorerUrl]
                : undefined,
            },
          ],
        });
      } else {
        throw new Error(`Wrong network. Switch MetaMask to chain ID ${config.chainId}`);
      }
    }
    provider = new BrowserProvider(window.ethereum);
  }
}

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed. Install MetaMask browser extension.");
  }

  await ensureNetwork();
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  contract = new Contract(config.contractAddress, config.abi, signer);
  const address = await signer.getAddress();
  return address;
}

/** Rebind signer/contract after MetaMask account switch (no popup if already connected). */
export async function syncWallet(address) {
  if (!window.ethereum || !config) return null;
  if (!address) {
    signer = null;
    contract = null;
    return null;
  }
  await ensureNetwork();
  signer = await provider.getSigner(address);
  contract = new Contract(config.contractAddress, config.abi, signer);
  return address;
}

export function getSignerAddress() {
  return signer?.getAddress();
}

export function isConnected() {
  return !!signer;
}

export async function registerOnChain({ parcelId, gpsHash, metadataHash }) {
  if (!contract) throw new Error("Wallet not connected");
  const parcelIdBytes32 = id(parcelId);
  const tx = await contract.registerLand(
    parcelIdBytes32,
    hashToBytes32(gpsHash),
    hashToBytes32(metadataHash)
  );
  const receipt = await tx.wait();
  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    parcelIdBytes32,
  };
}

export async function transferOnChain({ parcelId, newOwner, transferHash }) {
  if (!contract) throw new Error("Wallet not connected");
  const parcelIdBytes32 = id(parcelId);
  const tx = await contract.transferOwnership(
    parcelIdBytes32,
    newOwner,
    transferHash ? hashToBytes32(transferHash) : zeroPadValue("0x00", 32)
  );
  const receipt = await tx.wait();
  return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
}

export async function getOnChainOwner(parcelId) {
  if (!contract) throw new Error("Wallet not connected");
  const parcelIdBytes32 = id(parcelId);
  return contract.getCurrentOwner(parcelIdBytes32);
}

export function getExpectedChainId() {
  return config ? Number(config.chainId) : null;
}

export async function getCurrentChainId() {
  if (!window.ethereum) return null;
  const p = new BrowserProvider(window.ethereum);
  const network = await p.getNetwork();
  return Number(network.chainId);
}
