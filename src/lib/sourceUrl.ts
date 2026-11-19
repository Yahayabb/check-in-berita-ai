const OFFICIAL_DOMAINS = ['dosm.gov.my', 'moh.gov.my'];

export function getSafeSourceUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.toLowerCase();
    const isOfficialDomain = OFFICIAL_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );

    if (
      url.protocol !== 'https:' ||
      !isOfficialDomain ||
      url.username ||
      url.password ||
      url.port
    ) {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}
