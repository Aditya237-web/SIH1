import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Login() {
  const [adminID, setAdminID] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded credentials for testing
    if (adminID === 'admin102' && password === 'securepass') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin'); // ✅ Correct route
    } else {
      alert('❌ Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#e9edf5' }}>
      <Header />

      <main style={{
        flex: '1',
        maxWidth: '500px',
        margin: '5rem auto',
        padding: '2rem',
        backgroundColor: '#fff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        fontFamily: 'Noto Sans, sans-serif'
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#002147' }}>🔐 Admin Login</h2>
        <form onSubmit={handleLogin}>
          <label style={{ fontWeight: 'bold' }}>Admin ID:</label>
          <input
            type="text"
            value={adminID}
            onChange={(e) => setAdminID(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />

          <label style={{ fontWeight: 'bold' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />

          <button type="submit" style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#228B22',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            Login
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default Login;