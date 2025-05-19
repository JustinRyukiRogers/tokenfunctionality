// export default App;
import React, { useEffect } from 'react';
import CryptoTable from './CryptoTable';
import { inject } from '@vercel/analytics';

function App() {
  useEffect(() => {
    inject();
    const adjustContainerMargin = () => {
      const header = document.querySelector('.app-header');
      const container = document.querySelector('.app-container');
      if (header && container) {
        // Set the container's top margin to the header's height plus extra spacing (e.g. 20px)
      }
    };

    adjustContainerMargin();
    window.addEventListener('resize', adjustContainerMargin);
    return () => {
      window.removeEventListener('resize', adjustContainerMargin);
    };
  }, []);

  return (
    <>
      <header className="app-header">
        <a 
          className="header-link"
          href="https://justcryptoeconomics.com/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img src="https://images.squarespace-cdn.com/content/v1/65b95c32618766635b132cf0/bbba13c7-6b38-4828-9a38-a8f3a592d20f/fotor-2024021221444.png?format=1500w" alt="Just Cryptoeconomics" />
        </a>
        <div className="header-text">
          <h1>Token Fundamentals</h1>
        </div>
        <div className="header-buttons">
          <a 
            className="header-button" 
            href="https://justcryptoeconomics.com/writings/token-functionality-framework" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Learn More
          </a>
          <a 
            className="header-button" 
            href="https://tally.so/r/3yGadX" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Feedback & <br />Submissions
          </a>
        </div>
      </header>
      <div className="app-container">
        <CryptoTable />
      </div>
    </>
  );

}

export default App;
