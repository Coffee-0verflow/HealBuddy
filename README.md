# 🩺 HealBuddy — Offline-First Health Emergency Assistant

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
| 🧠 Symptom Triage | Rule-based decision engine across 10 symptom categories with 2–5 targeted questions each |
| 🚨 Emergency Detection | Red-flag symptoms trigger immediate 112/108 call prompts with full-screen overlay |
| 🩹 First Aid Guides | 10 offline scenarios with step-by-step instructions, do-nots, and escalation triggers |
| 📍 Nearby Hospitals | 129 hospitals across India with GPS location, state filter, draggable map/list divider |
| 💊 Nearby Pharmacies | Pharmacy map mode with 24×7 filter, distance sorting, and navigation |
| 🗺️ Interactive Map | OpenStreetMap with state-zoom dropdown, tap-to-set-location, route navigation |
| 💰 Cost Transparency | Realistic consultation ranges, govt vs private, affordability badges |
| 🗣️ Medical Phrases | 50 phrases × 10 Indian languages with offline search, category tabs, and copy button |
| 🌙 Dark / Light Mode | System-aware + manual toggle in navbar (SVG sun/moon icons) |
| 📡 Offline-First | Service worker caches app shell; all core features work without internet |
| 📲 PWA Installable | Installable on Android/iOS as a home screen app |

---

## Navigation

HealBuddy has 5 main sections accessible from the navbar and mobile bottom nav:

| Tab | Description |
|---|---|
| 🏠 Home | Dashboard with emergency CTAs, symptom search, quick access cards |
| 🩺 Guidance (Triage) | Symptom category picker → guided questions → urgency result |
| 🩹 First Aid | 10 offline first-aid scenario guides |
| 🗣️ Phrases | 50 medical phrases in 10 Indian languages with search |
| 🏥 Hospitals | Interactive map + hospital/pharmacy cards |

---

## Offline-First Design

HealBuddy is designed to work **meaningfully without internet**:

- Symptom triage engine runs entirely in-browser (no API calls)
- First-aid guides are embedded in the app bundle
- All 129 hospital records are preloaded as local JS objects
- All 50 medical phrases in 10 languages are bundled — no translation API needed
- Emergency phrases work without any network connection
- Service worker caches the app shell on first load
- Online/offline state is clearly shown via the OfflineBanner component
- Offline mode never feels broken — it feels intentionally designed

---

## Architecture

```
frontend/
├── src/
│   ├── data/
│   │   ├── doctors.js           # 129 hospitals across India with GPS, cost, languages
│   │   ├── pharmacies.js        # Pharmacy data with 24×7 flag and GPS
│   │   ├── symptomRules.js      # 10 symptom categories with triage rules & red flags
│   │   ├── firstaid.js          # 10 first-aid guides (steps, do-nots, escalation)
│   │   ├── medicalPhrases.js    # 50 phrases × 10 languages (6 categories)
│   │   ├── emergencyPhrases.js  # Legacy phrase cards + ALL_LANGS (22 languages)
│   │   ├── phrases.js           # Extended phrase dictionary for translator
│   │   ├── facilities.js        # Facility data for NearbyOptions component
│   │   └── demoScenarios.js     # Evaluator demo scenarios
│   ├── logic/
│   │   ├── triageEngine.js      # Rule-based urgency classifier with red-flag detection
│   │   ├── recommendationEngine.js  # Weighted facility scorer
│   │   ├── distance.js          # GPS + Haversine distance calculation
│   │   └── ai.js                # Offline fallback symptom analysis + Ollama integration
│   ├── components/
│   │   ├── App.jsx              # Root component, navigation, dark mode, screen routing
│   │   ├── MapScreen.jsx        # Hospital/pharmacy map with state zoom, drag divider
│   │   ├── SymptomFlow.jsx      # Guided triage questionnaire with progress bar
│   │   ├── LanguageScreen.jsx   # 50 phrases, 10 languages, search, category tabs
│   │   ├── FirstAid.jsx         # Offline first-aid guide browser
│   │   ├── Guidance.jsx         # Triage result with urgency, advice, hospital CTA
│   │   ├── EmergencyOverlay.jsx # Full-screen emergency alert with 112/108 buttons
│   │   ├── OfflineBanner.jsx    # Online/offline status indicator
│   │   ├── Badges.jsx           # Trust, cost, urgency badge components (dark-aware)
│   │   ├── NearbyOptions.jsx    # Facility cards with map/list view
│   │   ├── PhraseCards.jsx      # Legacy multilingual phrase cards with translator
│   │   ├── PharmacyMode.jsx     # Pharmacy-specific view
│   │   ├── SOSButton.jsx        # Emergency SOS button component
│   │   └── InstallPrompt.jsx    # PWA install prompt
│   ├── main.jsx                 # Entry point + SW registration
│   └── index.css                # Tailwind v4 + design tokens + dark mode vars
└── public/
    └── sw.js                    # Service worker (cache-first strategy, v3)
```

---

## How Triage Works

1. User clicks **Start Now** → symptom category picker appears (10 categories)
2. User selects a category (e.g. Fever, Chest Pain, Injury)
3. App asks **2–5 targeted follow-up questions** per category
4. **Red-flag detection** runs first — if triggered, emergency overlay appears immediately with 112/108 buttons
5. Urgency is classified: `self_care → pharmacy → clinic → specialist → hospital → emergency`
6. Rationale is shown in plain language with recommended action
7. User can tap **Find Nearby Hospitals** to open the map filtered by doctor type

---

## Symptom Categories

| Category | Icon | Type |
|---|---|---|
| Fever | 🌡️ | Common |
| Stomach Issue | 🤢 | Common |
| Injury / Wound | 🩹 | Common |
| Breathing Problem | 😮💨 | Emergency |
| Chest Pain | 💔 | Emergency |
| Dehydration | 💧 | Common |
| Allergic Reaction | 🤧 | Emergency |
| Women's Health | 🌸 | Common |
| Child Health | 👶 | Common |
| Senior Citizen Emergency | 👴 | Emergency |

---

## First Aid Guides (10 Scenarios)

| Scenario | Icon |
|---|---|
| Cuts & Bleeding | 🩸 |
| Sprain / Twisted Ankle | 🦶 |
| Fever Management | 🌡️ |
| Dehydration | 💧 |
| Food Poisoning | 🤢 |
| Fainting / Loss of Consciousness | 😵 |
| Minor Burns | 🔥 |
| Allergic Reaction | 🤧 |
| Heat Exhaustion | ☀️ |
| Insect Bite / Sting | 🐝 |

Each guide includes: step-by-step instructions, ⚠️ Do Not list, 🏥 When to Escalate, and 📞 Call 112 / 🚑 Call 108 buttons.

---

## Medical Phrases (50 Phrases × 10 Languages)

| Category | Phrases |
|---|---|
| 🚨 Emergency | 10 phrases (ambulance, heart attack, bleeding, etc.) |
| 🤒 Symptoms | 10 phrases (chest pain, fever, dizziness, vomiting, etc.) |
| 🫀 Body & Pain | 10 phrases (arm, back, leg, fracture, burns, etc.) |
| 🏥 At Hospital | 10 phrases (X-ray, blood test, allergies, cost, etc.) |
| 💊 Conditions | 5 phrases (asthma, diabetes, epilepsy, BP, kidney) |
| 🙏 Asking for Help | 5 phrases (help, lost, translator, family, speak slowly) |

**Languages:** Hindi · Bengali · Telugu · Marathi · Tamil · Gujarati · Kannada · Punjabi · Malayalam · Odia

Features: live search with keyword highlighting, category tabs, language selector, 📋 copy button, pronunciation guides in brackets.

---

## Hospital Coverage

- **129 hospitals** across India
- **States covered:** J&K/Ladakh, Delhi NCR, Punjab/Chandigarh/Himachal, Uttarakhand, Uttar Pradesh, Bihar/Jharkhand, Rajasthan, MP/Chhattisgarh, Gujarat, Maharashtra, Goa, Karnataka, Tamil Nadu, Kerala, Telangana/AP, West Bengal, Odisha, Assam/Northeast, Haryana, Puducherry
- Each record includes: name, specialty, GPS coordinates, cost range, languages spoken, trust badge, phone number, rating, conditions treated
- Map features: state-zoom dropdown, tap-to-set-location, draggable map/list divider, route navigation via OSRM, expand/shrink button

---

## Dark Mode

- Detects system preference on first load (`prefers-color-scheme`)
- Manual toggle in navbar (☀️ sun = switch to light, 🌙 moon = switch to dark)
- Applies `dark` class to `<html>` element
- All components fully dark-mode aware using Tailwind `dark:` variants
- CSS design tokens (`--bg-surface`, `--text-primary`, etc.) update via `html.dark` selector

---

## How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/Coffee-0verflow/HealBuddy.git

cd HealBuddy/frontend

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Run locally
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| Maps | React-Leaflet + OpenStreetMap |
| Routing | OSRM (open-source, online only) |
| Offline | Service Worker (cache-first, sw.js v3) |
| PWA | Web App Manifest + InstallPrompt |
| AI (optional) | Ollama local LLM (llama3.2) with offline fallback |

---

## Privacy

HealBuddy collects **no personal health data**. All symptom processing happens locally in the browser. No data is transmitted to any server. This is a frontend-only prototype.

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
- Offline map tile caching for full offline map support
- Push notifications for health alerts

---

*Built for India. Designed for the world.*
