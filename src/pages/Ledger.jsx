import { useMemo, useState } from 'react';
import { loadAllData } from '../utils/storage.js';
import { deleteLedgerEntries, deleteAllLedgerEntries } from '../utils/storage.js';

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

function Ledger() {
  const [searchDate, setSearchDate] = useState('');
  const [searchParty, setSearchParty] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selected, setSelected] = useState(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { ledgerEntries } = loadAllData();

  const filtered = useMemo(() => {
    return ledgerEntries
      .slice()
      .sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'))
      .filter((entry) => {
        const matchesDate = searchDate ? entry.date?.includes(searchDate) : true;
        const matchesParty = searchParty
          ? (entry.particulars || entry.partyName || entry.notes || '').toLowerCase().includes(searchParty.toLowerCase())
          : true;
        const matchesType = filterType === 'All' ? true : entry.type === filterType;
        return matchesDate && matchesParty && matchesType;
      });
  }, [ledgerEntries, searchDate, searchParty, filterType]);

  const runningBalances = useMemo(() => {
    let balance = 0;
    return [...filtered]
      .slice()
      .reverse()
      .map((entry) => {
        balance += Number(entry.credit || 0) - Number(entry.debit || 0);
        return { ...entry, runningBalance: balance };
      })
      .reverse();
  }, [filtered]);

  const toggleSelect = (index) => {
    const newSelected = new Set(selected);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelected(newSelected);
  };

  const selectAll = () => {
    if (selected.size === runningBalances.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(runningBalances.map((_, i) => i)));
    }
  };

  const handleDeleteSelected = () => {
    if (selected.size === 0) {
      window.alert('Please select entries to delete.');
      return;
    }
    setDeleteConfirm('selected');
  };

  const confirmDeleteSelected = () => {
    if (window.confirm('Are you absolutely sure? Click OK to confirm deletion of selected entries.')) {
      const indicesToDelete = Array.from(selected).sort((a, b) => b - a);
      indicesToDelete.forEach((idx) => {
        const globalIdx = ledgerEntries.findIndex(
          (entry) =>
            entry.date === runningBalances[idx].date &&
            entry.particulars === runningBalances[idx].particulars
        );
        if (globalIdx !== -1) {
          const allIndices = [globalIdx];
          deleteLedgerEntries(allIndices);
        }
      });
      setSelected(new Set());
      setDeleteConfirm(null);
      window.location.reload();
    }
  };

  const handleDeleteAll = () => {
    if (ledgerEntries.length === 0) {
      window.alert('No entries to delete.');
      return;
    }
    setDeleteConfirm('all');
  };

  const confirmDeleteAll = () => {
    if (window.confirm('Are you absolutely sure? Click OK to confirm deletion of ALL ledger entries.')) {
      deleteAllLedgerEntries();
      setSelected(new Set());
      setDeleteConfirm(null);
      window.location.reload();
    }
  };

  return (
    <section className="space-y-6">
      <div className="glass-panel p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-100">Daily Ledger</h2>
            <p className="mt-2 text-sm text-slate-400">Search, filter, and review every transaction recorded in your ledger.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              placeholder="Search by date"
              className="rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              value={searchParty}
              onChange={(e) => setSearchParty(e.target.value)}
              placeholder="Search by party"
              className="rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-400"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-400"
            >
              <option>All</option>
              <option>Purchase</option>
              <option>Sale</option>
              <option>Payment</option>
              <option>Debit</option>
              <option>Credit</option>
              <option>General</option>
            </select>
          </div>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="glass-panel border-rose-500/30 bg-rose-500/10 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-rose-100">{selected.size} entry/ies selected for deletion</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="rounded-2xl border border-slate-500/30 bg-slate-500/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-500/20"
              >
                Deselect
              </button>
              {deleteConfirm === 'selected' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(null)}
                    className="rounded-2xl border border-slate-500/30 bg-slate-500/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-500/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDeleteSelected}
                    className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
                  >
                    Confirm Delete
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
                >
                  Delete Selected
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="glass-panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-700 p-4">
          <label className="flex items-center gap-2 text-sm text-slate-100">
            <input
              type="checkbox"
              checked={selected.size === runningBalances.length && runningBalances.length > 0}
              onChange={selectAll}
              className="h-5 w-5 rounded border-slate-600 bg-slate-950 text-cyan-500"
            />
            Select All ({runningBalances.length})
          </label>
          {runningBalances.length > 0 && (
            <button
              type="button"
              onClick={handleDeleteAll}
              className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-100 transition hover:border-rose-400 hover:bg-rose-500/20"
            >
              {deleteConfirm === 'all' ? 'Click OK in dialog to confirm' : 'Delete All Entries'}
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700 text-left text-sm text-slate-200">
            <thead className="border-b border-slate-700 bg-slate-950/90 text-slate-400">
              <tr>
                <th className="px-4 py-3 w-8">✓</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Particulars</th>
                <th className="px-4 py-3">Debit</th>
                <th className="px-4 py-3">Credit</th>
                <th className="px-4 py-3">Running Balance</th>
                <th className="px-4 py-3">DR/CR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950/80">
              {runningBalances.length ? (
                runningBalances.map((entry, index) => {
                  const drcr = Number(entry.debit || 0) > Number(entry.credit || 0) ? 'DR' : 'CR';
                  const isSelected = selected.has(index);
                  return (
                    <tr
                      key={`${entry.date}-${entry.particulars ?? entry.notes}-${index}`}
                      className={`hover:bg-slate-900/80 ${isSelected ? 'bg-rose-500/10' : ''}`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(index)}
                          className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-cyan-500"
                        />
                      </td>
                      <td className="px-4 py-4 text-slate-200">{entry.date || '-'}</td>
                      <td className="px-4 py-4">{entry.particulars || entry.partyName || entry.notes || '-'}</td>
                      <td className="px-4 py-4 text-rose-300">{entry.debit ? `₹ ${formatCurrency(entry.debit)}` : '-'}</td>
                      <td className="px-4 py-4 text-emerald-300">{entry.credit ? `₹ ${formatCurrency(entry.credit)}` : '-'}</td>
                      <td className="px-4 py-4 text-slate-100">₹ {formatCurrency(entry.runningBalance)}</td>
                      <td className="px-4 py-4 text-slate-100">{drcr}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-slate-500">No ledger items found. Add entries through OCR, purchase, sales, or payment pages.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Ledger;

