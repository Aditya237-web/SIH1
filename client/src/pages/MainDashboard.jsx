import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import MapView from '../components/MapView';
import BusInfo from '../components/BusInfo';
import AdvisoryDashboard from '../components/AdvisoryDashboard';
import Footer from '../components/Footer';
import { CityContext } from '../App';

const fallbackCities = [
  'Modinagar',
  'Meerut',
  'Saharanpur',
  'Ghaziabad',
  'Aligarh'
];

function MainDashboard() {
  const [locationGranted, setLocationGranted] = useState(false);
  const [manualCity, setManualCity]           = useState('');
  const [busData, setBusData]                 = useState([]);
  const [searchQuery, setSearchQuery]         = useState('');
  const { selectedCity, setSelectedCity }     = useContext(CityContext);
  const navigate = useNavigate();

  // 📍 Detect geolocation and pick a city
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocationGranted(true);
        const { latitude, longitude } = coords;

        if (latitude > 30.0 && longitude > 77.5) {
          setSelectedCity('Saharanpur');
        } else if (latitude > 29.0 && longitude > 77.7) {
          setSelectedCity('Meerut');
        } else if (latitude > 28.8 && longitude > 77.5) {
          setSelectedCity('Modinagar');
        } else if (latitude > 28.6 && longitude > 77.4) {
          setSelectedCity('Ghaziabad');
        } else {
          setSelectedCity('Ghaziabad'); // fallback
        }
      },
      (err) => {
        console.warn('Location access denied:', err);
        setLocationGranted(false);
        setSelectedCity('Ghaziabad'); // fallback
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [setSelectedCity]);

  // 🧭 Manual city selector
  const handleManualSelect = e => {
    setManualCity(e.target.value);
    setSelectedCity(e.target.value);
  };

  // 🚍 Fetch buses when city or search changes
  useEffect(() => {
    const cityToQuery = searchQuery || selectedCity;
    if (!cityToQuery) {
      setBusData([]);
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE}/api/buses-near/${cityToQuery}`)
      .then(res => res.json())
      .then(data => setBusData(data))
      .catch(err => {
        console.error('Failed to fetch buses:', err);
        setBusData([]);
      });
  }, [searchQuery, selectedCity]);

  return (
    <>
      <Header />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
        <SearchBar onSearch={q => setSearchQuery(q)} />

        <MapView buses={busData} />

        <BusInfo
          buses={busData}
          onPurchase={busId => navigate(`/book-ticket/${busId}`)}
        />

        {!locationGranted && (
          <div style={{ margin: '1.5rem 0' }}>
            <label style={{ fontWeight: 'bold' }}>
              📍 Select your city manually:
            </label>
            <select
              value={manualCity}
              onChange={handleManualSelect}
              style={{
                display: 'block',
                padding: '0.75rem',
                fontSize: '1rem',
                marginTop: '0.5rem'
              }}
            >
              <option value="">-- Choose a city --</option>
              {fallbackCities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedCity && (
          <AdvisoryDashboard location={selectedCity} />
        )}
      </main>

      <Footer />
    </>
  );
}

export default MainDashboard;
