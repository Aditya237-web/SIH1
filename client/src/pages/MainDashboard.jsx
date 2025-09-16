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
  const [busData, setBusData] = useState(null); // null for loading state
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedCity, setSelectedCity } = useContext(CityContext);
  const navigate = useNavigate();

  // 📍 Detect geolocation and auto-select city
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocationGranted(true);
        const { latitude, longitude } = coords;

        console.log('📍 Geolocation detected:', latitude, longitude);

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
        console.warn('⚠️ Location access denied:', err);
        setLocationGranted(false);
        setSelectedCity('Ghaziabad'); // fallback
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [setSelectedCity]);

  // 🧭 Manual city selector
  const handleManualSelect = (e) => {
    const city = e.target.value;
    setManualCity(city);
    setSelectedCity(city);
    console.log('🧭 Manual city selected:', city);
  };

  // 🚍 Fetch buses when city or search changes
  useEffect(() => {
    const cityToQuery = (searchQuery || selectedCity)?.toLowerCase().trim();
    if (!cityToQuery) {
      console.log('⚠️ No city selected for bus fetch');
      setBusData([]);
      return;
    }

    const API_BASE = process.env.REACT_APP_API_BASE || 'https://sih1-gmzh.onrender.com';
    const fetchURL = `${API_BASE}/api/buses-near/${cityToQuery}`;

    console.log('🔍 Fetching buses for:', cityToQuery);
    console.log('🔗 API URL:', fetchURL);

    fetch(fetchURL)
      .then(async (res) => {
        try {
          const data = await res.json();
          console.log('✅ Bus data received:', data);
          setBusData(data);
        } catch (err) {
          console.error('❌ Failed to parse JSON:', err);
          setBusData([]);
        }
      })
      .catch((err) => {
        console.error('❌ Fetch error:', err);
        setBusData([]);
      });
  }, [searchQuery, selectedCity]);

  return (
    <>
      <Header />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
        <SearchBar onSearch={(q) => setSearchQuery(q)} />

        <MapView buses={busData || []} />

        <BusInfo
          buses={busData}
          onPurchase={(busId) => navigate(`/book-ticket/${busId}`)}
        />

        {!locationGranted && (
          <div style={{ margin: '1.5rem 0' }}>
            <label style={{ fontWeight: 'bold' }}>📍 Select your city manually:</label>
            <select
              value={manualCity}
              onChange={handleManualSelect}
              style={{
                display: 'block',
                padding: '0.75rem',
                fontSize: '1rem',
                marginTop: '0.5rem',
              }}
            >
              <option value="">-- Choose a city --</option>
              {fallbackCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedCity && <AdvisoryDashboard location={selectedCity} />}
      </main>

      <Footer />
    </>
  );
}

export default MainDashboard;
