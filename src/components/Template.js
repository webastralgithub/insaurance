import React from 'react'
import { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import Modal from "react-modal";
import { AuthContext } from "./context/AuthContext";
import { useNavigate, useLocation } from 'react-router-dom';
import "./EmailCamp.css";
import Select, { components } from "react-select";


const CustomOption = ({ data, isSelected, selectOption, selectedContacts, ...props }) => {

    const handleButtonClick = async (event) => {
        event.stopPropagation();

    };

    return (
        <>

            <div>
                <components.Option {...props}>
                    <div className="select-check-line" style={{ display: 'flex' }}>

                        <span onClick={handleButtonClick}> {data.label}</span>
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
                </div>
            ))}

            {/* Show available options */}
            {React.cloneElement(children, { ...props })}
        </div>
    );
};

const Templates = () => {
    const url = process.env.REACT_APP_API_URL
    const location = useLocation();
    const template = location.state.selectedTemplate;
    const navigate = useNavigate();
    const goBackToPrevious = () => {
        navigate(-1);
    };

    const [save, setSave] = useState(false);
    const [templateContent, setTemplateContent] = useState(template.text);
    const [templateName, setTemplateName] = useState(template.name);
    const selectRef = useRef(null);
    const [searchText, setSearchText] = useState("");
    const [subject, setSubject] = useState("")
    const [selectedContacts, setSelectedContacts] = useState([])
    const { auth } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(true)
    const [editedTempalteContent, setEditedTempalteContent] = useState(templateContent);
    const [isEditMode, setIsEditMode] = useState(false);
    const [templateSendEmailContent, setTemplateSendEmailContent] = useState("template");
    const [contactOptions, setContactoptions] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const headers = {
        Authorization: auth.token,
    };

    const closeModal = () => {
        setIsOpen(false);
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
                cursor: 'pointer' ,
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

    const getContacts = async () => {
        try {
            const response = await axios.get(`${url}api/contacts`, {
                headers,
            });
            const realtorOptions = response.data.map((realtor) => ({
                value: realtor.id,
                label: realtor.firstname,
            }));
            setContactoptions(realtorOptions)
            // const contactsWithoutParentId = response.data.filter(
            //     (contact) => contact.parentId === null
            // );
            // const nonvendorcontacts = contactsWithoutParentId.filter(
            //     (contact) => contact.isVendor === false
            // );
            // const contactsWithoutParentIdandlead = nonvendorcontacts.filter(
            //     (contact) => contact.isLead === false
            // );


            // // Set the filtered contacts in the state

            // const realtorOptions = contactsWithoutParentIdandlead.map((realtor) => ({
            //     value: realtor.id,
            //     label: realtor.firstname,
            // }));
            // setContactoptions(realtorOptions);
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };

    useEffect(() => {
        getContacts()
    }, [])

    const sendRefferal = async () => {
        if (save == "false") {
            toast.error("save template first")
            return
        }
        if (!subject) {

            toast.error("subject must not be empty")
            return
        }

        if (selectedContacts == '' || selectedContacts == undefined) {

            toast.error("Please select at least one contact", {
                autoClose: 2000,
                position: toast.POSITION.TOP_RIGHT,
            });
            return
        }
        try {
            const response = await axios.post(
                `${url}api/contacts/email`,

                {
                    selectedContacts: selectedContacts.map((option) => option.value),
                    emailContent: editedTempalteContent,
                    subject: subject,
                    templateName: templateName,
                    type: templateSendEmailContent
                },
                {
                    headers,
                }
            );

            if (response.status === 200) {
                toast.success("Email Sent successfully", {
                    autoClose: 2000,
                    position: toast.POSITION.TOP_RIGHT,
                });
                setSelectedContacts([]);
                setSubject("")
                closeModal();
            }
            setModalIsOpen(false)
            goBackToPrevious()
        } catch (err) {
            toast.error("Email server is bussy try after sometime", {
                autoClose: 2000,
                position: toast.POSITION.TOP_RIGHT,
            });
            setSelectedContacts([]);
            closeModal();
            setSubject("")
        }
    };

    const handleSave = () => {
        setIsEditMode(false)
        setSave(true)
        toast.success("changes are completed.");
    };

    const handleTemplateContentChange = (event) => {
        setEditedTempalteContent(event.target.innerHTML);
    };

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleSubjectInputChange = (e) => {
        setSubject(e.target.value)
    }

    return (
        <>
            <div className="inner-pages-top" style={{ justifyContent: 'flex-start', marginTop: '50px' }}>
                <button className="back-only-btn" >
                    <img src="/back.svg" onClick={goBackToPrevious} />
                </button>
                <h3> Email Campaigns</h3>
            </div>
            <div className='main-div'>
                <div className='preview-content-parent search-on-top-template'>

                    <div className="preview-modal custom-div">
                        <div
                            className="preview-content"
                            contentEditable={isEditMode}
                            dangerouslySetInnerHTML={{ __html: templateContent }}
                            onInput={handleTemplateContentChange}
                        >
                        </div>
                        {isEditMode && (
                            <button className="edit-box" onClick={handleSave}>
                                <img alt="" src="/save_icon.svg" />
                            </button>
                        )}
                        {!isEditMode && (
                            <button className="edit-box" onClick={handleEdit}>
                                {" "}
                                <img alt="" src="/edit-icon.svg" />
                            </button>
                        )}
                    </div>
                    <div className='input-buttton '>
                        <input
                            type="text"
                            value={subject}
                            onChange={handleSubjectInputChange}
                            placeholder="Subject..."
                        />
                        {subject ? <button onClick={() => setModalIsOpen(true)}>Share</button> : ""}
                        {/* <button onClick={() => setModalIsOpen(true)}>Share</button> */}
                    </div>
                </div>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                >
                    <div className="modal-roles-add convert-lead-pop-up-content pop-up-content-category">
                        <img
                            className="close-modal-share"
                            onClick={() => setModalIsOpen(false)}
                            src="/plus.svg"
                        />
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                sendRefferal();
                            }}
                        >
                            <h3 className="heading-category">Select Contact(s) </h3>
                            <Select
                                placeholder="Select contacts"
                                ref={selectRef}
                                value={selectedContacts}
                                menuIsOpen={true}
                                onChange={(selectedOptions) => {
                                    setSelectedContacts(selectedOptions);
                                }}
                                styles={colourStyles}
                                className="select-new"
                                hideSelectedOptions={false}
                                isMulti={true}
                                onInputChange={(input) => setSearchText(input)}
                                options={contactOptions}
                                components={{
                                    DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                    Option: (props) => (
                                        <CustomOption {...props}
                                            searchText={searchText} selectedContacts={selectedContacts} {...props}
                                        />
                                    )
                                }}

                            // components={{
                            //     DropdownIndicator: () => null,
                            //     IndicatorSeparator: () => null,
                            //     Menu: (props) => (
                            //         <CustomDropdown searchText={searchText} selectedContacts={selectedContacts} {...props} />
                            //     ),
                            // }}

                            />

                            {/* main share button */}
                            <div className="modal-convert-btns">
                                <button type="submit">Share</button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default Templates
