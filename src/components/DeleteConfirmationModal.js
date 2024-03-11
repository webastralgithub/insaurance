import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <div className={`modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <p>Are you sure you want to delete this property?</p>
          <button className="button is-danger" onClick={onConfirm}>Delete</button>
          <button className="button" onClick={onClose}>Cancel</button>
        </div>
      </div>
      <button className="modal-close is-large" onClick={onClose} aria-label="close"></button>
    </div>
  );
};

export default DeleteConfirmationModal;
