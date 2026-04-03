export default function EvalMode() {
  const sections = [
    { icon: "🎯", title: "The Problem", body: "Every year, millions of Indian travelers — tourists, pilgrims, students, backpackers — face health emergencies in unfamiliar places. They don't know the right level of care, can't trust unknown providers, may not speak the local language, and often have no internet. Panic leads to poor decisions. HealBuddy solves this." },
    { icon: "👥", title: "Who It Helps", body: "Solo travelers, families with children, senior citizens on pilgrimages, interstate domestic travelers, adventure trekkers in remote areas, and anyone in an unfamiliar city who needs to make a fast, confident health decision." },
    { icon: "📡", title: "Why Offline-First Matters", body: "India has 700+ million internet users, but connectivity is unreliable in hill stations, remote temples, tribal areas, and during network congestion at tourist spots. HealBuddy's triage engine, first-aid guides, facility data, and emergency phrases all work without internet — by design, not as a fallback." },
    { icon: "🧠", title: "How Triage Logic Works", body: "The symptom engine uses a rule-based decision tree. Users select a symptom, answer 2–5 targeted questions, and the engine matches answers against weighted rules to classify urgency: self-care → pharmacy → clinic → hospital → emergency. Red-flag conditions override all other rules and trigger immediate emergency guidance." },
    { icon: "💰", title: "Why Cost Transparency Matters", body: "In India, cost uncertainty is a major barrier to seeking care. Patients delay treatment fearing unaffordable bills. HealBuddy shows realistic consultation ranges, government vs private cost differences, and affordability badges — reducing hesitation and enabling faster, better decisions." },
    { icon: "🛡️", title: "Why Trust Indicators Matter", body: "In an unfamiliar city, patients can't assess provider quality. HealBuddy's trust framework — verified listings, 24×7 availability, emergency capability, tourist-friendliness, female doctor availability, digital payment support — gives travelers a fast, reliable signal of provider reliability." },
    { icon: "✅", title: "What Works Offline", body: "Symptom triage, urgency classification, first-aid guides (all 10 scenarios), emergency phrases in 6 Indian languages, preloaded facility data for 8 cities, emergency call shortcuts (112/108), and the full recommendation engine — all fully functional without internet." },
    { icon: "🔒", title: "Privacy & Ethics", body: "HealBuddy collects no personal health data. Symptom inputs are processed locally and never transmitted. The app provides guidance, not diagnosis. All emergency states prominently urge professional medical care. Trust badges are clearly marked as prototype-curated data." },
  ];

  const roadmap = [
    "ABDM-aligned verified hospital registry integration",
    "NHA / Ayushman Bharat facility database sync",
    "Real-time ambulance dispatch via 108 API",
    "AI-powered multilingual symptom translation",
    "Downloadable district health packs for offline use",
    "Women safety and elder care emergency modules",
    "Travel insurance claim initiation support",
    "Wearable device integration for vitals-based triage",
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="rounded-2xl p-6 md:p-8 text-white shadow-xl"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ opacity: 0.75 }}>Evaluation Mode</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">HealBuddy — Product Brief</h2>
        <p className="text-sm md:text-base max-w-2xl" style={{ opacity: 0.82 }}>
          For judges, evaluators, and policy reviewers. A complete overview of the product vision, architecture, and impact potential.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((s, i) => (
          <div key={i} className="rounded-2xl p-5 shadow-sm transition-shadow hover:shadow-md"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-2xl">{s.icon}</span>
              <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-2xl">🔮</span>
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Future Real-World Integrations</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {roadmap.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl"
              style={{ background: '#eef2ff', border: '1px solid #c7d2fe' }}>
              <span className="text-indigo-400 font-bold flex-shrink-0 mt-0.5">→</span>
              <span className="text-sm text-indigo-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', border: '1px solid #c7d2fe' }}>
        <p className="text-base font-bold text-indigo-700 mb-1">Built for India. Designed for the world.</p>
        <p className="text-xs text-indigo-500 max-w-lg mx-auto">
          HealBuddy is a prototype for national/international innovation evaluation. All facility data is mock/curated for demonstration purposes.
        </p>
      </div>
    </div>
  );
}
