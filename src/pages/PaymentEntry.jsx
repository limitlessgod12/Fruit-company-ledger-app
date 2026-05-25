import { useState } from 'react';
import { savePaymentEntry } from '../utils/storage.js';

function PaymentEntry() {
  const [paidTo, setPaidTo] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Cash');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  const handleSave = () => {
    if (!paidTo || !amount || !reason) {
      setMessage('Please fill out all payment fields.');
      return;
    }
    savePaymentEntry({
      date: new Date().toISOString().slice(0, 10),
      paidTo,
      amount: Number(amount),
      method,
      reason,
      particulars: `${paidTo} payment via ${method}`,
    });
    setMessage('Payment record saved to ledger.');
    setPaidTo('');
    setAmount('');
    setMethod('Cash');
    setReason('');
  };

  return (
    <section className="space-y-6">
      <div className="glass-panel p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-100">Payment Entry</h2>
            <p className="mt-2 text-sm text-slate-400">Track outgoing payments with reason and payment method for better cash management.</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 px-5 py-3 text-sm text-slate-200">Methods: Cash, UPI, Bank Transfer</div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-200">
            Paid To
            <input
              value={paidTo}
              onChange={(e) => setPaidTo(e.target.value)}
              placeholder="Vendor or party name"
              className="w-full rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            Amount
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Payment amount"
              className="w-full rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            Payment Method
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Bank Transfer</option>
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-200 sm:col-span-2">
            Reason
            <textarea
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for payment"
              className="w-full rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-3xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Save Payment
          </button>
          {message && <p className="text-sm text-emerald-300">{message}</p>}
        </div>
      </div>
    </section>
  );
}

export default PaymentEntry;
