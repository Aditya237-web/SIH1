import React from 'react';

export default function BusInfo({ buses, onPurchase }) {
  const hasBuses = Array.isArray(buses) && buses.length > 0;

  return (
    <section style={{ padding: '2rem 0' }}>
      <h2>Live Bus Info</h2>

      {buses === null && (
        <div style={{ padding: '1rem', color: '#555' }}>
          🔄 Loading live bus info...
        </div>
      )}

      {!hasBuses && buses !== null && (
        <div
          style={{
            backgroundColor: '#fff',
            padding: '1rem',
            borderLeft: '5px solid #ccc',
            color: '#666',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          No live buses in this city right now.
        </div>
      )}

      {hasBuses &&
        buses.map((bus) => (
          <div
            key={bus.busId}
            style={{
              position: 'relative',
              backgroundColor: '#fff',
              padding: '1rem',
              borderLeft: '5px solid #228B22',
              marginBottom: '1rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderRadius: '4px',
              width: '100%',
              maxWidth: '600px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                padding: '0.25rem 0.5rem',
                backgroundColor: '#eee',
                borderRadius: '3px',
                fontSize: '0.75rem',
                color: '#333',
              }}
            >
              {bus.busType}
            </span>

            <p>
              <strong>Bus ID:</strong> {bus.busId}
            </p>
            <p>
              <strong>Route:</strong> {bus.route}
            </p>
            <p>
              <strong>Status:</strong> {bus.status} &nbsp;|&nbsp;
              <strong>Crowd:</strong> {bus.crowdLevel} &nbsp;|&nbsp;
              <strong>ETA:</strong> {bus.eta}
            </p>

            <button
              onClick={() => onPurchase(bus.busId)}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                fontSize: '0.9rem',
                color: '#fff',
                backgroundColor: '#007BFF',
                border: 'none',
                borderRadius: '4px',
                alignSelf: 'flex-end',
                cursor: 'pointer',
              }}
            >
              Purchase Ticket
            </button>
          </div>
        ))}
    </section>
  );
}
