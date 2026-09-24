import React, { useCallback, useState } from 'react';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import styles from './DocketSearchStyles';
import { showWarningSnackbar } from '../../../utilities/ErrorSnackBar';
import AdditionalSearchOptions from './AdditionalSearchOptions';

const DocketSearch = () => {
  const theme = useTheme();
  const classes = styles(theme);
  const [docketNo, setDocketNo] = useState('');
  const [showSearchOptions, setShowSearchOptions] = useState(false);
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
  }, [docketNo, navigate]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchByDocket();
    }
  };

  const toggleSearchOptions = useCallback(() => {
    setShowSearchOptions((prev) => !prev);
  }, []);

  return (
    <>
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
      <AdditionalSearchOptions showSearchOptions={showSearchOptions} />
    </>
  );
};

export default React.memo(DocketSearch);
