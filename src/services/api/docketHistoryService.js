import axiosInstance from '../../utilities/axiosConfig';

const getDefaultHistoryPagination = (limit = 10) => ({ total: 0, page: 0, limit, totalPages: 0 });

export async function getDocketHistory(docketId, options = {}) {
  const normalizedPage = Math.max(Number.parseInt(options.page, 10) || 0, 0);
  const normalizedLimit = Math.max(Number.parseInt(options.limit, 10) || 10, 1);

  try {
    const response = await axiosInstance.post('/docketDetail/getHistoryData', {
      docketId: String(docketId ?? '').trim(),
      page: normalizedPage,
      limit: normalizedLimit,
      ...(options.sortBy ? { sortBy: options.sortBy } : {}),
      ...(options.sortOrder ? { sortOrder: options.sortOrder } : {}),
    });

    if (response?.data?.success === false) {
      return {
        success: false,
        data: [],
        pagination: getDefaultHistoryPagination(normalizedLimit),
        error: response?.data?.error || response?.data?.message || 'Failed to fetch history data',
      };
    }

    return {
      success: true,
      data: response?.data?.data?.result ?? [],
      pagination: response?.data?.data?.pagination ?? getDefaultHistoryPagination(normalizedLimit),
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      pagination: getDefaultHistoryPagination(normalizedLimit),
      error:
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch history data',
    };
  }
}
