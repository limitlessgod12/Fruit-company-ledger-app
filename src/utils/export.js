import { loadData } from './storage.js';

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const downloadBlob = (content, fileName, type) => {
  const blob = new Blob([content], { type });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(href);
};

export const downloadLedgerCsv = () => {
  const entries = loadData('premFruitLedgerEntries');
  if (!entries.length) {
    window.alert('No ledger entries available to export.');
    return;
  }
  const rows = entries.map((entry) => ({
    Date: entry.date,
    Particulars: entry.particulars || entry.partyName || entry.notes || 'Ledger item',
    Debit: formatCurrency(entry.debit),
    Credit: formatCurrency(entry.credit),
    Type: entry.type || 'Ledger',
    Notes: entry.notes || '',
  }));
  const header = Object.keys(rows[0]).join(',');
  const csv = [header, ...rows.map((row) => Object.values(row).map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))].join('\n');
  downloadBlob(csv, 'prem-fruit-ledger.csv', 'text/csv;charset=utf-8;');
};

export const downloadTextFile = (text) => {
  if (!text) {
    window.alert('No text available to download.');
    return;
  }
  downloadBlob(text, 'ocr-result.txt', 'text/plain;charset=utf-8;');
};
