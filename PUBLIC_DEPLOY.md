# Public Free Deploy — Netlify + Render + Neon + Pinata + Polygon Amoy

**Goal:** Anyone on the internet can open your site, connect **their own MetaMask**, upload docs, register, and verify — at **$0**.

**Backup branch (revert if needed):** `backup/pre-public-deploy`

```bash
git checkout backup/pre-public-deploy
```

---

## Free / credit card (reminder)

| Service | Free? | Card usually required? |
|---------|-------|-------------------------|
| Netlify | Yes | No (Free plan hard limit) |
| Render | Yes (free web service) | No — but sleeps after idle |
| Neon | Yes | No |
| Pinata | Yes ($0 plan) | Usually no — stop if asked for card |
| Polygon Amoy | Yes (test POL) | No |

Do **not** add a payment method if you want zero chance of billing.

---

## Architecture

```
Browser → Netlify (React)
              ↓ VITE_API_URL
         Render (Express API)
              ├→ Neon Postgres
              ├→ Pinata IPFS
              └→ Polygon Amoy RPC + your contract
```

---

## Step 0 — Push this code to GitHub

```bash
cd "/Users/bhargav/Documents/archive/untitled folder/proto"
git add .
git status
git commit -m "Prepare free public deploy (Netlify, Render, Neon, Pinata, Amoy)"
git push origin main
```

Use personal remote: `git@github-personal:BHARGAV2017/LandChain-Registry.git`

---

## Step 1 — Neon (Postgres)

1. Sign up: https://console.neon.tech/signup (GitHub OK)
2. Create project → copy **connection string** (`DATABASE_URL`, include `?sslmode=require`)
3. Keep it secret — paste into Render later

---

## Step 2 — Pinata (IPFS)

1. Sign up: https://app.pinata.cloud  
   If it asks for a credit card on the free plan, **cancel** and tell me — we’ll switch storage.
2. API Keys → New Key → enable pinFileToIPFS / Admin as needed → copy **JWT**
3. Optional: use default gateway `https://gateway.pinata.cloud` or your dedicated gateway URL

---

## Step 3 — MetaMask + Amoy + test POL

1. MetaMask → Add network **Polygon Amoy**:
   - RPC: `https://rpc-amoy.polygon.technology`
   - Chain ID: `80002`
   - Symbol: `POL`
   - Explorer: `https://amoy.polygonscan.com`
2. Copy your wallet address
3. Get free test POL (no payment):
   - https://www.alchemy.com/faucets/polygon-amoy  
   - or https://faucet.quicknode.com/polygon/amoy  
   - see https://docs.polygon.technology/tools/gas/matic-faucet/
4. In MetaMask → Account details → export **Private Key** for this wallet  
   (deployer only — never commit it; never use a mainnet-funded wallet)

---

## Step 4 — Deploy contract to Amoy

```bash
cd contracts
cp .env.example .env
# Edit .env:
#   DEPLOYER_PRIVATE_KEY=0xYOUR_KEY
#   AMOY_RPC_URL=https://rpc-amoy.polygon.technology

npm install
npm run compile
npm run deploy:amoy
```

Copy the printed **contract address** (e.g. `0xabc...`).

`shared/abi.json` is updated automatically. Commit it:

```bash
cd ..
git add shared/abi.json
git commit -m "Add LandRegistry ABI for Amoy cloud deploy"
git push origin main
```

(`shared/deployment.json` stays local/gitignored — cloud uses `CONTRACT_ADDRESS` env.)

---

## Step 5 — Render (API)

1. https://dashboard.render.com → sign up with GitHub (**personal** account)
2. **New → Web Service** → select `BHARGAV2017/LandChain-Registry`
3. Settings:
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install && npx prisma generate`
   - **Start Command:** `npx prisma db push && npm start`
   - **Instance:** **Free**
4. Environment variables:

| Key | Value |
|-----|--------|
| `DATABASE_URL` | Neon connection string |
| `PINATA_JWT` | Pinata JWT |
| `PINATA_GATEWAY` | `https://gateway.pinata.cloud` |
| `BLOCKCHAIN_RPC_URL` | `https://rpc-amoy.polygon.technology` |
| `CONTRACT_ADDRESS` | `0xB4E489791fA3DA6be80990b6951C1aD9494Cb69c` |
| `CHAIN_ID` | `80002` |
| `CHAIN_NAME` | `Polygon Amoy` |
| `CURRENCY_SYMBOL` | `POL` |
| `BLOCK_EXPLORER_URL` | `https://amoy.polygonscan.com` |
| `FRONTEND_URLS` | `https://YOUR-SITE.netlify.app` (update after Step 6) |

5. Deploy → copy URL like `https://landchain-registry-api.onrender.com`
6. Test: open `https://YOUR-RENDER.onrender.com/health`  
   First load may take ~30–60s (free sleep). Expect `"ipfs":true` and blockchain connected.

---

## Step 6 — Netlify (frontend)

1. https://app.netlify.com → sign up with GitHub (personal)
2. **Add new site → Import from Git** → `LandChain-Registry`
3. Build settings (or use root `netlify.toml`):
   - Base directory: `frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `frontend/dist` (or `dist` if base=`frontend`)
4. Environment variable:
   - `VITE_API_URL` = `https://YOUR-RENDER.onrender.com` (no trailing slash)
5. Deploy → copy Netlify URL
6. Go back to Render → set `FRONTEND_URLS` to that Netlify URL (and optional `http://localhost:5173`) → **Manual Deploy** once so CORS updates

---

## Step 7 — Smoke test (visitor path)

1. Open Netlify URL
2. MetaMask on **Polygon Amoy** with test POL
3. Sign In → Connect Wallet → Register with your own docs
4. Confirm MetaMask tx → Verify parcel ID
5. Share the Netlify URL with others

Optional seed on Amoy (needs funded deployer + live API):

```bash
cd demo-data
API_URL=https://YOUR-RENDER.onrender.com \
BLOCKCHAIN_RPC_URL=https://rpc-amoy.polygon.technology \
OWNER_KEY=0xYOUR_DEPLOYER_KEY \
npm install && node seed-demo.mjs
```

(You may need to point seed at Amoy contract — if seed still uses local Hardhat key defaults, set `OWNER_KEY` to your Amoy deployer.)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Render 503 / slow | Free tier cold start — wait 1 min, retry |
| CORS error | `FRONTEND_URLS` must exactly match Netlify origin (`https://...`) |
| IPFS false | Check `PINATA_JWT`; Pinata auth test |
| Wrong network in MetaMask | Chain ID `80002`; app can add Amoy via config |
| Contract not configured | `CONTRACT_ADDRESS` + committed `shared/abi.json` |
| Out of gas / faucet dry | Try another Amoy faucet; wait daily limit |

---

## Revert to pre-deploy code

```bash
git checkout backup/pre-public-deploy
```

Or keep `main` and only use local Docker/Hardhat with empty `PINATA_JWT` / local `deployment.json`.
