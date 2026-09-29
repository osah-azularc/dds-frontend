/**
 * Sample rows shown until POST /getRejectedForm1 is wired up on the backend (see the TODO
 * in useRejectedForm1s.js). Lets the page be demoed with realistic search/sort/pagination
 * behavior - and the row detail modal - in the meantime; swap out once the real endpoint is live.
 */
export const MOCK_REJECTED_FORM1S = [
  {
    form1Id: 1,
    agencyRefNumber: '1234',
    caseType: 'ALS',
    caseName: 'Soni, Siddesh',
    dateEntered: '2021-04-10',
    isResubmitted: true,
    refAgency: 'DDS',
    county: 'Atkinson',
    hearingMode: 'In Person',
    rejectReason: { reasonType: 'Other', reason: 'Test error' },
  },
  {
    form1Id: 2,
    agencyRefNumber: '1234',
    caseType: 'ALS',
    caseName: 'Soni, Siddesh',
    dateEntered: '2021-04-10',
    isResubmitted: true,
    refAgency: 'DDS',
    county: 'Atkinson',
    hearingMode: 'In Person',
    rejectReason: { reasonType: 'Other', reason: 'Test error' },
  },
  {
    form1Id: 3,
    agencyRefNumber: '123456789',
    caseType: 'ALS',
    caseName: 'test, test',
    dateEntered: '2022-01-08',
    isResubmitted: false,
    refAgency: 'DDS',
    county: 'Fulton',
    hearingMode: 'Video',
    rejectReason: { reasonType: 'Missing Document', reason: 'Police report not attached.' },
  },
  {
    form1Id: 4,
    agencyRefNumber: '58120',
    caseType: 'ALS',
    caseName: 'Carter, Angela',
    dateEntered: '2023-02-14',
    isResubmitted: false,
    refAgency: 'DDS',
    county: 'Cobb',
    hearingMode: 'In Person',
    rejectReason: {
      reasonType: 'Incorrect Information',
      reason: 'License number does not match record.',
    },
  },
  {
    form1Id: 5,
    agencyRefNumber: '58121',
    caseType: 'DFCS-Medicaid',
    caseName: 'Nguyen, Minh',
    dateEntered: '2023-03-02',
    isResubmitted: true,
    refAgency: 'DFCS-Medicaid',
    county: 'Gwinnett',
    hearingMode: 'Telephone',
    rejectReason: { reasonType: 'Other', reason: 'Duplicate submission.' },
  },
  {
    form1Id: 6,
    agencyRefNumber: '58122',
    caseType: 'DFCS-Non-Medicaid',
    caseName: 'Williams, Robert',
    dateEntered: '2023-03-19',
    isResubmitted: false,
    refAgency: 'DFCS-Non-Medicaid',
    county: 'DeKalb',
    hearingMode: 'In Person',
    rejectReason: { reasonType: 'Missing Document', reason: 'Signature page missing.' },
  },
  {
    form1Id: 7,
    agencyRefNumber: '58123',
    caseType: 'ALS',
    caseName: 'Johnson, Patricia',
    dateEntered: '2023-04-05',
    isResubmitted: true,
    refAgency: 'DDS',
    county: 'Chatham',
    hearingMode: 'Video',
    rejectReason: { reasonType: 'Other', reason: 'Wrong case type selected.' },
  },
  {
    form1Id: 8,
    agencyRefNumber: '58124',
    caseType: 'SRTA',
    caseName: 'Martinez, Luis',
    dateEntered: '2023-05-21',
    isResubmitted: false,
    refAgency: 'SRTA',
    county: 'Clayton',
    hearingMode: 'In Person',
    rejectReason: { reasonType: 'Incorrect Information', reason: 'Address on file is outdated.' },
  },
  {
    form1Id: 9,
    agencyRefNumber: '58125',
    caseType: 'ALS',
    caseName: 'Brown, Michael',
    dateEntered: '2023-06-11',
    isResubmitted: false,
    refAgency: 'DDS',
    county: 'Bibb',
    hearingMode: 'Telephone',
    rejectReason: { reasonType: 'Missing Document', reason: 'Officer statement not attached.' },
  },
  {
    form1Id: 10,
    agencyRefNumber: '58126',
    caseType: 'DFCS-Medicaid',
    caseName: 'Davis, Jennifer',
    dateEntered: '2023-07-30',
    isResubmitted: true,
    refAgency: 'DFCS-Medicaid',
    county: 'Hall',
    hearingMode: 'In Person',
    rejectReason: { reasonType: 'Other', reason: 'Incomplete household information.' },
  },
  {
    form1Id: 11,
    agencyRefNumber: '58127',
    caseType: 'ALS',
    caseName: 'Garcia, Maria',
    dateEntered: '2023-08-17',
    isResubmitted: false,
    refAgency: 'DDS',
    county: 'Muscogee',
    hearingMode: 'Video',
    rejectReason: { reasonType: 'Incorrect Information', reason: 'Date of birth mismatch.' },
  },
  {
    form1Id: 12,
    agencyRefNumber: '58128',
    caseType: 'SRTA',
    caseName: 'Wilson, James',
    dateEntered: '2023-09-04',
    isResubmitted: false,
    refAgency: 'SRTA',
    county: 'Richmond',
    hearingMode: 'In Person',
    rejectReason: { reasonType: 'Other', reason: 'Toll violation already resolved.' },
  },
  {
    form1Id: 13,
    agencyRefNumber: '58129',
    caseType: 'DFCS-Non-Medicaid',
    caseName: 'Anderson, Linda',
    dateEntered: '2023-10-22',
    isResubmitted: true,
    refAgency: 'DFCS-Non-Medicaid',
    county: 'Henry',
    hearingMode: 'Telephone',
    rejectReason: { reasonType: 'Missing Document', reason: 'Proof of income missing.' },
  },
  {
    form1Id: 14,
    agencyRefNumber: '58130',
    caseType: 'ALS',
    caseName: 'Thomas, David',
    dateEntered: '2023-11-09',
    isResubmitted: false,
    refAgency: 'DDS',
    county: 'Forsyth',
    hearingMode: 'In Person',
    rejectReason: { reasonType: 'Other', reason: 'Requested hearing date unavailable.' },
  },
  {
    form1Id: 15,
    agencyRefNumber: '58131',
    caseType: 'ALS',
    caseName: 'Moore, Susan',
    dateEntered: '2023-12-01',
    isResubmitted: false,
    refAgency: 'DDS',
    county: 'Coweta',
    hearingMode: 'Video',
    rejectReason: { reasonType: 'Incorrect Information', reason: 'Case name spelled incorrectly.' },
  },
];

const compareValues = (a, b) => {
  if (a === b) return 0;
  return a > b ? 1 : -1;
};

/** Filters, sorts and paginates the mock dataset the same way the real endpoint is expected to. */
export const queryMockRejectedForm1s = ({ searchValue, limit, offset, orderby, ascdesc }) => {
  const search = (searchValue || '').trim().toLowerCase();

  const filtered = search
    ? MOCK_REJECTED_FORM1S.filter((row) =>
        [row.agencyRefNumber, row.caseType, row.caseName].some((value) =>
          String(value).toLowerCase().includes(search),
        ),
      )
    : MOCK_REJECTED_FORM1S;

  const sortField = orderby || 'agencyRefNumber';
  const direction = ascdesc === 'DESC' ? -1 : 1;
  const sorted = [...filtered].sort(
    (a, b) => direction * compareValues(a[sortField], b[sortField]),
  );

  return {
    data: sorted.slice(offset, offset + limit),
    dataTotalSize: sorted.length,
  };
};
