import React, { useState, useEffect, useContext } from "react";
import Select from 'react-select';
import "./admin.css"

import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Message, toaster } from "rsuite";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from "react-toastify";
import { useNavigate, useRouter } from "react-router-dom";


const Property = ({role}) => {
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
    setProperties(response.data);
 
    
      
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


  
  


  const handleDeleteClick = (propertyId) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this listing?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleDelete(propertyId),
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  const handleDelete = async (propertyId) => {
    await axios.delete(`${url}api/property/delete/${propertyId}`, { headers });

    toast.success('Listing deleted successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
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
      getStatus(property?.status)?.toLowerCase().includes(searchText) ||
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
   

      <div className="inner-pages-top">
      <h3>Exclusive Listings</h3>
      <div className="add_user_btn">

      <button onClick={() =>navigate("/listing/add")}>
        <img src="/plus.svg" />
        Add Listing</button>
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
  <th>Address</th>
    <th>MLS#</th>
    <th className="listing">Listing Status</th>
    <th>Property Type</th>
    <th className="price">Price</th>
    <th>Square Feet</th>
   
   

    <th>Contract Date</th>
   
    <th>Completion Date</th>
    <th></th>
    {role==1&&<th></th>}
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
        <td className="price">{`$${property.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}</td>
        <td>{property.squareFeet}</td>
       
  
        <td>{formatDate(property.contractDate)}</td> {/* Format date here */}
      {/* Format date here */}
        <td>{formatDate(property.completionDate)}</td> {/* Format date here */}
   
        
        <td><button className="permissions"
          onClick={()=>{

            navigate("/todo-list/add")
          }}       >Create Task</button>  </td>
          {role==1 &&<td><button className="permissions"
          onClick={()=>handleDeleteClick(property.id)}       >Delete</button></td>}
         {/* Format date here */}
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











// Import the Feather icon








export default Property;
