// src/index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';  // Import your global styles

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
