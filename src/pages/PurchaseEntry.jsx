import { useMemo, useState } from 'react';
import { savePurchaseEntry, loadAllData } from '../utils/storage.js';

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

function PurchaseEntry() {
  const [supplierName, setSupplierName] = useState('');
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [message, setMessage] = useState('');
  const { purchases } = loadAllData();

  const total = useMemo(() => {
    const qty = Number(quantity || 0);
    const price = Number(rate || 0);
    return qty * price;
  }, [quantity, rate]);

  const handleSave = () => {
    if (!supplierName || !item || !quantity || !rate) {
      setMessage('Please complete all required purchase fields.');
      return;
    }
    const entry = {
      date: new Date().toISOString().slice(0, 10),
      supplierName,
      item,
      quantity,
      rate,
      total,
      finalCost: total,
      paymentStatus,
      particulars: `${item} purchase from ${supplierName}`,
    };
    savePurchaseEntry(entry);
    setMessage('Purchase entry saved successfully.');
    setSupplierName('');
    setItem('');
    setQuantity('');
    setRate('');
    setPaymentStatus('Paid');
  };

  return (
    <section className="space-y-6">
      <div className="glass-panel p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-100">Purchase Entry</h2>
            <p className="mt-2 text-sm text-slate-400">Register supplier bills and payment status for mandi purchases.</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 px-5 py-3 text-sm text-slate-200">
            Total saved purchases: {purchases.length}
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-200">
            Supplier Name
            <input
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              placeholder="Supplier Name"
              className="w-full rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            Fruit Item
            <input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="Apple, Mango, etc."
              className="w-full rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            Quantity
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Qty"
              className="w-full rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            Rate
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="Rate per unit"
              className="w-full rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            Payment Status
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
            >
              <option>Paid</option>
              <option>Pending</option>
            </select>
          </label>
          <div className="space-y-2 text-sm text-slate-200">
            <span>Total</span>
            <div className="rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-slate-100">₹ {formatCurrency(total)}</div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Save Purchase
          </button>
          {message && <p className="text-sm text-emerald-300">{message}</p>}
        </div>
      </div>
    </section>
  );
}

export default PurchaseEntry;
