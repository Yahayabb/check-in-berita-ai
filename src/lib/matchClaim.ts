import type { ClaimEvidence } from '../types';
import { normaliseText } from './normaliseText';

const MATCH_THRESHOLD = 0.42;

function tokenWeight(token: string): number {
  return /^\d+(?:\.\d+)?$/.test(token) ? 2 : 1;
}

function weightedJaccard(input: Set<string>, alias: Set<string>): number {
  let intersectionWeight = 0;
  let unionWeight = 0;

  for (const token of new Set([...input, ...alias])) {
    const weight = tokenWeight(token);
    if (input.has(token) && alias.has(token)) {
      intersectionWeight += weight;
    }
    unionWeight += weight;
  }

  return unionWeight === 0 ? 0 : intersectionWeight / unionWeight;
}

export function matchClaim(
  input: string,
  claims: ClaimEvidence[],
): { claim: ClaimEvidence; score: number; matchedAlias: string } | null {
  const normalisedInput = normaliseText(input);
  if (!normalisedInput) {
    return null;
  }

  for (const claim of claims) {
    for (const alias of claim.aliases) {
      if (normaliseText(alias) === normalisedInput) {
        return { claim, score: 1, matchedAlias: alias };
      }
    }
  }

  const inputTokens = new Set(normalisedInput.split(' '));
  let bestMatch: { claim: ClaimEvidence; score: number; matchedAlias: string } | null = null;

  for (const claim of claims) {
    for (const alias of claim.aliases) {
      const normalisedAlias = normaliseText(alias);
      if (!normalisedAlias) {
        continue;
      }

      const score = weightedJaccard(inputTokens, new Set(normalisedAlias.split(' ')));
      if (score >= MATCH_THRESHOLD && (bestMatch === null || score > bestMatch.score)) {
        bestMatch = { claim, score, matchedAlias: alias };
      }
    }
  }

  return bestMatch;
}
