import React, { useState, useEffect, useContext } from "react";
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


const EditTodoForm = () => {
  const { id } = useParams()
  const { auth, todo } = useContext(AuthContext)
  const url = process.env.REACT_APP_API_URL;
  const headers = {
    Authorization: auth.token,
  };
  const [editedTodo, setEditedTodo] = useState({ ...todo });
  const [realtorOptions, setRealtorOptions] = useState([]);
  const [defaultFollowupDate, setDefaultFollowupDate] = useState('');
  const [phoneError, setPhoneError] = useState("")
  const [selectedRealtor, setSelectedRealtor] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedChildren, setSelectedChildren] = useState(null);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(null);
  const [childrenOptions, setChildrenOptions] = useState([])
  const [contactOption, setContactOptions] = useState([])
  const [users, setUsers] = useState([])
  const [editingField, setEditingField] = useState('all');


  const [mlsNoError, setMlsNoError] = useState("");
  const [propertyTypeError, setPropertyTypeError] = useState("");

  // Validate the form fields and set validation errors



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
      console.log(formatDate(value))
      setEditedTodo({ ...editedTodo, [name]: isoDate });
    } else {
      setEditedTodo({ ...editedTodo, [name]: value });
    }


  };

  const handleEditClick = (field) => {
    setEditingField(field);
  };
  const formatPhoneNumber = (phoneNumber) => {
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  };
  const colourStyles = {
    valueContainer: (provided, state) => ({
      ...provided,
      paddingLeft: "0px"
    }),
    control: styles => ({ ...styles, border: 'unset', boxShadow: "unset", borderColor: "unset", minHeight: "0" }),
    input: styles => ({ ...styles, margin: "0px" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {

      return {
        ...styles,


      };
    },

  };
  const childOptions = childrenOptions.map((child) => ({
    value: child.id,
    label: child.firstname,
  }));





  useEffect(() => {
    getTodos()
    getUsers()
    getContacts()
  }, []);


  const validateForm = () => {
    let isValid = true;
    console.log(editedTodo.Followup, "fddfdfdff")
    if (!editedTodo.Followup) {

      if (editedTodo.Followup == undefined) {

      } else {
        setMlsNoError("Task Title is required");
        isValid = false;
      }
    }
    if (editedTodo.phone) {
      if (editedTodo.phone.length != 10) {
        setPhoneError("Invalid phone number")
        isValid = false;
      }
    }

    // if (!editedTodo.FollowupDate) {
    //   setPropertyTypeError("Follow up Date is required");
    //   isValid = false;
    // }



    if (!isValid) {
      window.scrollTo(0, 0)
    }
    return isValid;
  };
  useEffect(() => {
    // Fetch Realtor and Lawyer options and populate the select inputs

    const realtors = users.filter((user) => user.roleId === 4);

    // Map the users into an array of options with 'label' and 'value' properties
    const realtorOptions = realtors.map((realtor) => ({
      value: realtor.id,
      label: realtor.name,
    }));


    setRealtorOptions([noSelectionOption, ...realtorOptions]);

  }, [users]);

  const handleSaveClick = async () => {

    if (validateForm()) {

      const response = await axios.put(`${url}api/todo/update/${id}`,
        { ...editedTodo },
        { headers });
      console.log(response)
      navigate(-1)
      toast.success("Todo updated successfully", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
      setEditingField(null);
    }
  };
  const goBack = () => {
    navigate(-1); // This function takes you back one step in the navigation stack
  };
  const getUsers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/admin/get-users`, { headers });
      setUsers(res.data)

    } catch (error) {

    }
  };
  const handleCancelClick = () => {
    setEditingField(null);
    // Reset the editedTodo to the original values
    // setEditedTodo({ ...todo });
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
    const response = await axios.get(`${url}api/todo/get`, { headers });
console.log("here",response);
    console.log(id)// Replace with the specific id you want to filter by
    const filtered = response.data.find(x => x.id == id)
    console.log(filtered, "filtered")
    const followupDateISO = filtered?.FollowupDate
      ? new Date(filtered.FollowupDate).toISOString().slice(0, 16)
      : '';
    setEditedTodo(filtered);
    // setDefaultFollowupDate(filtered?.FollowupDate)
    setDefaultFollowupDate(followupDateISO);

  }
  const getContacts = async () => {
    try {
      const response = await axios.get(`${url}api/contacts/get`, { headers });
      console.log(response.data)
      const contactsWithoutParentId = response.data.filter((contact) => contact.parentId === null).map((realtor) => ({
        value: realtor.id,
        label: realtor.firstname,
        children: realtor.children || []
      }));
      // Set the filtered contacts in the state
      setContactOptions(contactsWithoutParentId);


    } catch (error) {

    }

  };


  const editAll = () => {
    setEditingField('all');
  }



  const handlePhoneNumberChange = (event) => {
    // Extract the raw phone number from the input
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");
    console.log(rawPhoneNumber, "fsffsf")
    // Update the phone number state with the raw input
    setEditedTodo({ ...editedTodo, phone: rawPhoneNumber.slice(1, 11) });
  };

  return (

    <div className="form-user-add">
      <div >
        <div className="property_header">
          <h3> <button type="button" className="back-only-btn" onClick={goBack}> <img src="/back.svg" /></button> Task</h3>
          <div className="top-bar-action-btns">
            <button style={{ background: "#004686" }} onClick={handleSaveClick}>Save</button>
          </div>
        </div>
      </div>
      <div className="form-user-edit-inner-wrap form-user-add-wrapper">
        <div className="todo-section">
          <div className="todo-main-section">
            <div className="form-user-add-inner-wrap">
              <label>Task Title</label>
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
              <label>Follow Up Date</label>
              {editingField === "FollowupDate" || editingField === "all" ? (
                <div className="edit-new-input">
                  <input
                    name="FollowupDate"
                    type="datetime-local"
                    defaultValue={defaultFollowupDate}
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

            <div className="form-user-add-inner-wrap">
              <label>Phone Number</label>
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


      </div>
    </div>
  );
};

export default EditTodoForm;
