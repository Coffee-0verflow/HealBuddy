import React from 'react';
import { useMap } from 'react-leaflet';

export default function MapControls({ onLocate }) {
  const map = useMap();

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();

  return (
    <div className="absolute right-4 bottom-6 z-[1000] flex flex-col gap-4">
      {/* Locate Me */}
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onLocate && onLocate(); }}
        className="w-12 h-12 bg-slate-900/80 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-indigo-500/60 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.7)] active:scale-95 hover:scale-105 hover:bg-indigo-900/60 transition-all group"
        title="Locate Me"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400 group-hover:text-indigo-300 transition-colors">
          <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
        </svg>
      </button>

    </div>
  );
}
