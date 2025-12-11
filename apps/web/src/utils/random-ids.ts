'use client'

/**
 * Generate an unique ID for HTML elements with pre-defined preffix and random subffix.
 * @param preffix - Pre-defined preffix.
 * @param length - Length of the random suffix (default: 8)
 * @returns String with format: {prefix}-{suffix-random}
 */
export function randomId(preffix: string, length: number = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let random = "";
  if (typeof window === "undefined") {
    // Fallback for server-side: use Math.random for non-cryptographic IDs
    for (let i = 0; i < length; i++) {
      random += chars[Math.floor(Math.random() * chars.length)];
    }
    return `${preffix}-${random}`;
  }
  const cryptoObj = window.crypto || (window as unknown as { msCrypto: Crypto }).msCrypto;

  if (cryptoObj && cryptoObj.getRandomValues) {
    const randomValues = new Uint32Array(length);
    cryptoObj.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      random += chars[randomValues[i] % chars.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      random += chars[Math.floor(Math.random() * chars.length)];
    }
  }

  return `${preffix}-${random}`;
}
