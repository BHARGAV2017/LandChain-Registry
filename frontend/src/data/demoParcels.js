/**
 * Static sample parcels for "Look only — no wallet".
 * Always used for LP-DEMO-001 / LP-DEMO-002 so stakeholders can preview Verify UI
 * without MetaMask, faucet, or DB seed. Real parcels still load from the live API.
 */

const SAMPLE_OWNER = "0x9D953bBe8A55A97660723893b480fA4269e69637";
const SAMPLE_BUYER = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

const DEMO = {
  "LP-DEMO-001": {
    isSample: true,
    parcelId: "LP-DEMO-001",
    ownerWallet: SAMPLE_BUYER,
    gpsLatitude: 28.6139,
    gpsLongitude: 77.209,
    gpsHash: "a232fd2c6cab47caf1b1f62380cd178e51f56f157fb61e3160a0e277565fdbf1",
    areaSquareMeters: 2450,
    address: "Survey No. 1247/2, Hauz Khas",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    metadataHash: "6f2fa06eb8ffe1f853df2d550cf63e2f27473fd110ad0eecad7834500cec35d2",
    metadataUrl: null,
    registrationTxHash: "0xsample001registration000000000000000000000000000000000000000001",
    imageUrls: [
      "/demo/images/land-aerial-LP-DEMO-001.svg",
      "/demo/images/land-boundary-LP-DEMO-001.svg",
      "/demo/images/property-photo-LP-DEMO-001.svg",
    ],
    documentUrls: [
      "/demo/documents/deed-of-sale-LP-DEMO-001.html",
      "/demo/documents/survey-report-LP-DEMO-001.html",
    ],
    onChain: {
      owner: SAMPLE_BUYER,
      gpsHash: "0xa232fd2c6cab47caf1b1f62380cd178e51f56f157fb61e3160a0e277565fdbf1",
      metadataHash: "0x6f2fa06eb8ffe1f853df2d550cf63e2f27473fd110ad0eecad7834500cec35d2",
      history: [
        {
          owner: SAMPLE_OWNER,
          timestamp: 1719504000,
          isActive: false,
        },
        {
          owner: SAMPLE_BUYER,
          timestamp: 1719590400,
          isActive: true,
        },
      ],
    },
  },
  "LP-DEMO-002": {
    isSample: true,
    parcelId: "LP-DEMO-002",
    ownerWallet: SAMPLE_OWNER,
    gpsLatitude: 28.4595,
    gpsLongitude: 77.0266,
    gpsHash: "b1c2d3e4f5060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20",
    areaSquareMeters: 10200,
    address: "Khasra 89/2, Village Sikandarpur",
    city: "Gurugram",
    state: "Haryana",
    country: "India",
    metadataHash: "c0ffee00c0ffee00c0ffee00c0ffee00c0ffee00c0ffee00c0ffee00c0ffee00",
    metadataUrl: null,
    registrationTxHash: "0xsample002registration000000000000000000000000000000000000000002",
    imageUrls: ["/demo/images/land-aerial-LP-DEMO-002.svg"],
    documentUrls: ["/demo/documents/deed-of-sale-LP-DEMO-002.html"],
    onChain: {
      owner: SAMPLE_OWNER,
      gpsHash: "0xb1c2d3e4f5060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20",
      metadataHash: "0xc0ffee00c0ffee00c0ffee00c0ffee00c0ffee00c0ffee00c0ffee00c0ffee00",
      history: [
        {
          owner: SAMPLE_OWNER,
          timestamp: 1719686800,
          isActive: true,
        },
      ],
    },
  },
};

export function getDemoParcel(parcelId) {
  if (!parcelId) return null;
  return DEMO[parcelId.trim().toUpperCase()] || null;
}

export function isDemoParcelId(parcelId) {
  return Boolean(getDemoParcel(parcelId));
}
