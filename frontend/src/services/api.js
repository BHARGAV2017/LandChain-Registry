const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export async function getHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function getConfig() {
  const res = await fetch(`${API_BASE}/api/config`);
  if (!res.ok) throw new Error((await res.json()).message || "Config unavailable");
  return res.json();
}

export async function prepareRegistration(formData) {
  const res = await fetch(`${API_BASE}/api/land-parcels/prepare`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Prepare failed");
  return data;
}

export async function confirmRegistration(payload) {
  const res = await fetch(`${API_BASE}/api/land-parcels/confirm-registration`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Confirm failed");
  return data;
}

export async function getParcels(owner) {
  const url = owner
    ? `${API_BASE}/api/land-parcels?owner=${owner}`
    : `${API_BASE}/api/land-parcels`;
  const res = await fetch(url);
  return res.json();
}

export async function verifyParcel(parcelId) {
  const res = await fetch(`${API_BASE}/api/land-parcels/verify/${parcelId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Verify failed");
  return data;
}

export async function confirmTransfer(payload) {
  const res = await fetch(`${API_BASE}/api/land-parcels/confirm-transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Transfer confirm failed");
  return data;
}
