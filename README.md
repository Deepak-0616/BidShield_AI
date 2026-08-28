# BidShield AI — Procurement Compliance & Risk Intelligence Platform

> **Verify Faster. Decide Smarter. Procure with Confidence.**

AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement  
**Problem Statement ID:** SIH26100  
**Organization:** Ministry of Petroleum & Natural Gas  
**Category:** Software | **Theme:** Smart Automation  

---

## 🛡️ Core Philosophy: Human-in-the-Loop Decision Support

> **AI recommends. Rules validate. Humans decide.**

BidShield AI is an intelligent procurement verification and risk intelligence assistant purpose-built to empower procurement officers during the first-level technical and financial evaluation of tender bids on GeM (Government e-Marketplace).

The platform **never** autonomously awards tenders or disqualifies bidders. Instead, it extracts structured evidence from complex tender documents and bidder submissions, validates them through deterministic rule-matching engines, and presents transparent, citation-backed findings to authorized procurement officers as decision support.

---

## 🌟 Key Capabilities

1. **Automated Tender Requirement Extractor**: Ingests tender notice PDFs and extracts eligibility parameters, turnover thresholds, past project experience, OEM authorization mandates, and Make in India (MII) local content ratios with source page citations and confidence scores.
2. **Intelligent Bidder Document Evidence Engine**: Automatically classifies and extracts structured evidence snippets across submitted bidder files (GSTIN, PAN, Udyam MSME, Audited Financials, Experience Certificates, OEM Letters, ISO Certifications, Local Content Declarations).
3. **Deterministic Compliance Rule Matcher**: Mathematically evaluates tender eligibility thresholds against extracted bidder evidence (e.g., Annual Turnover ≥ ₹10 Cr, Experience ≥ 5 Years, Local Content ≥ 50%).
4. **Weighted Risk Intelligence Engine**: Computes dynamic risk scores (0–30 Low, 31–60 Medium, 61–100 High) integrating missing mandatory documents, non-compliance penalties, timeline contradictions, unverified claims, and debarment checks.
5. **Debarment & Blacklist Verification**: Cross-references bidder profiles against a centralized debarment registry (DoE, CPPP, and GeM incident repository) to flag blacklisted entities prior to technical qualification.
6. **Cross-Document Contradiction Detector**: Flags corporate registration anomalies, mismatched company profiles, and timeline inconsistencies (e.g., project execution dates predating company incorporation).
7. **Ask BidShield Grounded RAG Assistant**: Context-aware AI assistant answering officer queries strictly from verified document context with source page, document name, and requirement section citations.
8. **Side-by-Side Multi-Bidder Comparison Matrix**: Interactive multi-bidder comparison table displaying criterion-by-criterion compliance status, extracted values, and risk levels across competing bids.
9. **Simulated Government Verification Adapters**: Multi-registry verification connectors for GSTIN, PAN, Udyam, MCA-21, OEM validation, and DigiLocker (with simulated demo mode and live-ready interface hooks).
10. **Official PDF Compliance Report Generator**: Generates comprehensive, downloadable executive PDF evaluation reports complete with findings breakdown, evidence references, officer remarks, and legal disclaimers.
11. **Role-Based Portals & Dashboards**: Tailored workflows and interfaces for Procurement Officers, Bidders (with pre-submission self-assessment), System Administrators (dynamic rule & weight tuning), and Compliance Auditors.
12. **Immutable Audit Trail**: Complete, timestamped forensic logging of all user logins, tender creations, document uploads, compliance evaluations, and review actions.

---

## 🛠️ Technology Stack

- **Frontend & UI**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, TanStack React Query v5, Recharts, Lucide React, clsx, tailwind-merge.
- **API & Backend Layer**: Next.js API Route Handlers, JWT Authentication (`jose` & `jsonwebtoken`), Zod Schema Validation, bcryptjs, PDF-Lib.
- **Database & ORM**: SQLite (Development / Demo) / PostgreSQL (Production) via Prisma ORM v5.
- **AI Microservice**: Python 3.10+, FastAPI, Uvicorn, Pydantic v2, PyPDF, Regex Heuristic Extraction Engines, Grounded RAG.
- **DevOps & Containerization**: Docker, Docker Compose (Multi-service Web + AI Engine).

---

## ⚡ Quick Start & Installation

### Prerequisites
- Node.js v18+ & npm
- Python 3.10+
- Git

### 1. Clone & Install Dependencies
```bash
# Clone Repository
git clone https://github.com/Deepak-0616/BidShield_AI.git
cd BidShield_AI

# Install Node.js Dependencies
npm install

# Install Python AI Microservice Dependencies
pip install -r ai-service/requirements.txt
```

### 2. Database Setup & Seed Synthetic Demo PDFs
```bash
# Push Prisma Schema to SQLite Database
npm run db:push

# Generate Synthetic Demo Documents & PDFs
npm run generate-pdfs

# Seed Database (Users, Departments, Tenders, Requirements, Bids & Evidence)
npm run db:seed
```

### 3. Launch Application
```bash
# Terminal 1: Start FastAPI AI Microservice (Port 8000)
npm run ai-service

# Terminal 2: Start Next.js Development Server (Port 3000)
npm run dev
```

- Web Application: `http://localhost:3000`
- AI Microservice Documentation (Swagger UI): `http://localhost:8000/docs`

---

## 🔑 Seeded Demo Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Procurement Officer** | `officer@bidshield.demo` | `Officer@123` | Create Tenders, Run Compliance, Ask BidShield, Export PDF Reports |
| **Procurement Officer (Alt)** | `officer2@bidshield.demo` | `Officer@123` | Manage Solar & Medical Division Tenders |
| **Bidder (NovaTech)** | `bidder@novatech.demo` | `Bidder@123` | Upload Documents, Pre-Submission Self-Check, GSTIN Profile |
| **Bidder (Apex Digital)** | `bidder@apexdigital.demo` | `Bidder@123` | Compliant Bidder Submission & Verification |
| **System Administrator** | `admin@bidshield.demo` | `Admin@123` | User Management, Rule Configuration & Weight Tuning |
| **Compliance Auditor** | `auditor@bidshield.demo` | `Auditor@123` | View Reports, Independent Review & Forensic Audit Logs |

*Quick 1-Click Demo Login buttons are provided directly on the Login page for seamless evaluation.*

---

## 🐳 Docker Deployment

To build and run the entire stack (Next.js web app + FastAPI AI microservice) with a single command:
```bash
docker compose up --build
```

---

## 📜 Legal & Hackathon Disclaimer

All document files, taxpayer registration numbers (GSTIN/PAN), corporate profiles, and verification API responses generated in DEMO mode are synthetic and intended solely for hackathon evaluation and technical demonstration under SIH26100.
