# Demo Data — Land Registry

Realistic sample documents and images for investor / partner demos.

## Contents

```
demo-data/
├── documents/          # HTML deeds & surveys (open in browser or upload)
├── images/             # SVG land photos & survey plots
├── seed-demo.mjs       # Auto-load 2 parcels + 1 transfer
└── DEMO_SCRIPT.md      # 5-minute presentation script
```

---

## Option A — Automatic seed (fastest)

**Requires:** Docker, Hardhat node, backend, contract deployed (`npm run deploy:local`).

```bash
cd proto/demo-data
npm install
node seed-demo.mjs
```

**Important:** Re-run seed after every Hardhat restart + redeploy (local chain state resets).

**Creates:**

| Parcel ID | Location | Owner after seed |
|-----------|----------|------------------|
| `LP-DEMO-001` | Hauz Khas, New Delhi | Account #1 (transferred) |
| `LP-DEMO-002` | Gurugram, Haryana | Account #0 |

---

## Option B — Manual upload (live demo)

1. Open **Register Land** in the app
2. Click map near coordinates below
3. Upload files from `demo-data/images/` and `demo-data/documents/`

### Parcel 1 — Residential (Delhi)

| Field | Value |
|-------|-------|
| GPS | 28.613900, 77.209000 |
| Area | 2450 sq m |
| Address | Survey No. 1247/2, Hauz Khas |
| City | New Delhi |
| Images | `land-aerial-LP-DEMO-001.svg`, `property-photo-LP-DEMO-001.svg` |
| Documents | `deed-of-sale-LP-DEMO-001.html`, `survey-report-LP-DEMO-001.html` |

### Parcel 2 — Agricultural (Gurugram)

| Field | Value |
|-------|-------|
| GPS | 28.459500, 77.026600 |
| Area | 10200 sq m |
| Address | Khasra 89/2, Village Sikandarpur |
| City | Gurugram |
| Images | `land-aerial-LP-DEMO-002.svg` |
| Documents | `deed-of-sale-LP-DEMO-002.html` |

### Transfer demo

Use `transfer-agreement-LP-DEMO-001.html` as the transfer document reference.

Transfer to Hardhat **Account #1**:
`0x70997970C51812dc3A010C7d01b50e0d17dc79C8`

---

## Hardhat test accounts (local only)

| Account | Address | Use |
|---------|---------|-----|
| #0 | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | First owner / seller |
| #1 | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | Buyer / transferee |
| #2 | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | Third party verifier |

Import private keys from Hardhat node terminal output into MetaMask.

---

## Viewing HTML documents

Double-click any file in `documents/` to open in browser.  
You can also upload them directly when registering land.

## Converting to PDF (optional)

Open HTML in Chrome → Print → Save as PDF — for more formal-looking files.
