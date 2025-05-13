// src/Modal.jsx
import React from 'react';
import './styles.css';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  const isHTMLString = typeof children === 'string';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{title}</h2>
        {isHTMLString ? (
          <div dangerouslySetInnerHTML={{ __html: children }} />
        ) : (
          <div>{children}</div>
        )}
      </div>
    </div>
  );
}
export default Modal;