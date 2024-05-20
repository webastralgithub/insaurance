import React, { useState, useEffect, useContext } from "react";
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

const EditLeads = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL;
  const headers = {
    Authorization: auth.token,
  };

  const [editedContact, setEditedContact] = useState({});
  const [realtorOptions, setRealtorOptions] = useState([]);
  const [selectedRealtor, setSelectedRealtor] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("")
  const [selectedSource, setSelectedSource] = useState(null);
  const [listingOptions, setListingOptions] = useState(null)
  const [areaOptions, setAreaOptions] = useState(null)
  const [budgetOption, setBudgetOptions] = useState(null)
  const [traitOption, setTraitOptions] = useState(null)
  const [categories, setCategories] = useState([])
  const [seletedCategory, setSelectedCategory] = useState(null);
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
  ]
  const handleEditClick = (field) => {
    setEditingField(field);
  };
  const selectListingOptions = [
    noSelectionOption,
    { value: 'Never', label: 'Never' },
    { value: 'First-time', label: 'First-time' },
    { value: 'Homeowner', label: 'Homeowner' },
    { value: 'Experienced', label: 'Experienced' },
    { value: 'HomeBuyerInvestor', label: 'Home Buyer / Investor' },
  ];
  const selectTraitOptions = [
    noSelectionOption,
    { value: "lot_size", label: "Lot size" },
    { value: "privacy", label: "Privacy" },
    { value: "affordability", label: "Affordability" },
    { value: "future_value", label: "Future value" },
    { value: "other", label: "Other" },
  ];

  const selectAreaOptions = [
    noSelectionOption,
    { value: 'Surrey', label: 'Surrey' },
    { value: 'Richmond', label: 'Richmond' },
    { value: 'Langley', label: 'Langley' },
    { value: 'Cloverdale', label: 'Cloverdale' },
    { value: 'SouthSurreyWhiteRock', label: 'South Surrey / White Rock' },
    { value: 'Other', label: 'Other' },
  ];
  const selectBudgetOptions = [
    noSelectionOption,
    { value: '$1,000,000', label: '$1,000,000' },
    { value: '$1,000,000 - $2,000,000', label: '$1,000,000 - $2,000,000' },
    { value: '>$2,000,000', label: '>$2,000,000' },

  ];
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
    getContactDetails();
    getRealtorOptions();
    getCategories()
  }, [id]);
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
  const getContactDetails = async () => {
    try {
      const response = await axios.get(`${url}api/contacts/get/${id}`, {
        headers,
      });
      const contactDetails = response.data;
      setEditedContact(contactDetails);
      if (contactDetails.realtor) {
        setSelectedRealtor({
          value: contactDetails.realtor.id,
          label: contactDetails.realtor.name,
        })
      }
      if (contactDetails.listingOptions) {
        const listingValue = contactDetails.listingOptions;

        // Find the corresponding label in selectTraitOptions
        const matchedOption = selectListingOptions.find(option => option.value === listingValue);

        // Initialize the label based on the matched option or use an empty string as a default
        const initialLabel = matchedOption ? matchedOption.label : '';
        setListingOptions({
          label: listingValue,
          value: initialLabel
        })
      }
      if (contactDetails.areaOptions) {

        const areaValue = contactDetails.areaOptions;

        // Find the corresponding label in selectTraitOptions
        const matchedOption = selectAreaOptions.find(option => option.value === areaValue);

        // Initialize the label based on the matched option or use an empty string as a default
        const initialLabel = matchedOption ? matchedOption.label : '';
        setAreaOptions({
          value: areaValue,
          label: initialLabel,
        })

      }
      if (contactDetails.trait) {


        const traitValue = contactDetails.trait;

        // Find the corresponding label in selectTraitOptions
        const matchedOption = selectTraitOptions.find(option => option.value === traitValue);

        // Initialize the label based on the matched option or use an empty string as a default
        const initialLabel = matchedOption ? matchedOption.label : '';

        setTraitOptions({
          value: traitValue,
          label: initialLabel,
        })

      }
      if (contactDetails.budget) {
        const budgetValue = contactDetails.budget;

        // Find the corresponding label in selectTraitOptions
        const matchedOption = selectBudgetOptions.find(option => option.value === budgetValue);

        // Initialize the label based on the matched option or use an empty string as a default
        const initialLabel = matchedOption ? matchedOption.label : '';
        setBudgetOptions({
          value: budgetValue,
          label: initialLabel,
        })

      }
      if (contactDetails.activeAgent) {
        setSelectedAgent({
          value: contactDetails.activeAgent.id,
          label: contactDetails.activeAgent.name,
        })
      }
      if (contactDetails.category) {

        setSelectedCategory({
          value: contactDetails.category.id,
          label: contactDetails.category.name,
        })
      }
      if (contactDetails?.source) {

        setSelectedSource({
          label: contactDetails?.source,
          value: contactDetails?.source
        })
      }




    } catch (error) {
      console.error("Error fetching contact details: ", error);
    }
  };
  const handlePhoneNumberChange = (event) => {
    // Extract the raw phone number from the input
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");
    setPhoneError("")
    // Update the phone number state with the raw input
    setEditedContact({ ...editedContact, phone: rawPhoneNumber.slice(1, 11) });
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
            contact = { ...editedContact }
          }
        }


        const response = await axios.put(`${url}api/contacts/update/${id}`, contact, {
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
          <label>Email</label>
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
        <div className="form-user-add-inner-wrap form-user-add-inner-wrap-profession">
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
        {/* <div className="form-user-add-inner-wrap form-user-add-inner-wrap-messgae">
          <label>Message</label>
          <div className="edit-new-input">
            <input name="message" defaultValue={editedContact.message} onChange={handleChange} />
          </div>
        </div> */}


        {/* <div className="form-user-add-inner-wrap form-user-add-inner-wrap-user-edit-lead-pg">
          <label>User</label>
          {editingField === "realtorId" || editingField === "all" ? (
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
            <div className="edit-new-input">
              {selectedRealtor?.label}
              <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("realtorId")} />
            </div>
          )}
        </div> */}

        {/* <div className="form-user-add-inner-wrap form-user-add-inner-wrap-agent">
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
            <div className="edit-new-input">
              {selectedAgent?.label}
              <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("agentId")} />
            </div>
          )}
        </div> */}

        <div className="form-user-add-inner-wrap form-user-add-inner-wrap-phone">
          <label>Phone</label>
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
