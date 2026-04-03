// Urgency levels: self_care | pharmacy | clinic | specialist | hospital | emergency
export const symptomRules = [
  {
    id: "fever",
    label: "Fever",
    icon: "🌡️",
    category: "common",
    questions: [
      { id: "temp", text: "How high is the fever?", options: ["Below 100°F / Mild", "100–103°F / Moderate", "Above 103°F / High", "Not sure"] },
      { id: "duration", text: "How long have you had the fever?", options: ["Less than 1 day", "1–3 days", "More than 3 days"] },
      { id: "symptoms", text: "Any other symptoms?", options: ["Headache / body ache", "Rash on skin", "Difficulty breathing", "Confusion or drowsiness", "None of these"] }
    ],
    rules: [
      { conditions: { temp: "Above 103°F / High" }, urgency: "hospital", rationale: "High fever above 103°F needs immediate medical evaluation to rule out serious infection." },
      { conditions: { symptoms: "Difficulty breathing" }, urgency: "emergency", rationale: "Fever with breathing difficulty is a red flag. Seek emergency care immediately." },
      { conditions: { symptoms: "Confusion or drowsiness" }, urgency: "emergency", rationale: "Altered consciousness with fever is a medical emergency." },
      { conditions: { symptoms: "Rash on skin", duration: "More than 3 days" }, urgency: "hospital", rationale: "Fever with rash lasting over 3 days may indicate dengue or other serious illness." },
      { conditions: { duration: "More than 3 days" }, urgency: "clinic", rationale: "Fever lasting more than 3 days needs clinical evaluation and possible blood tests." },
      { conditions: { temp: "100–103°F / Moderate" }, urgency: "clinic", rationale: "Moderate fever in a travel setting warrants a clinic visit for proper assessment." },
      { conditions: {}, urgency: "pharmacy", rationale: "Mild fever can be managed with paracetamol, rest, and hydration. Monitor closely." }
    ],
    specialties: ["general", "fever"],
    redFlags: ["Difficulty breathing", "Confusion or drowsiness"]
  },
  {
    id: "stomach",
    label: "Stomach Issue",
    icon: "🤢",
    category: "common",
    questions: [
      { id: "type", text: "What is the main problem?", options: ["Vomiting", "Diarrhea", "Stomach pain / cramps", "Both vomiting and diarrhea"] },
      { id: "severity", text: "How severe is it?", options: ["Mild – manageable", "Moderate – affecting daily activity", "Severe – can't keep anything down"] },
      { id: "blood", text: "Any blood in vomit or stool?", options: ["Yes", "No", "Not sure"] },
      { id: "duration", text: "How long has this been going on?", options: ["Less than 6 hours", "6–24 hours", "More than 24 hours"] }
    ],
    rules: [
      { conditions: { blood: "Yes" }, urgency: "emergency", rationale: "Blood in vomit or stool is a serious red flag requiring immediate hospital care." },
      { conditions: { severity: "Severe – can't keep anything down", duration: "More than 24 hours" }, urgency: "hospital", rationale: "Severe dehydration risk from prolonged vomiting/diarrhea. IV fluids may be needed." },
      { conditions: { severity: "Moderate – affecting daily activity" }, urgency: "clinic", rationale: "Moderate gastro symptoms in a travel setting need clinical evaluation for infection." },
      { conditions: {}, urgency: "pharmacy", rationale: "Mild stomach issues can be managed with ORS, rest, and bland diet. Monitor for worsening." }
    ],
    specialties: ["gastro", "general"],
    redFlags: ["Yes (blood)"]
  },
  {
    id: "injury",
    label: "Injury / Wound",
    icon: "🩹",
    category: "common",
    questions: [
      { id: "type", text: "What type of injury?", options: ["Cut / laceration", "Sprain / twisted ankle", "Fracture suspected", "Head injury", "Burns"] },
      { id: "bleeding", text: "Is there active bleeding?", options: ["Yes – heavy", "Yes – minor", "No bleeding"] },
      { id: "consciousness", text: "Is the person fully conscious and alert?", options: ["Yes, fully alert", "Confused / drowsy", "Unconscious"] }
    ],
    rules: [
      { conditions: { consciousness: "Unconscious" }, urgency: "emergency", rationale: "Unconsciousness after injury is a life-threatening emergency. Call 112 immediately." },
      { conditions: { consciousness: "Confused / drowsy" }, urgency: "emergency", rationale: "Altered consciousness after injury may indicate head trauma. Emergency care needed." },
      { conditions: { type: "Head injury" }, urgency: "hospital", rationale: "Head injuries need imaging and observation even if the person seems fine." },
      { conditions: { type: "Fracture suspected" }, urgency: "hospital", rationale: "Suspected fracture needs X-ray and immobilization at a hospital." },
      { conditions: { bleeding: "Yes – heavy" }, urgency: "hospital", rationale: "Heavy bleeding needs urgent wound care and possible stitches." },
      { conditions: { type: "Burns" }, urgency: "clinic", rationale: "Burns need proper wound assessment and dressing. Avoid home remedies." },
      { conditions: {}, urgency: "clinic", rationale: "Minor injuries benefit from professional wound cleaning and dressing to prevent infection." }
    ],
    specialties: ["orthopedics", "wound_care", "general"],
    redFlags: ["Unconscious", "Confused / drowsy", "Head injury"]
  },
  {
    id: "breathing",
    label: "Breathing Problem",
    icon: "😮‍💨",
    category: "emergency",
    questions: [
      { id: "severity", text: "How difficult is breathing?", options: ["Mild – slightly short of breath", "Moderate – noticeable effort", "Severe – struggling to breathe"] },
      { id: "onset", text: "How did it start?", options: ["Gradually over hours", "Suddenly in minutes", "After eating / insect bite"] },
      { id: "history", text: "Any known condition?", options: ["Asthma", "Allergy", "Heart condition", "None known"] }
    ],
    rules: [
      { conditions: { severity: "Severe – struggling to breathe" }, urgency: "emergency", rationale: "Severe breathing difficulty is a life-threatening emergency. Call 108 now." },
      { conditions: { onset: "Suddenly in minutes" }, urgency: "emergency", rationale: "Sudden onset breathing difficulty may indicate anaphylaxis, cardiac event, or pulmonary embolism." },
      { conditions: { onset: "After eating / insect bite" }, urgency: "emergency", rationale: "Breathing difficulty after eating or a bite suggests severe allergic reaction. Emergency care immediately." },
      { conditions: { severity: "Moderate – noticeable effort" }, urgency: "hospital", rationale: "Moderate breathing difficulty needs urgent evaluation and possible oxygen support." },
      { conditions: {}, urgency: "clinic", rationale: "Mild breathing difficulty should be evaluated by a doctor, especially in a travel setting." }
    ],
    specialties: ["general", "emergency"],
    redFlags: ["Severe – struggling to breathe", "Suddenly in minutes", "After eating / insect bite"]
  },
  {
    id: "chest_pain",
    label: "Chest Pain",
    icon: "💔",
    category: "emergency",
    questions: [
      { id: "type", text: "How does the pain feel?", options: ["Tight / pressure / squeezing", "Sharp / stabbing", "Burning", "Dull ache"] },
      { id: "radiation", text: "Does pain spread anywhere?", options: ["To left arm or jaw", "To back or shoulder", "Stays in chest only"] },
      { id: "other", text: "Any other symptoms?", options: ["Sweating / nausea", "Shortness of breath", "Dizziness / fainting", "None"] }
    ],
    rules: [
      { conditions: { type: "Tight / pressure / squeezing" }, urgency: "emergency", rationale: "Pressure-type chest pain is a classic cardiac warning sign. Call 112 immediately." },
      { conditions: { radiation: "To left arm or jaw" }, urgency: "emergency", rationale: "Pain radiating to left arm or jaw strongly suggests a heart attack. Emergency care now." },
      { conditions: { other: "Sweating / nausea" }, urgency: "emergency", rationale: "Chest pain with sweating and nausea is a high-risk cardiac presentation." },
      { conditions: { other: "Shortness of breath" }, urgency: "emergency", rationale: "Chest pain with breathing difficulty needs immediate emergency evaluation." },
      { conditions: {}, urgency: "hospital", rationale: "Any chest pain in a travel setting should be evaluated at a hospital urgently." }
    ],
    specialties: ["cardiology", "emergency"],
    redFlags: ["Tight / pressure / squeezing", "To left arm or jaw", "Sweating / nausea"]
  },
  {
    id: "dehydration",
    label: "Dehydration",
    icon: "💧",
    category: "common",
    questions: [
      { id: "severity", text: "How are you feeling?", options: ["Thirsty and tired", "Dizzy when standing up", "Very weak, can't stand", "Confused or disoriented"] },
      { id: "urine", text: "When did you last urinate?", options: ["Within last 4 hours", "4–8 hours ago", "More than 8 hours ago"] },
      { id: "cause", text: "What caused this?", options: ["Heat / sun exposure", "Vomiting / diarrhea", "Not drinking enough water", "Strenuous activity"] }
    ],
    rules: [
      { conditions: { severity: "Confused or disoriented" }, urgency: "emergency", rationale: "Confusion from dehydration indicates severe electrolyte imbalance. Emergency care needed." },
      { conditions: { severity: "Very weak, can't stand" }, urgency: "hospital", rationale: "Severe weakness from dehydration may need IV fluids at a hospital." },
      { conditions: { urine: "More than 8 hours ago" }, urgency: "clinic", rationale: "No urination for 8+ hours indicates significant dehydration needing clinical assessment." },
      { conditions: {}, urgency: "pharmacy", rationale: "Mild dehydration can be managed with ORS (oral rehydration salts), rest, and fluids." }
    ],
    specialties: ["general"],
    redFlags: ["Confused or disoriented"]
  },
  {
    id: "allergy",
    label: "Allergic Reaction",
    icon: "🤧",
    category: "emergency",
    questions: [
      { id: "trigger", text: "What triggered the reaction?", options: ["Food", "Insect bite / sting", "Medicine", "Unknown"] },
      { id: "symptoms", text: "What symptoms do you have?", options: ["Rash / hives only", "Swelling of face or throat", "Difficulty breathing", "Rash + dizziness + nausea"] }
    ],
    rules: [
      { conditions: { symptoms: "Swelling of face or throat" }, urgency: "emergency", rationale: "Throat swelling can block airway. This is anaphylaxis – call 112 immediately." },
      { conditions: { symptoms: "Difficulty breathing" }, urgency: "emergency", rationale: "Breathing difficulty from allergy is anaphylaxis. Emergency care now." },
      { conditions: { symptoms: "Rash + dizziness + nausea" }, urgency: "hospital", rationale: "Systemic allergic reaction needs urgent hospital evaluation and antihistamine/epinephrine." },
      { conditions: {}, urgency: "pharmacy", rationale: "Mild rash/hives can be managed with antihistamines. Monitor for worsening." }
    ],
    specialties: ["general", "emergency"],
    redFlags: ["Swelling of face or throat", "Difficulty breathing"]
  },
  {
    id: "womens_health",
    label: "Women's Health",
    icon: "🌸",
    category: "common",
    questions: [
      { id: "type", text: "What is the concern?", options: ["Severe abdominal pain", "Heavy bleeding", "Pregnancy-related concern", "Urinary discomfort / UTI", "General gynaecology"] },
      { id: "severity", text: "How severe is it?", options: ["Mild – manageable", "Moderate – affecting activity", "Severe – very painful"] }
    ],
    rules: [
      { conditions: { type: "Heavy bleeding" }, urgency: "hospital", rationale: "Heavy gynaecological bleeding needs urgent hospital evaluation." },
      { conditions: { type: "Pregnancy-related concern", severity: "Severe – very painful" }, urgency: "emergency", rationale: "Severe pain in pregnancy is an emergency. Seek immediate care." },
      { conditions: { type: "Severe abdominal pain" }, urgency: "hospital", rationale: "Severe abdominal pain in women needs urgent evaluation to rule out serious conditions." },
      { conditions: {}, urgency: "clinic", rationale: "Women's health concerns are best addressed at a clinic with a female doctor available." }
    ],
    specialties: ["general"],
    redFlags: ["Heavy bleeding", "Pregnancy-related concern + Severe"]
  },
  {
    id: "child_health",
    label: "Child Health",
    icon: "👶",
    category: "common",
    questions: [
      { id: "age", text: "How old is the child?", options: ["Under 1 year", "1–5 years", "6–12 years"] },
      { id: "symptom", text: "What is the main symptom?", options: ["High fever", "Vomiting / diarrhea", "Difficulty breathing", "Rash", "Seizure / convulsion", "Not eating / very weak"] },
      { id: "duration", text: "How long has this been going on?", options: ["Less than 12 hours", "12–24 hours", "More than 24 hours"] }
    ],
    rules: [
      { conditions: { symptom: "Seizure / convulsion" }, urgency: "emergency", rationale: "Seizure in a child is a medical emergency. Call 112 immediately." },
      { conditions: { symptom: "Difficulty breathing" }, urgency: "emergency", rationale: "Breathing difficulty in a child needs immediate emergency care." },
      { conditions: { age: "Under 1 year" }, urgency: "hospital", rationale: "Any significant illness in an infant under 1 year needs hospital evaluation." },
      { conditions: { symptom: "High fever", duration: "More than 24 hours" }, urgency: "clinic", rationale: "Persistent fever in a child needs clinical evaluation and possible blood tests." },
      { conditions: {}, urgency: "clinic", rationale: "Children's symptoms should be evaluated by a doctor, especially during travel." }
    ],
    specialties: ["pediatrics", "general"],
    redFlags: ["Seizure / convulsion", "Difficulty breathing"]
  },
  {
    id: "senior_emergency",
    label: "Senior Citizen Emergency",
    icon: "👴",
    category: "emergency",
    questions: [
      { id: "symptom", text: "What is the main concern?", options: ["Chest pain or pressure", "Sudden confusion", "Fall / injury", "Severe weakness", "Stroke symptoms (face drooping, arm weakness, speech difficulty)"] },
      { id: "history", text: "Any known medical conditions?", options: ["Heart disease", "Diabetes", "Hypertension", "None known"] }
    ],
    rules: [
      { conditions: { symptom: "Stroke symptoms (face drooping, arm weakness, speech difficulty)" }, urgency: "emergency", rationale: "These are classic stroke signs. Every minute matters. Call 112 immediately." },
      { conditions: { symptom: "Chest pain or pressure" }, urgency: "emergency", rationale: "Chest pain in a senior citizen is a cardiac emergency until proven otherwise." },
      { conditions: { symptom: "Sudden confusion" }, urgency: "hospital", rationale: "Sudden confusion in elderly may indicate stroke, infection, or metabolic emergency." },
      { conditions: {}, urgency: "hospital", rationale: "Senior citizen emergencies should always be evaluated at a hospital promptly." }
    ],
    specialties: ["cardiology", "general", "emergency"],
    redFlags: ["Stroke symptoms", "Chest pain or pressure"]
  }
];

export const urgencyConfig = {
  emergency: { label: "Emergency", color: "red", bg: "bg-red-600", text: "text-white", border: "border-red-600", icon: "🚨", action: "Call 112 / 108 immediately" },
  hospital:  { label: "Go to Hospital", color: "orange", bg: "bg-orange-500", text: "text-white", border: "border-orange-500", icon: "🏥", action: "Visit nearest hospital now" },
  specialist:{ label: "See a Specialist", color: "yellow", bg: "bg-yellow-500", text: "text-white", border: "border-yellow-500", icon: "👨‍⚕️", action: "Book specialist appointment today" },
  clinic:    { label: "Visit a Clinic", color: "blue", bg: "bg-blue-500", text: "text-white", border: "border-blue-500", icon: "🏨", action: "Visit a clinic or doctor today" },
  pharmacy:  { label: "Pharmacy / Self-Care", color: "green", bg: "bg-green-500", text: "text-white", border: "border-green-500", icon: "💊", action: "Get OTC medicine and rest" },
  self_care: { label: "Self-Care", color: "teal", bg: "bg-teal-500", text: "text-white", border: "border-teal-500", icon: "🏠", action: "Rest, hydrate, and monitor" }
};
