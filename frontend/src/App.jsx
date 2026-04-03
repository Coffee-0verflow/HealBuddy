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

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isDesktop;
}

export default function App() {
  const isDesktop = useIsDesktop();
  const [screen, setScreen]               = useState('home');
  const [activeSymptom, setActiveSymptom] = useState(null);
  const [triageResult, setTriageResult]   = useState(null);
  const [selectedCity, setSelectedCity]   = useState('');
  const [calmMode, setCalmMode]           = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('hb-dark');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('hb-dark', String(darkMode));
  }, [darkMode]);

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

  if (isDesktop) {
    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-base)' }}>
        {/* Sidebar */}
        <aside style={{
          width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column',
          background: 'var(--bg-surface)', borderRight: '1px solid var(--border)',
          height: '100vh', overflow: 'hidden',
        }}>
          {/* Logo */}
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
            <button onClick={() => navigate('home')} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>
              <span style={{ fontSize: 28 }}>🩺</span>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>HealBuddy</p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Health Emergency Assistant</p>
              </div>
            </button>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {NAV.map(item => {
              const active = screen === item.id || (item.id === 'home' && isHomeGroup);
              return (
                <button key={item.id} onClick={() => navigate(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    width: '100%', padding: '10px 16px', borderRadius: 12,
                    border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500,
                    background: active ? '#2563eb' : 'transparent',
                    color: active ? '#fff' : 'var(--text-secondary)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom controls */}
          <div style={{ padding: '12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={() => setDarkMode(!darkMode)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, background: 'transparent', color: 'var(--text-secondary)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 18 }}>{darkMode ? '☀️' : '🌙'}</span>
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button onClick={() => setCalmMode(!calmMode)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, background: calmMode ? '#f0fdf4' : 'transparent', color: calmMode ? '#15803d' : 'var(--text-secondary)' }}
            >
              <span style={{ fontSize: 18 }}>🌿</span>
              <span>{calmMode ? 'Calm Mode On' : 'Calm Mode'}</span>
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingTop: 4 }}>
              <a href="tel:112" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 0', borderRadius: 12, background: '#dc2626', color: '#fff', fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>📞 112</a>
              <a href="tel:108" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 0', borderRadius: 12, background: '#f97316', color: '#fff', fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>🚑 108</a>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {/* Topbar */}
          <div style={{ flexShrink: 0, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
              {NAV.find(n => n.id === screen || (n.id === 'home' && isHomeGroup))?.label || 'HealBuddy'}
            </span>
            <OfflineBanner inline />
          </div>
          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <PageContent {...sharedProps} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg-base)' }}>
      {/* Mobile header */}
      <div style={{ flexShrink: 0, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
          <button onClick={() => navigate('home')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>🩺</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>HealBuddy</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setCalmMode(!calmMode)}
              style={{ padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, background: calmMode ? '#ccfbf1' : 'var(--bg-elevated)', color: calmMode ? '#0f766e' : 'var(--text-secondary)' }}>
              🌿
            </button>
            <button onClick={() => setDarkMode(!darkMode)}
              style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        <OfflineBanner />
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        <PageContent {...sharedProps} />
      </div>

      {/* Bottom nav */}
      <div style={{ flexShrink: 0, background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex' }}>
          {NAV.map(item => {
            const active = screen === item.id || (item.id === 'home' && isHomeGroup);
            return (
              <button key={item.id} onClick={() => navigate(item.id)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer', background: 'transparent', color: active ? '#2563eb' : 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}
                aria-label={item.label}
              >
                <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
                <span>{item.label}</span>
                {active && <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#2563eb' }} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
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
        style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        ← Back to Home
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className={`rounded-2xl p-5 border shadow-sm ${triageResult.isEmergency ? 'bg-red-50 border-red-200' : ''}`}
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
              <a href="tel:112" className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white" style={{ background: '#dc2626' }}>📞 Call 112</a>
              <a href="tel:108" className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white" style={{ background: '#f97316' }}>🚑 Call 108</a>
            </div>
          )}
        </div>

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
