# Global Land Registry Problems & Market Evidence
## Where This Product Solves Documented, Reported Issues

**Document purpose:** Sales, investor, and partner conversations — with **citable sources** for fact-checking.  
**Last updated:** June 2026  
**Product:** Blockchain land registry (GPS + IPFS documents + ownership chain)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem → Product Mapping](#2-problem--product-mapping)
3. [Americas (United States)](#3-americas-united-states)
4. [Europe](#4-europe)
5. [Asia (India and others)](#5-asia-india-and-others)
6. [Latin America & Africa](#6-latin-america--africa)
7. [Blockchain Land Registry Pilots (Global)](#7-blockchain-land-registry-pilots-global)
8. [Priority Markets for This Product](#8-priority-markets-for-this-product)
9. [Honest Limitations (What Blockchain Does NOT Fix)](#9-honest-limitations-what-blockchain-does-not-fix)
10. [One-Page Pitch Statement](#10-one-page-pitch-statement)
11. [Full Reference List](#11-full-reference-list)

---

## 1. Executive Summary

Land registry systems worldwide suffer from recurring, **documented** problems:

- **Forged or fraudulent deeds** and sham transactions  
- **Fragmented records** across counties, departments, or agencies  
- **Ownership disputes** that clog courts for years  
- **Weak link between land parcels and GPS/survey data**  
- **Tampering or distrust** of centralized government databases  
- **Slow, paper-heavy** transfer processes  

A system that combines **GPS-linked parcels**, **document storage with cryptographic fingerprints (IPFS + hash)**, and an **immutable ownership chain (blockchain)** directly addresses these pain points — as recognized by governments, courts, and international development bodies.

**Important:** Blockchain makes records **harder to alter after registration**. It does **not** automatically correct wrong or fraudulent data at the moment of first entry. Legal recognition and data quality remain prerequisites (see [Section 9](#9-honest-limitations-what-blockchain-does-not-fix)).

---

## 2. Problem → Product Mapping

| Documented problem | How this product addresses it | Demo feature |
|--------------------|-------------------------------|--------------|
| Forged / fake deeds | Wallet-signed registration & transfer; document hash on chain | MetaMask sign + tx hash |
| “Who owns this land?” disputes | Current owner query + full history | Verify page |
| Records split across offices | Single parcel ID + API + linked metadata | PostgreSQL + parcel ID |
| No GPS tie to parcel | Lat/long stored + GPS hash on chain | Map picker + registration |
| Document authenticity | SHA hash + IPFS CID; tamper-evident | IPFS Metadata / Doc links |
| Slow verification for banks, buyers, courts | Instant verify without visiting registry | `/verify/:parcelId` |
| Distrust of editable government DB | Immutable on-chain ownership events | Ownership history (blockchain) |

---

## 3. Americas (United States)

### 3.1 Reported problem: Deed / title / home title fraud

**What is reported:**  
Criminals forge documents or impersonate owners to record false transfers, often targeting vacant land, elderly owners, or cash-heavy markets. Victims may lose homes or equity.

**Reported scale & sources:**

| Claim | Source |
|-------|--------|
| **9,359** real estate fraud complaints in **2024**; **$173.6 million** in losses (category includes title-related fraud among other real estate crimes) | FBI Internet Crime Complaint Center, cited in [MOST Policy Initiative – Real Estate Title Fraud](https://mostpolicyinitiative.org/science-note/real-estate-title-fraud/) and [Commercial Record (May 2026)](https://commercialrecord.com/2026/05/deed-theft-a-rising-problem/) |
| **58,141** victims reported **$1.3 billion** in losses relating to real estate crime **2019–2023** (likely undercounted) | FBI, cited in [The Conversation – Detroit deed fraud](https://theconversation.com/deed-fraud-can-cause-vulnerable-detroiters-to-lose-their-homes-heres-why-its-hard-to-catch-the-thieves-276596) |
| **62%** of recently reported title fraud involved **vacant land** (2025 survey of real estate professionals) | Christopherson et al., cited in [MOST Policy Initiative](https://mostpolicyinitiative.org/science-note/real-estate-title-fraud/) |
| Deed fraud reported in **Detroit, New York, Boston, Miami, Philadelphia**; Wayne County (MI) **13,000+ inquiries** and **2,300+ cases** since 2005 | [The Conversation – Detroit deed fraud](https://theconversation.com/deed-fraud-can-cause-vulnerable-detroiters-to-lose-their-homes-heres-why-its-hard-to-catch-the-thieves-276596) |
| **21** U.S. states enacted deed-fraud legislation; **16** states still had no deed-fraud-specific laws (as reported 2026) | [Commercial Record](https://commercialrecord.com/2026/05/deed-theft-a-rising-problem/) |

**How this product helps:**  
Cryptographic signing of transfers, immutable ownership chain, document hashes — reduces reliance on “any document that looks valid on paper.”

---

### 3.2 Reported problem: Fragmented land registries

**What is reported:**  
The U.S. has **~3,200** municipal recording jurisdictions with inconsistent standards. Fragmentation makes fraud detection and verification harder; title insurers bear large claim costs.

**Sources:**

| Claim | Source |
|-------|--------|
| **~3,200** municipalities with independent registries | [HousingWire – America’s fragmented land registries](https://www.housingwire.com/articles/americas-fragmented-land-registries-are-fueling-fraud-and-the-costs-are-rising/) |
| Fraud/forgery claims significant for title insurers; avg claim **~$143,000** (purchase), **~$207,000** (refinance) | Milliman / ALTA analysis, cited in [HousingWire](https://www.housingwire.com/articles/americas-fragmented-land-registries-are-fueling-fraud-and-the-costs-are-rising/) |
| Recorders often must process documents meeting technical format even if underlying fraud exists | [The Conversation](https://theconversation.com/deed-fraud-can-cause-vulnerable-detroiters-to-lose-their-homes-heres-why-its-hard-to-catch-the-thieves-276596); [MOST Policy Initiative](https://mostpolicyinitiative.org/science-note/real-estate-title-fraud/) |

**How this product helps:**  
Standardized digital parcel record + on-chain history + API verify — overlay or integration layer for counties, title companies, PropTech.

**Potential buyers:** Title tech (e.g. Ubitquity, Propy), county recorders, title insurers, PropTech.

---

## 4. Europe

### 4.1 Sweden — efficiency & transaction cost (developed country)

**Reported need:**  
Sweden’s land authority **Lantmäteriet** piloted blockchain to reduce paperwork, speed property transactions, and improve transparency among buyers, sellers, banks, and agents.

**Sources:**

| Claim | Source |
|-------|--------|
| Multi-phase pilot from **2016**; proof of concept and testbed built; small-scale official use by **2017** | [Blockchange – Swedish land registry PDF](https://blockchan.ge/blockchange-land-registry.pdf) |
| Estimated savings **over €100 million / ~$106 million per year** for Swedish taxpayers (paperwork reduction) | [Pillsbury – Real Property Transfers & Blockchain](https://www.pillsburylaw.com/a/web/119459/AR-Real-Property-Transfers-Ripe-for-Blockchain-Disruption-update.pdf); [Chainlink – Blockchain land registry](https://chain.link/article/blockchain-land-registry) |
| Legal constraints (e.g. wet signatures) slowed full binding transfers | [Blockchange PDF](https://blockchan.ge/blockchange-land-registry.pdf) |

**How this product helps:**  
Digital registration, multi-party verify, ownership chain — same value proposition as Lantmäteriet pilot (efficiency + transparency).

---

### 4.2 Georgia — distrust & database tampering risk

**Reported problems before / during blockchain layer:**  
Digital national registry (NAPR) improved on paper, but records could still be altered before securing; public distrust of political influence; hacking risk.

**Reported outcomes of blockchain layer (Bitfury / NAPR, from **2016**):**  
Timestamping on Bitcoin blockchain; improved efficiency, traceability, data security perceptions.

**Sources:**

| Claim | Source |
|-------|--------|
| Justice minister: politicians could still influence transactions; centralized DB vulnerable to hackers | [MIT Innovations – Georgia land titling](https://doi.org/10.1162/inov_a_00276) |
| First national government use of Bitcoin blockchain for land title recording (as reported) | [MIT Innovations](https://doi.org/10.1162/inov_a_00276); [Forbes via MIT article] |
| CPI improved after **2004** reforms; flattening after **2016** blockchain — blockchain alone did not fix perceptions | [U4 – Anti-corruption reforms Georgia](https://www.u4.no/blog/anti-corruption-reforms-successful-in-georgia-blockchain-stealing-limelight) |
| Achievements cited: security, transparency, traceability of transactions | [U4](https://www.u4.no/blog/anti-corruption-reforms-successful-in-georgia-blockchain-stealing-limelight) |

**How this product helps:**  
Same architecture: hashes on chain, ownership events immutable, documents on IPFS.

---

### 4.3 Greece — cadastre fraud, “unknown owner,” GPS gaps

**Reported problems (2024–2026):**

| Issue | Reported detail | Source |
|-------|-----------------|--------|
| **“Unknown owner” properties** | **~3.45 million** properties at risk of misappropriation | [eKathimerini – Hasty register completion](https://www.ekathimerini.com/news/environment/1301094/hasty-register-completion-raises-legal-concerns/) |
| **Pending objections** | **~233,000** objections; years of review | [eKathimerini](https://www.ekathimerini.com/news/environment/1301094/hasty-register-completion-raises-legal-concerns/) |
| **Large-scale alleged fraud** | **45 properties**, **550,000+ sq m** (Agistri, Hydra, Spetses); forged documents, false witnesses | [To Vima](https://www.tovima.com/politics/potential-land-registry-fraud-case-brought-to-supreme-court/) |
| **State land lost via registry** | **€10M** plot (Glyfada); state land listed as “unknown owner,” then claimed via usucaption / court schemes | [ProtoThema](https://en.protothema.gr/2025/05/07/how-to-grab-the-fillets-with-usucaption-the-new-case-with-the-plot-of-10-million-euros-in-glyfada/) |
| **Person-based registry failures** | Wrong parcel linked to titles; adverse possession abuse; lack of spatial/GPS documentation | [MDPI – Hellenic Cadastre review](https://www.mdpi.com/2073-445X/14/6/1138) |
| Cadastre **99%** property rights posted; completion targeted **end of 2026** | [eKathimerini – Land registry final phase](https://www.ekathimerini.com/news/1307555/land-registry-enters-final-phase/) |

**How this product helps:**  
GPS-linked registration, timely on-chain ownership, document proof, transfer chain — directly addresses “unknown owner” and forged-claim scenarios.

---

### 4.4 United Kingdom — lower fraud, different angle

**Reported context:**  
England & Wales HM Land Registry is relatively centralized; fraud exists but at lower rates than fragmented systems.

| Claim | Source |
|-------|--------|
| **86** fraudulent applications identified of **4.4+ million** processed (2024–25) | Cited in web summaries; verify via [HM Land Registry annual reports](https://www.gov.uk/government/organisations/land-registry) |

**Pitch angle for UK:** Digital conveyancing innovation, not crisis fraud.

---

## 5. Asia (India and others)

### 5.1 India — court backlog, presumptive titling, Supreme Court push

**Reported problems:**

| Issue | Reported detail | Source |
|-------|-----------------|--------|
| **Land disputes dominate civil litigation** | **~two-thirds** of pending civil cases (2007 World Bank study, widely cited) | [The Hindu Explains – Conclusive titling](https://www.thehindu.com/news/national/the-hindu-explains-why-does-india-need-conclusive-land-titling/article33891718.ece) |
| **20 years** average to resolve land/real estate disputes | NITI Aayog study, cited in [The Hindu](https://www.thehindu.com/news/national/the-hindu-explains-why-does-india-need-conclusive-land-titling/article33891718.ece) |
| **Presumptive vs conclusive titling** | Sale deed ≠ state-guaranteed title; root cause of disputes | [The Hindu](https://www.thehindu.com/news/national/the-hindu-explains-why-does-india-need-conclusive-land-titling/article33891718.ece); [Vidhi Legal Policy](https://vidhilegalpolicy.in/blog/is-land-digitisation-enough/) |
| **Siloed departments** | Revenue, Survey, Registration — records out of sync | [Vidhi Legal Policy](https://vidhilegalpolicy.in/blog/is-land-digitisation-enough/) |
| **Benami / fraud / outdated records** | Names of grandparents still on title; fragmented verification | [Vidhi Legal Policy](https://vidhilegalpolicy.in/blog/is-land-digitisation-enough/) |
| **Digitization alone insufficient** without conclusive titling + surveys | [Swarajya](https://swarajyamag.com/politics/why-india-should-fix-its-land-titles-before-putting-them-on-a-blockchain) | |

**Supreme Court of India (2026) — blockchain explicitly urged:**

| Claim | Source |
|-------|--------|
| Court urged Union and States to digitize registered documents and land records using **blockchain** — immutable, cryptographically secured | [Verdictum – SC blockchain land records](https://www.verdictum.in/court-updates/supreme-court/hemalatha-d-by-lrs-v-tukaram-d-by-lrs-neutral-citation-2026-insc-82-blockchain-technology-land-records-registered-deed-1605231) |
| Context: long-pending appeal on **1971** registered sale deed challenged as sham | [Verdictum](https://www.verdictum.in/court-updates/supreme-court/hemalatha-d-by-lrs-v-tukaram-d-by-lrs-neutral-citation-2026-insc-82-blockchain-technology-land-records-registered-deed-1605231); [The Core](https://www.thecore.in/technology/how-blockchain-could-ease-land-dispute-backlogs-and-why-apex-court-agrees-857440) |
| Goal: reduce forgery and “clever drafting” that clogs courts | [The Core](https://www.thecore.in/technology/how-blockchain-could-ease-land-dispute-backlogs-and-why-apex-court-agrees-857440) |

**India pilots:**

| Claim | Source |
|-------|--------|
| **Chhattisgarh:** **700,000+** land records on blockchain (district pilot) | [The Core](https://www.thecore.in/technology/how-blockchain-could-ease-land-dispute-backlogs-and-why-apex-court-agrees-857440) |
| **UNDP / Panchkula** blockchain land registry pilot (historical) | [Thomson Reuters Insight](https://insight.thomsonreuters.com.au/legal/posts/blockchain-solving-real-estate-problems) |
| **Andhra Pradesh** state pilots (historical) | Academic / industry summaries e.g. [DOI paper](https://doi.org/10.63345/sjaibt.v2.i2.101) |

**Government programs:** DILRMP (Digital India Land Records Modernisation Programme), ULPIN (Unique Land Parcel Identification Number) — see [Vidhi Legal Policy](https://vidhilegalpolicy.in/blog/is-land-digitisation-enough/).

**How this product helps:**  
GPS (ULPIN-aligned), document hash, ownership chain, verify API — matches Supreme Court direction and state digitization goals.

---

### 5.2 Other Asia

| Country / project | Reported problem / use | Source |
|-------------------|------------------------|--------|
| **Dubai / UAE** | Smart government, paperless initiatives; blockchain registry | [DOI / industry summaries](https://doi.org/10.63345/sjaibt.v2.i2.101) |
| **Fiji (iTaukei land)** | **~90%** land under customary ownership; complex lease consent; DLT for leasing | [ADB Digital Sandbox – Fiji](https://digital.adb.org/home/2024/10/29/distributed-ledger-technology-based-digital-platform-to-transform-customary-and-land-leasing-process) |

---

## 6. Latin America & Africa

| Country | Reported problem | Blockchain / digitization response | Source |
|---------|------------------|-----------------------------------|--------|
| **Honduras** | Corrupt / uncertain titles; **~200 years** of records to secure | Blockchain pilot (reported **stalled**) | [Pillsbury PDF](https://www.pillsburylaw.com/a/web/119459/AR-Real-Property-Transfers-Ripe-for-Blockchain-Disruption-update.pdf) |
| **Ghana** | Informal tenure, land grabbing; weak registry | NGO / blockchain pilots; citizens mark homes with paint (anecdotal) | [Pillsbury PDF](https://www.pillsburylaw.com/a/web/119459/AR-Real-Property-Transfers-Ripe-for-Blockchain-Disruption-update.pdf) |
| **Brazil** | Outdated titling; regional pilots | Industry + government collaboration | [Thomson Reuters](https://insight.thomsonreuters.com.au/legal/posts/blockchain-solving-real-estate-problems) |
| **Bolivia, Paraguay, Peru** | Rural land titling + registry modernization | IDB project **RG-T3356** — blockchain pilots | [IDB Project RG-T3356](https://www.iadb.org/en/project/RG-T3356) |
| **Ukraine** | Transparency / security of property records | Announced blockchain for land registry | [Pillsbury PDF](https://www.pillsburylaw.com/a/web/119459/AR-Real-Property-Transfers-Ripe-for-Blockchain-Disruption-update.pdf) |

**Africa / development finance:** World Bank and regional banks have funded **$1B+** in land digitization (multiple countries); see [FIAN research paper on digitalization and land governance](https://www.ictworks.org/wp-content/uploads/2021/09/FIAN_Research_Paper_Digitalization_and_Land_Governance_final.pdf).

---

## 7. Blockchain Land Registry Pilots (Global)

| Jurisdiction | Year(s) | Reported goal | Reported outcome / status | Primary source |
|--------------|---------|---------------|---------------------------|----------------|
| **Georgia** | 2016+ | Tamper-evident titles, trust | Operational timestamping layer; millions of titles | [MIT Innovations](https://doi.org/10.1162/inov_a_00276); [U4](https://www.u4.no/blog/anti-corruption-reforms-successful-in-georgia-blockchain-stealing-limelight) |
| **Sweden** | 2016–2018+ | Cost, speed, transparency | POC complete; legal barriers to full automation | [Blockchange PDF](https://blockchan.ge/blockchange-land-registry.pdf) |
| **Honduras** | ~2015 | Secure historical records | Stalled | [Pillsbury PDF](https://www.pillsburylaw.com/a/web/119459/AR-Real-Property-Transfers-Ripe-for-Blockchain-Disruption-update.pdf) |
| **India (states)** | 2017+ | Fraud, efficiency | Ongoing pilots (e.g. Chhattisgarh) | [The Core](https://www.thecore.in/technology/how-blockchain-could-ease-land-dispute-backlogs-and-why-apex-court-agrees-857440) |
| **Fiji** | 2018–2022 | Customary land leasing | Platform launched **2022** | [ADB](https://digital.adb.org/home/2024/10/29/distributed-ledger-technology-based-digital-platform-to-transform-customary-and-land-leasing-process) |
| **USA (Vermont)** | 2018 | First blockchain property deed (reported) | Pilot / precedent | [Thomson Reuters](https://insight.thomsonreuters.com.au/legal/posts/blockchain-solving-real-estate-problems) |

**World Bank** — “Blockchain and Land” (2018): proof-of-value for first registration, transfers, virtual notarization; stresses **off-chain** governance, legal framework, data accuracy.  
**Source:** [World Bank PDF – Blockchain and Land](https://thedocs.worldbank.org/en/doc/784361528484329990-0200022018/original/BlockchainandLandJune2018.pdf)

---

## 8. Priority Markets for This Product

Ranked by **documented pain + openness to blockchain + fit with demo**:

| Rank | Market | Why |
|------|--------|-----|
| **1** | **India** | Supreme Court 2026 directive; massive court backlog; DILRMP/ULPIN; state pilots |
| **2** | **United States** | Title fraud ($173M+ losses 2024); 3,200 fragmented registries; PropTech buyers |
| **3** | **Greece / EU cadastre completion** | 3.45M “unknown owner”; high-profile fraud cases; GPS need |
| **4** | **Georgia model** | Proven gov + blockchain layer; reference architecture |
| **5** | **Sweden / developed EU** | Efficiency & cost savings pitch |
| **6** | **IDB / World Bank land projects** | Bolivia, Paraguay, Peru, Africa, Asia via implementers |

**Who to sell to:** Governments (via SI partners), Ubitquity/Propy-class vendors, title insurers, UNDP/ADB implementers, state land departments.

---

## 9. Honest Limitations (What Blockchain Does NOT Fix)

Use these in serious meetings — builds credibility.

| Limitation | Reported by | Source |
|------------|-------------|--------|
| **Garbage in, garbage out** — immutable wrong data | India policy debate | [Swarajya](https://swarajyamag.com/politics/why-india-should-fix-its-land-titles-before-putting-them-on-a-blockchain) |
| **Legal recognition** — smart contract ≠ deed until law says so | Sweden, global | [Blockchange PDF](https://blockchan.ge/blockchange-land-registry.pdf) |
| **Blockchain doesn’t fix corruption at data entry** | Georgia analysis | [U4](https://www.u4.no/blog/anti-corruption-reforms-successful-in-georgia-blockchain-stealing-limelight) |
| **Privacy** — public ledger vs GDPR / personal data | EU context | [Chainlink article](https://chain.link/article/blockchain-land-registry) |
| **Digital divide** — not everyone has wallet/smartphone | World Bank | [World Bank PDF](https://thedocs.worldbank.org/en/doc/784361528484329990-0200022018/original/BlockchainandLandJune2018.pdf) |
| **Digitization ≠ conclusive titling** (India) | NITI Aayog / experts | [The Hindu](https://www.thehindu.com/news/national/the-hindu-explains-why-does-india-need-conclusive-land-titling/article33891718.ece) |

**Recommended positioning:**  
*“Blockchain secures and proves records after registration — it must sit on top of accurate surveys, legal title reform, and government recognition.”*

---

## 10. One-Page Pitch Statement

> Land registries worldwide lose billions to **deed fraud**, **ownership disputes**, and **fragmented, tamper-prone records**. The **FBI** reported **$173.6 million** in U.S. real estate fraud losses in **2024** alone. **India’s Supreme Court (2026)** urged governments to register sale deeds on **blockchain** to stop forgery and sham litigation that ties up courts for decades. **Greece** faces **3.45 million** “unknown owner” plots at risk of fraud. **Georgia** and **Sweden** deployed blockchain layers for **tamper-evident titles** and **faster transfers**.
>
> Our system registers land with **GPS coordinates**, stores **deeds and images on IPFS** with cryptographic fingerprints, and records an **immutable ownership chain** on blockchain — so anyone can **verify who owns a parcel and every past transfer** in seconds.
>
> This is a working demo today; production adds government integration, legal recognition, and post-quantum security.

---

## 11. Full Reference List

### Government & multilateral

1. World Bank — *Blockchain and Land* (2018)  
   https://thedocs.worldbank.org/en/doc/784361528484329990-0200022018/original/BlockchainandLandJune2018.pdf  

2. Inter-American Development Bank — *Distributed Ledger Technology: Land Titling and Registry* (RG-T3356)  
   https://www.iadb.org/en/project/RG-T3356  

3. Asian Development Bank — Fiji customary land leasing DLT platform  
   https://digital.adb.org/home/2024/10/29/distributed-ledger-technology-based-digital-platform-to-transform-customary-and-land-leasing-process  

4. HM Land Registry (UK) — official reports  
   https://www.gov.uk/government/organisations/land-registry  

### Courts & policy (India)

5. Verdictum — *Supreme Court urges blockchain for land records* (2026)  
   https://www.verdictum.in/court-updates/supreme-court/hemalatha-d-by-lrs-v-tukaram-d-by-lrs-neutral-citation-2026-insc-82-blockchain-technology-land-records-registered-deed-1605231  

6. The Core — *How Blockchain Could Ease Land Dispute Backlogs*  
   https://www.thecore.in/technology/how-blockchain-could-ease-land-dispute-backlogs-and-why-apex-court-agrees-857440  

7. The Hindu — *Why does India need conclusive land titling?*  
   https://www.thehindu.com/news/national/the-hindu-explains-why-does-india-need-conclusive-land-titling/article33891718.ece  

8. Vidhi Legal Policy — *Is land digitisation enough?*  
   https://vidhilegalpolicy.in/blog/is-land-digitisation-enough/  

9. Swarajya — *Why India Should Fix Its Land Titles Before Putting Them on a Blockchain*  
   https://swarajyamag.com/politics/why-india-should-fix-its-land-titles-before-putting-them-on-a-blockchain  

### United States — fraud & fragmentation

10. The Conversation — *Deed fraud can cause vulnerable Detroiters to lose their homes*  
    https://theconversation.com/deed-fraud-can-cause-vulnerable-detroiters-to-lose-their-homes-heres-why-its-hard-to-catch-the-thieves-276596  

11. MOST Policy Initiative — *Real Estate Title Fraud* (Science Note)  
    https://mostpolicyinitiative.org/science-note/real-estate-title-fraud/  

12. HousingWire — *America’s fragmented land registries are fueling fraud*  
    https://www.housingwire.com/articles/americas-fragmented-land-registries-are-fueling-fraud-and-the-costs-are-rising/  

13. Commercial Record — *Deed Theft a Rising Problem* (May 2026)  
    https://commercialrecord.com/2026/05/deed-theft-a-rising-problem/  

14. FBI Internet Crime Complaint Center (primary data for fraud statistics)  
    https://www.ic3.gov/  

### Europe

15. MIT Press / Innovations — *Blockchain-Based Land Titling in Georgia*  
    https://doi.org/10.1162/inov_a_00276  

16. U4 Anti-Corruption Resource Centre — *Georgia blockchain registry analysis*  
    https://www.u4.no/blog/anti-corruption-reforms-successful-in-georgia-blockchain-stealing-limelight  

17. Blockchange — *Swedish Land Registry / Lantmäteriet* (PDF)  
    https://blockchan.ge/blockchange-land-registry.pdf  

18. eKathimerini — *Hasty register completion raises legal concerns* (Greece)  
    https://www.ekathimerini.com/news/environment/1301094/hasty-register-completion-raises-legal-concerns/  

19. eKathimerini — *Land registry enters final phase* (Greece)  
    https://www.ekathimerini.com/news/1307555/land-registry-enters-final-phase/  

20. To Vima — *Potential Land Registry Fraud Case* (Greece)  
    https://www.tovima.com/politics/potential-land-registry-fraud-case-brought-to-supreme-court/  

21. ProtoThema — *Glyfada €10M plot / usucaption case* (Greece)  
    https://en.protothema.gr/2025/05/07/how-to-grab-the-fillets-with-usucaption-the-new-case-with-the-plot-of-10-million-euros-in-glyfada/  

22. MDPI — *Hellenic Cadastre review* (Greece)  
    https://www.mdpi.com/2073-445X/14/6/1138  

### Industry & legal analysis

23. Pillsbury — *Real Property Transfers Ripe for Blockchain Disruption* (PDF)  
    https://www.pillsburylaw.com/a/web/119459/AR-Real-Property-Transfers-Ripe-for-Blockchain-Disruption-update.pdf  

24. Chainlink — *Blockchain Land Registry*  
    https://chain.link/article/blockchain-land-registry  

25. Thomson Reuters — *How Blockchain Could Solve Real Estate Problems*  
    https://insight.thomsonreuters.com.au/legal/posts/blockchain-solving-real-estate-problems  

26. FIAN — *Digitalization and Land Governance* (research paper, PDF)  
    https://www.ictworks.org/wp-content/uploads/2021/09/FIAN_Research_Paper_Digitalization_and_Land_Governance_final.pdf  

### Academic

27. DOI — *Integration of Blockchain in Real Estate Registry Systems*  
    https://doi.org/10.63345/sjaibt.v2.i2.101  

### Market size (secondary)

28. Dataintelo — *Blockchain for Land Registry and Asset Tracking Market* (industry report; verify claims independently)  
    https://dataintelo.com/report/blockchain-for-land-registry-asset-tracking-market  

---

## Fact-checking notes

- **Always verify** statistics at the **primary source** (FBI IC3 annual report, court judgments, government PDFs).  
- News articles may **round or interpret** data — use Section 11 links and trace to origin.  
- **“Blockchain market size”** reports are commercial — treat as directional, not gospel.  
- Dates and case numbers (e.g. India SC **2026 INSC 82**) should be confirmed on official court portals.  
- Pilot **“success”** claims vary by author — Georgia is operational for timestamping; Honduras reported stalled; Sweden POC complete but full legal transfer pending.

---

## Related project documents

| Document | Location |
|----------|----------|
| System architecture (client) | [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) |
| Live demo setup | [DEMO_SETUP.md](./DEMO_SETUP.md) |
| Demo script & sample files | [demo-data/DEMO_SCRIPT.md](./demo-data/DEMO_SCRIPT.md) |
| Business / monetization (internal) | [learning-docs/BUSINESS_MODEL.md](./learning-docs/BUSINESS_MODEL.md) |
| Post-quantum roadmap (internal) | [learning-docs/POST_QUANTUM_SECURITY.md](./learning-docs/POST_QUANTUM_SECURITY.md) |

---

**Document version:** 1.0  
**Maintainer:** Update this file when new court rulings, FBI reports, or pilot results are published.
