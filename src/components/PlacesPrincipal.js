import React, { useState, useRef } from 'react';
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";

const PlacesPrincipal = ({ value, onChange,newField }) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(value);
  const [useGoogleAddress, setUseGoogleAddress] = useState(true); // Added state for Google address
  const inputRef = useRef();

  const handlePlaceChanged = () => { 
    
    const [place] = inputRef.current.getPlaces();
    if (place) {
      const object = {};
      object['address'] = place.formatted_address;
      onChange(place.formatted_address);
    } 
  }

  const handleManualAddressChange = (event) => {
    const newValue = event.target.value;
    setSelectedAddress(newValue);
    onChange(newValue);
  }

  return (
    <div className="form-user-add-inner-wrap">
      <label>{!newField?"Address":newField}</label>
      <div className='address-toggle' key="parent-principal">
  
      
          <input
            type="radio"
            name="addressTypeparent"
            value="google"
            checked={useGoogleAddress}
            onChange={() => {
           
              setUseGoogleAddress(true)
            }}
          />
            <label>
          Google
        </label>
        
      
          <input
            type="radio"
            name="addressTypeparent"
            value="manual"
            checked={!useGoogleAddress}
            onChange={() =>
              {

                setUseGoogleAddress(false)
              }
            }
          />
            <label>
          Manual
        </label>
   
      </div>
      {useGoogleAddress ? (
   
          <StandaloneSearchBox
      
            onLoad={(ref) => (inputRef.current = ref)}
            onPlacesChanged={handlePlaceChanged}

          >
              <div             style={{marginTop:"-9px"}} className="edit-new-input">
            <input
              defaultValue={value}
              type="text"
              placeholder="Enter Google Address"
              disabled={!useGoogleAddress}
            />
            </div>
          </StandaloneSearchBox>
   
      ) : (
        <div  className="edit-new-input">
        <input
          type="text"
          value={value}
          onChange={handleManualAddressChange}
          placeholder="Enter Manual Address"
        />
        </div>
      )}
    </div>
  );
};

export default PlacesPrincipal;
