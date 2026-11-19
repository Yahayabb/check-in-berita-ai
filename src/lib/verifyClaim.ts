import type { ClaimEvidence, EntityInclination, VerificationResult } from '../types';
import { matchClaim } from './matchClaim';

function insufficientEvidence(): VerificationResult {
  return {
    verdict: 'Insufficient evidence',
    claim: null,
    profile: null,
    score: 0,
    matchedAlias: '',
  };
}

export function verifyClaim(
  input: string,
  claims: ClaimEvidence[],
  profiles: EntityInclination[],
): VerificationResult {
  if (!input.trim()) {
    return insufficientEvidence();
  }

  const match = matchClaim(input, claims);
  if (match === null) {
    return insufficientEvidence();
  }

  return {
    verdict: match.claim.verdict,
    claim: match.claim,
    profile: profiles.find((profile) => profile.id === match.claim.relatedProfileId) ?? null,
    score: match.score,
    matchedAlias: match.matchedAlias,
  };
}
