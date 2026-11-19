import { describe, expect, it } from 'vitest';
import { validateImageFile } from '../features/ocr/validateImageFile';

describe('validateImageFile', () => {
  it('rejects unsupported file types', () => {
    expect(validateImageFile({ type: 'image/gif' })).toBe(false);
    expect(validateImageFile({ type: 'image/webp' })).toBe(false);
    expect(validateImageFile({ type: 'image/svg+xml' })).toBe(false);
    expect(validateImageFile({ type: 'application/pdf' })).toBe(false);
    expect(validateImageFile({ type: '' })).toBe(false);
  });

  it('accepts PNG and JPEG images', () => {
    expect(validateImageFile({ type: 'image/png' })).toBe(true);
    expect(validateImageFile({ type: 'image/jpeg' })).toBe(true);
  });
});
