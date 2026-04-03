export default function EmergencyOverlay({ onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/90 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center border border-red-200 dark:border-red-900">
        <div className="text-5xl mb-3">🚨</div>
        <h2 className="text-2xl font-bold mb-2 text-red-500">Emergency Detected</h2>
        <p className="text-sm mb-5 text-slate-600 dark:text-slate-300">
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
        <button onClick={onDismiss} className="text-sm underline text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          I understand — continue to guidance
        </button>
      </div>
    </div>
  );
}
