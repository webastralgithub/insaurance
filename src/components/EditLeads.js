import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
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
    const { name, value } = e.target;
    clearErrors(name)
    setEditedContact({ ...editedContact, [name]: value });
  };


  const sourceOptions = [
    noSelectionOption,
    { value: "Website", label: "Website" },
    { value: "Phone", label: "Phone" },
    { value: "Others", label: "Others" },
    { value: "Email Campaign", label: "Email Campaign" },
    { value: "Social Media Campaign", label: "Social Media Campaign" },
    { value: "Manual", label: "Manual" },
    { value: "Referral Exchange", label: "Referral Exchange" }
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



  const validateForm = () => {



    let isValid = true;

    if (!editedContact.firstname) {
      setFirstError("First Name is required");
      isValid = false;
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

    if (!seletedProfession) {
      setProfessionError("select Profession")
      isValid = false;
    }


    if (seletedCategory == 0) {
      setCategoryError("select category")
      isValid = false;
    }


    if (!isValid) {
      window.scrollTo(0, 0)
    }
    return isValid;
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
      paddingLeft: "0px"
    }),
    control: (styles) => ({ ...styles, border: "unset", boxShadow: "unset", borderColor: "unset", minHeight: "0" }),
    input: (styles) => ({ ...styles, margin: "0px" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
      };
    },
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
      console.error("User creation failed:", error);
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

  const getContactDetails = async () => {
    try {
      const response = await axios.get(`${url}api/contacts/${id}`, {
        headers,
      });
      const contactDetails = response.data;
      setEditedContact(contactDetails);
    } catch (error) {
      console.error("Error fetching contact details: ", error);
    }
  };
  const handlePhoneNumberChange = (event) => {
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");
    setPhoneError("")
    setEditedContact({ ...editedContact, phone: rawPhoneNumber.slice(1, 11) });
  };

  const handleSaveClick = async () => {

    let newContact = {
      firstname: editedContact.firstname,
      email: editedContact.email,
      address1: editedContact.address1,
      source: selectedSource.value,
      phone: editedContact.phone,
      category: seletedCategory.length && seletedCategory?.map((e) => e.value),
      profession_id: seletedProfession.value,
      isLead: true,
      isContact: true,
    }


    if (validateForm()) {
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
        console.error("An error occurred while updating the contact:", error);
      }
    }
  };

  const goBack = () => {
    navigate(`/leads`);
  };



  // useEffect(() => {
  //   if (editedContact && editedContact.category && Array.isArray(editedContact.category)) {
  //     const dd = profession.find((cat) => cat.value === editedContact.profession_id);
  //     const matchedCategories = categories.filter(category => editedContact.category.includes(category.value));
  //     setSeletedProfession(dd);
  //     setSelectedCategory(matchedCategories);
  //   }
  // }, [profession,categories, editedContact, data]);

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
            Edit Lead
          </h3>
          {/* <div className="top-bar-action-btns">
            <button style={{ background: "#004686" }} onClick={handleSaveClick}>
              Save
            </button>
          </div> */}
        </div>
      </div>


      <div className="form-user-edit-inner-wrap form-user-add-wrapper">
        <div className="form-user-add-inner-wrap form-user-add-inner-wrap-name">
          <label>Name<span className="required-star">*</span></label>
          <div className="edit-new-input">
            <input name="firstname" value={editedContact.firstname} onChange={handleChange} placeholder="Name" />
            <span className="error-message">{firstError}</span>
          </div>

        </div>


        <div className="form-user-add-inner-wrap form-user-add-inner-wrap-email">
          <label>Email<span className="required-star">*</span></label>
          {editingField === "email" || editingField === "all" ? (
            <div className="edit-new-input">
              <input
                name="email"
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
        <Places value={editedContact.address1} onChange={handleAddressChange} />


        <div className="form-user-add-inner-wrap">
          <label>Profession<span className="required-star">*</span></label>
          <img src="/icons-form/Group30055.svg" />
          <Select
            placeholder="Select Profession.."
            value={seletedProfession}
            onChange={(selectedOption) => {
              setEditedContact({ ...editedContact, profession: selectedOption.value })
              setSeletedProfession(selectedOption)
              setProfessionError("")
            }}
            options={profession}
            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
            styles={colourStyles}
            className="select-new"
          />
        </div>
        <span className="error-message">{professionError}</span>


        <div className="form-user-add-inner-wrap form-user-add-inner-wrap-phone">
          <label>Phone<span className="required-star">*</span></label>
          {editingField === "phone" || editingField === "all" ? (
            <div className="edit-new-input">
              <InputMask
                mask="+1 (999) 999-9999"
                type="text"
                name="phone"
                value={formatPhoneNumber(editedContact.phone)}
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
              setCategoryError("")
            }}
            options={categories}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null
            }}
            styles={colourStyles}
            className="select-new"

          />
          <span className="error-message">{categoryError}</span>
        </div>


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
