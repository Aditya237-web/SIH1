import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import MapView from '../components/MapView';
import BusInfo from '../components/BusInfo';
import AdvisoryDashboard from '../components/AdvisoryDashboard';
import Footer from '../components/Footer';
import { CityContext } from '../App';

const fallbackCities = ['Modinagar', 'Meerut', 'Saharanpur', 'Ghaziabad', 'Aligarh'];

function MainDashboard() {
  const [locationGranted, setLocationGranted] = useState(false);
  const [manualCity, setManualCity] = useState('');
  const { selectedCity, setSelectedCity } = useContext(CityContext);
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationGranted(true);
        const { latitude, longitude } = pos.coords;

        console.log("User location:", latitude, longitude);

        if (latitude > 28.8 && longitude > 77.5) {
          setSelectedCity('Modinagar');
        } else if (latitude > 29.0 && longitude > 77.7) {
          setSelectedCity('Meerut');
        } else if (latitude > 30.0 && longitude > 77.5) {
          setSelectedCity('Saharanpur');
        } else if (latitude > 28.6 && longitude > 77.4) {
          setSelectedCity('Ghaziabad');
        } else {
          setSelectedCity('');
        }
      },
      (err) => {
        console.warn("Location access denied:", err);
        setLocationGranted(false);
      }
    );
  }, [setSelectedCity]);

  const handleManualSelect = (e) => {
    setManualCity(e.target.value);
    setSelectedCity(e.target.value);
  };

  const handleTicketClick = () => {
    navigate('/ticket');
  };

  return (
    <>
      <Header />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
        <SearchBar />
        <MapView />
        <BusInfo />

        {!locationGranted && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 'bold' }}>📍 Select your city manually:</label>
            <select
              value={manualCity}
              onChange={handleManualSelect}
              style={{ padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              <option value="">-- Choose a city --</option>
              {fallbackCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        )}

        {selectedCity && (
          <>
            <AdvisoryDashboard location={selectedCity} />

            <button
              onClick={handleTicketClick}
              style={{
                marginTop: '2rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#002147',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              🎟️ Purchase Ticket
            </button>
          </>
        )}
      </main>

      {/* ✅ Official Footer */}
      <Footer />
    </>
  );
}

export default MainDashboard;