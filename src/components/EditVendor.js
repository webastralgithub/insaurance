import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import InputMask from 'react-input-mask';
import Places from "./Places";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const EditVendor = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL;
  const headers = {
    Authorization: auth.token,
  };
  const [phoneError, setPhoneError] = useState("");
  const [workPhoneError, setWorkPhoneError] = useState("");
  const [firstError, setFirstError] = useState("");
  const [editedVendor, setEditedVendor] = useState({});
  useEffect(() => {
    getContactDetails();
   
  }, [id]);

  const validateForm = () => {
    let isValid = true;
  
    if (!editedVendor.firstname) {
      setFirstError("Name is required");
      isValid = false; 
    }
    if(editedVendor.phone){
      if(editedVendor.phone.length!=10){
        setPhoneError("Invalid phone number")
        isValid = false;
      }
    }
    
    if(editedVendor.workPhone){
      if(editedVendor.workPhone.length!=10){
        setWorkPhoneError("Invalid phone number")
        isValid = false;
      }
    }
    
  
      if(!isValid){
      window.scrollTo(0,0)
    }
        return isValid;
  };
  const clearErrors = (fieldName) => {
    switch (fieldName) {
      case "firstname":
        setFirstError("");
        break;
  
      default:
        break;
    }
  };  
  const getContactDetails = async () => {
    try {
      const response = await axios.get(`${url}api/contacts/get/${id}`, {
        headers,
      });
      const contactDetails = response.data;
      setEditedVendor(contactDetails);
   
  



    } catch (error) {
      console.error("Error fetching contact details: ", error);
    }
  };
  const handlePhoneNumberChange = (event) => {
    // Extract the raw phone number from the input
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");
    setPhoneError("")
    // Update the phone number state with the raw input
    setEditedVendor({ ...editedVendor, phone: rawPhoneNumber.slice(1, 11) });
  };

  const handleWorkPhoneNumberChange = (event) => {
    // Extract the raw phone number from the input
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");
    setWorkPhoneError("")
    // Update the work phone number state with the raw input
    setEditedVendor({ ...editedVendor, workPhone: rawPhoneNumber.slice(1, 11) });
  };

  const handleAddressChange = (newAddress) => {
    setEditedVendor({ ...editedVendor, address1: newAddress });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    clearErrors(name)
    setEditedVendor({ ...editedVendor, [name]: value });
  };

  const handleSaveClick = async () => {
    if(!validateForm()){
      return
    }
    try {
      const response = await axios.put(`${url}api/contacts/update/${id}`, editedVendor, {
        headers,
      });

      if (response.status === 200) {
        toast.success("Supplier updated successfully", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
        navigate(`/profile`);
      } else {
        console.error("Failed to update supplier");
      }
    } catch (error) {
      console.error("An error occurred while updating the vendor:", error);
    }
  };

  const goBack = () => {
    navigate(`/vendors`);
  };

  return (
    <div className="form-user-add">
      <div>
        <div className="property_header">
          <h3>
            {" "}
            <button  type="button" className="back-only-btn" onClick={goBack}>
              {" "}
              <img src="/back.svg" />
            </button>{" "}
            Edit Vendor
          </h3>
          <div className="top-bar-action-btns">
            <button style={{ background: "#004686" }} onClick={handleSaveClick}>
              Save
            </button>
          </div>
        </div>
      </div>
      <div className="form-user-edit-inner-wrap form-user-add-wrapper">
      <div className="form-user-add-inner-wrap">
          <label>Name</label>
          <input
            type="firstname"
            name="firstname"
            value={editedVendor.firstname}
            onChange={handleChange}
          />
           <span className="error-message">{firstError}</span>
        </div>
        <div className="form-user-add-inner-wrap">
          <label>Personal Phone No</label>
          <InputMask
            mask="+1 (999) 999-9999"
            type="text"
            name="phone"
            value={editedVendor.phone}
            onChange={handlePhoneNumberChange}
            placeholder="+1 (___) ___-____"
            
          />
           <span className="error-message">{phoneError}</span>
        </div>
        <div className="form-user-add-inner-wrap">
          <label>Work Phone No</label>
          <InputMask
            mask="+1 (999) 999-9999"
            type="text"
            name="workPhone"
            value={editedVendor.workPhone}
            onChange={handleWorkPhoneNumberChange}
            placeholder="+1 (___) ___-____"
          />
           <span className="error-message">{workPhoneError}</span>
        </div>
        <Places value={editedVendor.address1} onChange={handleAddressChange} newField="Work Address" />
        <div className="form-user-add-inner-wrap">
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={editedVendor.website}
            onChange={handleChange}
          />
        </div>
        <div className="form-user-add-inner-wrap">
          <label>Notes</label>
          <input
            type="text"
            name="message"
            value={editedVendor.message}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-user-add-inner-btm-btn-wrap">
        <button type="submit" onClick={handleSaveClick}>
         Save
        </button>
      </div>
    </div>
  );
};

export default EditVendor;
