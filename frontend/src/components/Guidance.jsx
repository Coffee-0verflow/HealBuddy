import { useState, useEffect } from 'react';
import PharmacyMode from './PharmacyMode';
import { getCurrentLocation } from '../logic/distance';

export default function Guidance({ analysis, onFindDoctors, onReset }) {
  const isEmergency = analysis.severity === 'critical' || analysis.severity === 'severe';
  const doctorType = analysis.doctor_type || analysis.doctorType || 'General Physician';
  const showPharmacy = analysis.showPharmacyMode && !analysis.redFlagTriggered && !isEmergency;

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (showPharmacy) {
      getCurrentLocation().then(setUserLocation).catch(() => {});
    }
  }, [showPharmacy]);

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-12 pt-4 px-2">
      <button
        onClick={onReset}
        className="text-slate-500 dark:text-slate-400 text-sm font-bold hover:text-slate-900 dark:hover:text-slate-100 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all active:scale-[0.98]"
      >
        ← Back to Dashboard
      </button>

      {/* Triage Card */}
      <div className={`p-6 rounded-2xl border shadow-md relative overflow-hidden ${
        isEmergency
          ? 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/40 dark:to-orange-950/40 border-red-200 dark:border-red-900/50'
          : showPharmacy
          ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800/50'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
      }`}>
        <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-20 ${
          isEmergency ? 'bg-red-400' : showPharmacy ? 'bg-emerald-400' : 'bg-teal-400'
        }`} />

        <div className="flex items-center gap-2 mb-3">
          <span className="relative flex h-2.5 w-2.5">
            {isEmergency && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isEmergency ? 'bg-red-500' : showPharmacy ? 'bg-emerald-500' : 'bg-teal-500'
            }`} />
          </span>
          <span className={`text-[10px] font-black uppercase tracking-widest ${
            isEmergency ? 'text-red-600 dark:text-red-400' : showPharmacy ? 'text-emerald-600 dark:text-emerald-400' : 'text-teal-600 dark:text-teal-400'
          }`}>
            Assessment • {analysis.severity}
          </span>
          {showPharmacy && (
            <span className="ml-auto flex items-center gap-1 text-[9px] font-black bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              💊 Pharmacy Mode
            </span>
          )}
        </div>

        <div className={`text-sm font-medium mb-4 leading-relaxed relative z-10 whitespace-pre-line ${
          isEmergency ? 'text-red-900 dark:text-red-200' : 'text-slate-800 dark:text-slate-200'
        }`}>
          {analysis.advice}
        </div>

        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
          isEmergency
            ? 'bg-red-100/80 dark:bg-red-900/40 text-red-800 dark:text-red-300'
            : showPharmacy
            ? 'bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
            : 'bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300'
        }`}>
          <span className="font-bold">Seek:</span>
          <span className="font-black bg-white/60 dark:bg-white/10 px-2 py-0.5 rounded">{doctorType}</span>
        </div>
      </div>

      {/* Emergency Quick Dial — always visible */}
      <div className="grid grid-cols-2 gap-3">
        <a href="tel:112" className="flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl font-bold text-sm shadow-md active:scale-[0.97] transition-transform">
          🚨 Call 112
        </a>
        <a href="tel:108" className="flex items-center justify-center gap-2 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-md active:scale-[0.97] transition-transform">
          🚑 Call 108
        </a>
      </div>

      {/* PHARMACY MODE — shown for low urgency, no red flags */}
      {showPharmacy && (
        <PharmacyMode userLocation={userLocation} onFindOnMap={onFindDoctors} />
      )}

      {/* HOSPITAL CTA — always shown, but secondary when pharmacy mode is active */}
      <div className={`bg-white dark:bg-slate-800 p-5 rounded-2xl border shadow-sm space-y-4 ${
        showPharmacy ? 'border-slate-200 dark:border-slate-700 opacity-80' : 'border-slate-200 dark:border-slate-700'
      }`}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/40 text-teal-600 rounded-xl flex items-center justify-center shrink-0 text-xl">🏥</div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {showPharmacy ? 'Or Visit a Hospital' : 'Find Nearby Hospitals'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {showPharmacy
                ? 'If symptoms worsen, locate a clinic or hospital nearby.'
                : <>Locate <strong className="text-teal-600 dark:text-teal-400">{doctorType}</strong> facilities near you.</>
              }
            </p>
          </div>
        </div>
        <button
          onClick={onFindDoctors}
          className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
        >
          📍 {showPharmacy ? 'Show Nearby Hospitals →' : 'Show Nearby Hospitals →'}
        </button>
      </div>

      <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-medium px-4">
        ⚕️ Offline estimation for demo purposes. Not professional medical advice.
      </p>
    </div>
  );
}
