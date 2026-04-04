import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

async function requestOrientationPermission() {
  if (
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function'
  ) {
    try {
      const res = await DeviceOrientationEvent.requestPermission();
      return res === 'granted';
    } catch { return false; }
  }
  return true; // Android / desktop — no prompt needed
}

function getArrowLabel(a) {
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

// ── Compass Dial ─────────────────────────────────────────────────────────────
function CompassDial({ needleAngle, dialAngle, size }) {
  const cx = size / 2;
  const labelR = cx * 0.78;
  const t1 = cx * 0.70, t2 = cx * 0.77, tM = cx * 0.63;

  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      {/* Ring */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '4px solid #475569', background: '#0f172a',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8), 0 0 20px rgba(99,102,241,0.2)',
      }} />

      {/* Rotating dial */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: `rotate(${dialAngle}deg)`,
        transition: 'transform 0.15s linear',
        willChange: 'transform',
      }}>
        <svg style={{ position: 'absolute', inset: 0 }} width={size} height={size}>
          {Array.from({ length: 72 }).map((_, i) => {
            const rad = (i * 5) * Math.PI / 180;
            const major = i % 18 === 0, mid = i % 9 === 0;
            const r1 = major ? tM : mid ? t1 - cx * 0.04 : t1;
            return (
              <line key={i}
                x1={cx + r1 * Math.sin(rad)} y1={cx - r1 * Math.cos(rad)}
                x2={cx + t2 * Math.sin(rad)} y2={cx - t2 * Math.cos(rad)}
                stroke={major ? '#6366f1' : mid ? '#475569' : '#1e293b'}
                strokeWidth={major ? 3 : mid ? 1.5 : 1}
              />
            );
          })}
        </svg>
        {/* Cardinal labels */}
        {[
          { l: 'N', a: 0,   c: '#f87171', w: 900 },
          { l: 'NE', a: 45,  c: '#64748b', w: 700 },
          { l: 'E', a: 90,  c: '#cbd5e1', w: 900 },
          { l: 'SE', a: 135, c: '#64748b', w: 700 },
          { l: 'S', a: 180, c: '#cbd5e1', w: 900 },
          { l: 'SW', a: 225, c: '#64748b', w: 700 },
          { l: 'W', a: 270, c: '#cbd5e1', w: 900 },
          { l: 'NW', a: 315, c: '#64748b', w: 700 },
        ].map(({ l, a, c, w }) => {
          const rad = a * Math.PI / 180;
          const r = l.length === 1 ? labelR : labelR * 0.91;
          const fs = l.length === 1 ? Math.max(11, size * 0.05) : Math.max(8, size * 0.035);
          return (
            <span key={l} style={{
              position: 'absolute',
              left: cx + r * Math.sin(rad),
              top: cx - r * Math.cos(rad),
              transform: 'translate(-50%,-50%)',
              color: c, fontWeight: w, fontSize: fs,
              userSelect: 'none', lineHeight: 1,
            }}>{l}</span>
          );
        })}
      </div>

      {/* Fixed needle */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: `rotate(${needleAngle}deg)`,
        transition: 'transform 0.2s linear',
        willChange: 'transform',
      }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute' }}>
          <polygon
            points={`${cx},${cx*0.10} ${cx+cx*0.07},${cx*0.52} ${cx},${cx*0.42} ${cx-cx*0.07},${cx*0.52}`}
            fill="#ef4444"
          />
          <polygon
            points={`${cx},${size-cx*0.10} ${cx+cx*0.07},${cx*1.48} ${cx},${cx*1.58} ${cx-cx*0.07},${cx*1.48}`}
            fill="#64748b"
          />
        </svg>
      </div>

      {/* Center */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: '50%',
          background: '#e2e8f0', border: '2px solid #64748b',
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)', zIndex: 10,
        }} />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LiveCompass({ targetBearingDeg, destName, distanceKm }) {
  const [expanded, setExpanded]   = useState(false);
  const [permitted, setPermitted] = useState(false);
  const [heading, setHeading]     = useState(null);   // smoothed corrected heading
  const [error, setError]         = useState(null);
  const [calibrating, setCalibrating] = useState(false);
  const [calSamples, setCalSamples]   = useState([]);
  const [offset, setOffset]           = useState(0);
  const [needsPermission, setNeedsPermission] = useState(false);

  // Use refs for values used inside event handler to avoid stale closures
  const rawRef      = useRef(null);   // latest raw heading
  const smoothRef   = useRef(null);   // smoothed heading
  const offsetRef   = useRef(0);
  const calRef      = useRef(false);
  const calSampRef  = useRef([]);
  const sensorRef   = useRef('unknown');
  const listeningRef = useRef(false);

  // Sync offset ref
  useEffect(() => { offsetRef.current = offset; }, [offset]);
  useEffect(() => { calRef.current = calibrating; }, [calibrating]);

  // Stable event handler — reads from refs, never recreated
  const handleOrientation = useRef((e) => {
    let raw = null;

    if (e.webkitCompassHeading != null && e.webkitCompassHeading >= 0) {
      raw = e.webkitCompassHeading;
      sensorRef.current = 'ios';
    } else if (e.absolute === true && e.alpha != null) {
      raw = (360 - e.alpha + 360) % 360;
      sensorRef.current = 'absolute';
    } else if (e.alpha != null) {
      raw = (360 - e.alpha + 360) % 360;
      sensorRef.current = 'android';
    }

    if (raw == null) return;
    raw = ((raw % 360) + 360) % 360;
    rawRef.current = raw;

    // Smooth
    const prev = smoothRef.current;
    let smooth;
    if (prev == null) {
      smooth = raw;
    } else {
      let diff = raw - prev;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      smooth = ((prev + diff * 0.12) + 360) % 360;
    }
    smoothRef.current = smooth;

    // Apply offset and update state
    const corrected = ((smooth - offsetRef.current) + 360) % 360;
    setHeading(corrected);

    // Collect calibration samples
    if (calRef.current) {
      calSampRef.current = [...calSampRef.current.slice(-29), raw];
      setCalSamples([...calSampRef.current]);
    }
  }).current;

  const attachListeners = () => {
    if (listeningRef.current) return;
    listeningRef.current = true;
    // Prefer absolute on Android
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    } else {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  };

  const detachListeners = () => {
    listeningRef.current = false;
    window.removeEventListener('deviceorientation', handleOrientation, true);
    window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
  };

  const start = async () => {
    setError(null);
    const ok = await requestOrientationPermission();
    if (!ok) {
      setError('Permission denied. Go to Settings → Safari → Motion & Orientation → Allow.');
      return;
    }
    setPermitted(true);
    setNeedsPermission(false);
    attachListeners();
  };

  useEffect(() => {
    const needsPrompt =
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function';

    if (needsPrompt) {
      setNeedsPermission(true); // iOS — wait for user tap
    } else {
      setPermitted(true);
      attachListeners(); // Android / desktop — auto start
    }

    return detachListeners;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock scroll when expanded
  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [expanded]);

  const startCalibration = () => {
    calSampRef.current = [];
    setCalSamples([]);
    setCalibrating(true);
  };

  const finishCalibration = () => {
    setCalibrating(false);
    calRef.current = false;
    const samples = calSampRef.current;
    if (samples.length < 5) return;
    const sinSum = samples.reduce((s, h) => s + Math.sin(h * Math.PI / 180), 0);
    const cosSum = samples.reduce((s, h) => s + Math.cos(h * Math.PI / 180), 0);
    const avg = (Math.atan2(sinSum, cosSum) * 180 / Math.PI + 360) % 360;
    setOffset(avg);
    offsetRef.current = avg;
    smoothRef.current = null;
    setHeading(null);
  };

  const resetCalibration = () => {
    setOffset(0);
    offsetRef.current = 0;
    smoothRef.current = null;
    setHeading(null);
  };

  const close = () => setExpanded(false);

  const needleAngle = heading != null
    ? ((targetBearingDeg - heading) + 360) % 360
    : targetBearingDeg;

  const dialAngle = heading != null ? -heading : 0;

  const { label, arrow } = getArrowLabel(needleAngle);

  const distDisplay = parseFloat(distanceKm) < 1
    ? `${(parseFloat(distanceKm) * 1000).toFixed(0)} m`
    : `${parseFloat(distanceKm).toFixed(1)} km`;

  const dialSize = typeof window !== 'undefined'
    ? Math.min(window.innerWidth - 48, 280)
    : 260;

  return (
    <>
      {/* ── Collapsed pill ── */}
      <button
        onClick={() => setExpanded(true)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 16px', background: '#0f172a', border: '1px solid #334155',
          borderRadius: 16, cursor: 'pointer' }}
      >
        {/* Mini needle */}
        <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%',
            background: '#1e293b', border: '2px solid #475569' }} />
          <div style={{ position: 'absolute', inset: 0,
            transform: `rotate(${needleAngle}deg)`, transition: 'transform 0.3s linear' }}>
            <svg width="40" height="40" viewBox="0 0 40 40">
              <polygon points="20,4 22,20 20,17 18,20" fill="#ef4444" />
              <polygon points="20,36 22,20 20,23 18,20" fill="#64748b" />
            </svg>
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%',
              background: 'white', border: '1px solid #64748b' }} />
          </div>
        </div>

        <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 900, fontSize: 14, color: 'white' }}>🧭 Live Compass</p>
          <p style={{ margin: 0, fontSize: 10, color: '#94a3b8',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {heading != null ? `${arrow} ${label}` : 'Tap to open'} · {destName}
          </p>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ margin: 0, fontWeight: 900, fontSize: 14, color: '#fbbf24' }}>{distDisplay}</p>
          <p style={{ margin: 0, fontSize: 9, color: '#64748b', fontWeight: 700 }}>tap to expand</p>
        </div>
      </button>

      {/* ── Fullscreen modal via portal ── */}
      {expanded && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 999999, background: '#020617',
          display: 'flex', flexDirection: 'column',
          // iOS safe area
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>

          {/* Header — fixed height, no overlap */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', borderBottom: '1px solid #1e293b',
            flexShrink: 0, background: '#020617',
          }}>
            <div style={{ minWidth: 0, flex: 1, marginRight: 12 }}>
              <p style={{ margin: 0, fontWeight: 900, fontSize: 17, color: 'white' }}>🧭 Live Compass</p>
              <p style={{ margin: 0, fontSize: 11, color: '#64748b',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                → {destName}
              </p>
            </div>
            {/* Buttons — always visible, never overlap */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={close} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '8px 14px', background: '#1e293b', border: '1px solid #334155',
                borderRadius: 12, color: '#cbd5e1', fontWeight: 900, fontSize: 12,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>↕ Shrink</button>
              <button onClick={close} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '8px 14px', background: '#dc2626', border: 'none',
                borderRadius: 12, color: 'white', fontWeight: 900, fontSize: 12,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>✕ Close</button>
            </div>
          </div>

          {/* Calibration banner */}
          {calibrating && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 20px', background: '#4338ca', flexShrink: 0,
            }}>
              <div>
                <p style={{ margin: 0, color: 'white', fontWeight: 900, fontSize: 13 }}>📐 Calibrating...</p>
                <p style={{ margin: 0, color: '#c7d2fe', fontSize: 11 }}>
                  Point phone to North, hold steady ({calSamples.length}/30)
                </p>
              </div>
              <button onClick={finishCalibration} style={{
                padding: '6px 14px', background: 'white', border: 'none',
                borderRadius: 8, color: '#4338ca', fontWeight: 900, fontSize: 12, cursor: 'pointer',
              }}>Done</button>
            </div>
          )}

          {/* Scrollable content */}
          <div style={{
            flex: 1, overflowY: 'auto', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            padding: '20px 24px', gap: 20,
          }}>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { val: distDisplay, lbl: 'Distance', color: '#fbbf24' },
                { val: `${Math.round(targetBearingDeg)}°`, lbl: 'Target', color: '#818cf8' },
                ...(heading != null ? [{ val: `${Math.round(heading)}°`, lbl: 'Facing', color: '#34d399' }] : []),
                ...(offset !== 0 ? [{ val: `${Math.round(offset)}°`, lbl: 'Offset', color: '#fde68a' }] : []),
              ].map(({ val, lbl, color }, i, arr) => (
                <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontWeight: 900, fontSize: 24, color }}>{val}</p>
                    <p style={{ margin: 0, fontSize: 9, color: '#475569', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: 1 }}>{lbl}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ width: 1, height: 36, background: '#1e293b' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Compass dial */}
            <CompassDial
              needleAngle={needleAngle}
              dialAngle={dialAngle}
              size={dialSize}
            />

            {/* Direction */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 56, fontWeight: 900, color: 'white', lineHeight: 1 }}>{arrow}</p>
              <p style={{ margin: '8px 0 0', fontSize: 18, fontWeight: 900, color: '#fbbf24' }}>{label}</p>
              {heading == null && !error && (
                <p style={{ margin: '6px 0 0', fontSize: 11, color: '#475569' }}>
                  Move device in a figure-8 to calibrate...
                </p>
              )}
              {sensorRef.current === 'android' && heading != null && offset === 0 && (
                <p style={{ margin: '4px 0 0', fontSize: 10, color: '#d97706' }}>
                  ⚠️ Relative sensor — tap Calibrate for accuracy
                </p>
              )}
            </div>

            {/* iOS permission button */}
            {needsPermission && !permitted && (
              <button onClick={start} style={{
                width: '100%', maxWidth: 280, padding: '14px 0',
                background: '#4f46e5', border: 'none', borderRadius: 16,
                color: 'white', fontWeight: 900, fontSize: 15, cursor: 'pointer',
              }}>
                Enable Compass (iOS)
              </button>
            )}

            {error && (
              <p style={{ fontSize: 12, color: '#f87171', fontWeight: 600,
                textAlign: 'center', padding: '0 16px' }}>{error}</p>
            )}

            {/* Calibration */}
            <div style={{ width: '100%', maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {!calibrating ? (
                <button onClick={startCalibration} style={{
                  width: '100%', padding: '10px 0', background: 'rgba(79,70,229,0.15)',
                  border: '1px solid rgba(99,102,241,0.4)', borderRadius: 12,
                  color: '#a5b4fc', fontWeight: 900, fontSize: 13, cursor: 'pointer',
                }}>📐 Calibrate Compass</button>
              ) : (
                <p style={{ textAlign: 'center', fontSize: 11, color: '#a5b4fc', fontWeight: 600 }}>
                  Point phone toward North and tap Done above
                </p>
              )}
              {offset !== 0 && (
                <button onClick={resetCalibration} style={{
                  width: '100%', padding: '8px 0', background: '#1e293b',
                  border: '1px solid #334155', borderRadius: 12,
                  color: '#94a3b8', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                }}>↺ Reset Calibration</button>
              )}
            </div>

            <p style={{ fontSize: 10, color: '#1e293b', textAlign: 'center', maxWidth: 260 }}>
              Red needle → destination. Rotate device until needle points up ↑
            </p>

            {/* Bottom close buttons */}
            <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 280, paddingBottom: 8 }}>
              <button onClick={close} style={{
                flex: 1, padding: '14px 0', background: '#1e293b',
                border: '1px solid #334155', borderRadius: 16,
                color: '#cbd5e1', fontWeight: 900, fontSize: 14, cursor: 'pointer',
              }}>↕ Shrink</button>
              <button onClick={close} style={{
                flex: 1, padding: '14px 0', background: '#dc2626',
                border: 'none', borderRadius: 16,
                color: 'white', fontWeight: 900, fontSize: 14, cursor: 'pointer',
              }}>✕ Close</button>
            </div>

          </div>
        </div>
      , document.body)}
    </>
  );
}
