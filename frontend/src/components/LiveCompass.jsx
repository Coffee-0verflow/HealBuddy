import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

function getLabel(a) {
  a = ((a % 360) + 360) % 360;
  if (a < 22.5 || a >= 337.5) return '↑ Straight Ahead';
  if (a < 67.5)  return '↗ Slight Right';
  if (a < 112.5) return '→ Turn Right';
  if (a < 157.5) return '↘ Sharp Right';
  if (a < 202.5) return '↓ Turn Around';
  if (a < 247.5) return '↙ Sharp Left';
  if (a < 292.5) return '← Turn Left';
  return           '↖ Slight Left';
}

async function askPermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const r = await DeviceOrientationEvent.requestPermission();
      return r === 'granted';
    } catch { return false; }
  }
  return true;
}

export default function LiveCompass({ targetBearingDeg, destName, distanceKm }) {
  const [expanded, setExpanded] = useState(false);
  const [heading,  setHeading]  = useState(null);
  const [error,    setError]    = useState(null);
  const [needPerm, setNeedPerm] = useState(false);
  const [stable,   setStable]   = useState(false);

  // All smoothing in refs — no stale closures, no extra renders
  const sinS   = useRef(0);
  const cosS   = useRef(0);
  const buf    = useRef([]);
  const active = useRef(false);
  const rafId  = useRef(null);
  const latest = useRef(null); // smoothed heading, read by RAF

  // DOM refs for zero-overhead rotation
  const dialEl   = useRef(null);
  const needleEl = useRef(null);
  const prevDial = useRef(0);
  const prevNeedle = useRef(0);

  const onEvent = useRef((e) => {
    let raw = null;

    // iOS — best source, already true-north
    if (e.webkitCompassHeading != null && e.webkitCompassHeading >= 0) {
      raw = e.webkitCompassHeading;
    }
    // Android absolute
    else if (e.absolute && e.alpha != null) {
      raw = (360 - e.alpha + 360) % 360;
    }
    // Android relative fallback
    else if (e.alpha != null) {
      raw = (360 - e.alpha + 360) % 360;
    }

    if (raw == null) return;
    raw = ((raw % 360) + 360) % 360;

    // Vector smoothing — immune to 0/360 wrap
    const ALPHA = 0.15; // higher = more responsive, lower = smoother
    const rad = raw * Math.PI / 180;
    sinS.current = (1 - ALPHA) * sinS.current + ALPHA * Math.sin(rad);
    cosS.current = (1 - ALPHA) * cosS.current + ALPHA * Math.cos(rad);
    const smoothed = ((Math.atan2(sinS.current, cosS.current) * 180 / Math.PI) + 360) % 360;
    latest.current = smoothed;

    // Stability: circular variance of last 15 readings
    buf.current.push(raw);
    if (buf.current.length > 15) buf.current.shift();
    if (buf.current.length >= 10) {
      const n = buf.current.length;
      const sm = buf.current.reduce((s, h) => s + Math.sin(h * Math.PI / 180), 0) / n;
      const cm = buf.current.reduce((s, h) => s + Math.cos(h * Math.PI / 180), 0) / n;
      setStable(Math.sqrt(sm * sm + cm * cm) > 0.85);
    }
  }).current;

  // RAF loop — direct DOM rotation, 60fps, zero React overhead
  const loop = useRef(() => {
    rafId.current = requestAnimationFrame(loop.current);
    const h = latest.current;
    if (h == null || !dialEl.current || !needleEl.current) return;

    const dialAngle   = -h;
    const needleAngle = ((targetBearingDeg - h) + 360) % 360;

    // Only update DOM if value changed meaningfully (>0.3°)
    if (Math.abs(dialAngle - prevDial.current) > 0.3) {
      dialEl.current.style.transform   = `rotate(${dialAngle}deg)`;
      prevDial.current = dialAngle;
    }
    if (Math.abs(needleAngle - prevNeedle.current) > 0.3) {
      needleEl.current.style.transform = `rotate(${needleAngle}deg)`;
      prevNeedle.current = needleAngle;
    }

    // Update React state for text display at low rate
    if (!loop._t) loop._t = 0;
    if (++loop._t % 8 === 0) setHeading(Math.round(h));
  }).current;

  const start = () => {
    if (active.current) return;
    active.current = true;
    sinS.current = 0; cosS.current = 0;
    buf.current = []; latest.current = null;

    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', onEvent, true);
    } else {
      window.addEventListener('deviceorientation', onEvent, true);
    }
    rafId.current = requestAnimationFrame(loop);
  };

  const stop = () => {
    active.current = false;
    window.removeEventListener('deviceorientation', onEvent, true);
    window.removeEventListener('deviceorientationabsolute', onEvent, true);
    if (rafId.current) { cancelAnimationFrame(rafId.current); rafId.current = null; }
  };

  const enable = async () => {
    setError(null);
    const ok = await askPermission();
    if (!ok) {
      setError('Denied. Go to iOS Settings → Safari → Motion & Orientation → ON');
      return;
    }
    setNeedPerm(false);
    start();
  };

  useEffect(() => {
    const isIOS = typeof DeviceOrientationEvent?.requestPermission === 'function';
    if (isIOS) { setNeedPerm(true); }
    else { start(); }
    return stop;
  }, []); // eslint-disable-line

  // targetBearingDeg changes — update needle without re-attaching sensor
  // (loop reads targetBearingDeg from closure — need to force re-render of loop)
  // We handle this by making loop read from a ref
  const targetRef = useRef(targetBearingDeg);
  useEffect(() => { targetRef.current = targetBearingDeg; }, [targetBearingDeg]);

  useEffect(() => {
    if (!expanded) return;
    const s = document.body.style;
    const prev = { o: s.overflow, p: s.position, w: s.width };
    s.overflow = 'hidden'; s.position = 'fixed'; s.width = '100%';
    return () => { s.overflow = prev.o; s.position = prev.p; s.width = prev.w; };
  }, [expanded]);

  const close = () => setExpanded(false);

  const needleAngle = heading != null
    ? ((targetBearingDeg - heading) + 360) % 360
    : 0;

  const dist = parseFloat(distanceKm) < 1
    ? `${(parseFloat(distanceKm) * 1000).toFixed(0)}m`
    : `${parseFloat(distanceKm).toFixed(1)}km`;

  const sz = typeof window !== 'undefined' ? Math.min(window.innerWidth - 48, 300) : 280;
  const cx = sz / 2, R = cx - 6;

  // Ticks
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const deg = i * 5, rad = deg * Math.PI / 180;
    const major = deg % 90 === 0, mid = deg % 45 === 0;
    const r1 = major ? R * 0.60 : mid ? R * 0.68 : R * 0.74;
    return {
      x1: cx + r1 * Math.sin(rad),       y1: cx - r1 * Math.cos(rad),
      x2: cx + R * 0.81 * Math.sin(rad), y2: cx - R * 0.81 * Math.cos(rad),
      s: major ? '#6366f1' : mid ? '#475569' : '#1e293b',
      w: major ? 3 : mid ? 1.5 : 0.8,
    };
  });

  const cards = [
    { l: 'N', d: 0,   c: '#f87171', fs: R * 0.15, fw: 900 },
    { l: 'E', d: 90,  c: '#94a3b8', fs: R * 0.11, fw: 700 },
    { l: 'S', d: 180, c: '#94a3b8', fs: R * 0.11, fw: 700 },
    { l: 'W', d: 270, c: '#94a3b8', fs: R * 0.11, fw: 700 },
  ];
  const inter = [
    { l: 'NE', d: 45 }, { l: 'SE', d: 135 },
    { l: 'SW', d: 225 }, { l: 'NW', d: 315 },
  ];
  const lr = R * 0.88;

  return (
    <>
      {/* Pill */}
      <button onClick={() => setExpanded(true)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', background: '#0f172a', border: '1px solid #334155',
        borderRadius: 16, cursor: 'pointer',
      }}>
        <svg width="40" height="40" viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
          <circle cx="20" cy="20" r="18" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <g style={{ transformOrigin: '20px 20px', transform: `rotate(${needleAngle}deg)` }}>
            <polygon points="20,4 22,20 20,17 18,20" fill="#ef4444" />
            <polygon points="20,36 22,20 20,23 18,20" fill="#64748b" />
          </g>
          <circle cx="20" cy="20" r="3" fill="#e2e8f0" />
        </svg>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 900, fontSize: 14, color: 'white' }}>🧭 Live Compass</p>
          <p style={{ margin: 0, fontSize: 10, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {heading != null ? getLabel(needleAngle) : 'Tap to open'} · {destName}
          </p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ margin: 0, fontWeight: 900, fontSize: 14, color: '#fbbf24' }}>{dist}</p>
          <p style={{ margin: 0, fontSize: 9, color: '#64748b', fontWeight: 700 }}>tap to expand</p>
        </div>
      </button>

      {/* Modal */}
      {expanded && createPortal(
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999999, background: '#020617',
          display: 'flex', flexDirection: 'column',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderBottom: '1px solid #1e293b', flexShrink: 0, gap: 8,
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 900, fontSize: 16, color: 'white' }}>🧭 Live Compass</p>
              <p style={{ margin: 0, fontSize: 10, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>→ {destName}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={close} style={{ padding: '8px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: 10, color: '#cbd5e1', fontWeight: 900, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>↕ Shrink</button>
              <button onClick={close} style={{ padding: '8px 14px', background: '#dc2626', border: 'none', borderRadius: 10, color: 'white', fontWeight: 900, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>✕ Close</button>
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 20px', gap: 20 }}>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { v: dist,                                                l: 'Distance', c: '#fbbf24' },
                { v: `${Math.round(targetBearingDeg)}°`,                  l: 'Target',   c: '#818cf8' },
                { v: heading != null ? `${heading}°` : '—',              l: 'Facing',   c: '#34d399' },
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

            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: '#0f172a', border: `1px solid ${stable ? '#34d39950' : '#fbbf2450'}` }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: stable ? '#34d399' : '#fbbf24', boxShadow: stable ? '0 0 6px #34d399' : 'none' }} />
              <p style={{ margin: 0, fontSize: 11, color: stable ? '#34d399' : '#fbbf24', fontWeight: 700 }}>
                {heading == null ? 'Waiting for sensor...' : stable ? 'Compass stable ✓' : 'Move phone in figure-8 ∞'}
              </p>
            </div>

            {/* Compass SVG — dial and needle rotated via DOM refs */}
            <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} style={{ display: 'block', flexShrink: 0 }}>
              <circle cx={cx} cy={cx} r={R}        fill="#0f172a" stroke="#334155" strokeWidth="3" />
              <circle cx={cx} cy={cx} r={R * 0.96} fill="none"   stroke="#1e293b" strokeWidth="1" />

              {/* Rotating dial */}
              <g ref={dialEl} style={{ transformOrigin: `${cx}px ${cx}px` }}>
                {ticks.map((t, i) => (
                  <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.s} strokeWidth={t.w} strokeLinecap="round" />
                ))}
                {cards.map(({ l, d, c, fs, fw }) => {
                  const rad = d * Math.PI / 180;
                  return <text key={l} x={cx + lr * Math.sin(rad)} y={cx - lr * Math.cos(rad)} textAnchor="middle" dominantBaseline="central" fill={c} fontSize={fs} fontWeight={fw}>{l}</text>;
                })}
                {inter.map(({ l, d }) => {
                  const rad = d * Math.PI / 180;
                  return <text key={l} x={cx + lr * 0.90 * Math.sin(rad)} y={cx - lr * 0.90 * Math.cos(rad)} textAnchor="middle" dominantBaseline="central" fill="#475569" fontSize={R * 0.072} fontWeight="600">{l}</text>;
                })}
              </g>

              {/* Needle */}
              <g ref={needleEl} style={{ transformOrigin: `${cx}px ${cx}px` }}>
                <polygon points={`${cx},${cx-R*0.52} ${cx+R*0.07},${cx-R*0.04} ${cx},${cx+R*0.06} ${cx-R*0.07},${cx-R*0.04}`} fill="#ef4444" />
                <polygon points={`${cx},${cx+R*0.52} ${cx+R*0.07},${cx+R*0.04} ${cx},${cx-R*0.06} ${cx-R*0.07},${cx+R*0.04}`} fill="#64748b" />
              </g>

              <circle cx={cx} cy={cx} r={R * 0.055} fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
              <circle cx={cx} cy={cx - R + 7} r={5} fill="#ef4444" />
            </svg>

            {/* Direction */}
            <p style={{ margin: 0, fontSize: 26, fontWeight: 900, color: 'white', textAlign: 'center', minHeight: 34 }}>
              {heading != null ? getLabel(needleAngle) : '—'}
            </p>

            {/* iOS permission */}
            {needPerm && (
              <button onClick={enable} style={{ width: '100%', maxWidth: 280, padding: '14px 0', background: '#4f46e5', border: 'none', borderRadius: 14, color: 'white', fontWeight: 900, fontSize: 15, cursor: 'pointer' }}>
                Enable Compass (iOS)
              </button>
            )}

            {error && <p style={{ fontSize: 12, color: '#f87171', fontWeight: 600, textAlign: 'center', margin: 0 }}>{error}</p>}

            {!stable && heading != null && (
              <div style={{ width: '100%', maxWidth: 280, padding: '12px 16px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 12 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: '#fbbf24' }}>∞ Calibration needed</p>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: '#92400e' }}>Hold phone flat and slowly trace a figure-8 in the air until the status turns green.</p>
              </div>
            )}

            <p style={{ margin: 0, fontSize: 10, color: '#1e293b', textAlign: 'center', maxWidth: 260 }}>
              Red needle → destination · Rotate phone until needle points up ↑
            </p>

            {/* Bottom buttons */}
            <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 280, paddingBottom: 4 }}>
              <button onClick={close} style={{ flex: 1, padding: '13px 0', background: '#1e293b', border: '1px solid #334155', borderRadius: 14, color: '#cbd5e1', fontWeight: 900, fontSize: 14, cursor: 'pointer' }}>↕ Shrink</button>
              <button onClick={close} style={{ flex: 1, padding: '13px 0', background: '#dc2626', border: 'none', borderRadius: 14, color: 'white', fontWeight: 900, fontSize: 14, cursor: 'pointer' }}>✕ Close</button>
            </div>

          </div>
        </div>
      , document.body)}
    </>
  );
}
