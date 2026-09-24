import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import FaxOutlinedIcon from '@mui/icons-material/FaxOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import screenTabStyles from '../../../../styles/shared/screenTabStyles';

const PartyCard = ({ role, name, phone, email, fax, onEdit, onDelete }) => {
  const theme = useTheme();
  const classes = screenTabStyles(theme);

  return (
    <Box sx={{ ...classes.PartiesCard, height: 'auto', minWidth: 260 }}>
      <Box
        sx={{
          ...classes.PartiesCardTop,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4">{role}</Typography>
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={onEdit} aria-label={`Edit ${role}`}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onDelete} aria-label={`Delete ${role}`}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <Stack spacing={1} sx={classes.PartiesCardBody}>
        <Typography variant="body1" fontWeight={600}>
          {name}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <PhoneOutlinedIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Phone: {phone || '-'}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <EmailOutlinedIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Email: {email || 'No Email'}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <FaxOutlinedIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Fax: {fax || '-'}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

PartyCard.propTypes = {
  role: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  phone: PropTypes.string,
  email: PropTypes.string,
  fax: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default PartyCard;
