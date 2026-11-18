/**
 * Utility functions for address formatting and cleaning.
 */

/**
 * Strips Google Plus Codes / Open Location Codes (e.g. "33m4+2r4, ") from the beginning of an address.
 * 
 * Pattern explanation:
 * - `^[a-zA-Z0-9]+` : Matches alphanumeric characters before '+'
 * - `\+`             : Matches literal '+'
 * - `[a-zA-Z0-9]{2,4}`: Matches 2 to 4 alphanumeric characters after '+' (e.g., '2r4', 'MW')
 * - `\s*[,–-]?\s*`   : Matches optional separator (comma, dash) and surrounding spaces
 *
 * @param {string} address - The raw address string
 * @param {string} [fallback=''] - Optional fallback address if empty or completely stripped
 * @returns {string} - Cleaned address string suitable for UI display
 */
export const cleanAddress = (address, fallback = '') => {
  if (!address || typeof address !== 'string') return fallback;

  const cleaned = address
    .replace(/^[a-zA-Z0-9]+\+[a-zA-Z0-9]{2,4}\s*[,–-]?\s*/i, '')
    .trim();

  return cleaned || fallback || address;
};

// Alias for convenience
export const formatDisplayAddress = cleanAddress;
