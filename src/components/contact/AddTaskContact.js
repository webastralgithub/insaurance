import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import InputMask from 'react-input-mask';

const AddTaskContact = () => {

    const{id}=useParams()
    const parent=localStorage.getItem("parent")
    const phonenum=localStorage.getItem("phone")
    console.log(phonenum,"fdffddfsfdfd")
  const [contact, setContact] = useState(
    {
        Followup:`Call ${parent}` ,
        ContactID:id,
      phone:phonenum!="null"?phonenum:"",
        FollowupDate:"", // Example datetime in ISO 8601 format
        Comments:"",
        IsRead:false ,
     
   
  
    }
      
  );
  const [mlsNoError, setMlsNoError] = useState("");
  const [propertyTypeError, setPropertyTypeError] = useState("");

    // Validate the form fields and set validation errors
    const validateForm = () => {
      let isValid = true;
  
    
  
      if (!contact.FollowupDate) {
        setPropertyTypeError("Follow-up Date is required");
        isValid = false;
      }
  
 
  
        if(!isValid){
    window.scrollTo(0,0)
  }
      return isValid;
    };


    const clearErrors = (fieldName) => {
      switch (fieldName) {
        case "Followup":
          setMlsNoError("");
          break;
        case "FollowupDate":
          setPropertyTypeError("");
          break;
   
        default:
          break;
      }
    };
  const [selectedContact,setSelectedContact] = useState(null);
  const [realtorOptions, setRealtorOptions] = useState([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(null);
  const [selectedChildren, setSelectedChildren] = useState(null);
  const [childrenOptions, setChildrenOptions] = useState([])
  const [contactOption,setContactOptions]=useState([])
  const [selectedRealtor, setSelectedRealtor] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState({
    value: 2, // Set the value of "British Columbia"
    label: "British Columbia", // Set the label of "British Columbia"
  });

  // Define an array of province options

  const navigate = useNavigate();

  const { auth,setAuth } = useContext(AuthContext);
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
  const childOptions = childrenOptions.map((child) => ({
    value: child.id,
    label: child.firstname,
  }));
  
  useEffect(() => {
    getRealtorOptions();
    getContacts()
  }, []);
  const getContacts = async () => {
    try {
      const response = await axios.get(`${url}api/contacts/get`, { headers });
      console.log(response.data)
      const contactsWithoutParentId = response.data.filter((contact) => contact.parentId === null).map((realtor) => ({
        value: realtor.id,
        label: realtor.firstname,
        children:realtor.children||[]
      }));
      // Set the filtered contacts in the state
     setContactOptions(contactsWithoutParentId);
    

    } catch (error) {
      // localStorage.removeItem('token');
      // setAuth(null);
      // navigate('/');
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
    if(!validateForm()){
      return
    }

    try {
      const response = await axios.post(`${url}api/todo/create`, contact, {
        headers,
      });

      if (response.status === 201) {
        // Contact added successfully
        navigate("/todo-list"); // Redirect to the contacts list page
      } else {
        console.error("Failed to add contact");
      }
    } catch (error) {
      console.error("An error occurred while adding a contact:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
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
   
   <h3> <button className="back-only-btn" onClick={(e)=>{
    e.preventDefault()
    goBack()}}> <img src="/back.svg" /></button>{parent}-Add Task</h3>
   
   <div className="top-bar-action-btns"><button type="submit" style={{background:"#004686"}} >Save</button>
 
   </div>   </div> 
   <div className="form-user-add-wrapper">
   <div className="todo-section">
 <div className="todo-main-section"> 
   <div className="form-user-add-inner-wrap">

   <label>Task Title</label>
   <input
     type="text"
     name="Followup"
     value={contact.Followup}
     readOnly
   
   />
  <span className="error-message">{mlsNoError}</span>
 </div>

 <div className="form-user-add-inner-wrap">
   <label>Follow Up Date</label>
   <input
     type="datetime-local"
     name="FollowupDate"
     value={contact.FollowupDate}
     onChange={handleChange}
     
   />
     <span className="error-message">{propertyTypeError}</span>
 </div>
 <div className="form-user-add-inner-wrap">
 <label>Phone Number</label>
 <InputMask
   mask="+1 (999) 999-9999"
   type="text"
   name="phone"
   value={contact.phone}
  readOnly
   placeholder="+1 (___) ___-____"
  
 />
</div>

 <div className="form-user-add-inner-wrap">
   <label>Task description</label>
   <input
     type="text"
     name="description"
     value={contact.description}
     onChange={handleChange}
   />
 </div>

</div>

<div className="todo-notes-section"> 



 



 
 <div className="form-user-add-inner-wrap">
   <label>Notes</label>

     <CKEditor
editor={ClassicEditor}
data={contact.Comments}
onChange={(event, editor) => {
const data = editor.getData();
setContact({ ...contact, Comments: data });
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

export default AddTaskContact;
