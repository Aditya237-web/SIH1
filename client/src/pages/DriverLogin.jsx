import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function DriverLogin() {
  const [busId, setBusId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/driver/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ busId, driverId, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Store session info (optional)
        localStorage.setItem('driverSession', JSON.stringify(data));
        navigate('/driver/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <Header />

      <main style={{
        flex: '1',
        maxWidth: '500px',
        margin: '3rem auto',
        padding: '2rem',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontFamily: 'Noto Sans, sans-serif'
      }}>
        <h2 style={{ color: '#002147', marginBottom: '1rem' }}>🔐 Driver Login</h2>

        <form onSubmit={handleLogin}>
          <label>Bus ID:</label><br />
          <input
            type="text"
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            required
            placeholder="e.g. Bus 101"
            style={{
              width: '100%',
              padding: '0.6rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />

          <label>Driver ID:</label><br />
          <input
            type="text"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            required
            placeholder="e.g. D-2023"
            style={{
              width: '100%',
              padding: '0.6rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />

          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.6rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />

          {error && (
            <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
          )}

          <button type="submit" style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#002147',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>
            🚍 Login & Start Tracking
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default DriverLogin;