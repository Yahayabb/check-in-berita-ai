const STOP_WORDS = new Set([
  'a',
  'ada',
  'adalah',
  'akan',
  'an',
  'and',
  'are',
  'as',
  'at',
  'atau',
  'bagi',
  'bahawa',
  'be',
  'been',
  'by',
  'dalam',
  'dan',
  'dari',
  'daripada',
  'dengan',
  'di',
  'did',
  'do',
  'does',
  'during',
  'for',
  'from',
  'had',
  'has',
  'have',
  'how',
  'i',
  'ia',
  'ialah',
  'iaitu',
  'in',
  'ini',
  'into',
  'is',
  'it',
  'itu',
  'its',
  'juga',
  'kepada',
  'kerana',
  'lebih',
  'merupakan',
  'of',
  'oleh',
  'on',
  'or',
  'pada',
  'paling',
  'para',
  'per',
  's',
  'sebagai',
  'seperti',
  'telah',
  'tentang',
  'than',
  'that',
  'the',
  'their',
  'then',
  'there',
  'these',
  'this',
  'those',
  'to',
  'untuk',
  'was',
  'were',
  'what',
  'when',
  'where',
  'which',
  'who',
  'will',
  'with',
  'yang',
]);

export function normaliseText(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\brm\s*(?=\d)/g, 'ringgit ')
    .replace(/\b\d{1,3}(?:,\d{3})+(?:\.\d+)?\b/g, (value) => value.replace(/,/g, ''))
    .replace(/%/g, ' percent ')
    .replace(/\bper\s+cent\b/g, ' percent ')
    .replace(/(\d)\.(\d)/g, '$1\uE000$2')
    .replace(/[^\p{L}\p{N}\uE000]+/gu, ' ')
    .replace(/\uE000/g, '.')
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0 && !STOP_WORDS.has(token))
    .map((token) => (token === 'peratus' ? 'percent' : token))
    .join(' ');
}
