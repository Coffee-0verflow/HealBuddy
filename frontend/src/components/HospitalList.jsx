import React, { useState } from 'react';

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`text-sm ${i < full ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]' : (i === full && half) ? 'text-amber-300 drop-shadow-[0_0_5px_rgba(252,211,77,0.6)]' : 'text-slate-600'}`}>★</span>
      ))}
      <span className="text-xs font-black text-slate-300 ml-1.5 bg-slate-800 px-1.5 py-0.5 rounded">{rating}</span>
    </div>
  );
}

export default function HospitalList({
  nearbyDocs,
  showHospitals,
  requiredDoctorType,
  routeInfo,
  handleNavigate,
  showPharmacies,
  nearbyPharmacies,
  handlePharmacyNavigate,
  selectedFacility,
  onFacilitySelect
}) {
  const [showAllPharmacies, setShowAllPharmacies] = useState(false);
  const visiblePharmacies = showAllPharmacies ? nearbyPharmacies : nearbyPharmacies.slice(0, 5);

  return (
    <div className="flex flex-col space-y-8 pb-10">
      {/* Hospitals Section */}
      {showHospitals && nearbyDocs.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <span className="text-xl">🏥</span>
            </div>
            <h3 className="font-black text-xl text-white tracking-wide">Top Hospitals</h3>
          </div>

          <div className="space-y-4">
            {nearbyDocs.map((doc, index) => {
              const isSelected = selectedFacility?.id === doc.id;
              const isRouted = routeInfo?.name === doc.name;

              return (
                <div 
                  key={doc.id}
                  onClick={() => onFacilitySelect(doc)}
                  className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
                    ${isSelected 
                      ? 'bg-slate-800/80 border-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.25)] scale-[1.02]' 
                      : 'bg-slate-900/60 border-slate-700/50 hover:bg-slate-800 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:-translate-y-1'
                    } backdrop-blur-xl`}
                >
                  {/* Neon top accent */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-400 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

                  <div className="flex items-start justify-between mb-3 relative z-10">
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          index === 0 
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.4)]' 
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {doc.rankBadge}
                        </span>
                        {doc.trustBadge && (
                          <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/30">✓ Verified</span>
                        )}
                      </div>
                      
                      <h4 className="font-black text-white text-lg leading-tight group-hover:text-indigo-300 transition-colors">{doc.name}</h4>
                      <p className="text-[11px] text-cyan-400 uppercase tracking-widest font-bold mt-1">{doc.specialty}</p>
                    </div>
                    
                    <div className="flex flex-col items-end shrink-0">
                      <div className="bg-slate-950/80 rounded-xl px-3 py-2 border border-slate-700/50 text-center shadow-inner">
                        <p className="font-black text-white text-lg">{doc.distance.toFixed(1)} <span className="text-[10px] text-slate-500 font-bold">km</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-wrap items-end justify-between mt-4">
                    <div className="space-y-3">
                      <StarRating rating={doc.rating || 3.5} />
                      <p className="text-xs font-bold text-slate-400"><span className="text-slate-500 uppercase tracking-wider text-[10px] mr-2">Cost</span>{doc.cost}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onFacilitySelect(doc); handleNavigate(doc); }}
                        className={`px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                          isRouted 
                            ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] active:scale-95'
                        }`}
                      >
                        {isRouted ? '✓ Routing' : '🧭 Go'}
                      </button>
                      
                      {doc.phone && (
                        <a 
                          href={`tel:${doc.phone.replace(/ /g, '')}`} 
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center transition-colors active:scale-95"
                        >
                          📞
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Conditions */}
                  {doc.conditions && doc.conditions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5 relative z-10">
                      {doc.conditions.filter(c => requiredDoctorType?.toLowerCase().includes(c)).map(c => (
                         <span key={`req-${c}`} className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                           {c}
                         </span>
                      ))}
                      {doc.conditions.filter(c => !requiredDoctorType?.toLowerCase().includes(c)).slice(0, 3).map(c => (
                        <span key={c} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Pharmacies Section */}
      {showPharmacies && nearbyPharmacies.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6 mt-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <span className="text-xl">💊</span>
            </div>
            <h3 className="font-black text-xl text-white tracking-wide">Nearby Pharmacies</h3>
          </div>

          <div className="space-y-4">
            {visiblePharmacies.map((p, index) => {
              const isSelected = selectedFacility?.id === p.id;
              const isRouted = routeInfo?.name === p.name;

              return (
                <div 
                  key={p.id}
                  onClick={() => onFacilitySelect(p)}
                  className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
                    ${isSelected 
                      ? 'bg-slate-800/80 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)] scale-[1.02]' 
                      : 'bg-slate-900/60 border-slate-700/50 hover:bg-slate-800 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:-translate-y-1'
                    } backdrop-blur-xl`}
                >
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

                  <div className="flex items-start justify-between mb-3 relative z-10">
                    <div className="flex-1 min-w-0 pr-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border mb-2 ${
                        index === 0 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {index === 0 ? 'Nearest First' : 'Option'}
                      </span>
                      
                      <h4 className="font-black text-white text-lg leading-tight group-hover:text-emerald-300 transition-colors">{p.name}</h4>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full border ${
                          p.open24x7 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                        }`}>
                          {p.open24x7 ? '🟢 24×7 Open' : '⏰ Verify Hours'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <div className="bg-slate-950/80 rounded-xl px-3 py-2 border border-slate-700/50 text-center shadow-inner">
                        <p className="font-black text-white text-lg">{p.distance.toFixed(1)} <span className="text-[10px] text-slate-500 font-bold">km</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-end justify-between mt-4">
                    <StarRating rating={p.rating || 4.0} />
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onFacilitySelect(p); handlePharmacyNavigate(p); }}
                        className={`px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                          isRouted 
                            ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] active:scale-95'
                        }`}
                      >
                        {isRouted ? '✓ Routing' : '🧭 Go'}
                      </button>
                      
                      {p.phone && (
                        <a 
                          href={`tel:${p.phone.replace(/ /g, '')}`} 
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center transition-colors active:scale-95"
                        >
                          📞
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {nearbyPharmacies.length > 5 && (
            <button
              onClick={() => setShowAllPharmacies(v => !v)}
              className="mt-6 w-full py-4 rounded-xl border border-dashed border-emerald-500/40 text-emerald-400 font-black text-sm uppercase tracking-widest hover:bg-emerald-500/10 transition-colors active:scale-95 flex items-center justify-center gap-2"
            >
              {showAllPharmacies ? 'Shrink List ⬆' : `View All ${nearbyPharmacies.length} Pharmacies ⬇`}
            </button>
          )}
        </section>
      )}

      {/* Empty State */}
      {!showHospitals && !showPharmacies && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-sm font-bold">Please select at least one facility type to display.</p>
        </div>
      )}
    </div>
  );
}
