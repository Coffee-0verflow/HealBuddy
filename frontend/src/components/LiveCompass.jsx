import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// ─── Permission ───────────────────────────────────────────────────────────────
async function requestPermission() {
  if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
    try { return (await DeviceOrientationEvent.requestPermission()) === 'granted'; }
    catch { return false; }
  }
  return true;
}

// ─── Tilt-compensated heading from raw sensor values ─────────────────────────
// Uses full rotation matrix so heading is correct even when device is tilted.
// Works for both iOS (webkitCompassHeading) and Android (alpha/beta/gamma).
function computeHeading(e) {
  // iOS — already true-north magnetic, no math needed
  if (e.webkitCompassHeading != null && e.webkitCompassHeading >= 0) {
    return { heading: e.webkitCompassHeading, accuracy: e.webkitCompassAccuracy ?? 0, source: 'ios' };
  }

  // Android — use alpha/beta/gamma with tilt compensation
  if (e.alpha == null) return null;

  const toRad = d => d * Math.PI / 180;
  const alpha = toRad(e.alpha);   // rotation around Z (yaw)
  const beta  = toRad(e.beta);    // rotation around X (pitch)
  const gamma = toRad(e.gamma);   // rotation around Y (roll)

  // Rotation matrix components (ZXY order as per W3C spec)
  const cA = Math.cos(alpha), sA = Math.sin(alpha);
  const cB = Math.cos(beta),  sB = Math.sin(beta);
  const cG = Math.cos(gamma), sG = Math.sin(gamma);

  // Gravity vector in device frame
  const gx = -cA * sG - sA * sB * cG;
  const gy = -sA * sG + cA * sB * cG;

  // Heading from gravity-compensated rotation
  let heading = Math.atan2(gx, gy) * 180 / Math.PI;
  if (heading < 0) heading += 360;

  // For absolute events, alpha=0 is geographic north — no extra offset needed
  // For relative events, alpha is arbitrary — user must calibrate
  const source = e.absolute ? 'android-abs' : 'android-rel';
  return { heading, accuracy: 0, source };
}

// ─── Low-pass filter with dead-zone ──────────────────────────────────────────
// Only moves if change > threshold. Smooths with alpha factor.
// Handles 0/360 wrap-around correctly.
function lowPass(prev, next, alpha = 0.08, threshold = 1.0) {
  if (prev == null) return next;
  let diff = next - prev;
  if (diff > 180)  diff -= 360;
  if (diff < -180) diff += 360;
  if (Math.abs(diff) < threshold) return prev; // dead-zone — ignore tiny noise
  return ((prev + diff * alpha) + 360) % 360;
}

// ─── Direction label ──────────────────────────────────────────────────────────
function getDirection(a) {
  a = ((a % 360) + 360) % 360;
  if (a < 22.5 || a >= 337.5) return { label: 'Straight Ahead', arrow: '↑' };
  if (a < 67.5)  return { label: 'Slight Right',  arrow: '↗' };
  if (a < 112.5) return { label: 'Turn Right',     arrow: '→' };
  if (a < 157.5) return { label: 'Sharp Right',    arrow: '↘' };
  if (a < 202.5) return { label: 'Turn Around',    arrow: '↓' };
  if (a < 247.5) return { label: 'Sharp Left',     arrow: '↙' };
  if (a < 292.5) return { label: 'Turn Left',      arrow: '←' };
  return           { label: 'Slight Left',   arrow: '↖' };
}

// ─── Compass Dial (pure SVG, no DOM spans for labels — avoids layout thrash) ──
function CompassDial({ needleAngle, dialAngle, size }) {
  const cx = size / 2;
  const R  = cx - 4;

  // Pre-compute tick positions
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const deg = i * 5;
    const rad = deg * Math.PI / 180;
    const major = deg % 90 === 0, mid = deg % 45 === 0;
    const r1 = major ? R * 0.62 : mid ? R * 0.70 : R * 0.74;
    const r2 = R * 0.80;
    return {
      x1: cx + r1 * Math.sin(rad), y1: cx - r1 * Math.cos(rad),
      x2: cx + r2 * Math.sin(rad), y2: cx - r2 * Math.cos(rad),
      stroke: major ? '#6366f1' : mid ? '#475569' : '#1e293b',
      sw: major ? 3 : mid ? 1.5 : 0.8,
    };
  });

  const cardinals = [
    { l: 'N', deg: 0,   fill: '#f87171', fs: R * 0.14 },
    { l: 'E', deg: 90,  fill: '#94a3b8', fs: R * 0.11 },
    { l: 'S', deg: 180, fill: '#94a3b8', fs: R * 0.11 },
    { l: 'W', deg: 270, fill: '#94a3b8', fs: R * 0.11 },
  ];
  const intercardinals = [
    { l: 'NE', deg: 45 }, { l: 'SE', deg: 135 },
    { l: 'SW', deg: 225 }, { l: 'NW', deg: 315 },
  ];

  const labelR = R * 0.88;

  return (
    <svg
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ flexShrink: 0, display: 'block' }}
    >
      {/* Background circle */}
      <circle cx={cx} cy={cx} r={R} fill="#0f172a" stroke="#334155" strokeWidth="3" />
      <circle cx={cx} cy={cx} r={R * 0.95} fill="none" stroke="#1e293b" strokeWidth="1" />

      {/* Rotating dial group */}
      <g transform={`rotate(${dialAngle}, ${cx}, ${cx})`}
         style={{ transition: 'transform 0.25s ease-out' }}>
        {/* Ticks */}
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={t.stroke} strokeWidth={t.sw} strokeLinecap="round" />
        ))}
        {/* Cardinal labels */}
        {cardinals.map(({ l, deg, fill, fs }) => {
          const rad = deg * Math.PI / 180;
          return (
            <text key={l}
              x={cx + labelR * Math.sin(rad)}
              y={cx - labelR * Math.cos(rad)}
              textAnchor="middle" dominantBaseline="central"
              fill={fill} fontSize={fs} fontWeight="900"
              style={{ userSelect: 'none' }}
            >{l}</text>
          );
        })}
        {/* Intercardinal labels */}
        {intercardinals.map(({ l, deg }) => {
          const rad = deg * Math.PI / 180;
          return (
            <text key={l}
              x={cx + labelR * 0.91 * Math.sin(rad)}
              y={cx - labelR * 0.91 * Math.cos(rad)}
              textAnchor="middle" dominantBaseline="central"
              fill="#475569" fontSize={R * 0.075} fontWeight="700"
              style={{ userSelect: 'none' }}
            >{l}</text>
          );
        })}
      </g>

      {/* Fixed needle — rotates to point at destination */}
      <g transform={`rotate(${needleAngle}, ${cx}, ${cx})`}
         style={{ transition: 'transform 0.25s ease-out' }}>
        {/* Red tip */}
        <polygon
          points={`${cx},${cx - R*0.55} ${cx + R*0.07},${cx - R*0.05} ${cx},${cx + R*0.05} ${cx - R*0.07},${cx - R*0.05}`}
          fill="#ef4444"
        />
        {/* Grey tail */}
        <polygon
          points={`${cx},${cx + R*0.55} ${cx + R*0.07},${cx + R*0.05} ${cx},${cx - R*0.05} ${cx - R*0.07},${cx + R*0.05}`}
          fill="#475569"
        />
      </g>

      {/* Center cap */}
      <circle cx={cx} cy={cx} r={R * 0.06} fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />

      {/* Fixed N marker at top of ring */}
      <circle cx={cx} cy={cx - R + 6} r={4} fill="#ef4444" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LiveCompass({ targetBearingDeg, destName, distanceKm }) {
  const [expanded,       setExpanded]       = useState(false);
  const [permitted,      setPermitted]      = useState(false);
  const [needsPermission,setNeedsPermission]= useState(false);
  const [error,          setError]          = useState(null);
  const [accuracy,       setAccuracy]       = useState(null);
  const [source,         setSource]         = useState('');
  const [calibrating,    setCalibrating]    = useState(false);
  const [calCount,       setCalCount]       = useState(0);
  const [offset,         setOffset]         = useState(0);

  // Display state — updated via RAF, not on every sensor event
  const [displayHeading, setDisplayHeading] = useState(null);

  // Refs — all sensor math happens here, no stale closures
  const smoothRef    = useRef(null);
  const offsetRef    = useRef(0);
  const calRef       = useRef(false);
  const calSampRef   = useRef([]);
  const rafRef       = useRef(null);
  const pendingRef   = useRef(null);   // latest computed heading waiting for RAF
  const listeningRef = useRef(false);

  // RAF loop — updates React state at ~30fps max, not 60fps sensor rate
  const scheduleUpdate = () => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (pendingRef.current != null) {
        setDisplayHeading(pendingRef.current);
      }
    });
  };

  // Stable sensor handler stored in ref
  const handler = useRef((e) => {
    const result = computeHeading(e);
    if (!result) return;

    const { heading: raw, accuracy: acc, source: src } = result;

    // Apply low-pass filter — smooth=0.08, dead-zone=1°
    smoothRef.current = lowPass(smoothRef.current, raw, 0.08, 1.0);

    // Apply calibration offset
    const corrected = ((smoothRef.current - offsetRef.current) + 360) % 360;
    pendingRef.current = corrected;

    // Update accuracy display (throttled via RAF)
    if (acc != null) setAccuracy(Math.round(acc));
    setSource(src);

    // Collect calibration samples
    if (calRef.current) {
      calSampRef.current.push(raw);
      if (calSampRef.current.length > 60) calSampRef.current.shift();
      setCalCount(calSampRef.current.length);
    }

    scheduleUpdate();
  }).current;

  const attach = () => {
    if (listeningRef.current) return;
    listeningRef.current = true;
    // Use absolute if available (Android Chrome — referenced to geographic north)
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', handler, true);
    }
    // Always also listen to deviceorientation for iOS (webkitCompassHeading)
    window.addEventListener('deviceorientation', handler, true);
  };

  const detach = () => {
    listeningRef.current = false;
    window.removeEventListener('deviceorientation', handler, true);
    window.removeEventListener('deviceorientationabsolute', handler, true);
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  };

  const startSensor = async () => {
    setError(null);
    const ok = await requestPermission();
    if (!ok) {
      setError('Permission denied. In iOS Settings → Safari → enable Motion & Orientation Access.');
      return;
    }
    setPermitted(true);
    setNeedsPermission(false);
    attach();
  };

  useEffect(() => {
    const isIOS = typeof DeviceOrientationEvent?.requestPermission === 'function';
    if (isIOS) {
      setNeedsPermission(true);
    } else {
      setPermitted(true);
      attach();
    }
    return detach;
  }, []); // eslint-disable-line

  // Scroll lock
  useEffect(() => {
    const prev = { overflow: document.body.style.overflow, position: document.body.style.position };
    if (expanded) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    }
    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.position = prev.position;
      document.body.style.width = '';
    };
  }, [expanded]);

  // Calibration
  const startCal = () => {
    calSampRef.current = [];
    setCalCount(0);
    calRef.current = true;
    setCalibrating(true);
  };

  const finishCal = () => {
    calRef.current = false;
    setCalibrating(false);
    const s = calSampRef.current;
    if (s.length < 10) return;
    // Circular mean
    const sinS = s.reduce((a, h) => a + Math.sin(h * Math.PI / 180), 0);
    const cosS = s.reduce((a, h) => a + Math.cos(h * Math.PI / 180), 0);
    const avg  = (Math.atan2(sinS, cosS) * 180 / Math.PI + 360) % 360;
    offsetRef.current = avg;
    setOffset(avg);
    smoothRef.current = null;
    setDisplayHeading(null);
  };

  const resetCal = () => {
    offsetRef.current = 0;
    setOffset(0);
    smoothRef.current = null;
    setDisplayHeading(null);
  };

  const close = () => setExpanded(false);

  const needleAngle = displayHeading != null
    ? ((targetBearingDeg - displayHeading) + 360) % 360
    : targetBearingDeg;

  const dialAngle = displayHeading != null ? -displayHeading : 0;
  const { label, arrow } = getDirection(needleAngle);

  const distDisplay = parseFloat(distanceKm) < 1
    ? `${(parseFloat(distanceKm) * 1000).toFixed(0)} m`
    : `${parseFloat(distanceKm).toFixed(1)} km`;

  const dialSize = typeof window !== 'undefined'
    ? Math.min(window.innerWidth - 48, 300)
    : 280;

  const accuracyColor = accuracy == null ? '#64748b'
    : accuracy < 15 ? '#34d399'
    : accuracy < 30 ? '#fbbf24'
    : '#f87171';

  const accuracyLabel = accuracy == null ? 'Unknown'
    : accuracy < 15 ? 'Good'
    : accuracy < 30 ? 'Fair'
    : 'Poor — move figure-8';

  return (
    <>
      {/* ── Collapsed pill ── */}
      <button onClick={() => setExpanded(true)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', background: '#0f172a', border: '1px solid #334155',
        borderRadius: 16, cursor: 'pointer', textAlign: 'left',
      }}>
        <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <g transform={`rotate(${needleAngle}, 20, 20)`}>
              <polygon points="20,4 22,20 20,17 18,20" fill="#ef4444" />
              <polygon points="20,36 22,20 20,23 18,20" fill="#64748b" />
            </g>
            <circle cx="20" cy="20" r="3" fill="#e2e8f0" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 900, fontSize: 14, color: 'white' }}>🧭 Live Compass</p>
          <p style={{ margin: 0, fontSize: 10, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {displayHeading != null ? `${arrow} ${label}` : 'Tap to open'} · {destName}
          </p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ margin: 0, fontWeight: 900, fontSize: 14, color: '#fbbf24' }}>{distDisplay}</p>
          <p style={{ margin: 0, fontSize: 9, color: '#64748b', fontWeight: 700 }}>tap to expand</p>
        </div>
      </button>

      {/* ── Fullscreen modal ── */}
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
            flexShrink: 0, background: '#020617', gap: 8,
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 900, fontSize: 16, color: 'white' }}>🧭 Live Compass</p>
              <p style={{ margin: 0, fontSize: 10, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                → {destName}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={close} style={{
                padding: '8px 12px', background: '#1e293b', border: '1px solid #334155',
                borderRadius: 10, color: '#cbd5e1', fontWeight: 900, fontSize: 12,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>↕ Shrink</button>
              <button onClick={close} style={{
                padding: '8px 12px', background: '#dc2626', border: 'none',
                borderRadius: 10, color: 'white', fontWeight: 900, fontSize: 12,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>✕ Close</button>
            </div>
          </div>

          {/* Calibration banner */}
          {calibrating && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 16px', background: '#3730a3', flexShrink: 0, gap: 12,
            }}>
              <div>
                <p style={{ margin: 0, color: 'white', fontWeight: 900, fontSize: 13 }}>📐 Calibrating... ({calCount}/60)</p>
                <p style={{ margin: 0, color: '#c7d2fe', fontSize: 11 }}>Hold phone flat, point to North, move in figure-8</p>
              </div>
              <button onClick={finishCal} style={{
                padding: '6px 14px', background: 'white', border: 'none',
                borderRadius: 8, color: '#3730a3', fontWeight: 900, fontSize: 12,
                cursor: 'pointer', flexShrink: 0,
              }}>Done ✓</button>
            </div>
          )}

          {/* Scrollable body */}
          <div style={{
            flex: 1, overflowY: 'auto', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            padding: '16px 20px', gap: 16,
          }}>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
              {[
                { val: distDisplay,                                    lbl: 'Distance',  color: '#fbbf24' },
                { val: `${Math.round(targetBearingDeg)}°`,             lbl: 'Target',    color: '#818cf8' },
                { val: displayHeading != null ? `${Math.round(displayHeading)}°` : '—', lbl: 'Facing', color: '#34d399' },
              ].map(({ val, lbl, color }, i, arr) => (
                <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontWeight: 900, fontSize: 22, color }}>{val}</p>
                    <p style={{ margin: 0, fontSize: 9, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{lbl}</p>
                  </div>
                  {i < arr.length - 1 && <div style={{ width: 1, height: 32, background: '#1e293b' }} />}
                </div>
              ))}
            </div>

            {/* Accuracy badge */}
            {source && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 14px', background: '#0f172a',
                border: `1px solid ${accuracyColor}40`, borderRadius: 20,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: accuracyColor }} />
                <p style={{ margin: 0, fontSize: 11, color: accuracyColor, fontWeight: 700 }}>
                  {source === 'ios' ? 'iOS Compass' : source === 'android-abs' ? 'Android (Absolute)' : 'Android (Relative)'}
                  {accuracy != null ? ` · ±${accuracy}° · ${accuracyLabel}` : ` · ${accuracyLabel}`}
                </p>
              </div>
            )}

            {/* Compass dial */}
            <CompassDial needleAngle={needleAngle} dialAngle={dialAngle} size={dialSize} />

            {/* Direction */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 52, fontWeight: 900, color: 'white', lineHeight: 1 }}>{arrow}</p>
              <p style={{ margin: '6px 0 0', fontSize: 17, fontWeight: 900, color: '#fbbf24' }}>{label}</p>
              {displayHeading == null && !error && (
                <p style={{ margin: '6px 0 0', fontSize: 11, color: '#475569' }}>
                  {needsPermission && !permitted ? 'Tap "Enable Compass" below' : 'Move device in a figure-8 to start...'}
                </p>
              )}
            </div>

            {/* iOS permission */}
            {needsPermission && !permitted && (
              <button onClick={startSensor} style={{
                width: '100%', maxWidth: 280, padding: '14px 0',
                background: '#4f46e5', border: 'none', borderRadius: 14,
                color: 'white', fontWeight: 900, fontSize: 15, cursor: 'pointer',
              }}>Enable Compass (iOS)</button>
            )}

            {error && (
              <p style={{ fontSize: 12, color: '#f87171', fontWeight: 600, textAlign: 'center', padding: '0 12px' }}>{error}</p>
            )}

            {/* Calibration controls */}
            <div style={{ width: '100%', maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {!calibrating ? (
                <button onClick={startCal} style={{
                  width: '100%', padding: '11px 0',
                  background: 'rgba(79,70,229,0.12)', border: '1px solid rgba(99,102,241,0.35)',
                  borderRadius: 12, color: '#a5b4fc', fontWeight: 900, fontSize: 13, cursor: 'pointer',
                }}>📐 Calibrate Compass</button>
              ) : (
                <p style={{ textAlign: 'center', fontSize: 11, color: '#a5b4fc', fontWeight: 600, margin: 0 }}>
                  Slowly rotate phone in all directions, then tap Done ✓
                </p>
              )}
              {offset !== 0 && (
                <button onClick={resetCal} style={{
                  width: '100%', padding: '9px 0', background: '#1e293b',
                  border: '1px solid #334155', borderRadius: 12,
                  color: '#94a3b8', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                }}>↺ Reset Calibration (offset: {Math.round(offset)}°)</button>
              )}
            </div>

            <p style={{ fontSize: 10, color: '#334155', textAlign: 'center', maxWidth: 260, margin: 0 }}>
              Red needle points to destination. Rotate until needle points up ↑
            </p>

            {/* Bottom buttons */}
            <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 280, paddingBottom: 4 }}>
              <button onClick={close} style={{
                flex: 1, padding: '13px 0', background: '#1e293b',
                border: '1px solid #334155', borderRadius: 14,
                color: '#cbd5e1', fontWeight: 900, fontSize: 14, cursor: 'pointer',
              }}>↕ Shrink</button>
              <button onClick={close} style={{
                flex: 1, padding: '13px 0', background: '#dc2626',
                border: 'none', borderRadius: 14,
                color: 'white', fontWeight: 900, fontSize: 14, cursor: 'pointer',
              }}>✕ Close</button>
            </div>

          </div>
        </div>
      , document.body)}
    </>
  );
}
