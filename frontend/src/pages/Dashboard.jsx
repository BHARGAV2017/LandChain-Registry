import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";
import * as api from "../services/api";

export default function Dashboard() {
  const { address, connect, loading, error } = useWallet();
  const [health, setHealth] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [showDevStatus, setShowDevStatus] = useState(false);

  useEffect(() => {
    localStorage.setItem("demoEntered", "true");
    api.getHealth().then(setHealth).catch(() => {});
  }, []);

  useEffect(() => {
    if (!address) return;
    api
      .getParcels(address)
      .then((res) => setParcels(res.data || []))
      .catch((err) => setLoadError(err.message));
  }, [address]);

  return (
    <div>
      <div className="card">
        <h2>Demo workspace</h2>
        <p>
          You are in the working demo — register land, verify ownership, and transfer with a full
          audit trail. No separate login is required.
        </p>
        {!address ? (
          <button onClick={connect} disabled={loading}>
            {loading ? "Connecting..." : "Connect MetaMask"}
          </button>
        ) : (
          <p className="meta">
            Connected: <strong>{address}</strong>
          </p>
        )}
        {error && <div className="alert error">{error}</div>}
      </div>

      <div className="card">
        <h2>Who can do what</h2>
        <div className="status-grid">
          <div className="status-item">
            <strong>Verifier</strong>
            Search any parcel ID. View owner, documents, GPS, and history. No wallet required.
          </div>
          <div className="status-item">
            <strong>Owner</strong>
            Connect the wallet that owns the parcel to transfer ownership on-chain.
          </div>
          <div className="status-item">
            <strong>Registrant</strong>
            Connect any wallet, then Register land with map + documents.
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Quick actions</h2>
        <p className="meta" style={{ marginBottom: "1rem" }}>
          Seeded demo IDs (after running the seed script):{" "}
          <Link to="/verify/LP-DEMO-001">LP-DEMO-001</Link>
          {" · "}
          <Link to="/verify/LP-DEMO-002">LP-DEMO-002</Link>
        </p>
        <p>
          <Link to="/register" className="btn" style={{ display: "inline-block", marginRight: "0.5rem" }}>
            Register Land
          </Link>
          <Link
            to="/verify/LP-DEMO-001"
            className="btn secondary"
            style={{ display: "inline-block", marginRight: "0.5rem" }}
          >
            Verify LP-DEMO-001
          </Link>
          <Link to="/verify" className="btn secondary" style={{ display: "inline-block" }}>
            Search parcels
          </Link>
        </p>
      </div>

      {address && (
        <div className="card">
          <h2>My Parcels</h2>
          {loadError && <div className="alert error">{loadError}</div>}
          {parcels.length === 0 ? (
            <p>
              No parcels for this wallet yet. Try{" "}
              <Link to="/verify/LP-DEMO-001">LP-DEMO-001</Link> or{" "}
              <Link to="/register">register a new parcel</Link>.
            </p>
          ) : (
            <ul className="parcel-list">
              {parcels.map((p) => (
                <li key={p.id} className="parcel-item">
                  <h3>
                    {p.parcelId} <span className="badge">{p.city || "No city"}</span>
                  </h3>
                  <p className="meta">
                    GPS: {p.gpsLatitude}, {p.gpsLongitude}
                  </p>
                  <p className="meta">Registration proof: {p.registrationTxHash}</p>
                  <p>
                    <Link to={`/verify/${p.parcelId}`}>View & transfer</Link>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {health && (
        <div className="card">
          <h2>
            <button
              type="button"
              className="dev-status-toggle"
              onClick={() => setShowDevStatus((v) => !v)}
            >
              Developer status {showDevStatus ? "▾" : "▸"}
            </button>
          </h2>
          {showDevStatus && (
            <div className="status-grid">
              <div className="status-item">
                <strong>API</strong>
                {health.status === "ok" ? "Online" : "Offline"}
              </div>
              <div className="status-item">
                <strong>IPFS</strong>
                {health.ipfs ? "Connected" : "Not connected"}
              </div>
              <div className="status-item">
                <strong>Blockchain</strong>
                {health.blockchain?.connected
                  ? `Chain ${health.blockchain.chainId}`
                  : "Offline"}
              </div>
              <div className="status-item">
                <strong>Contract</strong>
                <span className="meta">
                  {health.blockchain?.contractAddress || "Not deployed"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
