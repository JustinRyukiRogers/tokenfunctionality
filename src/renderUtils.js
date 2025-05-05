// src/renderUtils.js
import React from 'react';

/**
 * Splits string on "\n" and renders with line breaks
 */
export const renderTooltipText = (text) => {
  const lines = text.split('\\n'); // Change to '\n' if your data includes actual newlines
  return (
    <>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
};


/**
 * Renders ✓ or ⏳ with optional tooltip
 */
export const renderTickCross = (value) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return <span>{''}</span>;
  }

  if (value.includes('|')) {
    const [symbol, tooltip] = value.split('|').map(s => s.trim());
    if (symbol === '-') {
      return (
        <span className="tooltip-container">
          <span className="hourglass">{'\u231B'}</span>
          <span className="tooltip-text">{renderTooltipText(tooltip)}</span>
        </span>
      );
    } else {
      return (
        <span className="tooltip-container">
          {'\u2713'}
          <span className="tooltip-text">{renderTooltipText(tooltip)}</span>
        </span>
      );
    }
  } else {
    return (
      <span className="tooltip-container">
        {'\u2713'}
        <span className="tooltip-text">{renderTooltipText(value)}</span>
      </span>
    );
  }
};
