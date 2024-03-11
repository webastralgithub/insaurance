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

const ChildContactChild = () => {
    const {id}=useParams()
    const parentNameNew=localStorage.getItem("parent")
  const [contacts, setContacts] = useState([]);
  const[parentid,setParentId]=useState()
  const navigate=useNavigate();
  const[parentView,setParentView]=useState(true)
  const[parentName,setParentName]=useState(parentNameNew)
  const [newContact, setNewContact] = useState({
    firstname: "",
    lastname: "",
    birthDate: "",
    address1: "",
    address2: "",
    city: "",
    provinceName: "",
    source: "",
    phone: "",
    parentId: null,
    //createdAt: "",
    //updatedAt: "",
    realtorId: null,
    propertyId: null,
   // children: [],
  });
  const [modalIsOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [modalMode, setModalMode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewState, setViewState] = useState("contacts")
  const [currentPage, setCurrentPage] = useState(1);
  const [width, setWidth] = useState(window.innerWidth);

  const [editingContact, setEditingContact] = useState(null);

  const { auth, property, setProperty, setAuth } = useContext(AuthContext);
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
    getContacts();
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/admin/get-users`, { headers });
      setUsers(res.data);

    } catch (error) {

    }
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

  const getContacts = async () => {
    try {
        const response = await axios.get(`${url}api/contacts/get-children/${id}`, { headers });
console.log(response.data)
  
        // Set the filtered contacts in the state

     
   

      // Set the filtered contacts in the state
      setContacts(response.data);
    

    } catch (error) {
      localStorage.removeItem('token');
      setAuth(null);
      navigate('/');
    }

  };
  const contactsPerPage = 10; // Adjust the number of contacts per page as needed

  const contactsToDisplay = contacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
  );
// Adjust the number of contacts per page as needed
  const totalPages = Math.ceil(contacts.length / contactsPerPage);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const changeView=async(id,name)=>{
console.log(name)

localStorage.setItem("parent",name)

  setParentName(name)
  // setParentId(id)
  //   setParentView(true)
   navigate(`${id}`)

  setParentId(id)
    setParentView(true)
   
    console.log(id)
    try {
        const response = await axios.get(`${url}api/contacts/get-children/${id}`, { headers });
        const contactsWithoutParentId = response.data.filter((contact) => contact.parentId === null);
  
        // Set the filtered contacts in the state
        setContacts(response.data);
      
  
      } catch (error) {
        // localStorage.removeItem('token');
        // setAuth(null);
        // navigate('/');
      }
  }
  // Rest of your component remains the same...

  return (
    <div className="add_property_btn">
        <div className="inner-pages-top">
      <h3>  {parentView&&<button className="back-only-btn" 
      onClick={()=>{
       const supernew= localStorage.getItem("superParent")
       localStorage.removeItem("superParent")
        localStorage.setItem("parent",supernew)

      navigate(-1)
      }}
      > <img src="/back.svg" /></button>} {`${parentName} `}</h3>
      <div className="add_user_btn">

     <button onClick={() =>navigate(`/contacts/add/${id}`)}>
        <img src="/plus.svg" />
   {`Family Member`}</button>
      </div>
      <div className="search-group">

       <input type="text"
       value={searchQuery}
       onChange={(e) => setSearchQuery(e.target.value)}
       placeholder="Search here"/>
       <img src="/search.svg" />
      </div>
      </div>

      {/* Rest of your component remains the same... */}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Birth Date</th>
              <th>Email Address</th>
              <th>Address</th>
              <th>City</th>
              <th>Province</th>
           <th>User</th>
              <th>Source</th>
              <th>Phone</th>
              <th></th>
              <th></th>
              <th>Task</th>
            </tr>
          </thead>
         
            {contacts.length >0 &&
              contactsToDisplay.map((contact) => (
                <tbody>
                <tr key={contact.id}>
                  <td className="property-link" onClick={() => navigate("/contact/edit/"+contact.id)}>{contact.firstname}</td>
                  <td>{contact.lastname}</td>
                  <td>{formatDate(contact.birthDate)}</td>
                  <td>{contact.email}</td>
                  <td>{contact.address1}, {contact.address2}</td>
                  <td>{contact.city}</td>
                  <td>{contact.provinceName}</td>
                  <td>{contact.realtor?.name}</td>
                  <td>{contact.source}</td>
                  <td>{contact.phone}</td>

                  <td> 
                    
                  <button className="permissions"
                    onClick={() => {changeView(Number(contact.id),contact.firstname)

                   }}>Family Members</button>
                     
          
          </td>
          <td>  <button className="permissions"
           onClick={()=>{
            localStorage.setItem("parent",contact.firstname)
            navigate(`/contacts/property/${contact.id}`)
          }} 
                 > Properties</button>       </td>
                 <td>
<button className="permissions"
          onClick={()=>{

            navigate("/todo-list/add")
          }}       >Create Task</button>
          </td>
                </tr>
                </tbody>
              ))}
     
        </table>
        {totalPages > 1 && (
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
)}

      </div>
      {contacts.length==0 && <p className="no-data">No data Found</p>}
    </div>
  );
};

export default  ChildContactChild;
