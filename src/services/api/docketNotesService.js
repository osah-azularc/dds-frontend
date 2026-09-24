import axiosInstance from '../../utilities/axiosConfig';

export async function getDocketNotes(caseId, options = {}) {
  const normalizedPage = Math.max(Number.parseInt(options.page, 10) || 0, 0);
  const normalizedLimit = Math.max(Number.parseInt(options.limit, 10) || 10, 1);

  try {
    const response = await axiosInstance.post('/docketDetail/notes', {
      caseId: String(caseId ?? '').trim(),
      page: normalizedPage,
      limit: normalizedLimit,
      ...(options.sortBy ? { sortBy: options.sortBy } : {}),
      ...(options.sortOrder ? { sortOrder: options.sortOrder } : {}),
    });

    if (response?.data?.success === false) {
      return {
        success: false,
        data: [],
        pagination: { total: 0, page: normalizedPage, limit: normalizedLimit, totalPages: 0 },
        message: response?.data?.message || 'Failed to fetch notes',
        error: response?.data?.error || response?.data?.message || 'Failed to fetch notes',
      };
    }

    return {
      success: true,
      data: response?.data?.data?.result ?? [],
      pagination: response?.data?.data?.pagination ?? {
        total: 0,
        page: normalizedPage,
        limit: normalizedLimit,
        totalPages: 0,
      },
      message: response?.data?.message || 'Notes fetched successfully',
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      pagination: { total: 0, page: normalizedPage, limit: normalizedLimit, totalPages: 0 },
      message: error.response?.data?.message || 'Failed to fetch notes',
      error:
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch notes',
    };
  }
}

export async function addDocketNote(caseId, summaryNotes) {
  try {
    const response = await axiosInstance.post('/docketDetail/add-notes', {
      caseId: String(caseId ?? '').trim(),
      summaryNotes,
    });

    if (response?.data?.success === false) {
      return {
        success: false,
        message: response?.data?.message || 'Failed to add note',
        error: response?.data?.error || response?.data?.message || 'Failed to add note',
      };
    }

    return { success: true, message: response?.data?.message || 'Note added successfully', error: null };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add note',
      error:
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Failed to add note',
    };
  }
}

export async function updateDocketNote(noteId, summaryNotes) {
  try {
    const response = await axiosInstance.post('/docketDetail/update-notes', {
      noteId: String(noteId ?? '').trim(),
      summaryNotes,
    });

    if (response?.data?.success === false) {
      return {
        success: false,
        message: response?.data?.message || 'Failed to update note',
        error: response?.data?.error || response?.data?.message || 'Failed to update note',
      };
    }

    return { success: true, message: response?.data?.message || 'Note updated successfully', error: null };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update note',
      error:
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Failed to update note',
    };
  }
}

export async function deleteDocketNote(noteId) {
  try {
    const response = await axiosInstance.post('/docketDetail/delete-notes', {
      noteId: String(noteId ?? '').trim(),
    });

    if (response?.data?.success === false) {
      return {
        success: false,
        message: response?.data?.message || 'Failed to delete note',
        error: response?.data?.error || response?.data?.message || 'Failed to delete note',
      };
    }

    return { success: true, message: response?.data?.message || 'Note deleted successfully', error: null };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete note',
      error:
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Failed to delete note',
    };
  }
}
