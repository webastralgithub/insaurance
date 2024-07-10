import React, { useState, useRef, useEffect } from 'react';
import { StandaloneSearchBox, LoadScript } from '@react-google-maps/api';

const Places = ({ value, onChange, newField, newClass }) => {
  const [selectedAddress, setSelectedAddress] = useState(value);
  const [useGoogleAddress, setUseGoogleAddress] = useState(false); // Added state for Google address
  const inputRef = useRef();

  useEffect(() => {
    setSelectedAddress(value);
  }, [value]);

  const handlePlaceChanged = () => {
    const [place] = inputRef.current.getPlaces();
    if (place) {
      const address = place.formatted_address;
      setSelectedAddress(address);
      onChange(address);
    }
  };

  const handleManualAddressChange = (event) => {
    const newValue = event.target.value;
    setSelectedAddress(newValue);
    onChange(newValue);
  };

  let className = 'form-user-add-inner-wrap ';
  if (newClass) {
    className += newClass;
  }

  return (
    <div className={className}>
      <label>{!newField ? 'Address' : newField}</label>
      <div className='address-toggle'>
        <input
          type='radio'
          name='addressTypeparent'
          value='google'
          checked={useGoogleAddress}
          onChange={() => setUseGoogleAddress(true)}
        />
        <label onClick={() => setUseGoogleAddress(true)}>Google</label>

        <input
          type='radio'
          name='addressTypeparent'
          value='manual'
          checked={!useGoogleAddress}
          onChange={() => setUseGoogleAddress(false)}
        />
        <label onClick={() => setUseGoogleAddress(false)}>Manual</label>
      </div>

      {useGoogleAddress ? (
        <StandaloneSearchBox
          onLoad={(ref) => (inputRef.current = ref)}
          onPlacesChanged={handlePlaceChanged}
        >
          <div className='edit-new-input'>
            <input
              type='text'
              defaultValue={value}
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              placeholder='Enter Google Address'
              disabled={!useGoogleAddress}
            />
          </div>
        </StandaloneSearchBox>
      ) : (
        <div className='edit-new-input'>
          <input
            type='text'
            value={selectedAddress}
            onChange={handleManualAddressChange}
            placeholder='Enter Manual Address'
          />
        </div>
      )}
    </div>
  );
};

export default Places;
