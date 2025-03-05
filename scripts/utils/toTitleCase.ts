const lowercase = ['a', 'de', 'der', 'den', 'van'];

/**
 * Attempt to convert a string to title case.
 * This won't always be correct since it's very basic.
 */
export function toTitleCase(str: string) {
  // Match each word, and take the following non-space character (if present) as part of the word
  return str.replace(/\b\S+?\b\S?/g, (val) => {
    const lower = val.toLowerCase();
    return lowercase.includes(lower) ? lower : val[0].toUpperCase() + lower.slice(1);
  });
}
