import React, { useContext, useState } from "react";
import axios from "axios";
import Select from "react-select";
import InputMask from 'react-input-mask';
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const AddUserForm = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Add state variables for form fields and error messages
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    roleId: 4,
    name: "",
    email: "",
    phone: "",
  });

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const headers = {
    Authorization: auth.token,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
        case "username":
          setUsernameError("");
          break;
        case "password":
          setPasswordError("");
          break;
        case "name":
          setNameError("");
          break;
        case "email":
          setEmailError("");
          break;
   
        default:
          break;
      }
    setUserData({ ...userData, [name]: value });
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form fields before submission
    if (validateForm()) {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}api/admin/create-user`,
          userData,
          { headers }
        );
        toast.success('Owner created successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
goBack()
        // Clear the form fields after successful submission
        setUserData({
          username: "",
          password: "",
          roleId: 4,
          name: "",
          email: "",
          phone: "",
        });
      } catch (error) {
        console.error("User creation failed:", error);
      }
    }
  };

  const validateEmail = (email) => {
    // Define a regular expression pattern for email validation.
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailPattern.test(email);
  };
  // Validate the form fields and set validation errors
  const validateForm = () => {
    let isValid = true;

    if (!userData.username) {
      setUsernameError("Username is required");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!userData.password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!userData.name) {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }
if(userData.email){
  if(!validateEmail(userData.email)){
    setEmailError("Invalid email")
}
}
    if (!userData.email) {
      setEmailError("Email is required");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!userData.phone) {
      setPhoneError("Phone is required");
      isValid = false;
    } else {
      setPhoneError("");
    }

      if(!isValid){
    window.scrollTo(0,0)
  }
      return isValid;
  };
  const handlePhoneNumberChange = (event) => {
    // Extract the raw phone number from the input
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");
    setPhoneError("");
          
    // Update the phone number state with the raw input
    setUserData({ ...userData, phone: rawPhoneNumber });
  }

  return (
    <form onSubmit={handleSubmit} className="form-user-add">
      <div className="property_header header-with-back-btn">
        <h3>
        <button  type="button" className="back-only-btn" onClick={goBack}> <img src="/back.svg" /></button>
          Add User
        </h3>
      </div>
      <div className="form-user-add-wrapper">
        <div className="form-user-add-inner-wrap">
          <label>Username<span className="required-star">*</span></label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
          />
          <span className="error-message">{usernameError}</span>
        </div>
        <div className="form-user-add-inner-wrap">
          <label>Email<span className="required-star">*</span></label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
          <span className="error-message">{emailError}</span>
        </div>
        <div className="form-user-add-inner-wrap">
          <label>Name<span className="required-star">*</span></label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
          />
          <span className="error-message">{nameError}</span>
        </div>
        <div className="form-user-add-inner-wrap">
          <label>Phone<span className="required-star">*</span></label>
      
  <InputMask
    mask="+1 (999) 999-9999"
    type="text"
    name="phone"
    value={userData.phone}
    onChange={handlePhoneNumberChange}
    placeholder="+1 (___) ___-____"
  />
          <span className="error-message">{phoneError}</span>
        </div>
        <div className="form-user-add-inner-wrap">
          <label>Password<span className="required-star">*</span></label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
          <span className="error-message">{passwordError}</span>
        </div>
      </div>
      <div className="form-user-add-inner-btm-btn-wrap">
        <button type="submit">Add Owner</button>
      </div>
    </form>
  );
};

export default AddUserForm;
