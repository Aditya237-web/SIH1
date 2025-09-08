app.post('/api/driver/login', (req, res) => {
  const { busId, driverId, password } = req.body;

  // Temporary hardcoded credentials
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