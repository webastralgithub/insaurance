import React, { useState, useEffect, useContext, useRef } from "react";
import "./admin.css";
import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useNavigate, useParams, useRouter } from "react-router-dom";
import "./Modal.css";
import Select from 'react-select'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

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
              : "", cursor: "pointer"
          }}
        >
          <label htmlFor={option?.value} style={{ cursor: "pointer" }}>{option?.label}</label>
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
  const [dataLoader, setDataLoader] = useState(false)
  const [buttonActive, setButtonActive] = useState(1)
  const { id } = useParams();
  const selectRef = useRef(null);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [selectedContacts, setSelectedContacts] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [seletedCategory, setSelectedCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [width, setWidth] = useState(window.innerWidth);

  const { auth, email } = useContext(AuthContext);
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
    fetchCategotires();
  }, []);

  const handleSelectChange = async (event) => {
    event.preventDefault();
    getKlientaleContacts();
    closeModal();
  }

  const closeModal = () => {
    setSelectedContacts(null);
    setIsOpen(false);
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
    fetchCategotires();
  }, []);

  let searchRef = useRef()
  const [userss, setusers] = useState([])
  const [totalPages, setTotalPages] = useState("");


  const getKlientaleContacts = async () => {
    setDataLoader(true)
    let categoriesData = seletedCategory.map((item) => item.value)
    let currPage
    if (searchRef.current.value) {
      currPage = ''
    } else {
      currPage = currentPage
    }

    try {

      const response = await axios.get(`${klintaleUrl}listings/${localStorage.getItem('email')}?page=${currPage}&search=${searchRef.current.value}&categories=${categoriesData}`, { headers });
      setusers(response?.data?.users)
      setTotalPages(response?.data?.totalPages)
      setDataLoader(false)
    } catch (error) {
      setDataLoader(false)
      console.error("Server is busy");
    }
  };

  useEffect(() => {
    getKlientaleContacts();
  }, [currentPage]);

  const clearSearch = () => {
    searchRef.current.value = ""
    setButtonActive(1)
    getKlientaleContacts();
  };

  const handleKeyDownEnter = (event) => {
    if (event.key === 'Enter') {
      setButtonActive(2)
      getKlientaleContacts()
    }
  };

  const handleKeyDown = () => {
    setButtonActive(2)
    getKlientaleContacts();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers.map((number) => (
      <button className={currentPage === number ? "active" : ""}
        key={number} onClick={() => handlePageChange(number)}>{number}</button>
    ));
  };


  return (
    <div className="add_property_btn">
      <div className="inner-pages-top inner-pages-top-share-ref">
        <h3>{"Klientale Contacts"}</h3>
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
              <h3 className="heading-category">Select Profession(s) </h3>
              {error && <p className="error-category">{error}</p>}
              <Select
                placeholder={
                  <PlaceholderWithIcon>Select Profession...</PlaceholderWithIcon>
                }
                ref={selectRef}
                value={seletedCategory}
                menuIsOpen={true}
                onChange={(selectedOptions) => {
                  setSelectedCategory(selectedOptions);
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
                isMulti
              />
              <div className="modal-convert-btns" style={{ padding: "20px 0px" }}>
                <button onClick={handleSelectChange}>Save</button>
              </div>
            </form>
          </div>
        </Modal>

        <div className="icon-dashboard share-ref-top-wrp become-klintale">
          <button className="upgade-klientale" onClick={() => navigate("/become-klintale")}>
            <p>Upgrade To Klientale</p>
          </button>
          <button onClick={() => setIsOpen(true)}>
            <p>Profession</p>
          </button>
        </div>

        <div className="search-grp-with-btn">
          <div className="search-group">
            <input
              type="text"
              onKeyDown={handleKeyDownEnter}
              ref={searchRef}
              placeholder="Search here"
            />
            {/* {buttonActive == 1 && <img src="/search.svg" onClick={handleKeyDown} />}
            {buttonActive == 2 && <FontAwesomeIcon icon={faXmark} onClick={clearSearch} />} */}
          </div>
          <div className="add_user_btn">
            <button className='custom-search-btn-btn-search' onClick={handleKeyDown}>Search</button>
          </div>
        </div>
      </div>


      <div className="table-container share-ref-table-in">
        {dataLoader ?
          (<div className="sekelton-class" style={{ backgroundColor: 'white' }} >
            <Skeleton height={50} count={10} style={{ margin: '5px 0' }} />
          </div>)
          : (<table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Business Name</th>
                <th>Profession</th>
                <th>Phone</th>
                <th>Email</th>
             
              </tr>
            </thead>
            <tbody>
              {userss && userss?.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.business_name}</td>
                  <td>{user.category_name}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                 
                </tr>
              ))}
            </tbody>
          </table>)}
        {userss?.length > 0 && (
          <div className="pagination">
            {renderPageNumbers()}
          </div>)}
      </div>
      {!dataLoader && !userss && <p className="no-data">No data Found</p>}
    </div>
  );
};

export default KlientaleContacts;
