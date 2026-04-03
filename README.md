# 🩺 HealBuddy — Offline-First Health Emergency Assistant

> A flagship prototype for national/international innovation evaluation.  
> Built for Indian travelers in unfamiliar, low-connectivity, or remote areas.

---

## What is HealBuddy?

HealBuddy is a **health emergency decision-making assistant** — not just a doctor finder.

It answers the five questions that matter most during a health crisis in an unfamiliar place:

1. **What should I do right now?**
2. **What kind of care do I need?**
3. **Where should I go nearby?**
4. **Which option is likely more trustworthy and affordable?**
5. **What can I do immediately, even without internet?**

---

## Key Features

| Feature | Description |
|---|---|
| 🧠 Symptom Triage | Rule-based decision engine classifies urgency across 10 symptom categories |
| 🚨 Emergency Detection | Red-flag symptoms trigger immediate 112/108 call prompts |
| 🩹 First Aid Guides | 10 offline scenarios with steps, do-nots, and escalation triggers |
| 📍 Nearby Care | Preloaded facilities for 8 Indian cities with cost, trust, and language data |
| 💰 Cost Transparency | Realistic consultation ranges, govt vs private, affordability badges |
| 🗣️ Language Phrases | Emergency phrases in 6 Indian languages (Hindi, Marathi, Tamil, Bengali, Telugu, Kannada) |
| 🎬 Demo Scenarios | 6 clickable scenarios for evaluators to test the full product flow |
| 📋 Evaluation Mode | Product brief for judges explaining architecture, impact, and future roadmap |
| 🌙 Dark Mode | System-aware + manual toggle |
| 🌿 Calm Mode | Reduced visual intensity for stress situations |
| 📡 Offline-First | Service worker caches app shell; all core features work without internet |

---

## Offline-First Design

HealBuddy is designed to work **meaningfully without internet**:

- Symptom triage engine runs entirely in-browser (no API calls)
- First-aid guides are embedded in the app bundle
- Facility data is preloaded as local JS objects
- Emergency phrases are bundled for all 6 languages
- Service worker caches the app shell on first load
- Online/offline state is clearly shown in the UI
- Offline mode never feels broken — it feels intentionally designed

---

## Architecture

```
frontend/
├── src/
│   ├── data/
│   │   ├── facilities.js        # 18 facilities across 8 Indian cities
│   │   ├── symptomRules.js      # 10 symptom categories with triage rules
│   │   ├── firstaid.js          # 10 first-aid guides
│   │   ├── emergencyPhrases.js  # 6 phrases × 6 languages + city list
│   │   └── demoScenarios.js     # 6 evaluator demo scenarios
│   ├── logic/
│   │   ├── triageEngine.js      # Rule-based urgency classifier
│   │   └── recommendationEngine.js  # Weighted facility scorer
│   ├── components/
│   │   ├── HomeScreen.jsx       # Dashboard with emergency CTAs
│   │   ├── SymptomFlow.jsx      # Guided triage questionnaire
│   │   ├── NearbyOptions.jsx    # Facility cards with map/list view
│   │   ├── FirstAid.jsx         # Offline first-aid guide browser
│   │   ├── PhraseCards.jsx      # Multilingual phrase cards
│   │   ├── DemoMode.jsx         # Evaluator scenario launcher
│   │   ├── EvalMode.jsx         # Product brief for judges
│   │   ├── Badges.jsx           # Trust, cost, urgency badge components
│   │   ├── OfflineBanner.jsx    # Online/offline status indicator
│   │   └── EmergencyOverlay.jsx # Full-screen emergency alert
│   ├── App.jsx                  # Root component + navigation
│   ├── main.jsx                 # Entry point + SW registration
│   └── index.css                # Tailwind + design tokens
└── public/
    └── sw.js                    # Service worker (cache-first strategy)
```

---

## How Triage Works

1. User selects a symptom category (e.g., Fever, Chest Pain)
2. App asks 2–5 targeted follow-up questions
3. Rule engine matches answers against weighted conditions
4. **Red-flag detection** runs first — if triggered, emergency overlay appears immediately
5. Urgency is classified: `self_care → pharmacy → clinic → specialist → hospital → emergency`
6. Rationale is shown in plain language
7. Recommendation engine scores nearby facilities based on urgency match, specialty, distance, cost, language, and trust

---

## Demo Scenarios

| Scenario | City | Expected Urgency |
|---|---|---|
| Tourist with Fever | Manali | Clinic |
| Child Vomiting | Jaipur | Clinic |
| Senior Citizen Chest Pain | Varanasi | **Emergency** |
| Solo Female Traveler Sprain | Goa | Clinic |
| Food Poisoning | Rishikesh | Clinic |
| Asthma in Remote Area | Spiti | Hospital |

---

## How to Run Locally

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Future Roadmap

- ABDM-aligned verified hospital registry integration
- NHA / Ayushman Bharat facility database sync
- Real-time ambulance dispatch via 108 API
- AI-powered multilingual symptom translation
- Downloadable district health packs for offline use
- Women safety and elder care emergency modules
- Travel insurance claim initiation support
- Wearable device integration for vitals-based triage

---

## Privacy

HealBuddy collects **no personal health data**. All symptom processing happens locally in the browser. No data is transmitted to any server. This is a frontend-only prototype.

---

*Built for India. Designed for the world.*
