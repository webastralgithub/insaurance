import React, { useState, useEffect, useContext, useRef } from "react";
import "./admin.css"
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Modal from "react-modal";
import Select, { components } from "react-select";


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
                        cursor: "pointer"
                    }}
                >
                    <label htmlFor={option.value} style={{ cursor: "pointer" }}>{option.label}</label>
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




const Inqueries = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const headers = { Authorization: auth.token };
    const url = process.env.REACT_APP_API_URL;
    let searchRef = useRef("")
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [userList, setUserList] = useState([])
    const [totalPages, setTotalPages] = useState("");
    const [dataLoader, setDataLoader] = useState(false)
    const [buttonActive, setButtonActive] = useState(1)
    const [error, setError] = useState("");
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [contactModel, setContactModel] = useState(false)
    const [forwardModel, setForwardModel] = useState(false)
    const selectRef = useRef(null);
    const [contacts, setContact] = useState([])
    const [klientaleContact, setKlientaleContacts] = useState([])
    const [contactOptions, setContactoptions] = useState();
    const [active, setActive] = useState(1)
    const [queries, setQueries] = useState([])
    const [userInfo, setUserInfo] = useState()


    const clearSearch = () => {
        searchRef.current.value = ""
        setButtonActive(1)
    };

    const handleKeyDownEnter = (event) => {
        if (event.key === 'Enter') {
            setButtonActive(2)
        }
    };

    const handleKeyDown = () => {
        setButtonActive(2)
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


    const getContactList = async () => {

    }


    const getKlientaleContacts = async () => {

    }

    const getQueries = async () => {
        try {
            //inquiry
            const response = await axios.get(`${url}api/inquiry`, { headers, });

            setQueries(response.data.posts)

            // if (response.status) {
            //     toast.success("Inquery Added Succesfully")
            //     navigate("/inquiries")
            // }

        } catch (error) {
            toast.error("Server is Busy")
            console.error(error)
        }
    }

    const deleteQueries = async (id) => {
        try {
            const response = await axios.delete(`${url}api/inquiry/${id}`, { headers, });
            if (response.status) {
                toast.success("Inquery Deleted Succesfully")
                getQueries()
            }

        } catch (error) {
            toast.error("Server is Busy")
            console.error(error)
        }
    }


    useEffect(() => {
        getQueries()
    }, [])

    const openContactInfo = (user) => {
        setUserInfo(user)
        setContactModel(true)
    }

    const openForwardContacts = () => {
        setForwardModel(true)
    }
    const [searchText, setSearchText] = useState("");
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





    const formatDate = (dateString) => {
        if (!dateString) {
            return "";
        }
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${day}-${month}-${year}`
    };



    return (
        <div className="add_property_btn">
            <div className="inner-pages-top">


                <h3>Inquiries</h3>
                <div className="add_user_btn">
                    <button onClick={() => navigate("/add-inquiry")}>
                        <img src="/plus.svg" />
                        Add Inquiry</button>
                </div>
                <div className="search-grp-with-btn">
                    <div className="search-group">
                        <input type="text"
                            onKeyDown={handleKeyDownEnter}
                            ref={searchRef}
                            placeholder="Search here" />

                    </div>
                    <div className="add_user_btn ">
                        <button className='custom-search-btn-btn-search' onClick={handleKeyDown}>Search</button>
                    </div>
                </div>


                {/* Rest of your component remains the same... */}
            </div>
            <div className="table-container">
                {dataLoader ?
                    (<div className="sekelton-class" style={{ backgroundColor: 'white' }} >
                        <Skeleton height={50} count={10} style={{ margin: '5px 0' }} />
                    </div>)

                    : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Profession</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>


                                {queries?.length > 0 && queries?.map((contact) => (

                                    <tr key={contact.id}>
                                        <td>{formatDate(contact?.created_at)}</td>
                                        <td>{contact?.user?.username}</td>
                                        <td >{contact?.description}</td>
                                        <td>{contact.profession?.name}</td>
                                        <td>
                                            <button className="permissions" onClick={() => openContactInfo(contact?.user)}>Contact</button>
                                        </td>
                                        <td>
                                            <button className="permissions" onClick={openForwardContacts}>Forword</button>
                                        </td>
                                        <td onClick={()=>deleteQueries(contact.id)}>
                                            <img className="delete-btn-ico" src="/delete.svg" />
                                        </td>

                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    )}


            </div>


            <Modal
                isOpen={contactModel}
                style={customStyles}
                onRequestClose={() => setContactModel(false)}
            >
                <div className="modal-roles-add convert-lead-pop-up-content pop-up-content-category send-msg-grp-popup">
                    <img
                        className="close-modal-share"
                        onClick={() => setContactModel(false)}
                        src="/plus.svg"
                    />
                    <div classNmae="modal-roles-add convert-lead-pop-up-content pop-up-content-category">
                        <div>
                            <label>Contact Details</label>
                        </div>

                        <div>
                            <div>
                                <a href={`mailto:${userInfo?.email}`}>
                                    <label>Email : {userInfo?.email} </label>
                                </a>

                            </div>

                            <div>
                                <a href={`tel:${userInfo?.phone}`}>
                                    <label>Phone No. : {userInfo?.phone}</label></a>

                            </div>

                            <div>
                                <div>
                                    <label>Enter Text</label>
                                </div>
                                <div>
                                    <textarea></textarea>
                                </div>
                                <div>
                                    <button>Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>




            <div className="test-class-popup" style={{ backgroundColor: 'red' }}>
                <Modal
                    isOpen={forwardModel}
                    onRequestClose={() => setForwardModel(false)}
                    style={customStyles}
                >
                    <div className="inner-pages-top inner-pages-top-share-ref inner-pages-top-share-ref-tab">
                        <div className="add_user_btn">

                            <button
                                className={active == 1 ? "active" : ""}
                                onClick={() => { setActive(1); setButtonActive(1); searchRef.current.value = "" }}
                            >
                                Contacts
                            </button>

                            <button
                                className={active == 2 ? "active" : ""}
                                onClick={() => { searchRef.current.value = ""; setButtonActive(1); setActive(2) }}
                            >
                                Klientale Contacts
                            </button>
                        </div>
                    </div>
                    <div className="modal-roles-add convert-lead-pop-up-content pop-up-content-category pop-up-add-configure">
                        <img
                            className="close-modal-share"
                            onClick={() => setForwardModel(false)}
                            src="/plus.svg"
                        />

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                            }}
                        >
                            <h3 className="heading-category">Select Contact(s) </h3>

                            <Select
                                placeholder={
                                    <PlaceholderWithIcon>Search Contacts...</PlaceholderWithIcon>
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
            {queries && queries.length === 0 && <p className="no-data">No data Found</p>}
        </div>
    )
}

export default Inqueries
