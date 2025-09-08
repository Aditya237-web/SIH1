import React, { useState, useEffect } from 'react';

function BusInfo() {
  const [busData, setBusData] = useState({
    number: '102',
    location: 'Near Gandhi Chowk',
    passengers: 32,
    capacity: 50
  });

  useEffect(() => {
    // Simulate live updates every 5 seconds
    const interval = setInterval(() => {
      const newPassengerCount = Math.floor(25 + Math.random() * 25); // 25–50
      const locations = ['Near Gandhi Chowk', 'Shahpur', 'Ludhiana', 'Palhwan', 'Sector 12'];
      const newLocation = locations[Math.floor(Math.random() * locations.length)];

      setBusData(prev => ({
        ...prev,
        location: newLocation,
        passengers: newPassengerCount
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{ padding: '2rem 0' }}>
      <h2>Live Bus Info</h2>
      <div style={{
        backgroundColor: '#fff',
        padding: '1rem',
        borderLeft: '5px solid #228B22',
        marginBottom: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderRadius: '4px'
      }}>
        <p><strong>Bus #: {busData.number}</strong></p>
        <p>Location: {busData.location}</p>
        <p>Passenger Count: <span style={{ fontWeight: 'bold', color: '#d32f2f' }}>
          {busData.passengers}/{busData.capacity}
        </span></p>
      </div>
    </section>
  );
}

export default BusInfo;