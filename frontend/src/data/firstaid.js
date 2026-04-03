export const firstAidGuides = [
  {
    id: "cuts",
    label: "Cuts & Bleeding",
    icon: "🩸",
    steps: [
      "Apply firm pressure with a clean cloth or bandage for 10–15 minutes without lifting.",
      "If bleeding soaks through, add more cloth on top — do not remove the first layer.",
      "Once bleeding slows, clean the wound gently with clean water.",
      "Apply antiseptic (Dettol / Savlon) if available and cover with a sterile bandage.",
      "Keep the wound elevated above heart level if possible."
    ],
    doNot: ["Do not remove embedded objects from the wound.", "Do not use cotton wool directly on the wound.", "Do not blow on the wound."],
    escalate: "Go to hospital if: bleeding does not stop after 15 minutes, wound is deep or gaping, caused by a rusty object, or signs of infection appear (redness, pus, fever)."
  },
  {
    id: "sprain",
    label: "Sprain / Twisted Ankle",
    icon: "🦶",
    steps: [
      "Rest immediately — stop walking on the injured limb.",
      "Apply ice or a cold pack wrapped in cloth for 20 minutes every 2 hours.",
      "Compress with an elastic bandage — firm but not too tight.",
      "Elevate the limb above heart level to reduce swelling.",
      "Take paracetamol or ibuprofen for pain if available."
    ],
    doNot: ["Do not apply heat in the first 48 hours.", "Do not massage the injured area immediately.", "Do not walk on a suspected fracture."],
    escalate: "Go to hospital if: severe swelling, inability to bear any weight, numbness, or if fracture is suspected."
  },
  {
    id: "fever",
    label: "Fever Management",
    icon: "🌡️",
    steps: [
      "Take paracetamol (500mg–1g for adults) as directed on the package.",
      "Drink plenty of fluids — water, ORS, coconut water, or diluted juice.",
      "Rest in a cool, well-ventilated area.",
      "Use a damp cloth on the forehead for comfort.",
      "Remove excess clothing and blankets if temperature is very high."
    ],
    doNot: ["Do not give aspirin to children under 16.", "Do not use ice-cold water baths.", "Do not ignore fever above 103°F or lasting more than 3 days."],
    escalate: "Go to hospital if: fever above 103°F, fever with rash, difficulty breathing, confusion, or fever lasting more than 3 days."
  },
  {
    id: "dehydration",
    label: "Dehydration",
    icon: "💧",
    steps: [
      "Start drinking ORS (Oral Rehydration Salts) immediately — available at any pharmacy.",
      "If ORS is unavailable, mix 1 litre water + 6 teaspoons sugar + ½ teaspoon salt.",
      "Sip slowly and steadily — do not gulp large amounts at once.",
      "Rest in a cool, shaded area.",
      "Avoid tea, coffee, alcohol, and sugary drinks."
    ],
    doNot: ["Do not drink only plain water if severely dehydrated — electrolytes are needed.", "Do not ignore signs of severe dehydration."],
    escalate: "Go to hospital if: no urination for 8+ hours, confusion or extreme weakness, unable to keep fluids down, or child is unresponsive."
  },
  {
    id: "food_poisoning",
    label: "Food Poisoning",
    icon: "🤢",
    steps: [
      "Stop eating solid food temporarily and rest.",
      "Sip ORS or clear fluids frequently to prevent dehydration.",
      "Let vomiting or diarrhea run its course — do not suppress immediately.",
      "After 4–6 hours without vomiting, try bland foods: rice, toast, banana.",
      "Take ORS after every loose stool."
    ],
    doNot: ["Do not take anti-diarrheal medicine without medical advice if there is blood in stool.", "Do not eat dairy, spicy, or fatty foods."],
    escalate: "Go to hospital if: blood in vomit or stool, symptoms lasting more than 24 hours, signs of severe dehydration, or high fever."
  },
  {
    id: "fainting",
    label: "Fainting / Loss of Consciousness",
    icon: "😵",
    steps: [
      "Lay the person flat on their back immediately.",
      "Raise their legs 30 cm above heart level to improve blood flow to the brain.",
      "Loosen tight clothing around neck and chest.",
      "Ensure fresh air — fan them or move to a ventilated area.",
      "If they regain consciousness, keep them lying down for 10–15 minutes."
    ],
    doNot: ["Do not give anything to eat or drink until fully conscious.", "Do not leave the person alone.", "Do not prop them up in a sitting position immediately."],
    escalate: "Call 112 if: person does not regain consciousness within 1–2 minutes, has chest pain, difficulty breathing, or if this is a senior citizen or known heart patient."
  },
  {
    id: "burns",
    label: "Minor Burns",
    icon: "🔥",
    steps: [
      "Cool the burn immediately under cool (not cold) running water for 10–20 minutes.",
      "Remove jewellery or tight items near the burn area before swelling starts.",
      "Cover loosely with a clean, non-fluffy bandage or cling film.",
      "Take paracetamol for pain relief."
    ],
    doNot: ["Do not use ice, butter, toothpaste, or any home remedy on burns.", "Do not burst blisters.", "Do not use fluffy cotton or adhesive bandages directly on the burn."],
    escalate: "Go to hospital if: burn is larger than your palm, on face/hands/genitals/joints, caused by chemicals or electricity, or if blisters are large."
  },
  {
    id: "allergic_reaction",
    label: "Allergic Reaction",
    icon: "🤧",
    steps: [
      "Remove or avoid the trigger if known (food, insect, medicine).",
      "For mild rash/hives: take an antihistamine (cetirizine or loratadine) available at pharmacy.",
      "Apply calamine lotion for skin itching.",
      "Monitor closely for any worsening symptoms."
    ],
    doNot: ["Do not ignore swelling of face, lips, or throat.", "Do not delay if breathing becomes difficult."],
    escalate: "Call 112 immediately if: throat swelling, difficulty breathing, dizziness, or rapid worsening — this is anaphylaxis, a life-threatening emergency."
  },
  {
    id: "heat_exhaustion",
    label: "Heat Exhaustion",
    icon: "☀️",
    steps: [
      "Move the person to a cool, shaded area immediately.",
      "Lay them down and elevate their legs slightly.",
      "Remove excess clothing and apply cool, damp cloths to skin.",
      "Give cool water or ORS to drink if fully conscious.",
      "Fan them to increase cooling."
    ],
    doNot: ["Do not give fluids to an unconscious person.", "Do not leave them in the sun.", "Do not give alcohol or caffeine."],
    escalate: "Call 112 if: person loses consciousness, body temperature above 104°F, confusion, seizures, or no improvement after 30 minutes of cooling."
  },
  {
    id: "insect_bite",
    label: "Insect Bite / Sting",
    icon: "🐝",
    steps: [
      "Remove the stinger if visible by scraping sideways with a card — do not squeeze.",
      "Wash the area with soap and water.",
      "Apply a cold pack to reduce swelling and pain.",
      "Take antihistamine for itching and mild allergic reaction.",
      "Apply hydrocortisone cream if available."
    ],
    doNot: ["Do not squeeze the stinger — it releases more venom.", "Do not scratch the bite area."],
    escalate: "Call 112 immediately if: swelling of face or throat, difficulty breathing, dizziness, or rapid heartbeat — signs of anaphylaxis."
  }
];
