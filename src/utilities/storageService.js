/**
 * @file storageService.js
 * @module utilities/storageService
 * @description Centralised abstraction over `localStorage`.
 *
 * All key names are defined once here so that call-sites never contain raw
 * string literals, and swapping the underlying storage mechanism (e.g. to
 * `sessionStorage` or an encrypted store) only requires a change in this
 * file.
 */

/** @enum {string} Storage key constants */
export const STORAGE_KEYS = {
  DRAWER_NAV_INDEX: 'selectedDrawerNavIndex',
  REDIRECT_URL: 'redirectURL',
  TEMPLATE_DATA: 'templateData',
};

const LEGACY_AUTH_STORAGE_KEYS = ['authToken', 'email', 'name'];

export const clearLegacyAuthStorage = () => {
  LEGACY_AUTH_STORAGE_KEYS.forEach((storageKey) => {
    localStorage.removeItem(storageKey);
  });
};

// ---------------------------------------------------------------------------
// Drawer nav index  (persists the selected sidebar item across page reloads)
// ---------------------------------------------------------------------------

/**
 * Reads the persisted drawer-nav index.
 *
 * @param {number} [defaultValue=1] - Returned when no value is stored.
 * @returns {number}
 */
export const getDrawerNavIndex = (defaultValue = 1) => {
  const stored = localStorage.getItem(STORAGE_KEYS.DRAWER_NAV_INDEX);
  const parsed = stored !== null ? parseInt(stored, 10) : NaN;
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

/**
 * @param {number} index
 */
export const setDrawerNavIndex = (index) => {
  localStorage.setItem(STORAGE_KEYS.DRAWER_NAV_INDEX, index);
};

export const removeDrawerNavIndex = () => {
  localStorage.removeItem(STORAGE_KEYS.DRAWER_NAV_INDEX);
};

// ---------------------------------------------------------------------------
// Redirect URL  (saved when an unauthenticated user hits a protected route,
//                consumed after successful login to send them to the right page)
// ---------------------------------------------------------------------------

/** @returns {string|null} */
export const getRedirectUrl = () => localStorage.getItem(STORAGE_KEYS.REDIRECT_URL);

/** @param {string} url */
export const setRedirectUrl = (url) => {
  localStorage.setItem(STORAGE_KEYS.REDIRECT_URL, url);
};

export const removeRedirectUrl = () => {
  localStorage.removeItem(STORAGE_KEYS.REDIRECT_URL);
};

// ---------------------------------------------------------------------------
// Template data  (client-side cache used for in-memory filtering)
// ---------------------------------------------------------------------------

/**
 * @returns {object[]|null} Parsed template array, or `null` if not set.
 */
export const getTemplateData = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.TEMPLATE_DATA);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEYS.TEMPLATE_DATA);
    return null;
  }
};

/**
 * @param {object[]} data
 */
export const setTemplateData = (data) => {
  localStorage.setItem(STORAGE_KEYS.TEMPLATE_DATA, JSON.stringify(data));
};

// ---------------------------------------------------------------------------
// Nuclear option – clear everything (used on cross-tab logout broadcast)
// ---------------------------------------------------------------------------

/** Removes all managed entries plus legacy auth leftovers from `localStorage` and `sessionStorage`. */
export const clearAllStorage = () => {
  [...Object.values(STORAGE_KEYS), ...LEGACY_AUTH_STORAGE_KEYS].forEach((storageKey) => {
    localStorage.removeItem(storageKey);
  });

  // Clear sessionStorage entries used by UserContext and RolesPermissionsContext
  sessionStorage.removeItem('userInfo');
  sessionStorage.removeItem('roles');
  sessionStorage.removeItem('permissions');
};
