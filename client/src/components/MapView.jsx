import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function MapView() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map('map');
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    function simulateBus(lat, lng) {
      let busMarker = L.marker([lat + 0.002, lng + 0.002]).addTo(map)
        .bindPopup('🚌 Bus #112')
        .openPopup();

      function updateBusLocation() {
        const newLat = lat + (Math.random() - 0.5) * 0.01;
        const newLng = lng + (Math.random() - 0.5) * 0.01;
        busMarker.setLatLng([newLat, newLng]);
        map.panTo([newLat, newLng]);
      }

      setInterval(updateBusLocation, 5000);
    }

    function fallbackToModinagar() {
      const lat = 28.8319;
      const lng = 77.5811;
      map.setView([lat, lng], 13);
      simulateBus(lat, lng);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          map.setView([lat, lng], 15);
          L.marker([lat, lng]).addTo(map).bindPopup('📍 You are here').openPopup();
          simulateBus(lat, lng);
        },
        () => fallbackToModinagar()
      );
    } else {
      fallbackToModinagar();
    }
  }, []);

  return (
    <section style={{ padding: '2rem 0' }}>
      <div id="map" style={{
        width: '100%',
        height: '400px',
        border: '2px solid #002147',
        borderRadius: '8px'
      }}></div>
    </section>
  );
}

export default MapView;