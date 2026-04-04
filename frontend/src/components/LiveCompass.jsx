import { useState, useEffect, useCallback, useRef } from 'react';

async function requestOrientationPermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const result = await DeviceOrientationEvent.requestPermission();
      return result === 'granted';
    } catch { return false; }
  }
  return true;
}

function getArrowLabel(angleDiff) {
  const a = ((angleDiff % 360) + 360) % 360;
  if (a < 22.5 || a >= 337.5) return { label: 'Straight Ahead', arrow: '↑' };
  if (a < 67.5)  return { label: 'Slight Right',  arrow: '↗' };
  if (a < 112.5) return { label: 'Turn Right',     arrow: '→' };
  if (a < 157.5) return { label: 'Sharp Right',    arrow: '↘' };
  if (a < 202.5) return { label: 'Turn Around',    arrow: '↓' };
  if (a < 247.5) return { label: 'Sharp Left',     arrow: '↙' };
  if (a < 292.5) return { label: 'Turn Left',      arrow: '←' };
  return           { label: 'Slight Left',   arrow: '↖' };
}

// Smooth angle with wrap-around handling
function smoothAngle(prev, next, factor = 0.15) {
  if (prev == null) return next;
  let diff = next - prev;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return ((prev + diff * factor) + 360) % 360;
}

function CompassDial({ needleAngle, smoothHeading, size = 280 }) {
  const cx = size / 2;
  const labelR = cx * 0.80;
  const tick1  = cx * 0.70;
  const tick2  = cx * 0.77;
  const tickM1 = cx * 0.63;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full border-4 border-slate-600 bg-slate-800"
        style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.7), 0 0 30px rgba(99,102,241,0.25)' }}
      />

      {/* Rotating dial (ticks + cardinals) */}
      <div className="absolute inset-0"
        style={{ transform: `rotate(${-(smoothHeading ?? 0)}deg)`, transition: 'transform 0.2s ease-out' }}
      >
        <svg className="absolute inset-0" width={size} height={size}>
          {Array.from({ length: 72 }).map((_, i) => {
            const angle = i * 5;
            const rad = angle * Math.PI / 180;
            const major = i % 18 === 0;   // every 90°
            const mid   = i % 9 === 0;    // every 45°
            const r1 = major ? tickM1 : mid ? tick1 - cx * 0.04 : tick1;
            return (
              <line key={i}
                x1={cx + r1 * Math.sin(rad)} y1={cx - r1 * Math.cos(rad)}
                x2={cx + tick2 * Math.sin(rad)} y2={cx - tick2 * Math.cos(rad)}
                stroke={major ? '#6366f1' : mid ? '#64748b' : '#1e293b'}
                strokeWidth={major ? 3 : mid ? 1.5 : 1}
              />
            );
          })}
        </svg>

        {/* Cardinal labels */}
        {[
          { l: 'N', angle: 0,   color: '#f87171', fw: '900' },
          { l: 'NE', angle: 45,  color: '#94a3b8', fw: '700' },
          { l: 'E', angle: 90,  color: '#cbd5e1', fw: '900' },
          { l: 'SE', angle: 135, color: '#94a3b8', fw: '700' },
          { l: 'S', angle: 180, color: '#cbd5e1', fw: '900' },
          { l: 'SW', angle: 225, color: '#94a3b8', fw: '700' },
          { l: 'W', angle: 270, color: '#cbd5e1', fw: '900' },
          { l: 'NW', angle: 315, color: '#94a3b8', fw: '700' },
        ].map(({ l, angle, color, fw }) => {
          const rad = angle * Math.PI / 180;
          const r = l.length === 1 ? labelR : labelR * 0.92;
          const x = cx + r * Math.sin(rad);
          const y = cx - r * Math.cos(rad);
          const fs = l.length === 1 ? (size > 250 ? 14 : 11) : (size > 250 ? 10 : 8);
          return (
            <span key={l}
              className="absolute -translate-x-1/2 -translate-y-1/2 select-none"
              style={{ left: x, top: y, color, fontWeight: fw, fontSize: fs }}
            >{l}</span>
          );
        })}
      </div>

      {/* Fixed needle — always points to destination */}
      <div className="absolute inset-0"
        style={{ transform: `rotate(${needleAngle}deg)`, transition: 'transform 0.25s ease-out' }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute">
          {/* Red tip (destination direction) */}
          <polygon
            points={`${cx},${cx*0.12} ${cx+cx*0.07},${cx*0.55} ${cx},${cx*0.45} ${cx-cx*0.07},${cx*0.55}`}
            fill="#ef4444"
          />
          {/* White outline on tip */}
          <polygon
            points={`${cx},${cx*0.12} ${cx+cx*0.07},${cx*0.55} ${cx},${cx*0.45} ${cx-cx*0.07},${cx*0.55}`}
            fill="none" stroke="white" strokeWidth="1" opacity="0.4"
          />
          {/* Grey tail */}
          <polygon
            points={`${cx},${size-cx*0.12} ${cx+cx*0.07},${cx*1.45} ${cx},${cx*1.55} ${cx-cx*0.07},${cx*1.45}`}
            fill="#475569"
          />
        </svg>
      </div>

      {/* Center cap */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-slate-500 shadow-xl z-10" />
      </div>

      {/* North indicator at top */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-500" />

      {/* Heading */}
      {smoothHeading != null && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-700">
          <p className="text-xs font-black text-slate-200">{Math.round(smoothHeading)}°</p>
        </div>
      )}
    </div>
  );
}

export default function LiveCompass({ targetBearingDeg, destName, distanceKm }) {
  const [expanded, setExpanded]       = useState(false);
  const [permitted, setPermitted]     = useState(false);
  const [smoothHeading, setSmoothHeading] = useState(null);
  const [rawHeading, setRawHeading]   = useState(null);
  const [error, setError]             = useState(null);
  const [calibrating, setCalibrating] = useState(false);
  const [offset, setOffset]           = useState(0);   // manual calibration offset
  const [calSamples, setCalSamples]   = useState([]);
  const sensorType = useRef('unknown'); // 'ios' | 'android' | 'absolute'

  const handleOrientation = useCallback((e) => {
    let h = null;

    // iOS: webkitCompassHeading is already true-north magnetic heading
    if (e.webkitCompassHeading != null && e.webkitCompassHeading >= 0) {
      h = e.webkitCompassHeading;
      sensorType.current = 'ios';
    }
    // Absolute orientation (Chrome on Android with absolute=true)
    else if (e.absolute === true && e.alpha != null) {
      // alpha=0 means device points to geographic north when absolute
      h = (360 - e.alpha + 360) % 360;
      sensorType.current = 'absolute';
    }
    // Relative orientation fallback (Android non-absolute)
    else if (e.alpha != null) {
      h = (360 - e.alpha + 360) % 360;
      sensorType.current = 'android';
    }

    if (h == null) { setError('Compass sensor not available on this device.'); return; }

    h = ((h % 360) + 360) % 360;
    setRawHeading(h);
    setSmoothHeading(prev => smoothAngle(prev, h, 0.15));

    if (calibrating) {
      setCalSamples(prev => [...prev.slice(-29), h]);
    }
  }, [calibrating]);

  // Try absolute orientation first on Android for better accuracy
  const start = useCallback(async () => {
    setError(null);
    const ok = await requestOrientationPermission();
    if (!ok) { setError('Permission denied. Enable Motion & Orientation in Settings.'); return; }
    setPermitted(true);

    // Try deviceorientationabsolute first (more accurate on Android)
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    }
    window.addEventListener('deviceorientation', handleOrientation, true);
  }, [handleOrientation]);

  useEffect(() => {
    if (typeof DeviceOrientationEvent === 'undefined' ||
        typeof DeviceOrientationEvent.requestPermission !== 'function') {
      start();
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
    };
  }, [start, handleOrientation]);

  useEffect(() => {
    document.body.style.overflow = expanded ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [expanded]);

  // Calibration: average last 30 samples, compute offset vs known north
  const startCalibration = () => {
    setCalSamples([]);
    setCalibrating(true);
  };

  const finishCalibration = () => {
    setCalibrating(false);
    // Average the samples (circular mean)
    if (calSamples.length < 5) return;
    const sinSum = calSamples.reduce((s, h) => s + Math.sin(h * Math.PI / 180), 0);
    const cosSum = calSamples.reduce((s, h) => s + Math.cos(h * Math.PI / 180), 0);
    const avg = (Math.atan2(sinSum, cosSum) * 180 / Math.PI + 360) % 360;
    // User points phone at known North (0°), so offset = avg - 0
    setOffset(avg);
    setSmoothHeading(null);
  };

  const resetCalibration = () => { setOffset(0); setSmoothHeading(null); };

  // Apply offset to heading
  const correctedHeading = smoothHeading != null
    ? ((smoothHeading - offset) + 360) % 360
    : null;

  const needleAngle = correctedHeading != null
    ? ((targetBearingDeg - correctedHeading) + 360) % 360
    : targetBearingDeg;

  const { label, arrow } = getArrowLabel(needleAngle);

  const distDisplay = parseFloat(distanceKm) < 1
    ? `${(parseFloat(distanceKm) * 1000).toFixed(0)} m`
    : `${parseFloat(distanceKm).toFixed(1)} km`;

  const close = () => setExpanded(false);

  return (
    <>
      {/* ── Collapsed pill ── */}
      <button
        onClick={() => setExpanded(true)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 rounded-2xl transition-all active:scale-[0.97] group"
      >
        <div className="relative w-10 h-10 shrink-0">
          <div className="absolute inset-0 rounded-full bg-slate-800 border-2 border-slate-600" />
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `rotate(${needleAngle}deg)`, transition: 'transform 0.3s ease-out' }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40">
              <polygon points="20,4 22,20 20,17 18,20" fill="#ef4444" />
              <polygon points="20,36 22,20 20,23 18,20" fill="#475569" />
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white border border-slate-500 z-10" />
          </div>
        </div>

        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors">🧭 Live Compass</p>
          <p className="text-[10px] text-slate-400 truncate">
            {correctedHeading != null ? `${arrow} ${label}` : 'Tap to navigate'} · {destName}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-sm font-black text-amber-400">{distDisplay}</p>
          <p className="text-[9px] text-slate-500 font-bold">tap to expand</p>
        </div>
      </button>

      {/* ── Fullscreen modal ── */}
      {expanded && (
        <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
            <div>
              <p className="font-black text-lg text-white">🧭 Live Compass</p>
              <p className="text-xs text-slate-400 truncate max-w-[180px]">→ {destName}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={close}
                className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 hover:text-white px-3 py-2 rounded-xl font-black text-xs transition-all active:scale-[0.95]"
              >↕ Shrink</button>
              <button onClick={close}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-xl font-black text-xs transition-all active:scale-[0.95]"
              >✕ Close</button>
            </div>
          </div>

          {/* Calibration banner */}
          {calibrating && (
            <div className="bg-indigo-600 px-5 py-3 flex items-center justify-between shrink-0">
              <div>
                <p className="text-white font-black text-sm">📐 Calibrating...</p>
                <p className="text-indigo-200 text-xs">Point phone toward North, hold steady ({calSamples.length}/30)</p>
              </div>
              <button onClick={finishCalibration}
                className="bg-white text-indigo-700 font-black text-xs px-3 py-1.5 rounded-lg active:scale-[0.97]"
              >Done</button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 overflow-y-auto py-4">

            {/* Stats */}
            <div className="flex gap-5 flex-wrap justify-center">
              <div className="text-center">
                <p className="text-2xl font-black text-amber-400">{distDisplay}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Distance</p>
              </div>
              <div className="w-px bg-slate-700 self-stretch" />
              <div className="text-center">
                <p className="text-2xl font-black text-indigo-400">{Math.round(targetBearingDeg)}°</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Target</p>
              </div>
              {correctedHeading != null && (
                <>
                  <div className="w-px bg-slate-700 self-stretch" />
                  <div className="text-center">
                    <p className="text-2xl font-black text-emerald-400">{Math.round(correctedHeading)}°</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Facing</p>
                  </div>
                </>
              )}
              {offset !== 0 && (
                <>
                  <div className="w-px bg-slate-700 self-stretch" />
                  <div className="text-center">
                    <p className="text-2xl font-black text-yellow-400">{Math.round(offset)}°</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Offset</p>
                  </div>
                </>
              )}
            </div>

            {/* Dial */}
            <CompassDial
              needleAngle={needleAngle}
              smoothHeading={correctedHeading}
              size={Math.min(window.innerWidth - 48, 300)}
            />

            {/* Direction */}
            <div className="text-center">
              <p className="text-5xl font-black text-white">{arrow}</p>
              <p className="text-lg font-black text-amber-400 mt-1">{label}</p>
              {correctedHeading == null && !error && (
                <p className="text-xs text-slate-500 mt-1 animate-pulse">Move device in a figure-8 to calibrate...</p>
              )}
              {sensorType.current === 'android' && correctedHeading != null && offset === 0 && (
                <p className="text-[10px] text-amber-600 mt-1">⚠️ Relative sensor — calibrate for accuracy</p>
              )}
            </div>

            {/* iOS permission */}
            {!permitted && typeof DeviceOrientationEvent !== 'undefined' &&
              typeof DeviceOrientationEvent.requestPermission === 'function' && (
              <button onClick={start}
                className="w-full max-w-xs py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-colors active:scale-[0.97]"
              >Enable Compass (iOS)</button>
            )}

            {error && <p className="text-sm text-red-400 font-semibold text-center px-4">{error}</p>}

            {/* Calibration controls */}
            <div className="w-full max-w-xs space-y-2">
              {!calibrating ? (
                <button onClick={startCalibration}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-300 font-black text-sm rounded-xl transition-all active:scale-[0.97]"
                >
                  📐 Calibrate Compass
                </button>
              ) : (
                <p className="text-center text-xs text-indigo-300 font-semibold">
                  Point your phone toward North and tap Done
                </p>
              )}
              {offset !== 0 && (
                <button onClick={resetCalibration}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-400 font-bold text-xs rounded-xl transition-all active:scale-[0.97]"
                >
                  ↺ Reset Calibration
                </button>
              )}
            </div>

            <p className="text-[10px] text-slate-700 text-center max-w-xs">
              Red needle → destination. Rotate device until needle points up (↑).
            </p>

            {/* Bottom close buttons */}
            <div className="flex gap-3 w-full max-w-xs pb-2">
              <button onClick={close}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white font-black text-sm rounded-2xl transition-all active:scale-[0.97]"
              >↕ Shrink</button>
              <button onClick={close}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-2xl transition-all active:scale-[0.97]"
              >✕ Close</button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
