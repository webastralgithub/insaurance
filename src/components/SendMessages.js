import React, { useState, useEffect, useContext, useRef } from "react";
import Select, { components } from "react-select";
import "./admin.css";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Message, toaster } from "rsuite";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useNavigate, useRouter } from "react-router-dom";

const CustomDropdown = ({ children, searchText, ...props }) => {
  const selectedOptions = props.getValue();

  const handleOptionClick = (option) => {
    const isSelected = selectedOptions.some(
      (selected) => selected.value === option.value
    );

    if (isSelected) {
      props.setValue(
        selectedOptions.filter((selected) => selected.value !== option.value)
      );
    } else {
      props.setValue([...selectedOptions, option]);
    }
  };

  const isOptionSelected = (option) => {
    return selectedOptions.some((selected) => selected.value === option.value);
  };

  const filteredOptions = props.options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div
      className="custom-dropdown"
      style={{
        maxHeight: "250px",
        minHeight: "250px",
        overflowY: "auto",
        background: "#fff",
        boxShadow: "none",
      }}
    >
      {/* Show selected options with radio buttons */}
      {filteredOptions.map((option) => (
        <div
          onClick={() => handleOptionClick(option)}
          key={option.value}
          className={`custom-option ${
            isOptionSelected(option) ? "selected" : ""
          }`}
          style={{
            backgroundColor: isOptionSelected(option)
              ? "rgb(0 70 134 / 8%)"
              : "",
          }}
        >
          <label htmlFor={option.value}>{option.label}</label>
          <div className="circle"></div>
        </div>
      ))}

      {/* Show available options */}
      {React.cloneElement(children, { ...props })}
    </div>
  );
};

const SendMessage = ({ role }) => {
  const selectRef = useRef(null);
  const [contacts, setContacts] = useState([]);

  const [parentid, setParentId] = useState();
  const navigate = useNavigate();
  const [parentView, setParentView] = useState(false);
  const [parentName, setParentName] = useState([]);
  const [id, setId] = useState(0);
  const [contactOptions, setContactoptions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [seletedCategory, setSelectedCategory] = useState(null);
  const [modalMode, setModalMode] = useState("");
  const [users, setUsers] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewState, setViewState] = useState("contacts");
  const [currentPage, setCurrentPage] = useState(1);
  const [width, setWidth] = useState(window.innerWidth);
  const { auth, property, setProperty, setAuth } = useContext(AuthContext);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [message, setMessage] = useState("");

  const handleContactChange = (selectedOptions) => {
    setSelectedContacts(selectedOptions);
  };
  const closeModal = () => {
    setSelectedContacts(null);
    setIsOpen(false);
  };
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };
  
  const handleSendMessage = async () => {
    if (selectedContacts.length === 0) {
      toast.error("Please select at least one contact.");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    const phoneNumbers = selectedContacts.map((contact) => contact.phone);

    try {
      const contacts = selectedContacts
        .map((contact) => contact.label)
        .join(", ");

      const response = await axios.post(
        `${url}api/send-message`,
        {
          selectedContacts: selectedContacts, 
          phoneNumbers: phoneNumbers,
          message: message,
        },
        { headers }
      );
      console.log(response, "response");
      toast.success("Message sent successfully to: " + contacts);
    } catch (error) {
      toast.error("Failed to send message.");
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);
  useEffect(() => {
    if (selectRef.current) {
      const valueContainer = selectRef?.current?.controlRef.firstChild;
      if (valueContainer) {
        valueContainer.scrollTo({
          left: valueContainer.scrollWidth,
          behavior: "smooth",
        });
      }
    }
  }, [selectedContacts]);

  const colourStyles = {
    valueContainer: (styles) => ({
      ...styles,
      overflowX: "auto",
      flex: "unset",
      flexWrap: "no-wrap",
      width: selectedContacts.length > 0 ? "354px" : "100%",
      padding: "2px 0",
      "&::-webkit-scrollbar-track": {
        "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.3)",
        "border-radius": "10px",
        "background-color": "rgb(0 70 134)",
      },
      "&::-webkit-scrollbar": {
        height: "8px",
        "background-color": "rgb(0 70 134)",
      },
      "&::-webkit-scrollbar-thumb": {
        "border-radius": "10px",
        "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,.3)",
        "background-color": "#373a47",
      },
    }),
    menu: (styles) => ({
      ...styles,
      maxHeight: "242px",
      minHeight: "242px",
      overflowY: "auto",
      boxShadow: "none",
    }),
    menuList: (styles) => ({ ...styles, overflowY: "none", display: "none" }),
    multiValue: (styles) => ({ ...styles, minWidth: "unset" }),
    input: (styles) => ({ ...styles, color: "#fff" }),
    placeholder: (styles) => ({ ...styles, color: "#fff" }),
    control: (styles) => ({
      ...styles,
      boxShadow: "unset",
      borderColor: "unset",
      minHeight: "0",
      border: "none",
      borderRadius: "0",
      background:
        "linear-gradient(240deg, rgba(0,72,137,1) 0%, rgba(0,7,44,1) 100%)",
      padding: "10px 5px",
    }),

    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
      };
    },
  };

  const getContacts = async () => {
    try {
      const response = await axios.get(`${url}api/contacts/get`, { headers });
      const contactsWithoutParentId = response.data.filter(
        (contact) => contact.parentId === null
      );
      const nonvendorcontacts = contactsWithoutParentId.filter(
        (contact) => contact.isVendor === false
      );
      const contactsWithoutParentIdandlead = nonvendorcontacts.filter(
        (contact) => contact.isLead === false
      );

      const realtorOptions = contactsWithoutParentIdandlead.map((realtor) => ({
        value: realtor.id,
        label: realtor.firstname,
        phone: realtor.phone,
      }));
      setContactoptions(realtorOptions);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getContacts();
  }, []);

  const PlaceholderWithIcon = (props) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span>{props.children}</span>{" "}
      <img
        style={{ width: "17px", filter: "brightness(4.5)" }}
        src="/search.svg"
      />
    </div>
  );

  return (
    <div className="form-user-add">
      <div className="property_header header-with-back-btn">
        <h3>{parentView ? `${parentName} Family ` : "Send SMS"}</h3>
 

        <div className="top-bar-action-btns">
                <button onClick={handleSendMessage}>
                  Send SMS
                </button>
        </div>
      </div>

      <div className="form-user-add-wrapper">
        <div className="todo-section">
          <div className="todo-main-section todo-notes-section-new-left">
            <div className="modal-roles-add convert-lead-pop-up-content pop-up-content-category">
              <img className="close-modal-share" src="/plus.svg" />
              <form>
                <h3 className="heading-category">Select Contact(s) </h3>
                <span className="share-contact-comment"></span>
                {error && <p className="error-category">{error}</p>}
                <Select
                  placeholder={
                    <PlaceholderWithIcon>
                      Select Contacts...
                    </PlaceholderWithIcon>
                  }
                  ref={selectRef}
                  value={selectedContacts}
                  menuIsOpen={true}
                  onChange={(selectedOptions) => {
                    setSelectedContacts(selectedOptions);
                  }}
                  onInputChange={(input) => setSearchText(input)}
                  options={contactOptions}
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                    Menu: (props) => (
                      <CustomDropdown searchText={searchText} {...props} />
                    ),
                  }}
                  styles={colourStyles}
                  className="select-new"
                  isMulti // This is what enables multiple selections
                />
              </form>
            </div>
          </div>

          <div className="todo-notes-section todo-notes-section-new-right">
            <div className="camp-gap">
              <CKEditor
                editor={ClassicEditor}
                config={{
                  toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "link",
                    "|",
                    "bulletedList",
                    "numberedList",
                    "|",
                    "undo",
                    "redo",
                  ],
                  placeholder: "Enter your message here...",
                }}
                className="custom-ckeditor"
                style={{ width: "100%" }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setMessage(data);
                }}
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMessage;
