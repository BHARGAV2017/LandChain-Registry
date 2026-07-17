# 5-Minute Demo Script

Use this when presenting to investors, government partners, or PropTech companies.

---

## Before the meeting

- [ ] All 4 terminals running (Docker, Hardhat, backend, frontend)
- [ ] Run `node demo-data/seed-demo.mjs` OR prepare manual uploads
- [ ] MetaMask on Hardhat Local (31337), Account #0 imported
- [ ] Dashboard shows: API ✓ IPFS ✓ Blockchain ✓

---

## Minute 1 — The problem

Open **Home** (`http://localhost:5173`):

> "Land records are fragmented — paper deeds can be forged, ownership history is hard to verify, and transfers take weeks. Here are documented figures from the US and Europe…"

Point to the stats, then **How we solve it**, then click **Sign In** (no password — opens the demo workspace).

---

## Minute 2 — Who can do what

On **Dashboard**, show the roles card:

- Verifier — no wallet
- Owner — transfer
- Registrant — register

Optionally expand **Developer status** if they ask about infrastructure.

---

## Minute 3 — Verify existing parcel

Go to **Verify** → enter `LP-DEMO-001`

Point out:

1. **Parcel ID** and GPS coordinates
2. **Documents / images** on IPFS
3. **Registered vs verified owner**
4. **Ownership history** — transfer already seeded to Account #1

> "Anyone can verify this without calling a government office."

---

## Minute 4 — Live registration (optional if seeded)

Go to **Register**:

1. Click map (Delhi area)
2. Upload `land-aerial-LP-DEMO-002.svg` + `deed-of-sale-LP-DEMO-002.html`
3. MetaMask signs → transaction confirmed

Or skip and say: "LP-DEMO-002 is already registered for a live transfer."

---

## Minute 5 — Transfer & roadmap

1. Open **LP-DEMO-002** (owned by Account #0)
2. MetaMask on Account #0
3. Transfer to Account #1 address
4. Verify history updated

**Close with roadmap:**

> "This demo runs locally at zero cost. Production adds Polygon mainnet, government integration, and **post-quantum signatures** for 50-year record security."

Hand them: `demo-data/documents/deed-of-sale-LP-DEMO-001.html` + architecture doc.

---

## Q&A cheat sheet

| Question | Answer |
|----------|--------|
| Is this legally binding? | Demo on test chain; production needs jurisdiction + registrar partnership |
| Cost? | ~$0.10–$2 per tx on Polygon vs thousands in legal fees |
| Quantum safe? | Roadmap: post-quantum signatures (e.g. Dilithium) for long-lived titles |
| Why blockchain? | Immutable audit trail; no single point of tampering |
| Data privacy? | Docs on IPFS; only hashes on chain |
