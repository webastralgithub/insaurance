import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import InputMask from 'react-input-mask';
import Places from "./Places";
import { toast } from "react-toastify";


const AddContact = ({ user }) => {
  const navigate = useNavigate();
  const { auth, setConatctlength, contactlength } = useContext(AuthContext);
  const url = process.env.REACT_APP_API_URL;
  const headers = { Authorization: auth.token };
  const [errors, setErrors] = useState({
    firstname: "",
    email: "",
    phone: "",
    category: ""
  });
  const [selectedServices, setSelectedServices] = useState([]);
  const [phoneError, setPhoneError] = useState("")


  const [profession, setProfession] = useState([])
  const [seletedProfession, setSeletedProfession] = useState([])
  const [categories, setCategories] = useState([])
  const [seletedCategory, setSelectedCategory] = useState(null);
  const [contact, setContact] = useState({
    firstname: "",
    lastname: "",
    email: "",
    
    profession_id : "",
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
    isContact: true,
    propertyId: null,
  });

  const serviceOptions = [
    { value: 'Real Estate', label: 'Real Estate' },
    { value: 'Mortgage', label: 'Mortgage' },
    { value: 'Insurance', label: 'Insurance' },
    { value: 'Immigration', label: 'Immigration' }
  ];



  const handlePhoneNumberChange = (event) => {
    setPhoneError("")
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");
    setContact({ ...contact, phone: rawPhoneNumber.slice(1, 11) });
  }

  const colourStyles = {
    control: styles => ({ ...styles, border: 'unset', boxShadow: "unset", borderColor: "unset", minHeight: "0" }),
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
  };



  useEffect(() => {
    getCategories()
    getProfession()
  }, []);

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
  const validateForm = () => {
    let isValid = true;
    const { firstname, email, phone } = contact;

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
    // if (!contact.category) {
    //   setErrors(prevErrors => ({ ...prevErrors, category: "Please Select a category" }));
    //   isValid = false;
    // }
    if (!contact.profession_id) {
      setErrors(prevErrors => ({ ...prevErrors, profession: "Please Select a profession" }));
      isValid = false;
    }

    if (!isValid) {
      window.scrollTo(0, 0);
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
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

  const goBack = () => {
    navigate(-1);
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


  return (
    <>
      <form onSubmit={handleSubmit} className="form-user-add add-contact-from-adst add-contact-form">
        <div className="property_header header-with-back-btn">
          <h3> <button type="button" className="back-only-btn" onClick={goBack}> <img src="/back.svg" /></button>Add Contact</h3>
        </div>

        <div className="add-cnt-form-desc">
          <div className="form-user-add-wrapper">
            <div className="form-user-add-inner-wrap">
              <label>Name<span className="required-star">*</span></label>
              <input
                type="text"
                name="firstname"
                value={contact.firstname}
                onChange={handleChange}
              />
              <span className="error-message">{errors.firstname}</span>
            </div>
            {/* <div className="form-user-add-inner-wrap">
          <label>Last Name</label>
          <input
            type="text"
            name="lastname"
            value={contact.lastname}
            onChange={handleChange}
            
          />
        </div>
      */}
            <div className="form-user-add-inner-wrap">
              <label>Email Id<span className="required-star">*</span></label>
              <input
                type="text"
                name="email"
                value={contact.email}
                onChange={handleChange}
              />
              <span className="error-message">{errors.email}</span>
            </div>
      



            <div className="form-user-add-inner-wrap">
              {/* <label>Profession</label>
              <div className="edit-new-input">
                <input
                  type="text"
                  name="profession"
                  value={contact.profession}
                  onChange={handleChange}
                />
              </div>  */}



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
            {/* <div className="form-user-add-inner-wrap">
          <label>Birth Date</label>
          <input
            type="date"
            name="birthDate"
            value={contact.birthDate}
            onChange={handleChange}
          /> 
        </div>*/}
            <Places value={contact.address1} onChange={handleAddressChange} />




            {/* <div className="form-user-add-inner-wrap">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={contact.city}
            onChange={handleChange}
          />
        </div> */}


            <div className="form-user-add-inner-wrap">
              <label>Phone<span className="required-star">*</span></label>
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
            <div className="form-user-add-inner-wrap">
              <label>Company Name</label>
              <div className="edit-new-input">
                <input
                  type="text"
                  name="company"
                  value={contact.company}
                  onChange={handleChange}
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
              <label>Profession<span className="required-star">*</span></label>
              <img src="/icons-form/Group30055.svg" />
              <Select
                placeholder="Select Profession.."
                value={seletedProfession}
                onChange={(selectedOption) => {
                  setContact({ ...contact, profession_id: selectedOption.value })
                  setSeletedProfession(selectedOption)
                }}
                options={profession}
                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                styles={colourStyles}
                className="select-new"
              />
            </div>
            <span className="error-message" style={{ color: "red" }}>{errors.profession}</span>

                {/* <div className="form-user-add-inner-wrap">
                  <label>Category<span className="required-star">*</span></label>
                  <img src="/icons-form/Group30055.svg" />
                  <Select
                    placeholder="Select Category.."
                    value={seletedCategory}
                    onChange={(selectedOption) => {
                      setContact({ ...contact, category: selectedOption.value })
                      setSelectedCategory(selectedOption)
                    }}
                    options={categories}
                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                    styles={colourStyles}
                    className="select-new"
                  />
                </div> */}
                {/* <span className="error-message" style={{ color: "red" }}>{errors.category}</span> */}
              </div>
            </div>

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
        <div className="form-user-add-inner-btm-btn-wrap">
          <button type="submit" >Save</button>
        </div>
      </form>
    </>
  );
};

export default AddContact;
