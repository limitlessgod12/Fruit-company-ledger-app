import { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { parseOcrText } from '../utils/parseOcr.js';
import { downloadTextFile } from '../utils/export.js';
import { saveParsedLedgerEntries } from '../utils/storage.js';

const formatCurrency = (value) => {
  if (!value && value !== 0) return '';
  return Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

function OcrUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [rawText, setRawText] = useState('');
  const [entries, setEntries] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Upload an image and run OCR');

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setMessage('Image ready for OCR.');
    setRawText('');
    setEntries([]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files.length) {
      handleFile(event.dataTransfer.files[0]);
    }
  };

  const handleRunOcr = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);
    setMessage('Preparing OCR engine...');
    const worker = await createWorker({
      logger: (m) => {
        if (m.status === 'recognizing text') {
          setProgress(Math.floor(m.progress * 100));
          setMessage(`OCR processing: ${Math.floor(m.progress * 100)}%`);
        }
      },
    });
    try {
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data } = await worker.recognize(file);
      const text = data.text || '';
      setRawText(text);
      setEntries(parseOcrText(text));
      setMessage('OCR complete. Review extracted entries below.');
    } catch (error) {
      console.error(error);
      setMessage('OCR failed. Try another image or use a clearer scan.');
    } finally {
      setLoading(false);
      await worker.terminate();
      setProgress(100);
    }
  };

  const updateEntry = (index, field, value) => {
    setEntries((prev) => prev.map((entry, idx) => (idx === index ? { ...entry, [field]: value } : entry)));
  };

  const handleSave = () => {
    if (!entries.length) {
      window.alert('No parsed entries to save.');
      return;
    }
    saveParsedLedgerEntries(entries);
    window.alert('Parsed ledger entries saved successfully.');
    setEntries([]);
    setRawText('');
    setFile(null);
    setPreview('');
    setMessage('Entries saved. Add another bill or continue in the ledger.');
  };

  return (
    <section className="space-y-6">
      <div className="glass-panel p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-100">Image OCR Upload</h2>
            <p className="mt-2 text-sm text-slate-400">Drag an image or browse files to extract handwritten or printed payment sheet text using OCR.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRunOcr}
              disabled={!file || loading}
              className="rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {loading ? 'Processing OCR...' : 'Run OCR'}
            </button>
            <button
              type="button"
              onClick={() => downloadTextFile(rawText)}
              disabled={!rawText}
              className="rounded-3xl border border-cyan-500/20 bg-slate-900/80 px-5 py-3 text-sm text-slate-100 transition hover:border-cyan-400 hover:bg-slate-900"
            >
              Download OCR Text
            </button>
          </div>
        </div>
        <div
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          className="mt-6 rounded-3xl border border-dashed border-cyan-500/30 bg-slate-950/80 px-6 py-12 text-center text-slate-400 transition hover:border-cyan-400 hover:bg-slate-900/80"
        >
          <p className="text-lg text-slate-100">Drag & drop an image here</p>
          <p className="mt-2">or click below to choose a bill image</p>
          <label className="mt-5 inline-flex cursor-pointer rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
            Select Image
            <input type="file" accept="image/*" className="hidden" onChange={(event) => event.target.files?.[0] && handleFile(event.target.files[0])} />
          </label>
          <p className="mt-4 text-xs text-slate-500">Best with clear handwritten or printed sheets. Random ordering is handled by the parser.</p>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="glass-card p-5">
            <h3 className="text-lg font-semibold text-slate-100">OCR Progress</h3>
            <p className="mt-2 text-sm text-slate-400">{message}</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-sm text-slate-400">{progress}% complete</p>
          </div>
          <div className="glass-card p-5">
            <h3 className="text-lg font-semibold text-slate-100">Image Preview</h3>
            <div className="mt-4 min-h-[220px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90">
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full object-contain" />
              ) : (
                <div className="flex h-56 items-center justify-center text-slate-500">No image selected</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-xl font-semibold text-slate-100">OCR Result</h3>
        <textarea
          readOnly
          value={rawText}
          rows="8"
          className="mt-4 w-full resize-none rounded-3xl border border-slate-700/60 bg-slate-950/90 px-4 py-4 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
          placeholder="Extracted text will appear here after OCR completes..."
        />
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-100">Auto Parsed Entries</h3>
            <p className="mt-2 text-sm text-slate-400">Edit extracted ledger rows before saving to your daily ledger.</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={!entries.length}
            className="rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            Save Entries
          </button>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700 text-left text-sm text-slate-200">
            <thead className="border-b border-slate-700 text-slate-400">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Party Name</th>
                <th className="px-4 py-3">Debit</th>
                <th className="px-4 py-3">Credit</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {entries.length ? (
                entries.map((entry, index) => (
                  <tr key={`${entry.partyName}-${index}`} className="hover:bg-slate-900/80">
                    <td className="px-4 py-3">
                      <input
                        className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/90 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                        value={entry.date}
                        onChange={(event) => updateEntry(index, 'date', event.target.value)}
                        placeholder="YYYY-MM-DD"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/90 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                        value={entry.partyName}
                        onChange={(event) => updateEntry(index, 'partyName', event.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/90 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                        value={entry.debit}
                        onChange={(event) => updateEntry(index, 'debit', event.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/90 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                        value={entry.credit}
                        onChange={(event) => updateEntry(index, 'credit', event.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/90 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                        value={entry.type}
                        onChange={(event) => updateEntry(index, 'type', event.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/90 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                        value={entry.notes}
                        onChange={(event) => updateEntry(index, 'notes', event.target.value)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-slate-500">No parsed entries available. Upload an invoice image and run OCR.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default OcrUpload;
