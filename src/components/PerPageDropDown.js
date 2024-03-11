import React from 'react';

function PerPageDropdown({ options, selected, onChange }) {
  return (
    <select value={selected} onChange={onChange} className='per-page'>
      {options.map((option) => (
        <option key={option} value={option}>
          {option} 
        </option>
      ))}
    </select>
  );
}

export default PerPageDropdown;
