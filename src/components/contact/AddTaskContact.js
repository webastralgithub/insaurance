import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import InputMask from 'react-input-mask';

const AddTaskContact = () => {

  const { id } = useParams()
  const parent = localStorage.getItem("parent")
  const [newSelected, setNewSelected] = useState([])
  const url = process.env.REACT_APP_API_URL;
  const [contact, setContact] = useState({
    Followup: "",
    ContactID: id,
    FollowupDate: "",
    Comments: "",
    IsRead: false,
  });
  const [propertyTypeError, setPropertyTypeError] = useState("");
  const [FollowupError, setFollowupError] = useState("")
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const headers = { Authorization: auth.token };

  const validateForm = () => {
    let isValid = true;
    if (!contact.Followup) {
      setFollowupError("Task Title is Required")
      isValid = false
    }

    if (!contact.FollowupDate) {
      setPropertyTypeError("Follow-up Date is required");
      isValid = false;
    }
    if (!isValid) {
      window.scrollTo(0, 0)
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return
    }
    try {
      const response = await axios.post(`${url}api/todo`, contact, {
        headers,
      });

      if (response.status === 201) {
        navigate(-1); // Redirect to the contacts list page
      } else {
        console.error("Failed to add contact");
      }
    } catch (error) {
      console.error("An error occurred while adding a contact:", error);
    }
  };

  const handleChange = (e) => {
    setPropertyTypeError("")
    setFollowupError("")
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });
  };

  const getContactDetails = async () => {
    try {
      const response = await axios.get(`${url}api/contacts/${id}`, { headers });
      const responseData = await response?.data
      setNewSelected(responseData)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getContactDetails()
  }, [])

  return (
    <form onSubmit={handleSubmit} className="form-user-add">
      <div className="property_header header-with-back-btn">
        <h3> <button className="back-only-btn" onClick={(e) => {
          e.preventDefault()
          navigate(-1)
        }}> <img src="/back.svg" /></button>{parent}-Add Task</h3>

      </div>
      <div className="form-user-add-wrapper">
        <div className="todo-section">
          <div className="todo-main-section">
            <div className="form-user-add-inner-wrap">
              <label>Task Title<span className="required-star">*</span></label>
              <input
                type="text"
                name="Followup"
                value={contact.Followup}
                onChange={handleChange}
              />
              <span className="error-message">{FollowupError}</span>
            </div>

            <div className="form-user-add-inner-wrap">
              <label>Follow Up Date<span className="required-star">*</span></label>
              <input
                type="datetime-local"
                name="FollowupDate"
                value={contact.FollowupDate}
                onChange={handleChange}
              />
              <span className="error-message">{propertyTypeError}</span>
            </div>

            <div className="form-user-add-inner-wrap">
              <label>Task description</label>
              <input
                type="text"
                name="description"
                value={contact.description}
                onChange={handleChange}
              />
            </div>
            <>
              <div className="form-user-add-inner-wrap">
                <label>Name</label>
                <input
                  type="name"
                  value={(newSelected?.firstname ? newSelected?.firstname : " ")}
                  readOnly
                />
              </div>
              <div className="form-user-add-inner-wrap">

                <label>Phone Number</label>
                <input
                  type="phone"
                  value={(newSelected?.phone ? newSelected?.phone : " ")}
                  readOnly
                />
              </div>
              <div className="form-user-add-inner-wrap">
                <label>Email</label>
                <input
                  type="text"
                  value={(newSelected?.email ? newSelected?.email : " ")}
                  readOnly
                />
              </div>
              <div className="form-user-add-inner-wrap">
                <label>Business Name</label>
                <input
                  type="text"
                  value={newSelected?.company}
                  readOnly
                />
              </div>
              <div className="form-user-add-inner-wrap">
                <label>Profession</label>
                <input
                  type="text"

                  value={newSelected?.profession}
                  readOnly
                />
              </div>
              <div className="form-user-add-inner-wrap">
                <label>Address</label>
                <input
                  type="text"

                  value={newSelected?.address1 ? newSelected?.address1 : ""}
                  readOnly
                />
              </div>
              <div className="form-user-add-inner-wrap">
                <label>Website</label>
                <input
                  type="text"
                  value={newSelected?.website ?? ""}
                  readOnly
                />
              </div>
            </>
          </div>

          <div className="todo-notes-section">
            <div className="form-user-add-inner-wrap">
              <label>Notes</label>
              <CKEditor
                editor={ClassicEditor}
                data={contact.Comments}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setContact({ ...contact, Comments: data });
                }}
                config={{
                  toolbar: ["heading", "|", "bold", "italic", "link", "|", "bulletedList", "numberedList", "|", "undo", "redo"],
                }}
                className="custom-ckeditor" // Add a custom class for CKEditor container
                style={{ width: "100%", maxWidth: "800px", height: "200px" }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="form-user-add-inner-btm-btn-wrap">
        <button type="submit" >Save</button>
      </div>
    </form>
  );
};

export default AddTaskContact;
