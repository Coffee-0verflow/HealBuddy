import { fallbackPhrases } from '../data/phrases';

const OLLAMA_URL = 'http://localhost:11434/api/generate';

/**
 * Uses local Ollama to translate or falls back to static dictionary
 */
export async function translateOffline(text, targetLang) {
  // Check exact static dictionary first
  if (fallbackPhrases[text] && fallbackPhrases[text][targetLang]) {
    return fallbackPhrases[text][targetLang];
  }

  // Smarter fuzzy fallback if Ollama is not available natively
  const lower = text.toLowerCase();
  let matchedPhrase = null;

  if (lower.includes('pain') || lower.includes('hurt') || lower.includes('ache')) matchedPhrase = "I am in pain";
  else if (lower.includes('fever') || lower.includes('hot')) matchedPhrase = "I have fever";
  else if (lower.includes('help') || lower.includes('save')) matchedPhrase = "Help me";
  else if (lower.includes('doctor') || lower.includes('medic')) matchedPhrase = "I need a doctor";
  else if (lower.includes('hospital') || lower.includes('clinic')) matchedPhrase = "Where is the hospital?";
  else if (lower.includes('ambulance') || lower.includes('emergency')) matchedPhrase = "Call an ambulance";
  else if (lower.includes('bleed') || lower.includes('cut')) matchedPhrase = "I am bleeding";
  else if (lower.includes('dizzy') || lower.includes('faint')) matchedPhrase = "I feel dizzy";
  else if (lower.includes('water') || lower.includes('thirsty')) matchedPhrase = "I need water";

  try {
    const prompt = `Translate this medical emergency phrase to ${targetLang}. Return ONLY the direct translation text and nothing else: "${text}"`;
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2', // use a lightweight model suitable for local
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) throw new Error('Ollama not reachable');
    
    const data = await response.json();
    return data.response.trim();
  } catch (err) {
    if (matchedPhrase && fallbackPhrases[matchedPhrase] && fallbackPhrases[matchedPhrase][targetLang]) {
      return fallbackPhrases[matchedPhrase][targetLang];
    }
    console.warn("Ollama unavailable, using fallback generic error for translation.", err);
    return `[Translation unavailable for: ${text}]`;
  }
}

/**
 * Uses local Ollama to evaluate symptoms or falls back to simple rule-based
 */
export async function analyzeSymptomsOffline(symptomText) {
  try {
    const prompt = `
You are an offline emergency medical AI. The patient says: "${symptomText}".
Output ONLY a JSON object (no markdown, no quotes) with these exact keys:
{
  "severity": "mild" | "moderate" | "severe" | "critical",
  "doctor_type": "General Physician" | "Specialist" | "Hospital" | "Emergency Care",
  "advice": "A short, actionable 1-sentence advice or first aid instruction."
}`;

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) throw new Error('Ollama not reachable');
    
    const data = await response.json();
    // Parse the JSON safely (LLMs might add markdown backticks)
    let jsonStr = data.response.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);

  } catch (err) {
    console.warn("Ollama unavailable, using fallback logic for symptoms.", err);
    
    // --- Detailed Offline Fallback Rules ---
    const lower = symptomText.toLowerCase();
    let adviceText = "Please monitor your symptoms closely. Drink plenty of water and rest. If symptoms worsen, seek medical assistance.";
    let doctorType = "General Physician";
    let severity = "low";

    if (lower.includes('chest') || lower.includes('breath') || lower.includes('heart')) {
      severity = "critical";
      doctorType = "Cardiologist / Emergency";
      adviceText = `CRITICAL ALERT: Possible Cardiac Issue.
1. DO NOT DRIVE yourself. Have someone else drive or demand an ambulance.
2. Tell the patient to sit down, rest, and try to keep calm.
3. Loosen any tight clothing around the neck and waist.
4. If they have prescribed heart medication (like Nitroglycerin), help them take it immediately.
5. If the patient becomes unconscious and unresponsive, begin CPR immediately.`;
      
    } else if (lower.includes('bleed') || lower.includes('cut') || lower.includes('injury') || lower.includes('accident')) {
      severity = "severe";
      doctorType = "Emergency Care";
      adviceText = `EMERGENCY: Bleeding / Trauma Protocol.
1. Wash your hands if possible before treating.
2. Apply firm, direct pressure exactly on the wound using a clean cloth, towel, or sterile gauze.
3. Elevate the injured area above the heart if it's a limb to reduce blood flow.
4. DO NOT remove the cloth if blood soaks through; just add more layers on top.
5. For deep cuts, continue applying maximum pressure while heading directly to the ER.`;
      
    } else if (lower.includes('burn') || lower.includes('fire')) {
      severity = "severe";
      doctorType = "Burn Center / ER";
      adviceText = `EMERGENCY: Burn Management Protocol.
1. Immediately run cool (not cold) tap water over the burn for at least 15-20 minutes.
2. Remove any tight items like rings or belts near the burned area before it swells.
3. DO NOT apply ice, butter, toothpaste, or ointments as this can trap heat and cause severe infection.
4. Cover the burn loosely with a sterile, non-fluffy dressing or clear cling film.
5. Seek immediate hospital care for extensive or deep burns (face, hands, groin).`;
      
    } else if (lower.includes('fracture') || lower.includes('broken') || lower.includes('bone')) {
      severity = "moderate";
      doctorType = "Orthopedic / ER";
      adviceText = `EMERGENCY: Suspected Bone Fracture.
1. Keep the injured person entirely still. Do not attempt to realign the bone or push a bone back in.
2. Immobilize the injured area. Use a makeshift splint (rolled up newspapers or wooden boards) wrapped loosely.
3. Apply an ice pack wrapped in cloth to limit swelling and help relieve pain.
4. Treat for shock if the person feels faint or is breathing in short rapid breaths.
5. Head to the nearest Emergency Room.`;
      
    } else if (lower.includes('animal') || lower.includes('bite') || lower.includes('dog')) {
      severity = "moderate";
      doctorType = "Hospital / General Physician";
      adviceText = `ANIMAL BITE PROTOCOL: Rabies / Infection Risk.
1. Stop any bleeding by applying direct pressure.
2. Immediately wash the wound deeply with copious amounts of soap and warm water for at least 5-10 minutes. 
3. Apply over-the-counter antibiotic cream if available and cover with a sterile bandage.
4. You MUST visit a doctor immediately for a Tetanus booster and Rabies post-exposure vaccinations.`;
      
    } else if (lower.includes('dizz') || lower.includes('faint') || lower.includes('unconscious')) {
      severity = "moderate";
      doctorType = "General Physician";
      adviceText = `DIZZINESS / FAINTING PROTOCOL.
1. Have the person lie flat on their back immediately to prevent falling and injury.
2. Elevate their legs about 12 inches above their heart to restore blood flow to the brain.
3. Loosen tight belts, collars, or restrictive clothing.
4. Once they awake, give them a glass of cool water or fruit juice (for natural sugar).
5. If they do not wake up within 1 minute, or if they have chest pain, call an ambulance.`;

    } else if (lower.includes('fever') || lower.includes('temperature') || lower.includes('hot')) {
      severity = "moderate";
      doctorType = "General Physician";
      adviceText = `HIGH FEVER MANAGEMENT.
1. Do not bundle up in heavy blankets; this traps heat. Wear lightweight clothing.
2. Take a lukewarm sponge bath (avoid freezing cold water).
3. Stay highly hydrated by drinking massive amounts of water, ORS (Oral Rehydration Salts), or clear broths.
4. Take standard paracetamol (acetaminophen) to safely reduce temperature if needed.
5. If the fever crosses 103°F (39.5°C) or lasts over 3 days, see a doctor urgently.`;

    } else if (lower.includes('vomit') || lower.includes('food poison') || lower.includes('stomach') || lower.includes('nausea')) {
      severity = "low";
      doctorType = "General Physician";
      adviceText = `GASTROINTESTINAL PROTOCOL.
1. Rest your stomach ideally by not eating solid food for a few hours.
2. Sip clear liquids constantly (Water, ORS, weak tea) to prevent severe dehydration.
3. Avoid dairy, caffeine, alcohol, nicotine, and highly seasoned/fatty foods completely.
4. When you feel ready, ease back into eating with the BRAT diet (Bananas, Rice, Applesauce, Toast).
5. If vomiting lasts more than 24 hours, or you cannot keep liquids down, see a clinic.`;

    } else if (lower.includes('pain') || lower.includes('ache') || lower.includes('sprain')) {
      severity = "low";
      doctorType = "General Physician / Orthopedic";
      adviceText = `PAIN / SPRAIN MANAGEMENT (R.I.C.E Protocol).
1. REST: Stop any activity that causes pain or soreness.
2. ICE: Apply a cold pack (or bag of frozen peas) wrapped in a towel for 15-20 minutes every 2 hours.
3. COMPRESS: Wrap the injured limb with an elastic medical bandage snugly, but not too tight.
4. ELEVATE: Prop the injured area above the level of the heart on pillows to drain fluid away.
5. Seek a clinic if you cannot put any weight on it, or if it looks visibly deformed.`;
    }

    return { severity, doctorType, advice: adviceText };
  }
}
