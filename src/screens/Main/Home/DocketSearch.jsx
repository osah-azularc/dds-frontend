import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import styles from './DocketSearchStyles';
import { showWarningSnackbar } from '../../../utilities/ErrorSnackBar';

// `showSearchOptions`/`setShowSearchOptions` are owned by Header.jsx (not local state here) so
// it can force the panel closed on route change (see Header.jsx's own useLayoutEffect) -- that
// covers every way a user can land on the results/detail page (Search button, docket-number
// quick search, browser back/forward, a direct link), not just this component's own click
// handlers. Matches the UI design team's own DocketSearch.jsx (dds-frontend-feature-ui-design).
const DocketSearch = ({ showSearchOptions, setShowSearchOptions }) => {
  const theme = useTheme();
  const classes = styles(theme);
  const [docketNo, setDocketNo] = useState('');
  const navigate = useNavigate();

  const handleDocketChange = (e) => {
    setDocketNo(e.target.value.replaceAll(/\D/g, ''));
  };

  const handleSearchByDocket = useCallback(() => {
    if (!docketNo) {
      showWarningSnackbar('Please enter docket#');
      return;
    }

    navigate(`/docket/${docketNo}`);
    // Belt-and-suspenders: Header.jsx's route-based effect only watches for
    // /search-results and the 4 /form1/.../reqdt/ routes, not this one.
    setShowSearchOptions(false);
  }, [docketNo, navigate, setShowSearchOptions]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchByDocket();
    }
  };

  const toggleSearchOptions = useCallback(() => {
    setShowSearchOptions((prev) => !prev);
  }, [setShowSearchOptions]);

  return (
    <Box sx={classes.DocketSearchContainer}>
      <Box sx={classes.DocketNumberBlockOuter}>
        <Box sx={classes.DocketNumberBlock}>
          <Box display="flex" alignItems="center" borderRight="2px solid #d5d7db" pr={2}>
            <Typography variant="body1">Docket Number</Typography>
          </Box>
          <TextField
            id="docket-number"
            variant="outlined"
            value={docketNo}
            onChange={handleDocketChange}
            onKeyDown={handleKeyDown}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
          />
          <Box sx={classes.Search}>
            <IconButton aria-label="search" onClick={handleSearchByDocket}>
              <SearchIcon />
            </IconButton>
          </Box>
        </Box>
        <Box display="flex" mt={1} onClick={toggleSearchOptions} sx={{ cursor: 'pointer' }}>
          {showSearchOptions ? <RemoveIcon /> : <AddIcon />}
          <Typography variant="body1">Additional Search Options</Typography>
        </Box>
      </Box>
    </Box>
  );
};

DocketSearch.propTypes = {
  showSearchOptions: PropTypes.bool.isRequired,
  setShowSearchOptions: PropTypes.func.isRequired,
};

export default React.memo(DocketSearch);
