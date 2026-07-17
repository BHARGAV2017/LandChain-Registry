# Project Structure — What Each File/Module Does

```
proto/
├── contracts/          ← Blockchain (smart contracts)
├── backend/            ← API server + database
├── frontend/           ← Web UI (React)
├── shared/             ← Contract address + ABI (auto-generated)
├── demo-data/          ← Sample docs/images for testing
├── docker-compose.yml  ← Postgres + IPFS containers
└── *.md                ← Client docs at root
```

Internal learning notes (`learning-docs/`) stay on the maintainer machine only and are gitignored.
---

## How the System Fits Together

```
User (Browser + MetaMask)
        │
        ▼
   frontend/  ──────►  backend/  ──────►  PostgreSQL (docker)
        │                  │
        │                  └──────────►  IPFS (docker)
        │
        └────────────────────────────►  Hardhat blockchain
                                              │
                                        contracts/LandRegistry.sol
```

| Layer | Folder | Port (local) |
|-------|--------|----------------|
| UI | `frontend/` | 5173 |
| API | `backend/` | 3001 |
| Database | Docker Postgres | 5433 |
| Files | Docker IPFS | 5001 / 8080 |
| Chain | Hardhat node | 8545 |

---

## Root Files

| File | Purpose |
|------|---------|
| `README.md` | Project intro + links to all docs |
| `SYSTEM_DESIGN.md` | Full architecture (for clients/partners) |
| `DEMO_SETUP.md` | How to run the demo locally |
| `MARKET_EVIDENCE.md` | Global problems + cited sources for pitches |
| `PROJECT_STRUCTURE.md` | This file — directory/module map |
| `docker-compose.yml` | Starts **PostgreSQL** + **IPFS** in Docker |
| `.gitignore` | Ignores `node_modules`, `.env`, `shared/deployment.json` |

---

## `contracts/` — Blockchain Layer

| File | What it does |
|------|----------------|
| `contracts/LandRegistry.sol` | **Smart contract** — register land, transfer ownership, read history |
| `hardhat.config.js` | Hardhat settings (Solidity version, local network on port 8545) |
| `scripts/deploy.js` | Deploys contract → writes `shared/deployment.json` |
| `package.json` | Scripts: `compile`, `node`, `deploy:local` |
| `artifacts/` | Compiled contract + ABI (generated; used by backend/frontend) |

**Run:** `npm run node` → local blockchain  
**Deploy:** `npm run deploy:local` → saves contract address to `shared/`

---

## `shared/` — Bridge Between Contract and Apps

| File | What it does |
|------|----------------|
| `deployment.json` | Contract **address**, **ABI**, chain ID (created by `deploy.js`) |

Backend reads this for `/api/config`. Frontend gets contract info from the API.

---

## `backend/` — API + Database + IPFS

| File | What it does |
|------|----------------|
| `src/index.js` | **Main server** — Express app, CORS, routes, `/health` |
| `src/routes/landParcels.routes.js` | **API endpoints** — prepare upload, confirm registration, verify, transfer |
| `src/services/ipfs.service.js` | Upload files to **IPFS**, health check |
| `src/services/blockchain.service.js` | Read on-chain data (owner, history) via ethers.js |
| `src/utils/hash.js` | GPS hash, metadata hash, parcel ID helpers |
| `prisma/schema.prisma` | **Database schema** — `LandParcel`, `TransferRecord` tables |
| `.env` | DB URL, IPFS URL, blockchain RPC (secrets/config) |
| `package.json` | Scripts: `dev`, `db:push`, `db:generate` |

**API flow:**

1. `POST /prepare` → upload files to IPFS, return hashes + parcel ID
2. User signs on blockchain (frontend)
3. `POST /confirm-registration` → save to PostgreSQL
4. `GET /verify/:parcelId` → DB + IPFS + on-chain data

---

## `frontend/` — Web Application (React)

| File | What it does |
|------|----------------|
| `index.html` | HTML shell |
| `vite.config.js` | Dev server + proxy `/api` → backend |
| `src/main.jsx` | App entry point |
| `src/App.jsx` | Layout, navbar, routing |
| `src/pages/Home.jsx` | Public landing — problem stats, solution, Sign In CTA |
| `src/pages/Dashboard.jsx` | Demo workspace — roles, quick actions, my parcels |
| `src/pages/Register.jsx` | Map + form + file upload → register on chain |
| `src/pages/Verify.jsx` | Search parcel, view history, transfer ownership |
| `src/components/MapPicker.jsx` | Leaflet map — click to set GPS |
| `src/hooks/useWallet.js` | Shared wallet context (MetaMask) |
| `src/services/api.js` | HTTP calls to backend |
| `src/services/blockchain.js` | MetaMask + smart contract calls (register, transfer) |
| `src/index.css` | Styles |

**User journey:** Home → Sign In → Dashboard → Register / Verify → Transfer

---

## `demo-data/` — Demo Materials

| Path | What it does |
|------|----------------|
| `documents/*.html` | Sample deeds, surveys, transfer agreements |
| `images/*.svg` | Sample land photos / aerial / boundary plots |
| `DEMO_SCRIPT.md` | 5-minute presentation script |
| `README.md` | How to use demo files |
| `seed-demo.mjs` | Optional script to auto-load demo parcels |

---

## Data Flow (Register Land)

```
1. Register.jsx
   └─► api.prepareRegistration()     → backend uploads to IPFS
   └─► blockchain.registerOnChain() → MetaMask signs → LandRegistry.sol
   └─► api.confirmRegistration()     → backend saves to PostgreSQL

2. Verify.jsx
   └─► api.verifyParcel()            → backend merges DB + IPFS + chain
```

---

## What Runs Where (Terminals)

| Terminal | Command | Folder |
|----------|---------|--------|
| 1 | `docker compose up` | `proto/` |
| 2 | `npm run node` | `contracts/` |
| 3 | `npm run deploy:local` (once) + `npm run dev` | `contracts/` then `backend/` |
| 4 | `npm run dev` | `frontend/` |

---

## Quick Reference — If You Want to Change X, Edit Y

| Want to change… | Edit… |
|-----------------|--------|
| Ownership rules on chain | `contracts/LandRegistry.sol` |
| API endpoints | `backend/src/routes/landParcels.routes.js` |
| Database fields | `backend/prisma/schema.prisma` → `npm run db:push` |
| IPFS upload logic | `backend/src/services/ipfs.service.js` |
| Register UI / map | `frontend/src/pages/Register.jsx` |
| Verify / transfer UI | `frontend/src/pages/Verify.jsx` |
| Wallet / MetaMask | `frontend/src/services/blockchain.js` |
| Contract address after redeploy | Re-run `npm run deploy:local` in `contracts/` |

---

**In one sentence:** `frontend` is the UI, `backend` is the API + DB + IPFS, `contracts` is the blockchain logic, `docker-compose` runs Postgres and IPFS, and `shared/deployment.json` links them all to the deployed contract.
