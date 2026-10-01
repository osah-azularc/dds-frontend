import { useCallback } from 'react';
import axiosInstance from '../utilities/axiosConfig';

/**
 * Dashboard search hook. Ported from ecourt-frontend's hooks/useDashboard.js,
 * scoped to the general docket search DDS's Additional Search Options panel
 * needs (dds-backend's generalSearch controller already scopes results to
 * telv_o_five='1' DDS dockets).
 */
const useDashboard = () => {
  /**
   * General Search
   * Searches dockets with various filters
   *
   * @param {Object} payload - { condition: {}, additionalCondition: {} }
   * @returns {Object} - { success: boolean, data: array, total: number }
   */
  const generalSearch = useCallback(async (payload) => {
    try {
      const response = await axiosInstance.post('/dashboard/searchResult', payload, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to perform search',
        error: error.response?.data?.error || null,
        data: [],
        total: 0,
      };
    }
  }, []);

  /**
   * Superuser Search
   * Same Additional Search Options panel, submitted while logged in as dds_superuser --
   * searches the broader `docket` table (every ALS docket across DDS/DPS), not the
   * current user's own form1_docket entries generalSearch above scopes to. Matches
   * legacy's Superuser/searchresultsup, hit when user_type === 'dds_superuser'.
   *
   * @param {Object} payload - { condition: {}, additionalCondition: {} }
   * @returns {Object} - { success: boolean, data: array, total: number }
   */
  const superuserSearch = useCallback(async (payload) => {
    try {
      const response = await axiosInstance.post('/dashboard/superuserSearchResult', payload, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to perform search',
        error: error.response?.data?.error || null,
        data: [],
        total: 0,
      };
    }
  }, []);

  return { generalSearch, superuserSearch };
};

export default useDashboard;
