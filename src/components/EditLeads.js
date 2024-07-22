import React, { useState, useEffect, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import { faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import InputMask from "react-input-mask";
import Places from "./Places";

const EditLeads = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const location = useLocation();
  const { data } = location.state;
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL;
  const headers = {
    Authorization: auth.token,
  };

  const [profession, setProfession] = useState([])
  const [categories, setCategories] = useState([])
  const [editedContact, setEditedContact] = useState(data);
  const [errors, setErrors] = useState({
    firstname: "",
    business_name: "",
    profession_id: "",
    email: "",
    phone: "",
    category: ""
  });

  const [seletedCategory, setSelectedCategory] = useState();
  const [seletedProfession, setSeletedProfession] = useState()
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("")
  const [selectedSource, setSelectedSource] = useState(null);
  const [categoryError, setCategoryError] = useState("")
  const [professionError, setProfessionError] = useState("")

  const [firstError, setFirstError] = useState("");
  const [editingField, setEditingField] = useState('all');
  const noSelectionOption = { value: null, label: 'No Selection' };
  const handleChange = (e) => {
    setErrors({
      firstname: "",
      business_name: "",
      email: "",
    });
    const { name, value } = e.target;
    setEditedContact({ ...editedContact, [name]: value });
  };


  const sourceOptions = [
    { value: "Website", label: "Website" },
    { value: "Email Campaign", label: "Email Campaign" },
    { value: "Social Media Campaign", label: "Social Media Campaign" },
    { value: "Manual", label: "Manual" },
    { value: "Referral Exchange", label: "Referral Exchange" },
    { value: "Phone", label: "Phone" },
    { value: "Others", label: "Others" },
    { value: "Landing Page", label: "Landing Page" },
    { value: "Linkedin", label: "Linkedin" },
    { value: "Instagram", label: "Instagram" },
    { value: "Facebook", label: "Facebook" },
  ]


  const handleEditClick = (field) => {
    setEditingField(field);
  };


  const validateEmail = (email) => {
    // Define a regular expression pattern for email validation.
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailPattern.test(email);
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) {
      return ""
    }

    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  };
  const handleAddressChange = (newAddress) => {

    setEditedContact({ ...editedContact, address1: newAddress });
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

  const colourStyles = {
    valueContainer: (provided, state) => ({
      ...provided,
      paddingLeft: "0px",
      fontSize: "14px",
      fontWeight: '550',
      color: '#000000e8',
    }),
    control: (styles) => ({ ...styles, border: "unset", boxShadow: "unset", borderColor: "unset", minHeight: "0" }),
    input: (styles) => ({ ...styles, margin: "0px" }),
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
    placeholder: (provided, state) => ({
      ...provided,
      color: '#000000e8',
      marginLeft: "25px",
      fontSize: "14px",
      fontWeight: '500'
    })
  };

  useEffect(() => {
    // getContactDetails();
    getCategories()
    getProfession()
  }, [id]);

  const getProfession = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/profession`, { headers });
      const options = res.data.map((realtor) => ({
        value: realtor.id,
        label: realtor.name,
      }));

      const matchedprofession = options.find(insurance => insurance.value === data.profession_id);
      setSeletedProfession(matchedprofession)
      setProfession(options)

      let selectedSourceOptions = sourceOptions?.filter(item => item.value === data?.source)
      setSelectedSource(selectedSourceOptions)

    } catch (error) {
      console.error(error);
    }
  };

  const getCategories = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/categories`, { headers });
      const options = res.data.map((realtor) => ({
        value: realtor.id,
        label: realtor.name,
      }));

      //change to array from string
      const valuesToFind = data.category.split(',').map(Number);
      //compare 2 arrays anf save similar values

      let seletctedOptions = options?.filter((item => valuesToFind.includes(item.value)))
      setSelectedCategory(seletctedOptions)
      setCategories([noSelectionOption, ...options])

    } catch (error) {
      console.error("User creation failed:", error);
    }
  };


  const handlePhoneNumberChange = (event) => {
    setErrors({ phone: "" });
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");
    setEditedContact({ ...editedContact, phone: rawPhoneNumber.slice(1, 11) });
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


  const validateForm = () => {
    let isValid = true;

    let updatedData = seletedCategory?.length && seletedCategory?.map((e) => e.value)
    setEditedContact({ ...editedContact, profession_id: seletedProfession.value, category: updatedData });
    const { firstname, business_name, profession_id, email, phone, category } = editedContact;

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
      email: "",
      category: "",
      selectedSource : ''
    });

    if (!trimmedFirstName) {
      setErrors(prevErrors => ({ ...prevErrors, firstname: "Name is required" }));
      isValid = false;
    }
    if (!trimmedBusinessname) {
      setErrors(prevErrors => ({ ...prevErrors, business_name: "Business Name is required" }));
      isValid = false;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrors(prevErrors => ({ ...prevErrors, email: "Invalid email" }));
      isValid = false;
    }

    if(!editedContact.source){
      setErrors(prevErrors => ({ ...prevErrors, selectedSource: "Please Select a Source" }));
      isValid = false;
    }
    if (!profession_id) {
      setErrors(prevErrors => ({ ...prevErrors, profession_id: "Please Select a Profession" }));
      isValid = false;
    }

    if (!trimmedPhone || !/^\d+$/.test(trimmedPhone) || phone.length != 10) {
      setErrors(prevErrors => ({ ...prevErrors, phone: "Invalid phone number" }));
      isValid = false;
    }
    if (!seletedCategory || seletedCategory.length == 0) {
      setErrors(prevErrors => ({ ...prevErrors, category: "Please Select a category" }));
      isValid = false;
    }
    if (!isValid) {
      window.scrollTo(0, 0);
    }
    return isValid;
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      handlescroll()
      return
    }
   
    let newContact = {
      firstname: editedContact.firstname,
      business_name : editedContact.business_name ,
      email: editedContact.email,
      address1: editedContact.address1,
      source:editedContact.source,
      phone: editedContact.phone,
      category: seletedCategory?.length && seletedCategory?.map((e) => e.value) ,
      profession_id: editedContact.profession_id,

    }
 
      try {
        const response = await axios.put(`${url}api/leads/${id}`, newContact, {
          headers,
        });

        if (response.status === 200) {
          toast.success("Lead updated successfully", {
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

  const goBack = () => {
    navigate(`/leads`);
  };


  return (
    <div className="form-user-add">
      <div>
        <div className="property_header">
          <h3 ref={errorScroll}>
            {" "}
            <button type="button" className="back-only-btn" onClick={goBack}>
              {" "}
              <img src="/back.svg" />
            </button>{" "}
            Edit Lead
          </h3>
          {/* <div className="top-bar-action-btns">
            <button style={{ background: "#004686" }} onClick={handleSaveClick}>
              Save
            </button>
          </div> */}
        </div>
      </div>


      <div className="form-user-edit-inner-wrap form-user-add-wrapper form-user-add-wrapper-lead-form">
        <div className="form-user-add-inner-wrap form-user-add-inner-wrap-name">
          <label>Name<span className="required-star">*</span></label>
          <div className="edit-new-input">
            <input name="firstname" value={editedContact.firstname} onChange={handleChange} placeholder="Name" />
            <span className="error-message">{errors.firstname}</span>
          </div>

        </div>

        <div className="form-user-add-inner-wrap form-user-add-inner-wrap-name">
          <label>Business Name<span className="required-star">*</span></label>
          <div className="edit-new-input">
            <input 
            name="business_name" 
            value={editedContact?.business_name}
             onChange={handleChange} 
             placeholder="Business Name" />
            <span className="error-message">{errors?.business_name}</span>
          </div>
        </div>



        <div className="form-user-add-inner-wrap form-user-add-inner-wrap-email">
          <label>Email<span className="required-star">*</span></label>
            <div className="edit-new-input">
              <input
                name="email"
                value={editedContact?.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <span className="error-message">{errors?.email}</span>
           </div> 
        </div>


        <Places value={editedContact?.address1} onChange={handleAddressChange} />


        <div className="form-user-add-inner-wrap">
          <label>Profession<span className="required-star">*</span></label>
          <img src="/icons-form/Group30055.svg" />
          <Select
            placeholder="Select Profession.."
            value={seletedProfession}
            onChange={(selectedOption) => {
              setEditedContact({ ...editedContact, profession_id: selectedOption.value })
              setSeletedProfession(selectedOption)
             setErrors({profession_id : ""})
            }}
            options={profession}
            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
            styles={colourStyles}
            className="select-new"
          />
        </div>
        <span className="error-message">{errors?.profession_id}</span>


        <div className="form-user-add-inner-wrap form-user-add-inner-wrap-phone">
          <label>Phone<span className="required-star">*</span></label>
         
            <div className="edit-new-input">
              <InputMask
                mask="+1 (999) 999-9999"
                type="text"
                name="phone"
                value={formatPhoneNumber(editedContact.phone)}
                onChange={handlePhoneNumberChange}
                placeholder="+1 (___) ___-____"
              />
              <span className="error-message">{errors?.phone}</span>
            </div>
        </div>

        <div className="form-user-add-inner-wrap form-user-add-inner-wrap-source">
          <label>Source</label>
          <Select
            placeholder="Select Active Agent..."
            value={selectedSource}
            onChange={(selectedOption) => {
              setEditedContact({ ...editedContact, source: selectedOption.value })
              setSelectedSource(selectedOption)
            }}
            options={sourceOptions}
            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
            styles={colourStyles}
            className="select-new"
          />
        </div>
        <span className="error-message" style={{ color: "red" }}>{errors?.selectedSource}</span>
        {/* <div className="form-user-add-inner-wrap form-user-add-inner-wrap-bought">
          <label>Have you bought a home before?</label>
          <Select
            placeholder="Have you bought a home before?"
            value={listingOptions}
            onChange={(selectedOption) => {

              setEditedContact({ ...editedContact, listingOptions: selectedOption.value });
              setListingOptions(selectedOption);
            }}
            options={selectListingOptions}
            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
            styles={colourStyles}
            className="select-new"
          />
        </div> */}

        {/* <div className="form-user-add-inner-wrap form-user-add-inner-wrap-interest">
          <label>Area Interested in?</label>
          <Select
            placeholder="Which area are you interested in?"
            value={areaOptions}
            onChange={(selectedOption) => {

              setEditedContact({ ...editedContact, areaOptions: selectedOption.value });
              setAreaOptions(selectedOption);
            }}
            options={selectAreaOptions}
            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
            styles={colourStyles}
            className="select-new"
          />
        </div> */}

        {/* <div className="form-user-add-inner-wrap form-user-add-inner-wrap-budget">
          <label>Budget?</label>
          <Select
            placeholder="What is your budget?"
            value={budgetOption}
            onChange={(selectedOption) => {

              setEditedContact({ ...editedContact, budget: selectedOption.value });
              setBudgetOptions(selectedOption);
            }}
            options={selectBudgetOptions}
            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
            styles={colourStyles}
            className="select-new"
          />
        </div> */}

        {/* <div className="form-user-add-inner-wrap form-user-add-inner-wrap-describe">
          <label>Desirable Trait?</label>
          <Select
            placeholder="Select Trait"
            value={traitOption}
            onChange={(selectedOption) => {
              setEditedContact({ ...editedContact, trait: selectedOption.value });
              setTraitOptions(selectedOption);
            }}
            options={selectTraitOptions}
            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
            styles={colourStyles}
            className="select-new"
          />
        </div> */}

        <div className="form-user-add-inner-wrap form-user-add-inner-wrap-category">
          <label>Category<span className="required-star">*</span></label>

          <Select
            placeholder="Select Category.."
            //defaultValue={matchedCategories}
            value={seletedCategory}
            isMulti
            onChange={(selectedOption) => {
              setEditedContact({ ...editedContact, category: selectedOption.value })
              setSelectedCategory(selectedOption)
              setErrors({ category: "" })
            }}
            options={categories}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null
            }}
            styles={colourStyles}
            className="select-new"

          />
        
        </div>
        <span className="error-message" style={{ color: "red" }}>{errors?.category}</span>

        <div className="form-user-add-inner-btm-btn-wrap">
          <button style={{ background: "#004686" }} onClick={handleSaveClick}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLeads;
