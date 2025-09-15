const express = require('express');
const cors = require('cors');
const { generateNearbyBuses } = require('./utils/busGenerator');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store for driver locations
let latestLocation = {};

// Root route for Render health check
app.get('/', (req, res) => {
  res.send('✅ SmartBus Bharat backend is live');
});

// Health check route
app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * POST /api/driver/login
 * Simple driver authentication stub.
 */
app.post('/api/driver/login', (req, res) => {
  const { busId, driverId, password } = req.body;
  console.log('🔐 POST /api/driver/login', { busId, driverId });

  if (busId === 'Bus 101' && driverId === 'D-2023' && password === 'smartbus') {
    return res.status(200).json({ busId, driverId, route: 'Modinagar → Meerut' });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

/**
 * POST /api/location
 * Drivers call this to report their current GPS.
 */
app.post('/api/location', (req, res) => {
  const { busId, route, latitude, longitude, timestamp } = req.body;
  latestLocation[busId] = { route, latitude, longitude, timestamp };

  console.log(
    `[${new Date(timestamp).toISOString()}] GPS update:`,
    busId,
    route,
    latitude,
    longitude
  );

  res.status(200).json({ message: 'Location received' });
});

/**
 * GET /api/location/:busId
 * Users call this to fetch the latest GPS for a given bus.
 */
app.get('/api/location/:busId', (req, res) => {
  const location = latestLocation[req.params.busId];
  console.log('👁️ GET /api/location/:busId', req.params.busId, location);

  if (location) {
    return res.status(200).json(location);
  }

  res.status(404).json({ message: 'No location found' });
});

/**
 * GET /api/buses-near/:city
 * Returns up to 3 simulated buses within ~50 km of the given city.
 */
app.get('/api/buses-near/:city', (req, res) => {
  const cityName = req.params.city;
  console.log('🔍 GET /api/buses-near requested for city:', cityName);

  try {
    const buses = generateNearbyBuses(cityName);
    console.log('🚌 generateNearbyBuses returned:', buses);

    if (buses.length > 0) {
      return res.status(200).json(buses);
    } else {
      return res.status(404).json({ message: 'No buses found near this city' });
    }
  } catch (error) {
    console.error('❌ Error in /api/buses-near:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('🔥 Uncaught error:', err);
  res.status(500).json({ message: 'Unexpected server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SmartBus Bharat backend listening on port ${PORT}`);
});