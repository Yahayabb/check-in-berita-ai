export function validateImageFile(file: { type: string }): boolean {
  return file.type === 'image/png' || file.type === 'image/jpeg';
}
