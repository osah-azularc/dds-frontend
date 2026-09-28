import dayjs from 'dayjs';

/**
 * Pure field-shape helpers for the Form 1205 screen's Incident Information section -- split
 * out of useForm1205Form.js to keep that file under this project's 300-line limit. Incident
 * Time and Height are each split across three/two plain-useState fields on the form
 * (IncidentTimeField.jsx, the feet/inches Height selects) but stored as one column each on
 * form1_dds_1205_offence (incident_time, height), matching legacy's own single-field storage.
 */

export const toDateString = (value) => (value ? dayjs(value).format('YYYY-MM-DD') : '');

export const combineIncidentTime = (hour, minute, period) =>
  hour && minute ? `${hour}:${minute} ${period || 'AM'}` : '';

// Parses "10:30 AM" back into the three IncidentTimeField parts. Returns nulls (caller falls
// back to the previous value) for anything that doesn't match, rather than partially updating.
export const splitIncidentTime = (value) => {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(String(value || '').trim());
  if (!match) return { hour: null, minute: null, period: null };
  const [, hour, minute, period] = match;
  return { hour, minute, period: period.toUpperCase() };
};

// Parses "5'10" back into feet/inches. Returns nulls for anything that doesn't match. (Height
// is combined feet+inches -> "5'10" server-side, in ddsForm1205Service.js's
// buildIncidentFields() -- nothing on the frontend needs to build that string itself.)
export const splitHeight = (value) => {
  const match = /^(\d+)'(\d+)$/.exec(String(value || '').trim());
  if (!match) return { feet: null, inches: null };
  const [, feet, inches] = match;
  return { feet, inches };
};

// Maps a search1205Info() response onto this screen's RHF field names. Returns only the
// fields that actually have a saved value -- spreading the result over `previous` in a
// reset() callback then leaves any field the fetch didn't cover untouched, rather than
// clobbering it with `undefined`. Excludes countyOccur/stateOfIssue -- both are
// FormAutocompleteField-backed (form value is a {label, value} option, not the plain string
// this response carries), so useForm1205Form.js reconstructs each once its own options list
// (countyList/stateOptions) has loaded, the same way it already does for countyOccur.
export const mapSearchResultToFormValues = (data) => {
  const time = splitIncidentTime(data.incidentTime);
  const height = splitHeight(data.height);

  const values = {
    lastName: data.lastName,
    firstName: data.firstName,
    middleName: data.middleName,
    precinct: data.address1,
    address: data.address2,
    city: data.city,
    state: data.state,
    zip: data.zip,
    phone: data.phone,
    email: data.email,
    fax: data.fax,
    isGeorgiaState: data.isGeorgiaState,
    officerBadgeNumber: data.badgeNo,
    citation: data.citiation,
    incidentDate: data.incidentDate ? dayjs(data.incidentDate) : undefined,
    incidentTimeHour: time.hour,
    incidentTimeMinute: time.minute,
    incidentTimePeriod: time.period,
    commercialVehicle: data.commercialVehicle,
    hazardousVehicle: data.hazourdousVehicle,
    licenseClass: data.licenseClassId,
    dob: data.dob ? dayjs(data.dob) : undefined,
    restrictions: data.restrictions,
    gender: data.gender,
    feet: height.feet,
    inches: height.inches,
    weight: data.weight,
    driverRequest: data.driverRequest,
  };

  return Object.fromEntries(Object.entries(values).filter(([, value]) => value));
};
