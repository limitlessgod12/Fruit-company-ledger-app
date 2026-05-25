const normalizeDate = (rawDate) => {
  if (!rawDate) return '';
  const cleaned = rawDate.replace(/[\.]/g, '/').replace(/-/g, '/').trim();
  const parts = cleaned.split('/').filter(Boolean);
  if (parts.length === 3) {
    let [a, b, c] = parts;
    if (c.length === 2) c = `20${c}`;
    if (a.length === 4) return `${a}-${b.padStart(2, '0')}-${c.padStart(2, '0')}`;
    return `${c.padStart(4, '0')}-${a.padStart(2, '0')}-${b.padStart(2, '0')}`;
  }
  return rawDate;
};

const findDate = (line) => {
  const dateRe = /((?:\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})|(?:\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}))/;
  const match = line.match(dateRe);
  return match ? normalizeDate(match[0]) : '';
};

const parseAmount = (text) => {
  const cleaned = text.replace(/[,₹Rs\s]+/g, ' ').trim();
  const numeric = cleaned.match(/-?\d+(?:\.\d+)?/g);
  if (!numeric) return [];
  return numeric.map((value) => Number(value.replace(/,/g, ''))).filter((n) => !Number.isNaN(n));
};

const chooseType = (line) => {
  const lower = line.toLowerCase();
  if (/purchase|supplier|paid to|transport|labour|bill/i.test(lower)) return 'Purchase';
  if (/sale|customer|received|sold|payment received|credit/i.test(lower)) return 'Sale';
  if (/upi|bank transfer|cash|payment|paid to/i.test(lower)) return 'Payment';
  if (/debit|dr/i.test(lower)) return 'Debit';
  if (/credit|cr/i.test(lower)) return 'Credit';
  return 'General';
};

const parseLine = (line) => {
  const date = findDate(line);
  const amounts = parseAmount(line);
  const type = chooseType(line);
  let debit = 0;
  let credit = 0;

  if (amounts.length === 1) {
    if (/credit|cr|received|sale|sold|payment received|cash/i.test(line)) {
      credit = amounts[0];
    } else {
      debit = amounts[0];
    }
  } else if (amounts.length >= 2) {
    if (/debit|dr/i.test(line)) {
      debit = amounts[0];
      credit = amounts[1];
    } else if (/credit|cr/i.test(line)) {
      credit = amounts[0];
      debit = amounts[1];
    } else {
      debit = amounts[0];
      credit = amounts[amounts.length - 1];
    }
  }

  const partyName = line
    .replace(date, '')
    .replace(/\b(?:dr|cr|debit|credit|total|amount|qty|quantity|rate|kg|kgs|invoice|bill|sale|paid|to|from|payment|supplier|customer)\b/gi, '')
    .replace(/[-:₹,\/\d\.]+/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return {
    date,
    partyName: partyName || 'Unknown Party',
    debit,
    credit,
    type,
    notes: line,
  };
};

export const parseOcrText = (rawText) => {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 50);

  const entries = lines.map(parseLine).filter((entry) => entry.debit || entry.credit || entry.partyName);
  if (entries.length) return entries;
  return [{ date: '', partyName: '', debit: 0, credit: 0, type: 'General', notes: rawText.slice(0, 250) }];
};
