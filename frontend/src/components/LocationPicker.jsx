import { useEffect, useRef, useState } from 'react';
import { cities } from '../data/emergencyPhrases';

// City center coordinates
const CITY_COORDS = {
  manali:   [32.2396, 77.1887],
  jaipur:   [26.9124, 75.7873],
  varanasi: [25.2677, 82.9913],
  goa:      [15.4909, 73.8278],
  rishikesh:[30.1290, 78.3098],
  mumbai:   [19.0760, 72.8777],
  delhi:    [28.6139, 77.2090],
  spiti:    [32.2270, 78.0720],
};

export default function LocationPicker({ selectedCity, onSelectCity, onClose }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [pickedCity, setPickedCity] = useState(selectedCity || '');
  const [pickedCoords, setPickedCoords] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    // Dynamically import leaflet to avoid SSR issues
    import('leaflet').then(L => {
      // Fix default icon paths
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const initialCoords = selectedCity && CITY_COORDS[selectedCity]
        ? CITY_COORDS[selectedCity]
        : [22.5, 80.0]; // center of India

      const map = L.map(mapRef.current, { zoomControl: true }).setView(initialCoords, selectedCity ? 12 : 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      // Add city markers
      cities.forEach(city => {
        const coords = CITY_COORDS[city.id];
        if (!coords) return;
        const isSelected = city.id === selectedCity;
        const circle = L.circleMarker(coords, {
          radius: isSelected ? 10 : 7,
          fillColor: isSelected ? '#2563eb' : '#64748b',
          color: '#fff',
          weight: 2,
          fillOpacity: 0.9,
        }).addTo(map);
        circle.bindTooltip(city.label, { permanent: false, direction: 'top' });
        circle.on('click', () => {
          setPickedCity(city.id);
          setPickedCoords(coords);
          if (markerRef.current) markerRef.current.remove();
          markerRef.current = L.marker(coords).addTo(map)
            .bindPopup(`<b>${city.label}</b><br/>${city.state}`).openPopup();
        });
      });

      // Click anywhere to pick custom location
      map.on('click', e => {
        const { lat, lng } = e.latlng;
        setPickedCoords([lat, lng]);
        setPickedCity('');
        if (markerRef.current) markerRef.current.remove();
        markerRef.current = L.marker([lat, lng]).addTo(map)
          .bindPopup(`📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`).openPopup();
      });

      // If city already selected, place marker
      if (selectedCity && CITY_COORDS[selectedCity]) {
        markerRef.current = L.marker(CITY_COORDS[selectedCity]).addTo(map)
          .bindPopup(cities.find(c => c.id === selectedCity)?.label || '').openPopup();
      }

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  function handleConfirm() {
    if (pickedCity) onSelectCity(pickedCity);
    onClose();
  }

  function handleDownloadHint() {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 2000);
    alert('Offline map download: In a production build, tiles for the selected area would be cached via the service worker. For now, tiles are cached automatically as you browse the map.');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>📍 Select Location</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Click a city marker or tap anywhere on the map
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-lg"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>✕</button>
        </div>

        {/* Map */}
        <div ref={mapRef} style={{ height: 380, width: '100%' }} />

        {/* Footer */}
        <div className="px-5 py-4 flex items-center justify-between gap-3 flex-wrap"
          style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {pickedCity
              ? <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  ✅ {cities.find(c => c.id === pickedCity)?.label}
                </span>
              : pickedCoords
              ? <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  📍 {pickedCoords[0].toFixed(4)}, {pickedCoords[1].toFixed(4)}
                </span>
              : <span className="text-sm" style={{ color: 'var(--text-muted)' }}>No location selected</span>
            }
          </div>
          <div className="flex gap-2">
            <button onClick={handleDownloadHint}
              className="px-3 py-2 rounded-xl text-xs font-medium"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
              {downloading ? '⏳ Caching…' : '⬇️ Save Offline'}
            </button>
            <button onClick={handleConfirm} disabled={!pickedCity}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
              style={{ background: pickedCity ? '#2563eb' : '#94a3b8', cursor: pickedCity ? 'pointer' : 'not-allowed' }}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
