import type { ClaimEvidence } from '../types';

export const claims: ClaimEvidence[] = [
  {
    id: 'claim-inflation-2024',
    canonicalClaim: "Malaysia's inflation rate was 1.8% in 2024.",
    claimant: 'Berita Contoh (fictional news outlet)',
    topic: 'Inflation & cost of living',
    operator: 'equals',
    unit: 'percent',
    geography: 'Malaysia',
    period: '2024 annual average',
    explanation:
      "The registry compares the claim with DOSM's published annual CPI rate of 1.8% for 2024. This is a demonstration comparison, not a human-approved verification.",
    calculation:
      'Compare the claimed annual rate (1.8%) with the registry comparison value (1.8%); the values match without rounding.',
    sourceOrganisation: 'Department of Statistics Malaysia (DOSM)',
    sourceTitle: 'Analysis of Annual Consumer Price Index, Malaysia, 2024',
    sourceUrl:
      'https://www.dosm.gov.my/portal-main/release-content/analysis-of-annual-consumer-price-index-malaysia-2024',
    sourceUpdatedAt: '2025-04-29',
    relatedProfileId: 'profile-demo-news',
    aliases: [
      "Malaysia's inflation rate was 1.8% in 2024.",
      'Kadar inflasi Malaysia ialah 1.8% pada 2024.',
    ],
    languages: ['en', 'ms'],
    claimedValue: '1.8%',
    officialValue: '1.8% (registry comparison; verification pending)',
    verdict: 'Supported',
    limitations: [
      'Hackathon demonstration fixture. Exact value requires human verification before public release.',
      'No human supplied or independently checked this fixture in this session.',
      'The national annual CPI average does not describe price changes for every household, good or state.',
    ],
    needsHumanVerification: true,
  },
  {
    id: 'claim-inflation-rounded-2024',
    canonicalClaim: "Malaysia's inflation rate was about 2% in 2024.",
    claimant: 'Rina Contoh (fictional reporter/influencer)',
    topic: 'Inflation & cost of living',
    operator: 'approximately equals',
    unit: 'percent',
    geography: 'Malaysia',
    period: '2024 annual average',
    explanation:
      'The approximate whole-percent claim rounds to the same value as the registry comparison of 1.8%, but the rounded wording discards detail. Human verification is still pending.',
    calculation:
      'Round the registry comparison value of 1.8% to the nearest whole percent: 2%; compare that result with the claimed approximate value.',
    sourceOrganisation: 'Department of Statistics Malaysia (DOSM)',
    sourceTitle: 'Analysis of Annual Consumer Price Index, Malaysia, 2024',
    sourceUrl:
      'https://www.dosm.gov.my/portal-main/release-content/analysis-of-annual-consumer-price-index-malaysia-2024',
    sourceUpdatedAt: '2025-04-29',
    relatedProfileId: 'profile-demo-reporter',
    aliases: [
      "Malaysia's inflation rate was about 2% in 2024.",
      'Kadar inflasi Malaysia adalah kira-kira 2% pada 2024.',
    ],
    languages: ['en', 'ms'],
    claimedValue: 'about 2%',
    officialValue: '1.8% (registry comparison; verification pending)',
    verdict: 'Mostly supported',
    limitations: [
      'The approximate wording is compatible only after rounding and should not replace the more precise published rate.',
      'A lower inflation rate does not mean that the overall price level fell.',
      'No human supplied or independently checked this fixture in this session.',
    ],
    needsHumanVerification: true,
  },
  {
    id: 'claim-unemployment-direction-2024',
    canonicalClaim: "Malaysia's unemployment rate increased in 2024 compared with 2023.",
    claimant: 'Ahmad Demo (fictional politician)',
    topic: 'Unemployment',
    operator: 'year-on-year direction',
    unit: 'percentage points',
    geography: 'Malaysia',
    period: '2024 compared with 2023',
    explanation:
      'The registry comparison records a decrease from 3.4% in 2023 to 3.2% in 2024, opposite to the claimed direction. The fixture has not received human review.',
    calculation:
      'Subtract the 2023 registry rate from the 2024 registry rate: 3.2% - 3.4% = -0.2 percentage points; a negative change means a decrease.',
    sourceOrganisation: 'Department of Statistics Malaysia (DOSM)',
    sourceTitle: 'Labour Force Survey 2024',
    sourceUrl:
      'https://www.dosm.gov.my/portal-main/release-content/labour-force-survey-2024',
    sourceUpdatedAt: '2025-06-30',
    relatedProfileId: 'profile-demo-politician',
    aliases: [
      "Malaysia's unemployment rate increased in 2024 compared with 2023.",
      'Kadar pengangguran Malaysia meningkat pada 2024 berbanding 2023.',
    ],
    languages: ['en', 'ms'],
    claimedValue: 'increased compared with 2023',
    officialValue:
      'decreased from 3.4% to 3.2% (registry comparison; verification pending)',
    verdict: 'Contradicted',
    limitations: [
      'This fixture checks only the national annual direction, not monthly changes, states or demographic groups.',
      'Unemployment rate changes do not by themselves explain employment quality or labour-force participation.',
      'No human supplied or independently checked this fixture in this session.',
    ],
    needsHumanVerification: true,
  },
  {
    id: 'claim-absolute-poverty-2024',
    canonicalClaim: 'Malaysia had no absolute poverty in 2024.',
    claimant: 'Ahmad Demo (fictional politician)',
    topic: 'Poverty & household income',
    operator: 'equals zero',
    unit: 'percent of households',
    geography: 'Malaysia',
    period: '2024',
    explanation:
      'The registry comparison records an absolute poverty incidence of 5.1%, which does not support a claim of no absolute poverty. Human verification remains pending.',
    calculation:
      'Test the claim of zero incidence against the nonzero registry comparison value of 5.1%; no additional estimate is calculated.',
    sourceOrganisation: 'Department of Statistics Malaysia (DOSM)',
    sourceTitle: 'Poverty in Malaysia, 2024',
    sourceUrl:
      'https://www.dosm.gov.my/portal-main/release-content/poverty-in-malaysia-2024',
    sourceUpdatedAt: '2025-10-08',
    relatedProfileId: 'profile-demo-politician',
    aliases: [
      'Malaysia had no absolute poverty in 2024.',
      'Malaysia tidak mempunyai kemiskinan mutlak pada 2024.',
    ],
    languages: ['en', 'ms'],
    claimedValue: 'no absolute poverty',
    officialValue:
      '5.1% absolute poverty incidence (registry comparison; verification pending)',
    verdict: 'Contradicted',
    limitations: [
      'Absolute poverty is a specific official measure and must not be confused with relative or multidimensional poverty.',
      'A national incidence rate does not describe the circumstances of every household.',
      'No human supplied or independently checked this fixture in this session.',
    ],
    needsHumanVerification: true,
  },
  {
    id: 'claim-typical-household-income-2024',
    canonicalClaim: 'The typical Malaysian household had an income of RM9,155 per month in 2024.',
    claimant: 'Berita Contoh (fictional news outlet)',
    topic: 'Poverty & household income',
    operator: 'represents typical value',
    unit: 'Malaysian ringgit per household per month',
    geography: 'Malaysia',
    period: '2024',
    explanation:
      'RM9,155 is the registry mean, while RM7,017 is the median. Presenting the mean as the income of a typical household omits the distinction between those measures; human review is pending.',
    calculation:
      'Compare mean RM9,155 with median RM7,017 in the registry; do not substitute one summary measure for the other.',
    sourceOrganisation: 'Department of Statistics Malaysia (DOSM)',
    sourceTitle: 'Household Income Survey Report 2024 (Malaysia & States)',
    sourceUrl:
      'https://www.dosm.gov.my/portal-main/release-content/household-income-survey-report--malaysia--states-2024',
    sourceUpdatedAt: '2025-10-08',
    relatedProfileId: 'profile-demo-news',
    aliases: [
      'The typical Malaysian household had an income of RM9,155 per month in 2024.',
      'Isi rumah biasa Malaysia mempunyai pendapatan RM9,155 sebulan pada 2024.',
    ],
    languages: ['en', 'ms'],
    claimedValue: 'RM9,155 per month for a typical household',
    officialValue:
      'mean RM9,155; median RM7,017 per month (registry comparison; verification pending)',
    verdict: 'Missing context',
    limitations: [
      'The mean can differ substantially from the median when household incomes are unevenly distributed.',
      'Household income is not individual earnings and a national summary does not describe every household.',
      'No human supplied or independently checked this fixture in this session.',
    ],
    needsHumanVerification: true,
  },
  {
    id: 'claim-health-facts-publication-2025',
    canonicalClaim:
      "Malaysia's Ministry of Health published Health Facts 2025 with reference data for 2024.",
    claimant: 'Rina Contoh (fictional reporter/influencer)',
    topic: 'Public health',
    operator: 'publication metadata match',
    unit: 'publication',
    geography: 'Malaysia',
    period: '2024 reference data; 2025 publication',
    explanation:
      'The public Ministry of Health search record identifies Health Facts 2025 as reference data for 2024. This non-numeric demonstration fixture checks publication metadata only and awaits human verification.',
    calculation:
      'Compare the stated publisher, document title and reference-data year with the registry metadata; no health rate or trend is calculated.',
    sourceOrganisation: 'Ministry of Health Malaysia (MOH)',
    sourceTitle: 'Health Facts 2025',
    sourceUrl:
      'https://www.moh.gov.my/images/04-penerbitan/health-facts/HEALTH_FACTS_2025.pdf',
    sourceUpdatedAt: '2025 (exact release date not verified)',
    relatedProfileId: 'profile-demo-reporter',
    aliases: [
      "Malaysia's Ministry of Health published Health Facts 2025 with reference data for 2024.",
      'Kementerian Kesihatan Malaysia menerbitkan Health Facts 2025 dengan data rujukan bagi tahun 2024.',
    ],
    languages: ['en', 'ms'],
    claimedValue: 'Health Facts 2025 published with 2024 reference data',
    officialValue:
      'Health Facts 2025; reference data for 2024 (registry comparison; verification pending)',
    verdict: 'Supported',
    limitations: [
      'This fixture makes no numerical claim about health outcomes, facilities or coverage.',
      'The publication metadata was located through public search; the PDF was not human-reviewed in this session.',
      'No human supplied or independently checked this fixture in this session.',
    ],
    needsHumanVerification: true,
  },
];
