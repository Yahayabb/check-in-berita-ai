import { describe, expect, it } from 'vitest';
import { claims } from '../data/claims';
import { profiles } from '../data/profiles';
import { verifyClaim } from '../lib/verifyClaim';

describe('demo evidence flow', () => {
  it.each([
    "Malaysia's inflation rate was 1.8% in 2024.",
    'Kadar inflasi Malaysia ialah 1.8% pada 2024.',
  ])('matches the prepared claim: %s', (input) => {
    const result = verifyClaim(input, claims, profiles);
    expect(result.claim?.id).toBe(claims[0].id);
    expect(result.verdict).toBe(claims[0].verdict);
  });

  it('returns insufficient evidence for an unrelated claim', () => {
    const result = verifyClaim('The durian orchestra launched a lunar ferry.', claims, profiles);
    expect(result.verdict).toBe('Insufficient evidence');
    expect(result.claim).toBeNull();
  });

  it('exposes source, calculation and human-verification metadata', () => {
    const result = verifyClaim(claims[0].aliases[0], claims, profiles);
    expect(result.claim?.sourceOrganisation).toBeTruthy();
    expect(result.claim?.calculation).toBeTruthy();
    expect(result.claim?.needsHumanVerification).toBe(true);
  });

  it('derives profile rates from integer counts', () => {
    for (const profile of profiles) {
      const topicTotal = Object.values(profile.topicCounts).reduce((sum, count) => sum + count, 0);
      expect(topicTotal).toBe(profile.sampleSize);
      expect(profile.scrutinisedClaims / profile.totalMeasurableClaims).toBeLessThanOrEqual(1);
      expect(profile.officialDataCitations / profile.sampleSize).toBeLessThanOrEqual(1);
      expect(JSON.stringify(profile)).not.toContain('truthPercentage');
    }
  });
});
