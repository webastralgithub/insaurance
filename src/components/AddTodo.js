import React, { useState, useEffect, useContext, useCallback } from "react";
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



const AddTodo = () => {
  const { date } = useParams()
  const [dateTime, setDateTime] = useState(date ? new Date(date) : new Date());
  const url = process.env.REACT_APP_API_URL;
  const [realtorOptions, setRealtorOptions] = useState([]);
  const [contactOption, setContactOptions] = useState([])
  const [mlsNoError, setMlsNoError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [propertyTypeError, setPropertyTypeError] = useState("");
  const noSelectionOption = { value: null, label: 'No Selection' };
  const [selectedContact, setSelectedContact] = useState({});
  const [selectedContactData, setSelectedContactData] = useState({});
  const handleDateTimeChange = (newDateTime) => {
    setDateTime(newDateTime);
  };
  const [contact, setContact] = useState(
    {

      Followup: "",
      FollowupDate: dateTime,
      Comments: "",
      IsRead: false,
      phone: "",
      ContactID: "",
    }
  );

  const validateForm = () => {
    let isValid = true;

    if (!contact.Followup) {
      setMlsNoError("Task Title is required");
      isValid = false;
    }
    // if (contact.phone) {
    if (contact.phone.length != 10) {
      setPhoneError("Invalid phone number")
      isValid = false;
    }
    // }
    if (!contact.FollowupDate) {
      setPropertyTypeError("Follow up Date is required");
      isValid = false;
    }

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

  const navigate = useNavigate();
  const { auth, setAuth, tasklength, setTasklength } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
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



  useEffect(() => {
    getRealtorOptions();
    getContacts()
  }, []);

  const getContacts = async () => {


    try {
      const response = await axios.get(`${url}api/contacts/get`, { headers });

      const contactsWithoutParentId = response.data.filter((contact) => contact.parentId === null).map((realtor) => ({
        value: realtor.id,
        label: realtor.firstname,
        // children: realtor.children || []
      }));
      // Set the filtered contacts in the state
      setContactOptions(contactsWithoutParentId);
    } catch (error) {
      localStorage.removeItem('token');
      setAuth(null);
      navigate('/');
    }
  };

  const handleAllChange = useCallback((selectedOptions) => {
    setSelectedContact(selectedOptions);

    if (selectedContact?.value) {
      getContactDetails()
    }
  }, [selectedContactData])

  const getContactDetails = async () => {
    if (selectedContact?.value)
      
      try {
        const response = await axios.get(`${url}api/contacts/get/${selectedContact?.value}`, { headers, });
        const responseData = await response?.data
        setSelectedContactData(responseData)
      } catch (error) {
        console.error(error)
      }
  }

  useEffect(() => {
    getContactDetails()
  }, [selectedContact.value])

  const getRealtorOptions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/admin/get-users`, { headers });
      const realtorOptions = res.data
        .filter((user) => user.roleId === 4 && user.isActivate)
        .map((realtor) => ({
          value: realtor.id,
          label: realtor.name,
        }));
      setRealtorOptions([noSelectionOption, ...realtorOptions]);
    } catch (error) {
      console.error("Error fetching realtors: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedContact = { ...contact, ContactID: selectedContactData.id };

    if (validateForm()) {
      try {
        const response = await axios.post(`${url}api/todo`, updatedContact, {
          headers,
        });

        if (response.status === 201) {
          setTasklength(tasklength + 1)
          toast.success('Todo added successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT }); // Redirect to the contacts list page
          // Contact added successfully
          navigate(-1); // Redirect to the contacts list page
        } else {
          console.error("Failed to add contact");
        }
      } catch (error) {
        console.error("An error occurred while adding a contact:", error);
      }
    }
  };
  const handlePhoneNumberChange = (event) => {
    // Extract the raw phone number from the input
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");
    setPhoneError("")
    // Update the phone number state with the raw input
    setContact({ ...contact, phone: rawPhoneNumber.slice(1, 11) });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    clearErrors(name)
    setContact({ ...contact, [name]: value });
  };

  const goBack = () => {
    navigate(-1); // This function takes you back one step in the navigation stack
  };

  return (

    <>
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
              <div className="form-user-add-inner-wrap">
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
              </div>

              <div className="form-user-add-inner-wrap">
                <label>Task description</label>
                <input
                  type="text"
                  name="description"
                  value={contact.description}
                  onChange={handleChange}
                />
              </div>
              {contactOption.length > 0 ? <>
                <div className="form-user-add-inner-wrap ">
                  <label>Contact</label>
                  <Select
                    placeholder="Select Contact"
                    onChange={handleAllChange}
                    options={contactOption}
                    styles={colourStyles}
                    className="select-new"
                    isMulti={false}
                    value={selectedContact}
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    components={{ DropdownIndicator: () => null }}
                  />
                </div>

                {selectedContactData.id && <>
                  <div className="form-user-add-inner-wrap">
                    <label>Email</label>
                    <input
                      type="text"
                      value={(selectedContactData?.email ? selectedContactData?.email : " ")}
                      readOnly
                    />
                  </div>
                  <div className="form-user-add-inner-wrap">
                    <label>Business Name</label>
                    <input
                      type="text"
                      value={selectedContactData?.company}
                      readOnly
                    />
                  </div>
                  <div className="form-user-add-inner-wrap">
                    <label>Profession</label>
                    <input
                      type="text"

                      value={selectedContactData?.profession}
                      readOnly
                    />
                  </div>
                  <div className="form-user-add-inner-wrap">
                    <label>Address</label>
                    <input
                      type="text"

                      value={selectedContactData?.address1 ? selectedContactData?.address1 : ""}
                      readOnly
                    />
                  </div>
                  <div className="form-user-add-inner-wrap">
                    <label>Website</label>
                    <input
                      type="text"
                      value={selectedContactData?.website ?? ""}
                      readOnly
                    />
                  </div>
                </>}

              </> : <div className="add_user_btn">
                <button onClick={() => navigate("/contacts/add")}>
                  <img src="/plus.svg" />
                  Add Contact</button>
              </div>}


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
    </>

  );
};

export default AddTodo;
