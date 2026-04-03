export default function EmergencyOverlay({ onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-900/90 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
        <div className="text-5xl mb-3">🚨</div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">Emergency Detected</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-5">
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
        <button onClick={onDismiss} className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline">
          I understand — continue to guidance
        </button>
      </div>
    </div>
  );
}
