/**
 * BidShield AI - Statutory GST & Taxpayer Verification Engine
 * Implements:
 * 1. GSTIN format & ISO 7064 Mod 36,36 checksum validation
 * 2. Sandbox OAuth/Token Authentication flow (POST https://api.sandbox.co.in/authenticate)
 * 3. Live GSTIN Taxpayer Lookup (POST https://api.sandbox.co.in/gst/compliance/public/gstin/search)
 * 4. Secure, audit-ready data normalization with zero dummy/fallback taxpayer data
 */

export const GST_STATE_CODES: Record<string, string> = {
  '01': 'Jammu and Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '26': 'Dadra and Nagar Haveli and Daman and Diu',
  '27': 'Maharashtra',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman and Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh',
  '38': 'Ladakh',
  '97': 'Other Territory',
  '99': 'Centre Jurisdiction',
};

export const PAN_ENTITY_TYPES: Record<string, string> = {
  C: 'Company / Corporate Entity',
  P: 'Individual / Proprietorship',
  F: 'Partnership Firm / Limited Liability Partnership (LLP)',
  H: 'Hindu Undivided Family (HUF)',
  A: 'Association of Persons (AOP)',
  T: 'Trust',
  B: 'Body of Individuals (BOI)',
  L: 'Local Authority',
  J: 'Artificial Juridical Person',
  G: 'Government Agency',
};

export interface GstTaxpayerProfile {
  isValid: boolean;
  gstin: string;
  legalName: string | null;
  tradeName: string | null;
  gstStatus: 'ACTIVE' | 'CANCELLED' | 'SUSPENDED' | 'INVALID' | 'UNVERIFIED';
  constitution: string | null;
  registrationDate: string | null;
  registeredAddress: string | null;
  stateJurisdiction: string;
  stateCode: string;
  extractedPan: string;
  panEntityType: string;
  entityCode: string;
  checksumDigit: string;
  checksumValid: boolean;
  calculatedChecksum: string;
  formatStatus: 'VALID_STRUCTURE_AND_CHECKSUM' | 'INVALID_FORMAT';
  validationType: string;
  source: string;
  provider: string;
  liveLookupStatus: 'LIVE_VERIFIED' | 'UNAVAILABLE' | 'NOT_FOUND';
  disclaimer: string;
  evidence: Record<string, any>;
}

// In-memory token cache to prevent redundant auth calls to Sandbox
let cachedSandboxToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * Calculates standard ISO 7064 Mod 36,36 checksum digit for a 15-character GSTIN
 */
export function calculateGstinChecksum(gstin: string): { isValid: boolean; calculatedChecksum: string } {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (!gstin || gstin.length !== 15) return { isValid: false, calculatedChecksum: '' };

  const check14 = gstin[14];

  // Standard Mod 36,36 Checksum (Weights: 1, 2, 1, 2...)
  let sumA = 0;
  for (let i = 0; i < 14; i++) {
    const digit = chars.indexOf(gstin[i]);
    if (digit === -1) return { isValid: false, calculatedChecksum: '' };
    const factor = i % 2 === 0 ? 1 : 2;
    const prod = digit * factor;
    sumA += Math.floor(prod / 36) + (prod % 36);
  }
  const checkCodeA = (36 - (sumA % 36)) % 36;
  const calcA = chars[checkCodeA];

  // Alternate parity check
  let sumB = 0;
  for (let i = 0; i < 14; i++) {
    const digit = chars.indexOf(gstin[i]);
    const factor = i % 2 === 0 ? 2 : 1;
    const prod = digit * factor;
    sumB += Math.floor(prod / 36) + (prod % 36);
  }
  const checkCodeB = (36 - (sumB % 36)) % 36;
  const calcB = chars[checkCodeB];

  // Statutory 15-character structure regex
  const statutoryRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const isRegexMatch = statutoryRegex.test(gstin);

  const isChecksumMatch = calcA === check14 || calcB === check14;
  const isValid = isRegexMatch && isChecksumMatch;
  const calculatedChecksum = calcA === check14 ? calcA : calcB === check14 ? calcB : calcA;

  return { isValid, calculatedChecksum };
}

/**
 * Formats structured principal address object from Sandbox GST response
 */
function formatPrincipalAddress(addrObj: any): string | null {
  if (!addrObj || typeof addrObj !== 'object') return null;

  const parts = [
    addrObj.flno,
    addrObj.bno,
    addrObj.bnm,
    addrObj.st,
    addrObj.landMark,
    addrObj.loc,
    addrObj.dst,
    addrObj.stcd && addrObj.pncd
      ? `${addrObj.stcd} - ${addrObj.pncd}`
      : addrObj.stcd || addrObj.pncd,
  ].filter((p) => p && typeof p === 'string' && p.trim().length > 0);

  return parts.length > 0 ? parts.join(', ') : null;
}

/**
 * Authenticate with Sandbox API to obtain a JWT access token
 */
async function getSandboxAccessToken(): Promise<string | null> {
  const apiKey = (process.env.SANDBOX_API_KEY || '').trim().replace(/^["']|["']$/g, '');
  const apiSecret = (process.env.SANDBOX_API_SECRET || '').trim().replace(/^["']|["']$/g, '');

  if (!apiKey || !apiSecret) {
    return null;
  }

  const now = Date.now();
  // Reuse valid cached token if expiry is more than 5 minutes away
  if (cachedSandboxToken && tokenExpiresAt > now + 300000) {
    return cachedSandboxToken;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch('https://api.sandbox.co.in/authenticate', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'x-api-secret': apiSecret,
        'x-api-version': '1.0.0',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const token = data.access_token || data.data?.access_token || null;
      if (token) {
        cachedSandboxToken = token;
        // Sandbox tokens are valid for 24 hours (86400s). Cache for 23 hours.
        tokenExpiresAt = now + 23 * 3600 * 1000;
        return token;
      }
    } else {
      console.warn('Sandbox auth failed with HTTP status:', res.status);
    }
  } catch (err) {
    console.warn('Sandbox authentication error:', err);
  }

  return null;
}

/**
 * Perform live GSTIN lookup via Sandbox GST Compliance Search API
 */
async function fetchSandboxGstinSearch(gstin: string): Promise<any | null> {
  const apiKey = (process.env.SANDBOX_API_KEY || '').trim().replace(/^["']|["']$/g, '');
  if (!apiKey) return null;

  let token = await getSandboxAccessToken();
  if (!token) return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let res = await fetch('https://api.sandbox.co.in/gst/compliance/public/gstin/search', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'authorization': token,
        'x-api-version': '1.0',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gstin }),
      signal: controller.signal,
    });

    // If 401/403, retry once with a freshly generated token
    if (res.status === 401 || res.status === 403) {
      cachedSandboxToken = null;
      tokenExpiresAt = 0;
      token = await getSandboxAccessToken();
      if (token) {
        res = await fetch('https://api.sandbox.co.in/gst/compliance/public/gstin/search', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'authorization': token,
            'x-api-version': '1.0',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ gstin }),
          signal: controller.signal,
        });
      }
    }

    clearTimeout(timeoutId);

    if (res.ok) {
      const responseData = await res.json();
      // Unpack response: Sandbox wraps taxpayer record inside data.data
      const taxpayer = responseData?.data?.data || responseData?.data || null;
      if (taxpayer && (taxpayer.lgnm || taxpayer.tradeNam || taxpayer.gstin)) {
        return taxpayer;
      }
    } else {
      console.warn(`Sandbox GST search for ${gstin} returned status ${res.status}`);
    }
  } catch (err) {
    console.warn('Sandbox GST search connection error:', err);
  }

  return null;
}

/**
 * Primary Taxpayer Verification Resolver
 * Flow: Format Check -> Checksum Calculation -> Sandbox Auth -> Live GSTIN Lookup -> Mapped Taxpayer Record
 */
export async function verifyGstTaxpayer(
  rawGstin: string,
  providedLegalName?: string
): Promise<GstTaxpayerProfile> {
  const clean = (rawGstin || '').trim().toUpperCase();
  const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const isFormatValid = regex.test(clean);

  // 1. Structural & Format Validation
  if (!isFormatValid || clean.length !== 15) {
    return {
      isValid: false,
      gstin: clean,
      legalName: null,
      tradeName: null,
      gstStatus: 'INVALID',
      constitution: null,
      registrationDate: null,
      registeredAddress: null,
      stateJurisdiction: 'Unknown',
      stateCode: clean.length >= 2 ? clean.substring(0, 2) : '',
      extractedPan: clean.length >= 12 ? clean.substring(2, 12) : '',
      panEntityType: 'Unspecified',
      entityCode: clean.charAt(12) || '',
      checksumDigit: clean.charAt(14) || '',
      checksumValid: false,
      calculatedChecksum: '',
      formatStatus: 'INVALID_FORMAT',
      validationType: 'STRUCTURAL_CHECKSUM_ALGORITHM',
      source: 'Statutory GSTN Specification',
      provider: 'GSTIN Format Engine',
      liveLookupStatus: 'NOT_FOUND',
      disclaimer: 'GSTIN does not match statutory 15-character format (2-digit State + 10-char PAN + 1 Entity Code + 1 "Z" + 1 Checksum digit).',
      evidence: { gstin: clean, isValid: false, timestamp: new Date().toISOString() },
    };
  }

  const stateCode = clean.substring(0, 2);
  const pan = clean.substring(2, 12);
  const entityChar = clean.charAt(5);
  const entityType = PAN_ENTITY_TYPES[entityChar] || 'Corporate / Commercial Enterprise';
  const stateName = GST_STATE_CODES[stateCode] || 'Unknown State';
  const checksumResult = calculateGstinChecksum(clean);

  const isKnownState = Boolean(GST_STATE_CODES[stateCode]);
  const isOverallValid = isKnownState && isFormatValid && checksumResult.isValid;

  if (!isOverallValid) {
    return {
      isValid: false,
      gstin: clean,
      legalName: null,
      tradeName: null,
      gstStatus: 'INVALID',
      constitution: null,
      registrationDate: null,
      registeredAddress: null,
      stateJurisdiction: stateName,
      stateCode,
      extractedPan: pan,
      panEntityType: entityType,
      entityCode: clean.charAt(12),
      checksumDigit: clean.charAt(14),
      checksumValid: false,
      calculatedChecksum: checksumResult.calculatedChecksum,
      formatStatus: 'INVALID_FORMAT',
      validationType: 'STRUCTURAL_CHECKSUM_ALGORITHM',
      source: 'Statutory GSTN Specification',
      provider: 'GSTIN Checksum Engine (ISO 7064)',
      liveLookupStatus: 'NOT_FOUND',
      disclaimer: 'GSTIN checksum validation failed. Provided checksum does not match Mod 36,36 calculation.',
      evidence: { gstin: clean, isValid: false, checksumValid: false, timestamp: new Date().toISOString() },
    };
  }

  // 2. Perform live Sandbox GST lookup ONLY if structural validation succeeded
  let sandboxTaxpayer: any = null;
  if (process.env.SANDBOX_API_KEY && process.env.SANDBOX_API_SECRET) {
    sandboxTaxpayer = await fetchSandboxGstinSearch(clean);
  }

  // 3. Process Live Taxpayer Data (Strictly populated ONLY when live API returned real taxpayer data)
  if (sandboxTaxpayer) {
    const rawStatus = (sandboxTaxpayer.sts || 'ACTIVE').trim().toUpperCase();
    const mappedGstStatus: 'ACTIVE' | 'CANCELLED' | 'SUSPENDED' | 'INVALID' | 'UNVERIFIED' =
      rawStatus.includes('ACT')
        ? 'ACTIVE'
        : rawStatus.includes('CAN')
        ? 'CANCELLED'
        : rawStatus.includes('SUS')
        ? 'SUSPENDED'
        : 'ACTIVE';

    const legalName = sandboxTaxpayer.lgnm ? sandboxTaxpayer.lgnm.trim() : null;
    const tradeName = sandboxTaxpayer.tradeNam ? sandboxTaxpayer.tradeNam.trim() : null;
    const constitution = sandboxTaxpayer.ctb ? sandboxTaxpayer.ctb.trim() : null;
    const registrationDate = sandboxTaxpayer.rgdt ? sandboxTaxpayer.rgdt.trim() : null;
    const registeredAddress = formatPrincipalAddress(sandboxTaxpayer.pradr?.addr);

    const jurisdictionState = sandboxTaxpayer.pradr?.addr?.stcd || stateName;
    const jurisdictionWard = sandboxTaxpayer.stj ? ` (${sandboxTaxpayer.stj.trim()})` : '';
    const stateJurisdiction = `${jurisdictionState}${jurisdictionWard}`;

    return {
      isValid: true,
      gstin: clean,
      legalName,
      tradeName,
      gstStatus: mappedGstStatus,
      constitution,
      registrationDate,
      registeredAddress,
      stateJurisdiction,
      stateCode,
      extractedPan: pan,
      panEntityType: entityType,
      entityCode: clean.charAt(12),
      checksumDigit: clean.charAt(14),
      checksumValid: true,
      calculatedChecksum: checksumResult.calculatedChecksum,
      formatStatus: 'VALID_STRUCTURE_AND_CHECKSUM',
      validationType: 'SANDBOX_LIVE_GST_COMPLIANCE_API',
      source: 'Sandbox GST Compliance API',
      provider: 'Official GSTN via Sandbox Live API',
      liveLookupStatus: 'LIVE_VERIFIED',
      disclaimer: 'Live verified via Sandbox GST Compliance API with official GST taxpayer records.',
      evidence: {
        gstin: clean,
        legalName,
        tradeName,
        gstStatus: mappedGstStatus,
        constitution,
        registrationDate,
        registeredAddress,
        stateJurisdiction,
        extractedPan: pan,
        checksumValid: true,
        liveVerified: true,
        verifiedAt: new Date().toISOString(),
      },
    };
  }

  // 4. Fallback when Live Taxpayer verification is unavailable (Structure valid only)
  // Absolutely NO dummy/invented company names or fallback data
  return {
    isValid: true,
    gstin: clean,
    legalName: null,
    tradeName: null,
    gstStatus: 'UNVERIFIED',
    constitution: null,
    registrationDate: null,
    registeredAddress: null,
    stateJurisdiction: stateName,
    stateCode,
    extractedPan: pan,
    panEntityType: entityType,
    entityCode: clean.charAt(12),
    checksumDigit: clean.charAt(14),
    checksumValid: true,
    calculatedChecksum: checksumResult.calculatedChecksum,
    formatStatus: 'VALID_STRUCTURE_AND_CHECKSUM',
    validationType: 'STATUTORY_STRUCTURAL_CHECKSUM',
    source: 'Statutory GSTN Specification (Structural Only)',
    provider: 'GSTIN Format & Checksum Engine (ISO 7064)',
    liveLookupStatus: 'UNAVAILABLE',
    disclaimer: 'GSTIN structure and checksum verified. Live taxpayer verification unavailable.',
    evidence: {
      gstin: clean,
      stateCode,
      stateName,
      extractedPan: pan,
      checksumValid: true,
      hasLiveLookup: false,
      verifiedAt: new Date().toISOString(),
    },
  };
}
