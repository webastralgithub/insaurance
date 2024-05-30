import React, { useState, useEffect, useContext, useRef } from "react";
import Select, { components } from 'react-select';
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
import Spinner from "./Spinner";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'




const ShareMe = ({ role }) => {

  const { id } = useParams()
  const selectRef = useRef(null);
  const [contacts, setContacts] = useState([]);
  const [contactName, setContactName] = useState();
  const [KlientaleContacts, setKlintaleContacts] = useState([])
  const [active, setActive] = useState(0);
  const [parentid, setParentId] = useState()
  const navigate = useNavigate();
  const [parentView, setParentView] = useState(false);
  const [parentName, setParentName] = useState([]);
  const [contactOptions, setContactoptions] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedContacts, setSelectedContacts] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([])
  const [error, setError] = useState("")
  const [seletedCategory, setSelectedCategory] = useState(null);
  const [modalMode, setModalMode] = useState("");
  const [users, setUsers] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewState, setViewState] = useState("contacts")
  const [currentPage, setCurrentPage] = useState(1);
  const [width, setWidth] = useState(window.innerWidth);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoader, setDataLoader] = useState(false)





  const { auth, email } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };

  const url = process.env.REACT_APP_API_URL;
  const klintaleUrl = process.env.REACT_APP_KLINTALE_URL;

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


  const sendRefferal = async (contact) => {
    setDataLoader(true)
    try {
      setIsLoading(true);
      const response = await axios.post(`${url}api/contacts/share`,
        { sendTo: contact, selectedContacts: [id], type: 1 }, {
        headers,
      });
      if (response.status === 200) {
        toast.success(`${contact.firstname} Shared successfully`, {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsLoading(false)
        setSelectedContacts()
        closeModal()

      }
      setDataLoader(false)
    } catch (error) {
      setDataLoader(false)
      setIsLoading(false)
      toast.error('Please try after some time email server is busy')
    }

  }
  const convert = async (e) => {
    e.preventDefault()
    if (!seletedCategory?.value) {
      setError("Please select a Category")
      return
    }

    const response = await axios.put(`${url}api/contacts/update/${id}`, {
      isLead: true, category: seletedCategory
        .value
    }, {
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
    ;
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
          onClick: () => { },
        },
      ],
    });

  };

  const handleShareKlintaleClick = async (contact) => {
    setDataLoader(true)
    const { email, phone, name, category_name } = contact;
    const combinedObject = {
      name,
      email,
      phone,
      category_name,
      sendTo: contact.id, selectedContacts: [id],
    };

    try {
      const response = await axios.post(`${url}api/klientale-contact-share-me`, combinedObject, { headers }
      );

      if (response.status === 200) {
        toast.success(`${contact.name} Shared successfully`, {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      setDataLoader(false)
    } catch (error) {
      setDataLoader(false)
      toast.error("error on sharing klintale contact", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error("error on sharing klintale contact", error)
    }

  }


  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      overflow: "unset",
      padding: '0px',
      transform: "translate(-50%, -50%)",
      background: "rgb(255 255 255)",
    },
    overlay: {
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
    menu: (styles) => ({
      ...styles,
      maxHeight: "242px",
      minHeight: "242px",
      overflowY: "auto",
      boxShadow: "none",

    }),
    singleValue: styles => ({ ...styles, color: "#fff" }),
    placeholder: styles => ({ ...styles, color: "#fff" }),
    menuList: (styles) => ({
      ...styles,
      overflow: "unset"
    }),
    control: styles => ({
      ...styles, boxShadow: "unset", borderColor: "unset", minHeight: "0",
      border: "none", borderRadius: "0", background: "linear-gradient(240deg, rgba(0,72,137,1) 0%, rgba(0,7,44,1) 100%)",
      padding: "10px 5px"
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {

      return {
        ...styles,


      };
    },

  };
  const colourStyles = {
    valueContainer: styles => ({
      ...styles, overflowX: "auto", flex: "unset", flexWrap: "no-wrap", width: selectedContacts.length > 0 ? "354px" : "100%", padding: "2px 0",
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
    menu: (styles) => ({
      ...styles,
      maxHeight: "242px",
      minHeight: "242px",
      overflowY: "auto",
      boxShadow: "none",


    }),
    menuList: styles => ({ ...styles, overflowY: "none" }),
    multiValue: styles => ({ ...styles, minWidth: "unset" }),
    input: styles => ({ ...styles, color: "#fff" }),
    placeholder: styles => ({ ...styles, color: "#fff" }),
    control: styles => ({
      ...styles, boxShadow: "unset", borderColor: "unset", minHeight: "0",
      border: "none", borderRadius: "0", background: "linear-gradient(240deg, rgba(0,72,137,1) 0%, rgba(0,7,44,1) 100%)",
      padding: "10px 5px"
    }),


    option: (styles, { data, isDisabled, isFocused, isSelected }) => {

      return {
        ...styles,


      };
    },

  };
  const getCategories = async () => {
    try {
      const res = await axios.get(`${url}api/categories/get`, { headers });
      const options = res.data.map((realtor) => ({
        value: realtor.id,
        label: realtor.name,
      }));
      setCategories(options)

    } catch (error) {
      console.error("User creation failed:", error);
    }
  };



  const handleDelete = async (propertyId) => {
    await axios.delete(`${url}api/contacts/delete/${propertyId}`, { headers });

    toast.success('Contact deleted successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
    setContacts(contacts.filter((p) => p.id !== propertyId));

  };
  const fetchUsers = async () => {
    setDataLoader(true)
    try {
      const response = await axios.get(`${klintaleUrl}listing/${email.email}`);
      const data = response.data.user;
      setKlintaleContacts(data);
      setDataLoader(false)
    } catch (error) {
      setDataLoader(false)
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  useEffect(() => {
    getContacts();
    getCategories()
    getUsers();
  }, []);

  const getUsers = async () => {
    setDataLoader(true)
    try {
      const res = await axios.get(`${url}api/admin/get-users`, { headers });
      setUsers(res.data);
      setDataLoader(false)
    } catch (error) {
      setDataLoader(false)
    }
  };

  const getContacts = async () => {
    try {
      const response = await axios.get(`${url}api/contacts/get`, { headers });
      const contactsWithoutParentId = response.data.filter((contact) => contact.parentId === null);
      const nonvendorcontacts = contactsWithoutParentId.filter((contact) => contact.isVendor === false);
      const contactsWithoutParentIdandlead = nonvendorcontacts.filter((contact) => contact.isLead === false);
      // Set the filtered contacts in the state
      setContacts(contactsWithoutParentIdandlead);
      const contact = response.data.find((p) => p.id == id);
      setContactName(contact);

      const realtorOptions = contactsWithoutParentIdandlead.map((realtor) => ({
        value: realtor.id,
        label: realtor.firstname,
      }));
      setContactoptions(realtorOptions)

    } catch (error) {
      console.error(error)
      // localStorage.removeItem('token');
      // setAuth(null);
      // navigate('/');
    }

  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const formatPhoneNumber = (phoneNumber) => {
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };


  const [buttonActive, setButtonActive] = useState(1)
  let searchRef = useRef()
  const [userss, setusers] = useState([])
  const [totalPagess, setTotalPages] = useState("");

  const getTaskss = async () => {
    let currPage
    if (searchRef.current.value) {
      currPage = ''
    } else {
      currPage = currentPage
    }
    try {
      if (active == 0) {
        setDataLoader(true)
        const response = await axios.get(`${url}api/contacts-list?page=${currPage}&search=${searchRef.current.value}`, { headers });
        setusers(response?.data?.contacts)
        setTotalPages(response?.data?.totalPages)
        setDataLoader(false)
      }
      if (active == 1) {
        setDataLoader(true)
        const response = await axios.get(`${klintaleUrl}listing/${email.email}?page=${currPage}&search=${searchRef.current.value}`, { headers })
        setusers(response?.data?.user)
        setTotalPages(response?.data?.totalPages)
        setDataLoader(false)
      }

    } catch (error) {
      setDataLoader(false)
      console.error("Server is busy");
    }
  };
  useEffect(() => {
    getTaskss();
  }, [currentPage, active]);

  // console.log("userssss", userss)
  console.log("active", active)

  const handleKeyDownEnter = (event) => {
    if (event.key === 'Enter') {
      // setButtonActive(2)
      getTaskss()
    }
  };

  const clearSearch = () => {
    // setButtonActive(1)
    searchRef.current.value = ""
    getTaskss();
  };
  const handleKeyDown = () => {
    // setButtonActive(2)
    getTaskss();
  };

  const handlePageChangee = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPagess; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers.map((number) => (
      <button className={currentPage === number ? "active" : ""}
        key={number} onClick={() => handlePageChange(number)}>{number}</button>
    ));
  };


  return (
    <div>
      <div className="add_property_btn">
        <div className="inner-pages-top inner-pages-top-share-ref" style={{ "padding-bottom": "34px" }}>
          <h3> <button className="back-only-btn"
            onClick={() => {
              navigate("/contacts"); // Change the view state to "contacts"
            }}
          > <img src="/back.svg" /></button> {parentView ? `${parentName} Family ` : "Share Me"} ({contactName?.firstname})</h3>
          <span className="share-text" style={{ "font-size": "17px", "font-weight": "700", "display": "flex", "margin-top": "6px", "position": "absolute", "top": "200px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-share" viewBox="0 0 16 16">
              <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" />
            </svg>
            Share my info to your following contacts</span>
          <div className="search-group">



            <input type="text"
              ref={searchRef}
              onKeyDown={handleKeyDownEnter}
              // value={searchQuery}
              // onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search here" />
            {/* {buttonActive == 1 && <img src="/search.svg" onClick={handleKeyDown} />}
             {buttonActive == 2 && <FontAwesomeIcon icon={faXmark} onClick={clearSearch} />} </div> */}
            <div className="add_user_btn">
              <button className='custom-search-btn-btn-search' onClick={handleKeyDown}>Search</button>
            </div>

          </div>
        </div>

        <div className="inner-pages-top inner-pages-top-share-ref inner-pages-top-share-ref-tab">
          <div className="add_user_btn">
            <button className={!active ? 'active' : ''} onClick={() => { setCurrentPage(1); setActive(0) }}>
              Personal Contacts</button>

            <button className={active ? 'active' : ''} onClick={() => { setCurrentPage(1); setActive(1) }}>
              Klientale Contacts</button>
          </div>
        </div>

        {/* Rest of your component remains the same... */}

        <div className="table-container share-ref-table-in">

          {dataLoader ?
            (<div className="sekelton-class" style={{ backgroundColor: 'white' }} >
              <Skeleton height={50} count={10} style={{ margin: '5px 0' }} />
            </div>)

            : (
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email Id</th>
                    <th>Profession</th>
                  </tr>
                </thead>

                {active === 0 && <>
                  {userss.length > 0 &&
                    userss.map((contact) => (contact.id != id && <tbody>

                      <tr key={contact.id}>
                        {/* <td className="property-link" onClick={() => navigate("/contact/edit/"+contact.id)}>{contact.firstname}</td> */}
                        <td>  <button className="permissions share-ref-button-tb"
                          onClick={() => {
                            sendRefferal(contact)
                          }} >Share</button>       </td>
                        <td>{contact.firstname}</td>
                        <td>{contact.phone && formatPhoneNumber(contact.phone)}</td>
                        <td>{contact.email}</td>

                        {/* <td>{contact.servceRequire?.replace(/[\[\]"]/g, '')}</td>   */}

                        <td>{contact.category?.name}</td>


                        {/* <td> 
                   
                 <button className="permissions"
                   onClick={() => {changeView(Number(contact.id),contact.firstname)

                  }}> Family Members</button>
                    
         
         </td> */}
                      </tr>
                    </tbody>))}
                </>
                }

                {/* {  klintale contacts} */}
                {active === 1 && <>
                  {userss.length > 0 &&
                    userss?.map((contact) => (contact.id != id && <tbody>

                      <tr key={contact.id}>
                        {/* <td className="property-link" onClick={() => navigate("/contact/edit/"+contact.id)}>{contact.firstname}</td> */}
                        <td>  <button className="permissions share-ref-button-tb"
                          onClick={() => {
                            handleShareKlintaleClick(contact)
                          }} >Share</button>       </td>
                        <td>{contact?.name}</td>
                        <td>{contact?.phone && formatPhoneNumber(contact?.phone)}</td>
                        <td>{contact?.email}</td>
                        <td>{contact?.category_name}</td>
                      </tr>


                    </tbody>))
                  }
                </>
                }

              </table>)}

          {userss?.length > 0 && (
            <div className="pagination">
              {renderPageNumbers()}
            </div>
          )}
        </div>
      </div>
      {active === 1 && userss.length == 0 && !dataLoader && <p className="no-data">No Data Found</p>}
      {active === 0 && userss.length == 0 && !dataLoader && <p className="no-data">No Data Found</p>}
    </div>

  );
};

export default ShareMe;
