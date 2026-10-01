import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { RESPONDENT_NAMES } from '../constants';

const renderValue = (value) => value || '—';

const partyDisplayName = (party) =>
  [party?.lastName, party?.firstName].filter(Boolean).join(', ') || '—';

/**
 * Docket overview strip (Docket Number/Petitioner/Respondent/Created By) for the shared
 * existing-docket review screen (/form1/reqdt/:form1Id for the regular DDS clerk flow,
 * /docket/reqdt/:caseId for dds_superuser -- see Form1.jsx/useForm1New.js). Matches
 * ecourt-frontend's DocketInformationMain.jsx layout/typography exactly (caption labels,
 * h2/secondary values) — no Download Docket button, since DDS doesn't have that feature.
 * "Created By" shows `existingDocket.docketClerk` (Docket/Form1Docket model's `docketclerk`
 * column) -- the clerk username recorded when the docket was created.
 *
 * `existingDocket.docketNumber` arrives already display-formatted -- useClerkDocketData.js
 * applies constants.js's formatDocketNumber (legacy's storage-order reorder) once when
 * loading, and useSuperuserDocketData.js's own already comes pre-formatted from the backend
 * (searchDocketHelper.js's formatDisplayDocketNumber) -- so this component just displays it.
 * Docket Number isn't set until OSAH staff assign a judge to the docket (clerk flow only),
 * so — matching form1.phtml's `ng-show="docket_no"` on this same block — the whole strip
 * renders nothing until then, rather than showing a misleading "—".
 */
const DocketHeaderInfo = ({ existingDocket, parties }) => {
  const petitioner = useMemo(
    () => parties.find((party) => party.typeOfContact === 'Petitioner'),
    [parties],
  );
  const { docketNumber } = existingDocket;
  const respondentName = RESPONDENT_NAMES[existingDocket.refAgency] || existingDocket.refAgency;

  if (!docketNumber) return null;

  return (
    <Grid item xs={12} p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={9}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="secondary">
                Docket Number
              </Typography>
              <Typography variant="h2" color="secondary">
                {docketNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="secondary">
                Petitioner
              </Typography>
              <Typography variant="h2" color="secondary">
                {partyDisplayName(petitioner)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="secondary">
                Respondent
              </Typography>
              <Typography variant="h2" color="secondary">
                {renderValue(respondentName)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="h2" color="secondary" align="center">
            Created By: {renderValue(existingDocket.docketClerk)}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

DocketHeaderInfo.propTypes = {
  existingDocket: PropTypes.shape({
    docketNumber: PropTypes.string,
    refAgency: PropTypes.string,
    docketClerk: PropTypes.string,
  }).isRequired,
  parties: PropTypes.arrayOf(
    PropTypes.shape({
      typeOfContact: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  ),
};

DocketHeaderInfo.defaultProps = {
  parties: [],
};

export default React.memo(DocketHeaderInfo);
