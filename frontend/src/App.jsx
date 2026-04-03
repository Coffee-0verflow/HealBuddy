import { useState } from 'react';
import OfflineBanner from './components/OfflineBanner';
import SymptomFlow from './components/SymptomFlow';
import Guidance from './components/Guidance';
import MapScreen from './components/MapScreen';

const SYMPTOM_ICONS = {
  "Fever": "🌡️",
  "Stomach Issue": "🤢",
  "Injury / Wound": "🩹",
  "Breathing Problem": "😮‍💨",
  "Chest Pain": "❤️‍🔥",
  "Dehydration": "💧",
};

function Dashboard({ onNavigate, onQuickSymptom }) {
  return (
    <div className="min-h-full">
      {/* Hero */}
      <section className="text-center pt-12 pb-10 px-4">
        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-xs font-bold px-4 py-1.5 rounded-full border border-teal-200 mb-6">
          <span>📡</span> Works 100% Offline
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          Your <span className="text-teal-600 italic">Offline</span> Emergency<br/>Health Buddy
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed mb-8">
          Know what to do, where to go, and who to trust—even without internet. Medical confidence for every traveler, anywhere.
        </p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => onNavigate('input')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.97]"
          >
            Start Now
          </button>
          <button 
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all active:scale-[0.97]"
          >
            How it works
          </button>
        </div>
      </section>

      {/* Search Bar */}
      <section className="max-w-2xl mx-auto px-4 mb-10">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 text-center mb-5">
          How are you <em className="text-teal-600 not-italic font-black italic">feeling</em> today?
        </h2>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
          <input 
            type="text" 
            placeholder="Enter your symptom (fever, chest pain, injury...)"
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
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
          <div className="md:col-span-2 bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-red-200 text-5xl opacity-30 pointer-events-none">✱</div>
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white text-lg mb-4 shadow-md">🚨</div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Immediate Danger?</h3>
            <p className="text-sm text-slate-600 mb-5 max-w-sm">One tap to call 112 or 108. Share your GPS location with emergency services instantly.</p>
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
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white text-lg mb-4 shadow-md">🩹</div>
            <h3 className="text-lg font-black text-slate-900 mb-2">First Aid Guide</h3>
            <p className="text-sm text-slate-500 mb-4">Step-by-step instructions for <strong>10 scenarios</strong>. Works offline.</p>
            <button onClick={() => onNavigate('input')} className="text-teal-600 font-bold text-sm hover:text-teal-700 transition-colors flex items-center gap-1">
              View Guides →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Find Nearby Help */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center text-lg mb-4">🏥</div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Find Nearby Help</h3>
            <p className="text-sm text-slate-500 mb-4">Hospitals, clinics and pharmacies across <strong>20+ Indian cities</strong>.</p>
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
              onClick={() => onNavigate('input')}
              className="bg-white text-teal-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-teal-50 transition-colors active:scale-[0.97]"
            >
              Start Assessment
            </button>
          </div>
        </div>

        {/* Quick Symptom Access */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-black text-slate-900 mb-4">Quick Symptom Access</h3>
          <div className="flex flex-wrap gap-2">
            {["High Fever","Bleeding","Body Pain","Dizziness","Vomiting","Chest Pain","Breathing Issue","Burns","Fracture","Animal Bite","Food Poisoning","Allergic Reaction"].map(s => (
              <button 
                key={s}
                onClick={() => onQuickSymptom(s)}
                className="px-4 py-2 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-700 text-xs font-bold rounded-full border border-slate-200 hover:border-teal-200 transition-all active:scale-[0.95]"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-lg mb-3">🗣️</div>
            <h3 className="text-lg font-black text-slate-900 mb-1">Offline Translation</h3>
            <p className="text-sm text-slate-500">20+ medical phrases translated to 8 Indian languages instantly.</p>
          </div>
          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6">
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-lg mb-3">📋</div>
            <h3 className="text-lg font-black text-slate-900 mb-1">Vitals Sync</h3>
            <p className="text-sm text-slate-500">Store medical history and allergies locally for first responders to access instantly.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('dashboard');
  const [analysis, setAnalysis] = useState(null);

  const handleAnalysisComplete = (result) => {
    setAnalysis(result);
    setScreen('guidance');
  };

  const handleQuickSymptom = async (symptom) => {
    const { analyzeSymptomsOffline } = await import('./logic/ai');
    try {
      const result = await analyzeSymptomsOffline(symptom);
      setAnalysis(result);
      setScreen('guidance');
    } catch (err) {
      console.error(err);
    }
  };

  const activeTab = screen === 'dashboard' ? 'dashboard' : screen === 'map' ? 'hospitals' : 'guidance';

  return (
    <div className="h-[100dvh] bg-white flex flex-col font-sans overflow-hidden">
      <OfflineBanner />
      
      {/* Teal Navbar */}
      <header className="bg-slate-800 text-white flex items-center gap-1 shrink-0 px-4 md:px-8 py-0 z-50 sticky top-0">
        <button 
          onClick={() => { setScreen('dashboard'); setAnalysis(null); }}
          className="text-teal-400 font-black text-lg tracking-tight mr-4 py-3 hover:text-teal-300 transition-colors"
        >
          HealBuddy
        </button>
        
        <nav className="hidden sm:flex items-center gap-1 flex-1">
          <button 
            onClick={() => { setScreen('dashboard'); setAnalysis(null); }}
            className={`px-3 py-3 text-xs font-bold transition-colors ${activeTab === 'dashboard' ? 'text-teal-400 border-b-2 border-teal-400' : 'text-slate-400 hover:text-white'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setScreen('input')}
            className={`px-3 py-3 text-xs font-bold transition-colors ${activeTab === 'guidance' ? 'text-teal-400 border-b-2 border-teal-400' : 'text-slate-400 hover:text-white'}`}
          >
            Guidance
          </button>
          <button 
            onClick={() => setScreen('map')}
            className={`px-3 py-3 text-xs font-bold transition-colors ${activeTab === 'hospitals' ? 'text-teal-400 border-b-2 border-teal-400' : 'text-slate-400 hover:text-white'}`}
          >
            Hospitals
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button className="text-slate-400 hover:text-white p-2 transition-colors text-sm">⚙️</button>
          <a href="tel:112" className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors active:scale-[0.95]">Emergency</a>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex z-50 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]">
        <button 
          onClick={() => { setScreen('dashboard'); setAnalysis(null); }}
          className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${activeTab === 'dashboard' ? 'text-teal-600' : 'text-slate-400'}`}
        >
          <span className="text-base">🏠</span>Home
        </button>
        <button
          onClick={() => setScreen('input')}
          className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${activeTab === 'guidance' ? 'text-teal-600' : 'text-slate-400'}`}
        >
          <span className="text-base">🩺</span>Guidance
        </button>
        <button
          onClick={() => setScreen('map')}
          className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${activeTab === 'hospitals' ? 'text-teal-600' : 'text-slate-400'}`}
        >
          <span className="text-base">🏥</span>Hospitals
        </button>
        <a
          href="tel:112"
          className="flex-1 py-3 flex flex-col items-center gap-0.5 text-[10px] font-bold text-red-500"
        >
          <span className="text-base">🚨</span>SOS
        </a>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth pb-14 sm:pb-0">
        {screen === 'dashboard' && (
          <Dashboard onNavigate={setScreen} onQuickSymptom={handleQuickSymptom} />
        )}

        {screen === 'input' && (
          <div className="max-w-3xl mx-auto px-2 py-4">
            <SymptomFlow onAnalysisComplete={handleAnalysisComplete} />
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
          <div className="absolute inset-0 z-40 bg-white">
            <MapScreen 
              onBack={() => setScreen(analysis ? 'guidance' : 'dashboard')} 
              requiredDoctorType={analysis?.doctor_type || analysis?.doctorType}
            />
          </div>
        )}
      </main>
    </div>
  );
}
