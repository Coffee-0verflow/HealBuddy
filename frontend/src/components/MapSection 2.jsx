import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import MapControls from './MapControls';
import { getDistanceInKm } from '../logic/distance';

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
      map.setView([20.5937, 78.9629], 5, { animate: true });
    } else if (STATE_CENTERS[selectedState]) {
      map.setView(STATE_CENTERS[selectedState], 7, { animate: true });
    }
  }, [selectedState, map]);
  return null;
}

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom() || 13, { animate: true, duration: 1 });
  }, [center, map]);
  return null;
}

function LocationPickerEvents({ onSelect }) {
  useMapEvents({
    click(e) {
      if (onSelect) onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
}

function RouteFitter({ routeCoords }) {
  const map = useMap();
  useEffect(() => {
    if (routeCoords && routeCoords.length > 1) {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1 });
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
  handlePharmacyNavigate
}) {
  return (
    <div className="w-full h-[50vh] md:h-full relative z-0 md:border-r border-slate-800 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] isolation-auto">
      <MapContainer 
        center={[userLocation.lat, userLocation.lng]} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }} 
        zoomControl={false}
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" className="map-tiles" />
        
        {/* Dark mode filter for map tiles via CSS class */}
        <style>{`
          .leaflet-layer,
          .leaflet-control-zoom-in,
          .leaflet-control-zoom-out,
          .leaflet-control-attribution {
            filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
          }
        `}</style>

        <StateZoomer selectedState={selectedState} />
        {selectedState === 'All States' && <MapUpdater center={[userLocation.lat, userLocation.lng]} />}
        <LocationPickerEvents onSelect={processDoctors} />
        {routeCoords && <RouteFitter routeCoords={routeCoords} />}
        {routeCoords && <Polyline positions={routeCoords} pathOptions={{ color: '#6366f1', weight: 6, opacity: 0.9, dashArray: '10, 10' }} />}

        {/* User Location Marker */}
        <Marker position={[userLocation.lat, userLocation.lng]} zIndexOffset={1000} icon={L.divIcon({
          html: `<div style="background:#ef4444;color:#fff;border:3px solid #fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 0 15px rgba(239, 68, 68, 0.8);">📍</div>`,
          className: 'animate-pulse', iconSize: [36, 36], iconAnchor: [18, 18]
        })}>
          <Popup className="dark-popup">
            <span className="font-bold text-red-500">📍 You are here</span><br/>
            <span className="text-xs text-slate-400">Tap anywhere to relocate</span>
          </Popup>
        </Marker>

        {showHospitals && filteredDoctors.map(doc => (
          <Marker key={doc.id} position={[doc.lat, doc.lng]} icon={L.divIcon({
            html: `<div style="background:#6366f1;color:#fff;border:2px solid #fff;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 0 10px rgba(99, 102, 241, 0.6); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">🏥</div>`,
            className: '', iconSize: [30, 30], iconAnchor: [15, 15]
          })}>
            <Popup className="dark-popup">
              <div style={{ minWidth: '150px' }}>
                <span className="font-bold text-indigo-400">{doc.name}</span><br/>
                <span className="text-xs text-slate-300">{getDistanceInKm(userLocation.lat, userLocation.lng, doc.lat, doc.lng).toFixed(1)} km • ⭐ {doc.rating}</span><br/>
                <span className="text-xs text-slate-500">{doc.specialty}</span><br/>
                {doc.phone && <a href={`tel:${doc.phone.replace(/ /g,'')}`} style={{color:'#818cf8',fontWeight:'bold',fontSize:'11px', marginTop:'4px', display:'inline-block'}}>📞 Call</a>}
              </div>
            </Popup>
          </Marker>
        ))}

        {showPharmacies && nearbyPharmacies.map((p, i) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={L.divIcon({
            html: `<div style="background:#10b981;color:#fff;border:2px solid #fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 0 10px rgba(16, 185, 129, 0.6);cursor:pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">💊</div>`,
            className: '', iconSize: [28, 28], iconAnchor: [14, 14]
          })}>
            <Popup className="dark-popup">
              <div style={{ minWidth: '150px' }}>
                <span style={{fontWeight:900,color:'#34d399',fontSize:14}}>💊 {p.name}</span><br/>
                <span style={{fontSize:11, color:'#cbd5e1'}}>{p.distance.toFixed(1)} km • ⭐ {p.rating}</span><br/>
                <span style={{fontSize:11,color:'#94a3b8'}}>{p.open24x7 ? '🟢 Open 24×7' : '⏰ Check Hours'}</span><br/>
                {i === 0 && <span style={{fontSize:10,fontWeight:900,color:'#059669',background:'#d1fae5',padding:'2px 8px',borderRadius:99,display:'inline-block',marginTop:4}}>Closest</span>}<br/>
                <button onClick={() => handlePharmacyNavigate(p)} style={{marginTop:8,width:'100%',padding:'6px 0',background:'#10b981',color:'#fff',border:'none',borderRadius:8,fontSize:12,fontWeight:900,cursor:'pointer',boxShadow:'0 0 10px rgba(16,185,129,0.3)'}}>🧭 Navigate</button>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Render MapControls inside MapContainer so useMap() works */}
        <MapControls 
          onLocate={() => {
            navigator.geolocation.getCurrentPosition((pos) => {
               processDoctors({lat: pos.coords.latitude, lng: pos.coords.longitude});
            });
          }}
        />

      </MapContainer>
      
      {/* CSS for custom popups in dark mode */}
      <style>{`
        .dark-popup .leaflet-popup-content-wrapper, .dark-popup .leaflet-popup-tip {
          background-color: rgba(15, 23, 42, 0.95) !important; /* slate-900 */
          color: #f1f5f9 !important; /* slate-100 */
          backdrop-filter: blur(8px);
          border: 1px solid rgba(99, 102, 241, 0.3);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(99, 102, 241, 0.2);
        }
      `}</style>
    </div>
  );
}
