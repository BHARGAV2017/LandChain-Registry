import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DEMO_PARCEL = "LP-DEMO-001";

function enterDemo() {
  localStorage.setItem("demoEntered", "true");
}

function ReadMore({ summary, children, labelMore = "Read more", labelLess = "Show less" }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`read-more ${open ? "is-open" : ""}`}>
      {summary && <div className="read-more-summary">{summary}</div>}
      {open && <div className="read-more-full">{children}</div>}
      <button type="button" className="read-more-btn" onClick={() => setOpen((v) => !v)}>
        {open ? labelLess : labelMore}
      </button>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    enterDemo();
    navigate("/dashboard");
  };

  return (
    <div className="home">
      <section className="home-hero">
        <p className="home-brand">LandChain Registry</p>
        <h1>Verifiable land records. Harder to forge. Easy to check.</h1>
        <p className="home-lead">
          GPS + document fingerprints + an immutable ownership chain — for registries, title teams,
          and PropTech.
        </p>
        <div className="home-cta-row">
          <Link to={`/verify/${DEMO_PARCEL}`} className="btn">
            View sample
          </Link>
          <button type="button" className="btn secondary" onClick={handleSignIn}>
            Sign In
          </button>
        </div>
        <p className="meta home-cta-note">
          View sample = no wallet. Sign In = connect MetaMask to register or transfer.
        </p>
      </section>

      <section className="card home-section">
        <h2>The problem</h2>
        <p className="home-section-lead">
          Forged deeds, fragmented registries, slow verification — documented at scale.
        </p>
        <div className="home-stats">
          <article className="stat-card">
            <span className="stat-region">United States · 2024</span>
            <span className="stat-number">9,359</span>
            <span className="stat-label">real estate fraud complaints · $173.6M losses</span>
            <ReadMore>
              <p>
                FBI IC3 category (includes title-related and other real estate crime).{" "}
                <a
                  href="https://mostpolicyinitiative.org/science-note/real-estate-title-fraud/"
                  target="_blank"
                  rel="noreferrer"
                >
                  MOST Policy Initiative
                </a>
                {" · "}
                <a
                  href="https://commercialrecord.com/2026/05/deed-theft-a-rising-problem/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Commercial Record
                </a>
              </p>
            </ReadMore>
          </article>
          <article className="stat-card">
            <span className="stat-region">United States</span>
            <span className="stat-number">~3,200</span>
            <span className="stat-label">fragmented recording jurisdictions</span>
            <ReadMore>
              <p>
                Independent municipal registries with inconsistent standards.{" "}
                <a
                  href="https://www.housingwire.com/articles/americas-fragmented-land-registries-are-fueling-fraud-and-the-costs-are-rising/"
                  target="_blank"
                  rel="noreferrer"
                >
                  HousingWire
                </a>
              </p>
            </ReadMore>
          </article>
          <article className="stat-card">
            <span className="stat-region">Europe · Sweden</span>
            <span className="stat-number">€100M+</span>
            <span className="stat-label">est. annual savings — Lantmäteriet blockchain pilot</span>
            <ReadMore>
              <p>
                Paperwork-reduction estimate for Sweden’s land authority pilot.{" "}
                <a
                  href="https://www.pillsburylaw.com/a/web/119459/AR-Real-Property-Transfers-Ripe-for-Blockchain-Disruption-update.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Pillsbury (PDF)
                </a>
                {" · "}
                <a
                  href="https://chain.link/article/blockchain-land-registry"
                  target="_blank"
                  rel="noreferrer"
                >
                  Chainlink
                </a>
                {" · "}
                <a
                  href="https://blockchan.ge/blockchange-land-registry.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Blockchange (PDF)
                </a>
              </p>
            </ReadMore>
          </article>
          <article className="stat-card">
            <span className="stat-region">United States · 2019–2023</span>
            <span className="stat-number">$1.3B</span>
            <span className="stat-label">reported real estate crime losses · 58k+ victims</span>
            <ReadMore>
              <p>
                FBI figures; likely undercounted.{" "}
                <a
                  href="https://theconversation.com/deed-fraud-can-cause-vulnerable-detroiters-to-lose-their-homes-heres-why-its-hard-to-catch-the-thieves-276596"
                  target="_blank"
                  rel="noreferrer"
                >
                  The Conversation
                </a>
              </p>
            </ReadMore>
          </article>
        </div>
        <ReadMore
          summary={<span className="meta">All sources &amp; caveat</span>}
          labelMore="Show sources"
          labelLess="Hide sources"
        >
          <ul className="home-source-list meta">
            <li>
              <a
                href="https://mostpolicyinitiative.org/science-note/real-estate-title-fraud/"
                target="_blank"
                rel="noreferrer"
              >
                MOST Policy Initiative — Real Estate Title Fraud
              </a>
            </li>
            <li>
              <a
                href="https://commercialrecord.com/2026/05/deed-theft-a-rising-problem/"
                target="_blank"
                rel="noreferrer"
              >
                Commercial Record — Deed theft (May 2026)
              </a>
            </li>
            <li>
              <a
                href="https://www.housingwire.com/articles/americas-fragmented-land-registries-are-fueling-fraud-and-the-costs-are-rising/"
                target="_blank"
                rel="noreferrer"
              >
                HousingWire — America’s fragmented land registries
              </a>
            </li>
            <li>
              <a
                href="https://theconversation.com/deed-fraud-can-cause-vulnerable-detroiters-to-lose-their-homes-heres-why-its-hard-to-catch-the-thieves-276596"
                target="_blank"
                rel="noreferrer"
              >
                The Conversation — Detroit deed fraud
              </a>
            </li>
            <li>
              <a
                href="https://www.pillsburylaw.com/a/web/119459/AR-Real-Property-Transfers-Ripe-for-Blockchain-Disruption-update.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Pillsbury — Real Property Transfers &amp; Blockchain (PDF)
              </a>
            </li>
            <li>
              <a
                href="https://chain.link/article/blockchain-land-registry"
                target="_blank"
                rel="noreferrer"
              >
                Chainlink — Blockchain land registry
              </a>
            </li>
            <li>
              <a
                href="https://blockchan.ge/blockchange-land-registry.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Blockchange — Swedish land registry pilot (PDF)
              </a>
            </li>
          </ul>
          <p className="meta" style={{ marginTop: "0.75rem", marginBottom: 0 }}>
            Caveat: blockchain hardens records <em>after</em> registration; it does not by itself fix
            bad data at first entry.
          </p>
        </ReadMore>
      </section>

      <section className="card home-section">
        <h2>How we solve it</h2>
        <div className="home-steps">
          <div className="home-step">
            <span className="home-step-num">1</span>
            <h3>Register</h3>
            <p className="meta">Map GPS, upload deeds, sign with a wallet.</p>
          </div>
          <div className="home-step">
            <span className="home-step-num">2</span>
            <h3>Verify</h3>
            <p className="meta">Look up any parcel ID — no office visit, no wallet required.</p>
          </div>
          <div className="home-step">
            <span className="home-step-num">3</span>
            <h3>Transfer</h3>
            <p className="meta">Only the owner can transfer; full history stays on-chain.</p>
          </div>
        </div>
      </section>

      <section className="card home-section">
        <h2>Security</h2>
        <p className="home-section-lead">
          Protect titles for decades — strong today, crypto-agile tomorrow.
        </p>

        <h3 className="home-subhead">In this demo</h3>
        <ul className="home-security-list">
          <li>
            <strong>Immutable ownership chain</strong>
            <span> — register &amp; transfer on-chain</span>
          </li>
          <li>
            <strong>Document fingerprints</strong>
            <span> — IPFS + SHA-256 hashes</span>
          </li>
          <li>
            <strong>Owner-signed transfers</strong>
            <span> — wallet ECDSA + ReentrancyGuard</span>
          </li>
          <li>
            <strong>Public verify</strong>
            <span> — anyone can check; actions need a signature</span>
          </li>
        </ul>
        <ReadMore labelMore="Technical detail" labelLess="Hide detail">
          <p className="meta">
            Solidity <code>LandRegistry</code> with OpenZeppelin <code>ReentrancyGuard</code>; ECDSA /
            secp256k1 wallet signatures; SHA-256 GPS &amp; metadata digests; IPFS CIDs bound to the
            parcel record.
          </p>
        </ReadMore>

        <h3 className="home-subhead">Roadmap (planned)</h3>
        <p className="meta home-roadmap-intro">
          Relative months from this demo. Expand each phase for full detail.
        </p>
        <ol className="roadmap-timeline">
          <li className="roadmap-phase done">
            <div className="roadmap-when">Now</div>
            <div className="roadmap-body">
              <h3>Working demo</h3>
              <ReadMore summary={<p className="meta">Shipped: register · verify · transfer · IPFS</p>}>
                <p className="meta">
                  Solidity <code>LandRegistry</code> + OpenZeppelin <code>ReentrancyGuard</code>; ECDSA
                  register/transfer; SHA-256 digests; IPFS CIDs; ownership history; verify API + React
                  workspace.
                </p>
              </ReadMore>
            </div>
          </li>
          <li className="roadmap-phase">
            <div className="roadmap-when">Month 1</div>
            <div className="roadmap-body">
              <h3>PQC design — ML-DSA (Dilithium)</h3>
              <ReadMore summary={<p className="meta">Threat model · NIST FIPS 204 / 203 · hybrid ECDSA+ML-DSA</p>}>
                <p className="meta">
                  Threat model for 30–50 year titles (“harvest now, forge later”). NIST{" "}
                  <strong>FIPS 204 ML-DSA</strong> (Dilithium) for ownership attestations; optional{" "}
                  <strong>FIPS 203 ML-KEM</strong> (Kyber) for sealed envelopes. Crypto-agility with
                  versioned algorithm IDs per parcel.
                </p>
              </ReadMore>
            </div>
          </li>
          <li className="roadmap-phase">
            <div className="roadmap-when">Month 2</div>
            <div className="roadmap-body">
              <h3>PQC module — hybrid signing</h3>
              <ReadMore summary={<p className="meta">ECDSA + Dilithium · store pqSignature · verify path</p>}>
                <p className="meta">
                  Hybrid signing service; persist <code>pqAlgorithm</code>, <code>pqPublicKey</code>,{" "}
                  <code>pqSignature</code> with tx hash; sign → store → verify tests; migration for
                  ECDSA-only parcels.
                </p>
              </ReadMore>
            </div>
          </li>
          <li className="roadmap-phase">
            <div className="roadmap-when">Month 3</div>
            <div className="roadmap-body">
              <h3>AI docs — OCR, RAG, risk score</h3>
              <ReadMore summary={<p className="meta">OCR + RAG templates · fraud score · human-in-the-loop</p>}>
                <p className="meta">
                  Layout-aware OCR (grantor/grantee, survey no., area, dates). <strong>RAG</strong> over
                  jurisdiction deed templates. Embedding / anomaly scoring for spoofing &amp; form↔doc
                  mismatches. Clerks approve before on-chain commit — no autonomous title decision.
                </p>
              </ReadMore>
            </div>
          </li>
          <li className="roadmap-phase">
            <div className="roadmap-when">Month 4</div>
            <div className="roadmap-body">
              <h3>Integrate · test · harden</h3>
              <ReadMore summary={<p className="meta">E2E path · adversarial tests · staging CI</p>}>
                <p className="meta">
                  upload → OCR/RAG review → hybrid ECDSA+ML-DSA → chain → verify. Regression + abuse
                  cases (replay, wrong owner, hash swap); audit logs; PQC key custody &amp; AI
                  false-positive review.
                </p>
              </ReadMore>
            </div>
          </li>
          <li className="roadmap-phase">
            <div className="roadmap-when">Month 5+</div>
            <div className="roadmap-body">
              <h3>Pilot &amp; production</h3>
              <ReadMore summary={<p className="meta">Partner pilot · Polygon · HSM/KMS · diligence pack</p>}>
                <p className="meta">
                  Tune RAG corpora / thresholds; production L2 (e.g. Polygon); HSM/KMS for ML-DSA keys;
                  SLAs, runbooks, architecture + threat-model pack for technical due diligence.
                </p>
              </ReadMore>
            </div>
          </li>
        </ol>
      </section>

      <section className="card home-section home-try">
        <h2>Try it</h2>
        <p className="home-section-lead">Pick one path:</p>

        <div className="home-try-paths">
          <div className="home-try-path">
            <h3>Look only — no wallet</h3>
            <p className="meta">
              Sample preview of the Verify UI (not a live chain record). No MetaMask needed.
            </p>
            <div className="home-try-links">
              <Link to={`/verify/${DEMO_PARCEL}`} className="try-chip">
                <strong>Verify LP-DEMO-001</strong>
                <span>Delhi</span>
              </Link>
              <Link to="/verify/LP-DEMO-002" className="try-chip">
                <strong>Verify LP-DEMO-002</strong>
                <span>Gurugram</span>
              </Link>
            </div>
          </div>

          <div className="home-try-path">
            <h3>Test yourself — wallet</h3>
            <p className="meta">
              Sign In, connect MetaMask (Polygon Amoy + test POL), then register or transfer.
            </p>
            <div className="home-cta-row">
              <button type="button" className="btn" onClick={handleSignIn}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
