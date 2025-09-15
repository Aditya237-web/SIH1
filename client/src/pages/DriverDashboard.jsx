import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function DriverDashboard() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [status, setStatus] = useState('Initializing...');
  const [session, setSession] = useState(null);

  useEffect(() => {
    const storedSession = localStorage.getItem('driverSession');
    if (storedSession) {
      const parsed = JSON.parse(storedSession);
      setSession(parsed);
      setStatus('🔄 Starting location sharing...');
    } else {
      setStatus('❌ No session found. Please login.');
    }
  }, []);

  useEffect(() => {
    let interval;

    if (session) {
      interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setLocation({ lat: latitude, lng: longitude });
            setStatus(`📍 Location updated: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);

            fetch(`${process.env.REACT_APP_API_BASE}/api/location`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                busId: session.busId,
                driverId: session.driverId,
                route: session.route,
                latitude,
                longitude,
                timestamp: new Date().toISOString()
              })
            })
              .then(res => res.json())
              .then(data => console.log('✅ Location sent:', data))
              .catch(err => {
                console.error('❌ Failed to send location:', err);
                setStatus('⚠️ Failed to send location to server');
              });
          },
          () => {
            setStatus('⚠️ Location access denied');
          }
        );
      }, 10000);
    }

    return () => clearInterval(interval);
  }, [session]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#e9edf5' }}>
      <Header />

      <main style={{ flex: '1', width: '100%', padding: '2rem 4rem', fontFamily: 'Noto Sans, sans-serif' }}>
        <h1 style={{ color: '#002147', fontSize: '2rem', marginBottom: '1rem' }}>🧑‍✈️ Driver Dashboard</h1>

        {session ? (
          <>
            <section style={{ marginBottom: '2rem', backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#333', marginBottom: '1rem' }}>Driver Information</h3>
              <div><strong>Bus ID:</strong> {session.busId}</div>
              <div><strong>Driver ID:</strong> {session.driverId}</div>
              <div><strong>Route:</strong> {session.route}</div>
              <div style={{ marginTop: '1rem' }}><strong>Status:</strong> {status}</div>
            </section>

            <section style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#333', marginBottom: '1rem' }}>Live Location Map</h3>
              {location.lat && location.lng ? (
                <MapContainer center={[location.lat, location.lng]} zoom={15} style={{ height: '400px', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[location.lat, location.lng]}>
                    <Popup>
                      {session.busId} on {session.route}
                    </Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <div style={{ color: '#555' }}>Waiting for location...</div>
              )}
            </section>
          </>
        ) : (
          <div style={{ color: 'red', fontWeight: 'bold' }}>Please login to access the dashboard.</div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default DriverDashboard;