import os

def create_simple_pdf(filename, title, content_lines):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    # Format text into PDF stream format
    text_objects = []
    text_objects.append(f"BT /F1 16 Tf 50 750 Td ({title}) Tj ET")
    
    y = 710
    for line in content_lines:
        # Escape parenthesis
        clean_line = line.replace("(", "\\(").replace(")", "\\)")
        text_objects.append(f"BT /F1 10 Tf 50 {y} Td ({clean_line}) Tj ET")
        y -= 18
        if y < 50:
            break
            
    stream_content = "\n".join(text_objects)
    stream_len = len(stream_content)
    
    pdf_template = f"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length {stream_len} >>
stream
{stream_content}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000295 + len(stream_content) 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
400
%%EOF"""

    with open(filename, "wb") as f:
        f.write(pdf_template.encode('latin-1'))
    print(f"Generated PDF: {filename}")

def main():
    base_dir = os.path.join(os.path.dirname(__file__), "..", "storage", "demo-documents")
    
    # 01 Tender
    create_simple_pdf(
        os.path.join(base_dir, "01_Tender_GeM_IT_Infrastructure.pdf"),
        "GOVERNMENT e-MARKETPLACE (GeM) TENDER DOCUMENT",
        [
            "Tender Reference: GEM-DEMO-2026-IT-001",
            "Department: Ministry of Petroleum & Natural Gas - IT Division",
            "Title: Enterprise Cloud & IT Infrastructure Modernization",
            "Estimated Tender Value: INR 25,00,00,000 (25 Crore)",
            "Submission Deadline: 2026-09-30",
            "",
            "SECTION 1: MANDATORY ELIGIBILITY REQUIREMENTS",
            "R1. GST Registration: Bidder must possess valid active GSTIN certificate.",
            "R2. PAN Card: Bidder must possess valid Income Tax Permanent Account Number.",
            "R3. Financial Turnover: Minimum average annual turnover of INR 10.0 Crore in last 3 financial years.",
            "R4. Relevant Experience: Minimum 5 years of experience in enterprise IT infrastructure deployment.",
            "R5. OEM Authorization: Valid authorization letter from Original Equipment Manufacturer (OEM).",
            "R6. Quality Certification: Valid ISO 9001:2015 Quality Management System Certification.",
            "R7. Local Content: Minimum 50% Class-I Local Content declaration under Make in India policy.",
            "R8. MSME Registration: Valid Udyam Registration Certificate for MSME preference benefits."
        ]
    )

    # Bidder A Documents (NovaTech Systems Pvt Ltd)
    create_simple_pdf(
        os.path.join(base_dir, "02_BidderA_GST_Certificate.pdf"),
        "GOVERNMENT OF INDIA - GOODS AND SERVICES TAX REGISTRATION",
        [
            "Registration Number (GSTIN): 27AAACN1234Q1Z5",
            "Legal Name: NovaTech Systems Private Limited",
            "Trade Name: NovaTech Enterprise Solutions",
            "Date of Liability: 2018-04-12",
            "Status: ACTIVE",
            "Jurisdiction: State - Maharashtra, Division - Mumbai Central",
            "Address: 402, Enterprise Park, Andheri East, Mumbai 400069"
        ]
    )

    create_simple_pdf(
        os.path.join(base_dir, "03_BidderA_PAN_Certificate.pdf"),
        "INCOME TAX DEPARTMENT - PERMANENT ACCOUNT NUMBER",
        [
            "PAN: AAACN1234Q",
            "Name: NovaTech Systems Private Limited",
            "Date of Incorporation: 2018-04-05",
            "Category: Company / Firm",
            "Assessing Officer: WARD 12(3) MUMBAI"
        ]
    )

    create_simple_pdf(
        os.path.join(base_dir, "04_BidderA_Udyam_Certificate.pdf"),
        "UDYAM REGISTRATION CERTIFICATE - MSME",
        [
            "Udyam Registration Number: UDYAM-MH-03-0012345",
            "Enterprise Name: NovaTech Systems Private Limited",
            "Major Activity: Services / IT Consulting & Infrastructure",
            "Enterprise Type: Small Enterprise",
            "Date of Incorporation: 2018-04-05"
        ]
    )

    create_simple_pdf(
        os.path.join(base_dir, "05_BidderA_Financial_Statement.pdf"),
        "AUDITED FINANCIAL STATEMENT & TURNOVER CERTIFICATE",
        [
            "Entity: NovaTech Systems Private Limited",
            "Auditor: R. S. Sharma & Associates Chartered Accountants",
            "Annual Turnover Summary:",
            "  - Financial Year 2023-24: INR 11.20 Crore",
            "  - Financial Year 2024-25: INR 12.80 Crore",
            "  - Financial Year 2025-26: INR 13.10 Crore",
            "Average Annual Turnover (Last 3 Years): INR 12.37 Crore",
            "Requirement Evaluation: Threshold INR 10.0 Cr - COMPLIANT"
        ]
    )

    create_simple_pdf(
        os.path.join(base_dir, "06_BidderA_Experience_Certificate.pdf"),
        "WORK EXPERIENCE & COMPLETED PROJECTS CERTIFICATE",
        [
            "Issued To: NovaTech Systems Private Limited",
            "Client: Western State Power Distribution Corp",
            "Contract Period: June 2023 to May 2026 (3 Years Total)",
            "Scope: Data Center & Infrastructure Management",
            "Total Demonstrated Experience: 3 Years",
            "Note: Required tender experience is 5 years. Provided: 3 years."
        ]
    )

    create_simple_pdf(
        os.path.join(base_dir, "07_BidderA_ISO9001_Certificate.pdf"),
        "ISO 9001:2015 QUALITY MANAGEMENT CERTIFICATE",
        [
            "Certificate Number: ISO-9001-2024-NT8821",
            "Certified Organization: NovaTech Systems Private Limited",
            "Standard: ISO 9001:2015",
            "Scope: Provision of IT Systems Integration & Managed Infrastructure",
            "Valid Until: 2028-11-20"
        ]
    )

    create_simple_pdf(
        os.path.join(base_dir, "08_BidderA_Local_Content_Declaration.pdf"),
        "LOCAL CONTENT DECLARATION UNDER MAKE IN INDIA",
        [
            "Declaration Reference: NT/MII/2026/089",
            "Bidder Name: NovaTech Systems Private Limited",
            "Tender Reference: GEM-DEMO-2026-IT-001",
            "Declared Local Content Percentage: 42.0%",
            "Classification: Class-II Local Supplier (Below 50% Threshold)",
            "Required Threshold: 50.0% Minimum Local Content"
        ]
    )

    create_simple_pdf(
        os.path.join(base_dir, "17_BidderA_Company_Profile_Contradiction.pdf"),
        "NOVATECH SYSTEMS - CORPORATE OVERVIEW & AUDIT PROFILE",
        [
            "Company Name: NovaTech Systems Private Limited",
            "Official Year of Establishment: 2018",
            "Inconsistency Warning:",
            "Company registration date is April 2018 (Company Age = 8 Years),",
            "whereas submitted Experience Certificate documents relevant projects starting 2023 (3 Years).",
            "Potential contradiction flagged for officer manual verification."
        ]
    )

    # Bidder B Documents (Apex Digital Infrastructure Limited)
    create_simple_pdf(
        os.path.join(base_dir, "09_BidderB_GST_Certificate.pdf"),
        "GOVERNMENT OF INDIA - GOODS AND SERVICES TAX REGISTRATION",
        [
            "Registration Number (GSTIN): 07BBBCA9876R1Z2",
            "Legal Name: Apex Digital Infrastructure Limited",
            "Date of Liability: 2015-09-10",
            "Status: ACTIVE",
            "Address: 101-105 Apex Tower, Barakhamba Road, New Delhi 110001"
        ]
    )

    create_simple_pdf(
        os.path.join(base_dir, "10_BidderB_PAN_Certificate.pdf"),
        "INCOME TAX DEPARTMENT - PERMANENT ACCOUNT NUMBER",
        [
            "PAN: BBBCA9876R",
            "Name: Apex Digital Infrastructure Limited",
            "Date of Incorporation: 2015-09-01",
            "Category: Public Limited Company"
        ]
    )

    create_simple_pdf(
        os.path.join(base_dir, "11_BidderB_Udyam_Certificate.pdf"),
        "UDYAM REGISTRATION CERTIFICATE - MSME",
        [
            "Udyam Registration Number: UDYAM-DL-01-0098765",
            "Enterprise Name: Apex Digital Infrastructure Limited",
            "Enterprise Type: Medium Enterprise"
        ]
    )

    create_simple_pdf(
        os.path.join(base_dir, "12_BidderB_Financial_Statement.pdf"),
        "AUDITED FINANCIAL STATEMENT & TURNOVER CERTIFICATE",
        [
            "Entity: Apex Digital Infrastructure Limited",
            "Average Annual Turnover (Last 3 Years): INR 48.50 Crore",
            "FY 2023-24: INR 42.10 Cr | FY 2024-25: INR 49.80 Cr | FY 2025-26: INR 53.60 Cr",
            "Requirement Evaluation: COMPLIANT (Exceeds 10 Cr Threshold)"
        ]
    )

    create_simple_pdf(
        os.path.join(base_dir, "13_BidderB_Experience_Certificate.pdf"),
        "WORK EXPERIENCE & COMPLETED PROJECTS CERTIFICATE",
        [
            "Issued To: Apex Digital Infrastructure Limited",
            "Client: National Oil & Gas Pipeline Grid",
            "Contract Period: 2017 to 2025 (8 Years Demonstrated Experience)",
            "Scope: Pan-India Data Center & Infrastructure Support",
            "Requirement Evaluation: COMPLIANT (Exceeds 5 Years Requirement)"
        ]
    )

    create_simple_pdf(
        os.path.join(base_dir, "14_BidderB_OEM_Authorization.pdf"),
        "ORIGINAL EQUIPMENT MANUFACTURER (OEM) AUTHORIZATION",
        [
            "Authorization Ref: OEM/APEX/2026/9941",
            "Issued By: Global Hardware Technologies Inc.",
            "Authorized Partner: Apex Digital Infrastructure Limited",
            "Scope: Supply, Installation, Warranty & Enterprise Support for GeM Tender",
            "Validity: Valid through tender execution period"
        ]
    )

    create_simple_pdf(
        os.path.join(base_dir, "15_BidderB_ISO9001_Certificate.pdf"),
        "ISO 9001:2015 QUALITY MANAGEMENT CERTIFICATE",
        [
            "Certificate Number: ISO-9001-2025-APX1002",
            "Certified Organization: Apex Digital Infrastructure Limited",
            "Standard: ISO 9001:2015",
            "Valid Until: 2029-06-30"
        ]
    )

    create_simple_pdf(
        os.path.join(base_dir, "16_BidderB_Local_Content_Declaration.pdf"),
        "LOCAL CONTENT DECLARATION UNDER MAKE IN INDIA",
        [
            "Bidder Name: Apex Digital Infrastructure Limited",
            "Declared Local Content Percentage: 68.5%",
            "Classification: Class-I Local Supplier (Exceeds 50% Threshold)",
            "Requirement Evaluation: COMPLIANT"
        ]
    )

    print("All 17 synthetic demo PDFs successfully generated!")

if __name__ == "__main__":
    main()
