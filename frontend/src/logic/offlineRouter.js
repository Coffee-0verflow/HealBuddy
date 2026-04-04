// Pure offline router — works with zero internet, zero map download
// Generates compass directions from two lat/lng points

const R = 6371; // Earth radius km

function toRad(deg) { return deg * Math.PI / 180; }
function toDeg(rad) { return rad * 180 / Math.PI; }

function haversine(lat1, lng1, lat2, lng2) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function bearing(lat1, lng1, lat2, lng2) {
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function compassLabel(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

function compassFull(deg) {
  const dirs = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
  return dirs[Math.round(deg / 45) % 8];
}

// Interpolate N intermediate waypoints along great-circle path
function interpolate(lat1, lng1, lat2, lng2, steps = 8) {
  const points = [[lat1, lng1]];
  for (let i = 1; i < steps; i++) {
    const f = i / steps;
    const lat = lat1 + (lat2 - lat1) * f;
    const lng = lng1 + (lng2 - lng1) * f;
    points.push([lat, lng]);
  }
  points.push([lat2, lng2]);
  return points;
}

/**
 * Generate offline route data from user location to destination.
 * Returns:
 *   coords      — array of [lat, lng] for drawing polyline
 *   steps       — array of text direction steps
 *   distance    — total distance in km (string)
 *   duration    — estimated minutes (string)
 *   bearing     — initial compass bearing degrees
 *   compassDir  — e.g. "North-East"
 */
export function offlineRoute(userLat, userLng, destLat, destLng, destName) {
  const distKm = haversine(userLat, userLng, destLat, destLng);
  const initialBearing = bearing(userLat, userLng, destLat, destLng);
  const dir = compassFull(initialBearing);
  const shortDir = compassLabel(initialBearing);

  // Assume avg 30 km/h in city (conservative for emergency)
  const durationMin = Math.ceil(distKm / 30 * 60);

  // Generate smooth polyline with 12 interpolated points
  const coords = interpolate(userLat, userLng, destLat, destLng, 12);

  // Build human-readable steps
  const steps = [];

  if (distKm < 0.5) {
    steps.push({ icon: '📍', text: `Head ${dir} — destination is ${(distKm * 1000).toFixed(0)}m away` });
    steps.push({ icon: '🏁', text: `Arrive at ${destName}` });
  } else {
    steps.push({ icon: '🧭', text: `Head ${dir} (${shortDir}) from your location` });

    // Mid-point check — if route bends significantly, add a waypoint instruction
    const midLat = (userLat + destLat) / 2;
    const midLng = (userLng + destLng) / 2;
    const midBearing = bearing(midLat, midLng, destLat, destLng);
    const bearingDiff = Math.abs(midBearing - initialBearing);

    if (bearingDiff > 30) {
      const halfDist = (distKm / 2).toFixed(1);
      steps.push({ icon: '↩️', text: `After ~${halfDist} km, turn towards ${compassFull(midBearing)}` });
    } else {
      steps.push({ icon: '⬆️', text: `Continue ${dir} for ~${distKm.toFixed(1)} km` });
    }

    steps.push({ icon: '📍', text: `${destName} will be on your ${initialBearing < 180 ? 'right' : 'left'} side` });
    steps.push({ icon: '🏁', text: `Arrive at ${destName} — ${distKm.toFixed(1)} km total` });
  }

  return {
    coords,
    steps,
    distance: distKm.toFixed(1),
    duration: String(durationMin),
    bearingDeg: Math.round(initialBearing),
    compassDir: dir,
    offline: true,
  };
}
