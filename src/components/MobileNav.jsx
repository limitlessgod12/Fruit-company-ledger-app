import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { label: 'Dashboard', path: '/', icon: '📊' },
  { label: 'OCR', path: '/ocr', icon: '📷' },
  { label: 'Ledger', path: '/ledger', icon: '📋' },
  { label: 'Purchase', path: '/purchase', icon: '📦' },
  { label: 'Sales', path: '/sales', icon: '🛒' },
  { label: 'Payment', path: '/payment', icon: '💳' },
  { label: 'Reports', path: '/reports', icon: '📈' },
];

function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Prem Fruit</p>
            <h1 className="text-lg font-semibold text-slate-50">Ledger OCR</h1>
          </div>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-2 text-cyan-100 transition hover:border-cyan-400 hover:bg-cyan-500/20"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {open && (
          <nav className="border-t border-white/10 space-y-1 p-4 bg-slate-950/80">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-100 shadow-glow'
                      : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
                  }`
                }
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-xl">
        <div className="flex justify-around gap-1 p-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-medium transition ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-100 shadow-glow'
                    : 'text-slate-400 hover:text-slate-100'
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              <span className="hidden xs:inline">{link.label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}

export default MobileNav;
