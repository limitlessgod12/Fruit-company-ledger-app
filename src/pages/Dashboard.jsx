import { loadAllData } from '../utils/storage.js';
import StatusCard from '../components/StatusCard.jsx';

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

function Dashboard() {
  const { ledgerEntries, purchases, sales } = loadAllData();
  const today = new Date().toISOString().slice(0, 10);
  const totalDebit = ledgerEntries.reduce((sum, item) => sum + Number(item.debit || 0), 0);
  const totalCredit = ledgerEntries.reduce((sum, item) => sum + Number(item.credit || 0), 0);
  const currentBalance = totalCredit - totalDebit;
  const todaySales = sales.filter((item) => item.date === today).reduce((sum, item) => sum + Number(item.total || 0), 0);
  const todayPurchases = purchases.filter((item) => item.date === today).reduce((sum, item) => sum + Number(item.finalCost || 0), 0);
  const pendingPayments = purchases.filter((item) => item.paymentStatus?.toLowerCase() === 'pending').length;

  const recentEntries = ledgerEntries
    .slice()
    .sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'))
    .slice(0, 6);

  return (
    <section className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-3 lg:grid-cols-2">
        <StatusCard
          title="Total Sales Today"
          value={`₹ ${formatCurrency(todaySales)}`}
          caption="Sales recorded from today entries."
          icon="🛒"
          accent="text-emerald-300"
        />
        <StatusCard
          title="Total Purchases Today"
          value={`₹ ${formatCurrency(todayPurchases)}`}
          caption="Today's purchase expenses."
          icon="📦"
          accent="text-orange-300"
        />
        <StatusCard
          title="Current Balance"
          value={`₹ ${formatCurrency(currentBalance)}`}
          caption="Net cash flow after debit and credit."
          icon="💰"
          accent="text-cyan-300"
        />
        <StatusCard
          title="Total Debit"
          value={`₹ ${formatCurrency(totalDebit)}`}
          caption="Total outgoing ledger amounts."
          icon="⬇️"
          accent="text-rose-300"
        />
        <StatusCard
          title="Total Credit"
          value={`₹ ${formatCurrency(totalCredit)}`}
          caption="Total incoming ledger amounts."
          icon="⬆️"
          accent="text-lime-300"
        />
        <StatusCard
          title="Pending Payments"
          value={`${pendingPayments}`}
          caption="Purchase entries still awaiting payment."
          icon="⏳"
          accent="text-amber-300"
        />
      </div>

      <div className="glass-panel p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Recent Ledger Entries</h2>
            <p className="text-sm text-slate-400">Review the latest saved transactions from your mandi accounting.</p>
          </div>
        </div>
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-950/70 p-2">
          <table className="min-w-full divide-y divide-slate-700 text-left text-sm text-slate-300">
            <thead className="border-b border-slate-700 text-slate-400">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Particulars</th>
                <th className="px-4 py-3">Debit</th>
                <th className="px-4 py-3">Credit</th>
                <th className="px-4 py-3">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentEntries.map((entry, index) => (
                <tr key={`${entry.date}-${index}`} className="hover:bg-slate-900/80">
                  <td className="px-4 py-3 text-slate-200">{entry.date || '-'}</td>
                  <td className="px-4 py-3">{entry.particulars || entry.partyName || entry.notes || '-'}</td>
                  <td className="px-4 py-3 text-rose-300">{entry.debit ? `₹ ${formatCurrency(entry.debit)}` : '-'}</td>
                  <td className="px-4 py-3 text-emerald-300">{entry.credit ? `₹ ${formatCurrency(entry.credit)}` : '-'}</td>
                  <td className="px-4 py-3 text-slate-200">{entry.type || 'Ledger'}</td>
                </tr>
              ))}
              {!recentEntries.length && (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-slate-500">No entries found. Use the OCR or transaction forms to add ledger data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
