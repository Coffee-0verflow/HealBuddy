import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import MapControls from './MapControls';
import { getDistanceInKm } from '../logic/distance';

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const STATE_CENTERS = {
  'Jammu, Kashmir & Ladakh': [33.7, 76.5],
  'Delhi & NCR': [28.61, 77.21],
  'Punjab, Chandigarh & Himachal': [30.9, 76.5],
  'Uttarakhand': [30.1, 78.3],
  'Uttar Pradesh': [26.8, 80.9],
  'Bihar & Jharkhand': [24.5, 85.3],
  'Rajasthan': [26.9, 75.8],
  'Madhya Pradesh & Chhattisgarh': [23.2, 77.4],
  'Gujarat': [22.3, 72.6],
  'Maharashtra': [19.1, 75.7],
};

function StateZoomer({ selectedState }) {
  const map = useMap();
  useEffect(() => {
    if (selectedState === 'All States') {
      map.setView([20.5937, 78.9629], 5, { animate: true, duration: 1 });
    } else if (STATE_CENTERS[selectedState]) {
      map.setView(STATE_CENTERS[selectedState], 7, { animate: true, duration: 1 });
    }
  }, [selectedState, map]);
  return null;
}

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.setView([center.lat, center.lng], map.getZoom() || 13, { animate: true, duration: 1 });
    }
  }, [center, map]);
  return null;
}

function FacilityFocuser({ selectedFacility }) {
  const map = useMap();
  useEffect(() => {
    if (selectedFacility && selectedFacility.lat && selectedFacility.lng) {
      map.setView([selectedFacility.lat, selectedFacility.lng], 15, { animate: true, duration: 1.5 });
    }
  }, [selectedFacility, map]);
  return null;
}

function LocationPicker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
}

function RouteFitter({ routeCoords }) {
  const map = useMap();
  useEffect(() => {
    if (routeCoords && routeCoords.length > 1) {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [routeCoords, map]);
  return null;
}

export default function MapSection({
  userLocation,
  selectedState,
  processDoctors,
  routeCoords,
  showHospitals,
  filteredDoctors,
  showPharmacies,
  nearbyPharmacies,
  onLocate,
  handleNavigate,
  handlePharmacyNavigate,
  selectedFacility
}) {
  if (!userLocation) return null;

  return (
    <div className="w-full h-full relative z-0 bg-slate-900 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)] border border-slate-700/50">
      <MapContainer 
        center={[userLocation.lat, userLocation.lng]} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }} 
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* Dark map alternative (uncomment if dark theme base layer is preferred)
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='...'
        /> */}

        <StateZoomer selectedState={selectedState} />
        {selectedState === 'All States' && !selectedFacility && <MapUpdater center={userLocation} />}
        <FacilityFocuser selectedFacility={selectedFacility} />
        <LocationPicker onSelect={processDoctors} />
        
        {routeCoords && <RouteFitter routeCoords={routeCoords} />}
        {routeCoords && (
          <Polyline 
            positions={routeCoords} 
            pathOptions={{ 
              color: '#6366f1', 
              weight: 6, 
              opacity: 0.9, 
              lineCap: 'round',
              lineJoin: 'round',
              className: 'animate-pulse' 
            }} 
          />
        )}

        {/* User Location Marker */}
        <Marker 
          position={[userLocation.lat, userLocation.lng]} 
          zIndexOffset={1000} 
          icon={L.divIcon({
            html: `<div class="relative flex items-center justify-center w-8 h-8">
                     <div class="absolute w-full h-full bg-red-500 rounded-full animate-ping opacity-75"></div>
                     <div class="relative flex items-center justify-center w-8 h-8 bg-red-600 text-white border-2 border-white rounded-full shadow-[0_0_15px_rgba(220,38,38,0.8)] text-sm">📍</div>
                   </div>`,
            className: 'bg-transparent border-none', 
            iconSize: [32, 32], 
            iconAnchor: [16, 16]
          })}
        >
          <Popup className="custom-popup">
            <div className="text-center p-1">
              <span className="font-black text-red-600 dark:text-red-500">📍 You are here</span><br/>
              <span className="text-xs text-slate-500 font-medium">Tap anywhere to relocate</span>
            </div>
          </Popup>
        </Marker>

        {/* Hospital Markers */}
        {showHospitals && filteredDoctors.map(doc => {
          const isSelected = selectedFacility && selectedFacility.id === doc.id;
          return (
            <Marker 
              key={`doc-${doc.id}`} 
              position={[doc.lat, doc.lng]}
              zIndexOffset={isSelected ? 500 : 0}
              icon={L.divIcon({
                html: `<div class="transition-all duration-300 w-full h-full flex items-center justify-center rounded-full 
                  ${isSelected ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,1)] scale-125 animate-bounce border-2 border-white' : 'bg-white text-indigo-600 shadow-md border-2 border-indigo-500 hover:scale-110 hover:shadow-[0_0_10px_rgba(99,102,241,0.6)]'}">
                  🏥
                </div>`,
                className: 'bg-transparent border-none',
                iconSize: [32, 32], 
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
              })}
            >
              <Popup>
                <div className="min-w-[150px] p-1">
                  <span className="font-black text-indigo-700 text-sm tracking-tight">{doc.name}</span><br/>
                  <span className="text-xs font-bold text-slate-600">{getDistanceInKm(userLocation.lat, userLocation.lng, doc.lat, doc.lng).toFixed(1)} km • ⭐ {doc.rating}</span><br/>
                  <span className="text-[10px] uppercase font-bold text-slate-400 mt-1 block">{doc.specialty}</span>
                  {doc.phone && (
                    <a href={`tel:${doc.phone.replace(/ /g,'')}`} className="mt-2 block text-center w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] py-1.5 rounded-lg transition-colors">
                      📞 Call
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Pharmacy Markers */}
        {showPharmacies && nearbyPharmacies.map((p, i) => {
          const isSelected = selectedFacility && selectedFacility.id === p.id;
          return (
            <Marker 
              key={`pharmacy-${p.id}`} 
              position={[p.lat, p.lng]} 
              zIndexOffset={isSelected ? 500 : 0}
              icon={L.divIcon({
                html: `<div class="transition-all duration-300 w-full h-full flex items-center justify-center rounded-full 
                  ${isSelected ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,1)] scale-125 animate-bounce border-2 border-white' : 'bg-emerald-100 text-emerald-700 shadow-md border-2 border-emerald-500 hover:scale-110 hover:shadow-[0_0_10px_rgba(16,185,129,0.5)]'}">
                  💊
                </div>`,
                className: 'bg-transparent border-none', 
                iconSize: [28, 28], 
                iconAnchor: [14, 28],
                popupAnchor: [0, -28]
              })}
            >
              <Popup>
                <div className="min-w-[150px] p-1">
                  <span className="font-black text-emerald-700 text-sm tracking-tight">{p.name}</span><br/>
                  <span className="text-xs font-bold text-slate-600">{p.distance.toFixed(1)} km • ⭐ {p.rating}</span><br/>
                  <span className={`text-[10px] font-black uppercase mt-1 inline-block px-1.5 py-0.5 rounded ${p.open24x7 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {p.open24x7 ? '🟢 24×7' : '⏰ Check Hours'}
                  </span>
                  {p.phone && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handlePharmacyNavigate(p); }} 
                      className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-lg text-[11px] font-bold transition-colors shadow-sm"
                    >
                      🧭 Navigate
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapControls onLocate={onLocate} />
      </MapContainer>
    </div>
  );
}
