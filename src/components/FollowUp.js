import React, { useState, useEffect, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";


const Followup = () => {
  const { id } = useParams()
  const location = useLocation();
  const { data } = location.state;
  const { auth,tasklength, setTasklength } = useContext(AuthContext)
  const url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate()
  const headers = { Authorization: auth.token };
  const [editedTodo, setEditedTodo] = useState(data);
  const [editingField, setEditingField] = useState('all');
  const [mlsNoError, setMlsNoError] = useState("");
  const [propertyTypeError, setPropertyTypeError] = useState("");
  const [newSelected, setNewSelected] = useState(data.contact)
  const clearErrors = (fieldName) => {
    switch (fieldName) {
      case "Followup":
        setMlsNoError("");
        break;
      case "FollowupDate":
        setPropertyTypeError("");
        break;
      default:
        break;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    clearErrors(name)
    if (name === "FollowupDate") {
      const isoDate = formatDate(value);
      setEditedTodo({ ...editedTodo, [name]: isoDate });
    } else {
      setEditedTodo({ ...editedTodo, [name]: value });
    }
  };

  const handleEditClick = (field) => {
    setEditingField(field);
  };

  const validateForm = () => {
    let isValid = true;
    const { Followup, FollowupDate } = editedTodo
    if (!Followup) {
      setMlsNoError("Task Title is required");
      isValid = false;
    }

    if (!FollowupDate) {
      setPropertyTypeError("Follow up Date is required");
      isValid = false;
    }
    if (!isValid) {
      window.scrollTo(0, 0)
    }
    return isValid;
  };



  const errorScroll = useRef(null)
  const handlescroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    errorScroll.current.focus();
    errorScroll.current.scrollTop = 0;
  }

  const handleSaveClick = async () => {
    const isValid = validateForm()
    if (!isValid) {
      handlescroll()
      return
    }
    try {
      const { id, ...restOfEditedTodo } = editedTodo;
      const response = await axios.post(`${url}api/todo`,
        { ...restOfEditedTodo, Followup: editedTodo.Followup, taskId: id },
        { headers });
      if (response.status === 201) {
        //setLeadlength(leadlength + 1)
        setTasklength(tasklength + 1)
        navigate(-1)
        toast.success("Followup updated successfully", {
          autoClose: 2000,
          position: toast.POSITION.TOP_RIGHT,
        });
        setEditingField(null);
      } else {
        toast.error(response.data.message, {
          autoClose: 2000,
          position: toast.POSITION.TOP_RIGHT
        })
      }
    } catch (error) {
      toast.error("Server is Busy")
      console.error(error)
    }
  };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) {
      return ""; // Handle cases where the date-time string is empty or undefined
    }

    const dateTime = new Date(dateTimeString);
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const day = String(dateTime.getDate()).padStart(2, "0");
    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");

    // Return date in "YYYY-MM-DDTHH:MM" format
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (

    <div className="form-user-add">
      <div >
        <div className="property_header">
          <h3> <button type="button" className="back-only-btn" onClick={() => navigate(-1)}> <img src="/back.svg" /></button> Task</h3>
        </div>
      </div>
      <div className="form-user-edit-inner-wrap form-user-add-wrapper">
        <div className="todo-section">
          <div className="todo-main-section">
            <div className="form-user-add-inner-wrap">
              <label>Task Title<span className="required-star">*</span></label>
              {editingField === "Followup" || editingField === "all" ? (
                <div className="edit-new-input">
                  <input

                    ref={errorScroll}
                    name="Followup"
                    value={editedTodo?.Followup}
                    onChange={handleChange}

                  />
                  <span className="error-message">{mlsNoError}</span>
                </div>
              ) : (
                <div className="edit-new-input">
                  {editedTodo?.Followup}
                  <FontAwesomeIcon
                    icon={faPencil}
                    onClick={() => handleEditClick("Followup")}
                  />
                </div>
              )}
            </div>

            <div className="form-user-add-inner-wrap">
              <label>Follow Up Date<span className="required-star">*</span></label>
              {editingField === "FollowupDate" || editingField === "all" ? (
                <div className="edit-new-input">
                  <input
                    value={formatDate(editedTodo?.FollowupDate)}
                    name="FollowupDate"
                    type="datetime-local"
                    // defaultValue={ }
                    onChange={handleChange}
                  />
                  <span className="error-message">{propertyTypeError}</span>
                </div>
              ) : (
                <div className="edit-new-input">
                  {formatDate(editedTodo?.FollowupDate)}
                  <FontAwesomeIcon
                    icon={faPencil}
                    onClick={() => handleEditClick("FollowupDate")}
                  />
                </div>
              )}
            </div>

            <div className="form-user-add-inner-wrap">
              <label>Task description</label>
              {editingField === "description" || editingField === "all" ? (
                <div className="edit-new-input">
                  <textarea
                    name="description"
                    value={editedTodo?.description}
                    onChange={handleChange}
                    placeholder="description"
                  />
                </div>
              ) : (
                <div className="edit-new-input">
                  {editedTodo?.description}
                  <FontAwesomeIcon
                    icon={faPencil}
                    onClick={() => handleEditClick("description")}
                  />
                </div>
              )}
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
                  value={newSelected?.business_name}
                  readOnly
                />
              </div>
              <div className="form-user-add-inner-wrap">
                <label>Profession</label>
                <input
                  type="text"

                  value={newSelected?.profession ? newSelected?.profession?.name : ""}
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
                data={editedTodo?.Comments || ""}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setEditedTodo({ ...editedTodo, Comments: data });
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
        <div className="form-user-add-inner-btm-btn-wrap">

          <button style={{ background: "#004686" }} onClick={handleSaveClick}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default Followup;
