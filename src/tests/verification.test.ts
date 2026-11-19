import { describe, expect, it } from 'vitest';
import { normaliseText } from '../lib/normaliseText';
import { matchClaim } from '../lib/matchClaim';
import { verifyClaim } from '../lib/verifyClaim';
import type { ClaimEvidence, EntityInclination } from '../types';

const claim: ClaimEvidence = {
  id: 'claim-inflation-2024',
  canonicalClaim: 'Malaysia inflation rate fell to 1.8% in 2024',
  claimant: 'Example claimant',
  topic: 'Economy',
  operator: 'equals',
  unit: 'percent',
  geography: 'Malaysia',
  period: '2024',
  explanation: 'The annual inflation figure matches the cited official release.',
  calculation: 'Compare the claimed annual rate with the official annual rate.',
  sourceOrganisation: 'Department of Statistics Malaysia',
  sourceTitle: 'Consumer Price Index Malaysia 2024',
  sourceUrl: 'https://example.test/inflation-2024',
  sourceUpdatedAt: '2025-01-24',
  relatedProfileId: 'profile-example',
  aliases: [
    'Malaysia inflation rate fell to 1.8% in 2024',
    'Kadar inflasi Malaysia menurun kepada 1.8 peratus pada 2024',
  ],
  languages: ['en', 'ms'],
  claimedValue: '1.8%',
  officialValue: '1.8%',
  verdict: 'Supported',
  limitations: ['This fixture checks only the annual average rate.'],
  needsHumanVerification: false,
};

const profile: EntityInclination = {
  id: 'profile-example',
  entityName: 'Example claimant',
  entityType: 'politician',
  analysisStart: '2024-01-01',
  analysisEnd: '2024-12-31',
  sampleSize: 1,
  totalMeasurableClaims: 1,
  scrutinisedClaims: 1,
  officialDataCitations: 1,
  topicCounts: { Economy: 1 },
  sourceCounts: { government: 1, opposition: 0, expertOrNgo: 0 },
  observations: ['Local test fixture only.'],
  limitations: ['A single claim is not a representative sample.'],
};

describe('normaliseText', () => {
  it('removes punctuation and casing while preserving useful decimals and percent meaning', () => {
    expect(normaliseText('  INFLATION, Malaysia! Fell to 1.8% in 2024. ')).toBe(
      'inflation malaysia fell 1.8 percent 2024',
    );
  });

  it('removes common English stop words', () => {
    expect(normaliseText('The rate is in the economy and it was stable')).toBe(
      'rate economy stable',
    );
  });

  it('removes common Malay stop words', () => {
    expect(normaliseText('Ini adalah kadar inflasi di Malaysia yang rendah')).toBe(
      'kadar inflasi malaysia rendah',
    );
  });
});

describe('matchClaim', () => {
  it('returns a perfect score for an exact normalised alias match', () => {
    const result = matchClaim(
      'KADAR inflasi, Malaysia menurun kepada 1.8 peratus pada 2024!',
      [claim],
    );

    expect(result?.claim.id).toBe(claim.id);
    expect(result?.score).toBe(1);
    expect(result?.matchedAlias).toBe(claim.aliases[1]);
  });

  it('matches a paraphrased known claim above the threshold', () => {
    const result = matchClaim(
      "Did Malaysia's inflation fall to 1.8 percent during 2024?",
      [claim],
    );

    expect(result?.claim.id).toBe(claim.id);
    expect(result?.score).toBeGreaterThanOrEqual(0.42);
  });

  it('rejects an unrelated claim', () => {
    expect(
      matchClaim('Did the government build 500 schools in Sabah during 2024?', [claim]),
    ).toBeNull();
  });
});

describe('verifyClaim', () => {
  it('returns the deterministic fixture verdict and related profile', () => {
    const input = 'Malaysia inflation rate fell to 1.8% in 2024';
    const first = verifyClaim(input, [claim], [profile]);
    const second = verifyClaim(input, [claim], [profile]);

    expect(first).toEqual(second);
    expect(first.verdict).toBe('Supported');
    expect(first.claim).toBe(claim);
    expect(first.profile).toBe(profile);
    expect(first.score).toBe(1);
  });

  it('returns insufficient evidence for empty or unrelated input', () => {
    const expected = {
      verdict: 'Insufficient evidence',
      claim: null,
      profile: null,
      score: 0,
      matchedAlias: '',
    };

    expect(verifyClaim('   ', [claim], [profile])).toEqual(expected);
    expect(verifyClaim('Who won the football match last night?', [claim], [profile])).toEqual(
      expected,
    );
  });

  it('does not invent a truth percentage field or value', () => {
    const result = verifyClaim(claim.aliases[0], [claim], [profile]);

    expect(Object.keys(result).sort()).toEqual(
      ['claim', 'matchedAlias', 'profile', 'score', 'verdict'].sort(),
    );
    expect(result).not.toHaveProperty('truthPercentage');
    expect(result).not.toHaveProperty('truthPercent');
    expect(result).not.toHaveProperty('truthScore');
  });
});
