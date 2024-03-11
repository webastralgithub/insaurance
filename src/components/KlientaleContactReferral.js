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
import { useNavigate, useParams, useRouter } from "react-router-dom";






const KlientaleContactReferral = ({role}) => {
    const{id}=useParams()
  const selectRef = useRef(null);
  const [contacts, setContacts] = useState([]);
  const [active, setActive] = useState(0);
  const[parentid,setParentId]=useState()
  const navigate=useNavigate();
  const[parentView,setParentView]=useState(false)
  const[parentName,setParentName]=useState([])
  const [contactName, setContactName] = useState();
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



  const { auth, property, setProperty, setAuth,email } = useContext(AuthContext);
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

    console.log(selectRef.current.controlRef.firstChild)
 
      if (valueContainer) {
        valueContainer.scrollTo({ left: valueContainer.scrollWidth, behavior: 'smooth' });
      }
    }
  }, [selectedContacts]);
  const sendRefferal=async(contact)=>{
    const response =axios.post(`https://admin.klientale.com/api/share`,
     {sendTo:id,selectedContacts:[contact],type:2,email:email.email});
    if (response.status === 200) {
      toast.success("Contact Sent successfully", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
      setSelectedContacts()
      closeModal()
  
    }
  }
  const convert = async (e) => {
    e.preventDefault()
   if(!seletedCategory?.value){
    setError("Please select a Category")
    return
   }

    const response = await axios.put(`${url}api/contacts/update/${id}`, {isLead:true,category:seletedCategory
.value}, {
      headers,
    });
    getContacts();
    if (response.status === 200) {
      toast.success("Contact Converted successfully", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
      setSelectedCategory()
      closeModal()

    }
  }

    const handleDeleteClick = (propertyId) => {
    confirmAlert({
      title: 'Confirm Send',
      message: 'Are you sure you want to send this contact?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => sendRefferal(propertyId),
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
    menuList:styles=>({...styles,overflowY:"none",display:"none"}),
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
      console.log("User created successfully!",res);
    } catch (error) {
      console.error("User creation failed:", error);
    }
  };

  const handleDelete = async (propertyId) => {
    await axios.delete(`${url}api/contacts/delete/${propertyId}`, { headers });

    toast.success('Contact deleted successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
    setContacts(contacts.filter((p) => p.id !== propertyId));

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
      contact.lastname?.toLowerCase().includes(searchText) ||
      formatDate(contact.birthDate).toLowerCase().includes(searchText) ||
      contact.email?.toLowerCase().includes(searchText) ||
      (contact.address1 + ' ' + contact.address2).toLowerCase().includes(searchText) ||
      contact.city?.toLowerCase().includes(searchText) ||
      contact.provinceName?.toLowerCase().includes(searchText) ||
      (contact.realtor?.name.toLowerCase().includes(searchText)) ||
      contact.source?.toLowerCase().includes(searchText) ||
      contact.phone?.toLowerCase().includes(searchText)
    );
  });

  const getContacts = async () => {
    try {
      const response = await axios.get(`https://admin.klientale.com/api/listing`);
      const contactsWithoutParentId = response.data.filter((contact) => contact.parentId === null);
      const nonvendorcontacts = contactsWithoutParentId.filter((contact) => contact.isVendor === false);
      const contactsWithoutParentIdandlead = nonvendorcontacts.filter((contact) => contact.isLead === false );
      // Set the filtered contacts in the state
      setContacts(response.data);
      const contact = response.data.find((p) => p.id == id);
      setContactName(contact);
      const realtorOptions =contactsWithoutParentIdandlead.map((realtor) => ({
        value:realtor.id ,
        label: realtor.firstname,
      }));
      setContactoptions(realtorOptions)

    } catch (error) {
      console.log(error)
      // localStorage.removeItem('token');
      // setAuth(null);
      // navigate('/');
    }

  };
  const contactsPerPage = 10; // Adjust the number of contacts per page as needed

  const contactsToDisplay = filteredContacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
  );
// Adjust the number of contacts per page as needed
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const changeView=async(id,name)=>{

localStorage.setItem("parent",name)

  setParentName(name)
  // setParentId(id)
  //   setParentView(true)
   navigate(`${id}`)
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

  const PlaceholderWithIcon = (props) => (
    <div style={{ display: 'flex', alignItems: 'center',justifyContent:"space-between" }}>
     {/* Adjust icon and styling */}
      <span>{props.children}</span>  <img style={{width:"17px",filter:"brightness(4.5)"}} src="/search.svg" /> 
    </div>
  );
  const formatPhoneNumber = (phoneNumber) => {
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6,10)}`;
  };
  // Rest of your component remains the same...

  return (
    <div className="add_property_btn">
        <div className="inner-pages-top inner-pages-top-share-ref" style={{"padding-bottom":"30px"}}>
      <h3> <button className="back-only-btn" 
      onClick={()=>{
        navigate("/klientale-contacts"); // Change the view state to "contacts"
      }}
      > <img src="/back.svg" /></button> {parentView ?`${parentName} Family `:"Send Me Referrals "} ({contactName?.name})</h3>
     <span class="share-text" style={{"font-size": "17px","font-weight": "700","display": "flex" ,"margin-top":"6px","position":"absolute", "top":"200px"}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
            <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
          </svg>
          Send me referrals from your following contacts</span>
      <div className="search-group">

       <input type="text"
       value={searchQuery}
       onChange={(e) => setSearchQuery(e.target.value)}
       placeholder="Search here"/>
       <img src="/search.svg" />
      </div>
      </div>

      <div className="inner-pages-top inner-pages-top-share-ref inner-pages-top-share-ref-tab">

          <div className="add_user_btn">

          <button className={!active ? 'active' : ''} onClick={() =>setActive(0)}>
          Klientale Contacts</button>

          {/* <button className={active ? 'active' : ''} onClick={() =>setActive(1)}>
          Klientale Contacts</button> */}
          
          

          </div>
      </div>


      {/* Rest of your component remains the same... */}

      <div className="table-container share-ref-table-in">
        <table>
          <thead>
            <tr>
            <th></th>
              <th>Name</th>
              <th>Phone</th>
             <th>Email Id</th>
 
              {/* <th>Services Require</th> */}
    
            <th>Category</th>
            
              {/* <th></th>
              <th></th> */}
              
     
       

            </tr>
          </thead>
          {contacts.length>0 &&!active&&
              contactsToDisplay.map((contact) => (contact.id!=id&& <tbody>
          
                <tr key={contact.id}>
                  {/* <td className="property-link" onClick={() => navigate("/contact/edit/"+contact.id)}>{contact.firstname}</td> */}
                  <td>  <button className="permissions share-ref-button-tb"
          onClick={()=>{
            handleDeleteClick(contact.id)
          }}       >Send</button>       </td>
                  <td>{contact.name}</td>

                  <td>{contact.phone&&formatPhoneNumber(contact.phone)}</td>
                  <td>{contact.email}</td>
               
                  {/* <td>{contact.servceRequire?.replace(/[\[\]"]/g, '')}</td>   */}

            <td>{contact.category?.name}</td>
             

                  {/* <td> 
                    
                  <button className="permissions"
                    onClick={() => {changeView(Number(contact.id),contact.firstname)

                   }}> Family Members</button>
                     
          
          </td> */}
          


               
   
              </tr>
          </tbody> ))}
        </table>
        {totalPages > 1 && !active && (
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
      { contactsToDisplay.length==0 || active=="1" && <p className="no-data">No data Found</p>}
    </div>
  );
};

export default KlientaleContactReferral;
