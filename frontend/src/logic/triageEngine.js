import { symptomRules, urgencyConfig } from '../data/symptomRules';

const URGENCY_ORDER = ["emergency", "hospital", "specialist", "clinic", "pharmacy", "self_care"];

export function runTriage(symptomId, answers) {
  const symptom = symptomRules.find(s => s.id === symptomId);
  if (!symptom) return null;

  const redFlagTriggered = symptom.redFlags?.some(flag =>
    Object.values(answers).some(val => val && val.toString().toLowerCase().includes(flag.toLowerCase().split(" ")[0]))
  );

  let matchedRule = null;
  for (const rule of symptom.rules) {
    const conditionKeys = Object.keys(rule.conditions);
    if (conditionKeys.length === 0) { matchedRule = rule; continue; }
    const matches = conditionKeys.every(key => answers[key] === rule.conditions[key]);
    if (matches) { matchedRule = rule; break; }
  }

  const urgency = matchedRule?.urgency || "clinic";
  const config = urgencyConfig[urgency];

  return {
    symptom,
    urgency,
    config,
    rationale: matchedRule?.rationale || "Based on your symptoms, a clinical evaluation is recommended.",
    redFlagTriggered,
    specialties: symptom.specialties,
    isEmergency: urgency === "emergency" || redFlagTriggered
  };
}

export function getUrgencyRank(urgency) {
  return URGENCY_ORDER.indexOf(urgency);
}
