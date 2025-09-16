import React, { useState, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainDashboard from './pages/MainDashboard';
import AdminPanel from './pages/AdminPanel';
// import Login from './pages/Login'; // 🔒 Disabled for now
import DriverLogin from './pages/DriverLogin';
import DriverDashboard from './pages/DriverDashboard';
import TicketForm from './pages/TicketForm';
import BookTicket from './pages/BookTicket';

import 'leaflet/dist/leaflet.css';

export const CityContext = createContext();

function App() {
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity }}>
      <BrowserRouter>
        <Routes>
          {/* 🏠 Public routes */}
          <Route path="/" element={<MainDashboard />} />
          <Route path="/ticket" element={<TicketForm />} />
          <Route path="/book-ticket/:busId" element={<BookTicket />} />

          {/* 🛠️ Admin Panel (no login required) */}
          <Route path="/admin" element={<AdminPanel />} />

          {/* 🧑‍✈️ Driver routes */}
          <Route path="/driver" element={<DriverLogin />} />
          <Route path="/driver/dashboard" element={<DriverDashboard />} />

          {/* 🚫 Fallback route */}
          <Route
            path="*"
            element={
              <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Noto Sans, sans-serif' }}>
                <h2>🚫 Page Not Found</h2>
                <p>The page you’re looking for doesn’t exist.</p>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </CityContext.Provider>
  );
}

export default App;
