import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import { faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import InputMask from "react-input-mask";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Places from "./Places";
import ImageUploader from "./ImageUploader";

const EditCategory = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL;
  const headers = {
    Authorization: auth.token,
  };

  const [editedContact, setEditedContact] = useState({});
  const [images, setImages] = useState([]);

  const [mainImage, setMainImage] = useState(null);
  const [firstError, setFirstError] = useState("");
  const [editingField, setEditingField] = useState("all");

  const handleChange = (e) => {
    const { name, value } = e.target;
    clearErrors(name);
    setEditedContact({ ...editedContact, [name]: value });
  };

  const handleEditClick = (field) => {
    setEditingField(field);
  };

  const validateForm = () => {
    let isValid = true;

    if (!editedContact.name) {
      setFirstError("Name is required");
      isValid = false;
    }

    if (!isValid) {
      window.scrollTo(0, 0);
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

  const colourStyles = {
    valueContainer: (provided, state) => ({
      ...provided,
      paddingLeft: "0px",
    }),
    control: (styles) => ({
      ...styles,
      border: "unset",
      boxShadow: "unset",
      borderColor: "unset",
      minHeight: "0",
    }),
    input: (styles) => ({ ...styles, margin: "0px" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
      };
    },
  };

  useEffect(() => {
    getContactDetails();
  }, [id]);

  const getContactDetails = async () => {
    try {
      const response = await axios.get(`${url}api/categories/get/${id}`, {
        headers,
      });
      const contactDetails = response.data;
      setEditedContact(contactDetails);
  
      setImages(JSON.parse(contactDetails?.images));
    } catch (error) {
      console.error("Error fetching contact details: ", error);
    }
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(
        `${url}api/categories/update/${id}`,
        { ...editedContact, images: images },
        {
          headers,
        }
      );

      if (response.status === 200) {
        toast.success("Category updated successfully", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
        setEditingField(null);
        goBack();
      } else {
        console.error("Failed to update contact");
      }
    } catch (error) {
      console.error("An error occurred while updating the contact:", error);
    }
  };

  const goBack = () => {
    navigate(`/categories`);
  };

  return (
    <div className="form-user-add">
      <div>
        <div className="property_header">
          <h3>
            {" "}
            <button type="button" className="back-only-btn" onClick={goBack}>
              {" "}
              <img src="/back.svg" />
            </button>{" "}
            Edit Category
          </h3>
          <div className="top-bar-action-btns">
            <button style={{ background: "#004686" }} onClick={handleSaveClick}>
              Save
            </button>
          </div>
        </div>
      </div>
      <div className="form-user-edit-inner-wrap form-user-add-wrapper form-catagory-edit-sec">
        <div className="form-catagory-edit-sec-left">
          <div className="form-user-add-inner-wrap">
            <label>Name</label>

            <div className="edit-new-input">
              <input
                name="name"
                value={editedContact.name}
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
                data={editedContact?.notes ? editedContact.notes : ""}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setEditedContact({ ...editedContact, notes: data });
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
                className="custom-ckeditor" // Add a custom class for CKEditor container
                style={{ width: "100%", maxWidth: "800px", height: "200px" }}
              />
            </div>
          </div>
        </div>


        <div className="form-user-add-inner-btm-btn-wrap">
          <button style={{ background: "#004686" }} onClick={handleSaveClick}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
