import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  showErrorSnackbar,
  showSuccessSnackbar,
  showWarningSnackbar,
} from '../utilities/ErrorSnackBar';
import { downloadCaseFilesZip, exportSearchResultsCsv } from '../services/searchResultsService';
import { FIELD_MAPPING } from '../screens/Main/Home/utils/searchResultsUtils';

/**
 * Download Files / Export handlers for the Docket Search results grid.
 * Ported from ecourt-frontend's useSearchResultsHandlers.jsx, trimmed of
 * eCourt's bulk-edit/bulk-designation/print machinery (DDS's results screen
 * doesn't have those) -- matches legacy DDS's Download Files dropdown
 * (Download Case Files/Download Decisions) and Export button
 * (superuser.phtml, superusercontroller.js).
 */
export function useSearchResultsDownload({
  rows,
  totalRecords,
  currentFilters,
  sortModel,
  selectedRows,
  setSelectedRows,
  showConfirmDialog,
}) {
  const [downloadAnchor, setDownloadAnchor] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const firstName = useSelector((state) => state.user.firstName);
  const lastName = useSelector((state) => state.user.lastName);

  const handleDownloadClick = useCallback((event) => setDownloadAnchor(event.currentTarget), []);
  const handleDownloadClose = useCallback(() => setDownloadAnchor(null), []);

  // The grid's selection model tracks each row's `id` (form1Id); the download API needs the
  // eCourt case id instead (the "Docket" column, `row.docket`) -- resolve one to the other via
  // the loaded rows, dropping any docket that hasn't been assigned an eCourt case id yet ('...').
  const resolveSelectedCaseIds = useCallback(() => {
    const selectedIdSet = new Set(selectedRows);
    return rows
      .filter((row) => selectedIdSet.has(row.id) && row.docket && row.docket !== '...')
      .map((row) => row.docket);
  }, [rows, selectedRows]);

  const handleDownload = useCallback(
    async (downloadType, requireConfirmation) => {
      const caseIds = resolveSelectedCaseIds();
      if (caseIds.length === 0) {
        showWarningSnackbar('Please select the docket(s) to download files!');
        handleDownloadClose();
        return;
      }

      handleDownloadClose();

      const runDownload = async () => {
        try {
          setDownloadLoading(true);
          const judgename = `${firstName || ''}${lastName || ''}`;
          await downloadCaseFilesZip(caseIds, downloadType, judgename ? { judgename } : {});
          // Clear selection after a successful download so previously-selected (but now
          // invisible due to pagination) rows don't leak into the next download.
          setSelectedRows([]);
          showSuccessSnackbar('Download completed successfully!');
        } catch (error) {
          showErrorSnackbar(
            error.message || `Error downloading ${downloadType}. Please try again.`,
          );
        } finally {
          setDownloadLoading(false);
        }
      };

      if (requireConfirmation) {
        // Case files only, matching legacy's #downloadDocketAlert modal (decisions download
        // immediately, no popup).
        showConfirmDialog(
          'Download Files',
          'Attention: Files over 250 MB will not be downloaded',
          runDownload,
        );
      } else {
        await runDownload();
      }
    },
    [
      resolveSelectedCaseIds,
      handleDownloadClose,
      firstName,
      lastName,
      setSelectedRows,
      showConfirmDialog,
    ],
  );

  const handleDownloadCaseFiles = useCallback(
    () => handleDownload('case-files', true),
    [handleDownload],
  );
  const handleDownloadDecisions = useCallback(
    () => handleDownload('decisions', false),
    [handleDownload],
  );

  const handleExport = useCallback(async () => {
    if (!totalRecords) {
      showWarningSnackbar(
        'Your search displayed no results. Please search again in order to export cases.',
      );
      return;
    }

    try {
      setDownloadLoading(true);
      const currentSort = sortModel[0];
      const sortField = currentSort?.field || 'dateReceived';
      await exportSearchResultsCsv(currentFilters, {
        orderby: FIELD_MAPPING[sortField] || 'dateReceivedByOSAH',
        order: currentSort?.sort === 'desc' ? 1 : 0,
      });
      showSuccessSnackbar('Export completed successfully!');
    } catch (error) {
      showErrorSnackbar(error.message || 'Error exporting data. Please try again.');
    } finally {
      setDownloadLoading(false);
    }
  }, [totalRecords, sortModel, currentFilters]);

  return {
    downloadAnchor,
    downloadLoading,
    handleDownloadClick,
    handleDownloadClose,
    handleDownloadCaseFiles,
    handleDownloadDecisions,
    handleExport,
  };
}
