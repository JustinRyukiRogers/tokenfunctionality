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
          <img src="https://images.squarespace-cdn.com/content/v1/65b95c32618766635b132cf0/bbba13c7-6b38-4828-9a38-a8f3a592d20f/fotor-2024021221444.png?format=1500w" />
        </a>
      </header>
      <div className="app-container">
        <CryptoTable />
      </div>
    </>
  );
}

export default App;
