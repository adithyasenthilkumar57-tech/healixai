import { HEALTHCARE_FACILITIES } from '@/data/healthcareFacilities';

/**
 * Disease / Symptom Category Mapping Rules for AI Hospital Recommendation
 */
const SPECIALTY_MAP = {
  // Cardiology / Heart
  'chest pain': ['Cardiology', 'Emergency', 'Trauma'],
  'heart attack': ['Cardiology', 'Interventional Cardiology', 'Cardiothoracic Surgery'],
  'palpitations': ['Cardiology', 'Internal Medicine'],
  'hypertension': ['Cardiology', 'Nephrology', 'Internal Medicine'],

  // Neurology / Brain & Stroke
  'stroke': ['Neurology', 'Neurosurgery', 'Polytrauma Unit'],
  'paralysis': ['Neurology', 'Physiotherapy'],
  'severe headache': ['Neurology', 'General Medicine'],

  // Gynecology / Maternity / Pregnancy
  'pregnancy': ['Obstetrics & Gynecology', 'Maternity', 'Pediatrics'],
  'labor pain': ['Maternity', 'Obstetrics & Gynecology', 'NICU'],
  'women health': ['Obstetrics & Gynecology'],

  // Pediatrics / Child
  'child fever': ['Pediatrics', 'Neonatal ICU'],
  'pediatric care': ['Pediatrics'],

  // Ophthalmology / Eye
  'eye injury': ['Ophthalmology', 'Retina Care'],
  'blurred vision': ['Ophthalmology'],
  'cataract': ['Ophthalmology'],

  // Nephrology / Dialysis
  'kidney failure': ['Nephrology', 'Dialysis'],
  'dialysis needed': ['Nephrology', 'Dialysis'],

  // Oncology / Cancer
  'tumor': ['Oncology', 'Medical Oncology'],
  'cancer care': ['Oncology'],

  // Trauma & General Emergency
  'unconscious': ['Emergency', 'Casualty', 'Level 1 Trauma & Emergency'],
  'fracture': ['Orthopedics', 'Trauma Care', 'Spine Surgery'],
  'accident': ['Level 1 Trauma & Emergency', 'Casualty'],
};

/**
 * Calculate distance between two lat/lng coordinates (Haversine Formula)
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 5.0;
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

/**
 * Estimate travel time in minutes based on distance & urban traffic factor
 */
export function estimateTravelTimeMinutes(distKm) {
  const avgSpeedKmh = distKm < 5 ? 25 : 40; // City vs highway speed
  const timeHours = distKm / avgSpeedKmh;
  const mins = Math.ceil(timeHours * 60);
  return mins < 3 ? '3-5 mins' : `${mins} mins`;
}

/**
 * AI Hospital Recommendation Engine
 * Recommends facilities based on User Location, Symptoms/Condition, Radius & Urgency
 */
export function recommendHospitals({
  userLat = 11.1085,
  userLng = 77.3411,
  symptomQuery = '',
  condition = '',
  maxRadiusKm = 50,
  filterType = 'all',
  require24x7 = false,
  requireGovt = false,
}) {
  const query = (symptomQuery || condition).toLowerCase();

  // Find matching target specialties
  let matchedSpecialties = [];
  for (const [key, specialties] of Object.entries(SPECIALTY_MAP)) {
    if (query.includes(key)) {
      matchedSpecialties.push(...specialties);
    }
  }

  // Filter facilities
  const processed = HEALTHCARE_FACILITIES.map((facility) => {
    const dist = calculateDistanceKm(userLat, userLng, facility.lat, facility.lng);
    const travelTime = estimateTravelTimeMinutes(dist);

    // Calculate AI Match Score (0 - 100)
    let aiScore = 50; // Base score

    // Specialty match bonus
    const hasSpecialtyMatch = facility.specialties.some((s) =>
      matchedSpecialties.some((m) => s.toLowerCase().includes(m.toLowerCase()))
    );
    if (hasSpecialtyMatch) aiScore += 35;

    // Emergency & 24x7 readiness bonus
    if (facility.open24) aiScore += 10;
    if (facility.hasBloodBank) aiScore += 5;
    if (facility.rating >= 4.5) aiScore += 10;

    // Distance penalty
    aiScore -= Math.min(dist * 0.5, 25);
    aiScore = Math.max(10, Math.min(99, Math.round(aiScore)));

    return {
      ...facility,
      distanceKm: dist,
      travelTime,
      aiMatchScore: aiScore,
      isAiRecommended: hasSpecialtyMatch,
    };
  });

  // Apply filters
  let filtered = processed.filter((f) => f.distanceKm <= maxRadiusKm);

  if (filterType !== 'all') {
    filtered = filtered.filter((f) => f.type === filterType || f.subType === filterType);
  }
  if (require24x7) {
    filtered = filtered.filter((f) => f.open24);
  }
  if (requireGovt) {
    filtered = filtered.filter((f) => f.govt);
  }

  // Sort by AI score first if symptom search active, else by distance
  filtered.sort((a, b) => {
    if (matchedSpecialties.length > 0) {
      return b.aiMatchScore - a.aiMatchScore;
    }
    return a.distanceKm - b.distanceKm;
  });

  return {
    recommended: filtered.filter((f) => f.isAiRecommended || f.aiMatchScore > 75),
    allFacilities: filtered,
    matchedSpecialties,
  };
}
