import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import "./NavbarContainer.css";
import Select, { components } from "react-select";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "./ToolTip.css";




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
          className={`custom-option ${isOptionSelected(option) ? "selected" : ""
            }`}
          style={{
            backgroundColor: isOptionSelected(option)
              ? "rgb(0 70 134 / 8%)"
              : "",
          }}
        >
          <label htmlFor={option.value}>{option.label}</label>
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

const NavbarContainer = (props) => {
  const { pathname } = useLocation();
  const { auth, setAuth, tasklength, setTasklength, plan,roleId } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [contactOptions, setContactoptions] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedContacts, setSelectedContacts] = useState(false);
  const selectRef = useRef(null);
  const [error, setError] = useState("");

  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;
  useEffect(() => {
    getTasks(); // Replace 'getUsers' with 'getTasks'
    // Rest of your code...
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(null);
    navigate("/");
  };

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
      zIndex: "9999",
    },
  };

  const colourStyles = {
    valueContainer: (styles) => ({
      ...styles,
      overflowX: "auto",
      flex: "unset",
      flexWrap: "no-wrap",
      width: selectedContacts?.length > 0 ? "354px" : "100%",
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
  useEffect(() => {
    getContacts();
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const user = await axios.get(`${url}api/admin/get-current-user`, {
          headers,
        });
        let userData = user.data.user;

        setPreviewImage(
          userData.profileImg ? userData.profileImg : "/placeholder@2x.png"
        );
      } catch (error) {
        handleLogout();
      }
    })();
  }, [pathname]);
  const closeModal = () => {
    setSelectedContacts(null);
    setIsOpen(false);
  };
  const sendRefferal = async () => {
    try {
      const response = await axios.post(
        `${url}api/contacts/share`,
        { selectedContacts: selectedContacts.map((option) => option.value) },
        {
          headers,
        }
      );

      if (response.status === 200) {
        toast.success("Referral Shared successfully", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
        setSelectedContacts();
        closeModal();
      }
    } catch (err) {
      toast.success("Referral Shared successfully", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
      setSelectedContacts();
      closeModal();
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
      {/* Adjust icon and styling */}
      <span>{props.children}</span>{" "}
      <img
        style={{ width: "17px", filter: "brightness(4.5)" }}
        src="/search.svg"
      />
    </div>
  );
  const formatDateNew = (dateTimeString) => {
    if (!dateTimeString) {
      return ""; // Handle cases where the date-time string is empty or undefined
    }

    const dateTime = new Date(dateTimeString);
   
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const day = String(dateTime.getDate()).padStart(2, "0");
    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");
    const seconds = String(dateTime.getSeconds()).padStart(2, "0");

    return `${month}-${day}`;
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
      // Set the filtered contacts in the state

      const realtorOptions = contactsWithoutParentIdandlead.map((realtor) => ({
        value: realtor.id,
        label: realtor.firstname,
      }));
      setContactoptions(realtorOptions);
    } catch (error) {
      console.error(error);
      // localStorage.removeItem('token');
      // setAuth(null);
      // navigate('/');
    }
  };

  const getTasks = async () => {
    try {
      const response = await axios.get(`${url}api/todo/get`, { headers });
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      // const filteredData = response.data.filter((item) => {
      //   return new Date(item.FollowupDate) > today &&
      //   new Date(item.FollowupDate) < weekFromNow;
      // });
      // Set the filtered contacts in the state

      const todayMonthDay =
        (today.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        today.getDate().toString().padStart(2, "0");

      const birthdayTodos = response.data.filter((todo) => {
        if (todo.isBirthday || todo.isAnniversary) {
          // Extract the month and day part of the FollowupDate
          const todoMonthDay = formatDateNew(todo?.FollowupDate);
          return todoMonthDay === todayMonthDay;
        }
        return todo;
      });
      setTasklength(birthdayTodos.length);
   
    } catch (error) { }
  };
  
  return (
    <div className="top-navbar">
      <div className="test-class-popup" style={{backgroundColor :'red'}}>
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
              sendRefferal();
            }}
          >
            <h3 className="heading-category">Select Contact(s) </h3>
            <span className="share-contact-comment">
              Grow your network - Bigger Network - More Leads{" "}
            </span>
            {error && <p className="error-category">{error}</p>}
            <Select
              placeholder={
                <PlaceholderWithIcon>Select Contacts...</PlaceholderWithIcon>
              }
              ref={selectRef}
              value={selectedContacts}
              menuIsOpen={true}
              onChange={(selectedOptions) => {
                setSelectedContacts(selectedOptions);

                // You can also extract the values into an array if needed
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
            <div className="modal-convert-btns">
              <button type="submit">Share</button>
            </div>
          </form>
        </div>
      </Modal>
      </div>
      {/* <div className="search-group">
       <input type="text" placeholder="Search here"/>
       <img src="/search.svg" />
      </div> */}
      <div className="subscription-btnn  ">
        {plan == 2 || location.pathname == "/upgrade-plan" ? "" : <button onClick={() => navigate("/upgrade-plan")}> <FontAwesomeIcon icon={faCrown} /> Upgrade Plan</button>}
        {/* <button onClick={() => navigate("/upgrade-plan")}> <FontAwesomeIcon icon={faCrown} /> Upgrade Plan</button> */}
      </div>

      <div className="icon-dashboard setting-nav">
        <div className="icon-dashboard-child" />
        {/* <div className="icon-dashboard-item" /> */}
        <Link to="/todo-list">
          {" "}
          <img className="icon-dashboard1" alt="" src="/icon-dashboard.svg" />
        </Link>
        {/* <Link to="/profile">  <img className="icon-dashboard2" alt="" src="/icon-dashboard1.svg" /></Link> */}
        <div className="background-group">
          <div className="background6" />
          <div className="div3">{tasklength}</div>
        </div>
      </div>

      <div className="icon-dashboard share-ref-top-wrp">
        <button onClick={() => setIsOpen(true)}>
          <div class="tooltip">
            <p>Share Us</p>
            <span class="tooltiptext">
              Grow your network -<br></br> Bigger Network - More Leads
            </span>
          </div>

          <div className="icon-dashboard-item" />
          <span>
            {" "}
            <img
              className="icon-dashboard2 share-too-ico"
              alt=""
              src="/share.svg"
            />
          </span>
        </button>
      </div>

      <div
        className="profile-parent"
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
      >
        <div className="separator" />

        <div className="profile3">
          <div className="hello-samantha">
            {/* <span>{`Hello, `}</span> */}
            <span className="samantha">{props.nameofuser}</span>
          </div>
        </div>
        <Link>
          {" "}
          <div className="avatar">
            <img className="placeholder-icon3" src={previewImage} />

            {showMenu && (
              <div onClick={() => setShowMenu(false)} className="profile-menu">
                <Link to="/profile">My Profile</Link>
                <Link onClick={handleLogout}>Logout</Link>
                 <Link to="/manage-subscription">Manage Subscription</Link>
                {roleId == 1 &&<Link to='/manage-configure'>Manage Configure</Link>}
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NavbarContainer;
