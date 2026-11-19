export type Verdict =
  | 'Supported'
  | 'Mostly supported'
  | 'Missing context'
  | 'Contradicted'
  | 'False information'
  | 'Insufficient evidence';

export interface ClaimEvidence {
  id: string;
  canonicalClaim: string;
  claimant: string;
  topic: string;
  operator: string;
  unit: string;
  geography: string;
  period: string;
  explanation: string;
  calculation: string;
  sourceOrganisation: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceUpdatedAt: string;
  relatedProfileId: string;
  aliases: string[];
  languages: Array<'en' | 'ms'>;
  claimedValue: string;
  officialValue: string;
  verdict: Exclude<Verdict, 'Insufficient evidence'>;
  limitations: string[];
  needsHumanVerification: boolean;
}

export interface EntityInclination {
  id: string;
  entityName: string;
  entityType: string;
  analysisStart: string;
  analysisEnd: string;
  sampleSize: number;
  totalMeasurableClaims: number;
  scrutinisedClaims: number;
  officialDataCitations: number;
  topicCounts: Record<string, number>;
  sourceCounts: {
    government: number;
    opposition: number;
    expertOrNgo: number;
  };
  observations: string[];
  limitations: string[];
}

export interface VerificationResult {
  verdict: Verdict;
  claim: ClaimEvidence | null;
  profile: EntityInclination | null;
  score: number;
  confidenceScore: number;
  isAbsurd: boolean;
  matchedAlias: string;
}
