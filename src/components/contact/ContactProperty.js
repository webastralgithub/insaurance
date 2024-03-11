import React, { useState, useEffect, useContext } from "react";
import Select from 'react-select';
import "./../admin.css"

import Modal from "react-modal";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Message, toaster } from "rsuite";
import { toast } from "react-toastify";
import { useNavigate, useParams, useRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const ContactProperty = (props) => {
  const [properties, setProperties] = useState([]);
  const [showContent, setShowContent] = useState(false);
  const navigate=useNavigate()
  const {id}=useParams()
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
  const parent=localStorage.getItem("parent")
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
   // getUsers()
  }, []);
 

  const getUsers = async () => {
    try {
     const res= await axios.get(`${process.env.REACT_APP_API_URL}api/admin/get-users`, { headers });
     setUsers(res.data)
     
    } catch (error) {
     
    }
  };
  const getProperties = async () => {
    try {if(id){
    const response = await axios.get(`${url}api/property/contact/${id}`, { headers });
    setProperties(response.data);
    }
    
      
     } catch (error) {
      // localStorage.removeItem('token');
      // setAuth(null);
      // navigate('/');
     }
    
  };

  const openModal = (mode, property,id) => {
   
    setProperty(property);
    navigate("/contacts/property/edit/"+id)
    


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

        toast.success(' Property added successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
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
  const goBack = () => {
    navigate(-1); // This function takes you back one step in the navigation stack
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
    {showContent&&properties.length>0&&  <div className="table-container">
        <table>
    {/* Inside the <thead> element */}
<thead>
  <tr>
  <th>Address</th>
    <th>MLS#</th>
    <th className="listing">Status</th>
    <th>Property Type</th>
    <th className="price">Price</th>


    {/* <th>Actions</th> */}
  </tr>
</thead>

         {/* Inside the <table> element */}
<tbody>
  {properties.length &&
    propertiesToDisplay.map((property) => (
      <tr key={property.id}>
        <td className="property-link" onClick={() => openModal("edit", property,property.id)}>{property.address}</td>
        <td>{property.mls_no}</td>
        <td className="listing"><button className="status-btn" style={{background:getStatusColor(property.status)}}>{getStatus(property.status)}</button></td>
        <td>{property.propertyType}</td>
        <td className="price">$ {property.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>

      
 
        {/* <td>
          <button onClick={() => openModal("edit", property)}>Edit</button>
          <button onClick={() => deleteProperty(property.id)}>Delete</button>
        </td> */}
      </tr>
    ))}
</tbody>

        </table>
      
      </div>}
      {/* {properties.length==0 && <p className="no-data">No data Found</p>} */}
    </div>
  );
};
















export default ContactProperty;
