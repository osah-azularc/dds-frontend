import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchDocketInfo } from '../../../services/form1Service';
import { getForm1Parties } from '../../../services/form1PartyService';
import { showErrorSnackbar } from '../../../utilities/ErrorSnackBar';
import { formatDocketNumber } from './constants';

/**
 * Regular DDS clerk/helpdesk existing-docket data (/form1/reqdt/:form1Id) -- split out of
 * useForm1New.js (300-line file limit) the same way useForm1DocumentsAndDisposition.js /
 * useSuperuserDocketData.js already are. Party rows are fetched separately
 * (dds-form1/get-party-details), matching legacy's own separate getPartyDetailsAction()
 * rather than bundling them into the docket response. DOB/Incident Date/Eligibility/
 * Effective/Expiry Date come back as permitData (form1_dds_1205_offence and
 * form1_dds_permit_eligibility_effectivedate).
 */
const useClerkDocketData = (form1Id) => {
  const navigate = useNavigate();
  const [existingDocket, setExistingDocket] = useState(null);
  const [parties, setParties] = useState([]);
  const [permitInfo, setPermitInfo] = useState(null);
  const [loadingExisting, setLoadingExisting] = useState(Boolean(form1Id));

  const loadExistingDocket = useCallback(async () => {
    const response = await searchDocketInfo(form1Id);

    if (response === '404' || !response?.docketData?.length) {
      showErrorSnackbar('Docket not found');
      navigate('/home', { replace: true });
      return;
    }

    // DocketHeaderInfo just displays `docketNumber` as-is -- reordering legacy's storage
    // format into display order here means it only has to happen once, the same way
    // useSuperuserDocketData's own docketNumber already arrives pre-formatted from the
    // backend (searchDocketHelper.js's formatDisplayDocketNumber).
    setExistingDocket({
      ...response.docketData[0],
      docketNumber: formatDocketNumber(response.docketData[0].docketNumber),
    });
    setPermitInfo(response.permitData?.[0] || null);
    setLoadingExisting(false);
  }, [form1Id, navigate]);

  const loadParties = useCallback(async () => {
    const data = await getForm1Parties(form1Id);
    setParties(data);
  }, [form1Id]);

  useEffect(() => {
    if (!form1Id) return;
    loadExistingDocket();
    loadParties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form1Id]);

  // Add Party writes a Petitioner's License Number to the docket's own Agency Reference
  // Number (see ddsForm1PartyService.js), so a party add/edit/delete refreshes both the
  // docket and the party list, not just the list.
  const refetchAfterPartyChange = useCallback(async () => {
    await Promise.all([loadExistingDocket(), loadParties()]);
  }, [loadExistingDocket, loadParties]);

  return {
    existingDocket,
    parties,
    permitInfo,
    loadingExisting,
    loadExistingDocket,
    refetchAfterPartyChange,
  };
};

export default useClerkDocketData;
