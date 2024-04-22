import React, { useContext, useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select from "react-select";
import Modal from "react-modal";
import axios from "axios";
import "./EmailCamp.css";
import { toast } from "react-toastify";
import { AuthContext } from "./context/AuthContext";
import { type } from "@testing-library/user-event/dist/type";

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
          className={`custom-option ${
            isOptionSelected(option) ? "selected" : ""
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
  const [isUserPreviewModalOpen, setUserIsPreviewModalOpen] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const selectRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contactOptions, setContactoptions] = useState([]);
  const [templateSendEmailContent, setTemplateContent] = useState("template");
  const ref =useRef()
  useEffect(() => {
    getContacts();
    getEmailTemplates();
    getEmailTemplatesByUserId();
  }, []);

  const getEmailTemplates = async () => {
    try {
      const response = await axios.get(`${url}api/get/email`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (response.data && Array.isArray(response.data)) {
        setTemplates(response.data);
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Error fetching email templates:", error);
    }
  };

      const handleChange=(e)=>{
<<<<<<< HEAD
           console.log(e.target.name);
=======
           setTemplateContent(e.target.value)
>>>>>>> f42e3951686a3eb3909555c714548fc6824b7bf4
      }

  const getEmailTemplatesByUserId = async () => {
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
    } catch (error) {
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
      onSave(previewContentId, editedContent);
      // setEditedTempalteContent(editedContent);
      closeModal();
    };

    const handleContentChange = (event) => {
      console.log(event);
      setEditedContent(event.target.innerHTML);
    };

    return (
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
          // previewDataId="1"
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
    onSave
  }) => {
    const [isUserEditMode, setUserIsEditMode] = useState(false);
    const [userEditedContent, setUserEditedContent] = useState("");

    const handleUserEdit = async (templateUserId) => {
      setUserIsEditMode(true);
      try {
        const response = await axios.get(`${url}api/get/email/${templateUserId}`, {
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
      } catch (error) {
        console.error("Error fetching email template:", error);
      }
    };
    
    const handleUserSave = () => {
      // if (editedUserTempalteContent.trim() === previewUserContent.trim()) {
      //   toast.error("No changes detected. Please update the content first.");
      //   return;
      // }
    
      onSave(previewUserContentId, userEditedContent);
      setUserEditedTempalteContent(userEditedContent);
      closeModal();
    };

    const handleUserContentChange = (event) => {
      // console.log("handleContentChange",event.target.innerHTML);
      setUserEditedContent(event.target.innerHTML);
      // setIsEditMode(true);
    };

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className="preview-modal"
        overlayClassName="preview-modal-overlay"
      >
        <div
          className="preview-content"
          contentEditable={isUserEditMode}
          dangerouslySetInnerHTML={{ __html: templateUserContent }}
          onInput={handleUserContentChange}
          // previewDataId="1"
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
    );
  };

  const openUserPreviewModal = (templateUserId, templateUserContent) => {
    setUserPreviewContent(templateUserContent);
    setUserPreviewContentId(templateUserId);
    setUserIsPreviewModalOpen(true);
  };

  const closeUserPreviewModal = () => {
    setUserIsPreviewModalOpen(false);
    setUserPreviewContent("");
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
      const response = await axios.get(`${url}api/get/contacts/email`, {
        headers,
      });
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
      console.log(error);
      // Handle error
    }
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

  const handleContactChange = (selectedOptions) => {
    setSelectedContacts(selectedOptions);
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
  const sendRefferal = async () => {
    console.log(selectedContacts);
    if(selectedContacts == '' || selectedContacts == undefined){
      toast.error("Please select at least one contact", {
            autoClose: 3000,
            position: toast.POSITION.TOP_RIGHT,
          });
   return
}
    try {
      const response = await axios.post(
        `${url}api/contacts/email`,
        {
          selectedContacts: selectedContacts.map((option) => option.value),
          emailContent:content.emailContent,
          subject: subject,
          selectedemailTemplate:ref.current?ref.current.value:'',
          type:templateSendEmailContent
        },
        {
          headers,
        }
      );

      if (response.status === 200) {
        toast.success("Email Sent successfully", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
        setSelectedContacts();
        closeModal();
      }
    } catch (err) {
      toast.error("Email server is bussy try after sometime", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
      setSelectedContacts();
      closeModal();
    }
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const [content, setContent] = useState({
    emailContent: "",
    // children: [],
  });

  return (
    <div className="add_property_btn">
      <div className="inner-pages-top">
        <h3> Email Campaigns</h3>
        <div className="search-group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search here"
          />
          <img src="/search.svg" />
        </div>

        {/* Rest of your component remains the same... */}
      </div>
      <div className="template-grid">
        {/* Display email templates in a grid */}
        {templates.map((template) => (
          <div key={template.id} className="template-item">
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
              <div dangerouslySetInnerHTML={{ __html: template.text }} />
              <button onClick={() => openPreviewModal(template.id, template.text)}>
                Preview
              </button>
            </div>
            <div className="email-template-name">{template.name}</div>
          </div>
        ))}
      </div>

      <PreviewModal
        className="preview-modal"
        isOpen={isPreviewModalOpen}
        closeModal={closePreviewModal}
        templateContent={previewContent}
        onSave={updateEmailTemplate}
      />

      <h3>User Email Templates </h3>
<<<<<<< HEAD
<label>
  Email Template
</label>
      <input type="radio"  className="radio" onChange={handleChange} name="emailTemplate"/>
      <label>
  Custom Text
</label>
      <input type="radio"  className="radio" onChange={handleChange} name="template"/>
      <div className="template-grid">
=======
      <div className="radio-input-wrappers" >
        <div >
        <input type="radio" value="template" defaultChecked={templateSendEmailContent=="template"?true:""} className="radio" onChange={handleChange} name="template"/>
      <label>
        Email Template
      </label>
        </div>
        <div>
      <input type="radio" value="custom" defaultChecked={templateSendEmailContent=="custom"?true:""} className="radio" onChange={handleChange} name="template"/>
<label>
Custom Text
</label>
        </div>
      </div>
     
      <div className="camp-gap">
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
        />
        </div>
      {templateSendEmailContent == "template" &&
   
    <div className="template-grid">
>>>>>>> f42e3951686a3eb3909555c714548fc6824b7bf4
        {/* Display email templates in a grid */}
        
              

<div className="list-select-img">
   
      
<ul>    
    {userTemplates.map((userTemplate) => (
       
        <li><input type="radio" name="test" ref={ref} value={userTemplate.id} id={userTemplate.id} />
            <label for={userTemplate.id}>
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
              <button onClick={() => openUserPreviewModal(userTemplate.id, userTemplate.text)}>
                Preview
              
              </button>
            </div>
            <div className="email-template-name"> {userTemplate.name} 
         
            </div>
          </div>
          </label>
         </li>
      
      ))}
 </ul>  

      

</div>

      </div>
  
      }
    
      <PreviewUserModal
        className="preview-modal"
        isOpen={isUserPreviewModalOpen}
        closeModal={closeUserPreviewModal}
        templateUserContent={previewUserContent}
        onSave={updateUserEmailTemplate}
      />
      <div className="camp-gap">
<<<<<<< HEAD
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
        />
    
=======
    
     {templateSendEmailContent == "custom" &&
>>>>>>> f42e3951686a3eb3909555c714548fc6824b7bf4
        <CKEditor
          editor={ClassicEditor}
          data={content.emailContent}
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
        }
        <div className="icon-dashboard share-ref-top-wrp">
          <button onClick={() => setIsOpen(true)}>
            <p>Share</p>
          </button>
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
              onChange={(selectedOptions) => {
                setSelectedContacts(selectedOptions);
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
  );
};
export default EmailCampaign;
