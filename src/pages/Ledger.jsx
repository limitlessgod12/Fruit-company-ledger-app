import { useMemo, useState } from 'react';
import { loadAllData } from '../utils/storage.js';

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

function Ledger() {
  const [searchDate, setSearchDate] = useState('');
  const [searchParty, setSearchParty] = useState('');
  const [filterType, setFilterType] = useState('All');
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

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700 text-left text-sm text-slate-200">
            <thead className="border-b border-slate-700 bg-slate-950/90 text-slate-400">
              <tr>
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
                  return (
                    <tr key={`${entry.date}-${entry.particulars ?? entry.notes}-${index}`} className="hover:bg-slate-900/80">
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
                  <td colSpan="6" className="px-4 py-6 text-center text-slate-500">No ledger items found. Add entries through OCR, purchase, sales, or payment pages.</td>
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
