import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { doctors } from '../data/doctors';
import { pharmacies } from '../data/pharmacies';
import { getCurrentLocation, getDistanceInKm } from '../logic/distance';

// State mapping by ID range
const STATE_MAP = {
  'Jammu, Kashmir & Ladakh': [1,2,3,4,5,6],
  'Delhi & NCR': [7,8,9,10,11,12,13,14,15,16],
  'Punjab, Chandigarh & Himachal': [17,18,19,20,21],
  'Uttarakhand': [22,23,24,25],
  'Uttar Pradesh': [26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],
  'Bihar & Jharkhand': [51,52,53,54],
  'Rajasthan': [55,56,57,58,59,60],
  'Madhya Pradesh & Chhattisgarh': [61,62,63,64,65,66],
  'Gujarat': [67,68,69,70,71,72],
  'Maharashtra': [73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129],
};

// Assign state to each doctor
const STATE_CENTERS = {
  'Jammu, Kashmir & Ladakh': [33.7, 76.5],
  'Delhi & NCR': [28.61, 77.21],
  'Punjab, Chandigarh & Himachal': [30.9, 76.5],
  'Uttarakhand': [30.1, 78.3],
  'Uttar Pradesh': [26.8, 80.9],
  'Bihar & Jharkhand': [24.5, 85.3],
  'Rajasthan': [26.9, 75.8],
  'Madhya Pradesh & Chhattisgarh': [23.2, 77.4],
  'Gujarat': [22.3, 72.6],
  'Maharashtra': [19.1, 75.7],
};

function getStateForId(id) {
  for (const [state, ids] of Object.entries(STATE_MAP)) {
    if (ids.includes(id)) return state;
  }
  // fallback: derive from lat/lng
  return 'Other';
}

const doctorsWithState = doctors.map(d => ({ ...d, state: getStateForId(d.id) }));
const ALL_STATES = ['All States', ...Object.keys(STATE_MAP), 'Other'];

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function StateZoomer({ selectedState }) {
  const map = useMap();
  useEffect(() => {
    if (selectedState === 'All States') {
      map.setView([20.5937, 78.9629], 5, { animate: true });
    } else if (STATE_CENTERS[selectedState]) {
      map.setView(STATE_CENTERS[selectedState], 7, { animate: true });
    }
  }, [selectedState, map]);
  return null;
}

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom() || 13);
  }, [center, map]);
  return null;
}

function LocationPicker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
}

function RouteFitter({ routeCoords }) {
  const map = useMap();
  useEffect(() => {
    if (routeCoords && routeCoords.length > 1) {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [routeCoords, map]);
  return null;
}

// Match user symptom to hospital conditions
function getConditionMatch(requiredDoctorType, docConditions) {
  if (!requiredDoctorType || !docConditions || docConditions.length === 0) return { matched: false, score: 0 };
  const lower = requiredDoctorType.toLowerCase();
  const keywords = lower.split(/[\s\/,]+/).filter(w => w.length > 2);
  let matchCount = 0;
  for (const cond of docConditions) {
    for (const kw of keywords) {
      if (cond.includes(kw) || kw.includes(cond)) matchCount++;
    }
  }
  return { matched: matchCount > 0, score: matchCount };
}

// Star display
function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`text-sm ${i < full ? 'text-amber-400' : (i === full && half) ? 'text-amber-300' : 'text-slate-200 dark:text-slate-600'}`}>★</span>
      ))}
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">{rating}</span>
    </div>
  );
}

export default function MapScreen({ onBack, requiredDoctorType, showPharmacies = false, showHospitals = true }) {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyDocs, setNearbyDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [mapExpanded, setMapExpanded] = useState(false);
  const [routeCoords, setRouteCoords] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [selectedState, setSelectedState] = useState('All States');

  const FALLBACK_LOCATION = { lat: 28.6139, lng: 77.2090 };

  const filteredDoctors = useMemo(() => {
    if (selectedState === 'All States') return doctorsWithState;
    return doctorsWithState.filter(d => d.state === selectedState);
  }, [selectedState]);

  const [showAllPharmacies, setShowAllPharmacies] = useState(false);

  const nearbyPharmacies = useMemo(() => {
    if (!userLocation || !showPharmacies) return [];
    return pharmacies
      .map(p => ({ ...p, distance: getDistanceInKm(userLocation.lat, userLocation.lng, p.lat, p.lng) }))
      .sort((a, b) => a.distance - b.distance);
  }, [userLocation, showPharmacies]);

  const visiblePharmacies = showAllPharmacies ? nearbyPharmacies : nearbyPharmacies.slice(0, 5);

  const processDoctors = (userLoc) => {
    setUserLocation(userLoc);
    setRouteCoords(null);
    setRouteInfo(null);
    
    let scoredDocs = filteredDoctors.map(doc => {
      const distance = getDistanceInKm(userLoc.lat, userLoc.lng, doc.lat, doc.lng);
      const condMatch = getConditionMatch(requiredDoctorType, doc.conditions);
      
      // Score: lower is better. Distance is primary, then condition match bonus, then rating bonus, trust bonus
      let score = distance;
      if (condMatch.matched) score -= (condMatch.score * 3); // large bonus for condition match
      if (doc.trustBadge) score -= 2;
      score -= (doc.rating || 3) * 0.5; // rating bonus
      
      return { ...doc, distance, score, condMatch };
    });

    // Sort by score (lower = better)
    scoredDocs.sort((a, b) => a.score - b.score);
    scoredDocs = scoredDocs.slice(0, 5);
    
    if (scoredDocs[0]) scoredDocs[0].rankBadge = "🏆 Best Match";
    if (scoredDocs[1]) scoredDocs[1].rankBadge = "⭐ Great Option";
    if (scoredDocs[2]) scoredDocs[2].rankBadge = "💰 Budget Friendly";
    if (scoredDocs[3]) scoredDocs[3].rankBadge = "📍 Nearby";
    if (scoredDocs[4]) scoredDocs[4].rankBadge = "📍 Nearby";
    
    setNearbyDocs(scoredDocs);
    setLoading(false);
  };

  useEffect(() => {
    if (userLocation) processDoctors(userLocation);
  }, [selectedState]);

  useEffect(() => {
    async function initLocation() {
      try {
        const loc = await getCurrentLocation();
        processDoctors(loc);
      } catch (err) {
        console.warn('GPS failed', err);
        setErrorMsg('Could not fetch GPS. Tap map to set your location!');
        processDoctors(FALLBACK_LOCATION);
      }
    }
    initLocation();
  }, [requiredDoctorType]);

  const handleNavigate = async (doc) => {
    if (!userLocation) return;
    setRouteLoading(true);
    setMapExpanded(true);
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${doc.lng},${doc.lat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.code === 'Ok' && data.routes?.length > 0) {
        const route = data.routes[0];
        const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
        setRouteCoords(coords);
        setRouteInfo({ name: doc.name, distance: (route.distance / 1000).toFixed(1), duration: Math.ceil(route.duration / 60) });
      } else throw new Error('No route');
    } catch {
      setRouteCoords([[userLocation.lat, userLocation.lng], [doc.lat, doc.lng]]);
      setRouteInfo({ name: doc.name, distance: doc.distance.toFixed(1), duration: Math.ceil(doc.distance / 40 * 60) });
    } finally {
      setRouteLoading(false);
    }
  };

  const handlePharmacyNavigate = async (pharmacy) => {
    if (!userLocation) return;
    setRouteLoading(true);
    setMapExpanded(true);
    const distKm = getDistanceInKm(userLocation.lat, userLocation.lng, pharmacy.lat, pharmacy.lng);
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${pharmacy.lng},${pharmacy.lat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.code === 'Ok' && data.routes?.length > 0) {
        const route = data.routes[0];
        const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
        setRouteCoords(coords);
        setRouteInfo({ name: pharmacy.name, distance: (route.distance / 1000).toFixed(1), duration: Math.ceil(route.duration / 60) });
      } else throw new Error('No route');
    } catch {
      setRouteCoords([[userLocation.lat, userLocation.lng], [pharmacy.lat, pharmacy.lng]]);
      setRouteInfo({ name: pharmacy.name, distance: distKm.toFixed(1), duration: Math.ceil(distKm / 30 * 60) });
    } finally {
      setRouteLoading(false);
    }
  };

  const clearRoute = () => { setRouteCoords(null); setRouteInfo(null); };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative overflow-hidden pb-[70px]">
      {/* Header */}
      <div className="absolute top-0 w-full z-[1000] px-3 pt-3 pointer-events-none">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-xl rounded-2xl pointer-events-auto overflow-hidden">
          {/* Top row */}
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 font-semibold text-sm transition-colors shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Back
            </button>
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-none">{showHospitals ? 'Nearby Hospitals' : 'Nearby Pharmacies'}</p>
                {requiredDoctorType && (
                  <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold mt-0.5 truncate">{requiredDoctorType}</p>
                )}
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 shrink-0">
              {filteredDoctors.length} facilities
            </span>
          </div>
          {/* State filter row */}
          <div className="px-4 pb-3 flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 shrink-0"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="flex-1 text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500/30"
            >
              {ALL_STATES.filter(s => s !== 'Other').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex-1 flex justify-center items-center bg-slate-50 dark:bg-slate-950">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase text-sm">Locating you...</p>
          </div>
        </div>
      )}

      {/* Emergency Footer */}
      <div className="absolute bottom-0 w-full z-[2000] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 p-2.5 flex gap-2 justify-between shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.1)]">
        <a href="tel:112" className="flex-1 bg-red-600 text-white rounded-xl py-2.5 flex items-center justify-center gap-2 font-black text-sm shadow-md active:scale-[0.97] transition-transform">🚨 112</a>
        <a href="tel:108" className="flex-1 bg-orange-500 text-white rounded-xl py-2.5 flex items-center justify-center gap-2 font-black text-sm shadow-md active:scale-[0.97] transition-transform">🚑 108</a>
      </div>

      {!loading && (
        <div className="flex-1 flex flex-col relative h-full">
          {/* Map */}
          <div className={`w-full relative z-0 shadow-inner shrink-0 transition-all duration-300 ${mapExpanded ? 'h-[calc(100vh-140px)]' : 'h-[35vh] sm:h-[40vh]'}`} style={{ marginTop: '110px' }}>
            <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <StateZoomer selectedState={selectedState} />
              {selectedState === 'All States' && <MapUpdater center={[userLocation.lat, userLocation.lng]} />}
              <LocationPicker onSelect={processDoctors} />
              {routeCoords && <RouteFitter routeCoords={routeCoords} />}
              {routeCoords && <Polyline positions={routeCoords} pathOptions={{ color: '#4f46e5', weight: 5, opacity: 0.85, dashArray: '12, 8' }} />}

              <Marker position={[userLocation.lat, userLocation.lng]} zIndexOffset={1000} icon={L.divIcon({
                html: `<div style="background:#dc2626;color:#fff;border:3px solid #fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(220,38,38,0.6);">📍</div>`,
                className: '', iconSize: [32, 32], iconAnchor: [16, 16]
              })}>
                <Popup><span className="font-bold" style={{color:'#dc2626'}}>📍 You are here</span><br/><span className="text-xs">Tap anywhere to relocate</span></Popup>
              </Marker>

              {showHospitals && filteredDoctors.map(doc => (
                <Marker key={doc.id} position={[doc.lat, doc.lng]}>
                  <Popup>
                    <div style={{ minWidth: '140px' }}>
                      <span className="font-bold text-indigo-700">{doc.name}</span><br/>
                      <span className="text-xs">{getDistanceInKm(userLocation.lat, userLocation.lng, doc.lat, doc.lng).toFixed(1)} km • ⭐ {doc.rating}</span><br/>
                      <span className="text-xs text-slate-500">{doc.specialty}</span><br/>
                      {doc.phone && <a href={`tel:${doc.phone.replace(/ /g,'')}`} style={{color:'#4f46e5',fontWeight:'bold',fontSize:'11px'}}>📞 Call</a>}
                    </div>
                  </Popup>
                </Marker>
              ))}
              {/* Pharmacy markers — sorted nearest first */}
              {showPharmacies && nearbyPharmacies.map((p, i) => (
                <Marker key={p.id} position={[p.lat, p.lng]} icon={L.divIcon({
                  html: `<div style="background:#059669;color:#fff;border:2px solid #fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 6px rgba(5,150,105,0.5);cursor:pointer">💊</div>`,
                  className: '', iconSize: [28, 28], iconAnchor: [14, 14]
                })}>
                  <Popup>
                    <div style={{ minWidth: '150px' }}>
                      <span style={{fontWeight:700,color:'#059669',fontSize:13}}>💊 {p.name}</span><br/>
                      <span style={{fontSize:11}}>{p.distance.toFixed(1)} km • ⭐ {p.rating}</span><br/>
                      <span style={{fontSize:11,color:'#64748b'}}>{p.open24x7 ? '🟢 Open 24×7' : '⏰ Check Hours'}</span><br/>
                      {i === 0 && <span style={{fontSize:10,fontWeight:700,color:'#059669',background:'#d1fae5',padding:'1px 6px',borderRadius:99,display:'inline-block',marginTop:3}}>Closest</span>}<br/>
                      {p.phone && <button onClick={() => handlePharmacyNavigate(p)} style={{marginTop:6,width:'100%',padding:'5px 0',background:'#059669',color:'#fff',border:'none',borderRadius:6,fontSize:11,fontWeight:700,cursor:'pointer'}}>🧭 Navigate</button>}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            
            {/* Route Info */}
            {routeInfo && (
              <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-2.5 rounded-2xl shadow-2xl z-[500] flex items-center gap-3 text-xs font-bold border border-indigo-500 max-w-[95vw]">
                <div className="text-center shrink-0">
                  <p className="text-[8px] uppercase tracking-widest opacity-70">To</p>
                  <p className="font-black text-sm truncate max-w-[120px]">{routeInfo.name}</p>
                </div>
                <div className="w-px h-7 bg-white/30"></div>
                <div className="text-center"><p className="text-[8px] uppercase tracking-widest opacity-70">Dist</p><p className="font-black">{routeInfo.distance} km</p></div>
                <div className="w-px h-7 bg-white/30"></div>
                <div className="text-center"><p className="text-[8px] uppercase tracking-widest opacity-70">ETA</p><p className="font-black">~{routeInfo.duration}m</p></div>
                <button onClick={clearRoute} className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg text-xs font-black transition-colors">✕</button>
              </div>
            )}
            {routeLoading && (
              <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl shadow-2xl z-[500] text-xs font-black flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Routing...
              </div>
            )}
            {errorMsg && !routeInfo && (
              <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-amber-100/95 backdrop-blur text-amber-900 text-[10px] font-bold px-4 py-2 rounded-full border border-amber-300 shadow-lg z-[400] whitespace-nowrap max-w-[90vw] truncate">
                ⚠️ {errorMsg}
              </div>
            )}
            
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-[400]">
              <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 shadow-2xl rounded-full text-[10px] font-black tracking-wider uppercase border border-slate-700/50 whitespace-nowrap">
                🎯 Tap to set location
              </div>
              <button onClick={() => setMapExpanded(!mapExpanded)} className="bg-white/90 backdrop-blur-md text-slate-800 px-3 py-2 shadow-2xl rounded-full text-[10px] font-black border border-slate-300 whitespace-nowrap active:scale-95 transition-transform">
                {mapExpanded ? '↕ Shrink' : '↕ Expand'}
              </button>
            </div>
          </div>

          {/* Cards Panel */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-950 overflow-y-auto px-3 sm:px-5 pt-5 pb-6 -mt-3 relative z-10 rounded-t-3xl border-t border-slate-200/50 dark:border-slate-700/50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
            <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4"></div>

            {showHospitals && (
              <>
                <h3 className="font-black text-lg text-slate-800 dark:text-slate-100 mb-4 ml-1">Top 5 Hospitals for You</h3>
                {/* Quick Comparison Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-5 overflow-hidden">
                  <div className="grid grid-cols-[1fr_60px_55px_60px] text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-4 py-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                    <span>Hospital</span><span className="text-center">Dist</span><span className="text-center">Rating</span><span className="text-center">Match</span>
                  </div>
                  {nearbyDocs.map((doc, i) => (
                    <div key={doc.id} className={`grid grid-cols-[1fr_60px_55px_60px] items-center px-4 py-2.5 ${i < nearbyDocs.length - 1 ? 'border-b border-slate-50 dark:border-slate-700/50' : ''} ${i === 0 ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}>
                      <div>
                        <p className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate pr-2">{doc.name}</p>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500">{doc.cost}</p>
                      </div>
                      <p className="text-xs font-black text-center text-slate-700 dark:text-slate-300">{doc.distance.toFixed(0)}km</p>
                      <p className="text-xs font-bold text-center text-amber-500">⭐{doc.rating}</p>
                      <div className="flex justify-center">
                        {doc.condMatch?.matched
                          ? <span className="bg-green-100 text-green-700 text-[8px] font-black px-1.5 py-0.5 rounded-full">YES</span>
                          : <span className="bg-slate-100 text-slate-400 text-[8px] font-black px-1.5 py-0.5 rounded-full">—</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>
                {/* Detailed Cards */}
                <div className="space-y-4">
                  {nearbyDocs.map((doc, index) => (
                <div key={doc.id} className={`bg-white dark:bg-slate-800 p-4 rounded-2xl border shadow-md relative overflow-hidden transition-colors ${routeInfo?.name === doc.name ? 'border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-900/50' : 'border-slate-200 dark:border-slate-700'}`}>
                  
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-1.5 ${
                        index === 0 ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}>
                        {doc.rankBadge}
                      </span>
                      <h4 className="font-black text-slate-900 dark:text-slate-100 text-base leading-tight pr-2">{doc.name}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mt-0.5">{doc.specialty}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {doc.trustBadge && (
                        <span className="bg-green-100 text-green-700 text-[9px] font-black px-2 py-0.5 rounded-full border border-green-200">✓ Verified</span>
                      )}
                      {doc.condMatch?.matched && (
                        <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded-full border border-blue-200">Treats this</span>
                      )}
                    </div>
                  </div>

                  <StarRating rating={doc.rating || 3.5} />

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-2.5 border border-slate-100 dark:border-slate-600">
                      <p className="text-[8px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Distance</p>
                      <p className="font-black text-slate-800 dark:text-slate-100 text-base">{doc.distance.toFixed(1)} <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">km</span></p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-2.5 border border-slate-100 dark:border-slate-600">
                      <p className="text-[8px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Est. Cost</p>
                      <p className="font-black text-slate-800 dark:text-slate-100 text-base">{doc.cost}</p>
                    </div>
                  </div>

                  {/* Condition Tags */}
                  {doc.conditions && doc.conditions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {doc.conditions.slice(0, 5).map(c => (
                        <span key={c} className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          requiredDoctorType && requiredDoctorType.toLowerCase().includes(c) 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-slate-50 text-slate-400 border border-slate-100'
                        }`}>
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleNavigate(doc)}
                        className={`flex-1 py-2 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 ${
                          routeInfo?.name === doc.name 
                            ? 'bg-green-600 text-white' 
                            : 'bg-indigo-600 text-white active:scale-[0.97]'
                        }`}
                      >
                        {routeInfo?.name === doc.name ? '✓ Routed' : '🧭 Navigate'}
                      </button>
                      {doc.phone && (
                        <a href={`tel:${doc.phone.replace(/ /g, '')}`} className="flex-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform">
                          📞 Call
                        </a>
                      )}
                    </div>
                    
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">Lang:</span>
                      {doc.languages.map(lang => (
                        <span key={lang} className="bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded text-[9px] font-bold">{lang}</span>
                      ))}
                    </div>
                  </div>
                </div>
                  ))}
                </div>
              </>
            )}

            {/* Pharmacy Cards */}
            {showPharmacies && nearbyPharmacies.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-black">💊</div>
                  <h3 className="font-black text-lg text-slate-800 dark:text-slate-100">Nearby Pharmacies</h3>
                  <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full ml-1">{nearbyPharmacies.length} found</span>
                </div>

                {/* Quick comparison table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-5 overflow-hidden">
                  <div className="grid grid-cols-[1fr_60px_55px_60px] text-[9px] font-black uppercase tracking-widest text-slate-400 px-4 py-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                    <span>Pharmacy</span><span className="text-center">Dist</span><span className="text-center">Rating</span><span className="text-center">Open</span>
                  </div>
                  {visiblePharmacies.map((p, i) => (
                    <div key={p.id} className={`grid grid-cols-[1fr_60px_55px_60px] items-center px-4 py-2.5 ${i < visiblePharmacies.length - 1 ? 'border-b border-slate-50 dark:border-slate-700/50' : ''} ${i === 0 ? 'bg-emerald-50/50 dark:bg-emerald-900/20' : ''}`}>
                      <div>
                        <p className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate pr-2">{p.name}</p>
                        <p className="text-[9px] text-slate-400">{p.state}</p>
                      </div>
                      <p className="text-xs font-black text-center text-slate-700 dark:text-slate-300">{p.distance.toFixed(0)}km</p>
                      <p className="text-xs font-bold text-center text-amber-500">⭐{p.rating}</p>
                      <div className="flex justify-center">
                        {p.open24x7
                          ? <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[8px] font-black px-1.5 py-0.5 rounded-full">24×7</span>
                          : <span className="bg-slate-100 dark:bg-slate-700 text-slate-400 text-[8px] font-black px-1.5 py-0.5 rounded-full">⏰</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detailed cards */}
                <div className="space-y-4">
                  {visiblePharmacies.map((p, index) => (
                    <div key={p.id} className={`bg-white dark:bg-slate-800 p-4 rounded-2xl border shadow-md relative overflow-hidden transition-colors ${
                      routeInfo?.name === p.name
                        ? 'border-emerald-400 dark:border-emerald-500 ring-2 ring-emerald-100 dark:ring-emerald-900/50'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-1.5 ${
                            index === 0 ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                          }`}>
                            {index === 0 ? '⭐ Closest Pharmacy' : index === 1 ? '💊 Great Option' : '📍 Nearby'}
                          </span>
                          <h4 className="font-black text-slate-900 dark:text-slate-100 text-base leading-tight pr-2">{p.name}</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mt-0.5">Pharmacy</p>
                        </div>
                        <span className={`shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full border ${
                          p.open24x7
                            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600'
                        }`}>
                          {p.open24x7 ? '🟢 24×7 Open' : '⏰ Check Hours'}
                        </span>
                      </div>

                      <StarRating rating={p.rating || 4.0} />

                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-2.5 border border-slate-100 dark:border-slate-600">
                          <p className="text-[8px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Distance</p>
                          <p className="font-black text-slate-800 dark:text-slate-100 text-base">{p.distance.toFixed(1)} <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">km</span></p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-2.5 border border-slate-100 dark:border-slate-600">
                          <p className="text-[8px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Status</p>
                          <p className={`font-black text-base ${p.open24x7 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                            {p.open24x7 ? 'Open' : 'Verify'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePharmacyNavigate(p)}
                            className={`flex-1 py-2 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 ${
                              routeInfo?.name === p.name
                                ? 'bg-green-600 text-white'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.97]'
                            }`}
                          >
                            {routeInfo?.name === p.name ? '✓ Routed' : '🧭 Navigate'}
                          </button>
                          {p.phone && (
                            <a href={`tel:${p.phone.replace(/ /g,'')}`}
                              className="flex-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform">
                              📞 Call
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show All / Show Less toggle */}
                {nearbyPharmacies.length > 5 && (
                  <button
                    onClick={() => setShowAllPharmacies(v => !v)}
                    className="w-full mt-4 py-3 rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 text-sm font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {showAllPharmacies
                      ? `↑ Show Less`
                      : `↓ Show All ${nearbyPharmacies.length} Pharmacies`
                    }
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
