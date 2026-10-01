import { useCallback, useEffect, useState } from 'react';
import { getSuperuserDocketInfo } from '../../../services/docketDetailService';
import { showErrorSnackbar } from '../../../utilities/ErrorSnackBar';

// Party cards key off `partyId` (matches form1_party.partyId, a number); the raw
// `peopledetails` table this hook reads instead uses `peopleId`, normalized to a string by
// searchDocketHelper.js's mapPeopleSearchRow -- same row shape otherwise
// (typeOfContact/firstName/lastName/phone/email/fax).
const toParty = (row) => ({ ...row, partyId: Number(row.peopleId) });

/**
 * dds_superuser's docket data for the shared existing-docket review screen -- the same
 * Form1.jsx that /form1/reqdt/:form1Id renders also renders at /docket/reqdt/:caseId
 * (appRoutes.jsx), reached from a Docket Search result row that has no form1Id (see
 * useSearchResultsState.js's handleRowClick). Split out of useForm1New.js (300-line file
 * limit) the same way useForm1DocumentsAndDisposition.js already is.
 *
 * Looks the case up directly in the `docket` table (dashboardController.js's
 * searchDocketInfo, mirrors legacy's Osahform/searchdocketinfo) instead of going through
 * the Form1-specific chain (dds-form1/searchdocketinfo + get-party-details +
 * docketDetail/documents + docketDetail/getDisposition), since a superuser search result
 * has no form1Id to key any of those by. `docket`'s field set was modeled on
 * form1_docket's, so the resulting `existingDocket` shape still matches what
 * GeneralInformationForm/DocketHeaderInfo already expect -- there's no Temporary Permit
 * eligibility data (a Form1-specific workflow -- see useForm1New.js's showPermitSave
 * wiring). Documents come from the same `documentstable` as the clerk flow
 * (form1DocumentService.js), keyed by this same docket `caseId` -- legacy's own
 * sudocketcontroller.js queries documentstable/docketdisposition with that identical
 * docket_number, so getSearchDocketInfoData bundles both into this one request instead of a
 * second round trip.
 */
const useSuperuserDocketData = (caseId, isSuperuserView) => {
  const [existingDocket, setExistingDocket] = useState(null);
  const [parties, setParties] = useState([]);
  const [disposition, setDisposition] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(isSuperuserView);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSuperuserDocketInfo(caseId);
      const docketRow = data?.docketData?.[0];
      if (!docketRow) {
        showErrorSnackbar('Docket not found');
        setExistingDocket(null);
        setParties([]);
        setDisposition([]);
        setDocuments([]);
        return;
      }

      setExistingDocket(docketRow);
      setParties(Array.isArray(data.peopleData) ? data.peopleData.map(toParty) : []);
      setDisposition(Array.isArray(data.docketDisposition) ? data.docketDisposition : []);
      setDocuments(Array.isArray(data.documents) ? data.documents : []);
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    if (!isSuperuserView) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuperuserView, caseId]);

  return { existingDocket, parties, disposition, documents, loading };
};

export default useSuperuserDocketData;
