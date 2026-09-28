/**
 * Phone/fax and zip code input formatters. Ported from ecourt-frontend's
 * phoneAndFaxFormatter.js (trimmed to the two formatters the Add Party
 * modal needs).
 */

// Strips non-digits and formats as "(XXX) XXX-XXXX" once 10 digits are
// entered; returns the digits as typed otherwise so the field never blocks
// mid-entry.
export const formatPhoneOrFaxNumber = (value) => {
  if (!value) return '';
  const cleaned = `${value}`.replace(/\D/g, '').slice(0, 10);
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : cleaned;
};

// Strips non-digits and formats as "XXXXX-XXXX" once more than 5 digits are
// entered; returns the digits as typed otherwise.
export const formatZipCode = (value) => {
  if (!value) return '';
  const cleaned = `${value}`.replace(/\D/g, '');
  if (cleaned.length < 6) return cleaned;
  const match = cleaned.match(/^(\d{5})(\d{1,4})$/);
  return match ? `${match[1]}-${match[2]}` : cleaned;
};
