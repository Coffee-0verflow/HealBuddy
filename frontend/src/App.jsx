import { useState, useEffect } from 'react';
import OfflineBanner from './components/OfflineBanner';
import HomeScreen from './components/HomeScreen';
import SymptomFlow from './components/SymptomFlow';
import NearbyOptions from './components/NearbyOptions';
import FirstAid from './components/FirstAid';
import PhraseCards from './components/PhraseCards';
import DemoMode from './components/DemoMode';
import EvalMode from './components/EvalMode';
import { cities } from './data/emergencyPhrases';
import { runTriage } from './logic/triageEngine';

const NAV = [
  { id: 'home',     icon: '🏠', label: 'Home' },
  { id: 'nearby',   icon: '📍', label: 'Nearby Care' },
  { id: 'firstaid', icon: '🩹', label: 'First Aid' },
  { id: 'phrases',  icon: '🗣️', label: 'Phrases' },
  { id: 'demo',     icon: '🎬', label: 'Demo' },
  { id: 'eval',     icon: '📋', label: 'About' },
];

export default function App() {
  const [screen, setScreen]           = useState('home');
  const [activeSymptom, setActiveSymptom] = useState(null);
  const [triageResult, setTriageResult]   = useState(null);
  const [selectedCity, setSelectedCity]   = useState('');
  const [calmMode, setCalmMode]           = useState(false);

  // Dark mode: read from localStorage first, then system preference
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('hb-dark');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark class to <html> — this is what Tailwind v4 @variant dark reads
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('hb-dark', String(darkMode));
  }, [darkMode]);

  // Apply calm mode to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('calm', calmMode);
  }, [calmMode]);

  const isHomeGroup = ['home', 'triage', 'triage_result'].includes(screen);

  function navigate(id) { setScreen(id); }

  function handleSelectSymptom(id) {
    setActiveSymptom(id);
    setTriageResult(null);
    setScreen('triage');
  }

  function handleRunScenario(scenario) {
    const cityObj = cities.find(c => c.label.toLowerCase() === scenario.city.toLowerCase());
    if (cityObj) setSelectedCity(cityObj.id);
    setActiveSymptom(scenario.symptomId);
    const result = runTriage(scenario.symptomId, scenario.answers);
    setTriageResult(result);
    setScreen('triage_result');
  }

  const sharedProps = {
    screen, activeSymptom, triageResult, selectedCity,
    onSelectSymptom: handleSelectSymptom,
    onSelectCity: setSelectedCity,
    onTriageResult: setTriageResult,
    onRunScenario: handleRunScenario,
    onNavigate: navigate,
    onBack: () => navigate('home'),
  };

  return (
    <div className="app-shell">
      {/* Sidebar — hidden on mobile, shown on lg+ via CSS */}
      <Sidebar
        screen={screen}
        isHomeGroup={isHomeGroup}
        navigate={navigate}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        calmMode={calmMode}
        setCalmMode={setCalmMode}
      />

      {/* Main panel */}
      <div className="main-panel">

        {/* Header — compact topbar on desktop, full header on mobile */}
        <div className="app-header">
          {/* Mobile: logo + controls row */}
          <div className="flex items-center justify-between px-4 py-3 lg:hidden">
            <button onClick={() => navigate('home')} className="flex items-center gap-2">
              <span className="text-xl">🩺</span>
              <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>HealBuddy</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCalmMode(!calmMode)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{ background: calmMode ? '#ccfbf1' : 'var(--bg-elevated)', color: calmMode ? '#0f766e' : 'var(--text-secondary)' }}
              >🌿</button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
              >{darkMode ? '☀️' : '🌙'}</button>
            </div>
          </div>

          {/* Desktop: slim topbar label + offline banner */}
          <span className="hidden lg:block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {NAV.find(n => n.id === screen || (n.id === 'home' && isHomeGroup))?.label || 'HealBuddy'}
          </span>
          <div className="hidden lg:block"><OfflineBanner inline /></div>

          {/* Offline banner — mobile only */}
          <div className="lg:hidden"><OfflineBanner /></div>
        </div>

        {/* Page content */}
        <div className="app-content">
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <PageContent {...sharedProps} />
          </div>
        </div>

        {/* Bottom nav — mobile only, hidden on lg+ via CSS */}
        <div className="bottom-nav">
          <div className="flex">
            {NAV.map(item => {
              const active = screen === item.id || (item.id === 'home' && isHomeGroup);
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className="flex flex-col items-center gap-0.5 flex-1 py-2.5 transition-colors text-xs font-medium"
                  style={{ color: active ? '#2563eb' : 'var(--text-muted)' }}
                  aria-label={item.label}
                >
                  <span className="text-xl leading-none">{item.icon}</span>
                  <span>{item.label}</span>
                  {active && <span className="w-1 h-1 rounded-full bg-blue-600" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Desktop Sidebar ── */
function Sidebar({ screen, isHomeGroup, navigate, darkMode, setDarkMode, calmMode, setCalmMode }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate('home')} className="flex items-center gap-3 w-full text-left">
          <span className="text-3xl">🩺</span>
          <div>
            <p className="text-base font-bold leading-none" style={{ color: 'var(--text-primary)' }}>HealBuddy</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Health Emergency Assistant</p>
          </div>
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(item => {
          const active = screen === item.id || (item.id === 'home' && isHomeGroup);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'nav-item-active' : 'nav-item-inactive'}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div className="px-3 py-4 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
        {/* Dark / Light toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all nav-item-inactive"
        >
          <span className="text-lg">{darkMode ? '☀️' : '🌙'}</span>
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* Calm mode */}
        <button
          onClick={() => setCalmMode(!calmMode)}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all"
          style={{
            background: calmMode ? '#f0fdf4' : 'transparent',
            color: calmMode ? '#15803d' : 'var(--text-secondary)'
          }}
        >
          <span className="text-lg">🌿</span>
          <span>{calmMode ? 'Calm Mode On' : 'Calm Mode'}</span>
        </button>

        {/* Emergency dial */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a href="tel:112"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white transition-colors"
            style={{ background: '#dc2626' }}
            onMouseEnter={e => e.currentTarget.style.background = '#b91c1c'}
            onMouseLeave={e => e.currentTarget.style.background = '#dc2626'}
          >
            📞 112
          </a>
          <a href="tel:108"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white transition-colors"
            style={{ background: '#f97316' }}
            onMouseEnter={e => e.currentTarget.style.background = '#ea580c'}
            onMouseLeave={e => e.currentTarget.style.background = '#f97316'}
          >
            🚑 108
          </a>
        </div>
      </div>
    </aside>
  );
}

/* ── Page content router ── */
function PageContent({
  screen, activeSymptom, triageResult, selectedCity,
  onSelectSymptom, onSelectCity, onTriageResult, onRunScenario, onNavigate, onBack
}) {
  if (screen === 'home') return (
    <HomeScreen
      onSelectSymptom={onSelectSymptom}
      onSelectCity={onSelectCity}
      selectedCity={selectedCity}
      onNavigate={onNavigate}
    />
  );

  if (screen === 'triage' && activeSymptom) return (
    <SymptomFlow symptomId={activeSymptom} onResult={onTriageResult} onBack={onBack} />
  );

  if (screen === 'triage_result' && triageResult) return (
    <TriageResultPage triageResult={triageResult} selectedCity={selectedCity} onBack={onBack} onSelectCity={onSelectCity} />
  );

  if (screen === 'nearby') return (
    <NearbyOptions
      city={selectedCity}
      urgency={triageResult?.urgency || 'clinic'}
      specialties={triageResult?.specialties || []}
      onSelectCity={onSelectCity}
    />
  );

  if (screen === 'firstaid') return <FirstAid />;
  if (screen === 'phrases')  return <PhraseCards />;
  if (screen === 'demo')     return <DemoMode onRunScenario={onRunScenario} />;
  if (screen === 'eval')     return <EvalMode />;
  return null;
}

/* ── Triage result page ── */
function TriageResultPage({ triageResult, selectedCity, onBack, onSelectCity }) {
  return (
    <div className="space-y-5 pb-10">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm transition-colors"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        ← Back to Home
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Triage result */}
        <div className="space-y-4">
          <div className={`rounded-2xl p-5 border shadow-sm ${triageResult.isEmergency ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900' : ''}`}
            style={!triageResult.isEmergency ? { background: 'var(--bg-surface)', borderColor: 'var(--border)' } : {}}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{triageResult.symptom.icon}</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{triageResult.symptom.label}</span>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${triageResult.config.bg} ${triageResult.config.text} mb-3`}>
              {triageResult.config.icon} {triageResult.config.label}
            </span>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{triageResult.rationale}</p>
            <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
              <span className="text-base mt-0.5">ℹ️</span>
              <p className="text-xs text-amber-800">This is not a medical diagnosis. It is a guidance tool. Always consult a qualified doctor.</p>
            </div>
          </div>

          <div className="rounded-2xl p-4" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">Recommended Action</p>
            <p className="text-base font-bold text-blue-800">{triageResult.config.action}</p>
          </div>

          {triageResult.isEmergency && (
            <div className="grid grid-cols-2 gap-2">
              <a href="tel:112" className="flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors">📞 Call 112</a>
              <a href="tel:108" className="flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-colors">🚑 Call 108</a>
            </div>
          )}
        </div>

        {/* Nearby options */}
        <NearbyOptions
          city={selectedCity}
          urgency={triageResult.urgency}
          specialties={triageResult.specialties}
          onSelectCity={onSelectCity}
        />
      </div>
    </div>
  );
}
