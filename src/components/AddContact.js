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


const AddContact = ({user}) => {
  const [contact, setContact] = useState({
    firstname: "",
    lastname: "",
    createdBy:user,
    address1: "",

    source: "",
    phone: "",
    parentId: null,
    //createdAt: "",
    //updatedAt: "",
    realtorId: null,
    propertyId: null,
   // children: [],
  });
  const noSelectionOption = { value: null, label: 'No Selection' };

  const [selectedProperty,setSelectedProperty] = useState(null);
  const [realtorOptions, setRealtorOptions] = useState([]);
  const[emailError,setEmailError]=useState("")
  const [selectedSource,setSelectedSource] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [firstError, setFirstError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [propertyTypeError, setPropertyTypeError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [properties,setProperties]=useState([])
  const [categories,setCategories]=useState([])
  const [seletedCategory, setSelectedCategory] = useState(null);
  const [selectedRealtor, setSelectedRealtor] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState({
    value: 2, // Set the value of "British Columbia"
    label: "British Columbia", // Set the label of "British Columbia"
  });

  // Define an array of province options

  const serviceOptions = [
    { value: 'Real Estate', label: 'Real Estate' },
    { value: 'Mortgage', label: 'Mortgage' },
    { value: 'Insurance', label: 'Insurance' },
    { value: 'Immigration', label: 'Immigration' }
  ];
  const validateEmail = (email) => {
    // Define a regular expression pattern for email validation.
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailPattern.test(email);
  };

  const validateForm = () => {
    let isValid = true;

    if (!contact.firstname) {
      setFirstError("Name is required");
      isValid = false;
    }
if(contact.email){
  const emailval=validateEmail(contact.email)
  if(!emailval){
setEmailError("invalid email")
isValid = false;
  }
}
if(contact.phone){
  if(contact.phone.length!=10){
    setPhoneError("Invalid phone number")
    isValid = false;
  }
}

      if(!isValid){
    window.scrollTo(0,0)
  }
      return isValid;
  };
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
  setPhoneError("")
  const rawPhoneNumber = event.target.value.replace(/\D/g, "");
console.log(rawPhoneNumber,"DAagdggdgd")
  // Update the phone number state with the raw input
  setContact({ ...contact, phone: rawPhoneNumber.slice(1,11) });
}
  const handleProvinceSelectChange = (selectedOption) => {
    setSelectedProvince(selectedOption);
    setContact({ ...contact, provinceId: selectedOption.value });
  };
  
  const colourStyles = {
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
    getCategories()
    getProperties()
  }, []);

  const getCategories = async () => {
    try {
     const res= await axios.get(`${process.env.REACT_APP_API_URL}api/categories/get`, { headers });
     const options=res.data.map((realtor) => ({
      value: realtor.id,
      label: realtor.name,
    }));
     setCategories(options)
      console.log("User created successfully!",res);
    } catch (error) {
      console.error("User creation failed:", error);
    }
  };
  const getProperties = async () => {
    try {
    const res = await axios.get(`${url}api/property`, { headers });
    const realtorOptions = res.data.map((realtor) => ({
      value:realtor.id ,
      label: realtor.mls_no,
    }));

    setProperties([noSelectionOption,...realtorOptions]);
 
    
      
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
      setRealtorOptions([noSelectionOption,...realtorOptions]);
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
        navigate("/contacts");
        toast.success(' Contact added successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT }); // Redirect to the contacts list page
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    clearErrors(name);
    setContact({ ...contact, [name]: value });
  };

  // const handleRealtorSelectChange = (selectedOption) => {
  //   setSelectedRealtor(selectedOption);
  //   setContact({ ...contact, realtorId: selectedOption.value });
  // };
     
  const goBack = () => {
    navigate(-1); // This function takes you back one step in the navigation stack
  };

  return (
    <form onSubmit={handleSubmit} className="form-user-add add-contact-from-adst">
           <div className="property_header header-with-back-btn">
          
          <h3> <button  type="button" className="back-only-btn" onClick={goBack}> <img src="/back.svg" /></button>Add Contact</h3>
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
        {/* <div className="form-user-add-inner-wrap">
          <label>Last Name</label>
          <input
            type="text"
            name="lastname"
            value={contact.lastname}
            onChange={handleChange}
            
          />
        </div>
      */}
        <div className="form-user-add-inner-wrap">
          <label>Email Id</label>
          <input
            type="text"
            name="email"
            value={contact.email}
            onChange={handleChange}
          />
                <span className="error-message">{emailError}</span>
        </div>
        <div className="form-user-add-inner-wrap">
          <label>Profession</label>
          <div className="edit-new-input">
          <input
            type="text"
            name="profession"
            value={contact.profession}
            onChange={handleChange}
          />
               </div>
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
          <label>City</label>
          <input
            type="text"
            name="city"
            value={contact.city}
            onChange={handleChange}
          />
        </div> */}
       
       <div className="add-contact-user-custom-wrapper">
        <div className="add-contact-user-custom-left">
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
           <span className="error-message">{phoneError}</span>
        </div>
        <div className="form-user-add-inner-wrap">
          <label>Company Name</label>
          <div className="edit-new-input">
          <input
            type="text"
            name="company"
            value={contact.company}
            onChange={handleChange}
          />
               </div>
               </div>
        {/* <div className="form-user-add-inner-wrap">
          <label>User</label>
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
        <div className="form-user-add-inner-wrap">
          <label>Active Agent</label>
          <img src="/icons-form/Group30055.svg"/>
          <Select
            placeholder="Select Active Agent..."
            value={selectedAgent}

            onChange={(selectedOption) => 
                {
                    setContact({ ...contact, agentId: selectedOption.value })
                    setSelectedAgent(selectedOption)}}
            options={realtorOptions}
            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
            styles={colourStyles}
            className="select-new"
            
          />
  
        </div>
        <div className="form-user-add-inner-wrap">
          <label>Service Require</label>
          <Select
  placeholder="Select Service(s) Required..."
  value={selectedServices}
  onChange={(selectedOptions) => {
    setSelectedServices(selectedOptions);
    // You can also extract the values into an array if needed
    const selectedValues = selectedOptions.map(option => option.value);
    setContact({ ...contact, servceRequire: selectedValues });
  }}
  options={serviceOptions}
  components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
  styles={colourStyles}
  className="select-new"
  isMulti // This is what enables multiple selections
/>
        
        </div>
        <div className="form-user-add-inner-wrap">
          <label>Category</label>
          <img src="/icons-form/Group30055.svg"/>
          <Select
            placeholder="Select Category.."
            value={seletedCategory}
            onChange={(selectedOption) => 
                {
                    setContact({ ...contact, category: selectedOption.value })
                    setSelectedCategory(selectedOption)}}
            options={categories}
            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
            styles={colourStyles}
            className="select-new"
            
          />

        </div>
        </div>

        <div className="add-contact-user-custom-right">
        <div className="form-user-add-inner-wrap">
  <label>Description</label>
  <CKEditor
    editor={ClassicEditor}
    data={contact.notes}
    onChange={(event, editor) => {
      const data = editor.getData();
      setContact({ ...contact, notes: data });
    }}
    config={{
      toolbar: ["heading", "|", "bold", "italic", "link", "|", "bulletedList", "numberedList", "|", "undo", "redo"],
    }}
    className="custom-ckeditor" // Add a custom class for CKEditor container
    style={{ width: "100%", maxWidth: "800px",height:"200px" }}
  />
        </div>
        </div>

       </div>
    
        </div>
        <div className="form-user-add-inner-btm-btn-wrap">
     
        <button type="submit" >Save</button>
        </div>
      </form>
 
  );
};

export default AddContact;
