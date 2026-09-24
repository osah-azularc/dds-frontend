export const mapNotesResponseToRows = (notes, normalizedCaseId) =>
  (notes || []).map((note, index) => ({
    id: note.noteId || String(index),
    noteId: note.noteId || String(index),
    caseId: note.caseId || normalizedCaseId,
    date: note.date || '-',
    summaryNotes: note.summaryNotes || '',
    updatedBy: note.updatedBy || '-',
  }));
