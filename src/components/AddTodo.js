import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import { AuthContext } from "./context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import InputMask from 'react-input-mask';
import { toast } from "react-toastify";
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
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


const AddTodo = ({ user }) => {
  const { date } = useParams()
  const [dateTime, setDateTime] = useState(date ? new Date(date) : new Date());
  const url = process.env.REACT_APP_API_URL;
  const [mlsNoError, setMlsNoError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [contactError, setContactError] = useState("")
  const [propertyTypeError, setPropertyTypeError] = useState("");
  const [searchQuery, setSearchQuery] = useState("")
  const [isContacts, setIsContacts] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchContacts, setSearchContacts] = useState([])
  const [newSelected, setNewSelected] = useState([])
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const containerRef = useRef(null);
  const handleDateTimeChange = (newDateTime) => {
    setDateTime(newDateTime);
  };
  const navigate = useNavigate();
  const { auth, tasklength, setTasklength, 
    setConatctlength, contactlength } = useContext(AuthContext);
  const headers = { Authorization: auth.token };

  const [contact, setContact] = useState({
    Followup: "",
    FollowupDate: dateTime,
    Comments: "",
    IsRead: false,
    ContactID: "",
  });

  const validateForm = () => {
    let isValid = true;

    if (!contact.Followup) {
      setMlsNoError("Task Title is required");
      isValid = false;
    }
    if (newSelected?.length == 0) {
      setContactError("Select atleast one contat")
      isValid = false;
    }
    // if (contact.phone) {
    // if (contact.phone.length != 10) {
    //   setPhoneError("Invalid phone number")
    //   isValid = false;
    // }
    // }
    // if (!contact.FollowupDate) {
    //   setPropertyTypeError("Follow up Date is required");
    //   isValid = false;
    // }

    if (!isValid) {
      window.scrollTo(0, 0)
    }
    return isValid;
  };

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

  const colourStyles = {
    valueContainer: (provided, state) => ({
      ...provided,
      // paddingLeft: "10px",
      fontSize: "14px",
      fontWeight: '550',
      //color: '#000000e8',
    }),
    control: (styles) => ({ ...styles, border: "unset", boxShadow: "unset", zIndex: "99999", borderColor: "unset", minHeight: "0" }),
    input: (styles) => ({ ...styles, margin: "0px", }),
    listbox: (styles) => ({ ...styles, zIndex: "99999" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
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
    placeholder: (styles, state) => ({
      ...styles,
      backGroundColor: "white",
      color: "black",
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedContact = { ...contact, ContactID: newSelected.id };
    if (!updatedContact.ContactID) {
      setContactError("Select  Contact")
      return
    }
    if (validateForm()) {
      try {
        const response = await axios.post(`${url}api/todo`, updatedContact, {
          headers,
        });
        if (response.status === 201) {
          setTasklength(tasklength + 1)
          toast.success('Todo added successfully', { autoClose: 2000, position: toast.POSITION.TOP_RIGHT });
          navigate(-1);
        }else if (response.data.status === false) {
          toast.error(response.data.message)
        }  
        else {
          console.error("Failed to add contact");
        }
      } catch (error) {
        console.error("An error occurred while adding a contact:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    clearErrors(name)
    setContact({ ...contact, [name]: value });
  };
  const goBack = () => {
    navigate(-1);
  };

  //new component
  const getCategories = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/categories`, { headers });
      const options = res.data.map((realtor) => ({
        key: realtor.id,
        value: realtor.id,
        label: realtor.name,
      }));
      setCategories(options)
    } catch (error) {
      console.error("User creation failed:", error);
    }
  };

  useEffect(() => {
    getCategories()
  }, [])

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
  const [ssearch, setssearch] = useState(1)
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

  // Add contact Data
  const [selectedServices, setSelectedServices] = useState([]);
  const [categories, setCategories] = useState([])
  const [seletedCategory, setSelectedCategory] = useState(null);

  const [contactNew, setContactNew] = useState({
    firstname: "",
    lastname: "",
    email: "",
    profession: "",
    address1: "",
    phone: "",
    company: "",
    website: "",
    servceRequire: selectedServices,
    category: seletedCategory,
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
    category: ""
  });

  const validateFormNewPhone = () => {
    let isValid = true;
    const { firstname, email, phone } = contactNew;

    const trimmedFirstName = firstname.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

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
    if (!contactNew.category) {
      setErrors(prevErrors => ({ ...prevErrors, category: "Please Select a category" }));
      isValid = false;
    }

    if (!isValid) {
      window.scrollTo(0, 0);
    }
    return isValid;
  };

  const handleSubmitNewPhone = async (e) => {
    e.preventDefault();
    const isValid = validateFormNewPhone();
    if (!isValid) {
      return
    }
    try {
      const response = await axios.post(`${url}api/contacts`, contactNew, { headers });
      if (response.status === 201) {
        let getContact = await axios.get(`${url}api/contacts/${response.data.id}`, { headers });
        setConatctlength(contactlength + 1);
        setNewSelected(getContact.data)
        setSearchQuery(getContact.data.firstname)
        setSearchContacts(getContact.data)
        setssearch(2)
        setIsContacts(true)
        setContactError("")
        toast.success(' Contact added successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT }); // Redirect to the contacts list page
      } else if (response.data.status === false) {
        toast.error(response.data.message)
      } else {
        toast.error("Failed to add contact");
      }
    } catch (error) {
      console.error("An error occurred while adding a contact:", error);
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
      category: ""
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
  return (

    <>
      {isContacts == true &&
        <form onSubmit={handleSubmit} className="form-user-add add-task-setion-form">
          <div className="property_header header-with-back-btn">

            <h3> <button type="button" className="back-only-btn" onClick={
              goBack}> <img src="/back.svg" /></button>Add Task</h3>

            <div className="top-bar-action-btns">
              {/* <button type="submit" style={{background:"#004686"}} >Save</button> */}

            </div>   </div>
          <div className="form-user-add-wrapper">
            <div className="todo-section">
              <div className="todo-main-section">
                <div className="form-user-add-inner-wrap">

                  <label>Task Title <span className="required-star">*</span></label>
                  <input
                    type="text"
                    name="Followup"
                    value={contact.Followup}
                    onChange={handleChange}

                  />
                  <span className="error-message">{mlsNoError}</span>
                </div>

                <div className="form-user-add-inner-wrap">
                  <label>Follow Up Date <span className="required-star">*</span></label>
                  <Datetime
                    value={dateTime}
                    onChange={handleDateTimeChange}
                    renderInput={(props, openCalendar) => (
                      <input
                        {...props}
                        readOnly
                        onClick={openCalendar}
                        style={{ cursor: 'pointer', backgroundColor: 'white' }}
                      />
                    )}
                  />
                  <span className="error-message">{propertyTypeError}</span>
                </div>
                {/* <div className="form-user-add-inner-wrap">
                <label>Phone Number<span className="required-star">*</span></label>
                <InputMask
                  mask="+1 (999) 999-9999"
                  type="text"
                  name="phone"
                  value={contact.phone}
                  onChange={handlePhoneNumberChange}
                  placeholder="+1 (___) ___-____"

                />
                <span className="error-message">{phoneError}</span>
              </div> */}

                <div className="form-user-add-inner-wrap">
                  <label>Task description</label>
                  <input
                    type="text"
                    name="description"
                    value={contact.description}
                    onChange={handleChange}
                  />
                </div>

                {/* dbouncing and select contact */}

                <div className="form-user-add-inner-wrap ">
                  <label>Contact<span className="required-star">*</span> <span className="error-message">{contactError}</span></label>
                  <input
                    type="text"
                    placeholder="Search Contact"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  {searchContacts?.length == 0 && searchQuery?.length > 0 && loading == false && buttonOn == 0 &&
                    <div className='no-contact-found-div'>
                      <h1> No Contacts Found</h1>
                      <button className="add-new-contact-btn" onClick={() => { setIsContacts(false); setButtonOn(1) }}>Add New Contact</button>
                    </div>
                  }

                  {searchContacts.length ?
                    <div className="scroll-for-contacts-search" style={{ height: "200px", overflow: 'scroll', cursor: 'pointer' }} ref={containerRef}>

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
                    <div className="form-user-add-inner-wrap">

                      <label>Phone Number</label>
                      <input
                        type="phone"
                        value={(newSelected?.phone ? newSelected?.phone : " ")}
                        readOnly
                      />
                    </div>
                    <div className="form-user-add-inner-wrap">
                      <label>Email</label>
                      <input
                        type="text"
                        value={(newSelected?.email ? newSelected?.email : " ")}
                        readOnly
                      />
                    </div>
                    <div className="form-user-add-inner-wrap">
                      <label>Business Name</label>
                      <input
                        type="text"
                        value={newSelected?.company}
                        readOnly
                      />
                    </div>
                    <div className="form-user-add-inner-wrap">
                      <label>Profession</label>
                      <input
                        type="text"

                        value={newSelected?.profession}
                        readOnly
                      />
                    </div>
                    <div className="form-user-add-inner-wrap">
                      <label>Address</label>
                      <input
                        type="text"

                        value={newSelected?.address1 ? newSelected?.address1 : ""}
                        readOnly
                      />
                    </div>
                    <div className="form-user-add-inner-wrap">
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
                  <label>Add Notes</label>

                  <CKEditor
                    editor={ClassicEditor}
                    data={contact.Comments}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setContact({ ...contact, Comments: data });
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

            <button type="submit" >Save</button>
          </div>
        </form>
      }

      {/* Add Contact Form */}
      {isContacts == false &&
        <>
          <form onSubmit={handleSubmitNewPhone} className="form-user-add add-contact-from-adst add-contact-form">
            <div className="property_header header-with-back-btn">

              <h3> <button type="button" className="back-only-btn" onClick={() => setIsContacts(true)}> <img src="/back.svg" /></button>Add Contact</h3>

            </div>

            <div className="add-cnt-form-desc">
              <div className="form-user-add-wrapper">

                <div className="form-user-add-inner-wrap">
                  <label>Name<span className="required-star">*</span></label>
                  <input
                    type="text"
                    name="firstname"
                    value={contactNew.firstname}
                    onChange={handleChangeAddPhone}

                  />
                  <span className="error-message">{errors.firstname}</span>
                </div>

                <div className="form-user-add-inner-wrap">
                  <label>Email Id<span className="required-star">*</span></label>
                  <input
                    type="text"
                    name="email"
                    value={contactNew.email}
                    onChange={handleChangeAddPhone}
                  />
                  <span className="error-message">{errors.email}</span>
                </div>
                <div className="form-user-add-inner-wrap">
                  <label>Profession</label>
                  <div className="edit-new-input">
                    <input
                      type="text"
                      name="profession"
                      value={contactNew.profession}
                      onChange={handleChangeAddPhone}
                    />
                  </div>
                </div>
                <div className="form-user-add-inner-wrap">
                  <label>Website</label>
                  <div className="edit-new-input">
                    <input
                      type="text"
                      name="website"
                      value={contactNew.website}
                      onChange={handleChangeAddPhone}
                    />
                  </div>
                </div>

                <Places value={contactNew.address1} onChange={handleAddressChange} />

                <div className="form-user-add-inner-wrap">
                  <label>Phone<span className="required-star">*</span></label>
                  <InputMask
                    mask="+1 (999) 999-9999"
                    type="text"
                    name="phone"
                    value={contactNew.phone}
                    onChange={handlePhoneNumberChange}
                    placeholder="+1 (___) ___-____"

                  />
                  <span className="error-message">{errors.phone}</span>
                </div>
                <div className="form-user-add-inner-wrap">
                  <label>Company Name</label>
                  <div className="edit-new-input">
                    <input
                      type="text"
                      name="company"
                      value={contactNew.company}
                      onChange={handleChangeAddPhone}
                    />
                  </div>
                </div>
              </div>

              <div className="add-contact-user-custom-right">
                <div className="add-contact-user-custom-wrapper">
                  <div className="add-contact-user-custom-left">

                    <div className="form-user-add-inner-wrap  form-user-add-inner-wrap-add-contact-service">
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
                      <label>Category<span className="required-star">*</span></label>
                      <img src="/icons-form/Group30055.svg" />
                      <Select
                        placeholder="Select Category.."
                        value={seletedCategory}
                        onChange={(selectedOption) => {
                          setContactNew({ ...contactNew, category: selectedOption.value })
                          setSelectedCategory(selectedOption)
                        }}
                        options={categories}
                        components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                        styles={colourStyles}
                        className="select-new"

                      />
                    </div>
                    <span className="error-message" style={{ color: "red" }}>{errors.category}</span>
                  </div>

                </div>


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
            <div className="form-user-add-inner-btm-btn-wrap">
              <button type="submit" >Save</button>
            </div>
          </form>
        </>
      }
    </>

  );
};

export default AddTodo;
