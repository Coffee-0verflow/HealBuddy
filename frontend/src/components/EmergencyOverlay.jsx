export default function EmergencyOverlay({ onDismiss }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(127,0,0,0.92)', backdropFilter: 'blur(4px)', padding: 16 }}>
      <div style={{ background: 'var(--bg-surface)', borderRadius: 16, maxWidth: 384, width: '100%', padding: 24, boxShadow: '0 25px 50px rgba(0,0,0,0.5)', textAlign: 'center' }}>
        <div className="text-5xl mb-3">🚨</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#f87171' }}>Emergency Detected</h2>
        <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
          Your symptoms suggest a potentially life-threatening situation. Please seek emergency care immediately.
        </p>
        <div className="space-y-3 mb-5">
          <a href="tel:112" className="flex items-center justify-center gap-3 w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-colors">
            📞 Call 112 — Emergency
          </a>
          <a href="tel:108" className="flex items-center justify-center gap-3 w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-lg transition-colors">
            🚑 Call 108 — Ambulance
          </a>
        </div>
        <button onClick={onDismiss} className="text-sm underline" style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
          I understand — continue to guidance
        </button>
      </div>
    </div>
  );
}
