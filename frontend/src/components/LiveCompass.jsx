import { useState, useEffect, useCallback } from 'react';

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

function CompassDial({ needleAngle, smoothHeading, size = 208 }) {
  const cx = size / 2;
  const r = size / 2;
  const labelR = r * 0.82;
  const tick1 = r * 0.72;
  const tick2 = r * 0.78;
  const tickMajor1 = r * 0.66;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full border-4 border-slate-600 bg-slate-800"
        style={{ boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6), 0 0 25px rgba(99,102,241,0.2)' }}
      />

      {/* Tick marks SVG — rotates with heading */}
      <svg
        className="absolute inset-0"
        width={size} height={size}
        style={{ transform: `rotate(${-(smoothHeading ?? 0)}deg)`, transition: 'transform 0.25s ease-out' }}
      >
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = i * 10;
          const rad = angle * Math.PI / 180;
          const isMajor = i % 9 === 0;
          const r1 = isMajor ? tickMajor1 : tick1;
          const x1 = cx + r1 * Math.sin(rad);
          const y1 = cx - r1 * Math.cos(rad);
          const x2 = cx + tick2 * Math.sin(rad);
          const y2 = cx - tick2 * Math.cos(rad);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isMajor ? '#6366f1' : '#334155'}
              strokeWidth={isMajor ? 2.5 : 1}
            />
          );
        })}
      </svg>

      {/* Cardinal labels — rotate with heading */}
      {[
        { l: 'N', angle: 0,   cls: 'text-red-400 font-black' },
        { l: 'E', angle: 90,  cls: 'text-slate-300 font-bold' },
        { l: 'S', angle: 180, cls: 'text-slate-300 font-bold' },
        { l: 'W', angle: 270, cls: 'text-slate-300 font-bold' },
      ].map(({ l, angle, cls }) => {
        const rad = (angle - (smoothHeading ?? 0)) * Math.PI / 180;
        const x = cx + labelR * Math.sin(rad);
        const y = cx - labelR * Math.cos(rad);
        const fontSize = size > 250 ? 'text-base' : 'text-xs';
        return (
          <span
            key={l}
            className={`absolute ${fontSize} ${cls} -translate-x-1/2 -translate-y-1/2 select-none`}
            style={{ left: x, top: y, transition: 'left 0.25s ease-out, top 0.25s ease-out' }}
          >
            {l}
          </span>
        );
      })}

      {/* Needle — rotates to point at destination */}
      <div
        className="absolute inset-0"
        style={{ transform: `rotate(${needleAngle}deg)`, transition: 'transform 0.3s ease-out' }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute">
          {/* Red tip */}
          <polygon
            points={`${cx},${cx * 0.18} ${cx + cx * 0.06},${cx} ${cx},${cx * 0.88} ${cx - cx * 0.06},${cx}`}
            fill="#ef4444" opacity="0.95"
          />
          {/* Grey tail */}
          <polygon
            points={`${cx},${size - cx * 0.18} ${cx + cx * 0.06},${cx} ${cx},${cx * 1.12} ${cx - cx * 0.06},${cx}`}
            fill="#475569" opacity="0.75"
          />
        </svg>
      </div>

      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-500 shadow-lg z-10" />
      </div>

      {/* Heading degrees */}
      {smoothHeading != null && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 px-2.5 py-0.5 rounded-full">
          <p className="text-[11px] font-black text-slate-300">{Math.round(smoothHeading)}°</p>
        </div>
      )}
    </div>
  );
}

export default function LiveCompass({ targetBearingDeg, destName, distanceKm }) {
  const [expanded, setExpanded] = useState(false);
  const [permitted, setPermitted] = useState(false);
  const [smoothHeading, setSmoothHeading] = useState(null);
  const [error, setError] = useState(null);

  const handleOrientation = useCallback((e) => {
    let h = e.webkitCompassHeading != null
      ? e.webkitCompassHeading
      : e.alpha != null ? (360 - e.alpha) : null;
    if (h == null) { setError('Compass sensor unavailable.'); return; }
    h = ((h % 360) + 360) % 360;
    setSmoothHeading(prev => {
      if (prev == null) return h;
      let diff = h - prev;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      return ((prev + diff * 0.2) + 360) % 360;
    });
  }, []);

  const start = useCallback(async () => {
    setError(null);
    const ok = await requestOrientationPermission();
    if (!ok) { setError('Permission denied. Enable Motion & Orientation in Settings.'); return; }
    setPermitted(true);
    window.addEventListener('deviceorientation', handleOrientation, true);
  }, [handleOrientation]);

  useEffect(() => {
    if (typeof DeviceOrientationEvent === 'undefined' ||
        typeof DeviceOrientationEvent.requestPermission !== 'function') {
      start();
    }
    return () => window.removeEventListener('deviceorientation', handleOrientation, true);
  }, [start, handleOrientation]);

  // Lock body scroll when expanded
  useEffect(() => {
    document.body.style.overflow = expanded ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [expanded]);

  const needleAngle = smoothHeading != null
    ? ((targetBearingDeg - smoothHeading) + 360) % 360
    : targetBearingDeg;

  const { label, arrow } = getArrowLabel(needleAngle);

  const distDisplay = parseFloat(distanceKm) < 1
    ? `${(parseFloat(distanceKm) * 1000).toFixed(0)} m`
    : `${parseFloat(distanceKm).toFixed(1)} km`;

  return (
    <>
      {/* ── Collapsed pill button ─────────────────────────────────────── */}
      <button
        onClick={() => setExpanded(true)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 rounded-2xl transition-all active:scale-[0.97] group"
      >
        {/* Mini live compass preview */}
        <div className="relative w-10 h-10 shrink-0">
          <div className="absolute inset-0 rounded-full bg-slate-800 border-2 border-slate-600" />
          <div
            className="absolute inset-0 flex items-center justify-center"
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
          <p className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors">
            🧭 Live Compass
          </p>
          <p className="text-[10px] text-slate-400 truncate">
            {smoothHeading != null ? `${arrow} ${label}` : 'Tap to navigate'}
            {' · '}{destName}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-sm font-black text-amber-400">{distDisplay}</p>
          <p className="text-[9px] text-slate-500 font-bold">tap to expand</p>
        </div>
      </button>

      {/* ── Fullscreen expanded modal ─────────────────────────────────── */}
      {expanded && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex flex-col">
          {/* Modal header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
            <div>
              <p className="font-black text-lg text-white">🧭 Live Compass</p>
              <p className="text-xs text-slate-400 truncate max-w-[220px]">Navigating to {destName}</p>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-black text-sm transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Compass + info */}
          <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 overflow-y-auto py-6">

            {/* Distance + target bearing */}
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-3xl font-black text-amber-400">{distDisplay}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Distance</p>
              </div>
              <div className="w-px bg-slate-700" />
              <div className="text-center">
                <p className="text-3xl font-black text-indigo-400">{Math.round(targetBearingDeg)}°</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Target Bearing</p>
              </div>
              {smoothHeading != null && (
                <>
                  <div className="w-px bg-slate-700" />
                  <div className="text-center">
                    <p className="text-3xl font-black text-emerald-400">{Math.round(smoothHeading)}°</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">You're Facing</p>
                  </div>
                </>
              )}
            </div>

            {/* Large compass dial */}
            <CompassDial
              needleAngle={needleAngle}
              smoothHeading={smoothHeading}
              size={Math.min(window.innerWidth - 48, 320)}
            />

            {/* Direction instruction */}
            <div className="text-center">
              <p className="text-6xl font-black text-white">{arrow}</p>
              <p className="text-xl font-black text-amber-400 mt-2">{label}</p>
              {smoothHeading == null && !error && (
                <p className="text-xs text-slate-500 mt-2 animate-pulse">
                  Move device in a figure-8 to calibrate...
                </p>
              )}
            </div>

            {/* iOS permission */}
            {!permitted && typeof DeviceOrientationEvent !== 'undefined' &&
              typeof DeviceOrientationEvent.requestPermission === 'function' && (
              <button
                onClick={start}
                className="w-full max-w-xs py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-colors active:scale-[0.97]"
              >
                Enable Compass (iOS)
              </button>
            )}

            {error && (
              <p className="text-sm text-red-400 font-semibold text-center px-4">{error}</p>
            )}

            {/* Tip */}
            <p className="text-[10px] text-slate-600 text-center max-w-xs">
              Red needle points toward your destination. Rotate your device until the needle points up.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
