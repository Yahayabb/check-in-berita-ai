import type { ClaimEvidence } from '../types';
import { normaliseText } from './normaliseText';

const MATCH_THRESHOLD = 0.5;
const AMBIGUITY_MARGIN = 0.05;
const NEGATION_TOKENS = new Set(['no', 'not', 'never', 'tidak', 'tiada', 'bukan']);
const APPROXIMATION_TOKENS = new Set([
  'about',
  'approximately',
  'around',
  'roughly',
  'kira',
  'anggaran',
]);
const DIRECTION_GROUPS = [
  new Set(['increase', 'increased', 'increasing', 'rise', 'rose', 'rising', 'meningkat', 'naik']),
  new Set(['decrease', 'decreased', 'decreasing', 'fall', 'fell', 'falling', 'menurun', 'turun']),
];
const SUBNATIONAL_SCOPES = [
  ['sabah'],
  ['sarawak'],
  ['selangor'],
  ['johor'],
  ['kelantan'],
  ['terengganu'],
  ['perak'],
  ['perlis'],
  ['pahang'],
  ['kedah'],
  ['melaka'],
  ['negeri sembilan'],
  ['penang', 'pulau pinang'],
  ['labuan'],
  ['putrajaya'],
  ['kuala lumpur'],
];

interface ClaimMatch {
  claim: ClaimEvidence;
  score: number;
  matchedAlias: string;
}

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

function numericTokens(tokens: Set<string>): string[] {
  return [...tokens].filter((token) => /^\d+(?:\.\d+)?$/.test(token)).sort();
}

function hasAny(tokens: Set<string>, vocabulary: Set<string>): boolean {
  return [...tokens].some((token) => vocabulary.has(token));
}

function directionGroup(tokens: Set<string>): number {
  return DIRECTION_GROUPS.findIndex((group) => hasAny(tokens, group));
}

function subnationalScope(text: string): number {
  return SUBNATIONAL_SCOPES.findIndex((names) =>
    names.some((name) => new RegExp(`\\b${name}\\b`).test(text)),
  );
}

function hasSemanticConflict(input: string, alias: string): boolean {
  const inputTokens = new Set(input.split(' '));
  const aliasTokens = new Set(alias.split(' '));
  const inputNumbers = numericTokens(inputTokens);
  const aliasNumbers = numericTokens(aliasTokens);

  if (inputNumbers.join(' ') !== aliasNumbers.join(' ')) {
    return true;
  }

  if (hasAny(inputTokens, NEGATION_TOKENS) !== hasAny(aliasTokens, NEGATION_TOKENS)) {
    return true;
  }

  if (hasAny(inputTokens, APPROXIMATION_TOKENS) !== hasAny(aliasTokens, APPROXIMATION_TOKENS)) {
    return true;
  }

  const inputDirection = directionGroup(inputTokens);
  const aliasDirection = directionGroup(aliasTokens);
  if (inputDirection >= 0 && aliasDirection >= 0 && inputDirection !== aliasDirection) {
    return true;
  }

  const inputScope = subnationalScope(input);
  return inputScope >= 0 && inputScope !== subnationalScope(alias);
}

export function matchClaim(input: string, claims: ClaimEvidence[]): ClaimMatch | null {
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
  const candidates: ClaimMatch[] = [];

  for (const claim of claims) {
    let bestClaimMatch: ClaimMatch | null = null;

    for (const alias of claim.aliases) {
      const normalisedAlias = normaliseText(alias);
      if (!normalisedAlias || hasSemanticConflict(normalisedInput, normalisedAlias)) {
        continue;
      }

      const score = weightedJaccard(inputTokens, new Set(normalisedAlias.split(' ')));
      if (score >= MATCH_THRESHOLD && (bestClaimMatch === null || score > bestClaimMatch.score)) {
        bestClaimMatch = { claim, score, matchedAlias: alias };
      }
    }

    if (bestClaimMatch) {
      candidates.push(bestClaimMatch);
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  if (candidates.length > 1 && candidates[0].score - candidates[1].score < AMBIGUITY_MARGIN) {
    return null;
  }

  return candidates[0] ?? null;
}
