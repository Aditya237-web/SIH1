import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function BookTicket() {
  const { busId } = useParams();

  const [name, setName] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [fare, setFare] = useState(20);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const calculateFare = (start, end) => {
    if (start && end && start !== end) {
      return 20 + Math.abs(start.charCodeAt(0) - end.charCodeAt(0)) * 2;
    }
    return 20;
  };

  useEffect(() => {
    setFare(calculateFare(start, end));
  }, [start, end]);

  const handleSubmit = () => {
    if (!name || !start || !end) {
      setError('Please fill all fields');
      return;
    }
    if (start === end) {
      setError('Start and end points cannot be the same');
      return;
    }

    setError('');
    setSuccess(true);
    // TODO: POST to backend and generate PDF
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      <Header />

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div style={cardStyle}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem', color: '#333' }}>🎟️ Book Your Bus Ticket</h2>
          <p><strong>Bus ID:</strong> {busId}</p>

          {!success ? (
            <>
              <label style={labelStyle}>Name:</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                style={inputStyle}
                placeholder="Your full name"
              />

              <label style={labelStyle}>Start Point:</label>
              <input
                value={start}
                onChange={e => setStart(e.target.value)}
                style={inputStyle}
                placeholder="Boarding stop"
              />

              <label style={labelStyle}>End Point:</label>
              <input
                value={end}
                onChange={e => setEnd(e.target.value)}
                style={inputStyle}
                placeholder="Destination stop"
              />

              <p style={{ marginTop: '1rem' }}><strong>Estimated Fare:</strong> ₹{fare}</p>

              {error && (
                <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
              )}

              <button onClick={handleSubmit} style={buttonStyle}>
                Pay & Get Ticket
              </button>
            </>
          ) : (
            <div style={successCard}>
              <h3 style={{ color: '#28a745' }}>✅ Ticket Confirmed</h3>
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Route:</strong> {start} → {end}</p>
              <p><strong>Fare:</strong> ₹{fare}</p>
              <p><strong>Bus ID:</strong> {busId}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#fff',
  padding: '2rem 2.5rem',
  borderRadius: '10px',
  boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '700px',
  fontFamily: 'Segoe UI, sans-serif',
  transition: 'transform 0.3s ease',
  border: '1px solid #e0e0e0'
};

const labelStyle = {
  fontWeight: 'bold',
  marginTop: '1rem',
  marginBottom: '0.25rem',
  display: 'block',
  color: '#444'
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '0.6rem',
  marginBottom: '1rem',
  fontSize: '1rem',
  border: '1px solid #ccc',
  borderRadius: '6px',
  transition: 'border-color 0.2s ease'
};

const buttonStyle = {
  marginTop: '1rem',
  padding: '0.75rem 1.5rem',
  backgroundColor: '#007BFF',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease'
};

const successCard = {
  backgroundColor: '#e6ffed',
  padding: '1.5rem',
  border: '1px solid #28a745',
  borderRadius: '8px',
  textAlign: 'left',
  animation: 'fadeIn 0.5s ease-in-out'
};

export default BookTicket;