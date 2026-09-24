import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Grid, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DateRangePickerField from './components/DateRangePickerField';
import MultiSelectFilter from './components/MultiSelectFilter';
import { renderSingleSelect } from './components/SearchFormFields';
import {
  AGENCY_LIST,
  CASE_TYPE_LIST,
  CONTACT_TYPE_LIST,
  COUNTY_LIST,
  HEARING_SITE_LIST,
  INITIAL_GENERAL_SEARCH_FORM,
  JUDGE_ASSISTANT_LIST,
  JUDGE_LIST,
  STATUS_LIST,
} from './constants/searchConstants';
import styles from './AdditionalSearchOptionsStyles';

const AdditionalSearchOptions = () => {
  const theme = useTheme();
  const classes = styles(theme);
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_GENERAL_SEARCH_FORM);

  const updateForm = useCallback((updates) => {
    setForm((prev) => ({ ...prev, ...updates }));
  }, []);

  // TODO: the results page currently renders an empty grid until the DDS
  // general-search endpoint exists on the backend - see useSearchResultsPage.
  const handleSearch = useCallback(() => {
    navigate('/search-results', { state: { searchType: 'general', filters: form } });
  }, [form, navigate]);

  return (
    <Box sx={classes.PanelOuter}>
      <Grid container spacing={3} sx={classes.PanelInner}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            size="small"
            value={form.lastName}
            onChange={(e) => updateForm({ lastName: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            size="small"
            value={form.firstName}
            onChange={(e) => updateForm({ firstName: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderSingleSelect({
            label: 'Contact Type',
            options: CONTACT_TYPE_LIST,
            value: form.contactType,
            onChange: (value) => updateForm({ contactType: value }),
          })}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Agency Reference Number"
            variant="outlined"
            fullWidth
            size="small"
            value={form.agencyRefNumber}
            onChange={(e) => updateForm({ agencyRefNumber: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MultiSelectFilter
            label="County"
            options={COUNTY_LIST}
            value={form.county}
            onChange={(value) => updateForm({ county: value })}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderSingleSelect({
            label: 'Status',
            options: STATUS_LIST,
            value: form.status,
            onChange: (value) => updateForm({ status: value }),
          })}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MultiSelectFilter
            label="Agency"
            options={AGENCY_LIST}
            value={form.agency}
            onChange={(value) => updateForm({ agency: value })}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MultiSelectFilter
            label="Case Type"
            options={CASE_TYPE_LIST}
            value={form.caseType}
            onChange={(value) => updateForm({ caseType: value })}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {renderSingleSelect({
            label: 'Judge',
            options: JUDGE_LIST,
            value: form.judge,
            onChange: (value) => updateForm({ judge: value }),
          })}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderSingleSelect({
            label: 'Judge Assistant',
            options: JUDGE_ASSISTANT_LIST,
            value: form.judgeAssistant,
            onChange: (value) => updateForm({ judgeAssistant: value }),
          })}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderSingleSelect({
            label: 'Hearing Site',
            options: HEARING_SITE_LIST,
            value: form.hearingSite,
            onChange: (value) => updateForm({ hearingSite: value }),
          })}
        </Grid>
        <Grid item xs={12} sm={6} md={3} />

        <Grid item xs={12} md={6}>
          <DateRangePickerField
            startLabel="Hearing Date (From)"
            endLabel="Hearing Date (To)"
            value={form.hearingDateRange}
            onChange={(value) => updateForm({ hearingDateRange: value })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DateRangePickerField
            startLabel="Date Received (From)"
            endLabel="Date Received (To)"
            value={form.dateReceivedRange}
            onChange={(value) => updateForm({ dateReceivedRange: value })}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} ml="auto">
          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            fullWidth
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(AdditionalSearchOptions);
