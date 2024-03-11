import React, { useState, useRef,useEffect } from 'react';
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";

const PlacesNew = ({ value, onChange,newField,newClass,useGoogleAddresss}) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(value);
  const [useGoogleAddress, setUseGoogleAddress] = useState(true); // Added state for Google address
  const inputRef = useRef();

  const handlePlaceChanged = () => {
 
    console.log("sdddddddd");
    const [place] = inputRef.current.getPlaces();
    if (place) {
      const object = {};
      object['address'] = place.formatted_address;
      onChange(place.formatted_address);
      console.log(place);
      console.log(place.formatted_address);
    } 
  }
  useEffect(() => {
setUseGoogleAddress(useGoogleAddresss)
   // getUsers();
  }, [useGoogleAddresss]);
  const handleManualAddressChange = (event) => {
    const newValue = event.target.value;
    setSelectedAddress(newValue);
    onChange(newValue);
  }
  var ClassName="form-user-add-inner-wrap ";
  if(newClass){
ClassName=ClassName+newClass
  }

  return (
    <div className={ClassName}>
      <label>{!newField?"Address":newField}</label>
    
      {useGoogleAddress ? (

          <StandaloneSearchBox
      
            onLoad={(ref) => (inputRef.current = ref)}
            onPlacesChanged={handlePlaceChanged}

          >
              <div  className="edit-new-input">
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

export default PlacesNew;
