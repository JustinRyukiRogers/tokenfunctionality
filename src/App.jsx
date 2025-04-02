// src/App.jsx
import React from 'react';
import CryptoTable from './CryptoTable';

function App() {
  return (
    <>
      <header className="app-header">
        <div className="header-text">
          <h1>Token Functionality Dashboard</h1>
          <span>by Just Cryptoeconomics</span>
        </div>
        <a 
          className="header-link"
          href="https://justcryptoeconomics.com/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img src="https://drive.google.com/uc?export=view&id=1I9025nO4TB-bob2YlRjhp-jpa1z4VW6M" />
        </a>
      </header>
      <div className="app-container">
        <CryptoTable />
      </div>
    </>
  );
}

export default App;
