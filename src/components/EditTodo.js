import React, { useState, useEffect, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from 'react-select';
import { faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import InputMask from 'react-input-mask';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Places from "./Places";



const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const EditTodoForm = ({ user }) => {

  const [profession, setProfession] = useState([])
  const [seletedProfession, setSeletedProfession] = useState([])
  const { id } = useParams()
  const navigate = useNavigate()
  const { auth, setConatctlength, contactlength } = useContext(AuthContext)
  const url = process.env.REACT_APP_API_URL;
  const [newSelected, setNewSelected] = useState([])
  const [ssearch, setssearch] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchContacts, setSearchContacts] = useState([])
  const [contactError, setContactError] = useState("")
  const [isContact, setIsContact] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const containerRef = useRef(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const headers = {
    Authorization: auth.token,
  };
  const [editedTodo, setEditedTodo] = useState([]);
  const [defaultFollowupDate, setDefaultFollowupDate] = useState('');
  const [phoneError, setPhoneError] = useState("")
  const [editingField, setEditingField] = useState('all');
  const [mlsNoError, setMlsNoError] = useState("");
  const [propertyTypeError, setPropertyTypeError] = useState("");



  const clearErrors = (fieldName) => {
    switch (fieldName) {
      case "Followup":
        setMlsNoError("");
        break;
      case "FollowupDate":
        setPropertyTypeError("");
        break;
      default:
        break;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    clearErrors(name)
    if (name === "FollowupDate") {
      // Convert the date input value to ISO format before updating the state
      const isoDate = formatDate(value);

      setEditedTodo({ ...editedTodo, [name]: isoDate });
    } else {
      setEditedTodo({ ...editedTodo, [name]: value });
    }
  };

  const handleEditClick = (field) => {
    setEditingField(field);
  };

  const colourStyles = {
    valueContainer: (provided, state) => ({
      ...provided,
      paddingLeft: "0px",
      fontSize: "14px",
      fontWeight: '550',
      //color: '#000000e8',
    }),
    control: styles => ({ ...styles, border: 'unset', boxShadow: "unset", borderColor: "unset", minHeight: "0" }),
    input: styles => ({ ...styles, margin: "0px" }),
    option: (styles) => {

      return {
        ...styles,
        cursor: "pointer",
        backGround: "#fff",
        color: "#000",
        position: "relative",
        zIndex: "99",
        fontSize: "14px"
      };
    },
  };

  const getProfession = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/profession`, { headers });
      const options = res.data.map((realtor) => ({
        value: realtor.id,
        label: realtor.name,
      }));
      setProfession(options)

    } catch (error) {
      console.error("User creation failed:", error);
    }
  };

  useEffect(() => {
    getProfession()
    getTodos()
  }, [])

  const validateForm = () => {
    let isValid = true;

    if (!editedTodo.Followup) {
      if (editedTodo.Followup == undefined) {

      } else {
        setMlsNoError("Task Title is required");
        isValid = false;
      }
    }
    if (!isValid) {
      window.scrollTo(0, 0)
    }
    return isValid;
  };

  const handleSaveClick = async () => {
    const updatedContact = { ...editedTodo, ContactID: newSelected.id };
    if (!updatedContact.ContactID) {
      // handlescroll()
      setContactError("Select Contact")
      return
    }
    if (validateForm()) {
      const response = await axios.put(`${url}api/todo/${id}`,
        { ...updatedContact },
        { headers });
      navigate(-1)
      toast.success("Todo Updated successfully", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
      setEditingField(null);
    }
  };
  const goBack = () => {
    navigate(-1); // This function takes you back one step in the navigation stack
  };


  const formatDate = (dateTimeString) => {
    if (!dateTimeString) {
      return ""; // Handle cases where the date-time string is empty or undefined
    }

    const dateTime = new Date(dateTimeString);
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const day = String(dateTime.getDate()).padStart(2, "0");
    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");

    // Return date in "YYYY-MM-DDTHH:MM" format
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getTodos = async () => {
    try {
      const response = await axios.get(`${url}api/todo`, { headers });
      const filtered = await response?.data?.todo?.find(x => x.id == id)
      const followupDateISO = filtered?.FollowupDate
        ? new Date(filtered?.FollowupDate).toISOString().slice(0, 16)
        : '';
      setEditedTodo(filtered);
      setSearchQuery(filtered?.contact?.firstname)
      setNewSelected(filtered?.contact)
      setssearch(2)
      setDefaultFollowupDate(followupDateISO);
    } catch (error) {
      console.error(error)
    }
  }

  const [loading, setLoading] = useState(false)
  const getSearchContact = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${url}api/contacts-list?page=${currentPage}&search=${debouncedSearchQuery}`, { headers });
      setSearchContacts(response?.data?.contacts)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  useEffect(() => {
    if (ssearch === 1 && searchQuery) {
      getSearchContact()
    } else {
      setSearchContacts([])
    }

  }, [debouncedSearchQuery, currentPage])

  const handleSearchChange = (e) => {
    setLoading(true)
    setSearchQuery(e.target.value);
    setNewSelected([])
    setssearch(1)
    setButtonOn(0)
    setContactError("")

  }
  const handleSelect = (item) => {
    setSearchQuery(item.firstname)
    setButtonOn(2)
    setssearch(2)
    setNewSelected(item)
    setSearchContacts([])
    setContactError("")
  }

  useEffect(() => {
    if (searchQuery?.length == 0) {
      setLoading(false)
    }
  }, [searchQuery])


  // Add contact Data
  const [selectedServices, setSelectedServices] = useState([]);
  const [contactNew, setContactNew] = useState({
    firstname: "",
    business_name: '',
    email: "",
    profession_id: "",
    address1: "",
    phone: "",
    website: "",
    servceRequire: selectedServices,
    notes: "",
    source: "",
    createdBy: user,
    realtorId: null,
    propertyId: null,
    isContact: true
  });

  const [errors, setErrors] = useState({
    firstname: "",
    email: "",
    phone: "",
    category: "",
    profession: "",
    business_name: ""
  });


  const validateFormNewPhone = () => {
    let isValid = true;
    const { firstname, email, phone, business_name } = contactNew;

    const trimmedFirstName = firstname.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedBusinessname = business_name.trim();

    // Reset errors
    setErrors({
      firstname: "",
      email: "",
      phone: "",
      category: ""
    });

    // Validate firstname
    if (!trimmedFirstName) {
      setErrors(prevErrors => ({ ...prevErrors, firstname: "Name is required" }));
      isValid = false;
    }

    //validate business Name
    if (!trimmedBusinessname) {
      setErrors(prevErrors => ({ ...prevErrors, business_name: "Business Name is Required" }));
      isValid = false;
    }

    // Validate email
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrors(prevErrors => ({ ...prevErrors, email: "Invalid email" }));
      isValid = false;
    }

    // Validate phone number
    if (!trimmedPhone || !/^\d+$/.test(trimmedPhone) || phone.length != 10) {
      setErrors(prevErrors => ({ ...prevErrors, phone: "Invalid phone number" }));
      isValid = false;
    }
    if (!seletedProfession.value) {
      setErrors(prevErrors => ({ ...prevErrors, profession: "Please Select a profession" }));
      isValid = false;
    }

    if (!isValid) {
      window.scrollTo(0, 0);
    }

    return isValid;
  };

  const errorScroll = useRef(null)
  const handlescroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    errorScroll.current.focus();
    errorScroll.current.scrollTop = 0;
  }

  const handleSubmitNewPhone = async (e) => {
    e.preventDefault();
    const isValid = validateFormNewPhone();
    if (!isValid) {
      // handlescroll()
      return
    }
    try {
      const response = await axios.post(`${url}api/contacts`, contactNew, { headers, });
      if (response.status === 201) {
        let getContact = await axios.get(`${url}api/contacts/${response.data.id}`, { headers });
        setConatctlength(contactlength + 1);
        setNewSelected(getContact.data)
        setSearchQuery(getContact.data.firstname)
        setSearchContacts(getContact.data)
        setssearch(2)
        setIsContact(0)
        setSearchQuery("")
        setContactError("")
        toast.success('To-Do Updated succesfully ', { autoClose: 1000, position: toast.POSITION.TOP_RIGHT }); // Redirect to the contacts list page
      } else if (response.data.status === false) {
        toast.error(response.data.message)
      } else {
        toast.error("Failed to add contact");
      }
    } catch (error) {
      if (error.response.status === 409) {
        toast.error(error.response.data.message, {
          autoClose: 2000,
          position: toast.POSITION.TOP_RIGHT
        })
      } else {
        toast.error("server is busy")
        console.error("An error occurred while adding a contact:", error);
      }
    }
  }

  const handleAddressChange = (newAddress) => {
    setContactNew({ ...contactNew, address1: newAddress });
  };



  const handlePhoneNumberChange = (event) => {
    setPhoneError("")
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");
    setContactNew({ ...contactNew, phone: rawPhoneNumber.slice(1, 11) });
  }

  const handleChangeAddPhone = (e) => {
    setErrors({
      firstname: "",
      email: "",
      phone: "",
      category: "",
      business_name: ""
    })
    const { name, value } = e.target;
    setContactNew({ ...contactNew, [name]: value });
  };

  const serviceOptions = [
    { value: 'Real Estate', label: 'Real Estate' },
    { value: 'Mortgage', label: 'Mortgage' },
    { value: 'Insurance', label: 'Insurance' },
    { value: 'Immigration', label: 'Immigration' }
  ];
  const [buttonOn, setButtonOn] = useState(0)



  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    setMinDate(`${year}-${month}-${day}T${hours}:${minutes}`);
  }, []);

  return (

    <div className="form-user-add">

      <>
        <div >
          <div className="property_header">
            <h3> <button type="button" className="back-only-btn" onClick={goBack}> <img src="/back.svg" /></button>Edit Task</h3>
            {/* <div className="top-bar-action-btns">
            <button style={{ background: "#004686" }} onClick={handleSaveClick}>Save</button>
          </div> */}
          </div>
        </div>

        <div className="form-user-edit-inner-wrap form-user-add-wrapper">
          <div className="todo-section">
            <div className="todo-main-section">
              <div className="form-user-add-inner-wrap">
                <label    >Task Title<span className="required-star">*</span></label>
                {editingField === "Followup" || editingField === "all" ? (
                  <div className="edit-new-input">
                    <input
                      ref={errorScroll}
                      name="Followup"
                      value={editedTodo?.Followup}
                      onChange={handleChange}

                    />
                    <span className="error-message">{mlsNoError}</span>
                  </div>
                ) : (
                  <div className="edit-new-input">
                    {editedTodo?.Followup}
                    <FontAwesomeIcon
                      icon={faPencil}
                      onClick={() => handleEditClick("Followup")}
                    />
                  </div>
                )}
              </div>

              <div className="form-user-add-inner-wrap">
                <label>Follow Up Date<span className="required-star">*</span></label>
                <div className="edit-new-input">
                  <input
                    name="FollowupDate"
                    type="datetime-local"
                    min={minDate}
                    defaultValue={formatDate(defaultFollowupDate)}
                    onChange={handleChange}
                  />
                  <span className="error-message">{propertyTypeError}</span>
                </div>

              </div>

              <div className="form-user-add-inner-wrap">
                <label>Task description</label>
                {editingField === "description" || editingField === "all" ? (
                  <div className="edit-new-input">
                    <textarea
                      name="description"
                      value={editedTodo?.description}
                      onChange={handleChange}
                      placeholder="description"
                    />
                  </div>
                ) : (
                  <div className="edit-new-input">
                    {editedTodo?.description}
                    <FontAwesomeIcon
                      icon={faPencil}
                      onClick={() => handleEditClick("description")}
                    />
                  </div>
                )}
              </div>

              {/* dbouncing and select contact */}

              <div className="form-user-add-inner-wrap ">
                <label>Contact<span className="required-star">*</span> <span className="error-message">{contactError}</span></label>
                <input
                  //defaultValue={editedTodo?.contact?.firstname}
                  type="text"
                  placeholder="Search Contact"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />


                {!newSelected.id && searchContacts?.length == 0 && searchQuery?.length > 0 && loading === false && buttonOn == 0 &&
                  <div className='no-contact-found-div'>
                    <h1> No Contacts Found</h1>
                    <button className="add-new-contact-btn" onClick={() => { setIsContact(1); setButtonOn(1); setContactNew({ ...contactNew, firstname: searchQuery }) }}>Add New Contact</button>
                  </div>
                }

                {searchContacts.length ?
                  <div className="scroll-for-contacts-search clone-select-type" style={{ height: "auto", overflow: 'scroll', cursor: 'pointer' }} ref={containerRef}>

                    {searchContacts && searchContacts?.map((item) => (
                      <div key={item.id} >
                        <p onClick={() => handleSelect(item)}>{item.firstname}</p>
                      </div>
                    ))}
                  </div>
                  : ""}
              </div>

              {newSelected.id &&
                <>
                  <div className="form-user-add-inner-wrap disable">
                    <label>Phone Number</label>
                    <input
                      type="phone"
                      value={(newSelected?.phone ? newSelected?.phone : " ")}
                      readOnly
                    />
                  </div>
                  <div className="form-user-add-inner-wrap disable">
                    <label>Email</label>
                    <input
                      type="text"
                      value={(newSelected?.email ? newSelected?.email : " ")}
                      readOnly
                    />
                  </div>
                  <div className="form-user-add-inner-wrap disable">
                    <label>Business Name</label>
                    <input
                      type="text"
                      value={newSelected?.business_name}
                      readOnly
                    />
                  </div>
                  <div className="form-user-add-inner-wrap disable">
                    <label>Profession</label>
                    <input
                      type="text"

                      value={newSelected?.profession_id > 0 ? newSelected?.profession.name : ""}
                      readOnly
                    />
                  </div>
                  <div className="form-user-add-inner-wrap disable">
                    <label>Address</label>
                    <input
                      type="text"

                      value={newSelected?.address1 ? newSelected?.address1 : ""}
                      readOnly
                    />
                  </div>
                  <div className="form-user-add-inner-wrap disable">
                    <label>Website</label>
                    <input
                      type="text"
                      value={newSelected?.website ?? ""}
                      readOnly
                    />
                  </div>
                </>
              }
            </div>

            <div className="todo-notes-section">
              <div className="form-user-add-inner-wrap">
                <label>Notes</label>
                <CKEditor
                  editor={ClassicEditor}
                  data={editedTodo?.Comments || ''}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setEditedTodo({ ...editedTodo, Comments: data });
                  }}
                  config={{
                    toolbar: ["heading", "|", "bold", "italic", "link", "|", "bulletedList", "numberedList", "|", "undo", "redo"],
                  }}
                  className="custom-ckeditor" // Add a custom class for CKEditor container
                  style={{ width: "100%", maxWidth: "800px", height: "200px" }}
                />
              </div>
            </div>

          </div>
          <div className="form-user-add-inner-btm-btn-wrap">
            <button style={{ background: "#004686" }} onClick={handleSaveClick}>Save</button>
          </div>



        </div>
      </>

      {/* Add Contact Form */}
      {isContact === 1 &&
        <div className="parent-pop-up-add-contact" >

          <div className="form-user-add add-contact-popup-new-child" style={{marginTop: '50px',
        height: '500px',
        overflow: 'scroll',
        overflowX: 'hidden'}}>
            {/* <div>
               <div className="property_header">
                <h3>
                  {" "}
                  <button type="button" className="back-only-btn" onClick={() => {setIsContact(true) ; setButtonOn(0);}  }>
                    {" "}
                    <img src="/back.svg" />
                  </button>{" "}
                  ADD Contact
                </h3>
              </div>
            </div> */}
            <div className="parent">
              <div className="add_user_btn family_meber" >

                <h4>
                  General Details
                </h4>
                <p onClick={()=>setIsContact(0)}>X</p>
              </div>

              <div className="form-user-edit-inner-wrap form-user-add-wrapper additional-info-wrapper">
                <div className="form-user-add-inner-wrap">
                  <label>Name<span className="required-star">*</span></label>

                  <div className="edit-new-input">
                    <input
                      type="text"
                      name="firstname"
                      value={contactNew?.firstname}
                      onChange={handleChangeAddPhone}

                    />
                    <span className="error-message">{errors.firstname}</span>
                  </div>
                </div>

                <div className="form-user-add-inner-wrap">
                  <label>Email<span className="required-star">*</span></label>
                  <div className="edit-new-input">
                    <input
                      type="text"
                      name="email"
                      value={contactNew?.email}
                      onChange={handleChangeAddPhone}
                    />
                    <span className="error-message">{errors.email}</span>
                  </div>
                </div>

                <div className="form-user-add-inner-wrap">
                  <label>Website</label>
                  <div className="edit-new-input">
                    <input
                      type="text"
                      name="website"
                      value={contactNew?.website}
                      onChange={handleChangeAddPhone}
                    />
                  </div>
                </div>



                <Places value={contactNew.address1} onChange={handleAddressChange} />
                <div className="add-contact-user-custom-wrapper">
                  <div className="add-contact-user-custom-left">
                    <div className="form-user-add-inner-wrap">
                      <label>Phone<span className="required-star">*</span></label>

                      <div className="edit-new-input">
                        <InputMask
                          mask="+1 (999) 999-9999"
                          type="text"
                          name="phone"
                          value={contactNew?.phone}
                          onChange={handlePhoneNumberChange}
                          placeholder="+1 (___) ___-____"

                        />
                        <span className="error-message">{errors?.phone}</span>
                      </div>

                    </div>
                    <div className="form-user-add-inner-wrap">
                      <label>Business Name<span className="required-star">*</span></label>

                      <div className="edit-new-input">
                        <input
                          type="text"
                          name="business_name"
                          value={contactNew?.business_name}
                          onChange={handleChangeAddPhone}
                        />
                        <span className="error-message">{errors.business_name}</span>
                      </div>
                    </div>



                    <div className="form-user-add-inner-wrap  form-user-service-edit-contact">
                      <label>Service Require</label>
                      <Select
                        placeholder="Select Service(s) Required..."
                        value={selectedServices}
                        onChange={(selectedOptions) => {
                          setSelectedServices(selectedOptions);
                          // You can also extract the values into an array if needed
                          const selectedValues = selectedOptions.map(option => option.value);
                          setContactNew({ ...contactNew, servceRequire: selectedValues });
                        }}
                        options={serviceOptions}
                        components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                        styles={colourStyles}
                        className="select-new"
                        isMulti // This is what enables multiple selections
                      />
                    </div>

                    <div className="form-user-add-inner-wrap">
                      <label>Profession<span className="required-star">*</span>        </label>
                      <img src="/icons-form/Group30055.svg" />
                      <Select
                        placeholder="Select Profession.."
                        value={seletedProfession}
                        onChange={(selectedOption) => {
                          setContactNew({ ...contactNew, profession_id: selectedOption.value })
                          setSeletedProfession(selectedOption)
                        }}
                        options={profession}
                        components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                        styles={colourStyles}
                        className="select-new"
                      />
                    </div>
                    <span className="required-star " styles={{
                      Bottom: '14px',
                      color: 'red',
                      fontSize: '12px',
                      right: '10%',
                      fontWeight: '500'
                    }} >{errors.profession}</span>
                  </div>

                  <div className="add-contact-user-custom-right add-contact-user-custom-right-edit">
                    <div className="form-user-add-inner-wrap">
                      <label>Description</label>
                      <CKEditor
                        editor={ClassicEditor}
                        data={contactNew.notes}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setContactNew({ ...contactNew, notes: data });
                        }}
                        config={{
                          toolbar: ["heading", "|", "bold", "italic", "link", "|", "bulletedList", "numberedList", "|", "undo", "redo"],
                        }}
                        className="custom-ckeditor" // Add a custom class for CKEditor container
                        style={{ width: "100%", maxWidth: "800px", height: "200px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-user-add-inner-btm-btn-wrap">
                <button style={{ background: "#004686" }} onClick={handleSubmitNewPhone}>
                  Save
                </button>
              </div>
            </div>

          </div >
        </div>
      }
    </div>
  );
};

export default EditTodoForm;
