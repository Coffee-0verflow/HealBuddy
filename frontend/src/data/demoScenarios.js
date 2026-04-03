export const demoScenarios = [
  {
    id: "s1",
    title: "Tourist with Fever in Manali",
    emoji: "🌡️",
    description: "A solo traveler from Delhi develops high fever and body ache on day 2 of a Manali trip.",
    city: "Manali",
    symptomId: "fever",
    answers: { temp: "100–103°F / Moderate", duration: "1–3 days", symptoms: "Headache / body ache" },
    expectedUrgency: "clinic",
    persona: "Solo traveler, 28 years old, no known conditions"
  },
  {
    id: "s2",
    title: "Child Vomiting in Jaipur",
    emoji: "👶",
    description: "A 4-year-old child starts vomiting repeatedly during a family trip to Jaipur. Parents are worried.",
    city: "Jaipur",
    symptomId: "child_health",
    answers: { age: "1–5 years", symptom: "Vomiting / diarrhea", duration: "12–24 hours" },
    expectedUrgency: "clinic",
    persona: "Family with young child, visiting Rajasthan"
  },
  {
    id: "s3",
    title: "Senior Citizen Chest Pain in Varanasi",
    emoji: "💔",
    description: "A 68-year-old pilgrim visiting Varanasi Ghats experiences chest tightness and sweating.",
    city: "Varanasi",
    symptomId: "chest_pain",
    answers: { type: "Tight / pressure / squeezing", radiation: "To left arm or jaw", other: "Sweating / nausea" },
    expectedUrgency: "emergency",
    persona: "Senior citizen, 68 years old, known hypertension"
  },
  {
    id: "s4",
    title: "Solo Female Traveler Sprain in Goa",
    emoji: "🦶",
    description: "A solo female traveler twists her ankle on a beach path in Goa. Swelling and pain, but conscious.",
    city: "Goa",
    symptomId: "injury",
    answers: { type: "Sprain / twisted ankle", bleeding: "No bleeding", consciousness: "Yes, fully alert" },
    expectedUrgency: "clinic",
    persona: "Solo female traveler, 31 years old, tourist"
  },
  {
    id: "s5",
    title: "Food Poisoning in Rishikesh",
    emoji: "🤢",
    description: "A backpacker in Rishikesh has severe vomiting and diarrhea after eating at a local dhaba.",
    city: "Rishikesh",
    symptomId: "stomach",
    answers: { type: "Both vomiting and diarrhea", severity: "Moderate – affecting daily activity", blood: "No", duration: "6–24 hours" },
    expectedUrgency: "clinic",
    persona: "Backpacker, 24 years old, traveling solo"
  },
  {
    id: "s6",
    title: "Asthma Attack in Remote Area",
    emoji: "😮‍💨",
    description: "A trekker in a remote Himalayan area experiences sudden breathing difficulty. No inhaler available.",
    city: "Spiti",
    symptomId: "breathing",
    answers: { severity: "Moderate – noticeable effort", onset: "Gradually over hours", history: "Asthma" },
    expectedUrgency: "hospital",
    persona: "Trekker, 35 years old, known asthmatic, no inhaler"
  }
];
