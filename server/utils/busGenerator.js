// server/utils/busGenerator.js

const { getDistanceKm, findCity } = require('./geo');
const cityRegistry = require('./cityRegistry');

// Increase your radius to 700 km
const RADIUS_KM = 700;

// Possible bus types
const BUS_TYPES = ['Roadways', 'Private', 'E-Bus'];

function pickNearbyCities(origin) {
  console.log(`\n--- pickNearbyCities for ${origin.name} (radius: ${RADIUS_KM} km) ---`);

  const candidates = cityRegistry.filter(c => {
    if (c.name === origin.name) return false;
    const dist = getDistanceKm(origin.lat, origin.lon, c.lat, c.lon);
    console.log(`Distance ${origin.name} → ${c.name}: ${dist.toFixed(1)} km`);
    return dist <= RADIUS_KM;
  });

  console.log('Candidates within radius:', candidates.map(c => c.name));
  return candidates.sort(() => 0.5 - Math.random()).slice(0, 3);
}

function randomBusType() {
  return BUS_TYPES[Math.floor(Math.random() * BUS_TYPES.length)];
}

function generateNearbyBuses(cityName) {
  console.log(`\n=== generateNearbyBuses("${cityName}") ===`);
  const origin = findCity(cityName, cityRegistry);
  console.log('Origin lookup result:', origin);

  if (!origin) {
    console.warn(`⚠️  "${cityName}" not in registry.`);
    return [];
  }

  const stops = pickNearbyCities(origin);
  if (stops.length === 0) {
    console.warn(`⚠️  No stops within ${RADIUS_KM} km of ${origin.name}.`);
    return [];
  }

  const buses = stops.map(stop => {
    const randNum   = Math.floor(Math.random() * 900 + 100);
    const offsetLat = (Math.random() - 0.5) * 0.5;
    const offsetLon = (Math.random() - 0.5) * 0.5;
    const type      = randomBusType();

    return {
      busId:     `B-${origin.state}${randNum}`,
      route:     `${stop.name} → ${origin.name}`,
      latitude:  parseFloat((origin.lat + offsetLat).toFixed(5)),
      longitude: parseFloat((origin.lon + offsetLon).toFixed(5)),
      crowdLevel: ['low','medium','high'][Math.floor(Math.random()*3)],
      status:     ['Running','Delayed','Arriving'][Math.floor(Math.random()*3)],
      eta:        `${Math.floor(Math.random()*20 + 5)} mins`,
      busType:    type
    };
  });

  console.log('Generated buses:', buses);
  return buses;
}

module.exports = { generateNearbyBuses };