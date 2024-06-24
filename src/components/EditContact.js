import React, { useState, useEffect, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import InputMask from "react-input-mask";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Places from "./Places";
import ChildContact from "./ChildContact";
import ContactProperty from "./contact/ContactProperty";
import ChildNotes from "./ChildNotes";

const EditContact = ({ nameofuser }) => {
  const { id } = useParams();
  const location = useLocation();
  const { data } = location.state;
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const url = process.env.REACT_APP_API_URL;
  const headers = {
    Authorization: auth.token,
  };
  const [birth, setBirth] = useState("")
  const [selectedServices, setSelectedServices] = useState([]);
  const [editingField, setEditingField] = useState('all');
  const [profession, setProfession] = useState([])
  const [seletedProfession, setSeletedProfession] = useState([])
  const [editedContact, setEditedContact] = useState(data);
  const [errors, setErrors] = useState({
    firstname: "",
    business_name: "",
    profession_id: "",
    email: "",
    phone: ""
  });

  const handleChange = (e) => {
    setErrors({
      firstname: "",
      business_name: "",
      profession_id: "",
      email: "",
      phone: ""
    });
    const { name, value } = e.target;
    setEditedContact({ ...editedContact, [name]: value });

  };

  const handlePhoneNumberChange = (event) => {
    setErrors({ phone: "" })
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");
    setEditedContact({ ...editedContact, phone: rawPhoneNumber.slice(1, 11) });
  };

  const handleAddressChange = (newAddress) => {
    setEditedContact({ ...editedContact, address1: newAddress });
  };

  const handleEditClick = (field) => {
    setEditingField(field);
  };


  const formatPhoneNumber = (phoneNumber) => {
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
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
      paddingLeft: "10px",
      fontSize: "14px",
      fontWeight: '550',
      color: '#000000e8',
    }),
    control: (styles) => ({ ...styles, border: "unset", boxShadow: "unset", zIndex: "99999", borderColor: "unset", minHeight: "0" }),
    input: (styles) => ({ ...styles, margin: "0px", marginLeft: "123px" }),
    listbox: (styles) => ({ ...styles, zIndex: "99999", backGround: "hidden" }),
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
    placeholder: (provided, state) => ({
      ...provided,
      color: '#000000e8',
      marginLeft: "10px",
      fontSize: "14px",
      fontWeight: '500'

    })
  };

  useEffect(() => {
    getProfession()
  }, [editedContact.id]);

  const getProfession = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/profession`, { headers });
      const options = res.data.map((realtor) => ({
        value: realtor.id,
        label: realtor.name,
      }));
      setProfession(options)
      const dd = options.filter((cat) => cat.value == editedContact.profession_id);
      setSeletedProfession(dd)

      //set service require
      const setServicerequire = JSON.parse(editedContact.servceRequire).map(option => { return { value: option, label: option } })
      setSelectedServices(setServicerequire)
    } catch (error) {
      console.error("User creation failed:", error);
    }
  };

  const goBack = () => {
    navigate(`/contacts`);
  };


  const validateForm = () => {
    let isValid = true;
    setEditedContact({ ...editedContact, profession_id: seletedProfession.value, servceRequire: selectedServices });
    const { firstname, business_name, profession_id, email, phone } = editedContact;
    const trimmedFirstName = firstname?.trim();
    const trimmedBusinessname = business_name?.trim();
    const trimmedPhone = phone?.trim();
    const trimmedEmail = email?.trim();
    setErrors({
      firstname: "",
      business_name: "",
      profession_id: "",
      phone: "",
      email: ""
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

    //validate business Name
    if (!trimmedBusinessname) {
      setErrors(prevErrors => ({ ...prevErrors, business_name: "Business Name is Required" }));
      isValid = false;
    }
    if (!profession_id) {
      setErrors(prevErrors => ({ ...prevErrors, profession_id: "Please Select a profession" }));
      isValid = false;
    }

    if (isValid == false) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
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

  const handleSaveClick = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      console.log("error submit" , errors)
      handlescroll()
      return
    }

    const updatedData = {
      firstname: editedContact.firstname,
      business_name: editedContact.business_name,
      profession_id: editedContact.profession_id,
      phone: editedContact.phone,
      email: editedContact.email,
      address1: editedContact.address1,
      website: editedContact.website,
      servceRequire: editedContact.servceRequire,
      notes: editedContact.notes,
    }

    try {

      const response = await axios.put(`${url}api/contacts/${id}`, updatedData, {
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
                <input ref={errorScroll} name="firstname" value={editedContact?.firstname} onChange={handleChange} placeholder="First Name" />
                <span className="error-message">{errors.firstname}</span>
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
            <label>Email<span className="required-star">*</span></label>
            {editingField === "email" || editingField === "all" ? (
              <div className="edit-new-input">
                <input
                  name="email"
                  type="email"
                  value={editedContact?.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
                <span className="error-message">{errors.email}</span>
              </div>
            ) : (
              <div className="edit-new-input">
                {editedContact?.email}
                <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("email")} />
              </div>
            )}
          </div>
          {/* <div className="form-user-add-inner-wrap">
            <label>Profession</label>
            <div className="edit-new-input">
              <input
                type="text"
                name="profession"
                value={editedContact?.profession}
                onChange={handleChange}
              />
            </div>
          </div> */}
          <div className="form-user-add-inner-wrap">
            <label>Website</label>
            <div className="edit-new-input">
              <input
                type="text"
                name="website"
                value={editedContact?.website}
                onChange={handleChange}
              />
            </div>
          </div>
          <Places value={editedContact.address1} onChange={handleAddressChange} />
          <div className="add-contact-user-custom-wrapper">
            <div className="add-contact-user-custom-left">
              <div className="form-user-add-inner-wrap">
                <label>Phone<span className="required-star">*</span></label>
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
                    <span className="error-message">{errors.phone}</span>
                  </div>
                ) : (
                  <div className="edit-new-input">
                    {editedContact?.phone != undefined ? formatPhoneNumber(editedContact.phone) : ""}
                    <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("phone")} />
                  </div>
                )}
              </div>
              <div className="form-user-add-inner-wrap">
                <label>Business Name<span className="required-star">*</span></label>
                <div className="edit-new-input">
                  <input
                    type="text"
                    name="business_name"
                    value={editedContact?.business_name}
                    onChange={handleChange}
                  />
                  <span className="error-message">{errors.business_name}</span>
                </div>
              </div>
              <div className="form-user-add-inner-wrap  form-user-service-edit-contact">
                <label>Service Require</label>
                <Select
                  placeholder="   Select Service(s) Required..."
                  value={selectedServices}
                  onChange={(selectedOptions) => {
                    setSelectedServices(selectedOptions);
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
                <label>Profession<span className="required-star">*</span></label>
                <img src="/icons-form/Group30055.svg" />
                <Select
                  placeholder="Select Profession.."
                  value={seletedProfession}
                  onChange={(selectedOption) => {
                    setErrors({ profession_id: "" })
                    setEditedContact({ ...editedContact, profession_id: selectedOption.value })
                    setSeletedProfession(selectedOption)
                  }}
                  options={profession}
                  components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                  styles={colourStyles}
                  className="select-new"
                />
              </div>
              <span styles={{
                Bottom: '14px',
                color: 'red',
                fontSize: '12px',
                right: '10%',
                fontWeight: '500'
              }}>{errors.profession_id}</span>


              {/* <div className="form-user-add-inner-wrap  form-user-category-edit-contact">
                <label>Category<span className="required-star">*</span></label>

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

              </div> */}
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

      {/* <div className="parent">
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

 <div className="form-user-add-inner-wrap form-user-add-inner-wrap-btn">
<div className="top-bar-action-btns">
          <button style={{ background: "#004686" }} onClick={handleSaveAdditional}>
            Save
          </button>
         </div>
    </div>
          </div>
        </div>
      </div> */}

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
