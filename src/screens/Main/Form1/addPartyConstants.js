/**
 * Constants for the Add Party modal (existing-docket review screen's Party
 * Information section). Field set/contact types are cross-checked against
 * the legacy DDS portal's Add Party modal
 * (osah.repos/module/Osahform/view/osahform/dds/form1.phtml, lines
 * 586-897) -- Officer belongs to the separate 1205-offence sub-form, so
 * only these two contact types apply here.
 */
export const CONTACT_TYPE_OPTIONS = [
  { label: 'Petitioner', value: 'Petitioner' },
  { label: 'Petitioner Attorney', value: 'Petitioner Attorney' },
];

// Matches legacy's $scope.statename = 'GA' default.
export const DEFAULT_STATE = 'GA';

export const ADD_PARTY_DEFAULT_VALUES = {
  contactType: 'Petitioner',
  lastName: '',
  firstName: '',
  middleName: '',
  licenseNumber: '',
  attorneyBar: '',
  company: '',
  isNewContact: '',
  isInternationalAddr: '0',
  internationalAddress: '',
  address1: '',
  address2: '',
  city: '',
  state: DEFAULT_STATE,
  zip: '',
  phone: '',
  email: '',
  fax: '',
  altAddress1: '',
  altAddress2: '',
  altCity: '',
  altState: DEFAULT_STATE,
  altZipCode: '',
};

// Bulk-cleared when the "Add Additional Address" button collapses (Petitioner only).
export const ALT_ADDRESS_FIELDS = [
  'altAddress1',
  'altAddress2',
  'altCity',
  'altState',
  'altZipCode',
];
