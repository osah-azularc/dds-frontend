// `x-module` request header tags. These identify which screen/module made a
// request for logging purposes — they are NOT permission names and take no
// part in any RBAC decision (permission names/checks live in permissions.js;
// see that file for PERMISSIONS/hasPermission). Only ADMIN_SETTINGS is
// currently sent anywhere in the app.
export const ADMIN_SETTINGS = 'ADMIN_SETTINGS';
