import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from "react";
import Select, { components } from "react-select";
import "./admin.css";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useNavigate, useRouter } from "react-router-dom";
import Groups from "./ManageGroup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faUser } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';

const CustomDropdown = ({ children, isGroupFormActive, searchText, contact, ...props }) => {

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

  const [displayContact, setDisplayContact] = useState(null);

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

const CustomOption = ({ data, isSelected, selectOption, mapmergeContact, ...props }) => {

  const handleButtonClick = async (event) => {
    event.stopPropagation();

  };

  return (
    <>

      <div>
        <components.Option {...props}>
          <div className="select-check-line" style={{ display: 'flex' }}>

            <span onClick={handleButtonClick}>  {typeof data?.value === 'string' && data.value.includes('/group') ?
              <FontAwesomeIcon icon={faUserGroup} /> :
              <FontAwesomeIcon icon={faUser} />}{data.label}</span>
            <label className="container-chk ">
              <input type="checkbox" defaultChecked={isSelected} />
              <span className="checkmark"></span>
            </label>
          </div>
        </components.Option>
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
  const [groupContacts, setGroupContact] = useState([])
  const [showGroupContacts, setShowGroupContacts] = useState(false);
  const [selectedGroupContact, setSelectedGroupContact] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState(false);
  const [groupId, setGroupId] = useState();
  const [edit, setEdit] = useState(false);
  const [mapmergeContact, setMapmergeContact] = useState([])

  const toggleModal = () => {
    setShowModal(prevState => !prevState);
    setSelectedGroupContact([])
  }
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
  const updateGroup = async () => {
    if (selectedContacts.length === 0) {
      toast.error("Please select at least one contact.");
      return;
    }
    if (!groupName.trim()) {
      toast.error("Please enter a group name.");
      return;
    }

    try {
      const response = await axios.put(
        `${url}api/group-update/${groupId}`,
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
        toast.success("Group Updated Successfully", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
        // setGroupNames([...groupNames, response.data.group])
        setGroupNames(prevGroupNames => prevGroupNames.map(group => group.id === response.data.group.id ? response.data.group : group));

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

      const id = selectedGroups?.map((e) => e.value)
      const response = await axios.post(
        `${url}api/send-message`,
        {
          groupId: id,
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
    menuList: (styles) => ({ ...styles, overflowY: "none" }),
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

  const groupDelete = (postid) => {
    setGroupNames(groupNames.filter((p) => p.id !== postid))
     
  }

  const getGroupContacts = async (id) => {
    try {
      const response = await axios.get(`${url}api/group-contacts/${id}`, { headers });
      const res = await response.data;
      setGroupContact(res);
    } catch (error) {
      console.error("id data fetching error", error);
    }
  }


  useEffect(() => {
    fetchGroupNames();
    getContacts();
  }, []);


  useEffect(() => {
    const mergedContacts = [

      ...(groupNames?.map((group) => ({
        value: group.id + '/group',
        name: group.group_name,
      })) || []), ...(contactOptions?.map((user) => ({
        value: user.value,
        name: user.label,
      })) || [])
    ];

    setMapmergeContact(mergedContacts)
  }, [contactOptions, groupNames])


  const handleAllChange = (selectedOptions) => {
    setSelectedGroups(selectedOptions);
  }

  const handleContactChange = (selectedOptions) => {
    setSelectedGroupContact(selectedOptions);
    const selectedContactIds = selectedOptions.map(option => option.value);
  };

  const [contactModalIsOpen, setContactModalIsOpen] = useState(false);

  const handleCloseModal = () => {
    setSelectedGroupContact([]);
    setContactModalIsOpen(false);
  };

  return (
    <>
      <div className="form-user-add">

        <div className="property_header header-with-back-btn">
          {!view ? <h3>{parentView ? `${parentName} Family ` : "Send SMS"}</h3> : <h3>  {<button className="back-only-btn"
            onClick={() => {

              setView(false); // Change the view state to "contacts"

            }}
          > <img src="/back.svg" /></button>} {parentView ? `${parentName} Family ` : "Groups"}</h3>}


          {!view && <div className="top-bar-action-btns">
            <button onClick={() => {
              setView(true);
            }}>
              <FontAwesomeIcon icon={faUserGroup} /> Manage Group
            </button>
          </div>}
          {view && <div className="top-bar-action-btns">
            <button onClick={() => {
              setIsOpen(true);
              setEdit(false);
            }}>
              Add Group
            </button>
          </div>}
        </div>
        {view &&
          <>
            <Groups
              setGroupId={setGroupId}
              setGroupName={setGroupName}
              setIsOpen={setIsOpen}
              setSelectedContacts={setSelectedContacts}
              groupNames={groupNames}
              groupDelete={groupDelete}
              setEdit={setEdit}
            />
          </>

        }
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
        >
          <div className="modal-roles-add convert-lead-pop-up-content pop-up-content-category send-msg-grp-popup">
            <img
              className="close-modal-share"
              onClick={closeModal}
              src="/plus.svg"
            />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                edit ? updateGroup() : addGroup();
              }}
            >

              <h3 className="heading-category">{edit ? "Update Group" : "Add Group"} </h3>
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
                    <CustomDropdown searchText={modalSearchText}   {...props} />
                  ),
                }}
                styles={colourStyles}
                className="select-new"
                isMulti
              />
              <div className="modal-convert-btns">
                <button type="submit">{edit ? "Update Group" : "Add Group"}</button>
              </div>
            </form>
          </div>
        </Modal>

        {!view && <div className="form-user-add-wrapper">
          <div className="todo-section todo-sectionnew">
            <div className="todo-main-section todo-notes-section-new-left">
              <div className="modal-roles-add convert-lead-pop-up-content pop-up-content-category sms-list-form">
                <img className="close-modal-share" src="/plus.svg" />

                {!view && <div style={{ display: 'flex', justifyContent: 'space-evenly', }}>
                  <form>
                    <h3 className="heading-category">Select Group(s) or Contact (s) </h3>
                    <span className="share-contact-comment"></span>
                    {error && <p className="error-category">{error}</p>}

                    <Select
                      placeholder={<PlaceholderWithIcon>Select Groups or Contacts...</PlaceholderWithIcon>}
                      options={mapmergeContact?.map((groupName, index) => ({
                        value: groupName.value,
                        label: groupName.name,
                      }))}
                      isMulti={true}
                      value={selectedGroups}
                      onChange={handleAllChange}
                      closeMenuOnSelect={false}
                      menuIsOpen={true}
                      hideSelectedOptions={false}
                      styles={colourStyles}
                      className="select-new"
                      components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                        Option: (props) => (
                          <CustomOption {...props}
                            mapmergeContact={mapmergeContact}
                            selectOption={props.selectOption}
                          />
                        )
                      }}
                    />
                  </form>

                  {/* all contacts and groups */}
                  {/* custom group form modification */}
                  {/* <form>
                    <h3 className="heading-category">Select Group(s) </h3>
                    <span className="share-contact-comment"></span>
                    {error && <p className="error-category">{error}</p>}

                    <Select
                      placeholder={<PlaceholderWithIcon>Select Groups...</PlaceholderWithIcon>}
                      options={groupNames?.map((groupName) => ({
                        value: groupName.id,
                        label: groupName.group_name,

                      }))}
                      isMulti
                      onChange={handleChange}
                      closeMenuOnSelect={false}
                      menuIsOpen={true}
                      hideSelectedOptions={false}
                      value={selectedGroups}
                      styles={colourStyles}
                      className="select-new"
                      components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                        Option: (props) => (
                          <CustomOption {...props}
                            getGroupContacts={getGroupContacts}
                            handleOpenModal={handleOpenModal}
                            selectOption={props.selectOption}
                          />
                        ),
                      }}
                    />
                  </form> */}     {/* model contacts */}
                  {/* <form>
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
                  </form> */}
                </div>}
              </div>
            </div>

            {!view && <div className="todo-notes-section todo-notes-section-new-right">
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

                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setMessage(data);
                  }}
                />
              </div>
            </div>}
          </div>
          {!view && <div className="form-send-message">
            <button onClick={handleSendMessage}>
              Send SMS
            </button>
          </div>}
        </div>}
      </div>
      <div>
        {/* Modal */}

        <div>
          {/* <button onClick={handleOpenModal}>Open Modal</button> */}
          <Modal
            isOpen={contactModalIsOpen}
            style={customStyles}
            onRequestClose={handleCloseModal}
          >

            <form className="select-check-line">
              <h3 className="heading-category">Add Group </h3>
              {error && <p className="error-category">{error}</p>}
              <Select
                placeholder={<PlaceholderWithIcon>Select Contacts...</PlaceholderWithIcon>}
                onChange={handleContactChange}
                options={groupContacts?.map((user) => ({
                  value: user.id,
                  label: user.firstname + user.lastname
                }))}
                isMulti
                closeMenuOnSelect={false}
                menuIsOpen={true}
                hideSelectedOptions={false}
                value={selectedGroupContact}
                styles="select-check-line"
                className="select-check-line"
                components={{
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,

                }}
              />
            </form>
          </Modal>
        </div >
      </div >


    </>
  );
};

export default SendMessage;
