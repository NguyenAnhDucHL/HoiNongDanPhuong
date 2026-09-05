import React from 'react';
import './ConfirmModal.css';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'OK', cancelText = 'Hủy', isAlert = false }) {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <h3 className="custom-modal-title">{title}</h3>
        <p className="custom-modal-message">{message}</p>
        <div className="custom-modal-actions">
          {!isAlert && (
            <button className="btn btn-secondary" onClick={onCancel}>{cancelText}</button>
          )}
          <button className={`btn ${isAlert ? 'btn-primary' : 'btn-danger'}`} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
