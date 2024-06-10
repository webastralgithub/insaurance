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
  const { id } = useParams()
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
  const navigate = useNavigate()
  const noSelectionOption = { value: null, label: 'No Selection' };


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
    getTodos()
    getCategories()
  }, []);


  const validateForm = () => {
    let isValid = true;

    if (!editedTodo.Followup) {

      if (editedTodo.Followup == undefined) {

      } else {
        setMlsNoError("Task Title is required");
        isValid = false;
      }
    }
    // if (editedTodo.phone) {
    //   if (editedTodo.phone.length != 10) {
    //     setPhoneError("Invalid phone number")
    //     isValid = false;
    //   }
    // }

    // if (!editedTodo.FollowupDate) {
    //   setPropertyTypeError("Follow up Date is required");
    //   isValid = false;
    // }



    if (!isValid) {
      window.scrollTo(0, 0)
    }
    return isValid;
  };

  const handleSaveClick = async () => {
    console.log("editedTodo", editedTodo)
    const updatedContact = { ...editedTodo, ContactID: newSelected.id };
    if (validateForm()) {
      const response = await axios.put(`${url}api/todo/${id}`,
        { ...updatedContact },
        { headers });
      navigate(-1)
      toast.success("FolowUp Created successfully", {
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



  // const handlePhoneNumberChange = (event) => {
  //   // Extract the raw phone number from the input
  //   const rawPhoneNumber = event.target.value.replace(/\D/g, "");
  //   // Update the phone number state with the raw input
  //   setEditedTodo({ ...editedTodo, phone: rawPhoneNumber.slice(1, 11) });
  // };
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
    isContact :true
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
      const response = await axios.post(`${url}api/contacts`, contactNew, {headers,});
      if (response.status === 201) {
        let getContact =await axios.get(`${url}api/contacts/${response.data.id}`,{ headers });
        setConatctlength(contactlength + 1);
        setNewSelected(getContact.data)
        setSearchQuery(getContact.data.firstname)
        setSearchContacts(getContact.data)
        setssearch(2)
        setIsContact(true)
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

    <div className="form-user-add">
      <div >
        <div className="property_header">
          <h3> <button type="button" className="back-only-btn" onClick={goBack}> <img src="/back.svg" /></button>Edit Task</h3>
          {/* <div className="top-bar-action-btns">
            <button style={{ background: "#004686" }} onClick={handleSaveClick}>Save</button>
          </div> */}
        </div>
      </div>
      {isContact == true &&
        <div className="form-user-edit-inner-wrap form-user-add-wrapper">
          <div className="todo-section">
            <div className="todo-main-section">
              <div className="form-user-add-inner-wrap">
                <label>Task Title<span className="required-star">*</span></label>
                {editingField === "Followup" || editingField === "all" ? (
                  <div className="edit-new-input">
                    <input
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
                {editingField === "FollowupDate" || editingField === "all" ? (
                  <div className="edit-new-input">
                    <input
                      name="FollowupDate"
                      type="datetime-local"
                      defaultValue={formatDate(defaultFollowupDate)}
                      onChange={handleChange}
                    />
                    <span className="error-message">{propertyTypeError}</span>
                  </div>
                ) : (
                  <div className="edit-new-input">
                    {formatDate(editedTodo?.FollowupDate)}
                    <FontAwesomeIcon
                      icon={faPencil}
                      onClick={() => handleEditClick("FollowupDate")}
                    />
                  </div>
                )}
              </div>

              {/* <div className="form-user-add-inner-wrap">
              <label>Phone Number<span className="required-star">*</span></label>
              {editingField === "phone" || editingField === "all" ? (
                <div className="edit-new-input">
                  <InputMask
                    mask="+1 (999) 999-9999"
                    type="text"
                    name="phone"
                    value={editedTodo?.phone}
                    onChange={handlePhoneNumberChange}
                    placeholder="+1 (___) ___-____"

                  />
                  <span className="error-message">{phoneError}</span>
                </div>
              ) : (
                <div className="edit-new-input">
                  {editedTodo.phone != undefined ? formatPhoneNumber(editedTodo.phone) : ""}

                  <FontAwesomeIcon
                    icon={faPencil}
                    onClick={() => handleEditClick("phone")}
                  />
                </div>
              )}
            </div> */}

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
                {searchContacts?.length == 0 && searchQuery?.length > 0 && loading == false && buttonOn == 0 && ssearch == 1 &&
                 <div className='no-contact-found-div'>
                  <h1> No Contacts Found</h1>
                  <button className="add-new-contact-btn" onClick={() => { setIsContact(false); setButtonOn(1) }}>Add New Contact</button>
                </div>}
                {searchContacts.length ?
                  <div className="scroll-for-contacts-search" style={{ height: "200px", overflow: 'scroll' , cursor: 'pointer'}} ref={containerRef}>

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
              {/* <div className="form-user-add-inner-wrap ">
              <label>Contact</label>

              <Select
                defaultInputValue={editedTodo?.contact?.firstname}
                placeholder="Select Contact"
                onChange={(selectedOption) => {
                  setSelectedContact(selectedOption)
                  setEditedTodo({ ...editedTodo, ContactID: selectedOption.value })
                }
                }
                options={contactOption}
                styles={colourStyles}
                className="select-new"
                isMulti={false}
                value={selectedContact}
                closeMenuOnSelect={true}
                hideSelectedOptions={false}
                components={{ DropdownIndicator: () => null,IndicatorSeparator:() => null }}
              />
            </div> */}
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
            {/* <div className="form-user-add-inner-wrap">
          <label>Owners</label>
          {editingField === "realtorId" || editingField === "all" ? (
          
                  <Select
            placeholder="Select Owner..."
            value={selectedRealtor}
            onChange={(selectedOption) => 
                {
                  setEditedTodo({ ...editedTodo, realtorId: selectedOption.value })
                    setSelectedRealtor(selectedOption)}}
            options={realtorOptions}
            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
            styles={colourStyles}
            className="select-new"
            
          />        
         
          ) : (
          <div className="edit-new-input">

              {editedTodo?.realtor?.name}
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("realtorId")} />
            </div>
          )}
        </div> */}
            {/* <div className="form-user-add-inner-wrap">
          <label>Contacts</label>
          {editingField === "clientId" || editingField === "all" ? (
          
                  <Select
            placeholder="Select Contacts..."
            value={selectedContact}
            onChange={(selectedOption) => 
                {
                  setEditedTodo({ ...editedTodo, clientId: selectedOption.value })
                  setSelectedContact(selectedOption)
                  const selectedContactObject = contactOption.find((option) => option.value === selectedOption.value);
                  setChildrenOptions(selectedContactObject.children || []);
                  setSelectedChildren(null);
                }}
                  options={contactOption}
            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
            styles={colourStyles}
            className="select-new"
            
          />
           
         
            
           
              
         
          ) : (
          <div className="edit-new-input">

              {editedTodo?.client?.firstname}
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("clientId")} />
            </div>
          )}
        </div> */}

            {/* <div className="form-user-add-inner-wrap">
          <label>Family Member Name</label>
          {editingField === "ContactID" || editingField === "all" ? (
          
          <Select
          placeholder="Select Family Member..."
          value={selectedFamilyMember}
        
          onChange={(selectedOption) => 
            {
                setEditedTodo({ ...editedTodo, ContactID: selectedOption.value })
                setSelectedFamilyMember(selectedOption)}}
          options={childOptions}
          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
          styles={colourStyles}
         className="select-new"
        />
          ) : (
          <div className="edit-new-input">

              {editedTodo?.familyMember?.firstname}
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("ContactID")} />
            </div>
          )}
        </div> */}
          </div>
          <div className="form-user-add-inner-btm-btn-wrap">

            <button style={{ background: "#004686" }} onClick={handleSaveClick}>Save</button>
          </div>
          {/* Add more fields as needed */}


        </div>}
      {/* Add Contact Form */}
      {isContact == false &&
        <>
          <form onSubmit={handleSubmitNewPhone} className="form-user-add add-contact-from-adst add-contact-form">
            <div className="property_header header-with-back-btn">

              <h3> <button type="button" className="back-only-btn" onClick={() => setIsContact(true)}> <img src="/back.svg" /></button>Add Contact</h3>

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
    </div>
  );
};

export default EditTodoForm;
