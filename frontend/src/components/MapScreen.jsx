import React, { useState, useEffect, useMemo } from 'react';
import { doctors } from '../data/doctors';
import { pharmacies } from '../data/pharmacies';
import { getCurrentLocation, getDistanceInKm } from '../logic/distance';
import { offlineRoute, getBearing } from '../logic/offlineRouter';
import LiveCompass from './LiveCompass';

import MapSection from './MapSection';
import HospitalList from './HospitalList';

// State mapping by ID range
const STATE_MAP = {
  'Jammu, Kashmir & Ladakh': [1, 2, 3, 4, 5, 6],
  'Delhi & NCR': [7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  'Punjab, Chandigarh & Himachal': [17, 18, 19, 20, 21],
  'Uttarakhand': [22, 23, 24, 25],
  'Uttar Pradesh': [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
  'Bihar & Jharkhand': [51, 52, 53, 54, 55, 56],
  'Rajasthan': [57, 58, 59, 60, 61, 62, 63, 64, 65, 66],
  'Madhya Pradesh & Chhattisgarh': [67, 68, 69, 70, 71, 72, 73, 74, 130, 131, 132, 133, 134],
  'Gujarat': [75, 76, 77, 78, 79, 80, 81],
  'Maharashtra': [82, 83, 84, 85, 86, 87, 88, 89, 90, 91],
  'Goa': [92, 93],
  'Karnataka': [94, 95, 96, 97, 98, 99, 100],
  'Tamil Nadu': [101, 102, 103, 104, 105, 106],
  'Kerala': [107, 108, 109, 110],
  'Telangana & Andhra Pradesh': [111, 112, 113, 114, 115, 116],
  'West Bengal': [117, 118, 119, 120],
  'Odisha': [121, 122],
  'Assam & Northeast': [123, 124, 125],
  'Haryana': [126, 127, 128],
  'Puducherry': [129],
};

const ALL_STATES = ['All States', ...Object.keys(STATE_MAP), 'Other'];

function getStateForId(id) {
  for (const [state, ids] of Object.entries(STATE_MAP)) {
    if (ids.includes(id)) return state;
  }
  return 'Other';
}

const doctorsWithState = doctors.map(d => ({ ...d, state: getStateForId(d.id) }));

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

export default function MapScreen({ onBack, requiredDoctorType, showPharmacies = false, showHospitals = true }) {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyDocs, setNearbyDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [routeCoords, setRouteCoords] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeSteps, setRouteSteps] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedFacility, setSelectedFacility] = useState(null);

  const FALLBACK_LOCATION = { lat: 28.6139, lng: 77.2090 };

  const filteredDoctors = useMemo(() => {
    if (selectedState === 'All States') return doctorsWithState;
    return doctorsWithState.filter(d => d.state === selectedState);
  }, [selectedState]);

  const nearbyPharmacies = useMemo(() => {
    if (!userLocation || !showPharmacies) return [];
    return pharmacies
      .map(p => ({ ...p, distance: getDistanceInKm(userLocation.lat, userLocation.lng, p.lat, p.lng) }))
      .sort((a, b) => a.distance - b.distance);
  }, [userLocation, showPharmacies]);

  const processDoctors = (userLoc) => {
    setUserLocation(userLoc);
    setRouteCoords(null);
    setRouteInfo(null);
    setSelectedFacility(null);

    let scoredDocs = filteredDoctors.map(doc => {
      const distance = getDistanceInKm(userLoc.lat, userLoc.lng, doc.lat, doc.lng);
      const condMatch = getConditionMatch(requiredDoctorType, doc.conditions);
      let score = distance;
      if (condMatch.matched) score -= (condMatch.score * 3);
      if (doc.trustBadge) score -= 2;
      score -= (doc.rating || 3) * 0.5;
      return { ...doc, distance, score, condMatch };
    });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState]);

  const initLocation = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const loc = await getCurrentLocation();
      processDoctors(loc);
    } catch (err) {
      console.warn('GPS failed', err);
      setErrorMsg('Could not fetch GPS. Tap map to set your location!');
      processDoctors(FALLBACK_LOCATION);
    }
  };

  useEffect(() => {
    initLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requiredDoctorType]);

  const handleNavigate = async (doc) => {
    if (!userLocation) return;
    setRouteLoading(true);
    setSelectedFacility(doc);
    setRouteSteps(null);

    // Offline: use pure JS router instantly, no network needed
    if (!navigator.onLine) {
      const result = offlineRoute(userLocation.lat, userLocation.lng, doc.lat, doc.lng, doc.name);
      setRouteCoords(result.coords);
      setRouteInfo({ name: doc.name, distance: result.distance, duration: result.duration, offline: true, compassDir: result.compassDir, bearingDeg: result.bearingDeg });
      setRouteSteps(result.steps);
      setRouteLoading(false);
      return;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${doc.lng},${doc.lat}?overview=full&geometries=geojson`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      const data = await res.json();
      if (data.code === 'Ok' && data.routes?.length > 0) {
        const route = data.routes[0];
        const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
        setRouteCoords(coords);
        // Compute bearing for compass even on online routes
        const bearingDeg = Math.round(getBearing(userLocation.lat, userLocation.lng, doc.lat, doc.lng));
        setRouteInfo({ name: doc.name, distance: (route.distance / 1000).toFixed(1), duration: String(Math.ceil(route.duration / 60)), offline: false, bearingDeg });
        setRouteSteps(null);
      } else throw new Error('No route');
    } catch {
      // Network failed mid-session — fall back to offline router
      const result = offlineRoute(userLocation.lat, userLocation.lng, doc.lat, doc.lng, doc.name);
      setRouteCoords(result.coords);
      setRouteInfo({ name: doc.name, distance: result.distance, duration: result.duration, offline: true, compassDir: result.compassDir, bearingDeg: result.bearingDeg });
      setRouteSteps(result.steps);
    } finally {
      setRouteLoading(false);
    }
  };

  const clearRoute = () => { setRouteCoords(null); setRouteInfo(null); setRouteSteps(null); };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-100 dark:from-indigo-900/20 via-slate-50 dark:via-slate-950 to-slate-50 dark:to-slate-950 pointer-events-none" />
        <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin shadow-[0_0_30px_rgba(99,102,241,0.5)]"></div>
        <p className="mt-8 text-indigo-600 dark:text-indigo-400 font-black tracking-[0.2em] uppercase text-sm animate-pulse">Initializing GPS Array...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 h-[100dvh] font-sans text-slate-800 dark:text-slate-200 selection:bg-indigo-500/30 flex flex-col overflow-hidden">

      {/* Global Header (Optional slim bar) */}
      <div className="shrink-0 z-[5000] w-full bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-indigo-500/20 py-3 px-4 md:px-8 flex items-center justify-between shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-sm transition-all bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/30"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">{showHospitals && showPharmacies ? 'All Facilities' : showHospitals ? 'Hospitals' : 'Pharmacies'}</span>
            {requiredDoctorType && <span className="text-[10px] text-indigo-400 font-bold">{requiredDoctorType}</span>}
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700/50">
            <svg className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer appearance-none pr-4"
            >
              {ALL_STATES.filter(s => s !== 'Other').map(s => (
                <option key={s} value={s} className="bg-white dark:bg-slate-900">{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex flex-col md:flex-row flex-1 relative max-w-[1920px] mx-auto w-full overflow-hidden">

        {/* Left Side: Map */}
        <div className="w-full md:w-1/2 lg:w-[45%] h-[50vh] md:h-full flex flex-col p-4 lg:p-6 border-b md:border-b-0 md:border-r border-slate-200 dark:border-indigo-500/10 bg-slate-50 dark:bg-slate-950 relative overflow-hidden shrink-0">

          {/* Subtle background glow behind map */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="mb-4 text-center z-10 relative">
            <p className="text-indigo-600 dark:text-indigo-300/80 font-bold text-sm tracking-wide bg-indigo-50 dark:bg-indigo-950/30 px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-500/20 inline-block shadow-sm">
              📍 Click on map to drop pin for your location
            </p>
          </div>

          {/* Interactive Fixed Square Map Header/Status overlays */}
          <div className="w-full flex-1 relative group min-h-[300px]">

            <MapSection
              userLocation={userLocation}
              selectedState={selectedState}
              processDoctors={processDoctors}
              routeCoords={routeCoords}
              showHospitals={showHospitals}
              filteredDoctors={filteredDoctors}
              showPharmacies={showPharmacies}
              nearbyPharmacies={nearbyPharmacies}
              onLocate={initLocation}
              handleNavigate={handleNavigate}
              handlePharmacyNavigate={handleNavigate} // use same navigate logic
              selectedFacility={selectedFacility}
            />

            {/* Overlays (Status & Routing) */}
            {errorMsg && !routeInfo && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-500/20 backdrop-blur-md text-amber-300 text-xs font-bold px-4 py-2 rounded-xl border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] z-[400] whitespace-nowrap">
                ⚠️ {errorMsg}
              </div>
            )}

            {routeLoading && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-indigo-600 border border-indigo-400 text-white px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.6)] z-[500] text-sm font-black flex items-center gap-3 animate-pulse">
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                Calculating Route...
              </div>
            )}

            {routeInfo && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-emerald-500/50 text-slate-800 dark:text-white px-5 py-3 rounded-2xl shadow-lg dark:shadow-[0_0_30px_rgba(16,185,129,0.3)] z-[500] flex flex-col items-center gap-2 w-[90%] max-w-sm transition-all duration-500">
                <div className="flex items-center justify-center gap-5 w-full">
                  <div className="text-center flex-1 overflow-hidden">
                    <p className="font-black text-sm truncate bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">{routeInfo.name}</p>
                    {routeInfo.offline && (
                      <p className="text-[9px] text-amber-500 font-bold uppercase tracking-wider">
                        {routeInfo.compassDir ? `🧭 Head ${routeInfo.compassDir}` : '⚡ Offline directions'}
                      </p>
                    )}
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700/50 shrink-0"></div>
                  <div className="flex gap-4 shrink-0">
                    <div className="text-center"><p className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-0.5">Dist</p><p className="font-black text-sm">{routeInfo.distance} km</p></div>
                    <div className="text-center"><p className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-0.5">ETA</p><p className="font-black text-sm text-amber-600 dark:text-amber-400">~{routeInfo.duration}m</p></div>
                  </div>
                  <button onClick={clearRoute} className="absolute -top-2 -right-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/20 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 border border-slate-300 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-500/50 w-7 h-7 rounded-full text-xs font-black transition-colors flex items-center justify-center shadow-md">✕</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Scrollable List */}
        <div className="w-full md:w-1/2 lg:w-[55%] h-[50vh] md:h-full p-4 md:p-8 lg:px-12 bg-slate-50 dark:bg-slate-950 pb-24 overflow-y-auto shrink-0 md:shrink">

          {/* Live Compass — shown whenever a route is active (online or offline) */}
          {routeInfo && !routeSteps && (
            <div className="mb-6">
              <LiveCompass
                targetBearingDeg={routeInfo.bearingDeg ?? 0}
                destName={routeInfo.name}
                distanceKm={routeInfo.distance}
              />
            </div>
          )}

          {/* Offline step-by-step directions + Live Compass */}
          {routeSteps && routeInfo?.offline && (
            <div className="mb-6 space-y-3">
              {/* Live Compass */}
              <LiveCompass
                targetBearingDeg={routeInfo.bearingDeg}
                destName={routeInfo.name}
                distanceKm={routeInfo.distance}
              />

              {/* Step-by-step text directions */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-amber-100 dark:bg-amber-900/40 border-b border-amber-200 dark:border-amber-700/50">
                  <span className="text-lg">🧭</span>
                  <div className="flex-1">
                    <p className="font-black text-sm text-amber-900 dark:text-amber-200">Step-by-Step Directions</p>
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">Works without internet or downloaded maps</p>
                  </div>
                  <div className="text-center shrink-0">
                    <p className="font-black text-lg text-amber-800 dark:text-amber-300">{routeInfo.distance} km</p>
                    <p className="text-[9px] text-amber-600 dark:text-amber-500 font-bold">~{routeInfo.duration} min</p>
                  </div>
                </div>
                <div className="px-4 py-3 space-y-2">
                  {routeSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center shrink-0">
                        <span className="text-base">{step.icon}</span>
                        {i < routeSteps.length - 1 && <div className="w-px h-4 bg-amber-200 dark:bg-amber-700 mt-1" />}
                      </div>
                      <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 pt-0.5 leading-relaxed">{step.text}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-amber-200 dark:border-amber-700/50">
                  <p className="text-[10px] text-amber-600 dark:text-amber-500 font-medium">⚠️ Directions are approximate. Follow road signs and use your best judgment.</p>
                </div>
              </div>
            </div>
          )}

          <HospitalList
            nearbyDocs={nearbyDocs}
            showHospitals={showHospitals}
            requiredDoctorType={requiredDoctorType}
            routeInfo={routeInfo}
            handleNavigate={handleNavigate}
            showPharmacies={showPharmacies}
            nearbyPharmacies={nearbyPharmacies}
            handlePharmacyNavigate={handleNavigate} // use same logic
            selectedFacility={selectedFacility}
            onFacilitySelect={(item) => setSelectedFacility(item)}
          />
        </div>
      </div>

    </div>
  );
}
