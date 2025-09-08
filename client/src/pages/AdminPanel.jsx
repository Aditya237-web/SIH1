import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function AdminPanel() {
  const [advisory, setAdvisory] = useState('');
  const [emergencyLogs, setEmergencyLogs] = useState([
    'Bus #411 – Emergency alert received at 14:32 near Hapur bypass.',
    'Bus #305 – Emergency alert received at 13:10 near Dasna toll.'
  ]);
  const [busLocations, setBusLocations] = useState([]);

  const handlePostAdvisory = () => {
    if (advisory.trim()) {
      alert(`✅ Advisory posted:\n${advisory}`);
      setAdvisory('');
    } else {
      alert('⚠️ Please enter an advisory message.');
    }
  };

  useEffect(() => {
    const fetchLocations = () => {
      Promise.all([
        fetch('http://localhost:5000/api/location/Bus%20101').then(res => res.json()),
        fetch('http://localhost:5000/api/location/Bus%20305').then(res => res.json())
      ])
        .then(([bus101, bus305]) => {
          setBusLocations([
            { busId: 'Bus 101', ...bus101 },
            { busId: 'Bus 305', ...bus305 }
          ]);
        })
        .catch(() => {
          console.log('Failed to fetch bus locations');
        });
    };

    fetchLocations();
    const interval = setInterval(fetchLocations, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header style={{
        backgroundColor: '#002147',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '1.2rem',
        fontWeight: 'bold'
      }}>
        <div>🚌 SmartBus Bharat – Admin Dashboard</div>
        <div>👩‍💼 Admin Logged In</div>
      </header>

      <main style={{ padding: '2rem 4rem', fontFamily: 'Noto Sans, sans-serif' }}>
        <h2 style={{ marginBottom: '1rem', color: '#002147' }}>🗺️ Live Bus Monitoring</h2>

        <MapContainer center={[28.85, 77.58]} zoom={11} style={{ height: '400px', marginBottom: '2rem' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {busLocations.map((bus, index) =>
            bus.latitude && bus.longitude ? (
              <Marker key={index} position={[bus.latitude, bus.longitude]}>
                <Popup>
                  <strong>{bus.busId}</strong><br />
                  {bus.route}<br />
                  Last updated: {new Date(bus.timestamp).toLocaleTimeString()}
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#002147', color: 'white' }}>
              <th style={{ padding: '0.75rem', border: '1px solid #ccc' }}>Bus ID</th>
              <th style={{ padding: '0.75rem', border: '1px solid #ccc' }}>Route</th>
              <th style={{ padding: '0.75rem', border: '1px solid #ccc' }}>Status</th>
              <th style={{ padding: '0.75rem', border: '1px solid #ccc' }}>Speed</th>
              <th style={{ padding: '0.75rem', border: '1px solid #ccc' }}>Last Location</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid #ccc' }}>102</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ccc' }}>Modinagar → Meerut</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ccc' }}>🟢 Running</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ccc' }}>42 km/h</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ccc' }}>Near Gandhi Chowk</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid #ccc' }}>305</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ccc' }}>Modinagar → Ghaziabad</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ccc' }}>🟡 Delayed</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ccc' }}>28 km/h</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ccc' }}>Near Dasna</td>
            </tr>
          </tbody>
        </table>

        <section style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderLeft: '5px solid #FF9933',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          marginTop: '2rem'
        }}>
          <h2>📢 Post Transport Advisory</h2>
          <label htmlFor="advisory" style={{ fontWeight: 'bold', marginTop: '1rem' }}>Advisory Message:</label>
          <textarea
            id="advisory"
            rows="4"
            value={advisory}
            onChange={(e) => setAdvisory(e.target.value)}
            placeholder="e.g. Due to Ganesh Visarjan, Route 102 will be delayed until 9 PM."
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginTop: '0.5rem'
            }}
          />
          <button onClick={handlePostAdvisory} style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#228B22',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>Post Advisory</button>
        </section>

        <section style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderLeft: '5px solid #d32f2f',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          marginTop: '2rem'
        }}>
          <h2>🚨 Emergency Alerts</h2>
          <ul style={{ paddingLeft: '1rem' }}>
            {emergencyLogs.map((log, index) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>{log}</li>
            ))}
          </ul>
        </section>
      </main>

      <footer style={{
        backgroundColor: '#002147',
        color: 'white',
        textAlign: 'center',
        padding: '1rem',
        marginTop: '2rem',
        fontSize: '0.95rem'
      }}>
        <p>Ministry of Transport, Government of India</p>
      </footer>
    </>
  );
}

export default AdminPanel;