import React, { useState, useEffect, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import { faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import InputMask from "react-input-mask";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Places from "./Places";
import ChildContact from "./ChildContact";
import AddContactNew from "./AddContactNew";
import ContactProperty from "./contact/ContactProperty";
import ChildNotes from "./ChildNotes";


const EditContact = ({ nameofuser }) => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [show, setShow] = useState(false)
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL;
  const headers = {
    Authorization: auth.token,
  };

  const [editedContact, setEditedContact] = useState({});
  const [birth, setBirth] = useState("")
  const [ann, setAnn] = useState()
  const [emailError, setEmailError] = useState("")
  const [phoneError, setPhoneError] = useState("");
  const [realtorOptions, setRealtorOptions] = useState([]);
  const [selectedRealtor, setSelectedRealtor] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [firstError, setFirstError] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [categories, setCategories] = useState([])
  const [seletedCategory, setSelectedCategory] = useState(null);
  const [editingField, setEditingField] = useState('all');
  const noSelectionOption = { value: null, label: 'No Selection' };
  const handleChange = (e) => {
    const { name, value } = e.target;
    clearErrors(name)
    setEditedContact({ ...editedContact, [name]: value });
    if (name == 'birthday') {
      const birth = formatDate(value)
      setBirth(birth)
    }
    if (name == "anniversary") {
      const birth = formatDate(value)
      setAnn(birth)
    }
  };

  const childref = useRef()
  const handleEditClick = (field) => {
    setEditingField(field);
  };
  const validateEmail = (email) => {
    // Define a regular expression pattern for email validation.
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailPattern.test(email);
  };

  const formatPhoneNumber = (phoneNumber) => {
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };
  const handleAddressChange = (newAddress) => {

    setEditedContact({ ...editedContact, address1: newAddress });
  };
  const serviceOptions = [
    { value: 'Real Estate', label: 'Real Estate' },
    { value: 'Mortgage', label: 'Mortgage' },
    { value: 'Insurance', label: 'Insurance' },
    { value: 'Immigration', label: 'Immigration' }
  ];
  const colourStyles = {
    valueContainer: (provided, state) => ({
      ...provided,
      paddingLeft: "0px"
    }),
    control: (styles) => ({ ...styles, border: "unset", boxShadow: "unset", zIndex: "99999", borderColor: "unset", minHeight: "0" }),
    input: (styles) => ({ ...styles, margin: "0px" }),
    listbox: (styles) => ({ ...styles, zIndex: "99999" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
      };
    },
  };




  const clearErrors = (fieldName) => {
    switch (fieldName) {
      case "firstname":
        setFirstError("");
        break;
      case "phone":
        setPhoneError("");
        break;
      case "email":
        setEmailError("")
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    getContactDetails();
    getRealtorOptions();
    getCategories()
  }, []);

  const getCategories = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/categories/get`, { headers });
      const options = res.data.map((realtor) => ({
        value: realtor.id,
        label: realtor.name,
      }));

      setCategories([noSelectionOption, ...options])

    } catch (error) {
      console.error("User creation failed:", error);
    }
  };
  const validateForm = () => {
    let isValid = true;

    if (!editedContact.firstname) {
      if (editedContact.firstname == undefined) {

      }
      else {
        setFirstError("Name is required");
        isValid = false;
      }
    }
    if (editedContact.email) {
      const emailval = validateEmail(editedContact.email)
      if (!emailval) {
        setEmailError("invalid email")
        isValid = false;
      }
    }
    if (editedContact.phone) {
      if (editedContact.phone.length != 10) {
        setPhoneError("Invalid phone number")
        isValid = false;
      }
    }

    if (!isValid) {
      window.scrollTo(0, 0)
    }
    return isValid;
  };
  const getContactDetails = async () => {

    try {
      if (editedContact.firstname) {
        return
      }
      const response = await axios.get(`${url}api/contacts/get/${id}`, {
        headers,
      });
      const contactDetails = response.data;
      localStorage.setItem("parent", contactDetails.firstname)
      if (contactDetails.birthday) {
        setEditedContact({ ...contactDetails, birthday: contactDetails.birthday })
        const birth = formatDate(contactDetails.birthday)
        setBirth(birth)
      }
      if (contactDetails.anniversary) {
        setEditedContact({ ...contactDetails, anniversary: contactDetails.anniversary })
        const birth = formatDate(contactDetails.anniversary)
        setAnn(birth)
      }
      if (contactDetails.servceRequire) {
        setEditedContact({ ...contactDetails, servceRequire: JSON.parse(contactDetails.servceRequire) })
      }
      else {
        setEditedContact(contactDetails)
      }

      if (contactDetails.realtor) {
        setSelectedRealtor({
          value: contactDetails.realtor.id,
          label: contactDetails.realtor.name,
        })
      }

      if (contactDetails.category) {
        setSelectedCategory({
          value: contactDetails.category.id,
          label: contactDetails.category.name,
        })
      }
      if (contactDetails.servceRequire) {
        const selectedValues = JSON.parse(contactDetails.servceRequire).map(option => {
          return { value: option, label: option };
        });

        setSelectedServices(selectedValues)
      }
      if (contactDetails.activeAgent) {
        setSelectedAgent({
          value: contactDetails.activeAgent.id,
          label: contactDetails.activeAgent.name,
        })
      }




    } catch (error) {
      console.error("Error fetching contact details: ", error);
    }
  };

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

  const handleSaveClick = async () => {

    if (validateForm()) {
      try {
        let contact = {}
        if (editedContact?.category) {
          if (typeof editedContact.category === 'object') {
            contact = { ...editedContact, category: editedContact.category.id }
          }
          else {
            contact = editedContact
          }
        }

        const response = await axios.put(`${url}api/contacts/update/${id}`, editedContact, {
          headers,
        });


        if (response.status === 200) {
          toast.success("Contact updated successfully", {
            autoClose: 3000,
            position: toast.POSITION.TOP_RIGHT,
          });
          setEditingField(null);
          goBack()
        } else {
          console.error("Failed to update contact");
        }
      } catch (error) {
        console.error("An error occurred while updating the contact:", error);
      }
    }
  };

  // const handleSaveAdditional = async () => {
  //   if(validateForm()){
  //   try {
  //     const response = await axios.put(`${url}api/contacts/update/${id}`, {birthday:editedContact.birthday,anniversary:editedContact.anniversary}, {
  //       headers,
  //     });

  //     if (response.status === 200) {
  //       toast.success("Additional Info updated successfully", {
  //         autoClose: 3000,
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //       // setEditingField(null);
  //       // goBack()
  //     } else {
  //       console.error("Failed to update contact");
  //     }
  //   } catch (error) {
  //     console.error("An error occurred while updating the contact:", error);
  //   }
  // }
  // };

  const handleSaveNotes = async () => {
    if (validateForm()) {
      try {
        const response = await axios.put(`${url}api/contacts/update/${id}`, { notenew: editedContact.notenew, datenew: editedContact.datenew, addedBy: editedContact.addedBy }, {
          headers,
        });

        if (response.status === 200) {
          toast.success("Notes updated successfully", {
            autoClose: 3000,
            position: toast.POSITION.TOP_RIGHT,
          });
          // setEditingField(null);
          // goBack()
        } else {
          console.error("Failed to update contact");
        }
      } catch (error) {
        console.error("An error occurred while updating the contact:", error);
      }
    }
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
  const handlePhoneNumberChange = (event) => {
    setPhoneError("")
    // Extract the raw phone number from the input
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");

    // Update the phone number state with the raw input
    setEditedContact({ ...editedContact, phone: rawPhoneNumber.slice(1, 11) });
  };

  const goBack = () => {
    navigate(`/contacts`);
  };

  return (
    <div className="form-user-add">
      <div>
        <div className="property_header">
          <h3>
            {" "}
            <button type="button" className="back-only-btn" onClick={goBack}>
              {" "}
              <img src="/back.svg" />
            </button>{" "}
            Edit Contact
          </h3>
          {/* <div className="top-bar-action-btns">
          <button style={{ background: "#004686" }} onClick={handleSaveClick}>
            Save
          </button>
          </div> */}
        </div>
      </div>
      <div className="parent">
        <div className="add_user_btn family_meber" >

          <h4>
            General Details
          </h4>

        </div>
        <div className="form-user-edit-inner-wrap form-user-add-wrapper additional-info-wrapper">
          <div className="form-user-add-inner-wrap">
            <label>Name<span className="required-star">*</span></label>
            {editingField === "firstname" || editingField === "all" ? (
              <div className="edit-new-input">
                <input name="firstname" value={editedContact.firstname} onChange={handleChange} placeholder="First Name" />
                <span className="error-message">{firstError}</span>
              </div>
            ) : (
              <div className="edit-new-input">
                {editedContact.firstname}
                <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("firstname")} />
              </div>
            )}
          </div>
          {/* 
        <div className="form-user-add-inner-wrap">
          <label>Last Name</label>
          {editingField === "lastname" || editingField === "all" ? (
            <div className="edit-new-input">
              <input name="lastname" value={editedContact.lastname} onChange={handleChange} placeholder="Last Name" />
            </div>
          ) : (
            <div className="edit-new-input">
              {editedContact.lastname}
              <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("lastname")} />
            </div>
          )}
        </div> */}



          <div className="form-user-add-inner-wrap">
            <label>Email</label>
            {editingField === "email" || editingField === "all" ? (
              <div className="edit-new-input">
                <input
                  name="email"
                  type="email"
                  value={editedContact.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
                <span className="error-message">{emailError}</span>
              </div>
            ) : (
              <div className="edit-new-input">
                {editedContact.email}
                <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("email")} />
              </div>
            )}
          </div>
          <div className="form-user-add-inner-wrap">
            <label>Profession</label>
            <div className="edit-new-input">
              <input
                type="text"
                name="profession"
                value={editedContact.profession}
                onChange={handleChange}
              />
            </div>
          </div>


          <Places value={editedContact.address1} onChange={handleAddressChange} />
          <div className="add-contact-user-custom-wrapper">
            <div className="add-contact-user-custom-left">
              <div className="form-user-add-inner-wrap">
                <label>Phone</label>
                {editingField === "phone" || editingField === "all" ? (
                  <div className="edit-new-input">
                    <InputMask
                      mask="+1 (999) 999-9999"
                      type="text"
                      name="phone"
                      value={editedContact.phone}
                      onChange={handlePhoneNumberChange}
                      placeholder="+1 (___) ___-____"
                    />
                    <span className="error-message">{phoneError}</span>
                  </div>
                ) : (
                  <div className="edit-new-input">
                    {editedContact.phone != undefined ? formatPhoneNumber(editedContact.phone) : ""}
                    <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("phone")} />
                  </div>
                )}
              </div>
              <div className="form-user-add-inner-wrap">
                <label>Company Name</label>
                <div className="edit-new-input">
                  <input
                    type="text"
                    name="company"
                    value={editedContact.company}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* <div className="form-user-add-inner-wrap">
          <label>User</label>

          {editingField === "all" && !selectedRealtor? (
            <Select
              placeholder="Select User..."
              value={selectedRealtor}
              onChange={(selectedOption) => {
                
                setEditedContact({ ...editedContact, realtorId: selectedOption.value });
                setSelectedRealtor(selectedOption);
              }}
              options={realtorOptions}
              components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
              styles={colourStyles}
              className="select-new"
            />
          ) : (
            <div className="edit-new-input" style={{paddingBottom:"14px"}}>
              {selectedRealtor?.label}
            
            </div>
          )}
        </div> */}
              <div className="form-user-add-inner-wrap">
                <label>Active Agent</label>
                {editingField === "agentId" || editingField === "all" ? (
                  <Select
                    placeholder="Select Active Agent..."
                    value={selectedAgent}
                    onChange={(selectedOption) => {
                      setEditedContact({ ...editedContact, agentId: selectedOption.value });
                      setSelectedAgent(selectedOption);
                    }}
                    options={realtorOptions}
                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                    styles={colourStyles}
                    className="select-new"
                  />
                ) : (
                  <div className="edit-new-input" style={{ background: "unset" }}>
                    {selectedAgent?.label}
                    <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("agentId")} />
                  </div>
                )}
              </div>

              <div className="form-user-add-inner-wrap">
                <label>Service Require</label>


                <Select
                  placeholder="Select Service(s) Required..."
                  value={selectedServices}
                  onChange={(selectedOptions) => {
                    setSelectedServices(selectedOptions);
                    // You can also extract the values into an array if needed
                    const selectedValues = selectedOptions.map(option => option.value);
                    setEditedContact({ ...editedContact, servceRequire: selectedValues });
                  }}
                  options={serviceOptions}
                  components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                  styles={colourStyles}
                  className="select-new"
                  isMulti // This is what enables multiple selections
                />


              </div>

              <div className="form-user-add-inner-wrap">
                <label>Category</label>

                <Select
                  placeholder="Select Category.."
                  value={seletedCategory}
                  onChange={(selectedOption) => {
                    setEditedContact({ ...editedContact, category: selectedOption.value })
                    setSelectedCategory(selectedOption)
                  }}
                  options={categories}
                  components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                  styles={colourStyles}
                  className="select-new"

                />

              </div>
            </div>

            <div className="add-contact-user-custom-right add-contact-user-custom-right-edit">
              <div className="form-user-add-inner-wrap">
                <label>Notes</label>
                <CKEditor
                  editor={ClassicEditor}
                  data={editedContact?.notes || ""} // Set the initial data from the API
                  config={{
                    toolbar: ["heading", "|", "bold", "italic", "link", "|", "bulletedList", "numberedList", "|", "undo", "redo"],
                  }}
                  className="custom-ckeditor" // Add a custom class for CKEditor container
                  style={{ width: "100%", maxWidth: "800px", height: "200px" }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setEditedContact({ ...editedContact, notes: data });
                  }}
                />
              </div>
            </div>
          </div>


        </div>
      </div>
      <div className="parent">
        <div className="add_property_btn">
          <div className="add_user_btn family_meber" >

            <h4>
              Additional Information
            </h4>
          </div>

          <div className="form-user-edit-inner-wrap form-user-add-wrapper additional-info-wrapper birthday-section">

            <div className="form-user-add-inner-wrap">
              <label> Birthday</label>
              <div className="edit-new-input">

                <input
                  name="birthday"
                  type="date"
                  value={birth}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-user-add-inner-wrap">
              <label>Anniversary</label>
              <div className="edit-new-input">

                <input
                  name="anniversary"
                  type="date"
                  value={ann}
                  onChange={handleChange}
                />
              </div>
            </div>


            {/* <div className="form-user-add-inner-wrap form-user-add-inner-wrap-btn">
<div className="top-bar-action-btns">
          <button style={{ background: "#004686" }} onClick={handleSaveAdditional}>
            Save
          </button>
          </div>
  
    </div> */}
          </div>
        </div>
      </div>

      <div className="parent">
        <ChildContact id={editedContact.id} />
      </div>

      <div className="parent">
        <ContactProperty id={editedContact.id} />
      </div>
      <div className="parent">

        <ChildNotes nameofuser={nameofuser} id={editedContact.id} />
        {/* <div className="add_property_btn">
        <div className="add_user_btn family_meber" >
          
        <h4>
            
      Notes
      
            </h4>
          
            </div>
    <div className="form-user-edit-inner-wrap form-user-add-wrapper additional-info-wrapper">
        
        <div className="form-user-add-inner-wrap">
        <label> Notes</label>
        <div className="edit-new-input">
        <input
            name="notenew"
            type="text"
            defaultValue={editedContact?.notenew}
            onChange={handleChange}
          />
          </div>
          </div>  
          <div className="form-user-add-inner-wrap">
          <label>Date</label>
          <div className="edit-new-input">
                  
                  <input
            name="datenew"
            type="date"
            defaultValue={formatDate(editedContact?.datenew)}
            onChange={handleChange}
          />
                </div>
                </div>
                <div className="form-user-add-inner-wrap">
          <label> Initials (Note added by)</label>
          <div className="edit-new-input">
                  
                  <input
            name="addedBy"
            type="text"
            defaultValue={editedContact?.addedBy}
          
          />
        
                </div>
  </div>
  <div className="form-user-add-inner-wrap form-user-add-inner-wrap-btn">
  <div className="top-bar-action-btns">
            <button style={{ background: "#004686" }} onClick={handleSaveNotes}>
              Save
            </button>
            </div>
    
      </div>
    
      </div>
      </div> */}
      </div>
      <div className="form-user-add-inner-btm-btn-wrap">
        <button style={{ background: "#004686" }} onClick={handleSaveClick}>
          Save
        </button>
      </div>

    </div>
  );
};

export default EditContact;
