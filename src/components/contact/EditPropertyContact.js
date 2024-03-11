import React, { useState, useEffect, useContext, useLayoutEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEdit, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Message, toaster } from "rsuite";
import Places from "../Places";
import { toast } from "react-toastify";
import axios from "axios";

import Select from 'react-select';

import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AuthContext } from "../context/AuthContext";
import AddTask from "../AddTask";
import ImageUploader from "../ImageUploader";
import PlacesNew from "../PlacesNew";
import EditableField from "../EditableField";

const EditPropertyContactForm = () => {
const{id}=useParams()
console.log(id)
const scrollToRef = useRef(null);
const{property}=useContext(AuthContext)
    const [editedProperty, setEditedProperty] = useState({ ...property });
    const [editingField, setEditingField] = useState("all");
    const [users,setUsers]=useState([])
    const [date, setDate] = useState('');
    const [openTime, setOpenTime] = useState('');
    const [closeTime, setCloseTime] = useState('');
    const [images, setImages] = useState([]);
    const [mainImage, setMainImage] = useState(null);
    const [selectedRealtor, setSelectedRealtor] = useState(null);
    const [selectedLawyer, setSelectedLawyer] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [realtorOptions, setRealtorOptions] = useState([]);
    const [lawyerOptions, setLawyerOptions] = useState([]);
 const navigate=useNavigate()
   
   
  
 const colourStyles = {
  valueContainer: (provided, state) => ({
    ...provided,
   paddingLeft:"0px"
  }),
  control: styles => ({ ...styles, border: 'unset',boxShadow:"unset",borderColor:"unset",minHeight:"0" }),
  input:styles=>({...styles,margin:"0px"}),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
   
    return {
      ...styles,
    
   
    };
  },

};
 const statusOptions = [
  { id: 1, name: "Active", color: "green" },
  { id: 2, name: "Foreclosures", color: "red" },
  { id: 3, name: "For Rent", color: "blue" },
  { id: 4, name: "For Sale", color: "purple" },
  { id: 5, name: "Lease", color: "orange" },
  { id: 6, name: "New Construction", color: "cyan" },
  { id: 7, name: "New Listing", color: "pink" },
  { id: 8, name: "Open House", color: "teal" },
  { id: 9, name: "Reduced Price", color: "indigo" },
  { id: 10, name: "Resale", color: "lime" },
  { id: 11, name: "Sold", color: "brown" },
  { id: 12, name: "Land", color: "gray" },
  { id: 13, name: "Owner Occupied", color: "olive" },
];
const getStatus=(id)=>{
  let option= statusOptions.find(x => x.id == id)
  return option.name
 }
 const parent=localStorage.getItem("parent")

    const { auth } = useContext(AuthContext);
 
      const url = process.env.REACT_APP_API_URL;
    const headers = {
      Authorization: auth.token,
    };

    const  onSave = async (updatedProperty) => {
let response;
      if(updatedProperty.status==8){
        response = await axios.put(
          `${url}api/property/update/${updatedProperty.id}`,
          {...updatedProperty,mainImage:mainImage,images:images,openTime,
            closeTime,
            openHouseDate:date},
            { headers }
        );
      }
      else{
        response = await axios.put(
          `${url}api/property/update/${updatedProperty.id}`,
          {...updatedProperty,mainImage:mainImage,images:images},
            { headers }
        );
      }
    goBack()
        toast.success('Listing update  successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
     
      };
      useLayoutEffect(() => {
        getProperties();
        getUsers()
   
       }, []);
       const getUsers = async () => {
        try {
         const res= await axios.get(`${process.env.REACT_APP_API_URL}api/admin/get-users`, { headers });
         setUsers(res.data)
         
        } catch (error) {
         
        }
      };

      const handleAddressChange = (newAddress) => {
        console.log(newAddress)
        setEditedProperty({ ...editedProperty, address: newAddress });
      };
      const handlePrincipalAddressChange = (newAddress) => {
        setEditedProperty({  ...editedProperty, principalAddress: newAddress });
      };
       const getProperties = async () => {
        const response = await axios.get(`${url}api/property/contact/get/${id}`, { headers });

      console.log(id)// Replace with the specific id you want to filter by
       // const filtered = response.data.find(x => x.id == id)
const filtered =response.data[0]
      
    //     console.log(filtered);
    //   console.log(filtered)
      setEditedProperty(response.data[0])
      setImages(JSON.parse(filtered?.images))
setMainImage(filtered?.mainImage)

if(filtered.openHouseDate){
  setDate(filtered.openHouseDate)
}
if(filtered.openTime){
  setOpenTime(filtered.openTime)
}
if(filtered.closeTime){
  setCloseTime(filtered.closeTime)
}

      if(filtered?.propertyType){
      setSelectedRealtor({
        value: filtered.propertyType,
        label: filtered.propertyType,
      })
    }
      if(filtered?.status){
        var a=statusOptions[filtered.status-1]
        console.log(a)
        setSelectedStatus({
          value:a.id,
          label:a.name
        })
      }  
    };
    const handleEditClick = (field) => {
      setEditingField(field);
    };

    const editAll=()=>{
        setEditingField('all');
    }
  
    const handleSaveClick = () => {
     onSave(editedProperty);
      

    };
    const scrollToTop = () => {
      if (scrollToRef.current) {
        scrollToRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
  
    const handleCancelClick = () => {
  
      setEditingField(null);

    };
    useEffect(() => {
      // Fetch Realtor and Lawyer options and populate the select inputs
      const lawyers = users.filter((user) => user.roleId === 3);
      const realtors = users.filter((user) => user.roleId === 4 && user.isActivate);

  
      // Map the users into an array of options with 'label' and 'value' properties
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
  
      const lawyerOptions = lawyers.map((lawyer) => ({
        value: lawyer.id,
        label: lawyer.name,
      }));
  
      setRealtorOptions( [ ...realtorOptions]);
      setLawyerOptions(lawyerOptions);
    }, [users]);
  
    const formatDate = (dateString) => {
      if (!dateString) {
        return ""; // Handle cases where the date string is empty or undefined
      }
    
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
    
      return `${year}-${month}-${day}`;
    };


          
    const goBack = () => {
      navigate(-1); // This function takes you back one step in the navigation stack
    };
    const handleChange = (e) => {
      const { name, value } = e.target;
      if(name=='realtorId'){
        // setEditedProperty({ ...editedProperty,  });
      }
      setEditedProperty({ ...editedProperty, [name]: value });
    };
    console.log(editedProperty?.subjectRemovalDate)
  
    return (
      <div className="form-user-add" ref={scrollToRef}>
               
      <div >
        <div className="property_header">

            <h3> <button  type="button" className="back-only-btn" onClick={goBack}> <img src="/back.svg" /></button>{parent}- Property</h3>

            <div className="top-bar-action-btns">
      
            <button   style={{background:"#004686"}}  onClick={handleSaveClick}>Save</button>
            </div>

        </div>

 
      </div>
      <div className="form-user-edit-inner-wrap form-user-add-wrapper">
  
      
        <div className="form-user-add-inner-wrap">
          <label>MLS No</label>
          {editingField === "mls_no" || editingField === "all" ? (
          <div className="edit-new-input">

              <input
                name="mls_no"
                value={editedProperty?.mls_no}
                onChange={handleChange}
                placeholder="MLS No"
              />
           
              
            </div>
          ) : (
          <div className="edit-new-input">

              {editedProperty?.mls_no}
               <FontAwesomeIcon icon={faPencil}  onClick={() => handleEditClick("mls_no")} />
            </div>
          )}
        </div>
        <Places value={editedProperty?.address} onChange={handleAddressChange} newClass="main-add" /> 
  
  <PlacesNew key="principalAddress" value={editedProperty?.principalAddress} newClass="pric-add" onChange={handlePrincipalAddressChange} newField="Principal Address"/> 
        <div className="form-user-add-inner-wrap">
          <label>Property Type</label>
          {editingField === "propertyType" || editingField === "all" ? (
          <Select
          placeholder="Select Type.."
          value={selectedRealtor}
          onChange={(selectedOption) => 
              {
                  setEditedProperty({ ...editedProperty, propertyType: selectedOption.value })
                  setSelectedRealtor(selectedOption)}}
          options={realtorOptions}
          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
          styles={colourStyles}
          className="select-new"
          
        />
          ) : (
          <div className="edit-new-input">

              {editedProperty?.propertyType}
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("propertyType")} />
            </div>
          )}
        </div>
  
        <div className="form-user-add-inner-wrap">
          <label>Price</label>
          {editingField === "price" || editingField === "all" ?  (
          <div className="edit-new-input">

              <input
                name="price"
                type="number"
                min={0}
                value={editedProperty?.price}
                onChange={handleChange}
                placeholder="Price"
              />
           
              
            </div>
          ) : (
          <div className="edit-new-input">

              {editedProperty?.price}
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("price")} />
            </div>
          )}
        </div>
  
        <div className="form-user-add-inner-wrap">
          <label>Square Feet</label>
          {editingField === "squareFeet" || editingField === "all" ?  (
          <div className="edit-new-input">

              <input
                name="squareFeet"
                defaultValue={editedProperty?.squareFeet}
                onChange={handleChange}
                placeholder="Square Feet"
              />
           
              
            </div>
          ) : (
          <div className="edit-new-input">

              {editedProperty?.squareFeet}
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("squareFeet")} />
            </div>
          )}
        </div>
    
  
        <div className="form-user-add-inner-wrap">
          <label>Contract Date</label>
          {editingField === "contractDate" || editingField === "all" ? (
          <div className="edit-new-input">

              <input
                name="contractDate"
                type="date"
                defaultValue={formatDate(editedProperty?.contractDate)}
                onChange={handleChange}
              />
           
              
            </div>
          ) : (
          <div className="edit-new-input">

              {formatDate(editedProperty?.contractDate)}
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("contractDate")} />
            </div>
          )}
        </div>
  
        <div className="form-user-add-inner-wrap">
          <label>Subject Removal Date</label>
          {editingField === "subjectRemovalDate" || editingField === "all" ? (
          <div className="edit-new-input">

              <input
                name="subjectRemovalDate"
                type="date"
                defaultValue={formatDate(editedProperty?.subjectRemovalDate)}
                onChange={handleChange}
              />
           
              
            </div>
          ) : (
          <div className="edit-new-input">

              {formatDate(editedProperty?.subjectRemovalDate)}
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("subjectRemovalDate")} />
            </div>
          )}
        </div>
  
        <div className="form-user-add-inner-wrap">
          <label>Completion Date</label>
          {editingField === "completionDate" || editingField === "all" ? (
          <div className="edit-new-input">

              <input
                name="completionDate"
                type="date"
                defaultValue={formatDate(editedProperty?.completionDate)}
                onChange={handleChange}
              />
           
              
            </div>
          ) : (
          <div className="edit-new-input">

              {formatDate(editedProperty?.completionDate)}
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("completionDate")} />
            </div>
          )}
        </div>
  
        <div className="form-user-add-inner-wrap">
          <label>Possession Date</label>
          {editingField === "possesionDate" || editingField === "all" ? (
          <div className="edit-new-input">

              <input
                name="possesionDate"
                type="date"
           
                defaultValue={formatDate(editedProperty?.possesionDate)}
                onChange={handleChange}
              />
           
              
            </div>
          ) : (
          <div className="edit-new-input">

              {formatDate(editedProperty?.possesionDate)}
              <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("possesionDate")} />
            </div>
          )}
        </div>
        <div className="form-user-add-inner-wrap">
    <label>Bathrooms</label>
   
    <div className="edit-new-input">

        <input
          name="bathrooms"
          value={editedProperty?.bathrooms}
          onChange={handleChange}
          type="number"
          min={0}
        />
        </div>
        </div>
        <div className="form-user-add-inner-wrap">
    <label>Bedrooms</label>
   
    <div className="edit-new-input">

        <input
          name="bedrooms"
          value={editedProperty?.bedrooms}
          onChange={handleChange}
          type="number"
          min={0}
        />
        </div>
        </div>
{/*   
        <div className="form-user-add-inner-wrap">
          <label>Owners</label>
          {editingField === "realtorId" || editingField === "all" ? (
          
                  <Select
            placeholder="Select Owner..."
            value={selectedRealtor}
            onChange={(selectedOption) => 
                {
                    setEditedProperty({ ...editedProperty, realtorId: selectedOption.value })
                    setSelectedRealtor(selectedOption)}}
            options={realtorOptions}
            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
            styles={colourStyles}
            className="select-new"
            
          />
           
         
            
           
              
         
          ) : (
          <div className="edit-new-input">

              {editedProperty?.realtor?.name}
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("realtorId")} />
            </div>
          )}
        </div> */}

<div className="form-user-add-inner-wrap">
          <label>Lawyer</label>
          {editingField === "lawyerId" || editingField === "all" ? (
         <div className="edit-new-input">
        <input
        type="text"
        name="lawyerName"
        defaultValue={property.lawyerName}
        onChange={(e) => setEditedProperty({ ...editedProperty, lawyerName: e.target.value })}
       
       
      />
      </div>
      
      ) : (
        <div className="edit-new-input">

            {selectedLawyer?.label}
             <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("lawyerId")} />
          </div>
        )}
      </div>
      <EditableField
  fieldName="Style"
  Name="style"
  value={property.style}
  editingField={editingField}
  onEditClick={handleEditClick}
  onChange={handleChange}
/>

<EditableField
  fieldName="Storeys in Building"
  Name='storeysInBuilding'
  value={property.storeysInBuilding}
  editingField={editingField}
  onEditClick={handleEditClick}
  onChange={handleChange}
/>

<EditableField
  fieldName="Parking"
  Name="parking"
  value={property.parking}
  editingField={editingField}
  onEditClick={handleEditClick}
  onChange={handleChange}
/>

<EditableField
  fieldName="Parking Places"
  Name='parkingPlaces'
  value={property.parkingPlaces}
  editingField={editingField}
  onEditClick={handleEditClick}
  onChange={handleChange}
/>

<EditableField
       Name='interiorFeatures'
  fieldName="Interior Features"
  value={property.interiorFeatures}
  editingField={editingField}
  onEditClick={handleEditClick}
  onChange={handleChange}
/>

<EditableField
  fieldName="Amenities"
  Name='amenities'
  value={property.amenities}
  editingField={editingField}
  onEditClick={handleEditClick}
  onChange={handleChange}
/>

<EditableField
  fieldName="Heating"
  Name='heating'
  value={property.heating}
  editingField={editingField}
  onEditClick={handleEditClick}
  onChange={handleChange}
/>

<EditableField
  fieldName="Gross Tax"
  Name='grossTax'
  value={property.grossTax}
  editingField={editingField}
  onEditClick={handleEditClick}
  onChange={handleChange}
/>

<EditableField
  fieldName="Tax Year"
  Name='taxYear'
  value={property.taxYear}
  editingField={editingField}
  onEditClick={handleEditClick}
  onChange={handleChange}
/>

<EditableField
  fieldName="Maintenance Fee"
  Name='maintenanceFee'
  value={property.maintenanceFee}
  editingField={editingField}
  onEditClick={handleEditClick}
  onChange={handleChange}
/>

<EditableField
  fieldName="Lot Dimensions"
  Name='lotDimensions'
  value={property.lotDimensions}
  editingField={editingField}
  onEditClick={handleEditClick}
  onChange={handleChange}
/>

<EditableField
  fieldName="View"
  Name='view'
  value={property.view}
  editingField={editingField}
  onEditClick={handleEditClick}
  onChange={handleChange}
/>

<EditableField
  fieldName="Lot Features"
  Name='lotFeatures'
  value={property.lotFeatures}
  editingField={editingField}
  onEditClick={handleEditClick}
  onChange={handleChange}
/>











        <div className="form-user-add-inner-wrap">
          <label>Status</label>
          {editingField === "status" || editingField === "all" ? (
        <Select
            placeholder="Select Status..."
            value={selectedStatus}
            onChange={(selectedOption) =>
                {
                    setEditedProperty({ ...editedProperty, status: selectedOption.value })
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
          />)
          : (
            <div className="edit-new-input">
  
                {getStatus(editedProperty?.status?editedProperty.status:1)}
                 <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("status")} />
              </div>
            )}
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
  data={property.description} // Set the initial data from the API
  config={{
    toolbar: ["heading", "|", "bold", "italic", "link", "|", "bulletedList", "numberedList", "|", "undo", "redo"],
  }}
  className="custom-ckeditor" // Add a custom class for CKEditor container
  style={{ width: "100%", maxWidth: "800px", height: "200px" }}
  onChange={(event, editor) => {
    const data = editor.getData();
    setEditedProperty({ ...editedProperty, description: data });
  }}
/>

        
              
           
          
        </div>
        
        <div className="form-user-add-inner-wrap">
          <label>Notes</label>
          <CKEditor
  editor={ClassicEditor}
  data={property.notes} // Set the initial data from the API
  config={{
    toolbar: ["heading", "|", "bold", "italic", "link", "|", "bulletedList", "numberedList", "|", "undo", "redo"],
  }}
  className="custom-ckeditor" // Add a custom class for CKEditor container
  style={{ width: "100%", maxWidth: "800px", height: "200px" }}
  onChange={(event, editor) => {
    const data = editor.getData();
    setEditedProperty({ ...editedProperty, notes: data });
  }}
/>
        </div>
     </div>
      </div>
      <div className="form-user-add-inner-btm-btn-wrap">
      <button   style={{background:"#004686"}}  onClick={()=>{
        navigate("/todo-list/add")
      }}>Create Task</button>
   <button   style={{background:"#004686"}}  onClick={handleSaveClick}>Save</button>
   </div>
  
      </div>
    );
  };

  export default EditPropertyContactForm