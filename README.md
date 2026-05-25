# 🍎 Prem Fruit Company Ledger OCR System

A modern, production-ready web application for fruit mandi (market) accounting with OCR bill extraction, daily ledger tracking, and financial reports.

## ✨ Features

- **Dashboard**: Real-time summary of sales, purchases, balance, and pending payments
- **OCR Upload**: Drag-and-drop image upload with Tesseract.js text extraction
- **Ledger Management**: View, search, and filter all transactions with running balance
- **Purchase Entry**: Track supplier bills with transport and labour charges
- **Sales Entry**: Record customer sales with payment modes (Cash, UPI, Bank)
- **Payment Entry**: Log outgoing payments with reason and method
- **Reports**: Monthly trends, profit/loss charts, and payment distribution
- **Export**: Download ledger as CSV or OCR text
- **Dark Glassmorphism UI**: Modern, responsive design with animated gradients
- **Local Storage**: All data saved in browser—no backend required

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
git clone https://github.com/yourusername/prem-fruit-ledger.git
cd prem-fruit-ledger
npm install
```

### Development

```bash
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components (Sidebar, StatusCard)
├── pages/           # Route pages (Dashboard, OCR, Ledger, etc.)
├── utils/           # Storage, OCR parsing, export functions
├── styles/          # Global CSS and utilities
├── App.jsx          # Main app with routing
├── index.css        # Tailwind + base styles
└── main.jsx         # React entry point
```

## 🛠️ Tech Stack

- **React 18** — UI framework
- **Vite 5** — Fast build tool
- **Tailwind CSS 3** — Styling
- **Tesseract.js 4** — OCR engine
- **React Router 6** — Navigation
- **Chart.js** — Financial charts
- **Browser LocalStorage** — Data persistence

## 📝 Usage

1. **Upload Bill Image**
   - Go to OCR Upload page
   - Drag or browse an image of a handwritten/printed bill
   - Click "Run OCR" to extract text
   - Review and edit parsed entries
   - Save to ledger

2. **Manual Entry**
   - Use Purchase, Sales, or Payment entry pages
   - Fill in details and save
   - Entries auto-sync to the ledger

3. **Review Ledger**
   - View all transactions with running balance
   - Search by date or party name
   - Filter by transaction type

4. **Generate Reports**
   - View monthly sales vs purchases
   - Check profit/loss trends
   - Analyze payment method distribution

5. **Export Data**
   - Download ledger as CSV
   - Export OCR text from uploads
   - Clear all data (with confirmation)

## 🎨 Customization

- **Colors**: Edit `tailwind.config.js` for theme colors
- **OCR Language**: Modify `src/pages/OcrUpload.jsx` to add language support
- **Chart Data**: Adjust calculations in `src/pages/Reports.jsx`

## 📦 Data Storage

All data is stored in browser's localStorage:
- `premFruitLedgerEntries` — All ledger transactions
- `premFruitPurchaseEntries` — Purchase records
- `premFruitSalesEntries` — Sales records
- `premFruitPaymentEntries` — Payment records

**Note**: Data persists per browser. Different browsers = different ledgers.

## 🔐 Security & Privacy

- No backend server—100% client-side processing
- All data stays on your device
- OCR processing happens locally via Tesseract.js
- Suitable for offline use

## 📄 License

MIT License — Feel free to use and modify for your business.

## 🤝 Contributing

Pull requests welcome! For major changes, open an issue first.

## 📞 Support

For issues or feature requests, create a GitHub issue.

---

**Made with ❤️ for Prem Fruit Company and mandi muneem (accountants) everywhere.**
