import React, { useState, useEffect, useContext, useRef } from "react";
import { Message, toaster } from "rsuite";
import { toast } from "react-toastify";
import axios from "axios";

import Select from 'react-select';
import Places from "../Places";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "draft-js";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import ImageUploader from "../ImageUploader";
import PlacesNew from "../PlacesNew";


const AddPropertyContact = () => {
  const scrollToRef = useRef(null);
const {id}=useParams()

const parent=localStorage.getItem("parent")
    const [selectedRealtor, setSelectedRealtor] = useState(null);
    const [selectedLawyer, setSelectedLawyer] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const [lawyerOptions, setLawyerOptions] = useState([]);
    const [date, setDate] = useState('');
    const [openTime, setOpenTime] = useState('');
    const [closeTime, setCloseTime] = useState('');
    const [images, setImages] = useState([]);
    const [mainImage, setMainImage] = useState(null);
    // Add state variables for validation errors
    const [mlsNoError, setMlsNoError] = useState("");
    const [propertyTypeError, setPropertyTypeError] = useState("");
    const [priceError, setPriceError] = useState("");
    const [property, setProperty] = useState({
      mls_no: "",
      propertyType: "",
      price: 0,
      contactId:Number(id),
      // ...other fields
    });
    const statusOptions = [
      { id: 1, name: "Active", color: "green" },
      { id: 2, name: "Foreclosures", color: "red" },
      { id: 3, name: "For Rent", color: "blue" },
      { id: 4, name: "For Sale", color: "purple" },
      { id: 5, name: "Lease", color: "orange" },
      { id: 6, name: "New Construction", color: "cyan" },
      { id: 7, name: "New Listing", color: "pink" },
      { id: 8, name: "Open House", color: "teal" },
      { id: 9, name: "New Price", color: "indigo" },
      { id: 10, name: "Resale", color: "lime" },
      { id: 11, name: "Sold", color: "brown" },
      { id: 12, name: "Land", color: "gray" },
      { id: 13, name: "Owner Occupied", color: "olive" },
    ];
    
    const [users,setUsers]=useState([])
     const navigate=useNavigate()
    const { auth } = useContext(AuthContext);
    const headers = {
      Authorization: auth.token,
    };
    const url = process.env.REACT_APP_API_URL;
    useEffect(() => {
       
         getUsers()
       }, []);
     
     
       const getUsers = async () => {
         try {
          const res= await axios.get(`${process.env.REACT_APP_API_URL}api/admin/get-users`, { headers });
          setUsers(res.data)
          
         } catch (error) {
          
         }
       };
    const onAdd = async (property) => {
      let response;
        try {

          if(property.status==8){
            response = await axios.post(`${url}api/property/create`, {...property,mainImage:mainImage,images:images,openTime,
             closeTime,
             openHouseDate:date }
           
           
           , {
             headers,
           });
         }
         else{
            response = await axios.post(`${url}api/property/create`, {...property,mainImage:mainImage,images:images
             }
           
           
           , {
             headers,
           });
         }
          // Make an HTTP POST request to create the property
     
      
          // Check if the response indicates success (you might want to validate this based on your API's response format)
          if (response.status === 201) {
    
            toast.success(' Property added successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
            // Show a success message
           navigate(`/contact/edit/${id}`)
      
            // Fetch the updated list of properties
    
      
            // Close the modal (assuming closeModal is a function that does this)
    
          } else {
            toast.error('Failed to add property. Please try again later.', { autoClose: 5000, position: toast.POSITION.TOP_RIGHT });
            // Handle the case where the server returned a non-successful status code
           
          }
        } catch (error) {
          // Handle any errors that occur during the HTTP request
          console.error('An error occurred while adding a property:', error);
      
          // Show an error message to the user
          toaster.push(
            <Message type="error" closable duration={5000}>
              An error occurred while adding the property. Please try again later.
            </Message>,
            { placement: 'topEnd' }
          );
        }
      };


      
        const goBack = () => {
          navigate(-1); // This function takes you back one step in the navigation stack
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
    const realtorOptions= [
      { value: 'Apartment', label: 'Apartment' },
      { value: 'Commercial', label: 'Commercial' },
      { value: 'Condominium', label: 'Condominium' },
      { value: 'Loft', label: 'Loft' },
      { value: 'Lot', label: 'Lot' },
      { value: 'Multi Family Home', label: 'Multi Family Home' },
      { value: 'Office', label: 'Office' },
      { value: 'Shop', label: 'Shop' },
      { value: 'Single Family Home', label: 'Single Family Home' },
      { value: 'Studio', label: 'Studio' },
      { value: 'Townhouse', label: 'Townhouse' },
      { value: 'Villa', label: 'Villa' }
    ];
    useEffect(() => {
      // Fetch Realtor and Lawyer options and populate the select inputs
      const lawyers = users.filter((user) => user.roleId === 3);
      const realtors = users.filter((user) => user.roleId === 4);
  
      // Map the users into an array of options with 'label' and 'value' properties
   
   
    }, [users]);
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      // Validate the fields before submission
      if (validateForm()) {
        onAdd(property);
      }

    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;

      // Clear validation errors when the user makes changes
      clearErrors(name);
  
      setProperty({ ...property, [name]: value });
    };
    const scrollToTop = () => {
      if (scrollToRef.current) {
        scrollToRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    // Validate the form fields and set validation errors
    const validateForm = () => {
      let isValid = true;
  
      // if (!property.mls_no) {
      //   setMlsNoError("MLS No is required");
      //   isValid = false;
      // }
  
      if (!property.propertyType) {
        setPropertyTypeError("Type is required");
        isValid = false;
      }
  
      if (!property.price) {
        setPriceError("Price is required");
        isValid = false;
      }
  
        if(!isValid){
          scrollToTop()
  }
      return isValid;
    };
    const handleAddressChange = (newAddress) => {
   
      setProperty({ ...property, address: newAddress });
    };
    const handlePrincipalAddressChange = (newAddress) => {
      setProperty({ ...property, principalAddress: newAddress });
    };
  
    // Clear validation errors for the specified field
    const clearErrors = (fieldName) => {
      switch (fieldName) {
        case "mls_no":
          setMlsNoError("");
          break;
        case "propertyType":
          setPropertyTypeError("");
          break;
        case "price":
          setPriceError("");
          break;
        default:
          break;
      }
    };
  
  
    return (
  
  
  
  
  
  
  
  
      <form onSubmit={handleSubmit} className="form-user-add">
          
          <div className="property_header header-with-back-btn" ref={scrollToRef}>
          
          <h3> <button  type="button" className="back-only-btn" onClick={goBack}> <img src="/back.svg" /></button>{parent}-Add Property</h3>
          </div> 
          
          <div className="form-user-add-wrapper">
         
         <div className="form-user-add-inner-wrap">
           <label>MLS No</label>
           <img src="/icons-form/num.svg"/>
           <input
             type="text"
             name="mls_no"
             value={property.mls_no}
             onChange={handleChange}
             placeholder="MLS No"
             className="property-input"
           />
           <span className="error-message">{mlsNoError}</span>
         </div>

          
         <Places value={property.address} onChange={handleAddressChange} newClass="main-add"  /> 
         <PlacesNew key="principalAddress" value={property.principalAddress} onChange={handlePrincipalAddressChange} newField="Principal Address"  newClass="pric-add"/> 
 
         {/* <div className="form-user-add-inner-wrap">
        
           <label>Property Type<span className="required-star">*</span></label>
           <img src="/icons-form/Vector.svg"/>
 
           <input
             type="text"
             name="propertyType"
             value={property.propertyType}
             onChange={handleChange}
             placeholder="Property Type"
             className="property-input"
           />
           <div className="error-message">{propertyTypeError}</div>
         </div> */}
  
         <div className="form-user-add-inner-wrap">
           <label>Price<span className="required-star">*</span></label>
           <img src="/icons-form/$.svg"/>
           <input
               type="number"
          min={0}
             name="price"
             value={property.price}
             onChange={handleChange}
             placeholder="Price"
             className="property-input"
           />
           <span className="error-message">{priceError}</span>
         </div>
 
     <div className="form-user-add-inner-wrap">
       <label>Square Feet</label>
       <img src="/icons-form/Group-3.svg"/>
       <input
         type="text"
         value={property.squareFeet}
         onChange={(e) => setProperty({ ...property, squareFeet: e.target.value })}
         placeholder="Square Feet"
         className="property-input"
       />
     </div>

  
    
 
     <div className="form-user-add-inner-wrap">
       <label>Contract Date</label>
 
       <img src="/icons-form/Group-3.svg"/>
       <input
         type="date"
         value={property.contractDate}
         onChange={(e) => setProperty({ ...property, contractDate: e.target.value })}
         placeholder="Contract Date"
         className="property-input"
       />
     </div>
 
     <div className="form-user-add-inner-wrap">
       <label>Subject Removal Date</label>
       <img src="/icons-form/Group-3.svg"/>
       <input
         type="date"
         value={property.subjectRemovalDate}
         onChange={(e) => setProperty({ ...property, subjectRemovalDate: e.target.value })}
         placeholder="Subject Removal Date"
         className="property-input"
       />
     </div>
 
     <div className="form-user-add-inner-wrap">
       <label>Completion Date</label>
       <img src="/icons-form/Group-3.svg"/>
       <input
         type="date"
         value={property.completionDate}
         onChange={(e) => setProperty({ ...property, completionDate: e.target.value })}
         placeholder="Completion Date"
         className="property-input"
       />
     </div>
 
     <div className="form-user-add-inner-wrap">
       <label>Possession Date</label>
       <img src="/icons-form/Group-3.svg"/>
       <input
         type="date"
         value={property.possesionDate}
         onChange={(e) => setProperty({ ...property, possesionDate: e.target.value })}
         placeholder="Possession Date"
         className="property-input"
       />
       </div>
       <div className="form-user-add-inner-wrap">
       <label>Bedrooms</label>
 
       <img src="/icons-form/Group-3.svg"/>
       <input
           type="number"
          min={0}
         value={property.bedrooms}
         onChange={(e) => setProperty({ ...property, bedrooms: e.target.value })}
         placeholder="Bedrooms"
         className="property-input"
       />
     </div>
     <div className="form-user-add-inner-wrap">
       <label>Bathrooms</label>
 
       <img src="/icons-form/Group-3.svg"/>
       <input
           type="number"
          min={0}
         value={property.bathrooms}
         onChange={(e) => setProperty({ ...property, bathrooms: e.target.value })}
         placeholder="Bathrooms"
         className="property-input"
       />
     </div>

   
     <div className="form-user-add-inner-wrap">
         <label>Lawyer</label>
         <img src="/icons-form/Group30056.svg"/>
         <input
         type="text"
         value={property.lawyerName}
         onChange={(e) => setProperty({ ...property, lawyerName: e.target.value })}
         placeholder="Lawyer"
         className="property-input"
       />
     
         </div>
       
 
       {/* <div className="form-user-add-inner-wrap">
         <label>Owner</label>
         <img src="/icons-form/Group30055.svg"/>
         <Select
           placeholder="Select Owner..."
           value={selectedRealtor}
           onChange={(selectedOption) => 
               {
                   setProperty({ ...property, realtorId: selectedOption.value })
                   setSelectedRealtor(selectedOption)}}
           options={realtorOptions}
           components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
           styles={colourStyles}
           className="select-new"
           
         />
 
       </div> */}
       {/* <div className="form-user-add-inner-wrap">
         <label>Active Agent</label>
         <img src="/icons-form/Group30055.svg"/>
         <Select
           placeholder="Select Active Agent..."
           value={selectedAgent}
           onChange={(selectedOption) => 
               {
                 setProperty({ ...property,agentId: selectedOption.value })
       
                   setSelectedAgent(selectedOption)}}
           options={realtorOptions}
           components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
           styles={colourStyles}
           className="select-new"
           
         />
 


       </div> */}

<div className="form-user-add-inner-wrap">
  <label>Style</label>
  <img src="/icons-form/Group-3.svg"/>
  <input
    type="text"
    value={property.style}
    onChange={(e) => setProperty({ ...property, style: e.target.value })}
    placeholder="Style"
    className="property-input"
  />
</div>

<div className="form-user-add-inner-wrap">
  <label>Storeys in Building</label>
  <img src="/icons-form/Group-3.svg"/>
  <input
    type="text"
    value={property.storeysInBuilding}
    onChange={(e) => setProperty({ ...property, storeysInBuilding: e.target.value })}
    placeholder="Storeys in Building"
    className="property-input"
  />
</div>
<div className="form-user-add-inner-wrap">
  <label>Parking</label>
  <img src="/icons-form/Group-3.svg"/>
  <input
    type="text"
    value={property.parking}
    onChange={(e) => setProperty({ ...property, parking: e.target.value })}
    placeholder="Parking"
    className="property-input"
  />
</div>

<div className="form-user-add-inner-wrap">
  <label>Parking Places</label>
  <img src="/icons-form/Group-3.svg"/>
  <input
    type="text"
    value={property.parkingPlaces}
    onChange={(e) => setProperty({ ...property, parkingPlaces: e.target.value })}
    placeholder="Parking Places"
    className="property-input"
  />
</div>

<div className="form-user-add-inner-wrap">
  <label>Interior Features</label>
  <img src="/icons-form/Group-3.svg"/>
  <input
    type="text"
    value={property.interiorFeatures}
    onChange={(e) => setProperty({ ...property, interiorFeatures: e.target.value })}
    placeholder="Interior Features"
    className="property-input"
  />
</div>

<div className="form-user-add-inner-wrap">
  <label>Amenities</label>
  <img src="/icons-form/Group-3.svg"/>
  <input
    type="text"
    value={property.amenities}
    onChange={(e) => setProperty({ ...property, amenities: e.target.value })}
    placeholder="Amenities"
    className="property-input"
  />
</div>

<div className="form-user-add-inner-wrap">
  <label>Heating</label>
  <img src="/icons-form/Group-3.svg"/>
  <input
    type="text"
    value={property.heating}
    onChange={(e) => setProperty({ ...property, heating: e.target.value })}
    placeholder="Heating"
    className="property-input"
  />
</div>

<div className="form-user-add-inner-wrap">
  <label>Gross Tax</label>
  <img src="/icons-form/Group-3.svg"/>
  <input
    type="text"
    value={property.grossTax}
    onChange={(e) => setProperty({ ...property, grossTax: e.target.value })}
    placeholder="Gross Tax"
    className="property-input"
  />
</div>

<div className="form-user-add-inner-wrap">
  <label>Tax Year</label>
  <img src="/icons-form/Group-3.svg"/>
  <input
    type="text"
    value={property.taxYear}
    onChange={(e) => setProperty({ ...property, taxYear: e.target.value })}
    placeholder="Tax Year"
    className="property-input"
  />
</div>

<div className="form-user-add-inner-wrap">
  <label>Maintenance Fee</label>
  <img src="/icons-form/Group-3.svg"/>
  <input
    type="text"
    value={property.maintenanceFee}
    onChange={(e) => setProperty({ ...property, maintenanceFee: e.target.value })}
    placeholder="Maintenance Fee"
    className="property-input"
  />
</div>

<div className="form-user-add-inner-wrap">
  <label>Lot Dimensions</label>
  <img src="/icons-form/Group-3.svg"/>
  <input
    type="text"
    value={property.lotDimensions}
    onChange={(e) => setProperty({ ...property, lotDimensions: e.target.value })}
    placeholder="Lot Dimensions"
    className="property-input"
  />
</div>

<div className="form-user-add-inner-wrap">
  <label>View</label>
  <img src="/icons-form/Group-3.svg"/>
  <input
    type="text"
    value={property.view}
    style={{marginTop:"11px"}}
    onChange={(e) => setProperty({ ...property, view: e.target.value })}
    placeholder="View"
    className="property-input"
  />
</div>

<div className="form-user-add-inner-wrap">
  <label>Lot Features</label>
  <img src="/icons-form/Group-3.svg"/>
  <input
    type="text"
    style={{marginTop:"11px"}}
    value={property.lotFeatures}
    onChange={(e) => setProperty({ ...property, lotFeatures: e.target.value })}
    placeholder="Lot Features"
    className="property-input"
  />
</div>


          <div className="form-user-add-inner-wrap">
         <label>Property Type<span className="required-star">*</span></label>
         <img src="/icons-form/Group30055.svg"/>
         <Select
           placeholder="Select Type.."
           value={selectedRealtor}
           onChange={(selectedOption) => 
               {  setPropertyTypeError("")
                   setProperty({ ...property, propertyType: selectedOption.value })
                   setSelectedRealtor(selectedOption)}}
           options={realtorOptions}
           components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
           styles={colourStyles}
           className="select-new"
           
         />
   <span className="error-message">{propertyTypeError}</span>
       </div>

         <div className="form-user-add-inner-wrap">
         <label>Status</label>
         <img src="/icons-form/Group30056.svg"/>
         <Select
           placeholder="Select Status..."
           value={selectedStatus}
           onChange={(selectedOption) =>
               {
                   setProperty({ ...property, status: selectedOption.value })
                    setSelectedStatus(selectedOption)
               }}
           components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
           options={statusOptions.map((option) => ({
             value: option.id,
             label: option.name,
             color: option.color,
           }))}
           styles={colourStyles}
           className="select-new"
         />
         </div>

         {selectedStatus?.value === 8 && (

// ...Open/Close time inputs

<div className="form-user-add-inner-wrap">
 <label>Date</label>
 <input
   type="date"
   value={date}
   onChange={e => setDate(e.target.value)}
 />
</div>

)}
{selectedStatus?.value === 8 && (
 <>
   <div className="form-user-add-inner-wrap">
     <label>Open Time</label>
     <input 
       type="time"
       value={openTime}
       onChange={e => setOpenTime(e.target.value)} 
     />
   </div>

   <div className="form-user-add-inner-wrap">
     <label>Close Time</label>
     <input
       type="time" 
       value={closeTime}
       onChange={e => setCloseTime(e.target.value)}  
     />
   </div>
 </>
)}
         {/* <div className="form-user-add-inner-wrap">
       <label>Description</label>

      
       <textarea  name="description"
             value={property.description}
             onChange={handleChange}>{property?.description}</textarea>
     </div>
       <div className="form-user-add-inner-wrap">
       <label>Notes</label>
       <textarea    name="notes"
             value={property.notes}
             onChange={handleChange}>{property?.notes}</textarea>
       </div> */}

     <ImageUploader
     
     images={images}
     setImages={setImages}
     mainImage={mainImage}
     setMainImage={setMainImage}
     headers={headers}
     url={url}
     />
       <div className="notes-section">
       <div className="form-user-add-inner-wrap">
 <label>Description</label>
 <CKEditor
   editor={ClassicEditor}
   data={property.description}
   onChange={(event, editor) => {
     const data = editor.getData();
     setProperty({ ...property, description: data });
   }}
   config={{
     toolbar: ["heading", "|", "bold", "italic", "link", "|", "bulletedList", "numberedList", "|", "undo", "redo"],
   }}
   className="custom-ckeditor" // Add a custom class for CKEditor container
   style={{ width: "100%", maxWidth: "800px",height:"200px" }}
 />
</div>

<div className="form-user-add-inner-wrap">
 <label>Notes</label>
 <CKEditor
   editor={ClassicEditor}
 
   data={property.notes}
   config={{
     toolbar: ["heading", "|", "bold", "italic", "link", "|", "bulletedList", "numberedList", "|", "undo", "redo"],
   }}
   className="custom-ckeditor" // Add a custom class for CKEditor container
   style={{ width: "100%", maxWidth: "800px",height:"200px" }}
   onChange={(event, editor) => {
     const data = editor.getData();
     setProperty({ ...property, notes: data });
   }}
 />
</div>




     
</div>

     </div>
      <div className="form-user-add-inner-btm-btn-wrap">
     
      
      <button type="submit" >Add Property</button>
      </div>
    </form>
  
  
  
  
  
  
  
   
    );
  };
  export default AddPropertyContact