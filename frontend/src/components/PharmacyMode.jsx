import { useMemo } from 'react';
import { pharmacies } from '../data/pharmacies';
import { getDistanceInKm } from '../logic/distance';

function getNearbyPharmacies(userLat, userLng, limit = 5) {
  return pharmacies
    .map(p => ({ ...p, distance: getDistanceInKm(userLat, userLng, p.lat, p.lng) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

export default function PharmacyMode({ userLocation, onFindOnMap }) {
  const FALLBACK = { lat: 28.6139, lng: 77.2090 };
  const loc = userLocation || FALLBACK;

  const nearby = useMemo(() => getNearbyPharmacies(loc.lat, loc.lng), [loc.lat, loc.lng]);

  return (
    <div className="space-y-4">
      {/* Header banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-xl shrink-0 shadow-sm">💊</div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-black text-emerald-800 dark:text-emerald-300 text-sm">Pharmacy Nearby</p>
            <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-100 dark:bg-emerald-800/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">Low Urgency</span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5 leading-relaxed">
            Based on your condition, you may visit a nearby pharmacy for quick assistance.
          </p>
        </div>
      </div>

      {/* Pharmacy cards */}
      <div className="space-y-3">
        {nearby.map((p, i) => (
          <div key={p.id}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex items-start gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-xl">💊</div>
              {i === 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none">
                  Closest
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-tight">{p.name}</p>
                <span className={`shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full ${
                  p.open24x7
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {p.open24x7 ? '24×7 Open' : 'Check Hours'}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {p.distance.toFixed(1)} km
                </span>
                <span className="text-xs text-amber-500 font-bold">⭐ {p.rating}</span>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={onFindOnMap}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors active:scale-[0.97]"
                >
                  🧭 Navigate on Map
                </button>
                {p.phone && (
                  <a href={`tel:${p.phone.replace(/ /g, '')}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors active:scale-[0.97]">
                    📞 Call
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View on map */}
      <button
        onClick={onFindOnMap}
        className="w-full py-3 rounded-xl border-2 border-dashed border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 text-sm font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
      >
        🗺️ View All on Map with Directions
      </button>
    </div>
  );
}
