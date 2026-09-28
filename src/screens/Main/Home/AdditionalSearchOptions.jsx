import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {
  selectJudgeList,
  selectJudgeAssistantList,
  selectCountyList,
  selectStatusList,
  selectContactTypeList,
  selectHearingSiteList,
  selectDashboardFilterInitialized,
  selectDashboardFilterLoading,
  loadDashboardFilters,
} from '../../../store/slices/dashboardFiltersSlice';
import { showWarningSnackbar } from '../../../utilities/ErrorSnackBar';
import SingleSelectFilter from '../../../components/common/SingleSelectFilter';
import SearchMultiSelectFilter from './components/SearchMultiSelectFilter';
import SearchDateRangeFilter from './components/SearchDateRangeFilter';
import {
  INITIAL_ADDITIONAL_SEARCH_FORM,
  AGENCY_OPTIONS,
  CASE_TYPE_OPTIONS,
} from './constants/searchConstants';

/**
 * Additional Search Options panel for the Docket Search screen.
 * Renders the identity fields (Last/First Name, Contact Type, Agency Ref
 * Number) plus the case filters (County, Status, Agency, Case Type, Judge,
 * Judge Assistant, Hearing Site, Hearing Date, Date Received).
 *
 * Field set and layout are cross-checked against the legacy DDS portal's
 * dds-header.phtml (osah.repos/module/Osahform/view/layout/dds-header.phtml)
 * and commancontroller.js. Agency/Case Type are fixed single-selects there
 * (DDS only searches ALS hearings for the DDS/DPS agencies), not dynamic
 * lists — see searchConstants.js. The rest of the dropdown data comes from
 * dashboardFiltersSlice, loaded on mount.
 *
 * Visibility/collapse animation are owned by Header.jsx (SmoothCollapse
 * wraps this component from outside), matching the UI design team's own
 * AdditionalSearchOptions.jsx (dds-frontend-feature-ui-design) -- this
 * component no longer needs to know whether it's currently shown.
 */
// SingleSelectFilter/SearchMultiSelectFilter store the whole { label, value }
// option (or an array of them for multi-select), not the raw value.
const optionValue = (option) => option?.value;

const buildSearchCondition = (form) => {
  const condition = {};

  if (form.lastName) condition.lastName = form.lastName;
  if (form.firstName) condition.firstName = form.firstName;
  if (form.contactType) condition.typeOfContact = optionValue(form.contactType);
  if (form.agencyRefNumber) condition.agencyRefNumber = form.agencyRefNumber;
  if (form.county.length > 0) condition.county = form.county.map(optionValue);
  if (form.status) condition.status = optionValue(form.status);
  if (form.agency) condition.refAgency = [optionValue(form.agency)];
  if (form.caseType) condition.caseType = [optionValue(form.caseType)];
  if (form.judge) condition.judge = optionValue(form.judge);
  if (form.judgeAssistant) condition.judgeAssistant = optionValue(form.judgeAssistant);
  if (form.hearingSite) condition.hearingSite = optionValue(form.hearingSite);

  const [hearingDateFrom, hearingDateTo] = form.hearingDateRange;
  if (hearingDateFrom) condition.hearingDateFrom = hearingDateFrom.format('YYYY-MM-DD');
  if (hearingDateTo) condition.hearingDateTo = hearingDateTo.format('YYYY-MM-DD');

  const [dateReceivedFrom, dateReceivedTo] = form.dateReceivedRange;
  if (dateReceivedFrom) condition.dateReceivedByOSAHFrom = dateReceivedFrom.format('YYYY-MM-DD');
  if (dateReceivedTo) condition.dateReceivedByOSAHTo = dateReceivedTo.format('YYYY-MM-DD');

  return condition;
};

const AdditionalSearchOptions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const judgeList = useSelector(selectJudgeList);
  const judgeAssistantList = useSelector(selectJudgeAssistantList);
  const countyList = useSelector(selectCountyList);
  const statusList = useSelector(selectStatusList);
  const contactTypeList = useSelector(selectContactTypeList);
  const hearingSiteList = useSelector(selectHearingSiteList);
  const filtersInitialized = useSelector(selectDashboardFilterInitialized);
  const filtersLoading = useSelector(selectDashboardFilterLoading);

  const [form, setForm] = useState(INITIAL_ADDITIONAL_SEARCH_FORM);

  const handleFieldChange = useCallback((updates) => {
    setForm((prev) => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    if (!filtersInitialized && !filtersLoading) {
      dispatch(loadDashboardFilters());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleSearch = useCallback(() => {
    const hasHearingDateRange = form.hearingDateRange.some(Boolean);
    const hasDateReceivedRange = form.dateReceivedRange.some(Boolean);
    const hasAnyFilter =
      form.lastName ||
      form.firstName ||
      form.contactType ||
      form.agencyRefNumber ||
      form.county.length > 0 ||
      form.status ||
      form.agency ||
      form.caseType ||
      form.judge ||
      form.judgeAssistant ||
      form.hearingSite ||
      hasHearingDateRange ||
      hasDateReceivedRange;

    if (!hasAnyFilter) {
      showWarningSnackbar('Please select at least one filter to perform search');
      return;
    }

    navigate('/search-results', {
      state: { filters: buildSearchCondition(form), searchType: 'general' },
    });
  }, [form, navigate]);

  return (
    <>
      <Box sx={{ backgroundColor: '#f0f1f3', px: { xs: 2, md: 4 }, py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              size="small"
              value={form.lastName}
              onChange={(e) => handleFieldChange({ lastName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              size="small"
              value={form.firstName}
              onChange={(e) => handleFieldChange({ firstName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SingleSelectFilter
              label="Contact Type"
              options={contactTypeList}
              value={form.contactType}
              onChange={(value) => handleFieldChange({ contactType: value })}
              loading={filtersLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Agency Reference Number"
              variant="outlined"
              fullWidth
              size="small"
              value={form.agencyRefNumber}
              onChange={(e) => handleFieldChange({ agencyRefNumber: e.target.value })}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ backgroundColor: '#fff', px: { xs: 2, md: 4 }, py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <SearchMultiSelectFilter
              label="County"
              options={countyList}
              value={form.county}
              onChange={(value) => handleFieldChange({ county: value })}
              loading={filtersLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SingleSelectFilter
              label="Status"
              options={statusList}
              includeAllOption
              value={form.status}
              onChange={(value) => handleFieldChange({ status: value })}
              loading={filtersLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SingleSelectFilter
              label="Agency"
              options={AGENCY_OPTIONS}
              value={form.agency}
              onChange={(value) => handleFieldChange({ agency: value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SingleSelectFilter
              label="Case Type"
              options={CASE_TYPE_OPTIONS}
              value={form.caseType}
              onChange={(value) => handleFieldChange({ caseType: value })}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SingleSelectFilter
              label="Judge"
              options={judgeList}
              value={form.judge}
              onChange={(value) => handleFieldChange({ judge: value })}
              loading={filtersLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SingleSelectFilter
              label="Judge Assistant"
              options={judgeAssistantList}
              value={form.judgeAssistant}
              onChange={(value) => handleFieldChange({ judgeAssistant: value })}
              loading={filtersLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SingleSelectFilter
              label="Hearing Site"
              options={hearingSiteList}
              value={form.hearingSite}
              onChange={(value) => handleFieldChange({ hearingSite: value })}
              loading={filtersLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <SearchDateRangeFilter
              startLabel="Hearing Date From"
              endLabel="Hearing Date To"
              value={form.hearingDateRange}
              onChange={(value) => handleFieldChange({ hearingDateRange: value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <SearchDateRangeFilter
              startLabel="Date Received From"
              endLabel="Date Received To"
              value={form.dateReceivedRange}
              onChange={(value) => handleFieldChange({ dateReceivedRange: value })}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            sx={{
              backgroundColor: '#D4A500',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              '&:hover': { backgroundColor: '#C49500' },
            }}
          >
            Search
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default React.memo(AdditionalSearchOptions);
