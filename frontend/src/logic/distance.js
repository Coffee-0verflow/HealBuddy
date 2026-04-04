// Haversine formula to calculate distance between two lat/lng coordinates in km
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export function getDistanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

// Wrapping Geolocation API in a Promise
// Tries high accuracy first, falls back to low accuracy on timeout/unavailable
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('UNSUPPORTED'));
      return;
    }

    const tryGet = (highAccuracy, timeoutMs) =>
      new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, {
          enableHighAccuracy: highAccuracy,
          timeout: timeoutMs,
          maximumAge: 0,          // never use stale cache for SOS
        })
      );

    // First attempt: high accuracy (GPS), 10s
    tryGet(true, 10000)
      .then(pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }))
      .catch(() => {
        // Second attempt: network/wifi location, 10s
        tryGet(false, 10000)
          .then(pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }))
          .catch(err => reject(err));
      });
  });
}
