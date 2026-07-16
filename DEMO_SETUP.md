# Land Registry Demo — Setup & Run Guide

Free local demo: **Hardhat blockchain** + **IPFS** + **PostgreSQL** + **React UI**.

## Prerequisites (all free)

- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [MetaMask](https://metamask.io/) browser extension

## Quick start (4 terminals)

### Terminal 1 — Database & IPFS

```bash
cd proto
docker compose up
```

Wait until Postgres and IPFS are healthy (~30s for IPFS first boot).

### Terminal 2 — Blockchain

```bash
cd proto/contracts
npm install
npm run compile
npm run node
```

Leave running. Note: Hardhat prints test account private keys — use Account #0 in MetaMask for demos.

### Terminal 3 — Deploy contract & API

```bash
cd proto/contracts
npm run deploy:local

cd ../backend
cp .env.example .env
npm install
npm run db:generate
npm run db:push
npm run dev
```

### Seed demo parcels (after deploy + backend are up)

Hardhat resets wipe on-chain data whenever you restart `npm run node`. After every fresh deploy, seed sample parcels:

```bash
cd proto/demo-data
npm install
node seed-demo.mjs
```

This creates:

| Parcel ID | What you get |
|-----------|----------------|
| `LP-DEMO-001` | Docs + images; transferred to Account #1 (ownership history) |
| `LP-DEMO-002` | Owned by Account #0 — use for a live transfer demo |

### Terminal 4 — Frontend

```bash
cd proto/frontend
npm install
npm run dev
```

Open **http://localhost:5173**

- **Home** (`/`) — problem, US/Europe stats, how we solve it, Sign In
- **Sign In** — opens the demo workspace (`/dashboard`) with no password
- **Verify** — public; try `LP-DEMO-001` without connecting a wallet

---

## MetaMask setup (one time)

1. Add network:
   - **Network name:** Hardhat Local
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency:** ETH

2. Import Hardhat test account (from `npm run node` output):
   - Copy **Private Key** of Account #0
   - MetaMask → Import account

3. For transfer demo, import **Account #1** as second wallet.

---

## Demo flow (5 minutes)

1. **Home** → show problem stats + solution → **Sign In** (no login form)
2. **Dashboard** → Who can do what → open **LP-DEMO-001** (or seed first if missing)
3. **Verify** (no wallet) → owner, documents, ownership history
4. Optional live path: **Register** with MetaMask → confirm tx
5. **Transfer**: stay on owner wallet → paste other Hardhat account → confirm
6. Verify again → history updated

**Who can do what**

| Role | Action |
|------|--------|
| Anyone | Verify parcel by ID |
| Any connected wallet | Register land |
| Current on-chain owner | Transfer ownership |

---

## Architecture

```
React (5173) → Express API (3001) → PostgreSQL
                    ↓
                  IPFS (5001/8080)
                    
React + MetaMask → Hardhat (8545) → LandRegistry.sol
```

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | System status |
| GET | `/api/config` | Contract address + ABI |
| POST | `/api/land-parcels/prepare` | Upload files to IPFS |
| POST | `/api/land-parcels/confirm-registration` | Save after on-chain tx |
| GET | `/api/land-parcels?owner=0x...` | List parcels |
| GET | `/api/land-parcels/verify/:id` | Full verify + history |
| POST | `/api/land-parcels/confirm-transfer` | Save after transfer tx |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Contract not deployed | Run `npm run deploy:local` in `contracts/` |
| `LP-DEMO-001` not found | `cd demo-data && npm install && node seed-demo.mjs` after deploy |
| IPFS not connected | Wait 30s after `docker compose up` |
| Wrong network | MetaMask chain ID must be `31337` |
| Tx fails / empty chain | Restart `npm run node`, then `deploy:local`, then seed |
| MetaMask nonce error | MetaMask → Settings → Advanced → Clear activity tab data |

---

## Cost

**$0** — everything runs locally with open-source tools.

---

## For investor meetings

1. Run through demo flow above
2. Show `SYSTEM_DESIGN.md` for enterprise architecture
3. Mention PQC roadmap (`POST_QUANTUM_SECURITY.md`)
4. Screen share or record with Loom

---

## Project structure

```
proto/
├── contracts/     Smart contracts (Hardhat)
├── backend/       API + Prisma + IPFS
├── frontend/      React demo UI
├── shared/        deployment.json (auto-generated)
├── docker-compose.yml
└── docs/*.md      Architecture & business docs
```
