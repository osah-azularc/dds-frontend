import { useCallback, useContext, useState } from 'react';
import { SnackbarContext } from '../../../context/snackbarContext';

/**
 * Owns the Temporary Permits print form state.
 *
 * TODO: wire handlePrintAll/handlePrintOne to the real DDS print-permit
 * endpoints once they exist on the backend - mirrors the same TODO already
 * left on the Form1 save flow and the Home page's docket search.
 */
export const useTemporaryPermits = () => {
  const openSnackbar = useContext(SnackbarContext);

  const [licenseNumber, setLicenseNumber] = useState('');
  const [printingAll, setPrintingAll] = useState(false);
  const [printingOne, setPrintingOne] = useState(false);

  const handlePrintAll = useCallback(async () => {
    setPrintingAll(true);
    try {
      openSnackbar?.('Printing permits is not available yet.', 'info');
    } finally {
      setPrintingAll(false);
    }
  }, [openSnackbar]);

  const handlePrintOne = useCallback(async () => {
    if (!licenseNumber.trim()) {
      openSnackbar?.('Please enter a license number.', 'warning');
      return;
    }

    setPrintingOne(true);
    try {
      openSnackbar?.('Printing permits is not available yet.', 'info');
    } finally {
      setPrintingOne(false);
    }
  }, [licenseNumber, openSnackbar]);

  return {
    licenseNumber,
    setLicenseNumber,
    printingAll,
    printingOne,
    handlePrintAll,
    handlePrintOne,
  };
};

export default useTemporaryPermits;
