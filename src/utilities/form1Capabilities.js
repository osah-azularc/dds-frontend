/**
 * @file form1Capabilities.js
 * @description Centralized, per-usertype capability lookup for the DDS app
 * header nav and the Home/Form1 screens (General Info / Form 1205 / History /
 * Notes tabs), replacing scattered `user_type === 'dds_clerk'` checks with a
 * single named-capability seam. Grants are ported from the legacy `dds_user_type` gating trace --
 * see docs/dds-legacy-usertype-permissions.md for the original behavior and
 * docs/dds-form1-rbac-permissions-plan.md for the full permission mapping
 * this was derived from.
 *
 * This is intentionally a simple static map, not the backend RBAC engine
 * (Role/Permission/RolePermission + rbacMiddleware) -- that engine has zero
 * `role_permissions` rows seeded for dds_clerk/dds_helpdesk/dds_superuser
 * today, so gating on the live `state.user.permissions` array would hide
 * every capability below for all three roles until that's seeded. Swapping
 * this lookup for that array later is a one-file change: every call site
 * only depends on `hasForm1Capability(userType, capability)`.
 */

export const FORM1_CAPABILITIES = {
  NAV_VIEW: 'header.nav_view',
  HOME_FORM1_ENTRY_VIEW: 'home.form1_entry_view',
  HOME_FORM1_CREATE: 'home.form1_create',
  HOME_TEMP_PERMITS_VIEW: 'home.temp_permits_view',
  PARTY_CREATE: 'form1_general.party_create',
  PARTY_EDIT: 'form1_general.party_edit',
  PARTY_DELETE: 'form1_general.party_delete',
  FORM1205_EDIT: 'form1_1205.edit',
  FORM1205_SUBMIT: 'form1_1205.submit',
  NOTES_MANAGE: 'form1_notes.manage',
  OTHER_TABS_VIEW: 'form1.other_tabs_view',
};

// dds_clerk: full data-entry access. dds_helpdesk: can view/enter but is
// treated read-only everywhere that isn't already status-locked (no party
// create/edit/delete, no 1205 edit/submit) -- notes stay open since legacy's
// helpdesk disable code never actually reaches the Notes tab (dead/unused
// code there, see the legacy doc's Notes section). dds_superuser: full
// party/1205/notes access but never sees the Home entry points, the header's
// main nav (HOME/FORM1/TEMPORARY PERMITS/REJECTED FORM 1'S -- legacy hides
// this entirely, dds-header.phtml:16 `ng-if="user_type!='dds_superuser'"`),
// or the Form 1205/History/Notes tabs -- matching its "different, broader
// oversight workflow" role in legacy rather than the clerk/helpdesk
// per-docket data-entry tab set (OTHER_TABS_VIEW; General Information stays
// visible for every role).
const ROLE_CAPABILITIES = {
  dds_clerk: [
    FORM1_CAPABILITIES.NAV_VIEW,
    FORM1_CAPABILITIES.HOME_FORM1_ENTRY_VIEW,
    FORM1_CAPABILITIES.HOME_FORM1_CREATE,
    FORM1_CAPABILITIES.HOME_TEMP_PERMITS_VIEW,
    FORM1_CAPABILITIES.PARTY_CREATE,
    FORM1_CAPABILITIES.PARTY_EDIT,
    FORM1_CAPABILITIES.PARTY_DELETE,
    FORM1_CAPABILITIES.FORM1205_EDIT,
    FORM1_CAPABILITIES.FORM1205_SUBMIT,
    FORM1_CAPABILITIES.NOTES_MANAGE,
    FORM1_CAPABILITIES.OTHER_TABS_VIEW,
  ],
  dds_helpdesk: [
    FORM1_CAPABILITIES.NAV_VIEW,
    FORM1_CAPABILITIES.HOME_FORM1_ENTRY_VIEW,
    FORM1_CAPABILITIES.HOME_TEMP_PERMITS_VIEW,
    FORM1_CAPABILITIES.NOTES_MANAGE,
    FORM1_CAPABILITIES.OTHER_TABS_VIEW,
  ],
  dds_superuser: [
    FORM1_CAPABILITIES.PARTY_CREATE,
    FORM1_CAPABILITIES.PARTY_EDIT,
    FORM1_CAPABILITIES.PARTY_DELETE,
    FORM1_CAPABILITIES.FORM1205_EDIT,
    FORM1_CAPABILITIES.FORM1205_SUBMIT,
    FORM1_CAPABILITIES.NOTES_MANAGE,
  ],
};

export const hasForm1Capability = (userType, capability) =>
  Boolean(userType) && (ROLE_CAPABILITIES[userType] || []).includes(capability);
