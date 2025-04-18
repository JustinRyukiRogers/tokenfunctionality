// export default App;
import React, { useEffect } from 'react';
import CryptoTable from './CryptoTable';

function App() {
  useEffect(() => {
    const adjustContainerMargin = () => {
      const header = document.querySelector('.app-header');
      const container = document.querySelector('.app-container');
      if (header && container) {
        // Set the container's top margin to the header's height plus extra spacing (e.g. 20px)
        container.style.marginTop = `${header.offsetHeight + 20}px`;
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
          <h1>Token Functionality Dashboard</h1>
        </div>
        <div className="header-right">
          <a 
            className="header-learn-more" 
            href="https://docs.google.com/document/d/e/2PACX-1vSig8ByfOoz8ITdn2jrg9XwqUMNHBUKODCqfJ59Y4YX8KZOalH08zgsNStNNExXvr6hGY-hwlSOPOth/pub" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Learn More
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
