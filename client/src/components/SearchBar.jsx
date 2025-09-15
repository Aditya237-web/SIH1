import React, { useState, useEffect } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [recognition, setRecognition] = useState(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.lang = 'en-IN';
    recog.interimResults = false;

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      setQuery(transcript);
      onSearch && onSearch(transcript);
    };

    setRecognition(recog);
  }, [onSearch]);

  // Called when mic icon is clicked
  const handleMicClick = () => {
    if (recognition) {
      recognition.start();
    }
  };

  // Called when Search button is clicked or Enter is pressed
  const triggerSearch = () => {
    if (!query) return;
    onSearch && onSearch(query.trim());
  };

  return (
    <section
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1rem 0',
        borderBottom: '1px solid #ccc',
        backgroundColor: '#fff'
      }}
    >
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          placeholder="Search by route or stop..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && triggerSearch()}
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
        >
          🎙️
        </span>
      </div>

      <button
        onClick={triggerSearch}
        style={{
          padding: '0.75rem 1rem',
          backgroundColor: '#228B22',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        🔍 Search
      </button>
    </section>
  );
}

export default SearchBar;