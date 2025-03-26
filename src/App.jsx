// src/App.jsx
import React from 'react';
import CryptoTable from './CryptoTable';

function App() {
  return (
    <>
      <header
        style={{
          backgroundColor: '#0e3b5c',
          color: 'white',
          padding: '20px',
          textAlign: 'left',
          // Remove any margin here so the background goes edge-to-edge.
        }}
      >
        <h1
          style={{
            fontFamily: 'Futura, sans-serif',
            fontWeight: '700',
            fontSize: '2.5rem',
            margin: 0,
          }}
        >
          Token Functionality Dashboard
        </h1>
      </header>
      <div style={{ margin: '20px', fontFamily: 'Futura, sans-serif' }}>
        <CryptoTable />
      </div>
    </>
  );
}

export default App;
