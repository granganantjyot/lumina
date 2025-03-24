import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function base64ImageToBlob(base64Value: string) {

  const [prefix, rawBase64] = base64Value.split(',');
  const mimeType = prefix.match(/:(.*?);/)?.[1] || "image/png";
  const byteCharacters = atob(rawBase64);
  const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);

  return new Blob([byteArray], { type: mimeType });
}
