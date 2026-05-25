import { loadAllData } from '../utils/storage.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, ArcElement, Title } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, ArcElement, Title);

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

const buildMonthlyTotals = (items, key) => {
  const totals = Array(12).fill(0);
  items.forEach((item) => {
    const date = new Date(item.date || '1970-01-01');
    const monthIndex = date.getMonth();
    totals[monthIndex] += Number(item[key] || 0);
  });
  return totals;
};

function Reports() {
  const { purchases, sales, payments, ledgerEntries } = loadAllData();
  const salesTotals = buildMonthlyTotals(sales, 'total');
  const purchaseTotals = buildMonthlyTotals(purchases, 'finalCost');
  const profitTotals = salesTotals.map((sale, index) => sale - purchaseTotals[index]);
  const pendingPayments = purchases.filter((item) => item.paymentStatus?.toLowerCase() === 'pending').length;
  const totalCash = payments.filter((item) => item.method === 'Cash').reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalBank = payments.filter((item) => item.method === 'Bank Transfer').reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalUpi = payments.filter((item) => item.method === 'UPI').reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const debit = ledgerEntries.reduce((sum, item) => sum + Number(item.debit || 0), 0);
  const credit = ledgerEntries.reduce((sum, item) => sum + Number(item.credit || 0), 0);
  const balance = credit - debit;

  return (
    <section className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-3 lg:grid-cols-2">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Daily Profit/Loss</p>
            <span className="rounded-2xl bg-emerald-500/15 px-3 py-1 text-xs text-emerald-200">Live</span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-100">₹ {formatCurrency(profitTotals.reduce((sum, value) => sum + value, 0))}</p>
          <p className="mt-2 text-sm text-slate-400">Monthly gross profit minus purchase totals.</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-slate-400">Pending Payments</p>
          <p className="mt-4 text-3xl font-semibold text-slate-100">{pendingPayments}</p>
          <p className="mt-2 text-sm text-slate-400">Unpaid supplier bills awaiting settlement.</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-slate-400">Cash vs Bank</p>
          <p className="mt-4 text-3xl font-semibold text-slate-100">₹ {formatCurrency(totalCash + totalBank + totalUpi)}</p>
          <p className="mt-2 text-sm text-slate-400">Registered payment flow by method.</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="glass-panel p-5">
          <h3 className="text-xl font-semibold text-slate-100">Monthly Sales vs Purchases</h3>
          <div className="mt-6">
            <Bar
              data={{
                labels: monthLabels,
                datasets: [
                  {
                    label: 'Sales',
                    data: salesTotals,
                    backgroundColor: 'rgba(56,189,248,0.8)',
                    borderRadius: 12,
                  },
                  {
                    label: 'Purchases',
                    data: purchaseTotals,
                    backgroundColor: 'rgba(16,185,129,0.85)',
                    borderRadius: 12,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { labels: { color: '#cbd5e1' } },
                  title: { display: false },
                },
                scales: {
                  x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                  y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.15)' } },
                },
              }}
            />
          </div>
        </div>
        <div className="glass-panel p-5">
          <h3 className="text-xl font-semibold text-slate-100">Cash / UPI / Bank Distribution</h3>
          <div className="mt-6">
            <Doughnut
              data={{
                labels: ['Cash', 'UPI', 'Bank Transfer'],
                datasets: [
                  {
                    data: [totalCash, totalUpi, totalBank],
                    backgroundColor: ['#22d3ee', '#60a5fa', '#34d399'],
                    hoverOffset: 10,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { labels: { color: '#cbd5e1' } },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="glass-panel p-5">
        <h3 className="text-xl font-semibold text-slate-100">Profit / Loss Trend</h3>
        <p className="mt-2 text-sm text-slate-400">Trend of revenue and purchases across months to help you track business health.</p>
        <div className="mt-6">
          <Line
            data={{
              labels: monthLabels,
              datasets: [
                {
                  label: 'Profit / Loss',
                  data: profitTotals,
                  borderColor: '#7dd3fc',
                  backgroundColor: 'rgba(56,189,248,0.18)',
                  fill: true,
                  tension: 0.35,
                  pointRadius: 4,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { labels: { color: '#cbd5e1' } },
              },
              scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.15)' } },
              },
            }}
          />
        </div>
      </div>

      <div className="glass-panel p-5">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-700/60 bg-slate-950/80 p-5">
            <p className="text-sm text-slate-400">Current Balance</p>
            <p className="mt-3 text-3xl font-semibold text-slate-100">₹ {formatCurrency(balance)}</p>
          </div>
          <div className="rounded-3xl border border-slate-700/60 bg-slate-950/80 p-5">
            <p className="text-sm text-slate-400">Total Sales This Year</p>
            <p className="mt-3 text-3xl font-semibold text-slate-100">₹ {formatCurrency(salesTotals.reduce((sum, v) => sum + v, 0))}</p>
          </div>
          <div className="rounded-3xl border border-slate-700/60 bg-slate-950/80 p-5">
            <p className="text-sm text-slate-400">Total Purchases This Year</p>
            <p className="mt-3 text-3xl font-semibold text-slate-100">₹ {formatCurrency(purchaseTotals.reduce((sum, v) => sum + v, 0))}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Reports;
