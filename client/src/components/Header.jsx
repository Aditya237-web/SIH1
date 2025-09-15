import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: '#002147',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>🚌ChaldiBus</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Admin Login */}
        <Link to="/admin" style={{
          color: 'white',
          textDecoration: 'none',
          fontWeight: '500',
          fontSize: '1rem'
        }}>
          Admin Login
        </Link>

        {/* Driver Panel */}
        <a
          href="/driver"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '1rem'
          }}
        >
          Driver Panel
        </a>

        {/* Ticket Booking */}
        <Link to="/ticket" style={{
          color: 'white',
          textDecoration: 'none',
          fontWeight: '500',
          fontSize: '1rem'
        }}>
          Ticket Booking
        </Link>

        {/* Help & Support */}
        <Link to="/help" style={{
          color: 'white',
          textDecoration: 'none',
          fontWeight: '500',
          fontSize: '1rem'
        }}>
          Help & Support
        </Link>

        {/* Language Selector */}
        <select onChange={(e) => alert(`Language switched to: ${e.target.value}`)}>
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="ta">தமிழ்</option>
          <option value="te">తెలుగు</option>
          <option value="bn">বাংলা</option>
          <option value="mr">मराठी</option>
          <option value="gu">ગુજરાતી</option>
          <option value="kn">ಕನ್ನಡ</option>
          <option value="ml">മലയാളം</option>
          <option value="pa">ਪੰਜਾਬੀ</option>
          <option value="ur">اردو</option>
        </select>
      </div>
    </header>
  );
}

export default Header;