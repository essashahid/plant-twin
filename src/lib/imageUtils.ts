/**
 * Reads a file into a base64 data URL. Unlike URL.createObjectURL, the result
 * survives a page refresh and can be persisted to localStorage or Supabase.
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
