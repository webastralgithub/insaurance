import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import InputMask from 'react-input-mask';
import Places from "./Places";


const AddLead = ({ user }) => {




  const [selectedProperty, setSelectedProperty] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("")
  const [realtorOptions, setRealtorOptions] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [firstError, setFirstError] = useState("");
  const [properties, setProperties] = useState([])
  const [selectedRealtor, setSelectedRealtor] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [categories, setCategories] = useState([])
  const [seletedCategory, setSelectedCategory] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState({
    value: 2, // Set the value of "British Columbia"
    label: "British Columbia", // Set the label of "British Columbia"
  });

  const [contact, setContact] = useState({
    firstname: "",
    lastname: "",
    email: "",
    profession: "",
    address1: "",
    phone: "",
    company: "",
    isLead :true ,
    //servceRequire :selectedServices,
    category: seletedCategory,
    notes: "",
    source: "",
    createdBy: user,
    realtorId: null,
    propertyId: null
  });

  // Define an array of province options

  const navigate = useNavigate();

  const { auth, leadlength, setLeadlength } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };
  const provinceOptions = [
    { value: 1, label: "Alberta" },
    { value: 2, label: "British Columbia" },
    { value: 3, label: "Manitoba" },
    { value: 4, label: "New Brunswick" },
    { value: 5, label: "Newfoundland and Labrador" },
    { value: 6, label: "Nova Scotia" },
    { value: 7, label: "Ontario" },
    { value: 8, label: "Prince Edward Island" },
    { value: 9, label: "Quebec" },
    { value: 10, label: "Saskatchewan" },
    { value: 11, label: "Northwest Territories" },
    { value: 12, label: "Nunavut" },
    { value: 13, label: "Yukon" },
  ];

  const sourceOptions = [
    { value: "Website", label: "Website" },
    { value: "Email Campaign", label: "Email Campaign" },
    { value: "Social Media Campaign", label: "Social Media Campaign" },
    { value: "Manual", label: "Manual" },
    { value: "Referral Exchange", label: "Referral Exchange" },
    { value: "Phone", label: "Phone" },
    { value: "Others", label: "Others" },
  ]
  const handlePhoneNumberChange = (event) => {
    // Extract the raw phone number from the input
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");
    setPhoneError("")
    // Update the phone number state with the raw input
    setContact({ ...contact, phone: rawPhoneNumber.slice(1, 11) });
  }

  const validateForm = () => {
    let isValid = true;
    const { firstname, email, phone } = contact;

    const trimmedFirstName = firstname.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    // Reset errors
    setErrors({
      firstname: "",
      email: "",
      phone: "",
      category: ""
    });

    // Validate firstname
    if (!trimmedFirstName) {
      setErrors(prevErrors => ({ ...prevErrors, firstname: "Name is required" }));
      isValid = false;
    }

    // Validate email
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrors(prevErrors => ({ ...prevErrors, email: "Invalid email" }));
      isValid = false;
    }

    // Validate phone number
    if (!trimmedPhone || !/^\d+$/.test(trimmedPhone) || phone.length != 10) {
      setErrors(prevErrors => ({ ...prevErrors, phone: "Invalid phone number" }));
      isValid = false;
    }
    if (!contact.category) {
      setErrors(prevErrors => ({ ...prevErrors, category: "Please Select a category" }));
      isValid = false;
    }

    if (!isValid) {
      window.scrollTo(0, 0);
    }

    return isValid;
  };

  const clearErrors = (fieldName) => {
    switch (fieldName) {
      case "firstname":
        setFirstError("");
        break;
      case "phone":
        setPhoneError("");
        break;
      case "email":
        setEmailError("")
        break;
      default:
        break;
    }
  };
  const handleProvinceSelectChange = (selectedOption) => {
    setSelectedProvince(selectedOption);
    setContact({ ...contact, provinceId: selectedOption.value });
  };

  const colourStyles = {
    valueContainer: (provided, state) => ({
      ...provided,
      paddingLeft: "0px",

    }),
    control: styles => ({ ...styles, border: 'unset', boxShadow: "unset", borderColor: "unset", minHeight: "0" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {

      return {
        ...styles,
        backGround: "#fff",
        color: "#000",
        position: "relative",
        zIndex: "99",
        fontSize: "14px"

      };
    },

  };
  const url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    getRealtorOptions();
    getCategories()
    getProperties()
  }, []);

  const getCategories = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/categories/get`, { headers });
      const options = res.data.map((realtor) => ({
        value: realtor.id,
        label: realtor.name,
      }));
      setCategories(options)
    } catch (error) {
      console.error("User creation failed:", error);
    }
  };
  const getProperties = async () => {
    try {
      const res = await axios.get(`${url}api/property`, { headers });
      const realtorOptions = res.data.map((realtor) => ({
        value: realtor.id,
        label: realtor.mls_no,
      }));
      setProperties(realtorOptions);
    } catch (error) {
      console.error(error)
    }
  };


  const getRealtorOptions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/admin/get-users`, { headers });
      const realtorOptions = res.data
        .filter((user) => user.roleId === 4 && user.isActivate)
        .map((realtor) => ({
          value: realtor.id,
          label: realtor.name,
        }));
      setRealtorOptions(realtorOptions);
    } catch (error) {
      console.error("Error fetching realtors: ", error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (!isValid) {
      return
    }
  
      try {
        const response = await axios.post(`${url}api/contacts/create`, contact, {
          headers,
        });

        if (response.status === 201) {
          // Contact added successfully
          setLeadlength(leadlength + 1)
          navigate("/leads"); // Redirect to the contacts list page
        } else {
          console.error("Failed to add contact");
        }
      } catch (error) {
        console.error("An error occurred while adding a contact:", error);
      }
    }

  const handleAddressChange = (newAddress) => {
    setContact({ ...contact, address1: newAddress });
  };
  const [errors, setErrors] = useState({
    firstname: "",
    email: "",
    phone: "",
    category: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ""
    }));
  };

  const handleRealtorSelectChange = (selectedOption) => {
    setSelectedRealtor(selectedOption);
    setContact({ ...contact, realtorId: selectedOption.value });
  };

  const goBack = (e) => {
    e.preventDefault()
    navigate(-1); // This function takes you back one step in the navigation stack
  };

  return (
    <form onSubmit={handleSubmit} className="form-user-add form-add-lead leads-add-lead-form">
      <div className="property_header header-with-back-btn">

        <h3> <button type="button" className="back-only-btn" onClick={goBack}> <img src="/back.svg" /></button>Add Lead</h3>

        <div className="top-bar-action-btns">
          {/* <button type="submit" style={{background:"#004686"}} >Save</button> */}
        </div>
      </div>
      <div className="form-user-add-wrapper">

        <div className="form-user-add-inner-wrap">
          <label>Name <span className="required-star">*</span></label>
          <input
            type="text"
            name="firstname"
            value={contact.firstname}
            onChange={handleChange}

          />
          <span className="error-message">{errors.firstname}</span>
        </div>


        <div className="form-user-add-inner-wrap">
          <label>Email Id<span className="required-star">*</span></label>
          <input
            type="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
          />
          <span className="error-message">{errors.email}</span>
        </div>
        {/* <div className="form-user-add-inner-wrap">
          <label>Birth Date</label>
          <input
            type="date"
            name="birthDate"
            value={contact.birthDate}
            onChange={handleChange}
          /> 
        </div>*/}


        <Places value={contact.address1} onChange={handleAddressChange} />
        <div className="form-user-add-inner-wrap">
          <label>Profession</label>
          <input
            type="text"
            name="profession"
            value={contact.profession}
            onChange={handleChange}
          />

        </div>

        {/* <div className="form-user-add-inner-wrap">
          <label>Address 2</label>
          <input
            type="text"
            name="address2"
            value={contact.address2}
            onChange={handleChange}
          />
        </div> */}


        {/* <div className="form-user-add-inner-wrap">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={contact.city}
            onChange={handleChange}
          />
        </div> */}




        <div className="form-user-add-inner-wrap">
          <label>Phone<span className="required-star">*</span></label>
          <InputMask
            mask="+1 (999) 999-9999"
            type="text"
            name="phone"
            value={contact.phone}
            onChange={handlePhoneNumberChange}
            placeholder="+1 (___) ___-____"

          />
          <span className="error-message">{errors.phone}</span>
        </div>



        {/* <div className="form-user-add-inner-wrap form-user-add-inner-wrap-users" style={{position:"relative", zIndex:"99"}}>
          <label>Users</label>
          <img src="/icons-form/Group30055.svg"/>
          <Select
            placeholder="Select Users..."
            value={selectedRealtor}
            onChange={(selectedOption) => 
                {
                    setContact({ ...contact, realtorId: selectedOption.value })
                    setSelectedRealtor(selectedOption)}}
            options={realtorOptions}
            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
            styles={colourStyles}
            className="select-new"
            
          />
  
        </div> */}

        {/* <div className="form-user-add-inner-wrap form-user-add-inner-wrap-add-lead-agent">
          <label>Active Agent</label>
          <img src="/icons-form/Group30055.svg"/>
          <Select
            placeholder="Select Active Agent..."
            value={selectedAgent}
            className= "select-new add-lead-select-tab"
            onChange={(selectedOption) => 
                {
                    setContact({ ...contact, agentId: selectedOption.value })
                    setSelectedAgent(selectedOption)}}
            options={realtorOptions}
            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
            styles={colourStyles}
            // className="select-new"
            
          />
  
        </div> */}

        <div className="form-user-add-inner-wrap form-user-add-inner-wrap-add-lead-source">
          <label>Source</label>
          <img src="/icons-form/Group30055.svg" />
          <Select
            placeholder="Select Active Agent..."
            value={selectedSource}
            onChange={(selectedOption) => {
              setContact({ ...contact, source: selectedOption.value })
              setSelectedSource(selectedOption)
            }}
            options={sourceOptions}
            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
            styles={colourStyles}
            className="select-new"

          />

        </div>
        <div className="form-user-add-inner-wrap form-user-add-inner-wrap-add-lead-category">
          <label>My Category<span className="required-star">*</span></label>
          <img src="/icons-form/Group30055.svg" />
          <Select
            placeholder="Select Category.."
            value={seletedCategory}
            onChange={(selectedOption) => {
              setContact({ ...contact, category: selectedOption.value })
              setSelectedCategory(selectedOption)
            }}
            options={categories}
            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
            styles={colourStyles}
            className="select-new"
          />
        </div>
      </div>
      <span className="error-message" style={{ color: "red" }}>{errors.category}</span>
      <div className="form-user-add-inner-btm-btn-wrap">

        <button type="submit" >Save</button>
      </div>
    </form>

  );
};

export default AddLead;
