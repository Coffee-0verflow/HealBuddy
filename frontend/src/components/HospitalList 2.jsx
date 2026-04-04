// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`text-sm ${i < full ? 'text-amber-400' : (i === full && half) ? 'text-amber-300' : 'text-slate-600'}`}>★</span>
      ))}
      <span className="text-xs font-bold text-slate-400 ml-1">{rating}</span>
    </div>
  );
}

export default function HospitalList({ 
  showHospitals, 
  nearbyDocs, 
  requiredDoctorType, 
  routeInfo, 
  handleNavigate,
  showPharmacies,
  visiblePharmacies,
  handlePharmacyNavigate,
  showAllPharmacies,
  setShowAllPharmacies,
  nearbyPharmaciesCount
}) {
  return (
    <div className="flex flex-col gap-6 p-4">
      {showHospitals && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.3)]">
              <span className="text-indigo-400 font-bold">H</span>
            </div>
            <h3 className="font-black text-xl text-slate-100 tracking-wide text-shadow-sm shadow-indigo-500/50">Top Hospitals for You</h3>
          </div>
          
          <div className="space-y-4">
            {nearbyDocs.map((doc, index) => (
              <motion.div 
                key={doc.id} 
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)' }}
                className={`bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border relative overflow-hidden transition-all duration-300 cursor-pointer ${
                  routeInfo?.name === doc.name 
                    ? 'border-indigo-400 ring-1 ring-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                    : 'border-slate-700/50 hover:border-indigo-500/30'
                }`}
                onClick={() => handleNavigate(doc)}
              >
                {/* Glow behind card */}
                {routeInfo?.name === doc.name && (
                  <div className="absolute inset-0 bg-indigo-500/5 blur-xl pointer-events-none" />
                )}

                <div className="flex items-start justify-between mb-2 relative z-10">
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-2 border ${
                      index === 0 
                        ? 'bg-indigo-900/40 text-indigo-300 border-indigo-500/50 shadow-[0_0_8px_rgba(99,102,241,0.4)]' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {doc.rankBadge}
                    </span>
                    <h4 className="font-black text-slate-100 text-lg leading-tight pr-2">{doc.name}</h4>
                    <p className="text-xs text-indigo-400 uppercase tracking-widest font-bold mt-1">{doc.specialty}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {doc.trustBadge && (
                      <span className="bg-emerald-900/30 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]">✓ Verified</span>
                    )}
                    {doc.condMatch?.matched && (
                      <span className="bg-cyan-900/30 text-cyan-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]">Treats this</span>
                    )}
                  </div>
                </div>

                <div className="relative z-10 mb-3">
                  <StarRating rating={doc.rating || 3.5} />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3 relative z-10">
                  <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex flex-col justify-center">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Distance</p>
                    <p className="font-black text-slate-100 text-lg">{doc.distance.toFixed(1)} <span className="text-xs text-slate-400 font-bold">km</span></p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex flex-col justify-center">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Est. Cost</p>
                    <p className="font-black text-slate-100 text-lg">{doc.cost}</p>
                  </div>
                </div>

                {doc.conditions && doc.conditions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5 relative z-10">
                    {doc.conditions.slice(0, 4).map(c => (
                      <span key={c} className={`px-2 py-0.5 rounded border text-[9px] font-bold ${
                        requiredDoctorType && requiredDoctorType.toLowerCase().includes(c) 
                          ? 'bg-cyan-900/30 text-cyan-300 border-cyan-500/40 shadow-[0_0_5px_rgba(6,182,212,0.3)]' 
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-700/50 flex gap-2 relative z-10">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => { e.stopPropagation(); handleNavigate(doc); }}
                    className={`flex-1 py-2.5 rounded-xl font-black text-sm shadow-lg transition-colors flex items-center justify-center gap-2 ${
                      routeInfo?.name === doc.name 
                        ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
                    }`}
                  >
                    {routeInfo?.name === doc.name ? '✓ Routing' : '🧭 Navigate'}
                  </motion.button>
                  {doc.phone && (
                    <motion.a 
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => e.stopPropagation()}
                      href={`tel:${doc.phone.replace(/ /g, '')}`} 
                      className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      📞 Call
                    </motion.a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {showPharmacies && visiblePharmacies.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mt-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)] text-emerald-400 font-black text-xs">
              💊
            </div>
            <h3 className="font-black text-xl text-slate-100 tracking-wide">Nearby Pharmacies</h3>
            <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-900/40 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full ml-auto shadow-[0_0_8px_rgba(16,185,129,0.2)]">
              {nearbyPharmaciesCount} found
            </span>
          </div>

          <div className="space-y-4">
            {visiblePharmacies.map((p, index) => (
              <motion.div 
                key={p.id} 
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)' }}
                className={`bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border relative overflow-hidden transition-all duration-300 cursor-pointer ${
                  routeInfo?.name === p.name
                    ? 'border-emerald-400 ring-1 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'border-slate-700/50 hover:border-emerald-500/30'
                }`}
                onClick={() => handlePharmacyNavigate(p)}
              >
                {routeInfo?.name === p.name && (
                  <div className="absolute inset-0 bg-emerald-500/5 blur-xl pointer-events-none" />
                )}
                <div className="flex items-start justify-between mb-2 relative z-10">
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-2 border ${
                      index === 0 ? 'bg-emerald-900/40 text-emerald-300 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {index === 0 ? '⭐ Closest Pharmacy' : '📍 Nearby'}
                    </span>
                    <h4 className="font-black text-slate-100 text-lg leading-tight pr-2">{p.name}</h4>
                    <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold mt-1">Pharmacy</p>
                  </div>
                  <span className={`shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full border shadow-sm ${
                    p.open24x7
                      ? 'bg-emerald-900/40 text-emerald-400 border-emerald-500/30 shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-600'
                  }`}>
                    {p.open24x7 ? '🟢 24×7 Open' : '⏰ Check Hours'}
                  </span>
                </div>

                <div className="relative z-10 mb-3">
                  <StarRating rating={p.rating || 4.0} />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3 relative z-10">
                  <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex flex-col justify-center">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Distance</p>
                    <p className="font-black text-slate-100 text-lg">{p.distance.toFixed(1)} <span className="text-xs text-slate-400 font-bold">km</span></p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex flex-col justify-center">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Status</p>
                    <p className={`font-black text-lg ${p.open24x7 ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {p.open24x7 ? 'Open' : 'Verify'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/50 flex gap-2 relative z-10">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => { e.stopPropagation(); handlePharmacyNavigate(p); }}
                    className={`flex-1 py-2.5 rounded-xl font-black text-sm shadow-lg transition-colors flex items-center justify-center gap-2 ${
                      routeInfo?.name === p.name
                        ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                        : 'bg-emerald-600/80 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                    }`}
                  >
                    {routeInfo?.name === p.name ? '✓ Routing' : '🧭 Navigate'}
                  </motion.button>
                  {p.phone && (
                    <motion.a 
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => e.stopPropagation()}
                      href={`tel:${p.phone.replace(/ /g,'')}`}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 py-2.5 rounded-xl font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      📞 Call
                    </motion.a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {nearbyPharmaciesCount > 5 && (
            <motion.button
              whileHover={{ backgroundColor: 'rgba(16,185,129,0.1)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAllPharmacies(v => !v)}
              className="w-full mt-4 py-3.5 rounded-2xl border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] text-sm font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              {showAllPharmacies ? `↑ Show Less` : `↓ Show All ${nearbyPharmaciesCount} Pharmacies`}
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}
