// server/server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 🧠 In-memory store for latest location
let latestLocation = {};

// 🔐 Driver login
app.post('/api/driver/login', (req, res) => {
  const { busId, driverId, password } = req.body;

  if (
    busId === 'Bus 101' &&
    driverId === 'D-2023' &&
    password === 'smartbus'
  ) {
    return res.status(200).json({
      busId,
      driverId,
      route: 'Modinagar → Meerut'
    });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

// 📍 Driver sends location
app.post('/api/location', (req, res) => {
  const { busId, route, latitude, longitude, timestamp } = req.body;
  latestLocation[busId] = { route, latitude, longitude, timestamp };
  console.log(`[${timestamp}] ${busId} on ${route}: ${latitude}, ${longitude}`);
  res.status(200).send({ message: 'Location received' });
});

// 👁️ User fetches location
app.get('/api/location/:busId', (req, res) => {
  const busId = req.params.busId;
  const location = latestLocation[busId];
  if (location) {
    res.status(200).json(location);
  } else {
    res.status(404).json({ message: 'No location found for this bus' });
  }
});

app.listen(5000, () => {
  console.log('🚀 Backend running on http://localhost:5000');
});