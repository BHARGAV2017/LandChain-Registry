import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";
import { getDemoParcel } from "../data/demoParcels";
import * as api from "../services/api";
import * as blockchain from "../services/blockchain";

function shortAddr(addr) {
  if (!addr) return "—";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function CopyButton({ value, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  return (
    <button
      type="button"
      className="copy-btn"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // ignore
        }
      }}
    >
      {copied ? "Copied" : label}
    </button>
  );
}

export default function Verify() {
  const { parcelId: routeParcelId } = useParams();
  const navigate = useNavigate();
  const { address, connect } = useWallet();
  const [searchId, setSearchId] = useState(routeParcelId || "");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newOwner, setNewOwner] = useState("");
  const [transferStatus, setTransferStatus] = useState(null);
  const [transferring, setTransferring] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const loadParcel = async (id) => {
    if (!id) return;
    const trimmed = id.trim();
    setLoading(true);
    setError(null);
    setShowAdvanced(false);

    // Sample IDs: render static preview immediately (no wallet / no faucet)
    const sample = getDemoParcel(trimmed);
    if (sample) {
      setData(sample);
      setError(null);
      navigate(`/verify/${sample.parcelId}`, { replace: true });
      setLoading(false);
      return;
    }

    try {
      const res = await api.verifyParcel(trimmed);
      setData({ ...res.data, isSample: false });
      navigate(`/verify/${trimmed}`, { replace: true });
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routeParcelId) {
      setSearchId(routeParcelId);
      loadParcel(routeParcelId);
    }
  }, [routeParcelId]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadParcel(searchId.trim());
  };

  const handleTransfer = async () => {
    if (!data || !newOwner || data.isSample) return;
    setTransferring(true);
    setTransferStatus(null);
    try {
      if (!address) await connect();
      const fromWallet = address || (await blockchain.connectWallet());

      const onChainOwner = await blockchain.getOnChainOwner(data.parcelId);
      if (onChainOwner.toLowerCase() !== fromWallet.toLowerCase()) {
        throw new Error("Connected wallet is not the on-chain owner");
      }

      setTransferStatus({ type: "info", text: "Confirm transfer in MetaMask..." });
      const result = await blockchain.transferOnChain({
        parcelId: data.parcelId,
        newOwner,
        transferHash: data.metadataHash,
      });

      await api.confirmTransfer({
        parcelId: data.parcelId,
        fromWallet,
        toWallet: newOwner,
        txHash: result.txHash,
        transferHash: data.metadataHash,
      });

      setTransferStatus({ type: "success", text: `Transferred! Tx: ${result.txHash}` });
      await loadParcel(data.parcelId);
    } catch (err) {
      setTransferStatus({ type: "error", text: err.message });
    } finally {
      setTransferring(false);
    }
  };

  const connectedWallet = address ? address.toLowerCase() : null;
  const registeredOwnerWallet = data?.ownerWallet ? data.ownerWallet.toLowerCase() : null;
  const verifiedOwnerWallet = data?.onChain?.owner ? data.onChain.owner.toLowerCase() : null;
  const canTransfer =
    !data?.isSample &&
    !!(connectedWallet && verifiedOwnerWallet && connectedWallet === verifiedOwnerWallet);
  const ownersMatch =
    registeredOwnerWallet &&
    verifiedOwnerWallet &&
    registeredOwnerWallet === verifiedOwnerWallet;
  const locationLabel = [data?.address, data?.city, data?.state, data?.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      <div className="card">
        <h2>Verify ownership</h2>
        <p className="meta">
          Anyone can verify (no wallet). Sample IDs always work: <code>LP-DEMO-001</code>,{" "}
          <code>LP-DEMO-002</code>. To register or transfer, use Sign In + MetaMask.
        </p>
        <form onSubmit={handleSearch} className="verify-search">
          <input
            placeholder="Parcel ID e.g. LP-DEMO-001"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </button>
        </form>
        {error && <div className="alert error" style={{ marginTop: "1rem" }}>{error}</div>}
      </div>

      {data && (
        <>
          {data.isSample && (
            <div className="alert info" style={{ marginBottom: "1rem" }}>
              Sample preview — no wallet needed. Looks like a live verify page. Real register /
              transfer: Sign In + MetaMask.
            </div>
          )}
          <div className="card certificate">
            <div className="certificate-header">
              <div>
                <p className="certificate-eyebrow">Land ownership record</p>
                <h2 className="certificate-id">
                  {data.parcelId}
                  <CopyButton value={data.parcelId} label="Copy ID" />
                </h2>
                {locationLabel && <p className="certificate-location">{locationLabel}</p>}
              </div>
              <div
                className={`certificate-badge ${
                  data.isSample ? "warn" : ownersMatch ? "ok" : "warn"
                }`}
              >
                {data.isSample
                  ? "Sample preview"
                  : data.onChain?.owner
                    ? "Verified on blockchain"
                    : "Record found"}
              </div>
            </div>

            <div className="certificate-grid">
              <div className="certificate-field">
                <strong>Verified owner</strong>
                <span title={verifiedOwnerWallet || ""}>{shortAddr(verifiedOwnerWallet)}</span>
                <CopyButton value={verifiedOwnerWallet} />
              </div>
              <div className="certificate-field">
                <strong>Registered owner</strong>
                <span title={registeredOwnerWallet || ""}>{shortAddr(registeredOwnerWallet)}</span>
              </div>
              <div className="certificate-field">
                <strong>Location (GPS)</strong>
                <span>
                  {data.gpsLatitude}, {data.gpsLongitude}
                </span>
              </div>
              <div className="certificate-field">
                <strong>Area</strong>
                <span>
                  {data.areaSquareMeters
                    ? `${data.areaSquareMeters.toLocaleString()} sq m`
                    : "—"}
                </span>
              </div>
            </div>

            {(data.imageUrls?.length > 0 || data.documentUrls?.length > 0) && (
              <div className="certificate-media">
                <h3>Attached evidence</h3>
                {data.imageUrls?.length > 0 && (
                  <div className="media-grid">
                    {data.imageUrls.map((u, i) => (
                      <a key={i} href={u} target="_blank" rel="noreferrer">
                        <img className="thumb-img" src={u} alt={`Land image ${i + 1}`} />
                      </a>
                    ))}
                  </div>
                )}
                {data.documentUrls?.length > 0 && (
                  <div className="document-list" style={{ marginTop: "0.75rem" }}>
                    {data.documentUrls.map((u, i) => (
                      <a key={i} href={u} target="_blank" rel="noreferrer" className="doc-chip">
                        Document {i + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="advanced-block">
              <button
                type="button"
                className="dev-status-toggle"
                onClick={() => setShowAdvanced((v) => !v)}
              >
                Advanced details {showAdvanced ? "▾" : "▸"}
              </button>
              {showAdvanced && (
                <div className="advanced-body meta">
                  <p>
                    <strong>Registration tx:</strong> {data.registrationTxHash || "—"}
                    <CopyButton value={data.registrationTxHash} />
                  </p>
                  <p>
                    <strong>Metadata (IPFS):</strong>{" "}
                    {data.metadataUrl ? (
                      <a href={data.metadataUrl} target="_blank" rel="noreferrer">
                        Open
                      </a>
                    ) : (
                      "—"
                    )}
                  </p>
                  <p>
                    <strong>GPS hash:</strong> {data.gpsHash || "—"}
                  </p>
                  <p>
                    <strong>Metadata hash:</strong> {data.metadataHash || "—"}
                  </p>
                  <p>
                    <strong>Full registered owner:</strong> {registeredOwnerWallet || "—"}
                  </p>
                  <p>
                    <strong>Full verified owner:</strong> {verifiedOwnerWallet || "—"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h2>Ownership timeline</h2>
            {data.onChain?.history?.length ? (
              <ol className="timeline">
                {[...data.onChain.history].reverse().map((h, i) => (
                  <li key={i} className={`timeline-item ${h.isActive ? "active" : ""}`}>
                    <div className="timeline-dot" />
                    <div>
                      <strong>{h.isActive ? "Current owner" : "Previous owner"}</strong>
                      <p className="meta" title={h.owner}>
                        {shortAddr(h.owner)}
                      </p>
                      <p className="meta">{new Date(h.timestamp * 1000).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p>No on-chain history found.</p>
            )}
          </div>

          <div className="card">
            <h2>Transfer ownership</h2>
            {data.isSample ? (
              <p className="meta">
                Transfer is disabled on sample parcels. Sign In and register a real parcel to try
                transfer on Polygon Amoy.
              </p>
            ) : (
              <>
                <p className="meta">
                  {!address
                    ? "Verify is public — no wallet needed. To transfer, click Connect Wallet in the top bar using the verified owner account."
                    : canTransfer
                      ? "You are the verified owner. Enter the new owner address and confirm in MetaMask."
                      : "Connected wallet is not the verified owner. Switch the account in MetaMask to the owner, then try again."}
                </p>
                <label>New owner wallet address</label>
                <input
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  placeholder="0x..."
                  disabled={!canTransfer}
                />
                {transferStatus && (
                  <div className={`alert ${transferStatus.type}`}>{transferStatus.text}</div>
                )}
                <button
                  onClick={handleTransfer}
                  disabled={transferring || !newOwner || !canTransfer}
                >
                  {transferring ? "Transferring..." : "Transfer on Blockchain"}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
