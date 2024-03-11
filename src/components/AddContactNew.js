import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import { AuthContext } from "./context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import InputMask from 'react-input-mask';
import Places from "./Places";
import { toast } from "react-toastify";


const AddContactNew = (props) => {
  const id=props.id
 

  const [contact, setContact] = useState({
  firstname: "",
  lastname: "",
  birthDate: "",
  address1: "",

  

  source: "",
  phone: "",
  parentId: id,
  //createdAt: "",
  //updatedAt: "",
  realtorId: null,
  propertyId: null,
 // children: [],
  });

  const [selectedProperty,setSelectedProperty] = useState(null);
  const [realtorOptions, setRealtorOptions] = useState([]);
  const [selectedSource,setSelectedSource] = useState(null);
  const [firstError, setFirstError] = useState("");
  const [properties,setProperties]=useState([])
  const [selectedRealtor, setSelectedRealtor] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState({
    value: 2, // Set the value of "British Columbia"
    label: "British Columbia", // Set the label of "British Columbia"
  });
  const noSelectionOption = { value: null, label: 'No Selection' };
  // Define an array of province options

  const navigate = useNavigate();

  const { auth } = useContext(AuthContext);
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
  { value:"Website", label: "Phone" },
  { value:"Others", label: "Others" },
]
const handlePhoneNumberChange = (event) => {
  // Extract the raw phone number from the input
  const rawPhoneNumber = event.target.value.replace(/\D/g, "");

  // Update the phone number state with the raw input
  setContact({ ...contact, phone: rawPhoneNumber.slice(1,11) });
}
  const handleProvinceSelectChange = (selectedOption) => {
    setSelectedProvince(selectedOption);
    setContact({ ...contact, provinceId: selectedOption.value });
  };
  
  const colourStyles = {
    valueContainer: (provided, state) => ({
      ...provided,
     paddingLeft:"0px"
    }),
    control: styles => ({ ...styles, border: 'unset',boxShadow:"unset",borderColor:"unset",minHeight:"0" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
     
      return {
        ...styles,
      
     
      };
    },
  
  };
  const url = process.env.REACT_APP_API_URL;

  // useEffect(() => {
  //   getRealtorOptions();
  //   getProperties()
  // }, []);
  // const getProperties = async () => {
  //   try {
  //   const res = await axios.get(`${url}api/property`, { headers });
  //   const realtorOptions = res.data.map((realtor) => ({
  //     value:realtor.id ,
  //     label: realtor.mls_no,
  //   }));

  //   setProperties([noSelectionOption,...realtorOptions]);
 
    
      
  //    } catch (error) {
   
  //    }
    
  // };
  // const getRealtorOptions = async () => {
  //   try {
  //     const res = await axios.get(`${process.env.REACT_APP_API_URL}api/admin/get-users`, { headers });
  //     const realtorOptions = res.data
  //      .filter((user) => user.roleId === 4 && user.isActivate)
  //       .map((realtor) => ({
  //         value: realtor.id,
  //         label: realtor.name,
  //       }));
  //     setRealtorOptions([noSelectionOption,...realtorOptions]);
  //   } catch (error) {
  //     console.error("Error fetching realtors: ", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
    try {
      const response = await axios.post(`${url}api/contacts/create`, contact, {
        headers,
      });

      if (response.status === 201) {
        // Contact added successfully
       goBack()

        toast.success(' Contact added successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT }); // Redirect to the contacts list page
 
         // Redirect to the contacts list page
      } else {
        console.error("Failed to add contact");
      }
    } catch (error) {
      console.error("An error occurred while adding a contact:", error);
    }
  }
  };

  const validateForm = () => {
    let isValid = true;

    if (!contact.firstname) {
      setFirstError("First Name is required");
      isValid = false;
    }

  

      if(!isValid){
    window.scrollTo(0,0)
  }
      return isValid;
  };
  const handleAddressChange = (newAddress) => {
    setContact({ ...contact, address1: newAddress });
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    clearErrors(name);
    setContact({ ...contact, [name]: value });
  };

  const handleRealtorSelectChange = (selectedOption) => {
    setSelectedRealtor(selectedOption);
    setContact({ ...contact, realtorId: selectedOption.value });
  };
     
  const goBack = () => {
    navigate(-1); // This function takes you back one step in the navigation stack
  };

  return (
    <form onSubmit={handleSubmit} className="form-user-add">
           <div className="property_header header-with-back-btn">
          
          <h3> <button  type="button" className="back-only-btn" onClick={goBack}> <img src="/back.svg" /></button>Add Contact</h3>
          </div> 
          <div className="form-user-add-wrapper">
    
          <div className="form-user-add-inner-wrap">
          <label>Name</label>
          <input
            type="text"
            name="firstname"
            value={contact.firstname}
            onChange={handleChange}
         

          />
            <span className="error-message">{firstError}</span>
       
        </div>
        
        <div className="form-user-add-inner-wrap">
          <label>Phone</label>
          <InputMask
          mask="+1 (999) 999-9999"
          type="text"
          name="phone"
          value={contact.phone}
          onChange={handlePhoneNumberChange}
          placeholder="+1 (___) ___-____"
          
        />
        </div>
 
     
        <div className="form-user-add-inner-wrap">
          <label>Email Id</label>
          <input
            type="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
          />
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
       



    
      
 
        </div>
        <div className="form-user-add-inner-btm-btn-wrap">
     
        <button type="submit" ><img src="/add-new.svg"/>Add FamilyMember</button>
        </div>
      </form>
 
  );
};

export default AddContactNew;












