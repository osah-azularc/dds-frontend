/**
 * Strip leading whitespace so a field can never start with a space, while still
 * allowing normal spacing (e.g. between first/last words) as the user types.
 * Use in onChange handlers.
 */
export const stripLeadingWhitespace = (value = '') => value.replace(/^\s+/, '');

/**
 * Trim a field and collapse internal whitespace runs to a single space, so a
 * whitespace-only value cleans down to '' and stray double-spaces don't get saved.
 * Use on blur, and again defensively before validating/submitting.
 */
export const cleanText = (value = '') => value.trim().replace(/\s+/g, ' ');

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Reduce an HTML string (e.g. a rich-text email body) to plain, human-readable
 * text: strips markup and decodes entities (&nbsp;, &amp;, etc.) via the
 * browser's own parser, then collapses whitespace. A tag-stripping regex alone
 * leaves entities like "&nbsp;" as literal text since they aren't tags.
 */
export const stripHtmlToText = (html = '') => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return cleanText(doc.body.textContent || '');
};
