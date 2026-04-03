export default function Guidance({ analysis, onFindDoctors, onReset }) {
  const isEmergency = analysis.severity === 'critical' || analysis.severity === 'severe';
  const doctorType = analysis.doctor_type || analysis.doctorType || 'General Physician';

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-12 pt-4 px-2">
      <button 
        onClick={onReset} 
        className="text-slate-500 text-sm font-bold hover:text-slate-900 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition-all active:scale-[0.98]"
      >
        ← Back to Dashboard
      </button>

      {/* Triage Card */}
      <div className={`p-6 rounded-2xl border shadow-md relative overflow-hidden ${isEmergency ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200' : 'bg-white border-slate-200'}`}>
        <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-20 ${isEmergency ? 'bg-red-400' : 'bg-teal-400'}`}></div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="relative flex h-2.5 w-2.5">
            {isEmergency && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isEmergency ? 'bg-red-500' : 'bg-teal-500'}`}></span>
          </span>
          <span className={`text-[10px] font-black uppercase tracking-widest ${isEmergency ? 'text-red-600' : 'text-teal-600'}`}>
            Assessment • {analysis.severity}
          </span>
        </div>
        
        <div className={`text-sm font-medium mb-4 leading-relaxed relative z-10 whitespace-pre-line ${isEmergency ? 'text-red-900' : 'text-slate-800'}`}>
          {analysis.advice}
        </div>
        
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${isEmergency ? 'bg-red-100/80 text-red-800' : 'bg-teal-50 text-teal-800'}`}>
          <span className="font-bold">Seek:</span>
          <span className="font-black bg-white/60 px-2 py-0.5 rounded">{doctorType}</span>
        </div>
      </div>

      {/* Emergency Quick Dial */}
      <div className="grid grid-cols-2 gap-3">
        <a href="tel:112" className="flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl font-bold text-sm shadow-md active:scale-[0.97] transition-transform">
          🚨 Call 112
        </a>
        <a href="tel:108" className="flex items-center justify-center gap-2 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-md active:scale-[0.97] transition-transform">
          🚑 Call 108
        </a>
      </div>

      {/* Find Hospitals CTA */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center shrink-0 text-xl">🏥</div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Find Nearby Hospitals</h3>
            <p className="text-xs text-slate-500 mt-0.5">Locate <strong className="text-teal-600">{doctorType}</strong> facilities near you.</p>
          </div>
        </div>
        <button 
          onClick={onFindDoctors}
          className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
        >
          📍 Show Nearby Hospitals →
        </button>
      </div>

      <p className="text-[10px] text-slate-400 text-center font-medium px-4">
        ⚕️ Offline estimation for demo purposes. Not professional medical advice.
      </p>
    </div>
  );
}
