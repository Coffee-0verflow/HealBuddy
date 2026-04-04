import { useState, useEffect, useCallback } from 'react';

// Request iOS 13+ permission for DeviceOrientationEvent
async function requestOrientationPermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const result = await DeviceOrientationEvent.requestPermission();
      return result === 'granted';
    } catch {
      return false;
    }
  }
  return true; // Android / desktop — no permission needed
}

function getArrowLabel(angleDiff) {
  const a = ((angleDiff % 360) + 360) % 360;
  if (a < 22.5 || a >= 337.5) return { label: 'Straight Ahead', arrow: '↑' };
  if (a < 67.5)  return { label: 'Slight Right',   arrow: '↗' };
  if (a < 112.5) return { label: 'Turn Right',      arrow: '→' };
  if (a < 157.5) return { label: 'Sharp Right',     arrow: '↘' };
  if (a < 202.5) return { label: 'Turn Around',     arrow: '↓' };
  if (a < 247.5) return { label: 'Sharp Left',      arrow: '↙' };
  if (a < 292.5) return { label: 'Turn Left',       arrow: '←' };
  return           { label: 'Slight Left',    arrow: '↖' };
}

export default function LiveCompass({ targetBearingDeg, destName, distanceKm }) {
  const [heading, setHeading] = useState(null);       // device compass heading (0–360)
  const [permitted, setPermitted] = useState(false);
  const [error, setError] = useState(null);
  const [smoothHeading, setSmoothHeading] = useState(null);

  const handleOrientation = useCallback((e) => {
    // webkitCompassHeading = iOS, 360 - alpha = Android
    let h = e.webkitCompassHeading != null
      ? e.webkitCompassHeading
      : e.alpha != null ? (360 - e.alpha) : null;

    if (h == null) { setError('Compass sensor not available on this device.'); return; }

    h = ((h % 360) + 360) % 360;

    // Smooth with exponential moving average to avoid jitter
    setSmoothHeading(prev => {
      if (prev == null) return h;
      // Handle wrap-around (e.g. 359 → 1)
      let diff = h - prev;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      return ((prev + diff * 0.2) + 360) % 360;
    });
    setHeading(h);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    const ok = await requestOrientationPermission();
    if (!ok) { setError('Permission denied. Enable motion & orientation in Settings.'); return; }
    setPermitted(true);
    window.addEventListener('deviceorientation', handleOrientation, true);
  }, [handleOrientation]);

  useEffect(() => {
    // Auto-start on Android (no permission needed)
    if (typeof DeviceOrientationEvent === 'undefined' ||
        typeof DeviceOrientationEvent.requestPermission !== 'function') {
      start();
    }
    return () => window.removeEventListener('deviceorientation', handleOrientation, true);
  }, [start, handleOrientation]);

  // Angle the needle must rotate to point at destination
  const needleAngle = smoothHeading != null
    ? ((targetBearingDeg - smoothHeading) + 360) % 360
    : targetBearingDeg;

  const { label, arrow } = getArrowLabel(needleAngle);

  const distDisplay = parseFloat(distanceKm) < 1
    ? `${(parseFloat(distanceKm) * 1000).toFixed(0)} m`
    : `${parseFloat(distanceKm).toFixed(1)} km`;

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800">
        <div>
          <p className="font-black text-sm text-white">🧭 Live Compass</p>
          <p className="text-[10px] text-slate-400 font-semibold truncate max-w-[180px]">→ {destName}</p>
        </div>
        <div className="text-right">
          <p className="font-black text-lg text-amber-400">{distDisplay}</p>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">distance</p>
        </div>
      </div>

      {/* Compass dial */}
      <div className="flex flex-col items-center py-6 px-4 gap-4">
        <div className="relative w-52 h-52">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-600 bg-slate-800 shadow-[inset_0_0_30px_rgba(0,0,0,0.5),0_0_20px_rgba(99,102,241,0.15)]" />

          {/* Cardinal labels */}
          {[
            { label: 'N', angle: 0,   color: 'text-red-400' },
            { label: 'E', angle: 90,  color: 'text-slate-300' },
            { label: 'S', angle: 180, color: 'text-slate-300' },
            { label: 'W', angle: 270, color: 'text-slate-300' },
          ].map(({ label: l, angle, color }) => {
            const rad = (angle - (smoothHeading ?? 0)) * Math.PI / 180;
            const r = 88;
            const x = 104 + r * Math.sin(rad);
            const y = 104 - r * Math.cos(rad);
            return (
              <span
                key={l}
                className={`absolute text-xs font-black ${color} -translate-x-1/2 -translate-y-1/2`}
                style={{ left: x, top: y }}
              >
                {l}
              </span>
            );
          })}

          {/* Tick marks */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = i * 10;
            const rad = (angle - (smoothHeading ?? 0)) * Math.PI / 180;
            const isMajor = i % 9 === 0;
            const r1 = isMajor ? 72 : 76;
            const r2 = 82;
            const x1 = 104 + r1 * Math.sin(rad);
            const y1 = 104 - r1 * Math.cos(rad);
            const x2 = 104 + r2 * Math.sin(rad);
            const y2 = 104 - r2 * Math.cos(rad);
            return (
              <svg key={i} className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={isMajor ? '#6366f1' : '#334155'}
                  strokeWidth={isMajor ? 2 : 1}
                />
              </svg>
            );
          })}

          {/* Destination needle — always points to target */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `rotate(${needleAngle}deg)`, transition: 'transform 0.3s ease-out' }}
          >
            <svg width="208" height="208" viewBox="0 0 208 208" className="absolute">
              {/* Red tip pointing to destination */}
              <polygon points="104,20 110,104 104,96 98,104" fill="#ef4444" opacity="0.95" />
              {/* Grey tail */}
              <polygon points="104,188 110,104 104,112 98,104" fill="#475569" opacity="0.7" />
            </svg>
          </div>

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-600 shadow-lg z-10" />
          </div>

          {/* Heading degree display */}
          {smoothHeading != null && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/80 px-2 py-0.5 rounded-full">
              <p className="text-[10px] font-black text-slate-300">{Math.round(smoothHeading)}°</p>
            </div>
          )}
        </div>

        {/* Direction instruction */}
        <div className="text-center">
          <p className="text-4xl font-black text-white">{arrow}</p>
          <p className="text-sm font-black text-amber-400 mt-1">{label}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Target: {Math.round(targetBearingDeg)}° · {smoothHeading != null ? `You: ${Math.round(smoothHeading)}°` : 'Calibrating...'}
          </p>
        </div>

        {/* iOS permission button */}
        {!permitted && typeof DeviceOrientationEvent !== 'undefined' &&
          typeof DeviceOrientationEvent.requestPermission === 'function' && (
          <button
            onClick={start}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black rounded-xl transition-colors active:scale-[0.97]"
          >
            Enable Compass (iOS)
          </button>
        )}

        {/* Error */}
        {error && (
          <p className="text-xs text-red-400 font-semibold text-center px-2">{error}</p>
        )}

        {/* Calibration hint */}
        {smoothHeading == null && !error && (
          <p className="text-[10px] text-slate-500 text-center animate-pulse">
            Move your device in a figure-8 to calibrate...
          </p>
        )}
      </div>
    </div>
  );
}
