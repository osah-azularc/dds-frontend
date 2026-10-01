import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Grid, Typography } from '@mui/material';

/**
 * Read-only Disposition fields shown under the "Disposition" heading on the
 * existing-docket review screen (/form1/reqdt/:form1Id and the superuser
 * /docket/reqdt/:caseId view), sourced from dds-backend's
 * /docketDetail/getDisposition or the superuser docket-info bundle (see
 * form1DispositionService.js / useSuperuserDocketData.js). Field set/labels/
 * format match legacy's own disposition-block in form1.phtml exactly
 * (Disposition Type / Hearing? (Yes/No) / Box Number / Disposition Date /
 * Date Signed by Judge / Date Mailed, '-' when blank, dates as MM-DD-YYYY) --
 * styled like ecourt-frontend's own Disposition.jsx.
 * caseId is a primary key on docketdisposition, so at most one record comes
 * back per Form 1 -- but that row isn't deleted on every status change, only
 * on the formal "Reopen Case" action (osahForm1Service.js), so a case can be
 * Rescheduled/reopened while an old disposition row still lingers. Legacy
 * (sudocket.phtml/form1.phtml: `ng-show="docketStatus=='Closed' ||
 * docketStatus=='Reconsideration'"`) and ecourt-frontend's own Disposition.jsx
 * both gate display on status for exactly this reason -- ported here the
 * same way rather than trusting the fetched row's mere presence.
 */
const ELIGIBLE_DISPOSITION_STATUSES = new Set(['Closed', 'Reconsideration']);
const formatDispositionDate = (value) => {
  if (!value) return '-';
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('MM-DD-YYYY') : '-';
};

const DISPOSITION_FIELDS = [
  { label: 'Disposition Type', key: 'dispositionCode', format: (value) => value || '-' },
  { label: 'Hearing? (Yes/No)', key: 'hearingYesNo', format: (value) => value || '-' },
  { label: 'Box Number', key: 'boxNo', format: (value) => value || '-' },
  { label: 'Disposition Date', key: 'dispositionDate', format: formatDispositionDate },
  { label: 'Date Signed by Judge', key: 'signedByJudge', format: formatDispositionDate },
  { label: 'Date Mailed', key: 'mailedDate', format: formatDispositionDate },
];

const DispositionInfo = ({ disposition, status }) => {
  const record = disposition?.[0];
  if (!record || !ELIGIBLE_DISPOSITION_STATUSES.has(status)) return null;

  return (
    <>
      {DISPOSITION_FIELDS.map(({ label, key, format }) => (
        <Grid item xs={12} sm={6} md={4} key={key}>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="body2">{format(record[key])}</Typography>
        </Grid>
      ))}
    </>
  );
};

DispositionInfo.propTypes = {
  disposition: PropTypes.arrayOf(
    PropTypes.shape({
      dispositionCode: PropTypes.string,
      hearingYesNo: PropTypes.string,
      boxNo: PropTypes.string,
      dispositionDate: PropTypes.string,
      signedByJudge: PropTypes.string,
      mailedDate: PropTypes.string,
    }),
  ),
  status: PropTypes.string,
};

DispositionInfo.defaultProps = {
  disposition: [],
  status: '',
};

export default DispositionInfo;
