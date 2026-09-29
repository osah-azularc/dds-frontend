import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Grid, Typography } from '@mui/material';

/**
 * Read-only Disposition fields shown under the "Disposition" heading on the
 * existing-docket review screen (/form1/reqdt/:form1Id), sourced from
 * dds-backend's /docketDetail/getDisposition (see form1DispositionService.js).
 * Field set/labels/format match legacy's own disposition-block in
 * form1.phtml exactly (Disposition Type / Hearing? (Yes/No) / Box Number /
 * Disposition Date / Date Signed by Judge / Date Mailed, '-' when blank,
 * dates as MM-DD-YYYY) -- styled like ecourt-frontend's own Disposition.jsx.
 * caseId is a primary key on docketdisposition, so at most one record comes
 * back per Form 1.
 */
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

const DispositionInfo = ({ disposition }) => {
  const record = disposition?.[0];
  if (!record) return null;

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
};

DispositionInfo.defaultProps = {
  disposition: [],
};

export default DispositionInfo;
