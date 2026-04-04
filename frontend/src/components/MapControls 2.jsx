import { useMap } from 'react-leaflet';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function MapControls({ onLocate }) {
  const map = useMap();

  return (
    <div className="absolute right-4 bottom-4 z-[1000] flex flex-col gap-3 pointer-events-auto">
      <motion.button 
        whileHover={{ scale: 1.1, boxShadow: '0 0 20px 2px rgba(99, 102, 241, 0.8)' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          if (onLocate) onLocate();
        }}
        className="w-12 h-12 bg-slate-900/90 backdrop-blur-lg rounded-full flex items-center justify-center text-indigo-400 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all cursor-pointer"
        title="Locate Me"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </motion.button>
      
      <div className="flex flex-col rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.5)] border border-cyan-500/50">
        <motion.button 
          whileHover={{ backgroundColor: 'rgba(6,182,212,0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => map.zoomIn()}
          className="w-12 h-12 bg-slate-900/90 backdrop-blur-lg flex items-center justify-center text-cyan-400 font-bold text-2xl border-b border-cyan-500/30 transition-colors cursor-pointer"
          title="Zoom In"
        >
          +
        </motion.button>
        <motion.button 
          whileHover={{ backgroundColor: 'rgba(6,182,212,0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => map.zoomOut()}
          className="w-12 h-12 bg-slate-900/90 backdrop-blur-lg flex items-center justify-center text-cyan-400 font-bold text-3xl leading-none transition-colors cursor-pointer pb-1"
          title="Zoom Out"
        >
          -
        </motion.button>
      </div>
    </div>
  );
}
