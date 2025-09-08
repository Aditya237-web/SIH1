import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={{
      backgroundColor: '#002147',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>🚌 SmartBus Bharat</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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

        {/* Admin Login */}
        <Link to="/admin" style={{
          color: '#FF9933',
          fontWeight: 'bold',
          textDecoration: 'none',
          border: '1px solid #FF9933',
          padding: '0.4rem 0.8rem',
          borderRadius: '4px'
        }}>
          🔐 Admin Login
        </Link>

        {/* Driver Panel - opens in new tab */}
        <a
          href="/driver"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#00BFFF',
            fontWeight: 'bold',
            textDecoration: 'none',
            border: '1px solid #00BFFF',
            padding: '0.4rem 0.8rem',
            borderRadius: '4px'
          }}
        >
          🚍 Driver Panel
        </a>
      </div>
    </header>
  );
}

export default Header;