import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { toast } from "react-toastify";
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';

const AddTaskContact = () => {

  const { id } = useParams()
  const parent = localStorage.getItem("parent")
  const location = useLocation();
  const { data } = location.state;
  const [newSelected, setNewSelected] = useState(data)
  const [minDate, setMinDate] = useState('');


  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 16);
    setContact((prevContact) => ({
      ...prevContact,
      FollowupDate: formattedDate,
    }));
  }, []);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    setMinDate(`${year}-${month}-${day}T${hours}:${minutes}`);
  }, []);

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
  const { auth, tasklength, setTasklength } = useContext(AuthContext);
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
        setTasklength(tasklength + 1)
        toast.success("Task Created Successfully")
        navigate(-1);
      } else {
        toast.error(response.data.message, {
          autoClose: 2000,
          position: toast.POSITION.TOP_RIGHT
        })
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

  const [dateTime, setDateTime] = useState(Datetime.moment());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  
  const handleDateTimeChange = (momentObj) => {
    setContact({ ...contact, FollowupDate: momentObj._d })
    setDateTime(momentObj._d);
    setIsCalendarOpen(false);
  };

  const isValidDate = (current) => {
    return current.isAfter(Datetime.moment().subtract(1, 'day'));
  };

  const openCalendar =()=>{
    setIsCalendarOpen(true);
  }

const calendarRef =useRef(null)
  const handleClickOutside = (event) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      setIsCalendarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
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

            <div className="form-user-add-inner-wrap new-tag-date"  ref={calendarRef}>
              <label>Follow Up Date<span className="required-star">*</span></label>

              <Datetime
                value={dateTime}
                onChange={handleDateTimeChange}
                isValidDate={isValidDate}
                open={isCalendarOpen}
              
                renderInput={(props) => (
                  <input
                    {...props}
                    readOnly
                    onClick={openCalendar}
                    style={{ cursor: 'pointer', backgroundColor: 'white' }}
                  />
                )}
              />


              {/* <input
                type="datetime-local"
                name="FollowupDate"
                min={minDate}
                value={contact.FollowupDate}
                onChange={handleChange}
              /> */}
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
                  value={newSelected?.business_name}
                  readOnly
                />
              </div>
              <div className="form-user-add-inner-wrap">
                <label>Profession</label>
                <input
                  type="text"
                  value={newSelected?.profession ? newSelected?.profession?.name : newSelected?.profession_name}
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
