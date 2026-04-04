import { useState, useEffect } from 'react';
import OfflineBanner from './components/OfflineBanner';
import SymptomFlow from './components/SymptomFlow';
import Guidance from './components/Guidance';
import MapScreen from './components/MapScreen';
import FirstAid from './components/FirstAid';
import LanguageScreen from './components/LanguageScreen';
import InstallPrompt from './components/InstallPrompt';

const SYMPTOM_ICONS = {
  "Fever": "🌡️",
  "Stomach Issue": "🤢",
  "Injury / Wound": "🩹",
  "Breathing Problem": "😮‍💨",
  "Chest Pain": "❤️‍🔥",
  "Dehydration": "💧",
};

const HOW_IT_WORKS_STEPS = [
  { icon: '🩺', label: 'Select Symptom', desc: '10 categories to choose from', color: 'bg-teal-500' },
  { icon: '❓', label: 'Answer Questions', desc: '2–5 targeted follow-up questions', color: 'bg-blue-500' },
  { icon: '🚨', label: 'Red Flag Check', desc: 'Emergency triggers instant 112/108 prompt', color: 'bg-red-500' },
  { icon: '📊', label: 'Urgency Classified', desc: 'Self-care → Pharmacy → Clinic → Hospital → Emergency', color: 'bg-orange-500' },
  { icon: '🏥', label: 'Find Nearby Care', desc: 'Facilities scored by trust, cost & language', color: 'bg-purple-500' },
];

function HowItWorksModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">How HealBuddy Works</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xl leading-none">✕</button>
        </div>
        <div className="flex flex-col">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center text-white text-lg shrink-0 shadow-md`}>{step.icon}</div>
                {i < HOW_IT_WORKS_STEPS.length - 1 && <div className="w-0.5 h-8 bg-slate-200 dark:bg-slate-700 my-1" />}
              </div>
              <div className="pb-5">
                <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{step.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-800/50">
          <p className="text-xs text-teal-700 dark:text-teal-400 font-medium">📡 All steps run entirely offline — no internet needed.</p>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ onNavigate, onQuickSymptom }) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  return (
    <div className="min-h-full">
      {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}
      {/* Hero */}
      <section className="text-center pt-12 pb-10 px-4">
        <div className="inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs font-bold px-4 py-1.5 rounded-full border border-teal-200 dark:border-teal-800 mb-6">
          <span>📡</span> Works 100% Offline
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-4">
          Your <span className="text-teal-600 italic">Offline</span> Emergency<br/>Health Buddy
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm leading-relaxed mb-8">
          Know what to do, where to go, and who to trust—even without internet. Medical confidence for every traveler, anywhere.
        </p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => onNavigate('pick')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.97]"
          >
            Start Now
          </button>
          <button 
            onClick={() => setShowHowItWorks(true)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-[0.97]"
          >
            How it works
          </button>
        </div>
      </section>

      {/* Search Bar */}
      <section className="max-w-2xl mx-auto px-4 mb-10">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 text-center mb-5">
          How are you <em className="text-teal-600 not-italic font-black italic">feeling</em> today?
        </h2>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
          <input 
            type="text" 
            placeholder="Enter your symptom (fever, chest pain, injury...)"
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                onQuickSymptom(e.target.value.trim());
              }
            }}
          />
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features" className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Emergency Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40 border border-red-100 dark:border-red-900/50 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-red-200 text-5xl opacity-30 pointer-events-none">✱</div>
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white text-lg mb-4 shadow-md">🚨</div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-2">Immediate Danger?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 max-w-sm">One tap to call 112 or 108. Share your GPS location with emergency services instantly.</p>
            <div className="flex gap-3">
              <a href="tel:112" className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 transition-colors active:scale-[0.97]">
                📞 Call 112
              </a>
              <a href="tel:108" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 transition-colors active:scale-[0.97]">
                🚑 Call 108
              </a>
            </div>
          </div>

          {/* First Aid Guide */}
          <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white text-lg mb-4 shadow-md">🩹</div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-2">First Aid Guide</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Step-by-step instructions for <strong>10 scenarios</strong>. Works offline.</p>
            <button onClick={() => onNavigate('firstaid')} className="text-teal-600 font-bold text-sm hover:text-teal-700 transition-colors flex items-center gap-1">
              View Guides →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Find Nearby Help */}
          <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/40 text-teal-600 rounded-xl flex items-center justify-center text-lg mb-4">🏥</div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-2">Find Nearby Help</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Hospitals, clinics and pharmacies across <strong>20+ Indian cities</strong>.</p>
            <button onClick={() => onNavigate('map')} className="text-teal-600 font-bold text-sm hover:text-teal-700 transition-colors flex items-center gap-1">
              Open Map 🗺️
            </button>
          </div>

          {/* Smart Symptom Analysis */}
          <div className="bg-teal-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 rounded-bl-full opacity-30 pointer-events-none"></div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/50 px-2.5 py-1 rounded-full mb-3 inline-block">HealBuddy AI</span>
            <h3 className="text-xl font-black mb-2">Smart Symptom Analysis</h3>
            <p className="text-teal-100 text-sm mb-5">Answer a few questions to get instant triage guidance across <strong className="text-white">10 symptom categories</strong>.</p>
            
            <div className="grid grid-cols-3 gap-2 mb-5">
              {Object.entries(SYMPTOM_ICONS).map(([label, icon]) => (
                <button 
                  key={label}
                  onClick={() => onQuickSymptom(label)}
                  className="bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl p-2.5 text-center transition-colors active:scale-[0.95]"
                >
                  <span className="text-xl block mb-0.5">{icon}</span>
                  <span className="text-[9px] font-bold leading-tight block">{label}</span>
                </button>
              ))}
            </div>

            <button 
              onClick={() => onNavigate('pick')}
              className="bg-white text-teal-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-teal-50 transition-colors active:scale-[0.97]"
            >
              Start Assessment
            </button>
          </div>
        </div>

        {/* Quick Symptom Access */}
        <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-4">Quick Symptom Access</h3>
          <div className="flex flex-wrap gap-2">
            {["High Fever","Bleeding","Body Pain","Dizziness","Vomiting","Chest Pain","Breathing Issue","Burns","Fracture","Animal Bite","Food Poisoning","Allergic Reaction"].map(s => (
              <button 
                key={s}
                onClick={() => onQuickSymptom(s)}
                className="px-4 py-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 text-xs font-bold rounded-full border border-slate-200 dark:border-slate-600 hover:border-teal-200 transition-all active:scale-[0.95]"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center text-lg mb-3">🗣️</div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-1">Offline Translation</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">20+ medical phrases translated to 8 Indian languages instantly.</p>
          </div>
          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/50 rounded-2xl p-6">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/40 rounded-xl flex items-center justify-center text-lg mb-3">📋</div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-1">Vitals Sync</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Store medical history and allergies locally for first responders to access instantly.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

const ALL_SYMPTOMS = [
  { id: 'fever',          label: 'Fever',                   icon: '🌡️', color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50 text-orange-700 dark:text-orange-400' },
  { id: 'stomach',        label: 'Stomach Issue',           icon: '🤢', color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50 text-yellow-700 dark:text-yellow-400' },
  { id: 'injury',         label: 'Injury / Wound',          icon: '🩹', color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400' },
  { id: 'breathing',      label: 'Breathing Problem',       icon: '😮‍💨', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400' },
  { id: 'chest_pain',     label: 'Chest Pain',              icon: '💔', color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400' },
  { id: 'dehydration',    label: 'Dehydration',             icon: '💧', color: 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800/50 text-cyan-700 dark:text-cyan-400' },
  { id: 'allergy',        label: 'Allergic Reaction',       icon: '🤧', color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-400' },
  { id: 'womens_health',  label: "Women's Health",          icon: '🌸', color: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800/50 text-pink-700 dark:text-pink-400' },
  { id: 'child_health',   label: 'Child Health',            icon: '👶', color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400' },
  { id: 'senior_emergency', label: 'Senior Emergency',      icon: '👴', color: 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300' },
];

function SymptomPicker({ onSelect, onBack }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={onBack} className="text-sm text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-6 flex items-center gap-1">
        ← Back
      </button>
      <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">What's the concern?</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Select the symptom category that best matches the situation.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ALL_SYMPTOMS.map(s => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 font-bold text-sm transition-all active:scale-[0.97] hover:scale-[1.02] ${s.color}`}
          >
            <span className="text-3xl">{s.icon}</span>
            <span className="text-center leading-tight">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('dashboard');
  const [symptomId, setSymptomId] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const handleAnalysisComplete = (result) => {
    setAnalysis(result);
    setScreen('guidance');
  };

  const handleQuickSymptom = (symptomText) => {
    const lower = symptomText.toLowerCase();
    const match = ALL_SYMPTOMS.find(s =>
      lower.includes(s.label.toLowerCase()) ||
      lower.includes(s.id.replace('_', ' '))
    );
    const id = match?.id ||
      (lower.includes('chest') ? 'chest_pain' :
       lower.includes('breath') ? 'breathing' :
       lower.includes('stomach') || lower.includes('vomit') || lower.includes('poison') ? 'stomach' :
       lower.includes('injur') || lower.includes('bleed') || lower.includes('burn') || lower.includes('fracture') || lower.includes('wound') ? 'injury' :
       lower.includes('allerg') ? 'allergy' :
       lower.includes('dizz') || lower.includes('dehydr') ? 'dehydration' :
       'fever');
    setSymptomId(id);
    setScreen('input');
  };

  const activeTab = screen === 'dashboard' ? 'dashboard' : screen === 'map' ? 'hospitals' : screen === 'pharmacy' ? 'pharmacy' : screen === 'firstaid' ? 'firstaid' : screen === 'language' ? 'language' : 'guidance';

  return (
    <div className="h-[100dvh] bg-white dark:bg-black flex flex-col font-sans overflow-hidden relative">
      {/* Ambulance Siren Light Background */}
      <div className="ambulance-bg">
        <div className="light-orb orb-red-1" />
        <div className="light-orb orb-blue-1" />
        <div className="light-orb orb-red-2" />
        <div className="light-orb orb-blue-2" />
        <div className="light-orb orb-red-3" />
        <div className="light-orb orb-blue-3" />
      </div>

      <OfflineBanner />
      <InstallPrompt />
      
      {/* Navbar */}
      <header className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white flex items-center shrink-0 px-4 md:px-8 z-50 sticky top-0 border-b border-slate-200 dark:border-slate-700/50 shadow-sm">
        <button 
          onClick={() => { setScreen('dashboard'); setAnalysis(null); }}
          className="text-teal-600 dark:text-teal-400 font-black text-lg tracking-tight mr-6 py-4 hover:text-teal-500 dark:hover:text-teal-300 transition-colors flex items-center gap-2"
        >
          🩺 HealBuddy
        </button>
        
        <nav className="hidden sm:flex items-center gap-0 flex-1 h-full">
          {[
            { id: 'dashboard', label: 'Home',       action: () => { setScreen('dashboard'); setAnalysis(null); } },
            { id: 'guidance',  label: 'Guidance',    action: () => setScreen('pick') },
            { id: 'firstaid',  label: 'First Aid',   action: () => setScreen('firstaid') },
            { id: 'language',  label: '🗣️ Phrases',   action: () => setScreen('language') },
            { id: 'hospitals', label: 'Hospitals',   action: () => setScreen('map') },
            { id: 'pharmacy',  label: '💊 Pharmacy',   action: () => setScreen('pharmacy') },
          ].map(item => (
            <button
              key={item.id}
              onClick={item.action}
              className={`px-4 py-4 text-sm font-semibold transition-all border-b-2 ${
                activeTab === item.id
                  ? 'text-teal-600 dark:text-teal-400 border-teal-600 dark:border-teal-400'
                  : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setDark(d => !d)}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white p-2 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {dark ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          <a href="tel:112" className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors active:scale-[0.95] flex items-center gap-1.5">
            🚨 Emergency
          </a>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700/80 flex z-50 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.12)]">
        <button 
          onClick={() => { setScreen('dashboard'); setAnalysis(null); }}
          className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${activeTab === 'dashboard' ? 'text-teal-500' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <span className="text-lg">🏠</span>Home
          {activeTab === 'dashboard' && <span className="w-1 h-1 rounded-full bg-teal-500 mt-0.5" />}
        </button>
        <button
          onClick={() => setScreen('pick')}
          className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${activeTab === 'guidance' ? 'text-teal-500' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <span className="text-lg">🩺</span>Triage
          {activeTab === 'guidance' && <span className="w-1 h-1 rounded-full bg-teal-500 mt-0.5" />}
        </button>
        <button
          onClick={() => setScreen('firstaid')}
          className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${activeTab === 'firstaid' ? 'text-teal-500' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <span className="text-lg">🩹</span>First Aid
          {activeTab === 'firstaid' && <span className="w-1 h-1 rounded-full bg-teal-500 mt-0.5" />}
        </button>
        <button
          onClick={() => setScreen('map')}
          className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${activeTab === 'hospitals' ? 'text-teal-500' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <span className="text-lg">🏥</span>Hospitals
          {activeTab === 'hospitals' && <span className="w-1 h-1 rounded-full bg-teal-500 mt-0.5" />}
        </button>
        <button
          onClick={() => setScreen('pharmacy')}
          className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${activeTab === 'pharmacy' ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <span className="text-lg">💊</span>Pharmacy
          {activeTab === 'pharmacy' && <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />}
        </button>
        <a
          href="tel:112"
          className="flex-1 py-3 flex flex-col items-center gap-0.5 text-[10px] font-bold text-red-500"
        >
          <span className="text-lg">🚨</span>SOS
        </a>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth pb-14 sm:pb-0">
        {screen === 'dashboard' && (
          <Dashboard onNavigate={setScreen} onQuickSymptom={handleQuickSymptom} />
        )}

        {screen === 'language' && (
          <LanguageScreen />
        )}

        {screen === 'firstaid' && (
          <div className="max-w-4xl mx-auto px-4 py-6">
            <button
              onClick={() => setScreen('dashboard')}
              className="flex items-center gap-1.5 text-sm mb-6 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              ← Back
            </button>
            <FirstAid />
          </div>
        )}

        {screen === 'pick' && (
          <SymptomPicker
            onSelect={id => { setSymptomId(id); setScreen('input'); }}
            onBack={() => setScreen('dashboard')}
          />
        )}

        {screen === 'input' && symptomId && (
          <div className="max-w-3xl mx-auto px-2 py-4">
            <SymptomFlow
              symptomId={symptomId}
              onResult={(result) => { setAnalysis(result); setScreen('guidance'); }}
              onBack={() => setScreen('pick')}
            />
          </div>
        )}
        
        {screen === 'guidance' && analysis && (
          <div className="max-w-3xl mx-auto px-2 py-4">
            <Guidance 
              analysis={analysis} 
              onFindDoctors={() => setScreen('map')} 
              onReset={() => {
                setAnalysis(null);
                setScreen('dashboard');
              }}
            />
          </div>
        )}
        
        {screen === 'map' && (
          <div className="absolute inset-0 z-40 bg-white dark:bg-black">
            <MapScreen 
              onBack={() => setScreen(analysis ? 'guidance' : 'dashboard')} 
              requiredDoctorType={analysis?.doctor_type || analysis?.doctorType}
              showPharmacies={analysis?.showPharmacyMode === true}
              showHospitals={true}
            />
          </div>
        )}

        {screen === 'pharmacy' && (
          <div className="absolute inset-0 z-40 bg-white dark:bg-black">
            <MapScreen 
              onBack={() => setScreen('dashboard')}
              requiredDoctorType={null}
              showPharmacies={true}
              showHospitals={false}
            />
          </div>
        )}
      </main>
    </div>
  );
}
