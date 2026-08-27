export interface RiskInput {
  totalRequirements: number;
  mandatoryRequirementsCount: number;
  missingMandatoryCount: number;
  nonCompliantCount: number;
  partialCount: number;
  contradictionCount: number;
  unverifiedEvidenceCount: number;
  averageConfidence: number; // 0 to 1
  lowQualityDocumentsCount: number;
}

export function calculateBidRisk(input: RiskInput): {
  complianceScore: number;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  breakdown: {
    missingMandatoryImpact: number;
    nonComplianceImpact: number;
    contradictionImpact: number;
    unverifiedImpact: number;
    qualityImpact: number;
    confidenceImpact: number;
  };
} {
  const {
    totalRequirements,
    mandatoryRequirementsCount,
    missingMandatoryCount,
    nonCompliantCount,
    partialCount,
    contradictionCount,
    unverifiedEvidenceCount,
    averageConfidence,
    lowQualityDocumentsCount,
  } = input;

  // Calculate compliance score (0-100%)
  const passedCount = totalRequirements - (missingMandatoryCount + nonCompliantCount + (partialCount * 0.5));
  const complianceScore = Math.max(0, Math.min(100, (passedCount / (totalRequirements || 1)) * 100));

  // Risk Weights:
  // Missing mandatory requirements: 30%
  // Non-compliance: 30%
  // Contradictions: 15%
  // Unverified evidence: 10%
  // Document quality: 5%
  // Evidence confidence: 10%

  const missingMandatoryImpact = Math.min(30, (missingMandatoryCount / (mandatoryRequirementsCount || 1)) * 30);
  const nonComplianceImpact = Math.min(30, ((nonCompliantCount + partialCount * 0.5) / (totalRequirements || 1)) * 30);
  const contradictionImpact = Math.min(15, contradictionCount * 7.5);
  const unverifiedImpact = Math.min(10, (unverifiedEvidenceCount / (totalRequirements || 1)) * 10);
  const qualityImpact = Math.min(5, lowQualityDocumentsCount * 2.5);
  const confidenceImpact = Math.max(0, (1 - averageConfidence) * 10);

  const rawRiskScore = Math.round(
    missingMandatoryImpact +
    nonComplianceImpact +
    contradictionImpact +
    unverifiedImpact +
    qualityImpact +
    confidenceImpact
  );

  const riskScore = Math.max(0, Math.min(100, rawRiskScore));

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (riskScore >= 61) {
    riskLevel = 'HIGH';
  } else if (riskScore >= 31) {
    riskLevel = 'MEDIUM';
  }

  return {
    complianceScore: Math.round(complianceScore * 10) / 10,
    riskScore,
    riskLevel,
    breakdown: {
      missingMandatoryImpact: Math.round(missingMandatoryImpact * 10) / 10,
      nonComplianceImpact: Math.round(nonComplianceImpact * 10) / 10,
      contradictionImpact: Math.round(contradictionImpact * 10) / 10,
      unverifiedImpact: Math.round(unverifiedImpact * 10) / 10,
      qualityImpact: Math.round(qualityImpact * 10) / 10,
      confidenceImpact: Math.round(confidenceImpact * 10) / 10,
    },
  };
}
