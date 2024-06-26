import React, { useContext, useEffect, useRef, useState, createContext } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select, { components } from "react-select";
import Modal from "react-modal";
//import { Modal, Button } from 'react-bootstrap';
import axios from "axios";
import "./EmailCamp.css";
import { toast } from "react-toastify";
import { AuthContext } from "./context/AuthContext";
import { type } from "@testing-library/user-event/dist/type";
import { useNavigate } from "react-router-dom";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faUser } from '@fortawesome/free-solid-svg-icons';

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

const EmailCampaign = () => {
  const [customEmail, setCustomEmail] = useState(0)
  const [dataLoader, setDataLoader] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [userTemplates, setUserTemplates] = useState([]);
  const [previewContent, setPreviewContent] = useState("");
  const [previewUserContent, setUserPreviewContent] = useState("");
  const [editedTempalteContent, setEditedTempalteContent] = useState("");
  const [editedUserTempalteContent, setUserEditedTempalteContent] = useState("");
  const [previewContentId, setPreviewContentId] = useState(null);
  const [previewUserContentId, setUserPreviewContentId] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [chooseTemplate, setChooseTemplate] = useState(false);
  const [isUserPreviewModalOpen, setUserIsPreviewModalOpen] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const selectRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contactOptions, setContactoptions] = useState([]);
  const [templateSendEmailContent, setTemplateSendEmailContent] = useState("template");
  const [active, setActive] = useState(1)
  const [contactOptionunique, setcontactOptionunique] = useState([])
  const ref = useRef()

  useEffect(() => {
    getContacts();
    getEmailTemplates();
    getEmailTemplatesByUserId();
  }, []);

  const [dataUrlTemplate, setdataUrlTemplate] = useState([])
  const convertToDataUrl = (htmlContent) => {
    const encodedHtml = btoa(htmlContent);
    return `data:text/html;base64,${encodedHtml}`;
  };


  const getEmailTemplates = async () => {

    try {
      const response = await axios.get(`${url}api/get/email`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (response.data && Array.isArray(response.data)) {
        setTemplates(response.data);
        const dataUrls = response?.data?.map(template => ({
          id: template.id,
          name: template.name,
          dataUrl: convertToDataUrl(template.text)
        }));
        setdataUrlTemplate(dataUrls)
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Error fetching email templates:", error);
    }
  };

  const getEmailTemplatesByUserId = async () => {
    setDataLoader(true)
    try {
      const response = await axios.get(
        `${url}api/user-email-templates`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setUserTemplates(response.data);
      } else {
        console.error("Invalid response format:", response);
      }
      setDataLoader(false)
    } catch (error) {
      setDataLoader(false)
      console.error("Error fetching email templates:", error);
    }
  };

  const updateEmailTemplate = async (id, newData) => {
    try {
      if (editedTempalteContent === previewContent) {
        toast.error("No changes detected. Please update the content first.");
        return;
      }
      const response = await axios.put(
        `${url}api/update/${previewContentId}`,
        { text: newData },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        getEmailTemplates();
        getEmailTemplatesByUserId();
        setEditedTempalteContent(editedTempalteContent);
      } else {
        toast.error("Failed to update email template");
      }
    } catch (error) {
      console.error("Error updating email template:", error);
      toast.error("Failed to update email template");
    }
  };

  const updateUserEmailTemplate = async (id, newData) => {

    try {
      // if (editedUserTempalteContent === previewUserContent) {
      //   toast.error("No changes detected. Please update the content first.");
      //   return;
      // }

      const response = await axios.put(
        `${url}api/update/${previewUserContentId}`,
        { text: newData },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        getEmailTemplates();
        getEmailTemplatesByUserId();
        setUserEditedTempalteContent(editedUserTempalteContent);
      } else {
        toast.error("Failed to update email template");
      }
    } catch (error) {
      console.error("Error updating email template:", error);
      toast.error("Failed to update email template");
    }
  };


  const PreviewModal = ({
    isOpen,
    closeModal,
    templateContent,
    onSave
  }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState("");

    const handleEdit = async (templateId) => {
      setIsEditMode(true);
      try {
        const response = await axios.get(`${url}api/get/email/${templateId}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        if (response.data && response.data.text) {
          setPreviewContent(response.data.text);
          setIsPreviewModalOpen(true);
        } else {
          console.error("Invalid email template format:", response);
        }
      } catch (error) {
        console.error("Error fetching email template:", error);
      }
    };

    setEditedTempalteContent(editedTempalteContent);

    const handleSave = () => {
      if (editedTempalteContent.trim() === previewContent.trim()) {
        toast.error("No changes detected. Please update the content first.");
        return;
      }
      setEditedTempalteContent(editedContent);

      onSave(previewContentId, editedContent);

      closeModal();
      setIsOpen(true)
    };

    const handleContentChange = (event) => {
      setEditedContent(event.target.innerHTML);
    };

    const handleInputChange = (e) => {
      setSubject(e.target.value)
    }

    const rootElement = document.getElementById('root');
    Modal.setAppElement(rootElement);

    return (
      <div>
        <div className="preview-template-campaign">
          <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            className="preview-modal"
            overlayClassName="preview-modal-overlay"
          >
            <div
              className="preview-content"
              contentEditable={isEditMode}
              dangerouslySetInnerHTML={{ __html: templateContent }}
              onInput={handleContentChange}
            ></div>
            {isEditMode && (
              <button className="save-btn" onClick={handleSave}>
                <img alt="" src="/save_icon.svg" />
              </button>
            )}
            {!isEditMode && (
              <button className="edit-box" onClick={handleEdit}>
                {" "}
                <img alt="" src="/edit-icon.svg" />
              </button>
            )}
            <button className="close-box" onClick={closeModal}>
              x
            </button>
          </Modal>
        </div>
      </div>
    );
  };

  const openPreviewModal = (templateId, templateContent) => {
    setPreviewContent(templateContent);
    setPreviewContentId(templateId);
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewContent("");
    setPreviewContentId(null);
  };


  const PreviewUserModal = ({
    isOpen,
    closeModal,
    templateUserContent,
    onSave,
  }) => {
    const [isUserEditMode, setUserIsEditMode] = useState(false);
    const [userEditedContent, setUserEditedContent] = useState(previewUserContent);


    const handleUserEdit = async (templateUserId) => {
      setUserIsEditMode(true);
    };

    const handleUserSave = async () => {
      if (editedUserTempalteContent.trim() === previewUserContent.trim()) {
        toast.error("No changes detected. Please update the content first.");
        return;
      }

      try {
        const response = await axios.put(`${url}api/update/${previewUserContentId}`, {
          templateContent: userEditedContent
        }, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        if (response.data && response.data.text) {
          setUserPreviewContent(response.data.text);
          setUserIsPreviewModalOpen(true);
        } else {
          console.error("Invalid email template format:", response);
        }

        closeModal();
        toast.success("Template Updated successfully")

        getEmailTemplatesByUserId()
      } catch (error) {
        toast.error("Template server is busy")
        console.error("Error fetching email template:", error);
      }
    };

    const handleUserContentChange = (event) => {

      setUserEditedContent(event.target.innerHTML);

      // setIsEditMode(true);
    };

    return (
      <>
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          className="preview-modal handleUserEdit"
          overlayClassName="preview-modal-overlay email-campaign-popup"
        >
          <div
            className="preview-content handleUserEdit"
            contentEditable={isUserEditMode}
            dangerouslySetInnerHTML={{ __html: templateUserContent }}
            onInput={handleUserContentChange}
          ></div>
          {isUserEditMode && (
            <button className="save-btn" onClick={handleUserSave}>
              <img alt="" src="/save_icon.svg" />
            </button>
          )}
          {!isUserEditMode && (
            <button className="edit-box" onClick={handleUserEdit}>
              {" "}
              <img alt="" src="/edit-icon.svg" />
            </button>
          )}
          <button className="close-box" onClick={closeModal}>
            x
          </button>
        </Modal>
      </>
    );
  };

  const openUserPreviewModal = (templateUserId, templateUserContent) => {

    setUserIsPreviewModalOpen(true);
    setUserPreviewContent(templateUserContent);
    setUserPreviewContentId(templateUserId);

  };
  const closeUserPreviewModal = () => {
    setUserIsPreviewModalOpen(false);
    // setUserPreviewContent("");
    setUserPreviewContentId(null);
  };
  const { auth, setAuth, tasklength, setTasklength } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;


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
  const getContacts = async () => {
    try {
      const response = await axios.get(`${url}api/contacts`, {
        headers,
      });
      setcontactOptionunique(response.data)
    } catch (error) {
      console.error(error);
    }
  };
  const colourStyles = {
    valueContainer: (styles) => ({
      ...styles,

      // overflowX: "auto",
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

    option: (styles) => {
      return {
        ...styles,
        cursor: 'pointer',
      };
    },
  };

  const handleContactChange = (selectedOptions) => {
    setSelectedContacts(selectedOptions);
  };
  const [content, setContent] = useState({ emailContent: "" });
  const navigate = useNavigate();

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
  const [templateName, setTemplateName] = useState("")

  const sendRefferal = async () => {
    if (!subject) {
      toast.error("subject must not be empty")
      return
    }

    if (selectedContacts == '' || selectedContacts == undefined) {
      toast.error("Please select at least one contact", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
      return
    }
    try {
      const response = await axios.post(`${url}api/contacts/email`, {
        selectedContacts: selectedContacts.map((option) => option.value),
        emailContent: content.emailContent,
        subject: subject,
        templateName: templateName,
        type: templateSendEmailContent
      }, { headers }
      );

      if (response.status === 200) {
        toast.success("Email Sent successfully", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
        setSelectedContacts([]);
        setSubject("")
        closeModal();
        setChooseTemplate(false)
        setActive(1)
        setContent("")
      }
    } catch (err) {
      toast.error("Email server is bussy try after sometime", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
      // setSelectedContacts([]);
      closeModal();
    }
  };


  const closeModal = () => {
    setIsOpen(false);
  };



  const openTemplate = (id, text, name) => {
    const selected = { id, text, name }
    setSelectedTemplate(selected);
    navigate('/templates', { state: { selectedTemplate: selected } })
  }

  const handleSaveCustomContent = () => {
    setTemplateSendEmailContent("custom")
    setIsOpen(true)
  }
  ///////contact listing
  let searchRef = useRef()
  const [currentPage, setCurrentPage] = useState(1);
  const [userss, setusers] = useState([])
  const [totalPagess, setTotalPages] = useState("");

  useEffect(() => {
    getTasks()
  }, [currentPage])
  const getTasks = async () => {
    setDataLoader(true)
    let currPage
    let seachData
    if (searchRef.current.value) {
      currPage = ''
    } else {
      currPage = currentPage
    }

    try {
      const response = await axios.get(`${url}api/contacts-list?page=${currPage}&search=${searchRef.current.value}`, { headers });
      setusers(response?.data?.contacts)
      setTotalPages(response?.data?.totalPages)
      setDataLoader(false)
    } catch (error) {
      setDataLoader(false)
      console.error("Server is busy");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const formatPhoneNumber = (phoneNumber) => {
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPagess; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers.map((number) => (
      <button className={currentPage === number ? "active" : ""}
        key={number} onClick={() => handlePageChange(number)}>{number}</button>
    ));
  };

  const handleBackbutton = () => {
    setActive(1)
  }
  return (
    <>
      <div className="add_property_btn">

        <PreviewUserModal
          className="preview-modal"
          isOpen={isUserPreviewModalOpen}
          closeModal={closeUserPreviewModal}
          templateUserContent={previewUserContent}
          onSave={updateUserEmailTemplate}
        />
        <div className="inner-pages-top inner-pages-top-flex-direction">
          <div className="inner-pages-top" style={{ justifyContent: 'flex-start' }}>
            {active > 1 &&
              <button className="back-only-btn" onClick={handleBackbutton} >
                <img src="/back.svg" onClick={() => { setChooseTemplate(false) }} />
              </button>
            }
            <h3> Email Campaigns</h3 >

            {active === 1 &&
              <div className="add_user_btn" onClick={() => { setActive(2); setCustomEmail(0) }}>
                <button >Add Campaigns</button>
              </div>}

            <div className="search-grp-with-btn" style={{ marginLeft: '395px' }}>
              <div className="search-group">
                <input type="text"
                  ref={searchRef}
                  placeholder="Search here" />
              </div>
              <div className="add_user_btn">
                <button >Search</button>
              </div>
            </div>
          </div>
          {active > 1 &&
            <div className="add_user_btn buttons-with-returb-btn">
              {/* <button className={active === 1 ? 'active' : ''} onClick={() => { setActive(1); setCustomEmail(0) }}>
              Campaign</button> */}
              <button className={active === 2 ? 'active' : ''} onClick={() => { setActive(2); setCustomEmail(0) }}>
                People</button>
              <button className={active === 3 ? 'active' : ''} onClick={() => { setActive(3); setCustomEmail(0) }}>
                Templates</button>
            </div>}
        </div>


        {/* active === 1 and email campign list */}
        <>
          {active === 1 && <>
            <div className="add_property_btn" >
              <div className="template-grid">
                <div className="new-email-tem-set">
                  <ul className="image-list">

                    {dataLoader ?
                      (<div className="sekelton-class" style={{ backgroundColor: 'white' }} >
                        <Skeleton height={50} count={10} style={{ margin: '5px 0' }} />
                      </div>)

                      : (<>
                        {userTemplates.map((userTemplate, index) => (

                          <li key={index}>
                            <input type="radio" name="test" ref={ref} value={userTemplate.id} id={userTemplate.id} />
                            <label htmlFor={userTemplate.id}>
                              <div key={userTemplate.id} className="template-item">
                                {/* Add div for preview */}

                                <div
                                  className="email-template-box"
                                  style={{
                                    width: "100%",
                                    height: "100px",
                                    border: "1px solid #ccc",
                                    overflow: "hidden",
                                  }}
                                >
                                  <div dangerouslySetInnerHTML={{ __html: userTemplate.text }} />
                                </div>
                                <div className="email-template-name"> {userTemplate.name}
                                </div>
                              </div>
                              <button onClick={() => openUserPreviewModal(userTemplate.id, userTemplate.text)}>
                                Edit
                              </button>
                            </label>
                          </li>

                        ))} </>)}
                  </ul>
                </div>
                {userTemplates.length == 0 && !dataLoader && <p className="no-data">No data Found</p>}
              </div>
            </div>
          </>}
        </>

        {/* active === 1 and contacts list */}
        <>
          {active == 2 && customEmail != 1 &&
            <div className="table-container">
              {dataLoader ?
                (<div className="sekelton-class" style={{ backgroundColor: 'white' }} >
                  <Skeleton height={50} count={10} style={{ margin: '5px 0' }} />
                </div>)

                : (
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Business Name</th>
                        <th>Profession</th>
                        <th>Phone</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    {userss.length > 0 &&
                      userss.map((contact) => (<tbody key={contact.id}>
                        <tr key={contact.id}>
                          <td><input type='checkbox' /></td>
                          <td>{contact.firstname}</td>
                          <td>{contact?.business_name}</td>
                          <td>{contact?.profession?.name ? contact?.profession?.name : ""}</td>
                          <td>{contact?.phone && formatPhoneNumber(contact?.phone)}</td>
                          <td>{contact?.email}</td>
                        </tr>
                      </tbody>))}
                  </table>)}
              {userss?.length > 0 && (
                <div className="pagination">
                  {renderPageNumbers()}
                </div>
              )}
            </div>
          }
        </>

        {/* active == 3  */}
        <>
          <div className="template-grid">

            {/* pre-defiened email templates */}

            {active === 3 && customEmail === 1 && <>
              <div className="custom-text-tab-sec">
                <input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                <CKEditor
                  editor={ClassicEditor}
                  data={content?.emailContent}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setContent({ ...content, emailContent: data });
                  }}
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
                  }}
                  className="custom-ckeditor"
                  style={{ width: "100%" }}
                />

                {subject && content?.emailContent ? <div className="camp-gap camp-gap-button-wrapper-nxt">
                  <div className="icon-dashboard share-ref-top-wrp">
                    <button onClick={handleSaveCustomContent}>
                      <p>Share</p>
                    </button>
                  </div>
                </div> : ""}
              </div>
            </>
            }


            {/*pre-defiened email templates */}
            {active === 3 && customEmail != 1 &&
              <>
                <PreviewModal
                  className="preview-modal"
                  isOpen={isPreviewModalOpen}
                  closeModal={closePreviewModal}
                  templateContent={previewContent}
                  onSave={updateEmailTemplate}
                />

                <div className="template-item custom-email-template-flex" style={{ border: '1px solid', overflow: 'hidden' }}>
                  <div style={{ fontSize: '199px', overflow: 'hidden' }} onClick={() => setCustomEmail(1)}>
                    +
                  </div>
                </div>
                {templates.map((template) => (
                  <div key={template.id} className="template-item">
                    <label htmlFor={template.id}></label>
                    <div
                      className="email-template-box"
                      style={{
                        width: "100%",
                        height: "100px",
                        border: "1px solid #ccc",
                        overflow: "hidden",
                      }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: template.text }} />
                      <button onClick={() => openTemplate(template.id, template.text, template.name)}>Choose template</button>

                    </div>
                    <div className="email-template-name" >{template.name}</div>
                  </div>
                ))}
              </>
            }
          </div>
        </>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
        >
          <div className="modal-roles-add convert-lead-pop-up-content pop-up-content-category" >
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
              {error && <p className="error-category">{error}</p>}
              <Select
                placeholder={
                  <PlaceholderWithIcon>Select Contacts...</PlaceholderWithIcon>
                }
                ref={selectRef}
                value={selectedContacts}
                menuIsOpen={true}
                hideSelectedOptions={false}
                onChange={(selectedOptions) => {
                  setSelectedContacts(selectedOptions);
                }}
                onInputChange={(input) => setSearchText(input)}
                options={contactOptionunique?.map((user) => ({
                  value: user.id,
                  label: user.firstname
                }))}

                components={{
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                  Option: (props) => (
                    <CustomOption {...props}
                      selectedContacts={contactOptionunique}
                      selectOption={props.selectOption}
                    />
                  )
                }}
                styles={colourStyles}
                className="select-new"
                isMulti
              />

              {/* main share button */}
              <div className="modal-convert-btns">
                <button type="submit">Share</button>
              </div>
            </form>
          </div>
        </Modal>
      </div>

      {/* new design for email Campaigns */}

    </>
  );
};
export default EmailCampaign;
