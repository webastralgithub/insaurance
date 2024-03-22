import React, { useState, useEffect, useContext, useRef } from "react";
import Select, { components } from "react-select";
import "./admin.css";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Modal from "react-modal";
import { Modal as BootstrapModal, Button } from 'react-bootstrap';
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Message, toaster } from "rsuite";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useNavigate, useRouter } from "react-router-dom";


const CustomDropdown = ({ children, isGroupFormActive, searchText, getGroupContacts, contact, ...props }) => {

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
  const sayy = (id) => {
    console.log("hello")
  }
  const isOptionSelected = (option) => {
    return selectedOptions.some((selected) => selected.value === option.value);
  };

  const filteredOptions = props.options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const [displayContact, setDisplayContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => (true)

  const handlegetGroupContacts = (id) => {
    getGroupContacts(id);
    handleShow();
  };

  useEffect(() => {
    setDisplayContact(contact);
  }, [contact]);

  const isGroupForm = () => {
    return isGroupFormActive;
  };
  return (
    <>
      <div
        className="custom-dropdown"
        style={{
          // maxHeight: "250px",
          // minHeight: "250px",
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
            className={`custom-option ${isOptionSelected(option) ? "selected" : ""
              }`}
            style={{
              backgroundColor: isOptionSelected(option)
                ? "rgb(0 70 134 / 8%)"
                : "",
            }}
          >
            <label htmlFor={option.value} >{option.label}</label>

            {/* <button onClick={() => handlegetGroupContacts(option.value)}>Call</button> */}
            <div className="circle">
            </div>
          </div>
        ))}

        {/* Show available options */}
        {React.cloneElement(children, { ...props })}
      </div>
    </>
  );
};

const SendMessage = ({ role }) => {
  const selectRef = useRef(null);
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
  const [groupName, setGroupName] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [modalSearchText, setModalSearchText] = useState("");
  const [selectSearchText, setSelectSearchText] = useState("");



  const handleContactChange = (selectedOptions) => {
    setSelectedContacts(selectedOptions);
  };
  const closeModal = () => {
    setSelectedContacts([]);
    setGroupName('');
    setError('');
    setIsOpen(false);
  };
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  const addGroup = async () => {
    if (selectedContacts.length === 0) {
      toast.error("Please select at least one contact.");
      return;
    }
    if (!groupName.trim()) {
      toast.error("Please enter a group name.");
      return;
    }
    try {
      const response = await axios.post(
        `${url}api/group-message`,
        {
          selectedContacts: selectedContacts.map((option) => option.value),
          groupName,
          created_by: AuthContext.userId
        },
        {
          headers,
        }
      );

      if (response.status === 200) {
        toast.success("Group Added Successfully", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
        setGroupNames([...groupNames, response.data.group])

        setSelectedContacts();
        closeModal();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to add group.");
      }
    }
  };

  const handleSendMessage = async () => {
    if (selectedGroups.length === 0) {
      toast.error("Please select at least one group.");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }
    const sanitizedMessage = message.replace(/<[^>]*>/g, '');

    try {
      const contacts = selectedGroups
        .map((contact) => contact.label)
        .join(", ");

      const response = await axios.post(
        `${url}api/send-message`,
        {
          groupId: selectedGroups,
          message: sanitizedMessage,
        },
        { headers }
      );
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
  const handleChange = (selectedOptions) => {
    setSelectedGroups(selectedOptions);
    getGroupContacts()
  };

  const handleContactsChange = (selectedContacts) => {
    setSelectedContacts(selectedContacts)
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      overflow: "unset",
      padding: "0px",
      transform: "translate(-50%, -50%)",
      background: "rgb(255 255 255)",
    },
    overlay: {
      backgroundColor: "rgb(0 0 0 / 34%)",
      zIndex: "9",
    },
  };

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

  const [selectSearchGroup, setSelectSearchGroup] = useState('');
  const [groupContacts, setGroupContact] = useState([])
  const [showGroupContacts, setShowGroupContacts] = useState(false);
  const handleClose = () => setShowGroupContacts(false);
  const handleshow = () => setShowGroupContacts(true);

  const handleCheckboxChange = (group) => {
    const isSelected = selectedGroups.find(selectedGroup => selectedGroup.id === group.id);
    let updatedSelectedGroups;

    if (isSelected) {
      updatedSelectedGroups = selectedGroups.filter(selectedGroup => selectedGroup.id !== group.id);
    } else {
      updatedSelectedGroups = [...selectedGroups, group];
    }
    setSelectedGroups(updatedSelectedGroups);
    const selectedGroupNames = updatedSelectedGroups.map(selectedGroup => selectedGroup.group_name);
    setSelectSearchGroup(selectedGroupNames.join(', '));

    if (updatedSelectedGroups.length === 0) {
      fetchGroupNames(); // If no groups are selected, fetch all group names
    }
  };

  const handleSearchInputChange = (e) => {
    const searchString = e.target.value.toLowerCase();
    setSelectSearchGroup(searchString);

    if (searchString === '') {
      setSelectedGroups([]);
      fetchGroupNames(); // Resetting the list to show all groups
    } else {
      const filteredGroups = groupNames.filter(group => group.group_name.toLowerCase().includes(searchString));
      setGroupNames(filteredGroups);
    }

  };
  const getSingleContacts = (id) => {
    console.log("id", id)
  }
  const fetchGroupNames = async () => {
    try {
      const response = await fetch(`${url}api/group-names`, { headers });
      if (!response.ok) {
        throw new Error("Failed to fetch group names");
      }
      const data = await response.json();
      setGroupNames(data);
    } catch (error) {
      setError("Failed to fetch group names");
    }
  };
  const getGroupContacts = async (id) => {
    console.log(id)
    try {
      const response = await axios.get(`${url}api/group-contacts/${id}`, { headers });
      const res = await response.data;
      setGroupContact(res);
      handleshow();
      console.log("hello")
    } catch (error) {
      console.log("id data fetching error", error);
    }
  }
  useEffect(() => {
    fetchGroupNames();
  }, []);
  return (
    <>
      <div className="form-user-add">
        <div className="property_header header-with-back-btn">
          <h3>{parentView ? `${parentName} Family ` : "Send SMS"}</h3>

          <div className="top-bar-action-btns">
            <button onClick={() => setIsOpen(true)} >
              Add Group
            </button>
          </div>
        </div>

        <div className="form-user-add-wrapper">
          <div className="todo-section todo-sectionnew">
            <div className="todo-main-section todo-notes-section-new-left">
              <div className="modal-roles-add convert-lead-pop-up-content pop-up-content-category sms-list-form">
                <img className="close-modal-share" src="/plus.svg" />
                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                  style={customStyles}
                >
                  <div className="modal-roles-add convert-lead-pop-up-content pop-up-content-category">
                    <img
                      className="close-modal-share"
                      onClick={closeModal}
                      src="/plus.svg"
                    />
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        addGroup();
                      }}
                    >

                      <h3 className="heading-category">Add Group </h3>
                      {error && <p className="error-category">{error}</p>}
                      <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Group Name"
                      />
                      <Select
                        placeholder={
                          <PlaceholderWithIcon>Select Contacts...</PlaceholderWithIcon>
                        }
                        ref={selectRef}
                        value={selectedContacts}
                        menuIsOpen={true}
                        onChange={(selectedOptions) => {
                          setSelectedContacts(selectedOptions);

                        }}
                        onInputChange={(input) => setModalSearchText(input)}
                        options={contactOptions}
                        components={{
                          DropdownIndicator: () => null,
                          IndicatorSeparator: () => null,
                          Menu: (props) => (
                            <CustomDropdown searchText={modalSearchText} contact={getGroupContacts}  {...props} />
                          ),
                        }}
                        styles={colourStyles}
                        className="select-new"
                        isMulti
                      />
                      <div className="modal-convert-btns">
                        <button type="submit">Add Group</button>
                      </div>
                    </form>
                  </div>
                </Modal>
                <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                  {/* custom group form modification */}
                  <form>
                    <h3 class="heading-category">Select Group(s)</h3>
                    <div className="searchbar-grd">

  
                      <input type="text" placeholder="Search Group" value={selectSearchGroup} onChange={handleSearchInputChange} />
                   
                      {selectedGroups.length > 0 || selectSearchGroup.length > 0 ? (
        <button 
          type="button" 
          onClick={() => { 
            setSelectedGroups([]); 
            setSelectSearchGroup(''); 
            fetchGroupNames(); 
          }}
        >
          ×
        </button>
      ) : null}
                    </div>

                    {error && <p className="error-category">{error}</p>}
                    <ul class="custom-dropdown" style={{ "overflowY": 'auto', "overflowX": 'hidden', "background": 'rgb(255, 255, 255)', "boxShadow": 'none'}}>
                      {groupNames.map((group, index) => (
                        <li key={index}>
                          <label onClick={() => getGroupContacts(group.id)}>
                            {group.group_name}
                          </label>
                          <input
                            type="checkbox"
                            id={`group-${index}`}
                            value={group.id}
                            checked={selectedGroups.some(selectedGroup => selectedGroup.id === group.id)}
                            onChange={() => handleCheckboxChange(group)}
                          />
                        </li>

                      ))}
                    </ul>
                  </form>
                  {/* <form>
                  <h3 className="heading-category">Select Group(s) </h3>
                  <span className="share-contact-comment"></span>
                  {error && <p className="error-category">{error}</p>}
                  <Select
                    placeholder={<PlaceholderWithIcon>Select Group...</PlaceholderWithIcon>}
                    options={groupNames?.map((groupName) => ({
                      value: groupName.id,
                      label: groupName.group_name,

                    }))}
                    isMulti
                    value={selectedGroups}
                    onChange={handleChange}
                    components={{

                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,

                      Menu: (props) => (
                        <CustomDropdown
                          searchText={selectSearchText}
                          options={groupNames}
                          selectedOptions={selectedGroups}
                          setSelectedOptions={setSelectedGroups}
                          {...props}
                          getGroupContacts={getGroupContacts}
                          contact={contact}
                        />
                      ),
                    }}
                    menuIsOpen={true}
                    styles={colourStyles}
                    className="select-new"
                    onInputChange={(input) => setSelectSearchText(input)}
                  />
                </form> */}
                
                  {/* model contacts */}
                  <form>
                    <h3 className="heading-category">Select Contact(s) </h3>
                    <span className="share-contact-comment"></span>
                    {error && <p className="error-category">{error}</p>}
                    <Select
                      placeholder={<PlaceholderWithIcon>Select Contact...</PlaceholderWithIcon>}
                      options={contactOptions?.map((user) => ({
                        value: user.value,
                        label: user.label,
                      }))}
                      isMulti
                      value={selectedContacts}
                      onChange={handleContactsChange}
                      components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,

                        Menu: (props) => (
                          <CustomDropdown
                            searchText={selectSearchText}
                            options={contactOptions}
                            selectedOptions={selectedContacts}
                            setSelectedOptions={setSelectedContacts}
                            {...props}
                          />
                        ),
                      }}
                      menuIsOpen={true}
                      styles={colourStyles}
                      className="select-new"
                      onInputChange={(input) => setSelectSearchText(input)}
                    />
                  </form>

                </div>
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
          <div className="form-send-message">
            <button onClick={handleSendMessage}>
              Send SMS
            </button>
          </div>
        </div>
      </div>
      <div>
        <BootstrapModal show={showGroupContacts} onHide={handleClose}>
          <BootstrapModal.Header closeButton>
            <BootstrapModal.Title>User Data</BootstrapModal.Title>
          </BootstrapModal.Header>
          <BootstrapModal.Body>
            <ul>
              {groupContacts.map((user) => (
                <li key={user.id} onClick={() => getSingleContacts(user.id)}>
                  {user.firstname} {user.lastname}
                </li>
              ))}
            </ul>
          </BootstrapModal.Body>
          <BootstrapModal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </BootstrapModal.Footer>
        </BootstrapModal>
      </div>
    </>
  );
};

export default SendMessage;
