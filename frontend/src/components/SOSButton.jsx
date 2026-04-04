import { useState } from 'react';

const STATES = { idle: 'idle', loading: 'loading', ready: 'ready', error: 'error' };

function getErrorInfo(err) {
  if (err?.code === 1) return {
    title: 'Location permission denied.',
    hint: 'Tap the lock/info icon in your browser address bar → allow Location, then retry.',
  };
  if (err?.code === 2) return {
    title: 'Location signal unavailable.',
    hint: 'Move to an open area, enable Wi-Fi or mobile data to help GPS lock, then retry.',
  };
  if (err?.code === 3) return {
    title: 'Location timed out.',
    hint: 'GPS is taking too long. Try moving outdoors or enabling Wi-Fi, then retry.',
  };
  if (err?.message === 'UNSUPPORTED') return {
    title: 'Geolocation not supported.',
    hint: 'Your browser does not support location. Enter coordinates manually below.',
  };
  return {
    title: 'Could not get location.',
    hint: 'Check location permissions in your browser settings and retry.',
  };
}

function buildMessage(lat, lng) {
  const link = `https://maps.google.com/?q=${lat},${lng}`;
  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  return {
    text: `🚨 I need help! My current location:\n${link}\n\nSent via HealBuddy at ${time}`,
    link,
    lat: parseFloat(lat).toFixed(5),
    lng: parseFloat(lng).toFixed(5),
  };
}

// Two-attempt location fetch: high accuracy → network fallback
function fetchLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ message: 'UNSUPPORTED' });
      return;
    }
    const opts = (highAccuracy, timeout) => ({ enableHighAccuracy: highAccuracy, timeout, maximumAge: 0 });
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        // First attempt failed — retry with network/wifi location
        navigator.geolocation.getCurrentPosition(
          pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          err => reject(err),
          opts(false, 10000)
        );
      },
      opts(true, 8000)
    );
  });
}

export default function SOSButton({ compact = false }) {
  const [state, setState] = useState(STATES.idle);
  const [msg, setMsg] = useState(null);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [errInfo, setErrInfo] = useState(null);
  const [showManual, setShowManual] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  const shareBuilt = async (built) => {
    setMsg(built);
    setState(STATES.ready);
    setOpen(true);
    if (navigator.share) {
      try {
        await navigator.share({ title: '🚨 Emergency — I need help', text: built.text, url: built.link });
      } catch (e) { /* AbortError = user cancelled, ignore */ }
    }
  };

  const fetchAndShare = async () => {
    setState(STATES.loading);
    setOpen(false);
    setErrInfo(null);
    setShowManual(false);
    try {
      const { lat, lng } = await fetchLocation();
      await shareBuilt(buildMessage(lat, lng));
    } catch (err) {
      setState(STATES.error);
      setErrInfo(getErrorInfo(err));
    }
  };

  const handleManualSubmit = async () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng)) return;
    await shareBuilt(buildMessage(lat, lng));
    setShowManual(false);
  };

  const copyToClipboard = async () => {
    if (!msg) return;
    try {
      await navigator.clipboard.writeText(msg.text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = msg.text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setState(STATES.idle); setMsg(null); setOpen(false);
    setCopied(false); setErrInfo(null); setShowManual(false);
    setManualLat(''); setManualLng('');
  };

  // ── Compact mode (used in MapScreen footer) ──────────────────────────────
  if (compact) {
    return (
      <button
        onClick={fetchAndShare}
        disabled={state === STATES.loading}
        className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black px-3 py-2 rounded-xl shadow-md active:scale-[0.97] transition-all disabled:opacity-70"
      >
        {state === STATES.loading
          ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : '📡'}
        SOS
      </button>
    );
  }

  // ── Full mode ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      <button
        onClick={fetchAndShare}
        disabled={state === STATES.loading}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-base shadow-lg active:scale-[0.97] transition-all disabled:opacity-70 bg-red-600 hover:bg-red-700 text-white border-2 border-red-500"
      >
        {state === STATES.loading ? (
          <>
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Fetching your location...
          </>
        ) : (
          <><span className="text-xl">📡</span> Share My Location (SOS)</>
        )}
      </button>

      {/* Error state */}
      {state === STATES.error && errInfo && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-red-500 text-lg shrink-0">⚠️</span>
            <div className="flex-1">
              <p className="text-xs font-bold text-red-800 dark:text-red-300">{errInfo.title}</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{errInfo.hint}</p>
            </div>
            <button onClick={fetchAndShare} className="shrink-0 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-lg">
              Retry
            </button>
          </div>
          {/* Manual coordinate entry fallback */}
          <button
            onClick={() => setShowManual(v => !v)}
            className="text-[10px] text-red-500 dark:text-red-400 font-bold underline"
          >
            {showManual ? 'Hide' : 'Enter coordinates manually instead'}
          </button>
          {showManual && (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Latitude"
                value={manualLat}
                onChange={e => setManualLat(e.target.value)}
                className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
              />
              <input
                type="number"
                placeholder="Longitude"
                value={manualLng}
                onChange={e => setManualLng(e.target.value)}
                className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
              />
              <button
                onClick={handleManualSubmit}
                className="bg-red-600 text-white text-[10px] font-black px-2 py-1.5 rounded-lg"
              >
                Share
              </button>
            </div>
          )}
        </div>
      )}

      {/* Share panel */}
      {state === STATES.ready && open && msg && (
        <div className="mt-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden">
          {/* Location confirmed */}
          <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800/50 px-4 py-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xs font-black text-green-800 dark:text-green-300">📍 Location ready to share</p>
            <span className="ml-auto text-[10px] text-green-600 dark:text-green-400 font-bold">{msg.lat}, {msg.lng}</span>
          </div>

          {/* Message preview */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono leading-relaxed whitespace-pre-line">{msg.text}</p>
          </div>

          {/* Share options */}
          <div className="p-3 grid grid-cols-2 gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(msg.text)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl transition-colors active:scale-[0.97]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <a
              href={`sms:?body=${encodeURIComponent(msg.text)}`}
              className="flex items-center justify-center gap-2 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors active:scale-[0.97]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              SMS
            </a>
            <button
              onClick={copyToClipboard}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-colors active:scale-[0.97] ${
                copied ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {copied ? '✓ Copied!' : '📋 Copy Message'}
            </button>
            <a
              href={msg.link}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors active:scale-[0.97]"
            >
              🗺️ Open Maps
            </a>
          </div>

          <button onClick={reset} className="w-full py-2 text-[10px] text-slate-400 dark:text-slate-500 font-bold hover:text-slate-600 dark:hover:text-slate-300 transition-colors border-t border-slate-100 dark:border-slate-700">
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
