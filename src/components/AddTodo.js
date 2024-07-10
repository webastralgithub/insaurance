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
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment';

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
  const initialDate = date && moment(date).isSameOrAfter(moment(), 'day')
    ? new Date(date)
    : new Date();

  const [dateTime, setDateTime] = useState(initialDate);

  const [buttonOn, setButtonOn] = useState(0)
  const [profession, setProfession] = useState([])
  const [seletedProfession, setSeletedProfession] = useState([])
  const url = process.env.REACT_APP_API_URL;
  const [mlsNoError, setMlsNoError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [contactError, setContactError] = useState("")
  const [propertyTypeError, setPropertyTypeError] = useState("");
  const [searchQuery, setSearchQuery] = useState("")
  const [isContacts, setIsContacts] = useState(0)
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

  let updatedContact
  const validateForm = () => {
    let isValid = true;
    updatedContact = { ...contact, ContactID: newSelected.id };
    if (!updatedContact.ContactID) {
      setContactError("Select  Contact")
      isValid = false;
    }
    if (!contact.Followup.trim()) {
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
    if (validateForm()) {
      try {
        const response = await axios.post(`${url}api/todo`, updatedContact, {
          headers,
        });
        if (response.status === 201) {
          setTasklength(tasklength + 1)
          toast.success('Todo added successfully', { autoClose: 2000, position: toast.POSITION.TOP_RIGHT });
          navigate(-1);
        } else if (response.data.status === false) {
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

  useEffect(() => {
    if (searchQuery?.length == 0) {
      setLoading(false)
    }
  }, [searchQuery])

  // Add contact Data
  const [selectedServices, setSelectedServices] = useState([]);
  const [categories, setCategories] = useState([])
  const [seletedCategory, setSelectedCategory] = useState(null);

  const [contactNew, setContactNew] = useState({
    firstname: "",
    business_name: '',
    email: "",
    profession_id: "",
    address1: "",
    phone: "",
    company: "",
    website: "",
    servceRequire: selectedServices,
    notes: "",
    source: "",

    createdBy: user,
    realtorId: null,
    propertyId: null,
    isContact: 1
  });

  const [errors, setErrors] = useState({
    firstname: "",
    email: "",
    phone: "",
    category: "",
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
      business_name: "",
      email: "",
      phone: "",
      category: "",
      profession: ""
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
      setErrors(prevErrors => ({ ...prevErrors, profession: "Please Select a Profession" }));
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
  }, [])


  const handleSubmitNewPhone = async (e) => {
    e.preventDefault();
    const isValid = validateFormNewPhone();

    if (!isValid) {
      //handlescroll()
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
        setIsContacts(0)
        setButtonOn(1)
        toast.success(' Contact added successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT }); // Redirect to the contacts list page
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

  const isValidDate = (current) => {
    return current.isSameOrAfter(moment(), 'day');
  };

  return (

    <>
      <div className="div-add-contact-parent" style={{ position: 'relative' }} >
        <form onSubmit={handleSubmit} className="form-user-add add-task-setion-form"   >
          <div className="property_header header-with-back-btn">
            <h3> <button type="button" className="back-only-btn" onClick={() => navigate(-1)}> <img src="/back.svg" /></button>Add Task</h3>

          </div>
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
                    isValidDate={isValidDate}
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
                  {searchContacts?.length == 0 && searchQuery?.length > 0 && loading == false && buttonOn === 0 &&
                    <div className='no-contact-found-div'>
                      <h1> No Contacts Found</h1>
                      <button className="add-new-contact-btn" onClick={() => {
                        setIsContacts(1); setButtonOn(1);
                        setContactNew({ ...contactNew, firstname: searchQuery })
                      }}>Add New Contact</button>
                    </div>
                  }

                  {loading === true ? <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
                    <CircularProgress color="inherit" />
                  </Stack> : <>      {searchContacts.length > 0 &&
                    <div className="scroll-for-contacts-search clone-select-type" style={{ height: "auto", overflow: 'scroll', cursor: 'pointer' }} ref={containerRef}>

                      {searchContacts && searchContacts?.map((item) => (
                        <div key={item.id} >
                          <p onClick={() => handleSelect(item, item?.profession_id)}>{item.firstname}</p>
                        </div>
                      ))}
                    </div>
                  }
                  </>}
                </div>

                <div className="todo-section todo-section-selected">
                  {newSelected.id &&
                    <>
                      <div className="contact-card">


                        <div className="contact-details">
                          <div className="detail">
                            <label>Phone Number :
                              <span> {(newSelected?.phone ? newSelected?.phone : " ")}</span></label>
                          </div>
                          <div className="detail">
                            <label>Email :
                              <span> {(newSelected?.email ? newSelected?.email : " ")}</span></label>
                          </div>
                          <div className="detail">
                            <label>Business Name :
                              <span> {newSelected?.business_name}</span></label>
                          </div>
                          <div className="detail">
                            <label>Profession :
                              <span> {newSelected?.profession_id > 0 ? newSelected?.profession.name : ""}</span></label>
                          </div>
                          <div className="detail">
                            <label>Address :
                              <span> {newSelected?.address1 ? newSelected?.address1 : ""}</span></label>
                          </div>
                          <div className="detail">
                            <label>Website :
                              <span>  {newSelected?.website ?? ""}</span></label>
                          </div>
                        </div>
                      </div>

                      {/* <div className="fields-selected-check">
                        <div className="form-user-add-inner-wrap disable">
                          <p>   <label>Phone Number :</label>
                            {(newSelected?.phone ? newSelected?.phone : " ")}</p>


                        </div>
                        <div className="form-user-add-inner-wrap disable">
                          <p>    <label>Email :</label>
                            {(newSelected?.email ? newSelected?.email : " ")}</p>


                        </div>
                        <div className="form-user-add-inner-wrap disable">
                          <p> <label>Business Name :</label>
                            {newSelected?.business_name}</p>

                        </div>
                        <div className="form-user-add-inner-wrap disable">
                          <p>    <label>Profession :</label>
                            {newSelected?.profession ? newSelected?.profession.name : ""}</p>

                        </div>
                        <div className="form-user-add-inner-wrap disable">
                          <p>    <label>Address :</label>
                            {newSelected?.address1 ? newSelected?.address1 : ""}</p>

                        </div>
                        <div className="form-user-add-inner-wrap disable">
                          <p>  <label>Website :</label>
                            {newSelected?.website ?? ""}</p>
                        </div>
                      </div> */}
                    </>
                  }
                </div>

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


        {/* Add Contact Form */}
        {isContacts === 1 &&
          <div className="parent-pop-up-add-contact">


            {/* clone form */}


            <div className="form-user-add add-contact-popup-new-child" >
              {/* <div>
              <div className="property_header">
                <h3>
                  {" "}
                  <button type="button" className="back-only-btn" onClick={() => { setIsContacts(true); setButtonOn(0);}}>
                    {" "}
                    <img src="/back.svg" />
                  </button>{" "}
                  ADD Contact
                </h3>
                {/* <div className="top-bar-action-btns">
          <button style={{ background: "#004686" }} onClick={handleSaveClick}>
            Save
          </button>
          </div> */}
              {/* </div>
            </div> */}
              <div className="parent">
                <div className="add_user_btn family_meber" >

                  <h4>
                    General Details
                  </h4>
                  <p onClick={() => { setIsContacts(0); setButtonOn(1); setContactNew({}) }}>x</p>
                </div>
                <div className="form-user-edit-inner-wrap form-user-add-wrapper additional-info-wrapper">
                  <div className="form-user-add-inner-wrap">
                    <label>Name<span className="required-star">*</span></label>

                    <div className="edit-new-input">
                      <input
                        type="text"
                        name="firstname"
                        value={contactNew.firstname}
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
                        value={contactNew.email}
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
                        value={contactNew.website}
                        onChange={handleChangeAddPhone}
                      />
                    </div>
                  </div>



                  <Places value={contactNew.address1} onChange={(newAddress) => setContactNew({ ...contactNew, address1: newAddress })} />

                  <div className="add-contact-user-custom-wrapper">
                    <div className="add-contact-user-custom-left">
                      <div className="form-user-add-inner-wrap">
                        <label>Phone<span className="required-star">*</span></label>

                        <div className="edit-new-input">
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

                      </div>
                      <div className="form-user-add-inner-wrap">
                        <label>Business Name<span className="required-star">*</span></label>

                        <div className="edit-new-input">
                          <input
                            type="text"
                            name="business_name"
                            value={contactNew.business_name}
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
                        <label>Profession<span className="required-star">*</span>     </label>
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
                      <span className="required-star" styles={{
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
                <div className="form-user-add-inner-btm-btn-wrap" style={{
                  marginBottom: '12px',
                  marginLeft: '-18px',
                  paddingRight: '5px'
                }}>
                  <button style={{ background: "#004686" }} onClick={handleSubmitNewPhone}>
                    Save
                  </button>
                </div>
              </div>



            </div >

          </div>
        }
      </div>
    </>

  );
};

export default AddTodo;
