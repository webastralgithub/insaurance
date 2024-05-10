import React, { useState, useEffect, useContext, useRef } from "react";
import "./admin.css";
import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Message, toaster } from "rsuite";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useNavigate, useParams, useRouter } from "react-router-dom";
import "./Modal.css";
import Select from 'react-select'
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
          key={option?.value}
          className={`custom-option ${isOptionSelected(option) ? "selected" : ""
            }`}
          style={{
            backgroundColor: isOptionSelected(option)
              ? "rgb(0 70 134 / 8%)"
              : "",
          }}
        >
          <label htmlFor={option?.value}>{option?.label}</label>
          <div className="circle"></div>
          {/* <input
            type="radio"
            id={option.value}
            name={option.label}
            checked={isOptionSelected(option)}
            onChange={() => handleOptionClick(option)}
          /> */}
        </div>
      ))}

      {/* Show available options */}
      {React.cloneElement(children, { ...props })}
    </div>
  );
};

const KlientaleContacts = ({ role }) => {
  const { id } = useParams();
  const selectRef = useRef(null);
  const [contacts, setContacts] = useState([]);
  const [active, setActive] = useState(1);
  const [parentid, setParentId] = useState();
  const navigate = useNavigate();
  const [parentView, setParentView] = useState(false);
  const [parentName, setParentName] = useState([]);
  const [bussinessDetail, serBussinessDetail] = useState();
  const [contactOptions, setContactoptions] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedContacts, setSelectedContacts] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [seletedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtered, setfilteredUsers] = useState(null);
  const [modalMode, setModalMode] = useState("");
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewState, setViewState] = useState("contacts");

  const [width, setWidth] = useState(window.innerWidth);

  const { auth, email, property, setProperty, setAuth } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;
  const klintaleUrl = process.env.REACT_APP_KLINTALE_URL;

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };


  useEffect(() => {

    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    // Scroll to the end of valueContainer when selectedContacts change
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
      width: seletedCategory.length > 0 ? "354px" : "100%",
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
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      width: "300px",
      overflow: "unset",
      padding: "0px",
      transform: "translate(-50%, -50%)",
      background: "rgb(255 255 255)",
    },
    overlay: {
      backgroundColor: "rgb(0 0 0 / 34%)",
    },
  };


  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${klintaleUrl}listing/${localStorage.getItem('email')}`);
      const data = response.data.user;
      const options = response.data.category.map((realtor) => ({
        value: realtor.id,
        label: realtor.category,
      }));

      setUsers(data);
      const filteredUsers = data.filter(user => {
        return options.some(option => option.label === user.category_name);
      });
      if (options.length > 0) {
        setfilteredUsers(filteredUsers)
      }
      else {
        setfilteredUsers(data)
      }
      setSelectedCategory(options)

    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCategotires = async () => {
    try {
      const response = await axios.get(`${klintaleUrl}categories`);
      const data = response.data;
      const options = data.map((realtor) => ({
        value: realtor.id,
        label: realtor.name,
      }));
      setCategories(options);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [])
  useEffect(() => {

    fetchCategotires();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  var filteredContacts = "";
  if (active != 3) {
    filteredContacts = contacts.filter((contact) => {
      const searchText = searchQuery.toLowerCase();
      return (
        contact?.firstname?.toLowerCase().includes(searchText) ||
        contact.lastname?.toLowerCase().includes(searchText) ||
        formatDate(contact.birthDate).toLowerCase().includes(searchText) ||
        contact.email?.toLowerCase().includes(searchText) ||
        (contact.address1 + " " + contact.address2)
          .toLowerCase()
          .includes(searchText) ||
        contact.city?.toLowerCase().includes(searchText) ||
        contact.provinceName?.toLowerCase().includes(searchText) ||
        contact.realtor?.name.toLowerCase().includes(searchText) ||
        contact.source?.toLowerCase().includes(searchText) ||
        contact.phone?.toLowerCase().includes(searchText)
      );
    });
  } else {
    filteredContacts = contacts.filter((contact) => {
      const searchText = searchQuery.toLowerCase();
      return (
        contact?.ipAddress?.toLowerCase().includes(searchText) ||
        contact.time?.toLowerCase().includes(searchText)
      );
    });
  }
  const handleSelectChange = async (event) => {
    event.preventDefault();
    setCurrentPage(1)
    const filteredUsers = users.filter(user => {
      return seletedCategory.some(option => option.label === user.category_name);
    });
    if (seletedCategory.length > 0) {
      setfilteredUsers(filteredUsers)
    }
    else {
      setfilteredUsers(users)
    }
    const obj = {
      email: email?.email,
      category: seletedCategory
    }
    try {
      const response = await axios.post(`${klintaleUrl}create-preference-category`, obj);

      if (response.status === 200) {
        toast.success('Category added successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
        // Redirect to the contacts list page
      } else {
        console.error("Failed to add contact");
      }
    } catch (error) {
      console.error("An error occurred while adding a contact:", error);
    }
    closeModal();
  }
  const closeModal = () => {
    setSelectedContacts(null);
    setIsOpen(false);
  };


  const contactsPerPage = 10;
  const contactsToDisplay = filtered?.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
  );
  // Adjust the number of contacts per page as needed
  const totalPages = Math.ceil(filtered?.length / contactsPerPage);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const PlaceholderWithIcon = (props) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Adjust icon and styling */}
      <span>{props.children}</span>{" "}
      <img
        style={{ width: "17px", filter: "brightness(4.5)" }}
        src="/search.svg"
      />
    </div>
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchCategotires();
  }, []);

  const redirecctToWebsite = () => {
    // window.location.href ='https://admin.klientale.com/';
    window.open('https://klientale.com/');
  };

  return (
    <div className="add_property_btn">
      <div className="inner-pages-top inner-pages-top-share-ref">
        <h3>{parentView ? `${parentName} Family ` : "Klientale Contacts"}</h3>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
        >
          <div className="modal-roles-add convert-lead-pop-up-content pop-up-content-category" style={{ position: "relative" }}>
            <img
              className="close-modal-share"
              onClick={closeModal}
              src="/plus.svg"
            />
            <form>
              <h3 className="heading-category">Select Category(s) </h3>
              {error && <p className="error-category">{error}</p>}
              <Select
                placeholder={
                  <PlaceholderWithIcon>Select Category...</PlaceholderWithIcon>
                }
                ref={selectRef}
                value={seletedCategory}
                menuIsOpen={true}
                onChange={(selectedOptions) => {
                  setSelectedCategory(selectedOptions);

                  // You can also extract the values into an array if needed
                }}

                onInputChange={(input) => setSearchText(input)}
                options={categories}
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
              <div className="modal-convert-btns" style={{ padding: "20px 0px" }}>
                <button onClick={handleSelectChange}>Save</button>
              </div>
            </form>

          </div>
        </Modal>
        {/* <Select
      // value={value}
      isMulti
      value={seletedCategory}
      onChange={handleSelectChange}
      // isClearable={value.some((v) => !v.isFixed)}
      name="colors"
      className="select-new"
      styles={colourStyles}
      options={categories}
    /> */}

        <div className="icon-dashboard share-ref-top-wrp become-klintale">
          <button onClick={() => navigate("/become-klintale")}>
            <p>SignUp To Klientale</p>
          </button>
          <button onClick={() => setIsOpen(true)}>
            <p>My Prefrences</p>
          </button>
        </div>
        <div className="search-group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search here"
          />
          <img src="/search.svg" />
        </div>
      </div>

      {/* Rest of your component remains the same... */}

      <div className="table-container share-ref-table-in">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Category</th>
              <th>User Type</th>
              <th>Membership</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contactsToDisplay && contactsToDisplay.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.category_name}</td>
                <td>{user.user_role}</td>
                <td>{user.membership_name}</td>
                <td>{user.user_role}</td>
                <td>
                  <button className="permissions share-ref-button-tb"
                    onClick={() => {
                      navigate(`/klientale-contacts/share/${user.id}/${user.name}`)
                    }}       >Share Me</button>
                </td>
                <td>  <button className="permissions share-ref-button-tb"
                  onClick={() => {
                    navigate(`/klientale-contacts/contacts/send/${user.id}`)
                  }}       >Send me Referrals</button>       </td>

              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 &&  (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      {users.length == 0 && <p className="no-data">No data Found</p>}
    </div>
  );
};

export default KlientaleContacts;
