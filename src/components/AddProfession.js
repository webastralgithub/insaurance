import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import InputMask from 'react-input-mask';
import Places from "./Places";
import { toast } from "react-toastify";
import ImageUploader from "./ImageUploader";


const AddProfession = () => {
  const [contact, setContact] = useState({ name: "" });
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [firstError, setFirstError] = useState("");
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const url = process.env.REACT_APP_API_URL;
  const headers = { Authorization: auth.token }

  const validateForm = () => {
    let isValid = true;
    if (!contact.name) {
      setFirstError("Name is required");
      isValid = false;
    }
    if (!isValid) {
      window.scrollTo(0, 0)
    }
    return isValid;
  };

  const clearErrors = (fieldName) => {
    switch (fieldName) {
      case "name":
        setFirstError("");
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(`${url}api/profession`, contact, {
          headers,
        });
        if (response.status === 201) {
          navigate("/profile", { state: { data: 5}})
          toast.success('Profession added successfully', { autoClose: 2000, position: toast.POSITION.TOP_RIGHT });
        } else {
          console.error("Failed to add contact");
        }
      } catch (error) {
        console.error("An error occurred while adding a contact:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    clearErrors(name);
    setContact({ ...contact, [name]: value });
  };

  const goBack = (e) => {
    e.preventDefault()
    navigate("/profile", { state: { data: 5}})
  };

  return (
    <form onSubmit={handleSubmit} className="form-user-add">
      <div className="property_header header-with-back-btn">
        <h3> <button type="button" className="back-only-btn" onClick={goBack}> <img src="/back.svg" /></button>Add Profession</h3>
        {/* <div className="top-bar-action-btns">
            <button type="submit" style={{background:"#004686"}} >Save</button>
          </div> */}
      </div>
      <div className="form-user-edit-inner-wrap form-user-add-wrapper form-catagory-edit-sec">
        <div className="form-catagory-edit-sec-left">
          <div className="form-user-add-inner-wrap">
            <label>Name<span className="required-star">*</span></label>

            <div className="edit-new-input">
              <input
                name="name"
                value={contact.name}
                onChange={handleChange}
                placeholder="Name"
              />
              <span className="error-message">{firstError}</span>
            </div>
          </div>

          <ImageUploader
            images={images}
            setImages={setImages}
            mainImage={mainImage}
            setMainImage={setMainImage}
            headers={headers}
            url={url}
          />
        </div>

        <div className="form-catagory-edit-sec-right">
          <div className="add-contact-user-custom-right">
            <div className="form-user-add-inner-wrap">
              <label>Description</label>
              <CKEditor
                editor={ClassicEditor}
                data={contact?.notes ? contact.notes : ""}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setContact({ ...contact, notes: data });
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

export default AddProfession;
