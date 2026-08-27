const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'storage', 'demo-documents');
const uploadsDir = path.join(process.cwd(), 'storage', 'uploads');

const categories = [
  'legal',
  'financial',
  'technical',
  'experience',
  'local-content',
  'certifications',
  'documentation',
  'tenders',
];

// Ensure directories exist
[baseDir, uploadsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

categories.forEach((cat) => {
  const dir = path.join(baseDir, cat);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('Created demo document category directories in storage/demo-documents/');

// Helper to create synthetic valid PDF content buffer
function createSyntheticPdf(title, contentText) {
  const header = '%PDF-1.4\n';
  const body = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kinds [/PDF] /Count 1 /Kids [3 0 R] >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length ${contentText.length + 50} >>\nstream\nBT\n/F1 12 Tf\n50 750 Td\n(${title}) Tj\n0 -20 Td\n(${contentText.replace(/[()]/g, '')}) Tj\nET\nendstream\nendobj\n`;
  const xref = `xref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000133 00000 n \n0000000228 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n350\n%%EOF\n`;
  return Buffer.from(header + body + xref, 'utf-8');
}

const pdfDefinitions = [
  // Tenders
  { cat: 'tenders', file: '01_Tender_GeM_IT_Infrastructure.pdf', title: 'Tender GEM-DEMO-2026-IT-001 Notice', text: 'Enterprise Cloud and IT Infrastructure Modernization RFP Notice' },
  { cat: 'tenders', file: '02_Tender_GeM_Solar_Power_Plant.pdf', title: 'Tender GEM-DEMO-2026-SOLAR-002 Notice', text: '100MW Floating Solar PV Power Plant and Energy Storage RFP Notice' },
  { cat: 'tenders', file: '03_Tender_GeM_Smart_City_Grid.pdf', title: 'Tender GEM-DEMO-2026-SMART-003 Notice', text: 'Smart City AI Surveillance Grid and Command Center RFP Notice' },
  { cat: 'tenders', file: '04_Tender_GeM_Healthcare_ICU_Supply.pdf', title: 'Tender GEM-DEMO-2026-MED-004 Notice', text: 'AI Diagnostic Medical Equipment and ICU Infrastructure Supply RFP Notice' },

  // Legal
  { cat: 'legal', file: 'GST_Registration_Certificate_NovaTech.pdf', title: 'GST Registration Certificate', text: 'GSTIN: 27AAACN1234Q1Z5 Legal Name: NovaTech Systems Private Limited Status: ACTIVE' },
  { cat: 'legal', file: 'PAN_Certificate_NovaTech.pdf', title: 'PAN Certificate', text: 'PAN: AAACN1234Q Name: NovaTech Systems Private Limited Date: 2018-04-05' },
  { cat: 'legal', file: 'GST_Registration_Certificate_Apex.pdf', title: 'GST Registration Certificate', text: 'GSTIN: 07BBBCA9876R1Z2 Legal Name: Apex Digital Infrastructure Limited Status: ACTIVE' },
  { cat: 'legal', file: 'PAN_Certificate_Apex.pdf', title: 'PAN Certificate', text: 'PAN: BBBCA9876R Name: Apex Digital Infrastructure Limited' },
  { cat: 'legal', file: 'GST_Registration_Certificate_Solaria.pdf', title: 'GST Registration Certificate', text: 'GSTIN: 24CCCS9988P1Z3 Legal Name: Solaria CleanTech Energy Pvt Ltd Status: ACTIVE' },

  // Financial
  { cat: 'financial', file: 'CA_Audited_Turnover_NovaTech.pdf', title: 'CA Audited Financial Statement', text: 'Average Annual Turnover (Last 3 Years): INR 12.37 Crore' },
  { cat: 'financial', file: 'CA_Audited_Turnover_Apex.pdf', title: 'CA Audited Financial Statement', text: 'Average Annual Turnover (Last 3 Years): INR 48.50 Crore' },
  { cat: 'financial', file: 'CA_Audited_Turnover_Solaria.pdf', title: 'CA Audited Financial Statement', text: 'Average Annual Turnover (Last 3 Years): INR 165.0 Crore' },

  // Technical
  { cat: 'technical', file: 'OEM_Authorization_Apex.pdf', title: 'OEM Authorization Certificate', text: 'OEM Authorization Ref OEM/APEX/2026/9941 issued by Global Hardware Tech Inc.' },
  { cat: 'technical', file: 'OEM_Authorization_Solaria.pdf', title: 'OEM Authorization Certificate', text: 'OEM Authorization Ref OEM/SOLAR/2026/1029 issued by SolarTech Global Modules' },
  { cat: 'technical', file: 'Technical_Specification_Compliance_NovaTech.pdf', title: 'Technical Compliance Sheet', text: 'Technical specification compliance matrix for Enterprise IT Hardware' },

  // Experience
  { cat: 'experience', file: 'Experience_Certificate_NovaTech.pdf', title: 'Work Experience Certificate', text: 'Contract Period: June 2023 to May 2026. Total Demonstrated Experience: 3 Years' },
  { cat: 'experience', file: 'Experience_Certificate_Apex.pdf', title: 'Work Experience Certificate', text: 'Demonstrated Experience: 8 Years National Oil and Gas Pipeline Grid Project' },
  { cat: 'experience', file: 'Experience_Certificate_Solaria.pdf', title: 'Work Experience Certificate', text: 'Demonstrated Experience: 6 Years Utility Scale Solar Projects' },

  // Local Content
  { cat: 'local-content', file: 'Make_In_India_Declaration_NovaTech.pdf', title: 'Make In India Declaration', text: 'Declared Local Content Percentage: 42.0 percent Class-II Supplier' },
  { cat: 'local-content', file: 'Make_In_India_Declaration_Apex.pdf', title: 'Make In India Declaration', text: 'Declared Local Content Percentage: 68.5 percent Class-I Supplier' },
  { cat: 'local-content', file: 'Make_In_India_Declaration_Solaria.pdf', title: 'Make In India Declaration', text: 'Declared Local Content Percentage: 75.0 percent Class-I Supplier' },

  // Certifications
  { cat: 'certifications', file: 'ISO9001_Certificate_NovaTech.pdf', title: 'ISO 9001:2015 Quality Certificate', text: 'ISO 9001:2015 Quality Certificate ISO-9001-2024-NT8821 Valid until 2028-11-20' },
  { cat: 'certifications', file: 'ISO9001_Certificate_Apex.pdf', title: 'ISO 9001:2015 Quality Certificate', text: 'ISO 9001:2015 Certificate ISO-9001-2025-APX1002 valid until June 2029' },

  // Documentation
  { cat: 'documentation', file: 'Udyam_MSME_Certificate_NovaTech.pdf', title: 'Udyam MSME Certificate', text: 'Udyam Registration Number: UDYAM-MH-03-0012345 Small Enterprise' },
  { cat: 'documentation', file: 'Udyam_MSME_Certificate_Apex.pdf', title: 'Udyam MSME Certificate', text: 'Udyam Registration Number: UDYAM-DL-01-0098765 Medium Enterprise' },
];

pdfDefinitions.forEach((def) => {
  const filePath = path.join(baseDir, def.cat, def.file);
  const pdfBuf = createSyntheticPdf(def.title, def.text);
  fs.writeFileSync(filePath, pdfBuf);
  console.log(`Created PDF: ${def.cat}/${def.file}`);
});

console.log('Demo documents organized successfully into category subdirectories!');
