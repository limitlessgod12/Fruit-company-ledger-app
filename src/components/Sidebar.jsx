import { NavLink } from 'react-router-dom';

const links = [
  { label: 'Dashboard', path: '/' },
  { label: 'OCR Upload', path: '/ocr' },
  { label: 'Ledger', path: '/ledger' },
  { label: 'Purchase Entry', path: '/purchase' },
  { label: 'Sales Entry', path: '/sales' },
  { label: 'Payment Entry', path: '/payment' },
  { label: 'Reports', path: '/reports' },
];

function Sidebar() {
  return (
    <aside className="hidden w-80 shrink-0 border-r border-white/5 bg-slate-950/90 p-6 backdrop-blur-xl md:block">
      <div className="mb-10 rounded-3xl border border-cyan-500/10 bg-slate-900/70 p-6 text-slate-100 shadow-glow backdrop-blur-xl">
        <div className="mb-4 text-sm uppercase tracking-[0.35em] text-cyan-300/80">Prem Fruit</div>
        <h2 className="text-3xl font-semibold tracking-tight">Ledger OCR</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">Manage mandi accounting, customer and supplier entries, and OCR bill extraction all in one place.</p>
      </div>
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/'}
            className={({ isActive }) =>
              `block rounded-[24px] px-5 py-3 text-sm font-medium transition ${
                isActive ? 'bg-cyan-500/15 text-cyan-100 shadow-glow' : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-10 rounded-3xl border border-slate-700/50 bg-slate-900/70 p-5 text-sm text-slate-400 shadow-xl backdrop-blur-xl">
        <p className="font-semibold text-slate-100">Workflow Tips</p>
        <ul className="mt-3 space-y-2 text-slate-400">
          <li>1. Upload bill image in OCR page.</li>
          <li>2. Review parsed entries before saving.</li>
          <li>3. Track purchases, sales, and payments in ledger.</li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
