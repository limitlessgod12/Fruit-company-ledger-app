function StatusCard({ title, value, caption, icon, accent }) {
  return (
    <div className="glass-card p-5 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-sm uppercase tracking-[0.3em] text-slate-400">{title}</span>
          <p className="mt-3 text-3xl font-semibold text-slate-50">{value}</p>
        </div>
        <div className={`rounded-3xl px-4 py-3 text-xl ${accent} bg-white/5`}>{icon}</div>
      </div>
      <p className="mt-4 text-sm text-slate-400">{caption}</p>
    </div>
  );
}

export default StatusCard;
