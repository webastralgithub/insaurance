import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import InputMask from 'react-input-mask';
import Places from "./Places";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";





const AddContact = ({ user }) => {
  const navigate = useNavigate();
  const errorScroll = useRef(null)
  const { auth, setConatctlength, contactlength } = useContext(AuthContext);
  const url = process.env.REACT_APP_API_URL;
  const headers = { Authorization: auth.token };

  const [selectedServices, setSelectedServices] = useState([]);
  const [phoneError, setPhoneError] = useState("")


  const [profession, setProfession] = useState([])
  const [seletedProfession, setSeletedProfession] = useState([])
  const [categories, setCategories] = useState([])

  const [contact, setContact] = useState({
    firstname: "",
    business_name: "",
    profession_id: "",
    phone: "",
    email: "",
    address1: "",
    company: "",
    website: "",
    servceRequire: selectedServices,
    notes: "",
    source: "",


    createdBy: user,
    realtorId: null,
    isContact: true,
    propertyId: null,
  });

  const [errors, setErrors] = useState({
    firstname: "",
    business_name: "",
    profession_id: "",
    email: "",
    phone: ""
  });

  const goBack = () => {
    navigate(-1);
  };

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
    listbox: (styles) => ({ ...styles, zIndex: "99999", }),

    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff', // semi-transparent black
        zIndex: 999999,
        backGround: "#fff",
        color: "#000",
        position: "relative",

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
  const serviceOptions = [
    { value: 'Real Estate', label: 'Real Estate' },
    { value: 'Mortgage', label: 'Mortgage' },
    { value: 'Insurance', label: 'Insurance' },
    { value: 'Immigration', label: 'Immigration' }
  ];

  const handlescroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    errorScroll.current.focus();
    errorScroll.current.scrollTop = 0;
  }

  useEffect(() => {
    getProfession()
  }, []);


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


  const handlePhoneNumberChange = (event) => {
    setErrors({ phone: "" })
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");
    setContact({ ...contact, phone: rawPhoneNumber.slice(1, 11) });
  }
  const handleAddressChange = (newAddress) => {
    setContact({ ...contact, address1: newAddress });
  };

  const handleChange = (e) => {
    setErrors({
      firstname: "",
      email: "",
      phone: "",
      category: ""
    })
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });
  };

  const validateForm = () => {
    let isValid = true;
    setContact({ ...contact, profession_id: seletedProfession.value });
    const { firstname, business_name, profession_id, email, phone } = contact;

    const trimmedFirstName = firstname.trim();
    const trimmedBusinessname = business_name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();


    // Reset errors
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      handlescroll()
      return
    }
    try {
      const response = await axios.post(`${url}api/contacts`, contact, {
        headers,
      });

      if (response.status === 201) {
        setConatctlength(contactlength + 1);
        navigate("/contacts");
        toast.success(' Contact added successfully', {
          autoClose: 2000,
          position: toast.POSITION.TOP_RIGHT
        });
      } else {
        toast.error(response.data.message, {
          autoClose: 2000,
          position: toast.POSITION.TOP_RIGHT
        })
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

  return (
    <>
      <div className="form-user-add">
        <div>
          <div className="property_header">
            <h3>
              {" "}
              <button type="button" className="back-only-btn" onClick={goBack}>
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

              <div className="edit-new-input">
                <input
                  ref={errorScroll}
                  type="text"
                  name="firstname"
                  value={contact.firstname}
                  onChange={handleChange}
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
                  value={contact.email}
                  onChange={handleChange}
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
                  value={contact.website}
                  onChange={handleChange}
                />
              </div>
            </div>



            <Places value={contact.address1} onChange={handleAddressChange} />

            <div className="add-contact-user-custom-wrapper">
              <div className="add-contact-user-custom-left">
                <div className="form-user-add-inner-wrap">
                  <label>Phone<span className="required-star">*</span></label>

                  <div className="edit-new-input">
                    <InputMask
                      mask="+1 (999) 999-9999"
                      type="text"
                      name="phone"
                      value={contact.phone}
                      onChange={handlePhoneNumberChange}
                      placeholder="+1 (___) ___-____"
                    />
                    <span className="error-message">{errors.phone}</span>
                  </div>

                </div>
                <div className="form-user-add-inner-wrap">
                  <label>Bussiness Name<span className="required-star">*</span></label>

                  <div className="edit-new-input">
                    <input
                      type="text"
                      name="business_name"
                      value={contact.business_name}
                      onChange={handleChange}
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
                      const selectedValues = selectedOptions.map(option => option.value);
                      setContact({ ...contact, servceRequire: selectedValues });
                    }}
                    options={serviceOptions}
                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                    styles={colourStyles}
                    className="select-new"
                    isMulti
                  />
                </div>

                <div className="form-user-add-inner-wrap">
                  <label>Profession<span className="required-star">*</span>       </label>
                  <img src="/icons-form/Group30055.svg" />
                  <Select
                    placeholder="Select Profession.."
                    value={seletedProfession}
                    onChange={(selectedOption) => {
                      setErrors({ profession_id: "" })
                      setContact({ ...contact, profession_id: selectedOption.value })
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
                }} >{errors.profession_id}</span>
              </div>

              <div className="add-contact-user-custom-right add-contact-user-custom-right-edit">
                <div className="form-user-add-inner-wrap">
                  <label>Description</label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={contact.notes}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setContact({ ...contact, notes: data });
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
        </div>

        <div className="form-user-add-inner-btm-btn-wrap">
          <button style={{ background: "#004686" }} onClick={handleSubmit}>
            Save
          </button>

        </div>

      </div >

    </>
  );
};

export default AddContact;
