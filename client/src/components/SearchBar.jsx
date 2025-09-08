import React, { useState, useEffect } from 'react';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = 'en-IN';
      recog.interimResults = false;
      setRecognition(recog);
    }
  }, []);

  const handleMicClick = () => {
    if (recognition) {
      recognition.start();
      recognition.onresult = (event) => {
        setQuery(event.results[0][0].transcript);
      };
    }
  };

  const handleSearch = () => {
    alert(`Searching for: ${query}`);
  };

  return (
    <section style={{
      display: 'flex',
      gap: '1rem',
      padding: '1rem 0',
      borderBottom: '1px solid #ccc',
      backgroundColor: '#fff'
    }}>
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          placeholder="Search by route or stop..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 2.5rem 0.75rem 0.75rem',
            fontSize: '1rem'
          }}
        />
        <span
          onClick={handleMicClick}
          title="Speak to search"
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            fontSize: '1.2rem',
            color: '#555'
          }}
        >🎙️</span>
      </div>
      <button onClick={handleSearch} style={{
        padding: '0.75rem 1rem',
        backgroundColor: '#228B22',
        color: 'white',
        border: 'none',
        cursor: 'pointer'
      }}>🔍 Search</button>
    </section>
  );
}

export default SearchBar;