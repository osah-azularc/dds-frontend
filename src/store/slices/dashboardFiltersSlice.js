/**
 * Dashboard Filters Slice
 *
 * Holds the dropdown option lists used by the Docket Search "Additional
 * Search Options" panel (judge, judge assistant, county, status, contact
 * type, hearing site) so they only need to be fetched once. Agency and Case
 * Type are hardcoded per the legacy DDS portal (see searchConstants.js), not
 * fetched, so they aren't tracked here.
 */
/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clearStore } from '../actions/clearStoreAction';
import { loadDashboardFilterData } from '../../services/dashboardFilterService';

const initialState = {
  filterData: {
    judgeList: [],
    judgeAssistantList: [],
    countyList: [],
    statusList: [],
    contactTypeList: [],
    hearingSiteList: [],
  },
  loading: false,
  error: null,
  initialized: false,
};

export const loadDashboardFilters = createAsyncThunk(
  'dashboardFilters/load',
  async (_, { rejectWithValue }) => {
    try {
      return await loadDashboardFilterData();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load dashboard filter data');
    }
  },
);

const dashboardFiltersSlice = createSlice({
  name: 'dashboardFilters',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDashboardFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadDashboardFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.filterData = action.payload;
        state.initialized = true;
      })
      .addCase(loadDashboardFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearStore, () => initialState);
  },
});

export const selectDashboardFilterData = (state) => state.dashboardFilters.filterData;
export const selectDashboardFilterLoading = (state) => state.dashboardFilters.loading;
export const selectDashboardFilterInitialized = (state) => state.dashboardFilters.initialized;
export const selectJudgeList = (state) => state.dashboardFilters.filterData.judgeList;
export const selectJudgeAssistantList = (state) =>
  state.dashboardFilters.filterData.judgeAssistantList;
export const selectCountyList = (state) => state.dashboardFilters.filterData.countyList;
export const selectStatusList = (state) => state.dashboardFilters.filterData.statusList;
export const selectContactTypeList = (state) => state.dashboardFilters.filterData.contactTypeList;
export const selectHearingSiteList = (state) => state.dashboardFilters.filterData.hearingSiteList;

export default dashboardFiltersSlice.reducer;
