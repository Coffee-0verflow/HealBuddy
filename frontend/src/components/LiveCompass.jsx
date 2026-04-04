import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

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

// ── Compass Rose (the original working dial) ──────────────────────────────────
function CompassRose({ smoothHeading, needleAngle, size = 208 }) {
  const half = size / 2;
  const ringR = half - 4;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-4 border-slate-600 bg-slate-800"
        style={{ boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), 0 0 20px rgba(99,102,241,0.15)' }} />

      {/* Cardinal labels — rotate with heading */}
      {[
        { label: 'N', angle: 0,   color: '#f87171' },
        { label: 'E', angle: 90,  color: '#cbd5e1' },
        { label: 'S', angle: 180, color: '#cbd5e1' },
        { label: 'W', angle: 270, color: '#cbd5e1' },
      ].map(({ label: l, angle, color }) => {
        const rad = (angle - (smoothHeading ?? 0)) * Math.PI / 180;
        const r = ringR * 0.82;
        const x = half + r * Math.sin(rad);
        const y = half - r * Math.cos(rad);
        return (
          <span key={l} className="absolute font-black select-none"
            style={{ left: x, top: y, transform: 'translate(-50%,-50%)',
              color, fontSize: size > 250 ? 15 : 12 }}>
            {l}
          </span>
        );
      })}

      {/* Tick marks — rotate with heading */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = i * 10;
        const rad = (angle - (smoothHeading ?? 0)) * Math.PI / 180;
        const isMajor = i % 9 === 0;
        const r1 = isMajor ? ringR * 0.70 : ringR * 0.75;
        const r2 = ringR * 0.82;
        const x1 = half + r1 * Math.sin(rad), y1 = half - r1 * Math.cos(rad);
        const x2 = half + r2 * Math.sin(rad), y2 = half - r2 * Math.cos(rad);
        return (
          <svg key={i} className="absolute inset-0 overflow-visible pointer-events-none"
            style={{ width: size, height: size }}>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isMajor ? '#6366f1' : '#334155'}
              strokeWidth={isMajor ? 2 : 1} />
          </svg>
        );
      })}

      {/* Needle — points to destination */}
      <div className="absolute inset-0 flex items-center justify-center"
        style={{ transform: `rotate(${needleAngle}deg)`, transition: 'transform 0.3s ease-out' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute">
          <polygon points={`${half},${size*0.10} ${half+size*0.05},${half} ${half},${half*0.88} ${half-size*0.05},${half}`}
            fill="#ef4444" opacity="0.95" />
          <polygon points={`${half},${size*0.90} ${half+size*0.05},${half} ${half},${half*1.12} ${half-size*0.05},${half}`}
            fill="#475569" opacity="0.7" />
        </svg>
      </div>

      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-600 shadow-lg z-10" />
      </div>

      {/* Heading degrees */}
      {smoothHeading != null && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/80 px-2 py-0.5 rounded-full">
          <p className="text-[10px] font-black text-slate-300">{Math.round(smoothHeading)}°</p>
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function LiveCompass({ targetBearingDeg, destName, distanceKm }) {
  const [expanded,      setExpanded]      = useState(false);
  const [permitted,     setPermitted]     = useState(false);
  const [smoothHeading, setSmoothHeading] = useState(null);
  const [error,         setError]         = useState(null);

  const handleOrientation = useCallback((e) => {
    // iOS: webkitCompassHeading is true-north magnetic
    // Android: 360 - alpha
    let h = e.webkitCompassHeading != null
      ? e.webkitCompassHeading
      : e.alpha != null ? (360 - e.alpha) : null;

    if (h == null) { setError('Compass sensor not available on this device.'); return; }

    h = ((h % 360) + 360) % 360;

    setSmoothHeading(prev => {
      if (prev == null) return h;
      let diff = h - prev;
      if (diff > 180)  diff -= 360;
      if (diff < -180) diff += 360;
      return ((prev + diff * 0.2) + 360) % 360;
    });
  }, []);

  const start = useCallback(async () => {
    setError(null);
    const ok = await requestOrientationPermission();
    if (!ok) { setError('Permission denied. Enable Motion & Orientation in iOS Settings → Safari.'); return; }
    setPermitted(true);
    window.addEventListener('deviceorientation', handleOrientation, true);
  }, [handleOrientation]);

  useEffect(() => {
    // Android / desktop — auto start (no permission prompt needed)
    if (typeof DeviceOrientationEvent === 'undefined' ||
        typeof DeviceOrientationEvent.requestPermission !== 'function') {
      start();
    }
    return () => window.removeEventListener('deviceorientation', handleOrientation, true);
  }, [start, handleOrientation]);

  // Scroll lock when expanded
  useEffect(() => {
    if (!expanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [expanded]);

  const needleAngle = smoothHeading != null
    ? ((targetBearingDeg - smoothHeading) + 360) % 360
    : targetBearingDeg;

  const { label, arrow } = getArrowLabel(needleAngle);

  const distDisplay = parseFloat(distanceKm) < 1
    ? `${(parseFloat(distanceKm) * 1000).toFixed(0)} m`
    : `${parseFloat(distanceKm).toFixed(1)} km`;

  const close = () => setExpanded(false);

  const isIOS = typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function';

  return (
    <>
      {/* ── Collapsed pill ── */}
      <button
        onClick={() => setExpanded(true)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-2xl transition-all active:scale-[0.97] group"
      >
        {/* Mini compass preview */}
        <div className="relative w-10 h-10 shrink-0">
          <div className="absolute inset-0 rounded-full bg-slate-800 border-2 border-slate-600" />
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `rotate(${needleAngle}deg)`, transition: 'transform 0.3s ease-out' }}>
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
            {smoothHeading != null ? `${arrow} ${label}` : 'Tap to open'} · {destName}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-sm font-black text-amber-400">{distDisplay}</p>
          <p className="text-[9px] text-slate-500 font-bold">tap to expand</p>
        </div>
      </button>

      {/* ── Fullscreen modal via portal ── */}
      {expanded && createPortal(
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999999,
          background: '#020617', display: 'flex', flexDirection: 'column',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderBottom: '1px solid #1e293b',
            flexShrink: 0, gap: 8,
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 900, fontSize: 16, color: 'white' }}>🧭 Live Compass</p>
              <p style={{ margin: 0, fontSize: 10, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                → {destName}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={close} style={{ padding: '8px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: 10, color: '#cbd5e1', fontWeight: 900, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                ↕ Shrink
              </button>
              <button onClick={close} style={{ padding: '8px 14px', background: '#dc2626', border: 'none', borderRadius: 10, color: 'white', fontWeight: 900, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                ✕ Close
              </button>
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 20px', gap: 20 }}>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { v: distDisplay,                                           l: 'Distance', c: '#fbbf24' },
                { v: `${Math.round(targetBearingDeg)}°`,                    l: 'Target',   c: '#818cf8' },
                { v: smoothHeading != null ? `${Math.round(smoothHeading)}°` : '—', l: 'Facing', c: '#34d399' },
              ].map(({ v, l, c }, i, a) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontWeight: 900, fontSize: 22, color: c }}>{v}</p>
                    <p style={{ margin: 0, fontSize: 9, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{l}</p>
                  </div>
                  {i < a.length - 1 && <div style={{ width: 1, height: 32, background: '#1e293b' }} />}
                </div>
              ))}
            </div>

            {/* Compass rose */}
            <CompassRose
              smoothHeading={smoothHeading}
              needleAngle={needleAngle}
              size={Math.min(window.innerWidth - 48, 300)}
            />

            {/* Direction */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 52, fontWeight: 900, color: 'white', lineHeight: 1 }}>{arrow}</p>
              <p style={{ margin: '6px 0 0', fontSize: 18, fontWeight: 900, color: '#fbbf24' }}>{label}</p>
              {smoothHeading == null && !error && (
                <p style={{ margin: '6px 0 0', fontSize: 11, color: '#475569' }}>
                  {isIOS && !permitted ? 'Tap "Enable Compass" below' : 'Move device in a figure-8 to calibrate...'}
                </p>
              )}
            </div>

            {/* iOS permission button */}
            {isIOS && !permitted && (
              <button onClick={start} style={{ width: '100%', maxWidth: 280, padding: '14px 0', background: '#4f46e5', border: 'none', borderRadius: 14, color: 'white', fontWeight: 900, fontSize: 15, cursor: 'pointer' }}>
                Enable Compass (iOS)
              </button>
            )}

            {error && (
              <p style={{ fontSize: 12, color: '#f87171', fontWeight: 600, textAlign: 'center', padding: '0 12px', margin: 0 }}>{error}</p>
            )}

            <p style={{ margin: 0, fontSize: 10, color: '#334155', textAlign: 'center', maxWidth: 260 }}>
              Red needle → destination · Rotate phone until needle points up ↑
            </p>

            {/* Bottom buttons */}
            <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 280, paddingBottom: 4 }}>
              <button onClick={close} style={{ flex: 1, padding: '13px 0', background: '#1e293b', border: '1px solid #334155', borderRadius: 14, color: '#cbd5e1', fontWeight: 900, fontSize: 14, cursor: 'pointer' }}>
                ↕ Shrink
              </button>
              <button onClick={close} style={{ flex: 1, padding: '13px 0', background: '#dc2626', border: 'none', borderRadius: 14, color: 'white', fontWeight: 900, fontSize: 14, cursor: 'pointer' }}>
                ✕ Close
              </button>
            </div>

          </div>
        </div>
      , document.body)}
    </>
  );
}
