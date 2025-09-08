import React from 'react';

const simulatedNews = {
  Modinagar: [
    "⚠️ Dasna Mela traffic expected near NH-58 from 4 PM.",
    "🛑 Road repair near Gandhi Chowk — Route 102 diverted."
  ],
  Meerut: [
    "🛑 Fog alert: early morning buses may be delayed.",
    "⚠️ Festival crowd near Begum Bridge — expect congestion."
  ],
  Saharanpur: [
    "🛑 Route 411 suspended due to waterlogging near Delhi Gate."
  ],
  Ghaziabad: [
    "⚠️ Heavy traffic near Dasna toll due to construction.",
    "🛑 Route 305 delayed by 20 minutes."
  ],
  Aligarh: [
    "🛑 Bus #204 rerouted due to market closure near Center Point."
  ],
  Moradabad: [
    "⚠️ Eid crowd expected near Jama Masjid — delays likely."
  ],
  Bareilly: [
    "🛑 Route 110 suspended due to bridge maintenance near Civil Lines."
  ]
};

function AdvisoryDashboard({ location }) {
  const advisories = simulatedNews[location] || [];

  return (
    <section style={{
      backgroundColor: 'white',
      padding: '1rem',
      borderLeft: '5px solid #FF9933',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      marginTop: '1rem'
    }}>
      <h2>📢 Transport Advisories for {location}</h2>
      {advisories.length > 0 ? (
        <ul style={{ paddingLeft: '1rem' }}>
          {advisories.map((msg, index) => (
            <li key={index} style={{ marginBottom: '0.5rem' }}>{msg}</li>
          ))}
        </ul>
      ) : (
        <p>No advisories posted yet.</p>
      )}
    </section>
  );
}

export default AdvisoryDashboard;