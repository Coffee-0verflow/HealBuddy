import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// ── iOS permission ────────────────────────────────────────────────────────────
async function requestIOSPermission() {
  if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
    try { return (await DeviceOrientationEvent.requestPermission()) === 'granted'; }
    catch { return false; }
  }
  return true;
}

// ── Direction label from needle angle ────────────────────────────────────────
function getDirection(a) {
  a = ((a % 360) + 360) % 360;
  if (a < 22.5 || a >= 337.5) return '↑  Straight Ahead';
  if (a < 67.5)  return '↗  Slight Right';
  if (a < 112.5) return '→  Turn Right';
  if (a < 157.5) return '↘  Sharp Right';
  if (a < 202.5) return '↓  Turn Around';
  if (a < 247.5) return '↙  Sharp Left';
  if (a < 292.5) return '←  Turn Left';
  return           '↖  Slight Left';
}

// ── Compass Dial SVG (static — rotation applied via DOM ref) ─────────────────
function CompassDial({ size, dialRef, needleRef }) {
  const cx = size / 2;
  const R  = cx - 6;

  const ticks = Array.from({ length: 72 }, (_, i) => {
    const deg = i * 5;
    const rad = deg * Math.PI / 180;
    const major = deg % 90 === 0;
    const mid   = deg % 45 === 0;
    const r1 = major ? R * 0.60 : mid ? R * 0.68 : R * 0.73;
    return {
      x1: cx + r1       * Math.sin(rad), y1: cx - r1       * Math.cos(rad),
      x2: cx + R * 0.80 * Math.sin(rad), y2: cx - R * 0.80 * Math.cos(rad),
      stroke: major ? '#6366f1' : mid ? '#475569' : '#1e293b',
      sw: major ? 3 : mid ? 1.5 : 0.8,
    };
  });

  const cardinals = [
    { l: 'N', d: 0,   fill: '#f87171', fs: R * 0.15, fw: 900 },
    { l: 'E', d: 90,  fill: '#94a3b8', fs: R * 0.11, fw: 700 },
    { l: 'S', d: 180, fill: '#94a3b8', fs: R * 0.11, fw: 700 },
    { l: 'W', d: 270, fill: '#94a3b8', fs: R * 0.11, fw: 700 },
  ];
  const inter = [
    { l: 'NE', d: 45 }, { l: 'SE', d: 135 },
    { l: 'SW', d: 225 }, { l: 'NW', d: 315 },
  ];
  const lr = R * 0.88;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'block', flexShrink: 0 }}>
      {/* Background */}
      <circle cx={cx} cy={cx} r={R}       fill="#0f172a" stroke="#334155" strokeWidth="3" />
      <circle cx={cx} cy={cx} r={R * 0.96} fill="none"   stroke="#1e293b" strokeWidth="1" />

      {/* Rotating dial — controlled via dialRef */}
      <g ref={dialRef}>
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={t.stroke} strokeWidth={t.sw} strokeLinecap="round" />
        ))}
        {cardinals.map(({ l, d, fill, fs, fw }) => {
          const rad = d * Math.PI / 180;
          return (
            <text key={l}
              x={cx + lr * Math.sin(rad)} y={cx - lr * Math.cos(rad)}
              textAnchor="middle" dominantBaseline="central"
              fill={fill} fontSize={fs} fontWeight={fw}
            >{l}</text>
          );
        })}
        {inter.map(({ l, d }) => {
          const rad = d * Math.PI / 180;
          return (
            <text key={l}
              x={cx + lr * 0.90 * Math.sin(rad)} y={cx - lr * 0.90 * Math.cos(rad)}
              textAnchor="middle" dominantBaseline="central"
              fill="#475569" fontSize={R * 0.072} fontWeight="600"
            >{l}</text>
          );
        })}
      </g>

      {/* Needle — controlled via needleRef */}
      <g ref={needleRef}>
        {/* Red tip → destination */}
        <polygon
          points={`${cx},${cx - R*0.52} ${cx+R*0.07},${cx-R*0.04} ${cx},${cx+R*0.06} ${cx-R*0.07},${cx-R*0.04}`}
          fill="#ef4444"
        />
        {/* Grey tail */}
        <polygon
          points={`${cx},${cx + R*0.52} ${cx+R*0.07},${cx+R*0.04} ${cx},${cx-R*0.06} ${cx-R*0.07},${cx+R*0.04}`}
          fill="#64748b"
        />
      </g>

      {/* Center cap */}
      <circle cx={cx} cy={cx} r={R * 0.055} fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
      {/* Fixed N dot at top of bezel */}
      <circle cx={cx} cy={cx - R + 7} r={5} fill="#ef4444" />
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LiveCompass({ targetBearingDeg, destName, distanceKm }) {
  const [expanded,        setExpanded]        = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [permitted,       setPermitted]       = useState(false);
  const [error,           setError]           = useState(null);
  const [status,          setStatus]          = useState('waiting'); // waiting | active | unstable
  const [dirLabel,        setDirLabel]        = useState('');
  const [headingDisplay,  setHeadingDisplay]  = useState(null);

  // DOM refs for direct rotation — no React re-render on every frame
  const dialRef   = useRef(null);
  const needleRef = useRef(null);

  // Sensor state in refs — never causes re-renders
  const sinAcc    = useRef(0);   // sin accumulator for vector smoothing
  const cosAcc    = useRef(0);   // cos accumulator
  const smoothed  = useRef(null);// current smoothed heading
  const rafId     = useRef(null);
  const targetRef = useRef(targetBearingDeg);
  const attached  = useRef(false);

  // Calibration / stability detection
  const recentRaw    = useRef([]); // last N raw readings
  const stableFrames = useRef(0);

  // Keep targetRef in sync without re-attaching sensor
  useEffect(() => { targetRef.current = targetBearingDeg; }, [targetBearingDeg]);

  // ── Sensor handler ──────────────────────────────────────────────────────────
  const onOrientation = useRef((e) => {
    let raw = null;

    // iOS — webkitCompassHeading is true-north magnetic, most accurate
    if (e.webkitCompassHeading != null && e.webkitCompassHeading >= 0) {
      raw = e.webkitCompassHeading;
    }
    // Android absolute — alpha=0 is geographic north
    else if (e.absolute && e.alpha != null) {
      raw = (360 - e.alpha + 360) % 360;
    }
    // Android relative fallback
    else if (e.alpha != null) {
      raw = (360 - e.alpha + 360) % 360;
    }

    if (raw == null) return;
    raw = ((raw % 360) + 360) % 360;

    // ── Vector-based smoothing (sin/cos accumulator) ──────────────────────
    // This is the CORRECT way to smooth angles — avoids 0/360 wrap issues
    // and is immune to gimbal lock artifacts.
    // Decay factor: 0.85 keeps history, 0.15 weight on new sample
    const DECAY = 0.85;
    const rad   = raw * Math.PI / 180;
    sinAcc.current = DECAY * sinAcc.current + (1 - DECAY) * Math.sin(rad);
    cosAcc.current = DECAY * cosAcc.current + (1 - DECAY) * Math.cos(rad);

    // Recover smoothed angle from accumulated sin/cos vector
    const smoothedRad = Math.atan2(sinAcc.current, cosAcc.current);
    smoothed.current  = ((smoothedRad * 180 / Math.PI) + 360) % 360;

    // ── Stability detection ───────────────────────────────────────────────
    const buf = recentRaw.current;
    buf.push(raw);
    if (buf.length > 20) buf.shift();

    if (buf.length >= 10) {
      // Compute circular variance of recent readings
      const sinM = buf.reduce((s, h) => s + Math.sin(h * Math.PI / 180), 0) / buf.length;
      const cosM = buf.reduce((s, h) => s + Math.cos(h * Math.PI / 180), 0) / buf.length;
      const R_len = Math.sqrt(sinM * sinM + cosM * cosM); // 1=stable, 0=random
      if (R_len > 0.92) {
        stableFrames.current = Math.min(stableFrames.current + 1, 30);
      } else {
        stableFrames.current = 0;
      }
    }
  }).current;

  // ── RAF loop — applies rotation directly to DOM ─────────────────────────────
  const rafLoop = useRef(() => {
    rafId.current = requestAnimationFrame(rafLoop.current);

    const h = smoothed.current;
    if (h == null) return;

    const dialEl   = dialRef.current;
    const needleEl = needleRef.current;
    if (!dialEl || !needleEl) return;

    // Dial rotates opposite to heading (so N always points to real North)
    const dialAngle   = -h;
    // Needle points to destination relative to current heading
    const needleAngle = ((targetRef.current - h) + 360) % 360;

    // Direct DOM transform — zero React overhead, buttery smooth
    const cx = dialEl.ownerSVGElement?.viewBox?.baseVal?.width / 2 || 150;
    const cy = cx;
    dialEl.setAttribute('transform',   `rotate(${dialAngle},   ${cx}, ${cy})`);
    needleEl.setAttribute('transform', `rotate(${needleAngle}, ${cx}, ${cy})`);

    // Update React state at low frequency (every ~10 frames ≈ 6fps) for text display
    if (!rafLoop._tick) rafLoop._tick = 0;
    rafLoop._tick++;
    if (rafLoop._tick % 10 === 0) {
      const stable = stableFrames.current >= 15;
      setHeadingDisplay(Math.round(h));
      setDirLabel(getDirection(needleAngle));
      setStatus(stable ? 'active' : 'unstable');
    }
  }).current;

  // ── Attach / detach sensor ──────────────────────────────────────────────────
  const attach = () => {
    if (attached.current) return;
    attached.current = true;
    sinAcc.current = 0;
    cosAcc.current = 0;
    smoothed.current = null;
    recentRaw.current = [];
    stableFrames.current = 0;

    // Prefer absolute on Android Chrome
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', onOrientation, true);
    } else {
      window.addEventListener('deviceorientation', onOrientation, true);
    }
    rafId.current = requestAnimationFrame(rafLoop);
  };

  const detach = () => {
    attached.current = false;
    window.removeEventListener('deviceorientation', onOrientation, true);
    window.removeEventListener('deviceorientationabsolute', onOrientation, true);
    if (rafId.current) { cancelAnimationFrame(rafId.current); rafId.current = null; }
  };

  const enableSensor = async () => {
    setError(null);
    const ok = await requestIOSPermission();
    if (!ok) {
      setError('Permission denied. Go to iOS Settings → Safari → Motion & Orientation Access → ON');
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

  // Scroll lock when expanded
  useEffect(() => {
    if (!expanded) return;
    const prev = document.body.style.cssText;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width    = '100%';
    return () => { document.body.style.cssText = prev; };
  }, [expanded]);

  const close = () => setExpanded(false);

  const distDisplay = parseFloat(distanceKm) < 1
    ? `${(parseFloat(distanceKm) * 1000).toFixed(0)} m`
    : `${parseFloat(distanceKm).toFixed(1)} km`;

  const dialSize = typeof window !== 'undefined'
    ? Math.min(window.innerWidth - 48, 300)
    : 280;

  const statusColor = status === 'active' ? '#34d399' : status === 'unstable' ? '#fbbf24' : '#64748b';
  const statusText  = status === 'active' ? 'Stable' : status === 'unstable' ? 'Move phone in figure-8 ∞' : 'Waiting for sensor...';

  // Mini needle angle for collapsed pill
  const miniNeedle = headingDisplay != null
    ? ((targetBearingDeg - headingDisplay) + 360) % 360
    : 0;

  return (
    <>
      {/* ── Collapsed pill ── */}
      <button onClick={() => setExpanded(true)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', background: '#0f172a', border: '1px solid #334155',
        borderRadius: 16, cursor: 'pointer', textAlign: 'left',
      }}>
        <svg width="40" height="40" viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
          <circle cx="20" cy="20" r="18" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <g transform={`rotate(${miniNeedle}, 20, 20)`}>
            <polygon points="20,4 22,20 20,17 18,20" fill="#ef4444" />
            <polygon points="20,36 22,20 20,23 18,20" fill="#64748b" />
          </g>
          <circle cx="20" cy="20" r="3" fill="#e2e8f0" />
        </svg>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 900, fontSize: 14, color: 'white' }}>🧭 Live Compass</p>
          <p style={{ margin: 0, fontSize: 10, color: '#94a3b8',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {dirLabel || 'Tap to open'} · {destName}
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
            flexShrink: 0, gap: 8,
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 900, fontSize: 16, color: 'white' }}>🧭 Live Compass</p>
              <p style={{ margin: 0, fontSize: 10, color: '#64748b',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                → {destName}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={close} style={{
                padding: '8px 14px', background: '#1e293b', border: '1px solid #334155',
                borderRadius: 10, color: '#cbd5e1', fontWeight: 900, fontSize: 12,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>↕ Shrink</button>
              <button onClick={close} style={{
                padding: '8px 14px', background: '#dc2626', border: 'none',
                borderRadius: 10, color: 'white', fontWeight: 900, fontSize: 12,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>✕ Close</button>
            </div>
          </div>

          {/* Body */}
          <div style={{
            flex: 1, overflowY: 'auto', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            padding: '20px 20px', gap: 18,
          }}>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { v: distDisplay,                                              l: 'Distance', c: '#fbbf24' },
                { v: `${Math.round(targetBearingDeg)}°`,                      l: 'Target',   c: '#818cf8' },
                { v: headingDisplay != null ? `${headingDisplay}°` : '—',     l: 'Facing',   c: '#34d399' },
              ].map(({ v, l, c }, i, a) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontWeight: 900, fontSize: 22, color: c }}>{v}</p>
                    <p style={{ margin: 0, fontSize: 9, color: '#475569', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: 1 }}>{l}</p>
                  </div>
                  {i < a.length - 1 && <div style={{ width: 1, height: 32, background: '#1e293b' }} />}
                </div>
              ))}
            </div>

            {/* Status badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 20,
              background: '#0f172a', border: `1px solid ${statusColor}50`,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: statusColor,
                boxShadow: status === 'active' ? `0 0 6px ${statusColor}` : 'none',
              }} />
              <p style={{ margin: 0, fontSize: 11, color: statusColor, fontWeight: 700 }}>
                {statusText}
              </p>
            </div>

            {/* Compass dial — rotation via DOM refs, zero React overhead */}
            <CompassDial size={dialSize} dialRef={dialRef} needleRef={needleRef} />

            {/* Direction label */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: 'white',
                letterSpacing: 1, minHeight: 36 }}>
                {dirLabel || '—'}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: '#475569' }}>
                Rotate phone until red needle points up ↑
              </p>
            </div>

            {/* iOS permission */}
            {needsPermission && !permitted && (
              <button onClick={enableSensor} style={{
                width: '100%', maxWidth: 280, padding: '14px 0',
                background: '#4f46e5', border: 'none', borderRadius: 14,
                color: 'white', fontWeight: 900, fontSize: 15, cursor: 'pointer',
              }}>Enable Compass (iOS)</button>
            )}

            {error && (
              <p style={{ fontSize: 12, color: '#f87171', fontWeight: 600,
                textAlign: 'center', padding: '0 12px', margin: 0 }}>{error}</p>
            )}

            {/* Calibration tip */}
            {status === 'unstable' && (
              <div style={{
                width: '100%', maxWidth: 280, padding: '12px 16px',
                background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)',
                borderRadius: 12,
              }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: '#fbbf24' }}>
                  ∞ Calibrate Sensor
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: '#92400e' }}>
                  Hold phone flat and slowly move it in a figure-8 pattern until the status turns green.
                </p>
              </div>
            )}

            <p style={{ margin: 0, fontSize: 10, color: '#1e293b',
              textAlign: 'center', maxWidth: 260 }}>
              Red needle → destination · Dial rotates with your heading
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
