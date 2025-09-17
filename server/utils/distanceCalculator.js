const cityRegistry = require('./cityRegistry');

function toRad(deg) {
  return deg * Math.PI / 180;
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function getDistance(routeString) {
  const [fromName, toName] = routeString.split(' - ').map(s => s.trim());
  const from = cityRegistry.find(c => c.name.toLowerCase() === fromName.toLowerCase());
  const to = cityRegistry.find(c => c.name.toLowerCase() === toName.toLowerCase());

  if (!from || !to) return null;

  return haversine(from.lat, from.lon, to.lat, to.lon);
}

module.exports = { getDistance };
