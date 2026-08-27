# BidShield AI — Procurement Compliance & Risk Intelligence Platform

> **Verify Faster. Decide Smarter. Procure with Confidence.**

AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement  
**Problem Statement ID:** SIH26100  
**Organization:** Ministry of Petroleum & Natural Gas  
**Category:** Software | **Theme:** Smart Automation

---

## 🛡️ Core Philosophy: Human-in-the-Loop Decision Support

> **AI recommends. Rules validate. Humans decide.**

BidShield AI is an intelligent procurement verification assistant designed to empower procurement officers during first-level evaluation of tender bids on GeM (Government e-Marketplace).  
The platform **never** automatically declares a bidder as the final winner. All compliance findings are evidence-grounded and presented to authorized procurement officers as decision support.

---

## 🌟 Key Capabilities

1. **Automated Tender Requirement Extractor**: Extracts eligibility, financial turnover thresholds, project experience years, OEM authorizations, and Make in India local content rules from tender PDF documents.
2. **Bidder Document Evidence Engine**: Automatically classifies uploaded bidder PDFs (GST, PAN, Udyam, Financial Statements, Experience Certificates, OEM Letters, ISO Certificates) and extracts structured evidence snippets.
3. **Deterministic Compliance Rule Matcher**: Evaluates tender rules against bidder evidence using mathematical and string validation (e.g. Turnover ≥ 10 Cr, Experience ≥ 5 yrs, Local Content ≥ 50%).
4. **Weighted Risk Intelligence Engine**: Computes bid risk scores (0–30 LOW, 31–60 MEDIUM, 61–100 HIGH) based on missing mandatory documents (30%), non-compliance (30%), contradictions (15%), unverified evidence (10%), and confidence metrics.
5. **Contradiction & Inconsistency Detector**: Cross-analyzes corporate establishment profiles against experience project timelines and certificate dates to flag potential anomalies for officer manual review.
6. **Ask BidShield Grounded RAG Assistant**: Interactive chatbot answering officer queries strictly from verified document context with source page and requirement section citations.
7. **Side-by-Side Bidder Comparison Matrix**: Multi-bidder side-by-side compliance table comparing NovaTech Systems vs. Apex Digital Infrastructure.
8. **Simulated Government Verification Adapters**: Interface connectors for GST, PAN, Udyam, MCA, OEM, and DigiLocker (labeled `DEMO / SIMULATED`).
9. **Official PDF Compliance Report Generator**: Downloadable executive PDF reports complete with findings table, evidence references, and legal disclaimer.
10. **Immutable Audit Trail**: Complete audit logging of all logins, tender creations, document uploads, compliance runs, and status reviews.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React Icons, Recharts.
- **API & Backend Layer**: Next.js API Routes, JWT Session Auth, Zod Validation, PDF-Lib.
- **Database & ORM**: PostgreSQL / SQLite via Prisma ORM.
- **AI Microservice**: Python 3.10+, FastAPI, PyPDF, Regex Heuristic Engines, Grounded RAG.

---

## ⚡ Quick Start & Installation

### Prerequisites
- Node.js v18+ & npm
- Python 3.10+

### 1. Clone & Install Dependencies
```bash
# Clone Repository
git clone https://github.com/Deepak-0616/BidShield_AI.git
cd BidShield_AI

# Install Node Packages
npm install

# Install Python Requirements
pip install fastapi uvicorn pydantic python-multipart pypdf requests
```

### 2. Database Setup & Seed Synthetic Demo PDFs
```bash
# Push Prisma Schema to SQLite Database
npm run db:push

# Generate 17 Synthetic Demo PDFs
python scripts/generate_demo_pdfs.py

# Seed Demo Database (Users, Tenders, Requirements, Bids & Evidence)
npx tsx prisma/seed.ts
```

### 3. Launch Application
```bash
# Start FastAPI AI Microservice (Port 8000)
python -m uvicorn main:app --app-dir ai-service --port 8000

# Start Next.js Development Server (Port 3000)
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## 🔑 Seeded Demo Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Procurement Officer** | `officer@bidshield.demo` | `Officer@123` | Create Tenders, Run Compliance, Ask BidShield, Export PDF |
| **Bidder** | `bidder@novatech.demo` | `Bidder@123` | Upload Documents, Pre-Submission Check |
| **Admin** | `admin@bidshield.demo` | `Admin@123` | User Management, Rule Configuration |
| **Auditor** | `auditor@bidshield.demo` | `Auditor@123` | View Reports & Audit Logs |

*Quick Demo Login buttons are provided directly on the Login page for seamless evaluation.*

---

## 🐳 Docker Deployment

To launch the full stack with single command:
```bash
docker compose up --build
```

---

## 📜 Legal & Hackathon Disclaimer
All document files, taxpayer registration numbers, company profiles, and verification API responses generated in DEMO mode are synthetic and intended solely for hackathon evaluation under SIH26100.
