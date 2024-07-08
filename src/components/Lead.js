import React, { useState, useEffect, useContext, useRef } from "react";
import Select from 'react-select';
import "./admin.css"
import { Circles } from 'react-loader-spinner'
import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import { useNavigate } from "react-router-dom";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Lead = () => {
  const { auth, contactlength, setConatctlength, leadlength, setLeadlength } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  let searchRef = useRef()
  const [parentView, setParentView] = useState(false)
  const [parentName, setParentName] = useState([])
  const [id, setId] = useState(0)
  const [modalIsOpen, setIsOpen] = useState(false);
  const [categoriesoptions, setCategoriesOptions] = useState([])
  const [error, setError] = useState("")
  const [seletedCategory, setSelectedCategory] = useState(null);
  const [modalMode, setModalMode] = useState("");
  const [viewState, setViewState] = useState("contacts")
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("today");
  const [buttonActive, setButtonActive] = useState(1)
  const [dataLoader, setDataLoader] = useState(false)
  const [leadCountData, setLeadCountData] = useState([])
  const [activeLeadCategory, setactiveLeadCategory] = useState([])
  const [totalPagess, settotalPagess] = useState()

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


  const closeModal = () => {
    setModalMode("");
    setError("")
    setIsOpen(false);
  };

  const colourStyles = {
    valueContainer: (styles) => ({
      ...styles,
      overflowX: "auto",
      flex: "unset",
      flexWrap: "no-wrap",
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
    menuList: (styles) => ({ ...styles, overflowY: "none" }),
    multiValue: (styles) => ({ ...styles, minWidth: "unset" }),
    input: (styles) => ({ ...styles, color: "#fff" }),
    placeholder: (styles, state) => ({
      ...styles,
      color: '#fff',
      fontSize: "14px",
      fontWeight: '500'

    }),

    placeholder: (styles) => ({ color: "white" }),
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

  const convert = async (e) => {
    e.preventDefault()
    if (seletedCategory.length == 0) {
      setError("Please select a Category")
      return
    }

    const response = await axios.put(`${url}api/leads/${id}`, { isLead: false, isContact: true, category: seletedCategory.length && seletedCategory?.map((e) => e.value) }, {
      headers,
    });
    if (response.status === 200) {
      getLeads()
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

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for comparison

  const formatPhoneNumber = (phoneNumber) => {
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  };

  const getLeads = async () => {
     setDataLoader(true)
    let currPage
    let activeCat
    if (searchRef.current.value) {
      currPage = ''
      //activeCat = activeCategory
    } else {
      currPage = currentPage
      //activeCat = activeCategory
    }

    try {
      const response = await axios.get(`${url}api/leads?category=${activeCategory}&search=${searchRef.current.value}&page=${currPage}`, { headers })
      const responseData = await response?.data;
      setLeadCountData(responseData?.leadsCountWithCategory?.reverse())
      settotalPagess(responseData?.totalPages)
      setactiveLeadCategory(responseData?.leads)
       setDataLoader(false)
      setActiveCategory(activeCategory)
    } catch (error) {
      setDataLoader(false)
      console.error("error")
    }
  }

  useEffect(() => {
    getLeads()
  }, [activeCategory, currentPage, leadlength])

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
    //  searchRef.current.value = ""
    setActiveCategory(id === activeCategory ? "today" : id);
  }

  const handlePageChange = (newPage) => {
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


  const handleDeleteLead = async (editedContact, leadid, categories, categoryid) => {
    const valuesToFind = categories.split(',').map(Number);
    try {
      const response = await axios.delete(`${url}api/leads/${leadid}/${valuesToFind}`, { headers });

      if (response.status === 200) {
        if (response.data.deletedCat === true) {
          setLeadlength(leadlength - 1)
        }
        toast.success("Lead Deleted successfully", {
          autoClose: 1000,
          position: toast.POSITION.TOP_RIGHT,
        });
        getLeads()
      }

    } catch (error) {
      toast.error("Server is Busy")
      console.error(error)
    }
  }

  const handleDeleteClick = (editedContact, leadid, categories, categoryid) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this lead?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleDeleteLead(editedContact, leadid, categories, categoryid),
        },
        {
          label: 'No',
          onClick: () => { },
        },
      ],
    });
  };

  return (
    <div className="add_property_btn add_property_btn-leads-page">
      <div className="inner-pages-top">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          className={"leads-category-popup"}
        >
          {modalMode === "add" && (

            <div className="modal-roles-add convert-lead-pop-up-content pop-up-content-category custon-convert-select">
              <form onSubmit={convert}>
                <img
                  className="close-modal-share"
                  onClick={() => setIsOpen(false)}
                  src="/plus.svg"
                />
                <h3 className="heading-category">Select Category</h3>

                <Select
                  placeholder="Select Category.."
                  value={seletedCategory}
                  isMulti={true}
                  onChange={(selectedOption) => {
                    setError("")
                    setSelectedCategory(selectedOption)
                  }}
                  options={categoriesoptions}
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null
                  }}
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
              setParentView(false);
              setViewState("contacts"); // Change the view state to "contacts"
            }
          }}
        > <img src="/back.svg" /></button>} {parentView ? `${parentName} Family ` : "Leads"}</h3>
        <span className="share-text" style={{ "font-size": "17px", "font-weight": "700", "display": "flex", "margin-top": "6px", "position": "absolute", "top": "200px" }}>

          Your Leads and Contacts are fully encrypted and cannot be seen or accessed by anybody else.</span>
        <div className="add_user_btn">
          <button onClick={() => navigate("/leads/add")}>
            <img src="/plus.svg" />
            Add Lead</button>
        </div>

        <div className="search-grp-with-btn">
          <div className="search-group">
            <input type="text"
              ref={searchRef}
              onKeyDown={handleKeyDownEnter}
              placeholder="Search here" />
            {/* {buttonActive == 1 && <img src="/search.svg" onClick={handleKeyDown} />}
            {buttonActive == 2 && <FontAwesomeIcon icon={faXmark} onClick={clearSearch} />} */}

          </div>
          <div className="add_user_btn">
            <button onClick={handleKeyDown}>Search</button></div>
        </div>
      </div>

      {/* Rest of your component remains the same... */}
      <div className="add_property_btn">
        <>
            {leadCountData && leadCountData.map((category, index) => (
              <div key={category.categoryId}>
                <div className={`add_user_btn family_meber ${searchRef.current.value && category.leads_count > 0 ? "search-yellow-highlight" : ""}`} onClick={() => handleCategoryChange(category.id)} >
                  <h4>{category?.name} (<>{category?.leads_count})</></h4>
                  <button style={{ padding: "12px 18px" }}  >{activeCategory == category.id ? "-" : "+"}</button>
                </div>
                {activeCategory == category?.id && <div>
                  <div className="table-container">
                    <table style={{ marginBottom: "30px" }}>
                      <thead>

                        <tr>
                          <th>Name</th>
                          <th>Bussiness Name</th>
                          <th>Profession</th>
                          <th>Phone</th>
                          <th>Email</th>
                          <th>Date</th>
                        </tr>
                      </thead>

                      {dataLoader ?
                        <div className="sekelton-class" style={{ backgroundColor: 'white',
                          width: "76vw",
                          position: "absolute"
                       }} >
                          <Skeleton height={50} count={10} style={{ margin: '5px 0' }} />
                        </div> : <>
                          {activeLeadCategory?.length > 0 &&
                            activeLeadCategory?.map((contact) => (<tbody>

                              <tr key={contact.id}>
                                <td className="property-link" onClick={() => navigate(`/leads/edit/${contact.id}`, { state: { data: contact } })} >{contact.firstname}{" "} {contact.lastname}</td>
                                <td>{contact?.business_name}</td>
                                <td>{contact?.profession_name}</td>
                                <td>{contact?.phone && formatPhoneNumber(contact?.phone)}</td>
                                <td>{contact?.email}</td>
                                <td>{contact?.created_at.slice(0, 10)}</td>
                                <td>
                                  <button className="permissions"
                                    onClick={() => {
                                      navigate(`/todo-list/add/${contact?.id}`, { state: { data: contact } })
                                    }}>Create Task</button>
                                </td>
                                {category?.id != "today" ?
                                  <td>
                                    <img className="delete-btn-ico" src="/delete.svg"
                                      onClick={() => {
                                        handleDeleteClick(contact, contact.id, contact.category, category.id)
                                      }
                                      } alt="" ></img>
                                  </td>
                                  : ""}
                              </tr>
                            </tbody>))}
                        </>}


                    </table>

                    {activeLeadCategory?.length > 0 && (
                      <div className="pagination">
                        {renderPageNumbers()}
                      </div>
                    )}
                  </div>
                  {activeLeadCategory.length == 0 && !dataLoader && <p className="no-data">No data Found</p>}
                </div>}
              </div>))}</></div>
    </div>
  );
};

export default Lead;
