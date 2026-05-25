import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import OcrUpload from './pages/OcrUpload.jsx';
import Ledger from './pages/Ledger.jsx';
import PurchaseEntry from './pages/PurchaseEntry.jsx';
import SalesEntry from './pages/SalesEntry.jsx';
import PaymentEntry from './pages/PaymentEntry.jsx';
import Reports from './pages/Reports.jsx';
import { downloadLedgerCsv } from './utils/export.js';
import { clearAllData, loadAllData } from './utils/storage.js';

function App() {
  const { ledgerEntries } = loadAllData();
  const balance = ledgerEntries.reduce((sum, item) => sum + (item.credit - item.debit), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.12),_transparent_20%)] pointer-events-none" />
      <BrowserRouter>
        <div className="relative z-10 flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Prem Fruit Company</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">Ledger OCR System</h1>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={downloadLedgerCsv}
                  className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100 transition hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white"
                >
                  Export Ledger CSV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Clear all stored ledger data? This cannot be undone.')) {
                      clearAllData();
                      window.location.reload();
                    }
                  }}
                  className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-100 transition hover:border-rose-400 hover:bg-rose-500/20 hover:text-white"
                >
                  Clear All Data
                </button>
              </div>
            </div>

            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ocr" element={<OcrUpload />} />
              <Route path="/ledger" element={<Ledger />} />
              <Route path="/purchase" element={<PurchaseEntry />} />
              <Route path="/sales" element={<SalesEntry />} />
              <Route path="/payment" element={<PaymentEntry />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
