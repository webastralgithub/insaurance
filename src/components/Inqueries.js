import React, { useState, useEffect, useContext, useRef } from "react";
import "./admin.css"
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Modal from "react-modal";
import Tooltip from '@atlaskit/tooltip';
import Select, { components } from 'react-select';

const msgStyles = {
    background: 'white',
    color: 'black',
};

//   const NoOptionsMessage = (props) => {
//     return (
//       <Tooltip content="Custom NoOptionsMessage Component">
//         <components.NoOptionsMessage {...props} />
//       </Tooltip>
//     );
//   };

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
    const { auth, roleId, userID} = useContext(AuthContext);
    const headers = { Authorization: auth.token };
    const url = process.env.REACT_APP_API_URL;
    let searchRef = useRef("")
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState("");
    const [dataLoader, setDataLoader] = useState(false)
    const [buttonActive, setButtonActive] = useState(1)
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [contactModel, setContactModel] = useState(false)
    const [forwardModel, setForwardModel] = useState(false)
    const selectRef = useRef(null);

    const [contactOptions, setContactoptions] = useState();
    const [active, setActive] = useState(1)
    const [queries, setQueries] = useState([])
    const [userInfo, setUserInfo] = useState()
    const [queryState, setQueryState] = useState(roleId == 1 ? 0 : 1);

    const [messageText, setMessageText] = useState("")
    const [prodessionPara, sendProfessionPara] = useState(null)

    const clearSearch = () => {
        searchRef.current.value = ""
        setButtonActive(1)
    };



    const handleKeyDownEnter = (event) => {
        if (event.key === 'Enter') {
            setButtonActive(2)
            getQueries()
        }
    };

    const handleKeyDown = () => {
        setButtonActive(2)
        getQueries()
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



    useEffect(() => {
        getContactList()
    }, [active, prodessionPara, queryState])


    const getContactList = async (contact) => {
        if (prodessionPara === null || prodessionPara === undefined) {
            return
        }
        try {
            // setDataLoader(true)
            if (queryState < 3) {
                const response = await axios.get(`${url}api/contact_by_profession/${prodessionPara}`, { headers, });
                if (response.status === 200) {
                    if (active == 1) {
                        const options = response?.data.insurance_contact.map((realtor) => ({
                            value: realtor.id,
                            label: realtor.firstname,
                        }));
                        setContactoptions(options)

                    }

                    if (active == 2) {
                        const options = response?.data?.klientale_contact.map((realtor) => ({
                            value: realtor.id,
                            label: realtor.name,
                        }));
                        setContactoptions(options)
                    }
                }
            }



            setDataLoader(false)
        } catch (error) {
            console.error(error)
            setDataLoader(false)
        }
    }


    useEffect(() => {
        if (queryState === 2) {
            // getChatList()
        }
    }, [queryState])


    const [chatList, setChatList] = useState('')
    const getChatList = async () => {
        setForwardModel(true)
        try {
            const response = await axios.get(`${url}api/chat_list?page=${currentPage}&search=${searchRef.current.value}`, { headers, });
            if (response.status === 200)
                setQueries(response.data)
            setChatList(response.data)
            setForwardModel(false)
        } catch (error) {
            setForwardModel(false)
            toast.error("Server is Busy");
            console.error(error)
        }
    }

    const getQueries = async () => {
        setDataLoader(true)
        let currPage
        let seachData
        if (searchRef.current.value) {
            currPage = 1
        } else {
            currPage = currentPage
        }

        try {
            if (queryState < 2) {
                setQueries([])
                const response = await axios.get(`${url}api/inquiry?page=${currPage}&search=${searchRef.current.value}&flag=${queryState}`, { headers, });
                if (response.status === 200) {
                    setQueries(response.data.posts)
                    setTotalPages(response?.data?.totalPages);

                }
            }
            if (queryState == 2) {
                setQueries([])
                const response = await axios.get(`${url}api/get-latest-message?page=${currPage}`, { headers, });
                if (response.status === 200) {
                    setQueries(response.data.notifications)
                    setTotalPages(response?.data?.totalPages);

                }
            }
            setDataLoader(false)
        } catch (error) {
            setDataLoader(false)
            toast.error("Server is Busy")
            console.error(error)
        }
    }



    const handleCloseModel = () => {
        setForwardModel(false)
        setActive(1)

    }

    const getContactMyinqueries = async () => {
        // setForwardModel(true)
        if (prodessionPara === null) {
            return
        }
        try {
            const response = await axios.get(`${url}api/contact_by_profession/${prodessionPara}`, { headers, });


            if (queryState === 1) {
                if (response.status === 200) {
                    if (active == 1) {
                        const options = response?.data.insurance_contact.map((realtor) => ({
                            value: realtor.id,
                            label: realtor.firstname,
                        }));
                        setContactoptions(options)

                    }

                    if (active == 2) {
                        const options = response?.data?.klientale_contact.map((realtor) => ({
                            value: realtor.id,
                            label: realtor.name,
                        }));
                        setContactoptions(options)
                    }
                }
            }

        } catch (error) {

        }
    }


    const handleDeleteClick = (id) => {
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this Inquiry?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteQueries(id),
                },
                {
                    label: 'No',
                    onClick: () => { },
                },
            ],
        });
    };

    const deleteQueries = async (id) => {
        setDataLoader(true)
        try {
            const response = await axios.delete(`${url}api/inquiry/${id}`, { headers, });
            if (response.status) {
                toast.success("Inquiry Deleted Successfully")
                getQueries()
            }
            setDataLoader(false)
        } catch (error) {
            setDataLoader(false)
            toast.error("Server is Busy")
            console.error(error)
        }
    }



    useEffect(() => {
        getQueries()
    }, [currentPage, queryState])


    const [queryIdForMessage, setQueryIdForMessage] = useState()
    const openContactInfo = (user, queryId) => {
        setMessageText("")
        setUserInfo(user)
        setContactModel(true)
        setQueryIdForMessage(queryId)
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
            width: "400px",
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


  
    const handleSendMessage = async (e) => {
        e.preventDefault()

        if (!messageText) {
            toast.error("Please Enter Message to Send")
            return
        }


        setDataLoader(true)
        setContactModel(false)
        let dataSend = {
            inquiry_id: queryIdForMessage,
            message: messageText,
            reciever_id: userInfo?.id ,
            sender_id : userID
        }

        try {
            const response = await axios.post(`${url}api/send-inquiry-message`, dataSend, { headers, })
            if (response.status === 200) {
                toast.success("Message Send Successfully")
            }

            setMessageText("")
            setQueryIdForMessage()
            setDataLoader(false)
        } catch (error) {
            setDataLoader(false)
            console.error(error);
            toast.error("Server is Busy")
        }

    }



    return (
        <div className="add_property_btn">
            <div className="inner-pages-top">


                <h3>Inquiries</h3>
                {roleId != 1 &&
                    <div className="add_user_btn">
                        <button onClick={() => navigate("/add-inquiry")}>
                            <img src="/plus.svg" />
                            Add Inquiry
                        </button>
                    </div>
                }
                {/* <div className="add_user_btn">
                    <button onClick={() => navigate("/inquiry/chat/1")}>Chat box</button>
                </div> */}


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
            <div className="inner-pages-top inner-pages-top-share-ref inner-pages-top-share-ref-tab">
                <div className="add_user_btn">
                    {roleId != 1 && <button
                        className={queryState == 1 ? "active" : ""}
                        onClick={() => { setQueryState(1); setSelectedContacts([]); setContactoptions([]); setButtonActive(1); searchRef.current.value = ""; setCurrentPage(1) }}
                    >
                        My Inquiries
                    </button>
                    }
                    <button
                        className={queryState == 0 ? "active" : ""}
                        onClick={() => { setQueryState(0); setSelectedContacts([]); setContactoptions([]); searchRef.current.value = ""; setButtonActive(1); setCurrentPage(1) }}
                    >
                        Inquiries
                    </button>


                    <button
                        className={queryState == 2 ? "active" : ""}
                        onClick={() => { setQueryState(2); setSelectedContacts([]); setContactoptions([]); searchRef.current.value = ""; setButtonActive(1); setCurrentPage(1) }}
                    >
                        Messages
                    </button>

                </div>
            </div>
            <div className="table-container">

                {dataLoader ?
                    (<div className="sekelton-class" style={{ backgroundColor: 'white' }} >
                        <Skeleton height={50} count={10} style={{ margin: '5px 0' }} />
                    </div>)

                    : (<>
                        {(queryState === 0 || queryState === 1) &&
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
                                    {queryState === 1 &&
                                        queries?.length > 0 && queries?.map((contact) => (
                                            <tr key={contact.id}>
                                                <td>{formatDate(contact?.created_at)}</td>
                                                {/* edit query */}
                                                {/* className={`${contact?.user?.id == userID && "property-link"}`}
                                                  onClick={() => {navigate(`/edit-inquiry/${contact.id}`, { state: { data: contact } })}} */}
                                                <td>{contact?.user?.username}</td>
                                                <td >{contact?.description}</td>
                                                <td>{contact.profession?.name}</td>
                                                <td> <button className="permissions" onClick={() => { sendProfessionPara(contact.profession_id); setForwardModel(true) }}>Forward</button></td>
                                                <td onClick={() => handleDeleteClick(contact.id)}>

                                                    <img className="delete-btn-ico" src="/delete.svg" />
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    {queryState === 0 &&
                                        queries?.length > 0 && queries?.map((contact) => (
                                            <tr key={contact.id}>
                                                <td>{formatDate(contact?.created_at)}</td>
                                                <td>{contact?.user?.username}</td>
                                                <td >{contact?.description}</td>
                                                <td>{contact.profession?.name}</td>
                                                {contact?.user?.id != userID ?
                                                    <td className="forward-and-contact-button">
                                                        <button className="permissions" onClick={() => openContactInfo(contact?.user, contact.id)}>Contact</button>
                                                        <button className="permissions" onClick={() => { sendProfessionPara(contact.profession_id); setForwardModel(true) }}>Forward</button>
                                                    </td>
                                                    : <td></td>
                                                }
                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>}

                    </>)}

                {queryState === 2 &&
                    <table>
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>Inquiry Description</th>
                                <th>Message</th>
                                <th>Date</th>
                                <th>Actions</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {queries?.length > 0 && queries?.map((contact) => (
                                <tr key={contact.id}>
                                    <td>{contact.sender_name}</td>
                                    <td>{contact?.description}</td>
                                    <td >{contact?.message}</td>
                                    <td>{formatDate(contact?.created_at)}</td>
                                    <td> <button className="permissions" >
                                        Mark As Read</button></td>
                                    <td onClick={() => navigate(`/inquiry/chat/${contact.id}`)}>
                                        <FontAwesomeIcon className="permissions" icon={faPaperPlane} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    //  (<div className="main-div-message-list-parent" style={{ backgroundColor: 'white' }}>
                    //     <div className="main-div-messages-list" onClick={() => navigate("/inquiry/chat/:id")}>
                    //         <div className="single-chat-info">
                    //             <div className="message-info">
                    //                 <label className="username">UserName</label>
                    //                 <label className="latest-message">Latest read message</label>
                    //             </div>
                    //             {/* <span className="unread-message">unread message</span> */}

                    //         </div>
                    //     </div>

                    //     <div className="main-div-messages-list" onClick={() => navigate("/inquiry/chat/:id")}>
                    //         <div className="single-chat-info">
                    //             <div className="message-info">
                    //                 <label className="username">UserName</label>
                    //                 <label className="latest-unread-message">Latest unread message</label>
                    //             </div>
                    //             <span className="unread-message">unread message</span>

                    //         </div>
                    //     </div>
                    // </div>)
                }

                {queryState < 2 && totalPages > 1 && (
                    <div className="pagination">
                        {renderPageNumbers()}
                    </div>
                )}
            </div>

            {queries.length == 0 && !dataLoader && queryState == 2 && <p className="no-data">No data Found</p>}
            {queries.length == 0 && !dataLoader && queryState == 1 && <p className="no-data">No data Found</p>}
            {queries.length == 0 && !dataLoader && queryState == 0 && <p className="no-data">No data Found</p>}




            <div className="test-class-popup" style={{ backgroundColor: 'red' }}>
                <Modal
                    isOpen={contactModel}
                    style={customStyles}
                    onRequestClose={() => setContactModel(false)}
                >
                    <div className="inquiries-details-pop-up">
                        <div className="close-modal-share" id="Contact-s" style={{ backgroundColor: 'black' }}>
                            <img
                                className="close-modal-share"
                                onClick={() => setContactModel(false)}
                                src="/plus.svg"
                                style={{ color: 'black', backgroundColor: 'black' }}
                            />
                        </div>
                        <form
                            onSubmit={(e) => handleSendMessage(e)}
                        >
                            <h3 className="heading-category" >Send Message </h3>
                            <div className="category-box">
                                <div>
                                    <label>Email :</label>
                                    <a href={`mailto:${userInfo?.email}`}>
                                        <label> {userInfo?.email} </label>
                                    </a>

                                </div>

                                <div>
                                    <label>Phone No. : </label>
                                    <a href={`tel:${userInfo?.phone}`}>
                                        <label>{userInfo?.phone}</label></a>
                                </div>
                                <div>
                                    <div>
                                        <label>Enter Message :</label>
                                    </div>
                                    <div className="category-textarea" >
                                        <textarea
                                            name="exampleTextarea"
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            rows="5"
                                            cols="40"
                                            placeholder="Enter your message here..."
                                        ></textarea>
                                    </div>

                                </div>
                            </div>

                            <div className="category-btn">
                                <button type="submit">Send</button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>

            <div className="test-class-popup" style={{ backgroundColor: 'red' }}>
                <Modal
                    isOpen={forwardModel}
                    onRequestClose={handleCloseModel}
                    style={customStyles}
                >
                    <div className="inner-pages-top inner-pages-top-share-ref inner-pages-top-share-ref-tab">
                        <div className="add_user_btn">

                            <button
                                className={active == 1 ? "active" : ""}
                                onClick={() => { setSelectedContacts([]); setContactoptions([]); setActive(1); setButtonActive(1); searchRef.current.value = "" }}
                            >
                                Contacts
                            </button>

                            <button
                                className={active == 2 ? "active" : ""}
                                onClick={() => { setSelectedContacts([]); setContactoptions([]); searchRef.current.value = ""; setButtonActive(1); setActive(2) }}
                            >
                                Klientale Contacts
                            </button>
                        </div>
                    </div>

                    <div className="modal-roles-add convert-lead-pop-up-content pop-up-content-category pop-up-add-configure">
                        <span className="close-modal-share  close-modal-share-span"
                            onClick={handleCloseModel}
                            style={{ color: 'black', backgroundColor: "white", rotate: '0' }}
                        >X</span>

                        <form onSubmit={(e) => e.preventDefault()}>
                            <h3 className="heading-category">Select Contact (s) </h3>
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
                                    // NoOptionsMessage: NoOptionsMessage,
                                }}
                                // styles={{ noOptionsMessage: (base) => ({ ...base, ...msgStyles }) }}
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

        </div>
    )
}

export default Inqueries
