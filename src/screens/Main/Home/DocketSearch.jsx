import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SnackbarContext } from '../../../context/snackbarContext';
import styles from './DocketSearchStyles';

const DocketSearch = ({ showSearchOptions, setShowSearchOptions }) => {
  const theme = useTheme();
  const classes = styles(theme);
  const [docketNo, setDocketNo] = useState('');
  const openSnackbar = useContext(SnackbarContext);
  const navigate = useNavigate();

  const handleDocketChange = (e) => {
    setDocketNo(e.target.value.replaceAll(/\D/g, ''));
  };

  // TODO: the results page currently renders an empty grid until the DDS
  // docket lookup endpoint exists on the backend - see useSearchResultsPage.
  const handleSearchByDocket = useCallback(() => {
    if (!docketNo) {
      openSnackbar?.('Please enter a docket #', 'warning');
      return;
    }
    navigate('/search-results', { state: { searchType: 'docket', docketNo } });
  }, [docketNo, openSnackbar, navigate]);

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
        <Box sx={classes.AdditionalOptionsToggle} onClick={toggleSearchOptions}>
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
