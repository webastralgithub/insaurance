import React, { useState, useEffect, useContext, useRef } from "react";
import "./admin.css";

import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Message, toaster } from "rsuite";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useNavigate, useParams, useRouter } from "react-router-dom";
import "./Modal.css"
const Referral = ({ role }) => {
  const { id } = useParams();
  const selectRef = useRef(null);
  const [contacts, setContacts] = useState([]);
  const [active, setActive] = useState(1);
  const [parentid, setParentId] = useState();
  const navigate = useNavigate();
  const [parentView, setParentView] = useState(false);
  const [parentName, setParentName] = useState([]);
  const [bussinessDetail,serBussinessDetail] =useState();
  const [contactOptions, setContactoptions] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedContacts, setSelectedContacts] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [seletedCategory, setSelectedCategory] = useState(null);
  const [modalMode, setModalMode] = useState("");
  const [users, setUsers] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewState, setViewState] = useState("contacts");
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
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);
  useEffect(() => {
    // Scroll to the end of valueContainer when selectedContacts change
    if (selectRef.current) {
      const valueContainer = selectRef?.current?.controlRef.firstChild;

      if (valueContainer) {
        valueContainer.scrollTo({
          left: valueContainer.scrollWidth,
          behavior: "smooth",
        });
      }
    }
  }, [selectedContacts]);


  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      overflow: "unset",
      padding: "0px",
      transform: "translate(-50%, -50%)",
      background: "rgb(255 255 255)",
    },
    overlay: {
      backgroundColor: "rgb(0 0 0 / 34%)",
    },
  };

  const openModal = async(id) => {
    setIsOpen(true);
    const response = await axios.get(`${url}api/contacts/get/${id}`, {
      headers,
    });
    serBussinessDetail(response.data)
  };

  const closeModal = () => {
    setModalMode("");
    setError("");
    setSelectedCategory(null);
    setSelectedContacts([]);
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
    singleValue: (styles) => ({ ...styles, color: "#fff" }),
    placeholder: (styles) => ({ ...styles, color: "#fff" }),
    menuList: (styles) => ({
      ...styles,
      overflow: "unset",
    }),
    control: (styles) => ({
      ...styles,
      boxShadow: "unset",
      borderColor: "unset",
      minHeight: "0",
      border: "none",
      borderRadius: "0",
      background:
        "linear-gradient(240deg, rgba(0,72,137,1) 0%, rgba(0,7,44,1) 100%)",
      padding: "10px 5px",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
      };
    },
  };
  const colourStyles = {
    valueContainer: (styles) => ({
      ...styles,
      overflowX: "auto",
      flex: "unset",
      flexWrap: "no-wrap",
      width: selectedContacts.length > 0 ? "354px" : "100%",
      padding: "2px 0",
      "&::-webkit-scrollbar-track": {
        "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.3)",
        "border-radius": "10px",
        "background-color": "rgb(0 70 134)",
      },
      "&::-webkit-scrollbar": {
        height: "8px",
        "background-color": "rgb(0 70 134)",
      },
      "&::-webkit-scrollbar-thumb": {
        "border-radius": "10px",
        "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,.3)",
        "background-color": "#373a47",
      },
    }),
    menu: (styles) => ({
      ...styles,
      maxHeight: "242px",
      minHeight: "242px",
      overflowY: "auto",
      boxShadow: "none",
    }),
    menuList: (styles) => ({ ...styles, overflowY: "none", display: "none" }),
    multiValue: (styles) => ({ ...styles, minWidth: "unset" }),
    input: (styles) => ({ ...styles, color: "#fff" }),
    placeholder: (styles) => ({ ...styles, color: "#fff" }),
    control: (styles) => ({
      ...styles,
      boxShadow: "unset",
      borderColor: "unset",
      minHeight: "0",
      border: "none",
      borderRadius: "0",
      background:
        "linear-gradient(240deg, rgba(0,72,137,1) 0%, rgba(0,7,44,1) 100%)",
      padding: "10px 5px",
    }),

    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
      };
    },
  };
  const getCategories = async () => {
    try {
      const res = await axios.get(
        `${url}api/categories/get`,
        { headers }
      );
      const options = res.data.map((realtor) => ({
        value: realtor.id,
        label: realtor.name,
      }));
      setCategories(options);
   
    } catch (error) {
      console.error("User creation failed:", error);
    }
  };

  const handleDelete = async (propertyId) => {
    await axios.delete(`${url}api/contacts/delete/${propertyId}`, { headers });

    toast.success("Contact deleted successfully", {
      autoClose: 3000,
      position: toast.POSITION.TOP_RIGHT,
    });
    setContacts(contacts.filter((p) => p.id !== propertyId));
  };

  useEffect(() => {
    getContacts();
    getCategories();
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}api/admin/get-users`,
        { headers }
      );
      setUsers(res.data);
    } catch (error) {}
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
  var filteredContacts=''
if(active != 3){
 filteredContacts = contacts.filter((contact) => {
    const searchText = searchQuery.toLowerCase();
    return (
      contact?.firstname?.toLowerCase().includes(searchText) ||
      contact.lastname?.toLowerCase().includes(searchText) ||
      formatDate(contact.birthDate).toLowerCase().includes(searchText) ||
      contact.email?.toLowerCase().includes(searchText) ||
      (contact.address1 + " " + contact.address2)
        .toLowerCase()
        .includes(searchText) ||
      contact.city?.toLowerCase().includes(searchText) ||
      contact.provinceName?.toLowerCase().includes(searchText) ||
      contact.realtor?.name.toLowerCase().includes(searchText) ||
      contact.source?.toLowerCase().includes(searchText) ||
      contact.phone?.toLowerCase().includes(searchText)
    );
  });
}
else{
  filteredContacts = contacts.filter((contact) => {
    const searchText = searchQuery.toLowerCase();
    return (
      contact?.ipAddress?.toLowerCase().includes(searchText) ||
      contact.time?.toLowerCase().includes(searchText)
     
    );
  });
}

  const getContacts = async (value = active) => {
    setActive(value);
    try {
      if (value == 3) {
        const response = await axios.get(`${url}api/admin/getips`, { headers });
        setContacts(response.data.userIps);
      } else {

        const response = await axios.get(
          `${url}api/get/contacts-share/${value}`,
          { headers }
        );
        setContacts(response.data);
      }
      // Set the filtered contacts in the state

    } catch (error) {
      console.error(error);
      // localStorage.removeItem('token');
      // setAuth(null);
      // navigate('/');
    }
  };
  const contactsPerPage = 20; // Adjust the number of contacts per page as needed

  const contactsToDisplay = filteredContacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
  );
  // Adjust the number of contacts per page as needed
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const changeView = async (id, name) => {
    localStorage.setItem("parent", name);
    const tabs = (value) => {};
    setParentName(name);
    // setParentId(id)
    //   setParentView(true)
    navigate(`${id}`);

    try {
      const response = await axios.get(
        `${url}api/contacts/get-children/${id}`,
        { headers }
      );
      const contactsWithoutParentId = response.data.filter(
        (contact) => contact.parentId === null
      );

      // Set the filtered contacts in the state
      setContacts(response.data);
    } catch (error) {
      // localStorage.removeItem('token');
      // setAuth(null);
      // navigate('/');
    }
  };


  return (
    <div className="add_property_btn">
     <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="custom-modal referal-model"
        overlayClassName="custom-overlay"
      >
        <div className="modal-header">
          <h2>{bussinessDetail?.firstname}</h2>
          <button onClick={closeModal}>&times;</button>
        </div>
        <div className="modal-content" style={{width:"unset"}}>
        <div className="user-info">
      <p>
        <strong>Name:</strong> {bussinessDetail?.firstname}
      </p>
      <p>
        <strong>Company Name:</strong> {bussinessDetail?.company}
      </p>
      <p>
        <strong>Email:</strong> {bussinessDetail?.email}
      </p>
      <p>
        <strong>Address:</strong> {bussinessDetail?.address1 ? bussinessDetail?.address1 + ' ' + bussinessDetail?.address2:""}
      </p>
      <p>
        <strong>Phone:</strong> {bussinessDetail?.phone ? bussinessDetail?.phone:""}
      </p>
    </div>
        </div>
        <div className="modal-footer">
          <button onClick={closeModal}>Close</button>
        </div>
      </Modal>
      <div className="inner-pages-top inner-pages-top-share-ref">
        <h3>
          {" "}
          <button
            className="back-only-btn"
            onClick={() => {
              navigate("/contacts"); // Change the view state to "contacts"
            }}
          >
            {" "}
          </button>{" "}
          {parentView ? `${parentName} Family ` : "Referrals"}
        </h3>

        <div className="search-group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search here"
          />
          <img src="/search.svg" />
        </div>
      </div>

      <div className="inner-pages-top inner-pages-top-share-ref inner-pages-top-share-ref-tab">
        <div className="add_user_btn"> 
        
          <button
            className={active == 1 ? "active" : ""}
            onClick={() => getContacts(1)}
          >
            Referrals Received
          </button>

          <button
            className={active == 2 ? "active" : ""}
            onClick={() => getContacts(2)}
          >
            Referrals Sent
          </button>
          {/* {role ==1  &&<button
            className={active == 3 ? "active" : ""}
            onClick={() => getContacts(3)}
          >
            Website Visitors
          </button>} */}
        </div>
      </div>

      {/* Rest of your component remains the same... */}

      <div className="table-container share-ref-table-in">
        <table>
          <thead>
            <tr>
              {active == 1 &&(
                <>
                 <th>Business Name</th>
                  <th>Sent By</th>
                  <th>Category</th>
                </>
              )

              }
              {active == 2 &&(
                <>
                 <th>Business Name</th>
                  <th>Sent to</th>
                  <th>Category</th>
                </>
              )
                }

              {/* {active == 3 &&(
                <>
                   <th>IP Address</th>
                  <th>Date</th>
                </>
              )
              } */}
            </tr>
          </thead>
          
          {contacts.length > 0 &&
            contacts.map((contact) => (
              <tbody>
                {active === 1 || active === 2 ? (
                  <>
                    <tr key={contact.id}>
                      <td
                        className="property-link"
                        onClick={() => openModal(contact?.send_contact?.id)}
                      >
                        {" "}
                        {contact?.send_contact?.firstname ||
                          contact?.referrer_contact?.firstname}
                      </td>
                      {/* <td>{contact?.send_contact?.phone&&formatPhoneNumber(contact?.send_contact?.phone)||contact?.referrer_contact?.phone&&formatPhoneNumber(contact?.referrer_contact?.phone)}</td>
                  <td>{contact?.send_contact?.email||contact?.referrer_contact?.email}</td>
                */}
                      {/* <td>{contact.servceRequire?.replace(/[\[\]"]/g, '')}</td>   */}
                      <td>
                        {" "}
                        {contact?.reciever_contact?.firstname ||
                          contact?.reciever_contact?.firstname}
                      </td>
                      <td>
                        {contact?.send_contact?.category?.name ||
                          contact?.referrer_contact?.category?.name}
                      </td>

                      {/* <td> 
                    
                  <button className="permissions"
                    onClick={() => {changeView(Number(contact.id),contact.firstname)

                   }}> Family Members</button>
                     
          
          </td> */}
                    </tr>
                  </>
                ) : (
                  <>
                   <tr key={contact?.id}>
                    <td>{contact?.ipAddress}</td>
                    <td>{formatDate(contact?.time)}</td>
                    </tr>
                  </>
                )}
              </tbody>
            ))}
        </table>
        {totalPages > 1 && !active && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      {contacts.length == 0 && <p className="no-data">No data Found</p>}
    </div>
  );
};

export default Referral;
