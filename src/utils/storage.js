const STORAGE_KEYS = {
  ledger: 'premFruitLedgerEntries',
  purchases: 'premFruitPurchaseEntries',
  sales: 'premFruitSalesEntries',
  payments: 'premFruitPaymentEntries',
};

const safeParse = (value) => {
  try {
    return JSON.parse(value) || [];
  } catch {
    return [];
  }
};

export const loadData = (key) => {
  if (typeof window === 'undefined') return [];
  return safeParse(window.localStorage.getItem(key));
};

export const saveData = (key, items) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(items));
};

export const loadAllData = () => {
  return {
    ledgerEntries: loadData(STORAGE_KEYS.ledger),
    purchases: loadData(STORAGE_KEYS.purchases),
    sales: loadData(STORAGE_KEYS.sales),
    payments: loadData(STORAGE_KEYS.payments),
  };
};

export const saveLedgerEntries = (newEntries) => {
  const existing = loadData(STORAGE_KEYS.ledger);
  saveData(STORAGE_KEYS.ledger, [...existing, ...newEntries]);
};

export const savePurchaseEntry = (entry) => {
  const existing = loadData(STORAGE_KEYS.purchases);
  saveData(STORAGE_KEYS.purchases, [...existing, entry]);
  saveLedgerEntries([{ ...entry, type: 'Purchase', debit: entry.finalCost, credit: 0, particulars: `${entry.item} - ${entry.supplierName}` }]);
};

export const saveSalesEntry = (entry) => {
  const existing = loadData(STORAGE_KEYS.sales);
  saveData(STORAGE_KEYS.sales, [...existing, entry]);
  saveLedgerEntries([{ ...entry, type: 'Sale', debit: 0, credit: entry.total, particulars: `${entry.item} - ${entry.customerName}` }]);
};

export const savePaymentEntry = (entry) => {
  const existing = loadData(STORAGE_KEYS.payments);
  saveData(STORAGE_KEYS.payments, [...existing, entry]);
  saveLedgerEntries([{ ...entry, type: 'Payment', debit: entry.amount, credit: 0, particulars: `${entry.paidTo} - ${entry.method}` }]);
};

export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  });
};

export const saveParsedLedgerEntries = (entries) => {
  const normalized = entries.map((entry) => ({
    ...entry,
    date: entry.date || new Date().toISOString().slice(0, 10),
    debit: Number(entry.debit || 0),
    credit: Number(entry.credit || 0),
    particulars: entry.partyName || entry.notes || 'OCR entry',
    drcr: entry.debit > entry.credit ? 'DR' : 'CR',
  }));
  saveLedgerEntries(normalized);
};

export const deleteLedgerEntries = (indices) => {
  const existing = loadData(STORAGE_KEYS.ledger);
  const updated = existing.filter((_, idx) => !indices.includes(idx));
  saveData(STORAGE_KEYS.ledger, updated);
};

export const deleteAllLedgerEntries = () => {
  saveData(STORAGE_KEYS.ledger, []);
};
