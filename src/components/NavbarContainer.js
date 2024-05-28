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
        maxHeight: "240px",
        minHeight: "240px",
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
  const { auth, setAuth, tasklength, setTasklength, plan,
     roleId, subscriptionStatus ,settotalAvailableJobs,settotalReffralEarnedMoney,
     settotalReffrals,settotalReffralsReceived} = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [contactOptions, setContactoptions] = useState();
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
        let userDataLead = user.data

        localStorage.setItem('subscription_status', userData.subscription_status)
        localStorage.getItem('category_id', userData.category_id)
        localStorage.setItem("totalReffralEarnedMoney", userDataLead.totalReffralEarnedMoney)
        localStorage.setItem("totalAvailableJobs", userDataLead.totalAvailableJobs)
        localStorage.setItem("totalReffrals", userDataLead.totalReffrals)
        localStorage.setItem("totalReffralsReceived", userDataLead.totalReffralsReceived)
        settotalAvailableJobs(userDataLead.totalAvailableJobs)
        settotalReffralEarnedMoney(userDataLead.totalReffralEarnedMoney)
        settotalReffrals(userDataLead.totalReffrals)
        settotalReffralsReceived(userDataLead.totalReffralsReceived)
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

      <div className="test-class-popup" style={{ backgroundColor: 'red' }}>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}


        >
          <div className="modal-roles-add convert-lead-pop-up-content pop-up-content-category pop-up-add-configure">
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
        {subscriptionStatus === "active" || location.pathname == "/upgrade-plan" ? "" : <button onClick={() => navigate("/upgrade-plan")}>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-rocket-takeoff" viewBox="0 0 16 16">
  <path d="M9.752 6.193c.599.6 1.73.437 2.528-.362s.96-1.932.362-2.531c-.599-.6-1.73-.438-2.528.361-.798.8-.96 1.933-.362 2.532"/>
  <path d="M15.811 3.312c-.363 1.534-1.334 3.626-3.64 6.218l-.24 2.408a2.56 2.56 0 0 1-.732 1.526L8.817 15.85a.51.51 0 0 1-.867-.434l.27-1.899c.04-.28-.013-.593-.131-.956a9 9 0 0 0-.249-.657l-.082-.202c-.815-.197-1.578-.662-2.191-1.277-.614-.615-1.079-1.379-1.275-2.195l-.203-.083a10 10 0 0 0-.655-.248c-.363-.119-.675-.172-.955-.132l-1.896.27A.51.51 0 0 1 .15 7.17l2.382-2.386c.41-.41.947-.67 1.524-.734h.006l2.4-.238C9.005 1.55 11.087.582 12.623.208c.89-.217 1.59-.232 2.08-.188.244.023.435.06.57.093q.1.026.16.045c.184.06.279.13.351.295l.029.073a3.5 3.5 0 0 1 .157.721c.055.485.051 1.178-.159 2.065m-4.828 7.475.04-.04-.107 1.081a1.54 1.54 0 0 1-.44.913l-1.298 1.3.054-.38c.072-.506-.034-.993-.172-1.418a9 9 0 0 0-.164-.45c.738-.065 1.462-.38 2.087-1.006M5.205 5c-.625.626-.94 1.351-1.004 2.09a9 9 0 0 0-.45-.164c-.424-.138-.91-.244-1.416-.172l-.38.054 1.3-1.3c.245-.246.566-.401.91-.44l1.08-.107zm9.406-3.961c-.38-.034-.967-.027-1.746.163-1.558.38-3.917 1.496-6.937 4.521-.62.62-.799 1.34-.687 2.051.107.676.483 1.362 1.048 1.928.564.565 1.25.941 1.924 1.049.71.112 1.429-.067 2.048-.688 3.079-3.083 4.192-5.444 4.556-6.987.183-.771.18-1.345.138-1.713a3 3 0 0 0-.045-.283 3 3 0 0 0-.3-.041Z"/>
  <path d="M7.009 12.139a7.6 7.6 0 0 1-1.804-1.352A7.6 7.6 0 0 1 3.794 8.86c-1.102.992-1.965 5.054-1.839 5.18.125.126 3.936-.896 5.054-1.902Z"/>
</svg> Upgrade Plan</button>}
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
          <div className="tooltip">
            <p>Share Us</p>
            <span className="tooltiptext">
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
                {roleId == 1 && <Link to='/manage-configure'>Manage Configure</Link>}
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NavbarContainer;
