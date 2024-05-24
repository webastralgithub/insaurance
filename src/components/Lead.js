import React, { useState, useEffect, useContext, useRef } from "react";
import Select from 'react-select';
import "./admin.css"
import { Circles } from 'react-loader-spinner'
import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Message, toaster } from "rsuite";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import { useNavigate, useRouter } from "react-router-dom";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Lead = () => {
  const [contacts, setContacts] = useState([]);
  const [noCategoryContacts, setNoCategoryContacts] = useState([]);
  const [parentid, setParentId] = useState()
  const [todayContacs, setTodayContacts] = useState([]);
  const navigate = useNavigate();
  const [parentView, setParentView] = useState(false)
  const [parentName, setParentName] = useState([])

  const [id, setId] = useState(0)
  const [modalIsOpen, setIsOpen] = useState(false);
  const [categoriesoptions, setCategoriesOptions] = useState([])
  const [error, setError] = useState("")
  const [seletedCategory, setSelectedCategory] = useState(null);
  const [modalMode, setModalMode] = useState("");
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewState, setViewState] = useState("contacts")
  const [currentPage, setCurrentPage] = useState(1);
  const [width, setWidth] = useState(window.innerWidth);
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(10);
  const [buttonActive, setButtonActive] = useState(1)



  const { auth, contactlength, setConatctlength, leadlength, setLeadlength } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;
  const klintaleUrl = process.env.REACT_APP_KLINTALE_URL;

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId === activeCategory ? null : categoryId);
  };

  useEffect(() => {
    getCategories()
  }, []);


  const getCategories = async () => {
    try {
      const res = await axios.get(`${url}api/leads/categories`, { headers },);
      const options = res.data.map((realtor) => ({
        value: realtor.categoryId,
        label: realtor.categoryName,
      }));
      setCategoriesOptions(options);

      setCategories([{ id: -1, categoryName: "Today's Leads" }, ...res.data])
      setActiveCategory(-1);
    } catch (error) {
      console.error("User creation failed:", error);
    }
  };


  const handleDeleteClick = (propertyId) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this lead?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleDelete(propertyId),
        },
        {
          label: 'No',
          onClick: () => { },
        },
      ],
    });
  };

  const handleDelete = async (propertyId) => {
    await axios.delete(`${url}api/contacts/delete/${propertyId}`, { headers });

    toast.success('Lead deleted successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
    setContacts(contacts.filter((p) => p.id !== propertyId));
  };
  useEffect(() => {
    getContacts();
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await axios.get(`${url}api/admin/get-users`, { headers });
      setUsers(res.data);

    } catch (error) {
      console.error(error)
    }
  };


  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      overflow: "unset",
      transform: "translate(-50%, -50%)",
      background: "rgb(255 255 255)",
      border: "1px solid #fff",
    },
    overlay: {
      backgroundColor: "rgb(0 0 0 / 5%)",
    }
  };


  const openModal = (mode, role) => {
    setModalMode(mode);

    setIsOpen(true);
  };

  const closeModal = () => {
    setModalMode("");
    setError("")
    setIsOpen(false);
  };
  const colourStyles = {
    menu: (styles) => ({
      ...styles,
      maxHeight: "242px",
      minHeight: "242px",
      overflowY: "auto",
      boxShadow: "none",
    }),
    control: styles => ({
      ...styles, boxShadow: "unset", borderColor: "unset", minHeight: "0",
      border: "1px solid #000000bf"
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {

      return {
        ...styles,


      };
    },

  };



  const convert = async (e) => {
    e.preventDefault()
    if (!seletedCategory?.value) {
      setError("Please select a Category")
      return
    }

    const response = await axios.put(`${url}api/contacts/update/${id}`, { isLead: false, category: seletedCategory.value }, {
      headers,
    });
    getContacts();
    if (response.status === 200) {
      toast.success("Contact Converted successfully", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
      setConatctlength(contactlength + 1);
      setLeadlength(leadlength - 1);
      setSelectedCategory()
      closeModal()
    }
  }
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
      const response = await axios.get(`${url}api/contacts/get`, { headers });
      const contactsWithoutParentId = response.data.filter((contact) => contact.isLead === true);
      //   const contactsWithoutParentId = response.data.filter((contact) => contact.parentId === null);
      contactsWithoutParentId.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      })

      const nocat = contactsWithoutParentId.filter((contact) => !contact.category)

      setNoCategoryContacts(nocat)
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for comparison

      // Filter contacts created today
      const contactsCreatedToday = contactsWithoutParentId.filter(contact => {
        const contactDate = new Date(contact.updated_at);
        return contactDate.getTime() >= today.getTime();
      });
      setTodayContacts(contactsCreatedToday)
      // Set the filtered contacts in the state
      setContacts(contactsWithoutParentId);
    } catch (error) {
      console.error(error)
      // localStorage.removeItem('token');
      // setAuth(null);
      // navigate('/');
    }
  };

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for comparison

  const filteredContact = contacts.filter((contact) => {
    const searchText = searchQuery?.toLowerCase();
    return (
      contact?.firstname?.toLowerCase().includes(searchText) ||
      contact?.lastname?.toLowerCase()?.includes(searchText) ||
      contact?.email?.toLowerCase().includes(searchText) ||
      contact?.phone?.toLowerCase().includes(searchText)
    );
  });


  const filteredContacts = contacts.filter((contact) => {
    if (activeCategory == 0) {
      return !contact.category
    }
    if (activeCategory == -1) {
      const contactDate = new Date(contact.updated_at);
      return contactDate.getTime() >= today.getTime();
    }
    return (
      contact?.category?.id == activeCategory
    );
  });


  const contactsPerPage = 10;
  const contactsToDisplay = filteredContacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
  );

  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const changeView = async (id, name) => {
    localStorage.setItem("parent", name)
    setParentName(name)
    // setParentId(id)
    //   setParentView(true)
    navigate(`${id}`)
    try {
      const response = await axios.get(`${url}api/contacts/get-children/${id}`, { headers });
      const contactsWithoutParentId = response.data.filter((contact) => contact.parentId === null);
      // Set the filtered contacts in the state
      setContacts(response.data);
    } catch (error) {
      console.error("error", error)
      // localStorage.removeItem('token');
      // setAuth(null);
      // navigate('/');
    }
  }
  const formatPhoneNumber = (phoneNumber) => {
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  };

  const [dataLoader, setDataLoader] = useState(false)


  let searchRef = useRef()

  const [leadCountData, setLeadCountData] = useState([])
  const [activeLeadCategory, setactiveLeadCategory] = useState([])

  const getLeads = async () => {
    setDataLoader(true)
    let currPage
    if (searchRef.current.value) {
      currPage = ''
      setActiveCategory("")
    } else {
      currPage = currentPage
    }
    try {
      const response = await axios.get(`${url}api/leads?category=${activeCategory}&search=${searchRef.current.value}&page=${currentPage}&today=${""}`, { headers })
      const responseData = await response?.data;
      setLeadCountData(responseData?.leadsCountWithCategory)
      setactiveLeadCategory(responseData?.leads)
      setDataLoader(false)
    } catch (error) {
      setDataLoader(false)
      console.log("error")
    }
  }

  useEffect(() => {
    getLeads()
  }, [activeCategory])

  const clearSearch = () => {
    searchRef.current.value = ""
    setButtonActive(1)
    getLeads();
  };

  const handleKeyDownEnter = (event) => {
    if (event.key === 'Enter') {
      setButtonActive(2)
      getLeads()
    }
  };

  const handleKeyDown = () => {
    setButtonActive(2)
    getLeads();
  };

  const handleCategoryChange = (id) => {
    setActiveCategory(id === activeCategory ? 10 : id);
  }

  return (
    <div className="add_property_btn">
      <div className="inner-pages-top">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
        >
          {modalMode === "add" && (
            <div className="modal-roles-add convert-lead-pop-up-content pop-up-content-category">
              <form onSubmit={convert}>
                <h3 className="heading-category">Select Category</h3>

                <Select
                  placeholder="Select Category.."
                  value={seletedCategory}
                  onChange={(selectedOption) => {
                    setError("")
                    setSelectedCategory(selectedOption)
                  }}
                  options={categoriesoptions}
                  components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                  styles={colourStyles}
                  className="select-new"
                  menuIsOpen={true}

                />
                <div className="modal-convert-btns">
                  <button type="submit">Convert</button>
                  <button onClick={closeModal}>Cancel</button>
                </div>
              </form>
            </div>
          )}

        </Modal>
        <h3>  {parentView && <button className="back-only-btn"
          onClick={() => {
            if (parentView) {
              getContacts();
              setParentView(false);
              setViewState("contacts"); // Change the view state to "contacts"
            }
          }}
        > <img src="/back.svg" /></button>} {parentView ? `${parentName} Family ` : "Your leads/contacts"}</h3>
        <span className="share-text" style={{ "font-size": "17px", "font-weight": "700", "display": "flex", "margin-top": "6px", "position": "absolute", "top": "200px" }}>

          Your Leads are fully encrypted and cannot be seen or accessed by anybody else.</span>
        <div className="add_user_btn">
          <button onClick={() => navigate("/leads/add")}>
            <img src="/plus.svg" />
            Add Lead</button>
        </div>

        <div className="search-group">
          <input type="text"
            ref={searchRef}
            onKeyDown={handleKeyDownEnter}
            placeholder="Search here" />
          {buttonActive == 1 && <img src="/search.svg" onClick={handleKeyDown} />}
          {buttonActive == 2 && <FontAwesomeIcon icon={faXmark} onClick={clearSearch} />}
        </div>
      </div>

      {/* Rest of your component remains the same... */}
      <div className="add_property_btn">
        {dataLoader ?
          (<div className="sekelton-class" style={{ backgroundColor: 'white' }} >
            <Skeleton count={50} />
          </div>) : (<>
            {leadCountData && leadCountData.map((category, index) => (
              <div key={category.categoryId}>
                <div className="add_user_btn family_meber" onClick={() => handleCategoryChange(category.categoryId)} >
                  <h4>{category?.categoryName} (<>{category.totalLeads})</></h4>
                  <button style={{ padding: "12px 18px" }} >{activeCategory == category.categoryId ? "-" : "+"}</button>
                </div>
                {activeCategory == category?.categoryId && <div>
                  <div className="table-container">
                    <table style={{ marginBottom: contactsToDisplay.length > 0 ? "30px" : "0px" }}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Phone</th>
                          <th>Email</th>
                          <th>Source</th>
                          <th>Date</th>
                          <th>My Category</th>
                        </tr>
                      </thead>
                      {activeLeadCategory.length > 0 &&
                        activeLeadCategory.map((contact) => (<tbody>

                          <tr key={contact.id}>
                            <td className="property-link" onClick={() => navigate("/leads/edit/" + contact.id)}>{contact.firstname}{" "} {contact.lastname}</td>

                            <td>{contact.phone && formatPhoneNumber(contact.phone)}</td>
                            <td>{contact.email}</td>
                            <td>{contact.source}</td>
                            <td>{contact.created_at.slice(0, 10)}</td>
                            <td>{contact.category?.name}</td>
                            <td>  <button className="permissions"
                              onClick={() => {
                                setId(contact.id)
                                if (contact?.category) {
                                  setSelectedCategory({
                                    value: contact.category.id,
                                    label: contact.category.name,
                                  })
                                }
                                openModal("add")
                              }

                              }> Add to Contacts</button>       </td>
                            <td>
                              <button className="permissions"
                                onClick={() => {

                                  navigate("/todo-list/add")
                                }}       >Create Task</button>
                            </td>
                            {/* <td> <button className="permissions"
          onClick={()=>handleDeleteClick(contact.id)}       >Delete</button></td>  */}

                          </tr>

                        </tbody>))}
                    </table>
                  </div>
                  {activeCategory.length == 0 && !dataLoader && <p className="no-data">No data Found</p>}
                </div>}
              </div>))}</>)}</div>
    </div>
  );
};

export default Lead;
