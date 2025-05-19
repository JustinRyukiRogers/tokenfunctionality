// TooltipPortal.jsx
import React from 'react';
import ReactDOM from 'react-dom';

const TooltipPortal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

export default TooltipPortal;
