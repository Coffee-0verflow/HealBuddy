import { useState, useEffect, useRef, useCallback } from 'react';
import { facilities } from '../data/facilities';
import { getRecommendations } from '../logic/recommendationEngine';
import { TrustBadge, CostBadge, FacilityTypeLabel } from './Badges';
import { cities } from '../data/emergencyPhrases';

let leafletCSSInjected = false;
function injectLeafletCSS() {
  if (leafletCSSInjected) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);
  leafletCSSInjected = true;
}

const TYPE_COLOR = {
  govt_hospital:    '#16a34a',
  private_hospital: '#2563eb',
  clinic:           '#f59e0b',
  pharmacy:         '#8b5cf6',
};
const TYPE_ICON = {
  govt_hospital:    '🏥',
  private_hospital: '🏨',
  clinic:           '🩺',
  pharmacy:         '💊',
};

function navigate(facility) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}&destination_place_id=${encodeURIComponent(facility.name)}`;
  window.open(url, '_blank', 'noopener');
}

function FacilityCard({ facility, rank, isSelected, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const costStr = facility.costConsultation
    ? `₹${facility.costConsultation[0]}–${facility.costConsultation[1]}`
    : 'No consultation fee';

  return (
    <div
      onClick={() => onSelect(facility)}
      className="rounded-2xl overflow-hidden transition-all hover:shadow-lg cursor-pointer"
      style={{
        background: 'var(--bg-surface)',
        border: isSelected ? '2px solid #2563eb' : rank === 0 ? '2px solid #2563eb' : '1px solid var(--border)',
        boxShadow: isSelected ? '0 0 0 3px rgba(37,99,235,0.2)' : rank === 0 ? '0 0 0 3px rgba(37,99,235,0.1)' : undefined,
      }}>
      {rank === 0 && !isSelected && (
        <div className="px-3 py-1.5 text-xs font-semibold text-white flex items-center gap-1.5"
          style={{ background: '#2563eb' }}>
          ⭐ Top Recommendation
        </div>
      )}
      {isSelected && (
        <div className="px-3 py-1.5 text-xs font-semibold text-white flex items-center gap-1.5"
          style={{ background: '#2563eb' }}>
          📍 Selected on Map
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <FacilityTypeLabel type={facility.type} />
            <h3 className="text-sm font-bold mt-0.5 leading-tight" style={{ color: 'var(--text-primary)' }}>{facility.name}</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{facility.area}, {facility.city}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{facility.distance} km</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{facility.travelMin} min away</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <CostBadge badge={facility.costBadge} />
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{costStr} consult</span>
          {facility.openNow
            ? <span className="text-xs font-medium" style={{ color: '#16a34a' }}>● Open Now</span>
            : <span className="text-xs font-medium" style={{ color: '#dc2626' }}>● Closed</span>
          }
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {facility.tags.map(tag => <TrustBadge key={tag} tag={tag} />)}
          {facility.femaleDoctorAvailable && <TrustBadge tag="female_doctor" />}
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>🗣️</span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{facility.languages.join(' · ')}</span>
        </div>

        <div className="rounded-xl p-3 mb-3" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <p className="text-xs text-blue-700 leading-relaxed">
            <span className="font-semibold">Why recommended: </span>{facility.whyRecommended}
          </p>
        </div>

        <div className="flex gap-2">
          {facility.phone && (
            <a href={`tel:${facility.phone}`}
              onClick={e => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white"
              style={{ background: '#2563eb' }}>
              📞 Call
            </a>
          )}
          <button
            onClick={e => { e.stopPropagation(); navigate(facility); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white"
            style={{ background: '#16a34a' }}>
            🗺 Navigate
          </button>
          <button onClick={e => { e.stopPropagation(); setExpanded(!expanded); }}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            {expanded ? '↑' : '↓'}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
            {facility.costEmergency && (
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-muted)' }}>Emergency fee</span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>₹{facility.costEmergency[0]}–{facility.costEmergency[1]}</span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-muted)' }}>Digital payment</span>
              <span className="font-medium" style={{ color: facility.digitalPayment ? '#16a34a' : 'var(--text-muted)' }}>
                {facility.digitalPayment ? 'Yes (UPI / Card)' : 'Cash only'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-muted)' }}>Tourist friendly</span>
              <span className="font-medium" style={{ color: facility.touristFriendly ? '#16a34a' : 'var(--text-muted)' }}>
                {facility.touristFriendly ? 'Yes' : 'Not specifically'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-muted)' }}>Specialties</span>
              <span className="font-medium text-right" style={{ color: 'var(--text-primary)' }}>
                {facility.specialties.join(', ')}
              </span>
            </div>
            <p className="text-xs italic pt-1" style={{ color: 'var(--text-muted)' }}>
              Prices are estimates. Actual costs may vary.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function NearbyMap({ allFacilities, selectedFacility, onSelectFacility, onBoundsChange }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  const buildPopupHTML = (f) => `
    <div style="min-width:200px;font-family:system-ui,sans-serif;padding:2px">
      <p style="font-weight:700;font-size:13px;margin:0 0 3px">${f.name}</p>
      <p style="font-size:11px;color:#64748b;margin:0 0 4px">${f.area}, ${f.city}</p>
      <p style="font-size:11px;margin:0 0 2px">${f.openNow ? '🟢 Open Now' : '🔴 Closed'}</p>
      <p style="font-size:11px;margin:0 0 6px">📏 ${f.distance} km · ${f.travelMin} min</p>
      <div style="display:flex;gap:6px">
        ${f.phone ? `<a href="tel:${f.phone}" style="flex:1;text-align:center;padding:6px 0;background:#2563eb;color:#fff;border-radius:8px;font-size:11px;font-weight:600;text-decoration:none">📞 Call</a>` : ''}
        <a href="https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}" target="_blank" rel="noopener"
          style="flex:1;text-align:center;padding:6px 0;background:#16a34a;color:#fff;border-radius:8px;font-size:11px;font-weight:600;text-decoration:none">
          🗺 Navigate
        </a>
      </div>
    </div>
  `;

  useEffect(() => {
    injectLeafletCSS();
    if (mapInstanceRef.current || !allFacilities.length) return;

    import('leaflet').then(L => {
      delete L.Icon.Default.prototype._getIconUrl;

      // Center on India
      const map = L.map(mapRef.current, { zoomControl: true }).setView([20.5937, 78.9629], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      allFacilities.forEach(f => {
        const color = TYPE_COLOR[f.type] || '#64748b';
        const icon = TYPE_ICON[f.type] || '🏥';

        const divIcon = L.divIcon({
          html: `<div style="
            background:${color};color:#fff;border:2px solid #fff;
            border-radius:50%;width:32px;height:32px;
            display:flex;align-items:center;justify-content:center;
            font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;
          ">${icon}</div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([f.lat, f.lng], { icon: divIcon }).addTo(map);
        marker.bindPopup(buildPopupHTML(f), { maxWidth: 240 });
        marker.on('click', () => onSelectFacility(f));
        markersRef.current[f.id] = marker;
      });

      // Fire initial bounds
      const fireBounds = () => {
        const b = map.getBounds();
        onBoundsChange({
          minLat: b.getSouth(), maxLat: b.getNorth(),
          minLng: b.getWest(),  maxLng: b.getEast(),
        });
      };

      map.on('moveend zoomend', fireBounds);
      fireBounds();

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = {};
      }
    };
  }, []);

  // Pan + open popup when a facility is selected from the list
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedFacility) return;
    mapInstanceRef.current.setView([selectedFacility.lat, selectedFacility.lng], 14, { animate: true });
    const marker = markersRef.current[selectedFacility.id];
    if (marker) marker.openPopup();
  }, [selectedFacility?.id]);

  return (
    <div ref={mapRef}
      style={{ height: 420, width: '100%', borderRadius: '0 0 1rem 1rem', zIndex: 0 }} />
  );
}

export default function NearbyOptions({ city, urgency = 'clinic', specialties = [], onSelectCity }) {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [bounds, setBounds] = useState(null);

  const cityObj = cities.find(c => c.id === city);
  const recommendations = city ? getRecommendations(cityObj?.label || city, urgency, specialties, 10) : [];

  // Facilities visible in current map bounds
  const visibleFacilities = bounds
    ? facilities.filter(f =>
        f.lat >= bounds.minLat && f.lat <= bounds.maxLat &&
        f.lng >= bounds.minLng && f.lng <= bounds.maxLng
      )
    : facilities;

  const handleBoundsChange = useCallback((b) => setBounds(b), []);

  useEffect(() => { setSelectedFacility(null); }, [city]);

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Nearby Care</p>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {cityObj ? `${cityObj.label}, ${cityObj.state}` : 'All India Map'}
          </h2>
        </div>
        {onSelectCity && (
          <div className="flex items-center gap-2 rounded-xl px-3 py-2 shadow-sm"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <span className="text-sm">📍</span>
            <select
              value={city}
              onChange={e => onSelectCity(e.target.value)}
              className="text-sm outline-none cursor-pointer bg-transparent"
              style={{ color: 'var(--text-primary)' }}>
              <option value="">All India</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Always-visible map */}
      <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="px-4 pt-3 pb-2 flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            🔍 Zoom in to see hospitals in any region · Click a marker for details
          </p>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(TYPE_COLOR).map(([type, color]) => (
              <span key={type} className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
                {type.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
        <NearbyMap
          allFacilities={facilities}
          selectedFacility={selectedFacility}
          onSelectFacility={setSelectedFacility}
          onBoundsChange={handleBoundsChange}
        />
      </div>

      {/* Bounds info */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          {bounds ? `Showing ${visibleFacilities.length} facilities in current map view` : 'All facilities'}
        </p>
        {city && recommendations.length > 0 && (
          <span className="text-xs px-2 py-1 rounded-lg font-medium"
            style={{ background: '#eff6ff', color: '#2563eb' }}>
            ⭐ {recommendations.length} recommended for {cityObj?.label}
          </span>
        )}
      </div>

      {/* Selected facility highlight */}
      {selectedFacility && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Selected Facility
          </p>
          <FacilityCard
            facility={selectedFacility}
            rank={recommendations.findIndex(f => f.id === selectedFacility.id)}
            isSelected
            onSelect={() => {}}
          />
        </div>
      )}

      {/* Facilities in map view */}
      {visibleFacilities.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            In This Area ({visibleFacilities.length})
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {visibleFacilities.map((f, i) => (
              <FacilityCard
                key={f.id}
                facility={f}
                rank={recommendations.findIndex(r => r.id === f.id)}
                isSelected={selectedFacility?.id === f.id}
                onSelect={setSelectedFacility}
              />
            ))}
          </div>
        </div>
      )}

      {visibleFacilities.length === 0 && (
        <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-sm">No facilities in this map area. Zoom out or pan to find hospitals.</p>
        </div>
      )}

      <p className="text-xs text-center px-4" style={{ color: 'var(--text-muted)' }}>
        Facility data is preloaded for offline use. Verify details before visiting.
      </p>
    </div>
  );
}
