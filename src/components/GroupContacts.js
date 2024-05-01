import React, { useState, useEffect, useContext, useRef } from "react";
import Select,{ components } from 'react-select';
import "./admin.css"

import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Message, toaster } from "rsuite";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate, useRouter } from "react-router-dom";

const GroupContacts = ({groupContacts}) => {
  const selectRef = useRef(null);
  const [contacts, setContacts] = useState([]);

  const[parentid,setParentId]=useState()
  const navigate=useNavigate();
  const[parentView,setParentView]=useState(false)
  const[parentName,setParentName]=useState([])
const[id,setId]=useState(0)
const[contactOptions,setContactoptions]=useState(false)
const [searchText, setSearchText] = useState('');
  const[selectedContacts,setSelectedContacts]=useState(false)
  const [modalIsOpen, setIsOpen] = useState(false);
  const [categories,setCategories]=useState([])
  const[error,setError]=useState("")
  const [seletedCategory, setSelectedCategory] = useState(null);
  const [modalMode, setModalMode] = useState("");
  const [users, setUsers] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewState, setViewState] = useState("contacts")
  const [currentPage, setCurrentPage] = useState(1);
  const [width, setWidth] = useState(window.innerWidth);
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

  
  useEffect(() => {   // Scroll to the end of valueContainer when selectedContacts change
    if (selectRef.current) {
      const valueContainer = selectRef?.current?.controlRef.firstChild;
      if (valueContainer) {
        valueContainer.scrollTo({ left: valueContainer.scrollWidth, behavior: 'smooth' });
      }
    }
  }, [selectedContacts]);


    const handleDeleteClick = (propertyId) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this Post?',
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



 
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      overflow:"unset",
      padding: '0px',
      transform: "translate(-50%, -50%)",
      background: "rgb(255 255 255)",
    },
    overlay:{
      backgroundColor: "rgb(0 0 0 / 34%)",
    }
  };


  const openModal = (mode, role) => {
    setModalMode(mode);
 
    setIsOpen(true);
  };

  const closeModal = () => {
    setModalMode("");
    setError("")
    setSelectedCategory(null)
    setSelectedContacts([])
    setIsOpen(false);
  };
  const colourStylesCAt = {
    menu:(styles)=>({
      ...styles,
      maxHeight:"242px",
      minHeight:"242px",
      overflowY:"auto",
      boxShadow:"none",
      
    }),
    singleValue:styles=>({...styles,color:"#fff"    }),
    placeholder:styles=>({...styles,color:"#fff"    }),
    menuList:(styles)=>({
      ...styles,
overflow:"unset"
    }),
    control: styles => ({ ...styles, boxShadow:"unset",borderColor:"unset",minHeight:"0",
    border:"none",borderRadius:"0" ,background:"linear-gradient(240deg, rgba(0,72,137,1) 0%, rgba(0,7,44,1) 100%)",
  padding:"10px 5px"
  }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
     
      return {
        ...styles,
      
     
      };
    },
  
  }; 

  const colourStyles = {
    valueContainer:styles=>({...styles,overflowX:"auto",flex:"unset",flexWrap:"no-wrap",width:selectedContacts.length>0?"354px":"100%",padding:"2px 0",
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.3)',
      'border-radius': '10px',
      'background-color': 'rgb(0 70 134)',
    },
    '&::-webkit-scrollbar': {
      'height': '8px',
      'background-color': 'rgb(0 70 134)',
    },
    '&::-webkit-scrollbar-thumb': {
      'border-radius': '10px',
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,.3)',
      'background-color': '#373a47',
    },
  
  }),
    menu:(styles)=>({
      ...styles,
      maxHeight:"242px",
      minHeight:"242px",
      overflowY:"auto",
      boxShadow:"none",
 
  
    }),
    menuList:styles=>({...styles,overflowY:"none"}),
    multiValue:styles=>({...styles,minWidth:"unset"}),
    input: styles =>({...styles,color:"#fff"}),
    placeholder: styles =>({...styles,color:"#fff"}),
    control: styles => ({ ...styles, boxShadow:"unset",borderColor:"unset",minHeight:"0",
    border:"none",borderRadius:"0" ,background:"linear-gradient(240deg, rgba(0,72,137,1) 0%, rgba(0,7,44,1) 100%)",
  padding:"10px 5px"
  }),

   
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
     
      return {
        ...styles,
      
     
      };
    },
  
  }; 
  const getCategories = async () => {
    try {
     const res= await axios.get(`${process.env.REACT_APP_API_URL}api/categories/get`, { headers });
     const options=res.data.map((realtor) => ({
      value: realtor.id,
      label: realtor.name,
    }));
     setCategories(options)
  
    } catch (error) {
      console.error("User creation failed:", error);
    }
  };

  const handleDelete = async (postid) => {
    await axios.delete(`${url}api/post/delete/${postid}`, { headers });

    toast.success('Post deleted successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
    setContacts(contacts.filter((p) => p.id !== postid));

  };

  useEffect(() => {
    getContacts();
    getCategories()
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
  const filteredContacts = contacts.filter((contact) => {
    const searchText = searchQuery.toLowerCase();
    return (
      contact?.firstname?.toLowerCase().includes(searchText) ||
      contact.email?.toLowerCase().includes(searchText)
    );
  });

  const getContacts = async () => {
    try {
      const response = await axios.get(`${url}api/group-names`, { headers });
      // Set the filtered contacts in the state
     
      setContacts(response.data);
  
    } catch (error) {
      console.error(error)
      // localStorage.removeItem('token');
      // setAuth(null);
      // navigate('/');
    }

  };

  const contactsPerPage = 10; // Adjust the number of contacts per page as needed

  const contactsToDisplay = contacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
  );
// Adjust the number of contacts per page as needed
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

 
  // Rest of your component remains the same...

  return (
    <div className="add_property_btn" style={{"padding":"0"}}>
 
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          {groupContacts.length>0 &&
              groupContacts.map((contact) => ( <tbody>
          
                <tr key={contact.id}>                 
                  <td>{contact.firstname}</td>
       
              </tr>
          </tbody> ))}
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
    </div>
  );
};

export default GroupContacts;
