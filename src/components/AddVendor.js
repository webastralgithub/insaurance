import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import InputMask from 'react-input-mask';
import Places from "./Places";
import { toast } from "react-toastify";


const AddVendor = () => {
  const [contact, setContact] = useState({
    firstname: "",
    lastname: "",

    address1: "",
    isVendor:true,

   
    source: "",
    phone: "",
    parentId: null,
    //createdAt: "",
    //updatedAt: "",

    realtorId: null,
    propertyId: null,
   // children: [],
  });


  const [selectedProperty,setSelectedProperty] = useState(null);
  const [realtorOptions, setRealtorOptions] = useState([]);
  const [selectedSource,setSelectedSource] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const [workPhoneError, setWorkPhoneError] = useState("");
  const [firstError, setFirstError] = useState("");
  const [properties,setProperties]=useState([])
  const [selectedRealtor, setSelectedRealtor] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState({
    value: 2, // Set the value of "British Columbia"
    label: "British Columbia", // Set the label of "British Columbia"
  });

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
  { value:"Phone", label: "Phone" },
  { value:"Others", label: "Others" },
]
const handlePhoneNumberChange = (event,name) => {
  // Extract the raw phone number from the input
  const rawPhoneNumber = event.target.value.replace(/\D/g, "");
setPhoneError("")
  // Update the phone number state with the raw input
  setContact({ ...contact, phone: rawPhoneNumber.slice(1,11) });
}
const handleworkPhoneNumberChange = (event,name) => {
    // Extract the raw phone number from the input
    setWorkPhoneError("")
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");
  
    // Update the phone number state with the raw input
    setContact({ ...contact, workPhone: rawPhoneNumber.slice(1,11) });
  }

const validateForm = () => {
  let isValid = true;

  if (!contact.firstname) {
    setFirstError("Name is required");
    isValid = false; 
  }
  if(contact.phone){
    if(contact.phone.length!=10){
      setPhoneError("Invalid phone number")
      isValid = false;
    }
  }
  
  if(contact.workPhone){
    if(contact.workPhone.length!=10){
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

  useEffect(() => {
    getRealtorOptions();
    getProperties()
  }, []);


  
  const getProperties = async () => {
    try {
    const res = await axios.get(`${url}api/property`, { headers });
    const realtorOptions = res.data.map((realtor) => ({
      value:realtor.id ,
      label: realtor.mls_no,
    }));

    setProperties(realtorOptions);
 
    
      
     } catch (error) {
   
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
    if (validateForm()) {
    try {
      const response = await axios.post(`${url}api/contacts/create`, contact, {
        headers,
      });

      if (response.status === 201) {
        // Contact added successfully
        navigate("/vendors");
        toast.success('Vendor added successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
        // Redirect to the contacts list page
      } else {
        console.error("Failed to add contact");
      }
    } catch (error) {
      console.error("An error occurred while adding a contact:", error);
    }
  }
  };
  const handleAddressChange = (newAddress) => {

    setContact({ ...contact, address1: newAddress });
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
     
  const goBack = (e) => {
    e.preventDefault()
    navigate(-1); // This function takes you back one step in the navigation stack
  };

  return (
    <form onSubmit={handleSubmit} className="form-user-add">
           <div className="property_header header-with-back-btn">
          
          <h3> <button  type="button" className="back-only-btn" onClick={goBack}> <img src="/back.svg" /></button>Add Vendor</h3>
        
          <div className="top-bar-action-btns"><button type="submit" style={{background:"#004686"}} >Save</button>
          </div>
          </div> 
          <div className="form-user-add-wrapper">
          <div className="form-user-add-inner-wrap">
          <label>Name<span className="required-star">*</span></label>
          <input
            type="text"
            name="firstname"
            value={contact.firstname}
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
          value={contact.phone}
          onChange={handlePhoneNumberChange}
          placeholder="+1 (___) ___-____"
          
        />
          <span className="error-message">{phoneError}</span>
        </div>
        <div className="form-user-add-inner-wrap">
          <label>Work Phone  No</label>
          <InputMask
          mask="+1 (999) 999-9999"
          type="text"
          name="phone"
          value={contact.workPhone}
          onChange={handleworkPhoneNumberChange}
          placeholder="+1 (___) ___-____"
          
        />
          <span className="error-message">{workPhoneError}</span>
        </div>
       
      

         
       <Places value={contact.address1} onChange={handleAddressChange} newField="Work Address" /> 
   
      
     

        <div className="form-user-add-inner-wrap">
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={contact.website}
            onChange={handleChange}
          />
        </div>

        <div className="form-user-add-inner-wrap">
          <label>Notes</label>
          <input
            type="text"
            name="message"
            value={contact.message}
            onChange={handleChange}
          />
        </div>
       


    
       
  
    
   

        </div>
        <div className="form-user-add-inner-btm-btn-wrap">
     
        <button type="submit" >Save</button>
        </div>
      </form>
 
  );
};

export default AddVendor;
