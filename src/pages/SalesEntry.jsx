import { useMemo, useState } from 'react';
import { saveSalesEntry, loadAllData } from '../utils/storage.js';

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

function SalesEntry() {
  const [customerName, setCustomerName] = useState('');
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [transportCharges, setTransportCharges] = useState('');
  const [labourCharges, setLabourCharges] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [message, setMessage] = useState('');
  const { sales } = loadAllData();

  const total = useMemo(() => {
    return Number(quantity || 0) * Number(rate || 0);
  }, [quantity, rate]);

  const finalTotal = useMemo(() => {
    return total + Number(transportCharges || 0) + Number(labourCharges || 0);
  }, [total, transportCharges, labourCharges]);

  const handleSave = () => {
    if (!customerName || !item || !quantity || !rate) {
      setMessage('Please fill all required sales fields.');
      return;
    }
    const entry = {
      date: new Date().toISOString().slice(0, 10),
      customerName,
      item,
      quantity,
      rate,
      total,
      transportCharges,
      labourCharges,
      finalTotal,
      paymentMode,
      particulars: `${item} sale to ${customerName}`,
    };
    saveSalesEntry(entry);
    setMessage('Sales entry saved successfully.');
    setCustomerName('');
    setItem('');
    setQuantity('');
    setRate('');
    setTransportCharges('');
    setLabourCharges('');
    setPaymentMode('Cash');
  };

  return (
    <section className="space-y-6">
      <div className="glass-panel p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-100">Sales Entry</h2>
            <p className="mt-2 text-sm text-slate-400">Record customer sales with quantity, rates, transport, labour charges and payment mode for daily revenue tracking.</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 px-5 py-3 text-sm text-slate-200">
            Total sales records: {sales.length}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-200">
            Customer Name
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name"
              className="w-full rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            Item
            <input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="Fruit Item"
              className="w-full rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            Quantity
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
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
            Transport Charges
            <input
              type="number"
              value={transportCharges}
              onChange={(e) => setTransportCharges(e.target.value)}
              placeholder="Transport cost"
              className="w-full rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            Labour Charges
            <input
              type="number"
              value={labourCharges}
              onChange={(e) => setLabourCharges(e.target.value)}
              placeholder="Labour cost"
              className="w-full rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            Payment Mode
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Bank Transfer</option>
            </select>
          </label>
          <div className="space-y-2 text-sm text-slate-200">
            <span>Base Amount</span>
            <div className="rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-slate-100">₹ {formatCurrency(total)}</div>
          </div>
          <div className="space-y-2 text-sm text-slate-200">
            <span>Final Total</span>
            <div className="rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-slate-100">₹ {formatCurrency(finalTotal)}</div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-3xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Save Sale
          </button>
          {message && <p className="text-sm text-emerald-300">{message}</p>}
        </div>
      </div>
    </section>
  );
}

export default SalesEntry;
