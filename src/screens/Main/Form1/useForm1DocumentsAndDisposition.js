import { useCallback, useEffect, useState } from 'react';
import { getForm1Documents } from '../../../services/form1DocumentService';
import { getForm1Disposition } from '../../../services/form1DispositionService';

/**
 * Documents & Disposition data for the existing-docket review screen
 * (/form1/reqdt/:form1Id) -- split out of useForm1New.js to keep that hook
 * under the project's 300-line file limit. Both are independent, read-only
 * lookups keyed by form1Id (see form1DocumentService.js/
 * form1DispositionService.js for the legacy calls each one ports).
 */
const useForm1DocumentsAndDisposition = (form1Id, isExisting) => {
  const [documents, setDocuments] = useState([]);
  const [disposition, setDisposition] = useState([]);

  const loadDocuments = useCallback(async () => {
    const data = await getForm1Documents(form1Id);
    setDocuments(data);
  }, [form1Id]);

  const loadDisposition = useCallback(async () => {
    const data = await getForm1Disposition(form1Id);
    setDisposition(data);
  }, [form1Id]);

  useEffect(() => {
    if (!isExisting) return;
    loadDocuments();
    loadDisposition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExisting, form1Id]);

  return { documents, disposition };
};

export default useForm1DocumentsAndDisposition;
