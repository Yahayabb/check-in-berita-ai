import type { ClaimEvidence, EntityInclination, VerificationResult, Verdict } from '../types';
import { matchClaim } from './matchClaim';

interface NumericComparison {
  claimedValue: number;
  registryValue: number;
  matches: boolean;
  isAbsurd: boolean;
}

function insufficientEvidence(): VerificationResult {
  return {
    verdict: 'Insufficient evidence',
    claim: null,
    profile: null,
    score: 0,
    confidenceScore: 0,
    isAbsurd: false,
    matchedAlias: '',
  };
}

function extractPercentage(text: string): number | null {
  const match = text.match(/(-?\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:%|percent|peratus)/i);
  return match ? Number(match[1].replace(/,/g, '')) : null;
}

function compareNumericClaim(input: string, claim: ClaimEvidence): NumericComparison | null {
  const canCompareExactly =
    claim.unit === 'percent' &&
    (claim.operator === 'equals' || claim.operator === 'approximately equals') &&
    (claim.verdict === 'Supported' || claim.verdict === 'Mostly supported');

  if (!canCompareExactly) {
    return null;
  }

  const claimedValue = extractPercentage(input);
  const registryValue = extractPercentage(claim.officialValue);
  if (claimedValue === null || registryValue === null) {
    return null;
  }

  const matches =
    claim.operator === 'approximately equals'
      ? Math.round(claimedValue) === Math.round(registryValue)
      : claimedValue === registryValue;
  const difference = Math.abs(claimedValue - registryValue);

  return {
    claimedValue,
    registryValue,
    matches,
    isAbsurd:
      !matches &&
      (difference >= 50 || (registryValue !== 0 && Math.abs(claimedValue / registryValue) >= 10)),
  };
}

function contradiction(
  claim: ClaimEvidence,
  comparison: NumericComparison,
): ClaimEvidence {
  const { claimedValue, registryValue, isAbsurd } = comparison;
  const difference = Math.abs(claimedValue - registryValue);
  const absurdNote = isAbsurd
    ? ' The extreme discrepancy makes this an absurd false claim on the registry figures.'
    : '';

  return {
    ...claim,
    claimedValue: `${claimedValue}%`,
    explanation: `The submitted value (${claimedValue}%) directly conflicts with the registry comparison value (${registryValue}%) for ${claim.period}. This is false information, not a supported claim.${absurdNote}`,
    calculation: `Compare the claimed annual rate (${claimedValue}%) with the registry comparison value (${registryValue}%): ${claimedValue}% ≠ ${registryValue}%; the absolute difference is ${difference} percentage points.`,
  };
}

function confidenceScore(
  matchScore: number,
  hasNumericComparison: boolean,
  needsHumanVerification: boolean,
): number {
  const baseScore = hasNumericComparison ? 85 + matchScore * 15 : matchScore * 100;
  const ceiling = needsHumanVerification ? 95 : 99;
  return Math.round(Math.min(ceiling, baseScore));
}

export function verifyClaim(
  input: string,
  claims: ClaimEvidence[],
  profiles: EntityInclination[],
): VerificationResult {
  if (!input.trim()) {
    return insufficientEvidence();
  }

  const strictMatch = matchClaim(input, claims);
  const match = strictMatch ?? matchClaim(input, claims, { allowValueConflicts: true });
  if (match === null) {
    return insufficientEvidence();
  }

  const comparison = compareNumericClaim(input, match.claim);
  if (strictMatch === null && (comparison === null || comparison.matches)) {
    return insufficientEvidence();
  }

  const isContradicted = comparison !== null && !comparison.matches;
  const verdict: Verdict = isContradicted ? 'False information' : match.claim.verdict;
  const claim = isContradicted ? contradiction(match.claim, comparison) : match.claim;

  return {
    verdict,
    claim,
    profile: profiles.find((profile) => profile.id === match.claim.relatedProfileId) ?? null,
    score: match.score,
    confidenceScore: confidenceScore(match.score, comparison !== null, claim.needsHumanVerification),
    isAbsurd: comparison?.isAbsurd ?? false,
    matchedAlias: match.matchedAlias,
  };
}
