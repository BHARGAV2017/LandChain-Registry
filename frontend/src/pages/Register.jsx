import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MapPicker from "../components/MapPicker";
import { useWallet } from "../hooks/useWallet";
import * as api from "../services/api";
import * as blockchain from "../services/blockchain";

export default function Register() {
  const { address, connect, loading: walletLoading } = useWallet();
  const [position, setPosition] = useState([28.6139, 77.209]);
  const [form, setForm] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    area: "",
  });
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState(null);
  const [registered, setRegistered] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setRegistered(null);
    setSubmitting(true);

    try {
      if (!address) {
        await connect();
      }
      const owner = address || (await blockchain.connectWallet());

      const formData = new FormData();
      formData.append("gps_latitude", position[0]);
      formData.append("gps_longitude", position[1]);
      formData.append("address", form.address);
      formData.append("city", form.city);
      formData.append("state", form.state);
      formData.append("country", form.country);
      if (form.area) formData.append("area_square_meters", form.area);
      images.forEach((f) => formData.append("images", f));
      documents.forEach((f) => formData.append("documents", f));

      setStatus({ type: "info", text: "Uploading to IPFS..." });
      const prepared = await api.prepareRegistration(formData);
      const prep = prepared.data;

      setStatus({ type: "info", text: "Confirm transaction in MetaMask..." });
      const chainResult = await blockchain.registerOnChain({
        parcelId: prep.parcelId,
        gpsHash: prep.gpsHash,
        metadataHash: prep.metadataHash,
      });

      setStatus({ type: "info", text: "Saving record..." });
      await api.confirmRegistration({
        parcelId: prep.parcelId,
        parcelIdBytes32: chainResult.parcelIdBytes32,
        ownerWallet: owner,
        gps_latitude: position[0],
        gps_longitude: position[1],
        gpsHash: prep.gpsHash,
        metadataHash: prep.metadataHash,
        metadataIpfsCid: prep.metadataIpfsCid,
        imageCids: prep.imageCids,
        documentCids: prep.documentCids,
        area_square_meters: form.area || null,
        address: form.address,
        city: form.city,
        state: form.state,
        country: form.country,
        txHash: chainResult.txHash,
        blockNumber: chainResult.blockNumber,
      });

      setStatus({
        type: "success",
        text: `Registered ${prep.parcelId}! Tx: ${chainResult.txHash}`,
      });
      setRegistered({ parcelId: prep.parcelId, txHash: chainResult.txHash });
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2>Register Land Parcel</h2>
      <p className="meta">Click the map to set GPS coordinates. Upload images and documents.</p>

      {!address && (
        <div className="alert info">
          Connect wallet to register.{" "}
          <button onClick={connect} disabled={walletLoading}>Connect MetaMask</button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>GPS (click map)</label>
        <input
          readOnly
          value={`${position[0].toFixed(6)}, ${position[1].toFixed(6)}`}
        />

        <MapPicker position={position} onPositionChange={setPosition} />

        <div className="grid-2">
          <div>
            <label>Street address</label>
            <input name="address" value={form.address} onChange={handleChange} />
          </div>
          <div>
            <label>Area (sq m)</label>
            <input name="area" type="number" value={form.area} onChange={handleChange} />
          </div>
          <div>
            <label>City</label>
            <input name="city" value={form.city} onChange={handleChange} />
          </div>
          <div>
            <label>State</label>
            <input name="state" value={form.state} onChange={handleChange} />
          </div>
          <div>
            <label>Country</label>
            <input name="country" value={form.country} onChange={handleChange} />
          </div>
        </div>

        <label>Land images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages([...e.target.files])}
        />
        {images.length > 0 && (
          <p className="meta">Selected images: {images.map((f) => f.name).join(", ")}</p>
        )}

        <label>Documents (PDF, etc.)</label>
        <input
          type="file"
          multiple
          onChange={(e) => setDocuments([...e.target.files])}
        />
        {documents.length > 0 && (
          <p className="meta">Selected documents: {documents.map((f) => f.name).join(", ")}</p>
        )}

        {status && <div className={`alert ${status.type}`}>{status.text}</div>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Registering..." : "Register on Blockchain"}
        </button>
      </form>

      {registered && (
        <div className="alert success" style={{ marginTop: "1.25rem" }}>
          <h3 style={{ margin: "0 0 0.5rem" }}>Registration complete</h3>
          <div className="meta">
            Parcel: <strong>{registered.parcelId}</strong>
          </div>
          <div className="meta" style={{ marginTop: "0.25rem" }}>
            Tx: {registered.txHash}
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
            <Link to={`/verify/${registered.parcelId}`} className="btn secondary">
              View & transfer
            </Link>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setRegistered(null);
                navigate("/register");
              }}
            >
              Register another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
