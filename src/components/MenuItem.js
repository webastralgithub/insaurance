// MenuItem.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MenuItem = ({ to, label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {to ? (
        <Link to={to}>{label}</Link>
      ) : (
        <div>
          <div onClick={handleToggle}>{label}</div>
          {isOpen && <div className="submenu">{children}</div>}
        </div>
      )}
    </div>
  );
};

export default MenuItem;
