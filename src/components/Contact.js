import React, { useState, useEffect, useContext, useRef } from "react";
import Select, { components } from 'react-select';
import "./admin.css"
import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate } from "react-router-dom";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


const CustomDropdown = ({ children, searchText, ...props }) => {
  const selectedOptions = props.getValue();

  const handleOptionClick = (option) => {
    const isSelected = selectedOptions.some((selected) => selected.value === option.value);

    if (isSelected) {
      props.setValue(selectedOptions.filter((selected) => selected.value !== option.value));
    } else {
      props.setValue([...selectedOptions, option]);
    }
  };

  const isOptionSelected = (option) => {
    return selectedOptions.some((selected) => selected.value === option.value);
  };

  const filteredOptions = props.options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="custom-dropdown" style={{
      maxHeight: "250px",
      minHeight: "250px",
      overflowY: "auto",
      background: "#fff",
      boxShadow: "none"
    }}>
      {/* Show selected options with radio buttons */}
      {filteredOptions.map((option) => (
        <div onClick={() => handleOptionClick(option)} key={option.value} className={`custom-option ${isOptionSelected(option) ? "selected" : ""}`} style={{ backgroundColor: isOptionSelected(option) ? "rgb(202 146 51 / 10%)" : "" }}>
          <label htmlFor={option.value}>{option.label}</label>
          <div className="circle"></div>
          {/* <input
            type="radio"
            id={option.value}
            name={option.label}
            checked={isOptionSelected(option)}
            onChange={() => handleOptionClick(option)}
          /> */}

        </div>
      ))}

      {/* Show available options */}
      {React.cloneElement(children, { ...props })}
    </div>
  );
};


const Contact = ({ role }) => {
  const selectRef = useRef(null);
  const [contacts, setContacts] = useState([]);
  const fileRef = useRef(null);
  const [parentid, setParentId] = useState()
  const navigate = useNavigate();
  const [parentView, setParentView] = useState(false)
  const [parentName, setParentName] = useState([])
  const [selectedFile, setSelectedFile] = useState(null);
  const [id, setId] = useState(0)
  const [fileName, setFileName] = useState("");
  const [contactOptions, setContactoptions] = useState(false)
  const [searchText, setSearchText] = useState('');
  const [selectedContacts, setSelectedContacts] = useState(false)
  const [modalIsOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([])
  const [error, setError] = useState("")
  const [seletedCategory, setSelectedCategory] = useState(null);
  const [modalMode, setModalMode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewState, setViewState] = useState("contacts")
  const [currentPage, setCurrentPage] = useState(1);
  const [width, setWidth] = useState(window.innerWidth);

  const { auth, leadlength, setLeadlength, roleId } = useContext(AuthContext);

  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
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

  const sendRefferal = async () => {
    const response = await axios.post(`${url}api/contacts/share`,
      { sendTo: id, selectedContacts: selectedContacts.map(option => option.value) }, {
      headers,
    });
    if (response.status === 200) {
      toast.success("Referral Shared successfully", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
      setSelectedContacts()
      closeModal()

    }
  }

  const downloadExampleExcel = () => {
    const data = [
      ['Name', 'Email', 'Address', 'Phone'],];

    const csvContent = `Name,Email,Address,Phone`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'example.csv');
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    closeModal()
  }
  const ExampleFileDownloadCSV = () => {

    const csvContent = `Name,Email,Address,Phone`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'example.csv');
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    closeModal()
  };



  const [isAlreadyLead, setIsAlreadyLead] = useState()

  const handleSelectCategory = (category) => {
    const valuesToFind = category.split(',').map(Number);
    let seletctedOptions = categories?.filter((item => valuesToFind.includes(item.value)))
    setSelectedCategory(seletctedOptions)
  }

  const convert = async (e) => {
    e.preventDefault()
    if (!seletedCategory?.length) {
      setError("Please select a Category")
      return
    }
    try {

      //already lead and only change in category
      if (isAlreadyLead === true) {
        let newCatData = seletedCategory.length && seletedCategory?.map((e) => e.value)
        const response = await axios.put(`${url}api/leads/${id}`,
          { category: newCatData }, { headers });
        toast.success(" Lead Updated successfully", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
        setLeadlength(leadlength + 1)
      }


      // if contact than set is lead true 
      if (isAlreadyLead === false) {
        let newCatData = {
          category: seletedCategory.length && seletedCategory?.map((e) => e.value),
          isLead: true
        }

        const response = await axios.put(`${url}api/contacts/${id}`, newCatData, { headers })
        toast.success("Contact Converted To Lead successfully", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
        setLeadlength(leadlength + 1)
      }
      setSelectedCategory([])
      getContacts();
      
      closeModal()
    } catch (error) {

    }
  }


  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error(" Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}api/contacts/import`, formData, { headers });
      toast.success(' File upload successful', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });

      closeModal()
      getContacts()
    } catch (error) {
      toast.error(error.response.data.error, { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
      console.error('Error uploading file:', error);
    }
  };

  const handleDeleteClick = (propertyId) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this contact?',
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


  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "#000",
      border: "1px solid #fff",
      padding: "0"
    },
    overlay: {
      backgroundColor: "rgb(0 0 0 / 75%)",
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

  const getCategories = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/categories`, { headers });
      const options = res.data.map((realtor) => ({
        value: realtor.id,
        label: realtor.name,
      }));
      setCategories(options)

    } catch (error) {
      console.error("User creation failed:", error);
    }
  };

  const [dataLoader, setDataLoader] = useState(false)
  const [buttonActive, setButtonActive] = useState(1)
  let searchRef = useRef()
  const [userss, setusers] = useState([])
  const [totalPagess, setTotalPages] = useState("");



  const getTasks = async () => {
    setDataLoader(true)
    let currPage
    let seachData
    if (searchRef.current.value) {
      currPage = ''
    } else {
      currPage = currentPage
    }

    try {
      const response = await axios.get(`${url}api/contacts-list?page=${currPage}&search=${searchRef.current.value}`, { headers });
      setusers(response?.data?.contacts)
      setTotalPages(response?.data?.totalPages)
      setDataLoader(false)
    } catch (error) {
      setDataLoader(false)
      console.error("Server is busy");
    }
  };
  useEffect(() => {
    getTasks();
  }, [currentPage, leadlength]);

  const handleKeyDownEnter = (event) => {
    if (event.key === 'Enter') {
      setButtonActive(2)
      getTasks()
    }
  };

  const clearSearch = () => {
    setButtonActive(1)
    searchRef.current.value = ""
    getTasks();
  };
  const handleKeyDown = () => {
    setButtonActive(2)
    getTasks();
  };

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

  const handleDelete = async (propertyId) => {
    setDataLoader(true)
    try {
      await axios.delete(`${url}api/contacts/${propertyId}`, { headers });
      toast.success('Contact deleted successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
      setContacts(contacts.filter((p) => p.id !== propertyId));
      getTasks()
      setDataLoader(false)
    } catch (error) {
      setDataLoader(false)
      console.error(error)
    }
  };

  useEffect(() => {
    getCategories()
    if (roleId == 1) {
      getContacts();
    }
  }, []);


  const getContacts = async () => {
    try {
      const response = await axios.get(`${url}api/contacts`, { headers });
      const contactsWithoutParentId = response.data.filter((contact) => contact.parentId === null);
      const nonvendorcontacts = contactsWithoutParentId.filter((contact) => contact.isVendor === false);
      const contactsWithoutParentIdandlead = nonvendorcontacts.filter((contact) => contact.isLead === false);
      // Set the filtered contacts in the state
      setContacts(contactsWithoutParentId);

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






  const PlaceholderWithIcon = (props) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
      {/* Adjust icon and styling */}
      <span>{props.children}</span>  <img style={{ width: "17px", filter: "brightness(4.5)" }} src="/search.svg" />
    </div>
  );

  const formatPhoneNumber = (phoneNumber) => {
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };
  return (
    <div className="add_property_btn">
      <div className="inner-pages-top inner-pages-top-contacts inner-pages-top-contacts-duplicate">

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
        >
          {modalMode === "add" && (
            <div className="modal-roles-add convert-lead-pop-up-content pop-up-content-category">

              <img className="close-modal-share" onClick={closeModal} src="plus.svg" />
              <form onSubmit={convert}>
                <h3 className="heading-category">Select Category</h3>
                {error && <p className="error-category">{error}</p>}
                <Select
                  placeholder="Select Category.."
                  isMulti={true}
                  value={seletedCategory}
                  onChange={(selectedOption) => {
                    setError("")
                    setSelectedCategory(selectedOption)
                  }}
                  options={categories}
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null
                  }}
                  styles={colourStylesCAt}
                  className="select-new"
                  menuIsOpen={true}
                />
                <div className="modal-convert-btns">
                  <button type="submit">Convert</button>

                </div>
              </form>
            </div>
          )}
          {modalMode === "sample" && (
            <div className="modal-roles-add download-file">
              <button className="close-btn" onClick={closeModal}><img src="/plus.svg" /></button>
              <div>
                <input style={{ visibility: "hidden", padding: "0", height: "0" }}></input>
                <button onClick={downloadExampleExcel}>Example Excel</button>

                <button onClick={ExampleFileDownloadCSV}>Example Csv</button>
              </div>
            </div>
          )}
          {modalMode === "upload" && (
            <div className="modal-roles-add download-file bulk-upload-popup">
              <button className="close-btn" onClick={closeModal}><img src="/plus.svg" /></button>
              <div>
                <input style={{ display: "none" }} ref={fileRef} type="file" onChange={handleFileChange} />
                <div className="upload-text file-upload" onClick={() => fileRef.current.click()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="upload-icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p> {fileName}</p>
                  <span>Upload File</span>
                </div>
                <button style={{ width: "100%" }} onClick={handleUpload}>Upload Bulk Contacts</button>
              </div>

            </div>
          )}

          {/* {modalMode === "share" && (
            <div className="modal-roles-add convert-lead-pop-up-content pop-up-content-category" >
              <img className="close-modal-share" onClick={closeModal} src="plus.svg" />
              <form onSubmit={(e) => {
                e.preventDefault()
                sendRefferal()
              }}>
                <h3 className="heading-category">Select Contact(s) </h3>
                {error && <p className="error-category">{error}</p>}
                <Select
                  placeholder={<PlaceholderWithIcon>Select Contacts...</PlaceholderWithIcon>}
                  ref={selectRef}
                  value={selectedContacts}
                  menuIsOpen={true}
                  onChange={(selectedOptions) => {
                    setSelectedContacts(selectedOptions);

                    // You can also extract the values into an array if needed

                  }}
                  onInputChange={(input) => setSearchText(input)}
                  options={contactOptions}
                  components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null, Menu: (props) => <CustomDropdown searchText={searchText} {...props} /> }}
                  styles={colourStyles}
                  className="select-new"

                  isMulti // This is what enables multiple selections
                />
                <div className="modal-convert-btns">
                  <button type="submit">Share</button>

                </div>
              </form>
            </div>
          )} */}

        </Modal>

        <h3>  {parentView && <button className="back-only-btn"
          onClick={() => {
            if (parentView) {
              getContacts();
              setParentView(false);
              setViewState("contacts"); // Change the view state to "contacts"
            }
          }}
        > <img src="/back.svg" /></button>} {parentView ? `${parentName} Family ` : "Contacts"}</h3>
        <span className="share-text" style={{ "font-size": "17px", "font-weight": "700", "display": "flex", "margin-top": "6px", "position": "absolute", "top": "200px" }}>

          Your Contacts and Leads are fully encrypted and cannot be seen or accessed by anybody else.</span>
        <div className="add_user_btn">

          {parentView ? <button onClick={() => navigate(`/contacts/add/${parentid}`)}>
            <img src="/plus.svg" />
            {`${parentName} Family Member`}</button> :

            <button onClick={() => navigate("/contacts/add")}>
              <img src="/plus.svg" />
              Add Contact</button>
          }
        </div>

        <div className="search-grp-with-btn">
          <div className="search-group">

            <input type="text"
              ref={searchRef}
              onKeyDown={handleKeyDownEnter}
              // value={searchQuery}
              // onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search here" />
            {/* {buttonActive == 1 && <img src="/search.svg" onClick={handleKeyDown} />}
          {buttonActive == 2 && <FontAwesomeIcon icon={faXmark} onClick={clearSearch} />} </div> */}
          </div>
          <div className="add_user_btn">
            <button onClick={handleKeyDown}>Search</button>
          </div>
        </div>



        {roleId == 1 && <div className="add_user_btn" style={{ display: "flex" }}>
          <button style={{ marginLeft: "30px" }} onClick={(e) => {
            e.preventDefault()
            openModal("sample")

          }}>Sample files</button>
          <button style={{ marginLeft: "30px" }} onClick={(e) => {
            e.preventDefault()
            openModal("upload")

          }}>Upload Bulk</button>
          {/* <button onClick={downloadExampleExcel}>Example Excel</button>
      <button onClick={ExampleFileDownloadCSV}>Example Csv</button>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Bulk</button> */}
        </div>}
      </div>

      {/* Rest of your component remains the same... */}

      <div className="table-container">
        {dataLoader ?
          (<div className="sekelton-class" style={{ backgroundColor: 'white' }} >
            <Skeleton height={50} count={10} style={{ margin: '5px 0' }} />
          </div>)

          : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Business Name</th>
                  <th>Profession</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>

              {userss.length > 0 &&
                userss.map((contact) => (<tbody key={contact.id}>


                  <tr key={contact.id}>
                    <td className="property-link" onClick={() => navigate("/contact/edit/" + contact.id)}>{contact.firstname}</td>
                    <td>{contact?.company}</td>
                    <td>{contact?.profession?.name ? contact?.profession?.name : ""}</td>
                    <td>{contact?.phone && formatPhoneNumber(contact?.phone)}</td>
                    <td>{contact?.email}</td>

                    <td>
                      <button className="permissions share-ref-button-tb"
                        onClick={() => {
                          navigate(`/contacts/share/${contact.id}`)
                        }}       >Share Me</button>
                    </td>
                    <td>  <button className="permissions share-ref-button-tb"
                      onClick={() => {
                        navigate(`/contacts/send/${contact?.id}`)
                      }}       >Send me Referrals</button>       </td>
                    <td>

                      <button className={` ${contact?.isLead == true ? 'permissions share-ref-button-tb' : 'permissions'} `}
                        onClick={() => {
                          setId(contact.id)
                          setIsAlreadyLead(contact.isLead)
                          if (contact?.category) {
                            handleSelectCategory(contact.category)
                          }
                          openModal("add")
                        }}>Convert to Lead</button>
                    </td>
                    <td>
                      <button className="permissions"
                        onClick={() => {
                          localStorage.setItem("parent", contact.firstname)
                          localStorage.setItem("phone", contact.phone)

                          navigate(`/todo-list/add/${contact.id}`)
                        }}>Create Task</button>
                    </td>
                    <td>
                      <img className="delete-btn-ico" src="/delete.svg"
                        onClick={() => handleDeleteClick(contact.id)} alt="" ></img>
                    </td>
                  </tr>
                </tbody>))}
            </table>)}
        {userss?.length > 0 && (
          <div className="pagination">
            {renderPageNumbers()}
          </div>
        )}

      </div>
      {userss.length == 0 && !dataLoader && <p className="no-data">No data Found</p>}
    </div>
  );
};

export default Contact;