const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

export function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Hanya JPG atau PNG yang diizinkan';
  if (file.size > MAX_SIZE_MB * 1024 * 1024) return `Maks ${MAX_SIZE_MB} MB`;
  return null;
}
