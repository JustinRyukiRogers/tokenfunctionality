import React, { useState } from 'react';
import TooltipPortal from './TooltipPortal';


/**
 * Splits string on "\n" and renders with line breaks
 */
export const renderTooltipText = (text) => {
  const lines = text.split('\\n'); // Use '\n' if your data has real newlines

  return (
    <>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && (
            <>
              <br />
              <br />
            </>
          )}
        </React.Fragment>
      ))}
    </>
  );
};



/**
 * Renders ✓ or ⏳ with optional tooltip
 */
export const renderTickCross = (value) => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  if (typeof value !== 'string' || value.trim().length === 0) {
    return <span>{''}</span>;
  }

  const [symbol, tooltip] = value.includes('|')
    ? value.split('|').map((s) => s.trim())
    : ['✓', value];

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      top: rect.top + window.scrollY - 10,
      left: rect.left + rect.width / 2,
    });
    setShow(true);
  };

  const handleMouseLeave = () => setShow(false);

  return (
    <span
      className="tooltip-anchor"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'inline-block', position: 'relative', cursor: 'default' }}
    >
      {symbol === '-' ? <span className="hourglass">{'\u231B'}</span> : '\u2713'}
      {show && (
        <TooltipPortal>
          <div
            className="floating-tooltip"
            style={{
              position: 'fixed',
              top: position.top,
              left: position.left,
              transform: 'translate(-10px,40px)',
              zIndex: 10000,
              backgroundColor: '#0e3b5c',
              color: '#fff',
              padding: '6px 10px',
              borderRadius: '4px',
              fontSize: '0.9rem',
              maxWidth: '200px',
              pointerEvents: 'none',
              whiteSpace: 'pre-line',
              
            }}
          >
            {renderTooltipText(tooltip)}
          </div>
        </TooltipPortal>
      )}
    </span>
  );
};
