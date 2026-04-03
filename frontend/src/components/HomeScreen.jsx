import { useState } from 'react';
import { symptomRules } from '../data/symptomRules';
import { cities } from '../data/emergencyPhrases';
import LocationPicker from './LocationPicker';

export default function HomeScreen({ onSelectSymptom, onSelectCity, selectedCity, onNavigate }) {
  const [search, setSearch] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const filtered = search.trim()
    ? symptomRules.filter(s => s.label.toLowerCase().includes(search.toLowerCase()))
    : symptomRules;

  return (
    <div className="space-y-6 pb-10">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 text-white shadow-xl"
        style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #4338ca 100%)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.05)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.05)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">🩺</span>
              <span className="text-xs font-semibold tracking-widest uppercase opacity-75">HealBuddy</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-2">
              Health help,<br className="hidden md:block" /> wherever you are.
            </h1>
            <p className="text-sm md:text-base mb-5 max-w-sm" style={{ opacity: 0.82 }}>
              Offline-first emergency decision support for Indian travelers. Works without internet.
            </p>
            <div className="flex flex-wrap gap-2">
              <a href="tel:112" className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-md"
                style={{ background: 'rgba(220,38,38,0.9)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(185,28,28,0.95)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(220,38,38,0.9)'}>
                📞 Call 112
              </a>
              <a href="tel:108" className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-md"
                style={{ background: 'rgba(234,88,12,0.9)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(194,65,12,0.95)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(234,88,12,0.9)'}>
                🚑 Call 108
              </a>
              <button onClick={() => onNavigate('firstaid')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.18)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}>
                🩹 First Aid
              </button>
            </div>
          </div>

          {/* Location card */}
          <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ opacity: 0.75 }}>Your Location</p>
            <button
              onClick={() => setShowPicker(true)}
              className="flex items-center gap-2 w-full rounded-xl px-3 py-2.5 text-left transition-all"
              style={{ background: 'rgba(255,255,255,0.2)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              <span className="text-base">📍</span>
              <span className="text-sm font-medium text-white flex-1">
                {selectedCity ? cities.find(c => c.id === selectedCity)?.label + ', ' + cities.find(c => c.id === selectedCity)?.state : 'Select on map…'}
              </span>
              <span className="text-xs text-white opacity-70">🗺</span>
            </button>
            {selectedCity
              ? <p className="text-xs" style={{ opacity: 0.8 }}>✅ Location set — nearby care options are ready.</p>
              : <p className="text-xs" style={{ opacity: 0.65 }}>Tap to open map and select your city.</p>
            }
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button onClick={() => onNavigate('nearby')}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors"
                style={{ background: 'rgba(255,255,255,0.2)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}>
                📍 Nearby Care
              </button>
              <button onClick={() => onNavigate('phrases')}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors"
                style={{ background: 'rgba(255,255,255,0.2)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}>
                🗣️ Phrases
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Symptom picker + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Symptom picker */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              What's happening?
            </p>
            {search && (
              <button onClick={() => setSearch('')} className="text-xs text-blue-500 hover:text-blue-700">Clear</button>
            )}
          </div>

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none" style={{ color: 'var(--text-muted)' }}>🔍</span>
            <input
              type="text"
              placeholder="Search symptom or condition…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition shadow-sm"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
              <p className="text-3xl mb-2">🔍</p>
              No matching symptoms. Try a different keyword.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
              {filtered.map(s => (
                <button
                  key={s.id}
                  onClick={() => onSelectSymptom(s.id)}
                  className="flex items-center gap-2.5 p-3.5 rounded-xl text-left transition-all active:scale-95 hover:shadow-md"
                  style={{
                    background: s.category === 'emergency' ? 'var(--emergency-bg, #fff1f2)' : 'var(--bg-surface)',
                    border: s.category === 'emergency' ? '1px solid #fecdd3' : '1px solid var(--border)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = s.category === 'emergency' ? '#f43f5e' : '#93c5fd';
                    e.currentTarget.style.background = s.category === 'emergency' ? '#ffe4e6' : 'var(--bg-elevated)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = s.category === 'emergency' ? '#fecdd3' : 'var(--border)';
                    e.currentTarget.style.background = s.category === 'emergency' ? 'var(--emergency-bg, #fff1f2)' : 'var(--bg-surface)';
                  }}
                >
                  <span className="text-2xl flex-shrink-0">{s.icon}</span>
                  <span className="text-sm font-medium leading-tight"
                    style={{ color: s.category === 'emergency' ? '#be123c' : 'var(--text-primary)' }}>
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Quick Access</p>
          <div className="space-y-2">
            {[
              { id: 'firstaid', icon: '🩹', label: 'First Aid Guides',  desc: 'Offline step-by-step help' },
              { id: 'nearby',   icon: '📍', label: 'Nearby Care',       desc: 'Hospitals, clinics, pharmacies' },
              { id: 'phrases',  icon: '🗣️', label: 'Language Phrases',  desc: '6 Indian languages' },
              { id: 'demo',     icon: '🎬', label: 'Demo Scenarios',    desc: 'Try 6 real-world cases' },
              { id: 'eval',     icon: '📋', label: 'About HealBuddy',   desc: 'Product brief & roadmap' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex items-center gap-3 w-full p-3.5 rounded-xl text-left transition-all active:scale-95"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.borderColor = '#93c5fd'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
                <span className="flex-shrink-0 text-sm" style={{ color: 'var(--text-muted)' }}>›</span>
              </button>
            ))}
          </div>

          <div className="rounded-xl p-3" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
            <p className="text-xs text-amber-700 leading-relaxed">
              ⚠️ HealBuddy provides guidance, not diagnosis. Always seek professional medical care for serious symptoms.
            </p>
          </div>
        </div>
      </div>

      {showPicker && (
        <LocationPicker
          selectedCity={selectedCity}
          onSelectCity={onSelectCity}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
