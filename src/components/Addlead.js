import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import { AuthContext } from "./context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import InputMask from 'react-input-mask';
import Places from "./Places";
import { toast } from "react-toastify";
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

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

const AddLead = ({ user }) => {
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL;
  const { auth, leadlength, setLeadlength, contactlength, setConatctlength } = useContext(AuthContext);
  const headers = { Authorization: auth.token };
  const [phoneError, setPhoneError] = useState("");
  const [selectedSource, setSelectedSource] = useState(null);
  const [categories, setCategories] = useState([])
  const [seletedCategory, setSelectedCategory] = useState([]);
  const [profession, setProfession] = useState([])
  const [seletedProfession, setSeletedProfession] = useState([])
  const containerRef = useRef(null);
  const [isAlreadyContact, setIsAlreadyContact] = useState(0)



  const [contact, setContact] = useState({
    firstname: "",
    business_name: "",
    profession_id: '',
    phone: "",
    email: "",
    address1: "",
    category: "",
    source: "",
    isLead: true,
    isContact: true,
    createdBy: user,
    realtorId: null,
    propertyId: null
  });

  const [errors, setErrors] = useState({
    firstname: "",
    business_name: "",
    profession_id: "",
    email: "",
    phone: "",
    category: ""
  });
  
  const sourceOptions = [
    { value: "Website", label: "Website" },
    { value: "Email Campaign", label: "Email Campaign" },
    { value: "Social Media Campaign", label: "Social Media Campaign" },
    { value: "Manual", label: "Manual" },
    { value: "Referral Exchange", label: "Referral Exchange" },
    { value: "Phone", label: "Phone" },
    { value: "Others", label: "Others" },
  ]

  const handlePhoneNumberChange = (event) => {
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");
    setPhoneError("")
    setContact({ ...contact, phone: rawPhoneNumber.slice(1, 11) });
  }

  const colourStyles = {
    valueContainer: (provided, state) => ({
      ...provided,
      paddingLeft: "0px",
      fontSize: "14px",
      fontWeight: '550',
      color: '#000000e8',
    }),
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
    placeholder: (provided, state) => ({
      ...provided,
      color: '#000000e8',
      marginLeft: "25px",
      fontSize: "14px",
      fontWeight: '500'
    })
  };

  useEffect(() => {
    getCategories()
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
      setCategories(options)
    } catch (error) {
      console.error("User creation failed:", error);
    }
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

    let updatedData = seletedCategory.length && seletedCategory?.map((e) => e.value)
    setContact({ ...contact, firstname: contactName, profession_id: seletedProfession.value, category: updatedData });
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
      email: "",
      category: ""
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      handlescroll()
      return
    }
    try {
      if (isAlreadyContact === 0) {

        const response = await axios.post(`${url}api/leads`, contact, { headers });
        if (response.status === 201) {
          toast.success("Lead added Sucessfuly", { autoClose: 2000, position: toast.POSITION.TOP_RIGHT })
          setConatctlength(contactlength + 1)
          setLeadlength(leadlength + 1)
          navigate(-1);
        } else if (response.status === 200) {
          toast.error(response.data.message, {
            autoClose: 2000,
            position: toast.POSITION.TOP_RIGHT
          })
        }
        else {
          console.error("Failed to add contact");
        }
      }

      if (isAlreadyContact === 1) {
        const response = await axios.put(`${url}api/contacts/${contact.id}`, contact, { headers })
        if (response.status === 200) {
          toast.success("Lead added Sucessfuly", { autoClose: 2000, position: toast.POSITION.TOP_RIGHT })
          setLeadlength(leadlength + 1)
          navigate(-1);
        } else if (response.data.status === false) {
          toast.error(response.data.message)
        }
        else {
          console.error("Failed to add contact");
        }
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
    setContact({ ...contact, address1: newAddress });
  };


  const handleChange = (e) => {
    setssearch(2)
    setSearchContacts([])
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ""
    }));
  };

  const goBack = (e) => {
    e.preventDefault()
    navigate(-1);
  };

  const [contactName, setContactname] = useState("")
  const debouncedSearchQuery = useDebounce(contactName, 1000);
  const [ssearch, setssearch] = useState(1)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchContacts, setSearchContacts] = useState([])


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
  const handleSearchChange = (e) => {
    setContact({ ...contact, firstname: e.target.value });
    setContactname(e.target.value)
    setErrors({ firstname: "" })
    setssearch(1)
    setSeletedProfession([])
    setSelectedCategory([])
  }


  const handleSelect = async (item, id, source, category) => {
    setIsAlreadyContact(1)
    setssearch(2)
    setContactname(item.firstname)
    setContact(item)
    setSearchContacts([])

    //pre-selected profession of user if exists
    const matchedprofession = profession.find(insurance => insurance.value === id);
    setSeletedProfession(matchedprofession)

    // pre-selected categories of user if exists
    const valuesToFind = category.split(',').map(Number);
    let seletctedOptions = categories?.filter((item => valuesToFind.includes(item.value)))
    setSelectedCategory(seletctedOptions)

    //pre-selected source of user if exists
    let sourceData = sourceOptions.filter(element => element.value === source)
    setSelectedSource(sourceData)

  }

  useEffect(() => {
    if (ssearch === 1 && contactName) {
      getSearchContact()
    } else {
      setSearchContacts([])
    }

  }, [debouncedSearchQuery, currentPage])

  return (
    <form onSubmit={handleSubmit} className="form-user-add form-add-lead leads-add-lead-form">
      <div className="property_header header-with-back-btn">

        <h3> <button type="button" ref={errorScroll} className="back-only-btn" onClick={goBack}> <img src="/back.svg" /></button>Add Lead</h3>

        <div className="top-bar-action-btns">
          {/* <button type="submit" style={{background:"#004686"}} >Save</button> */}
        </div>
      </div>
      <div className="form-user-add-wrapper">


        <div className="form-user-add-inner-wrap">
          <label>Name <span className="required-star">*</span></label>
          <input

            type="text"
            name="firstname"
            value={contact.firstname}
            onChange={handleSearchChange}
          />
          <span className="error-message">{errors.firstname}</span>
        </div>
        <div className="form-user-add-inner-wrap">
          <label>Business Name <span className="required-star">*</span></label>
          <input

            type="text"
            name="business_name"
            value={contact.business_name}
            onChange={handleChange}
          />
          <span className="error-message">{errors.business_name}</span>
        </div>

        {loading === true ? <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
          <CircularProgress color="inherit" />
        </Stack> : <>      {searchContacts.length > 0 &&
          <div className="scroll-for-contacts-search clone-select-type add-lead-contact-dropdown" ref={containerRef}>

            {searchContacts && searchContacts?.map((item) => (
              <div key={item.id} >
                <p onClick={() => handleSelect(item, item?.profession_id, item.source, item.category)}>{item.firstname}</p>
              </div>
            ))}
          </div>
        }
        </>}

        <div className="form-user-add-inner-wrap">
          <label>Email Id<span className="required-star">*</span></label>
          <input
            type="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
          />
          <span className="error-message">{errors.email}</span>
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

        <div className="form-user-add-inner-wrap">
          <label>Profession<span className="required-star">*</span></label>
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
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null
            }}
            styles={colourStyles}
            className="select-new"
          />
        </div>
        <span className="error-message" style={{ color: "red" }}>{errors.profession_id}</span>


        {/* <div className="form-user-add-inner-wrap">
          <label>Profession</label>
          <input
            type="text"
            name="profession"
            value={contact.profession}
            onChange={handleChange}
          />

        </div> */}

        {/* <div className="form-user-add-inner-wrap">
          <label>Address 2</label>
          <input
            type="text"
            name="address2"
            value={contact.address2}
            onChange={handleChange}
          />
        </div> */}


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



        {/* <div className="form-user-add-inner-wrap form-user-add-inner-wrap-users" style={{position:"relative", zIndex:"99"}}>
          <label>Users</label>
          <img src="/icons-form/Group30055.svg"/>
          <Select
            placeholder="Select Users..."
            value={selectedRealtor}
            onChange={(selectedOption) => 
                {
                    setContact({ ...contact, realtorId: selectedOption.value })
                    setSelectedRealtor(selectedOption)}}
            options={realtorOptions}
            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
            styles={colourStyles}
            className="select-new"
            
          />
  
        </div> */}

        {/* <div className="form-user-add-inner-wrap form-user-add-inner-wrap-add-lead-agent">
          <label>Active Agent</label>
          <img src="/icons-form/Group30055.svg"/>
          <Select
            placeholder="Select Active Agent..."
            value={selectedAgent}
            className= "select-new add-lead-select-tab"
            onChange={(selectedOption) => 
                {
                    setContact({ ...contact, agentId: selectedOption.value })
                    setSelectedAgent(selectedOption)}}
            options={realtorOptions}
            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
            styles={colourStyles}
            // className="select-new"
            
          />
  
        </div> */}

        <div className="form-user-add-inner-wrap form-user-add-inner-wrap-add-lead-source">
          <label>Source</label>
          <img src="/icons-form/Group30055.svg" />
          <Select
            placeholder="Select Active Agent..."
            value={selectedSource}
            onChange={(selectedOption) => {

              setContact({ ...contact, source: selectedOption.value })
              setSelectedSource(selectedOption)
            }}
            options={sourceOptions}
            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
            styles={colourStyles}
            className="select-new"
          />

        </div>

        <div className="form-user-add-inner-wrap form-user-add-inner-wrap-add-lead-category ">
          <label>Category<span className="required-star">*</span></label>
          <img src="/icons-form/Group30055.svg" />
          <Select
            placeholder="Select Category.."

            value={seletedCategory}
            isMulti={true}
            onChange={(selectedOption) => {
              setErrors({ category: "" })
              setContact({ ...contact, category: selectedOption.map((e) => e.value) })
              setSelectedCategory(selectedOption)
              setErrors({ category: "" })
            }}
            options={categories}
            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
            styles={colourStyles}
            className="select-new"
            closeMenuOnSelect={false}
          />
        </div>
      </div>
      <span className="error-message" style={{ color: "red" }}>{errors.category}</span>
      <div className="form-user-add-inner-btm-btn-wrap">

        <button type="submit" >Save</button>
      </div>
    </form>

  );
};

export default AddLead;
