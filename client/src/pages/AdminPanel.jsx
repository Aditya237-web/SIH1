import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Custom pin icons for different crowd levels
const createCustomIcon = (color) => {
  return L.divIcon({
    html: `<div style="
      width: 20px;
      height: 20px;
      background-color: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    className: 'custom-pin',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

export default function AdminPanel() {
  const [advisory, setAdvisory] = useState('');
  const [emergencyLogs] = useState([
    'Bus #411 – Emergency alert received at 14:32 near Hapur bypass.',
    'Bus #305 – Emergency alert received at 13:10 near Dasna toll.'
  ]);

  // Cities to aggregate for the overview table
  const adminCities = ['Modinagar', 'Meerut', 'Ghaziabad', 'Aligarh', 'Mathura'];

  // Location points with crowd levels
  const [locationPoints] = useState([
    {
      id: 'ghaziabad_station',
      name: 'Ghaziabad Railway Station',
      latitude: 28.6692,
      longitude: 77.4538,
      crowdLevel: 'high',
      crowdCount: 450,
      description: 'Major transit hub with heavy passenger flow'
    },
    {
      id: 'meerut_city',
      name: 'Meerut City Center',
      latitude: 28.9845,
      longitude: 77.7064,
      crowdLevel: 'medium',
      crowdCount: 180,
      description: 'Commercial area with moderate crowd'
    },
    {
      id: 'modinagar_depot',
      name: 'Modinagar Bus Depot',
      latitude: 28.8330,
      longitude: 77.6167,
      crowdLevel: 'low',
      crowdCount: 65,
      description: 'Bus depot with light passenger activity'
    },
    {
      id: 'aligarh_junction',
      name: 'Aligarh Muslim University',
      latitude: 27.8974,
      longitude: 78.0880,
      crowdLevel: 'high',
      crowdCount: 380,
      description: 'University area with high student traffic'
    },
    {
      id: 'mathura_temple',
      name: 'Mathura Temple Complex',
      latitude: 27.4924,
      longitude: 77.6737,
      crowdLevel: 'medium',
      crowdCount: 220,
      description: 'Religious site with pilgrim crowd'
    },
    {
      id: 'hapur_market',
      name: 'Hapur Market Area',
      latitude: 28.7306,
      longitude: 77.7750,
      crowdLevel: 'high',
      crowdCount: 320,
      description: 'Busy market district'
    },
    {
      id: 'bulandshahr_city',
      name: 'Bulandshahr City',
      latitude: 28.4089,
      longitude: 77.8499,
      crowdLevel: 'low',
      crowdCount: 85,
      description: 'Small city center with minimal crowd'
    }
  ]);

  // Two specific buses for GPS tracking on the map
  const [busLocations, setBusLocations] = useState([]);

  // At least 5 buses for the admin overview
  const [adminBuses, setAdminBuses] = useState([]);

  // Fetch GPS updates for Bus 101 and Bus 305 every 10s
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
        .catch(() => console.warn('Failed to fetch bus locations'));
    };

    fetchLocations();
    const interval = setInterval(fetchLocations, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch 5+ buses across adminCities every 15s
  useEffect(() => {
    const fetchAdminBuses = async () => {
      try {
        const results = await Promise.all(
          adminCities.map(city =>
            fetch(`http://localhost:5000/api/buses-near/${encodeURIComponent(city)}`)
              .then(res => (res.ok ? res.json() : []))
          )
        );

        const combined = results.flat();
        const slice    = combined.length >= 5 ? combined.slice(0, 5) : combined;
        setAdminBuses(slice);
      } catch {
        console.error('Failed to fetch admin buses');
        setAdminBuses([]);
      }
    };

    fetchAdminBuses();
    const interval = setInterval(fetchAdminBuses, 15000);
    return () => clearInterval(interval);
  }, []);

  const handlePostAdvisory = () => {
    if (!advisory.trim()) {
      alert('⚠️ Please enter an advisory message.');
      return;
    }
    alert(`✅ Advisory posted:\n\n${advisory}`);
    setAdvisory('');
  };

  const getCrowdColor = (crowdLevel) => {
    switch (crowdLevel) {
      case 'high': return '#ff4444'; // Red for most crowded
      case 'medium': return '#ffaa00'; // Yellow for medium crowd
      case 'low': return '#44ff44'; // Green for low crowd
      default: return '#888888';
    }
  };

  const getCrowdIcon = (crowdLevel) => {
    if (typeof window !== 'undefined' && window.L) {
      return createCustomIcon(getCrowdColor(crowdLevel));
    }
    return undefined;
  };

  return (
    <>
      <header style={headerStyle}>
        <div>🚌ChaldiBus – Admin Dashboard</div>
        <div>👩‍💼 Admin Logged In</div>
      </header>

      <main style={mainStyle}>
        <h2 style={sectionTitle}>🗺️ Live Location Monitoring with Crowd Levels</h2>
        
        {/* Legend */}
        <div style={legendStyle}>
          <div style={legendItem}>
            <div style={{...legendPin, backgroundColor: '#ff4444'}}></div>
            <span>High Crowd (300+)</span>
          </div>
          <div style={legendItem}>
            <div style={{...legendPin, backgroundColor: '#ffaa00'}}></div>
            <span>Medium Crowd (100-299)</span>
          </div>
          <div style={legendItem}>
            <div style={{...legendPin, backgroundColor: '#44ff44'}}></div>
            <span>Low Crowd (&lt;100)</span>
          </div>
        </div>

        <MapContainer center={[28.85, 77.58]} zoom={9} style={mapStyle}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Location points with crowd levels */}
          {locationPoints.map(location => (
            <Marker 
              key={location.id} 
              position={[location.latitude, location.longitude]}
              icon={getCrowdIcon(location.crowdLevel)}
            >
              <Popup>
                <div style={popupStyle}>
                  <strong>{location.name}</strong><br />
                  <div style={{color: getCrowdColor(location.crowdLevel), fontWeight: 'bold'}}>
                    {location.crowdLevel.toUpperCase()} CROWD
                  </div>
                  <div>👥 {location.crowdCount} people</div>
                  <div style={{fontSize: '0.9em', marginTop: '5px'}}>
                    {location.description}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Bus locations */}
          {busLocations.map(bus =>
            bus.latitude && bus.longitude ? (
              <Marker key={bus.busId} position={[bus.latitude, bus.longitude]}>
                <Popup>
                  <strong>🚌 {bus.busId}</strong><br />
                  {bus.route}<br />
                  Last updated: {new Date(bus.timestamp).toLocaleTimeString()}
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={sectionTitle}>📋 Admin Bus Overview</h2>
          <table style={tableStyle}>
            <thead>
              <tr style={theadStyle}>
                <th style={th}>Bus ID</th>
                <th style={th}>Route</th>
                <th style={th}>Type</th>
                <th style={th}>Status</th>
                <th style={th}>ETA</th>
              </tr>
            </thead>
            <tbody>
              {adminBuses.map(bus => (
                <tr key={bus.busId}>
                  <td style={td}>{bus.busId}</td>
                  <td style={td}>{bus.route}</td>
                  <td style={td}>{bus.busType}</td>
                  <td style={td}>
                    {statusEmoji(bus.status)} {bus.status}
                  </td>
                  <td style={td}>{bus.eta}</td>
                </tr>
              ))}
              {adminBuses.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ ...td, textAlign: 'center', color: '#666' }}>
                    No buses available right now
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section style={advisoryStyle}>
          <h2>📢 Post Transport Advisory</h2>
          <textarea
            rows="3"
            value={advisory}
            onChange={e => setAdvisory(e.target.value)}
            placeholder="Type advisory here…"
            style={textareaStyle}
          />
          <button onClick={handlePostAdvisory} style={buttonStyle}>
            Post Advisory
          </button>
        </section>

        <section style={alertStyle}>
          <h2>🚨 Emergency Alerts</h2>
          <ul style={{ paddingLeft: '1rem' }}>
            {emergencyLogs.map((log, i) => (
              <li key={i} style={{ marginBottom: '0.5rem' }}>
                {log}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer style={footerStyle}>
        <p>Ministry of Transport, Government of India</p>
      </footer>
    </>
  );
}

const headerStyle = {
  backgroundColor: '#002147',
  color: 'white',
  padding: '1rem 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '1.2rem',
  fontWeight: 'bold'
};

const mainStyle = {
  padding: '2rem 4rem',
  fontFamily: 'Noto Sans, sans-serif'
};

const sectionTitle = {
  marginBottom: '1rem',
  color: '#002147'
};

const legendStyle = {
  display: 'flex',
  gap: '2rem',
  marginBottom: '1rem',
  padding: '1rem',
  backgroundColor: '#f5f5f5',
  borderRadius: '4px'
};

const legendItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const legendPin = {
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  border: '2px solid white',
  boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
};

const mapStyle = {
  height: '500px',
  marginBottom: '2rem'
};

const popupStyle = {
  minWidth: '200px',
  textAlign: 'center'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: 'white',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
};

const theadStyle = {
  backgroundColor: '#002147',
  color: 'white'
};

const th = {
  padding: '0.75rem',
  border: '1px solid #ccc',
  textAlign: 'left'
};

const td = {
  padding: '0.75rem',
  border: '1px solid #ccc'
};

const advisoryStyle = {
  backgroundColor: 'white',
  padding: '1rem',
  borderLeft: '5px solid #FF9933',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  marginBottom: '2rem'
};

const textareaStyle = {
  width: '100%',
  padding: '0.75rem',
  fontSize: '1rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  marginTop: '0.5rem'
};

const buttonStyle = {
  marginTop: '1rem',
  padding: '0.75rem 1.5rem',
  backgroundColor: '#228B22',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1rem'
};

const alertStyle = {
  backgroundColor: 'white',
  padding: '1rem',
  borderLeft: '5px solid #d32f2f',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)'
};

const footerStyle = {
  backgroundColor: '#002147',
  color: 'white',
  textAlign: 'center',
  padding: '1rem',
  fontSize: '0.95rem'
};

function statusEmoji(status) {
  return status === 'Delayed' ? '🟡' :
         status === 'Arriving' ? '🔵' :
         status === 'Running' ? '🟢' : '';
}
