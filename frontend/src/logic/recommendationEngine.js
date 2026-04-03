import { facilities } from '../data/facilities';

function scoreLanguage(facility, preferredLangs = ["Hindi", "English"]) {
  return preferredLangs.filter(l => facility.languages.includes(l)).length * 5;
}

function scoreTrust(facility) {
  const trustTags = ["verified", "24x7", "emergency_capable", "govt_listed", "tourist_friendly"];
  return facility.tags.filter(t => trustTags.includes(t)).length * 4;
}

function scoreSpecialty(facility, specialties = []) {
  return specialties.filter(s => facility.specialties.includes(s)).length * 10;
}

function scoreUrgencyMatch(facility, urgency) {
  if (urgency === "emergency" && facility.tags.includes("emergency_capable")) return 30;
  if (urgency === "hospital" && (facility.type === "govt_hospital" || facility.type === "private_hospital")) return 20;
  if (urgency === "clinic" && facility.type === "clinic") return 15;
  if (urgency === "pharmacy" && facility.type === "pharmacy") return 20;
  return 0;
}

function scoreCost(facility, urgency) {
  if (urgency === "emergency") return 0; // cost less important in emergency
  if (facility.costBadge === "budget") return 10;
  if (facility.costBadge === "moderate") return 5;
  return 0;
}

function scoreDistance(facility) {
  if (facility.distance <= 1) return 20;
  if (facility.distance <= 3) return 15;
  if (facility.distance <= 5) return 10;
  return 5;
}

export function getRecommendations(city, urgency, specialties = [], limit = 4) {
  const cityFacilities = facilities.filter(f => f.city.toLowerCase() === city.toLowerCase());
  if (cityFacilities.length === 0) return [];

  const scored = cityFacilities.map(f => {
    const score =
      scoreUrgencyMatch(f, urgency) +
      scoreSpecialty(f, specialties) +
      scoreDistance(f) +
      scoreTrust(f) +
      scoreLanguage(f) +
      scoreCost(f, urgency) +
      (f.openNow ? 8 : 0) +
      (f.touristFriendly ? 5 : 0);
    return { ...f, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
