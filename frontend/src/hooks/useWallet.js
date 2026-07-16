import { createContext, useContext, useState, useEffect, useCallback, createElement } from "react";
import * as api from "../services/api";
import * as blockchain from "../services/blockchain";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [expectedChainId, setExpectedChainId] = useState(null);
  const [networkOk, setNetworkOk] = useState(true);

  const refreshNetwork = useCallback(async () => {
    const expected = blockchain.getExpectedChainId();
    const current = await blockchain.getCurrentChainId();
    setExpectedChainId(expected);
    setChainId(current);
    setNetworkOk(
      expected != null && current != null
        ? Number(current) === Number(expected)
        : true
    );
  }, []);

  useEffect(() => {
    api
      .getConfig()
      .then(async (res) => {
        await blockchain.loadConfig(() => Promise.resolve(res));
        await refreshNetwork();

        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts?.length) {
            try {
              const addr = await blockchain.connectWallet();
              setAddress(addr);
              await refreshNetwork();
            } catch {
              // Ignore auto-reconnect errors; user can connect manually
            }
          }
        }
      })
      .catch(() => {});
  }, [refreshNetwork]);

  const connect = async () => {
    setLoading(true);
    setError(null);
    try {
      const configRes = await api.getConfig();
      await blockchain.loadConfig(() => Promise.resolve(configRes));
      const addr = await blockchain.connectWallet();
      setAddress(addr);
      await refreshNetwork();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const onAccountsChanged = async (accounts) => {
      const next = accounts?.[0] || null;
      setAddress(next);
      try {
        await blockchain.syncWallet(next);
      } catch {
        // User can reconnect manually if sync fails
      }
    };

    const onChainChanged = async () => {
      await refreshNetwork();
    };

    window.ethereum.on?.("accountsChanged", onAccountsChanged);
    window.ethereum.on?.("chainChanged", onChainChanged);
    return () => {
      window.ethereum.removeListener?.("accountsChanged", onAccountsChanged);
      window.ethereum.removeListener?.("chainChanged", onChainChanged);
    };
  }, [refreshNetwork]);

  const value = { address, error, loading, connect, chainId, expectedChainId, networkOk };

  return createElement(WalletContext.Provider, { value }, children);
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return ctx;
}
