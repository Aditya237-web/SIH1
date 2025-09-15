import React, { useContext, useState, useEffect } from 'react';
import { CityContext } from '../App';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const cities = ['Modinagar', 'Meerut', 'Saharanpur', 'Ghaziabad', 'Aligarh'];

const fareMatrix = {
  'Modinagar → Meerut': 45,
  'Modinagar → Ghaziabad': 35,
  'Meerut → Saharanpur': 60,
  'Ghaziabad → Aligarh': 50,
  'Meerut → Modinagar': 45,
  'Ghaziabad → Modinagar': 35,
  'Saharanpur → Meerut': 60,
  'Aligarh → Ghaziabad': 50
};

function TicketForm() {
  const { selectedCity } = useContext(CityContext);
  const [name, setName] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fare, setFare] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const routeKey = `${from} → ${to}`;
    if (fareMatrix[routeKey]) {
      setFare(fareMatrix[routeKey]);
    } else {
      setFare('');
    }
  }, [from, to]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`✅ Ticket booked for ${name} from ${from} to ${to}. Fare: ₹${fare}`);
    navigate('/');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <Header />

      <main style={{
        flex: '1',
        maxWidth: '700px',
        margin: '4rem auto',
        padding: '2rem',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '8px',
        fontFamily: 'Noto Sans, sans-serif',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#002147', marginBottom: '1rem' }}>🚌 Book Your Bus Ticket</h2>
        <p style={{ marginBottom: '1rem', fontSize: '0.95rem', color: '#555' }}>
          Welcome, {name || 'Passenger'}! Select your route and we’ll calculate the fare automatically.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Passenger Name:</label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your full name"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />

          <label>From:</label><br />
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            <option value="">-- Select starting point --</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <label>To:</label><br />
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            <option value="">-- Select destination --</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <label>Fare (₹):</label><br />
          <input
            type="text"
            value={fare ? `₹${fare}` : ''}
            readOnly
            placeholder="Auto-calculated"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              backgroundColor: '#eee',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />

          <div style={{ marginTop: '1rem' }}>
            <button type="submit" style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#228B22',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginRight: '1rem'
            }}>
              Confirm Booking
            </button>

            <button type="button" onClick={() => navigate('/')} style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#555',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
              Back to Dashboard
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default TicketForm;