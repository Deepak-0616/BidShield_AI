# BidShield AI — Hackathon Demonstration Script (3-5 Minutes)

**Problem Statement ID:** SIH26100  
**Organization:** Ministry of Petroleum & Natural Gas  
**Tagline:** *Verify Faster. Decide Smarter. Procure with Confidence.*

---

## 1. Core Principle & Vision
"Respected Judges, BidShield AI is an AI-assisted procurement compliance and risk-intelligence platform built for GeM tenders. We strictly enforce the principle: **AI recommends. Rules validate. Humans decide.** The system never automatically awards a winner — it empowers the procurement officer with deterministic rule validation, evidence citations, and risk scores."

---

## 2. Step-by-Step Demo Flow

### Step 1: Login as Procurement Officer
- Open `http://localhost:3000/login`
- Click **"Officer"** Quick Demo button (`officer@bidshield.demo` / `Officer@123`).
- Click **Sign In to Dashboard**.

### Step 2: Officer Dashboard Overview
- Highlight live statistics: **Active Tenders (1)**, **Bids Under Review (2)**, **High Risk Bids (1)**.
- Point to **Category Compliance Overview** (Recharts bar chart) and **Risk Distribution** pie chart.

### Step 3: Tender & AI Requirement Extraction
- Click **Tenders** in sidebar -> Open `GEM-DEMO-2026-IT-001`.
- Show **8 AI-extracted requirements**:
  - `R1`: GST Registration (LEGAL)
  - `R2`: PAN Card (LEGAL)
  - `R3`: Turnover Minimum ₹10.0 Crore (FINANCIAL)
  - `R4`: Experience Minimum 5 Years (EXPERIENCE)
  - `R5`: OEM Authorization Letter (TECHNICAL)
  - `R6`: ISO 9001:2015 Certification (CERTIFICATION)
  - `R7`: Local Content Minimum 50% (LOCAL_CONTENT)
  - `R8`: MSME Udyam Registration (DOCUMENTATION)

### Step 4: Primary AI Inspection — NovaTech Systems (Medium Risk)
- Click **Bids** -> Open **NovaTech Systems Private Limited**.
- **Score Gauge**: ~68.5% Compliance | **Risk**: 58/100 MEDIUM RISK.
- Highlight Findings:
  - `R4 Experience`: Required 5.0 yrs | Evidence: **3.0 yrs** -> **NON_COMPLIANT / PARTIAL**
  - `R5 OEM Letter`: Evidence: **None** -> **MISSING**
  - `R7 Local Content`: Required 50% | Evidence: **42%** -> **NON_COMPLIANT**
- Highlight **Timeline Inconsistency Alert**:
  - Entity incorporated in 2018 (8 yrs entity age) vs submitted experience project starting 2023 (3 yrs).

### Step 5: Ask BidShield AI Procurement Assistant
- Open right-side **Ask BidShield** panel.
- Ask: *"Why is NovaTech marked medium risk?"*
- Show grounded answer citing exact evidence sources:
  - `Source: Experience Certificate — Page 1`
  - `Source: Local Content Declaration — Page 1`
  - `Source: Tender Requirement R4, R5, R7`

### Step 6: Side-by-Side Bid Comparison Matrix
- Navigate to **Bid Comparison** (`/compare`).
- Compare **NovaTech Systems** vs **Apex Digital Infrastructure**.
- Apex Digital achieves **98.0% Compliance (LOW RISK 12/100)** across all 8 requirements.
- Show disclaimer: *"AI assessment is decision support. Final procurement decision remains with authorized officer."*

### Step 7: Download Official PDF Compliance Report
- Click **Download PDF Report** on NovaTech bid page.
- Show generated official PDF document with executive summary, findings table, evidence references, and legal disclaimer.

### Step 8: System Audit Trail
- Open **Audit Trail** (`/audit`).
- Show immutable record of all actions: `USER_LOGIN`, `TENDER_CREATE`, `BID_SUBMIT`, `AI_COMPLIANCE_RUN`, `CONTRADICTION_DETECTED`.

---

## 3. Summary Conclusion
"BidShield AI transforms document-heavy procurement verification into instant, evidence-grounded risk intelligence — ensuring complete transparency, auditability, and confidence."
