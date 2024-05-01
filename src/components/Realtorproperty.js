import React, { useState, useEffect, useContext } from "react";
import Select from 'react-select';
import "./admin.css"

import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Message, toaster } from "rsuite";
import { toast } from "react-toastify";
import { useNavigate, useParams, useRouter } from "react-router-dom";


const RealtorProperty = () => {
    const{id}=useParams()
  const [properties, setProperties] = useState([]);
  const navigate=useNavigate()
  const [newProperty, setNewProperty] = useState({
    mls_no: "",
    propertyType: "",
    squareFeet: "",
    propertyId: "",
    realtorId:"",
    contractDate: "",
    subjectRemovalDate: "",
    completionDate: "",
    possesionDate: "",
  });
  const [modalIsOpen, setIsOpen] = useState(false);
  const [users,setUsers]=useState([])
  const [modalMode, setModalMode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [width, setWidth] = useState(window.innerWidth);


  const [editingProperty, setEditingProperty] = useState(null);

  const { auth,property,setProperty,setAuth } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  
  }, []);

  useEffect(() => {
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
  const getProperties = async () => {
    try {
    const response = await axios.get(`${url}api/property`, { headers });
    const filteredData = response.data.filter((item) => item.realtorId == id); 
    setProperties(filteredData);
 
    
      
     } catch (error) {
      localStorage.removeItem('token');
      setAuth(null);
      navigate('/');
     }
    
  };

  const openModal = (mode, property,id) => {
   
    setProperty(property);
    navigate("/listing/edit/"+id)


  };

  const closeModal = () => {
    setModalMode("");
    setEditingProperty(null);
    setIsOpen(false);
  };

  const styles = {
    overlay:{
      backgroundColor:"rgb(0 0 0 / 75%)",
    },
    content:width>400? {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      border:"none",
      backgroundColor: "#fff",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "64px",
      width: "60%",
      borderRadius:"24px",
    }:{
      
        position: "absolute",
        inset: "56% auto auto 50%",
        border:" none",
        background: "rgb(255, 255, 255)",
        overflow:" auto",
        borderRadius: "10px",
        outline: "none",
        padding: "34px",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "68%",
        height: "70vh",
    
    },
  };

  const mediaQuery = window.matchMedia("(max-width: 768px)");
  const mediaQueryMobile = window.matchMedia("(max-width: 480px)");

  const customStyles = {
    overlay: {
      ...styles.overlay,
    },
    content: {
      ...styles.content,
      padding: mediaQueryMobile.matches ? "34px 34px" : mediaQuery.matches?"64px 34px":"64px",
      width:mediaQuery.matches?"68%":"60%"

    },
  };
  const statusOptions = [
    { id: 1, name: "Active", color: "green" },
    { id: 2, name: "Foreclosures", color: "red" },
    { id: 3, name: "For Rent", color: "blue" },
    { id: 4, name: "For Sale", color: "#e09200" },
    { id: 5, name: "Lease", color: "orange" },
    { id: 6, name: "New Construction", color: "#9d5a04" },
    { id: 7, name: "New Listing", color: "pink" },
    { id: 8, name: "Open House", color: "teal" },
    { id: 9, name: "New Price", color: "indigo" },
    { id: 10, name: "Resale", color: "lime" },
    { id: 11, name: "Sold", color: "red" },
    { id: 12, name: "Land", color: "gray" },
    { id: 13, name: "Owner Occupied", color: "olive" },
  ];
  const getStatus=(id)=>{
   let option= statusOptions.find(x => x.id == id)
   return option.name
  }
   const getStatusColor=(id)=>{
    let option= statusOptions.find(x => x.id == id)
    return option.color
   }


  const addProperty = async (property) => {
    try {
      // Make an HTTP POST request to create the property
      const response = await axios.post(`${url}api/property/create`, property, {
        headers,
      });
  
      // Check if the response indicates success (you might want to validate this based on your API's response format)
      if (response.status === 200) {

        toast.success(' Listing added successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
        // Show a success message
       
  
        // Fetch the updated list of properties
        getProperties();
  
        // Close the modal (assuming closeModal is a function that does this)
        closeModal();
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


  const updateProperty = async (updatedProperty) => {
    const response = await axios.put(
      `${url}api/property/update/${updatedProperty.id}`,
      updatedProperty,
      { headers }
    );

    toast.success('Listing updated  successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
    getProperties()
  

  };

  const deleteProperty = async (propertyId) => {
    await axios.delete(`${url}api/property/delete/${propertyId}`, { headers });
    setProperties(properties.filter((p) => p.id !== propertyId));
  };
  // Function to format date strings to "YYYY-MM-DD" format
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
  const ITEMS_PER_PAGE = 10;
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const filteredProperties = properties.filter((property) => {
    const searchText = searchQuery.toLowerCase();
    return (
      property?.mls_no?.toLowerCase().includes(searchText) ||
      property?.propertyType?.toLowerCase().includes(searchText) ||
      property?.price?.toFixed(2).includes(searchText) ||
      property?.squareFeet?.toLowerCase().includes(searchText) ||
      property?.address?.toLowerCase().includes(searchText) ||
      (property?.lawyer && property?.lawyer?.name.toLowerCase().includes(searchText)) ||
      (property?.realtor && property?.realtor?.name.toLowerCase().includes(searchText)) ||
      formatDate(property?.contractDate).toLowerCase().includes(searchText) ||
      formatDate(property?.subjectRemovalDate).toLowerCase().includes(searchText) ||
      formatDate(property?.completionDate).toLowerCase().includes(searchText) ||
      formatDate(property?.possesionDate).toLowerCase().includes(searchText)
    );
  });
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const propertiesToDisplay = filteredProperties.slice(startIndex, endIndex);

  return (
    <div className="add_property_btn">
   
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
        {modalMode === "add" && <AddPropertyForm onAdd={addProperty} onCancel={closeModal} users={users}/>}
        {modalMode === "edit" && (
          <EditPropertyForm property={editingProperty} onSave={updateProperty} users={users} onCancel={closeModal} />
        )}
      </Modal>
      <div className="inner-pages-top">
      <h3>Realtor Property Listing</h3>
      <div className="add_user_btn">

      <button onClick={() =>navigate("/listing/add")}>
        <img src="/plus.svg" />
        Add Property</button>
      </div>
      <div className="search-group">

       <input type="text"
       value={searchQuery}
       onChange={(e) => setSearchQuery(e.target.value)}
       placeholder="Search here"/>
       <img src="/search.svg" />
      </div>
      </div>
      <div className="table-container">
        <table>
    {/* Inside the <thead> element */}
<thead>
  <tr>
    <th>MLS#</th>
    <th className="listing">Listing Status</th>
    <th>Property Type</th>
    <th className="price">Price</th>
    <th>Square Feet</th>
    <th>Address</th>
    <th>Lawyer Name</th>
    <th>Realtor Name</th>
    <th>Contract Date</th>
    <th>Subject Removal Date</th>
    <th>Completion Date</th>
    <th>Possession Date</th>
    {/* <th>Actions</th> */}
  </tr>
</thead>

         {/* Inside the <table> element */}
<tbody>
  {properties.length &&
    propertiesToDisplay.map((property) => (
      <tr key={property.id}>
        <td className="property-link" onClick={() => openModal("edit", property,property.id)}>{property.mls_no}</td>
        <td className="listing"><button className="status-btn" style={{background:getStatusColor(property.status)}}>{getStatus(property.status)}</button></td>
        <td>{property.propertyType}</td>
        <td className="price">$ {property.price.toFixed(2)}</td>
        <td>{property.squareFeet}</td>
        <td>{property.address}</td>
        <td>{property?.lawyer?.name}</td>
        <td>{property?.realtor?.name}</td>
        <td>{formatDate(property.contractDate)}</td> {/* Format date here */}
        <td>{formatDate(property.subjectRemovalDate)}</td> {/* Format date here */}
        <td>{formatDate(property.completionDate)}</td> {/* Format date here */}
        <td>{formatDate(property.possesionDate)}</td> {/* Format date here */}
        {/* <td>
          <button onClick={() => openModal("edit", property)}>Edit</button>
          <button onClick={() => deleteProperty(property.id)}>Delete</button>
        </td> */}
      </tr>
    ))}
</tbody>

        </table>
        <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
      </div>
    </div>
  );
};








const AddPropertyForm = ({ onAdd, onCancel,users }) => {
  const [property, setProperty] = useState({
    mls_no: "",
    propertyType: "",
    price: 0,
    // ...other fields
  });

  const [selectedRealtor, setSelectedRealtor] = useState(null);
  const [selectedLawyer, setSelectedLawyer] = useState(null);

  const [realtorOptions, setRealtorOptions] = useState([]);
  const [lawyerOptions, setLawyerOptions] = useState([]);

  // Add state variables for validation errors
  const [mlsNoError, setMlsNoError] = useState("");
  const [propertyTypeError, setPropertyTypeError] = useState("");
  const [priceError, setPriceError] = useState("");

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

  useEffect(() => {
    // Fetch Realtor and Lawyer options and populate the select inputs
    const lawyers = users.filter((user) => user.roleId === 3);
    const realtors = users.filter((user) => user.roleId === 4);

    // Map the users into an array of options with 'label' and 'value' properties
    const realtorOptions = realtors.map((realtor) => ({
      value: realtor.id,
      label: realtor.name,
    }));

    const lawyerOptions = lawyers.map((lawyer) => ({
      value: lawyer.id,
      label: lawyer.name,
    }));

    setRealtorOptions(realtorOptions);
    setLawyerOptions(lawyerOptions);
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

  // Validate the form fields and set validation errors
  const validateForm = () => {
    let isValid = true;

    if (!property.mls_no) {
      setMlsNoError("MLS No is required");
      isValid = false;
    }

    if (!property.propertyType) {
      setPropertyTypeError("Type is required");
      isValid = false;
    }

    if (!property.price) {
      setPriceError("Price is required");
      isValid = false;
    }

      if(!isValid){
    window.scrollTo(0,0)
  }
      return isValid;
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
        <div className="property_header"><h3>Add Property</h3></div>
        <div className="form-user-add-wrapper">
      
        <div className="form-user-add-inner-wrap">
          <label>MLS No<span className="required-star">*</span></label>
          <img src="/icons-form/$.svg"/>
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

        <div className="form-user-add-inner-wrap">
       
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
        </div>

        <div className="form-user-add-inner-wrap">
          <label>Price<span className="required-star">*</span></label>
          <img src="/icons-form/$.svg"/>
          <input
            type="text"
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
      <img src="/icons-form/$.svg"/>
      <input
        type="text"
        value={property.squareFeet}
        onChange={(e) => setProperty({ ...property, squareFeet: e.target.value })}
        placeholder="Square Feet"
        className="property-input"
      />
    </div>
    <div className="form-user-add-inner-wrap">
      <label>Address</label>
      <img src="/icons-form/$.svg"/>
      <input
        type="text"
        value={property.address}
        onChange={(e) => setProperty({ ...property, address: e.target.value })}
        placeholder="Address"
        className="property-input"
      />
    </div>

    <div className="form-user-add-inner-wrap">
      <label>Contract Date</label>

      <img src="/icons-form/$.svg"/>
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
      <img src="/icons-form/$.svg"/>
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
      <img src="/icons-form/$.svg"/>
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
      <img src="/icons-form/$.svg"/>
      <input
        type="date"
        value={property.possesionDate}
        onChange={(e) => setProperty({ ...property, possesionDate: e.target.value })}
        placeholder="Possession Date"
        className="property-input"
      />
      </div>
      <div className="form-user-add-inner-wrap">
        <label>Users</label>
        <img src="/icons-form/Group30055.svg"/>
        <Select
          placeholder="Select Owner..."
          value={selectedRealtor}
          onChange={(selectedOption) => setSelectedRealtor(selectedOption)}
          options={realtorOptions}
          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
          styles={colourStyles}
          className="select-new"
          
        />

      </div>
      <div className="form-user-add-inner-wrap">
        <label>Lawyers</label>
        <img src="/icons-form/Group30056.svg"/>
        <Select
          placeholder="Select Lawyer..."
          value={selectedLawyer}
          onChange={(selectedOption) => setSelectedLawyer(selectedOption)}
          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
          options={lawyerOptions}
          styles={colourStyles}
          className="select-new"
        />
      </div>
    </div>
    <div className="form-user-add-inner-btm-btn-wrap">
   
    <button onClick={onCancel} > <img src="/cross-new.svg"/>Cancel</button>
    <button type="submit" ><img src="/add-new.svg"/>Add Property</button>
    </div>
  </form>







 
  );
};



// Import the Feather icon

const EditPropertyForm = ({ property, onSave, onCancel, users }) => {
  const [editedProperty, setEditedProperty] = useState({ ...property });
  const [editingField, setEditingField] = useState(null);

  const lawyers = users.filter((user) => user.roleId === 3);
  const realtors = users.filter((user) => user.roleId === 4);

  const handleEditClick = (field) => {
    setEditingField(field);
  };

  const handleSaveClick = () => {
   onSave(editedProperty);
    setEditingField(null);
    onCancel()
  };

  const handleCancelClick = () => {

    setEditingField(null);
    onCancel()
  };


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
  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name=='realtorId'){
      // setEditedProperty({ ...editedProperty,  });
    }
    setEditedProperty({ ...editedProperty, [name]: value });
  };
  return (
    <>
    <div className="modal-header">
    <h3>Property:-{editedProperty.mls_no}</h3>
   <div className="close-button" onClick={onCancel}>
      <FontAwesomeIcon icon={faTimes} />
    </div>
    </div>
    <div className="form-user-edit-inner-wrap form-user-add-wrapper">

    
      <div className="form-user-add-inner-wrap">
        <label>MLS No</label>
        {editingField === "mls_no" ? (
          <div>
            <input
              name="mls_no"
              value={editedProperty.mls_no}
              onChange={handleChange}
              placeholder="MLS No"
            />
         
            
          </div>
        ) : (
          <div>
            {editedProperty.mls_no}
             <FontAwesomeIcon icon={faPencil}  onClick={() => handleEditClick("mls_no")} />
          </div>
        )}
      </div>

      <div className="form-user-add-inner-wrap">
        <label>Property Type</label>
        {editingField === "propertyType" ? (
          <div>
            <input
              name="propertyType"
              value={editedProperty.propertyType}
              onChange={handleChange}
              placeholder="Property Type"
            />
         
            
          </div>
        ) : (
          <div>
            {editedProperty.propertyType}
             <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("propertyType")} />
          </div>
        )}
      </div>

      <div className="form-user-add-inner-wrap">
        <label>Price</label>
        {editingField === "price" ? (
          <div>
            <input
              name="price"
              value={editedProperty.price}
              onChange={handleChange}
              placeholder="Price"
            />
         
            
          </div>
        ) : (
          <div>
            {editedProperty.price}
             <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("price")} />
          </div>
        )}
      </div>

      <div className="form-user-add-inner-wrap">
        <label>Square Feet</label>
        {editingField === "squareFeet" ? (
          <div>
            <input
              name="squareFeet"
              defaultValue={editedProperty.squareFeet}
              onChange={handleChange}
              placeholder="Square Feet"
            />
         
            
          </div>
        ) : (
          <div>
            {editedProperty.squareFeet}
             <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("squareFeet")} />
          </div>
        )}
      </div>

 

      <div className="form-user-add-inner-wrap">
        <label>Contract Date</label>
        {editingField === "contractDate" ? (
          <div>
            <input
              name="contractDate"
              type="date"
              defaultValue={formatDate(editedProperty.contractDate)}
              onChange={handleChange}
            />
         
            
          </div>
        ) : (
          <div>
            {formatDate(editedProperty.contractDate)}
             <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("contractDate")} />
          </div>
        )}
      </div>

      <div className="form-user-add-inner-wrap">
        <label>Subject Removal Date</label>
        {editingField === "subjectRemovalDate" ? (
          <div>
            <input
              name="subjectRemovalDate"
              type="date"
              defaultValue={formatDate(editedProperty.subjectRemovalDate)}
              onChange={handleChange}
            />
         
            
          </div>
        ) : (
          <div>
            {formatDate(editedProperty.subjectRemovalDate)}
             <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("subjectRemovalDate")} />
          </div>
        )}
      </div>

      <div className="form-user-add-inner-wrap">
        <label>Completion Date</label>
        {editingField === "completionDate" ? (
          <div>
            <input
              name="completionDate"
              type="date"
              defaultValue={formatDate(editedProperty.completionDate)}
              onChange={handleChange}
            />
         
            
          </div>
        ) : (
          <div>
            {formatDate(editedProperty.completionDate)}
             <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("completionDate")} />
          </div>
        )}
      </div>

      <div className="form-user-add-inner-wrap">
        <label>Possession Date</label>
        {editingField === "possesionDate" ? (
          <div>
            <input
              name="possesionDate"
              type="date"
              value={editedProperty.possesionDate}
              onChange={handleChange}
            />
         
            
          </div>
        ) : (
          <div>
            {formatDate(editedProperty.possesionDate)}
            <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("possesionDate")} />
          </div>
        )}
      </div>

      <div className="form-user-add-inner-wrap">
        <label>Users</label>
        {editingField === "realtorId" ? (
          <div>
            <select
              name="realtorId"
              value={editedProperty.realtorId}
              onChange={handleChange}
            >
       
              {realtors?.map((role) => (
                <option value={role.id} key={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
         
            
          </div>
        ) : (
          <div>
            {editedProperty?.realtor?.name}
             <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("realtorId")} />
          </div>
        )}
      </div>

      <div className="form-user-add-inner-wrap">
        <label>Lawyers</label>
        {editingField === "lawyerId" ? (
          <div>
            <select
              name="lawyerId"
              value={editedProperty.lawyerId}
              onChange={handleChange}
            >
              {lawyers?.map((role) => (
                <option value={role.id} key={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
         
            
          </div>
        ) : (
          <div>
            {editedProperty?.lawyer?.name}
             <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("lawyerId")} />
          </div>
        )}
      </div>
      <div className="form-user-add-inner-btm-btn-wrap">
      <button className="cancel-btn" onClick={handleCancelClick}>Cancel</button>
    <button  className="save-btn"  onClick={handleSaveClick}>Save</button>
    </div>
    </div>
    </>
  );
};







export default RealtorProperty;
