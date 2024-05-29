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


const AddCategory = () => {
  const [contact, setContact] = useState({
  name:""
  });

  const [images, setImages] = useState([]);

  const [mainImage, setMainImage] = useState(null);


  const [firstError, setFirstError] = useState("");


  // Define an array of province options

  const navigate = useNavigate();

  const { auth } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };



const validateForm = () => {
  let isValid = true;

  if (!contact.name) {
    setFirstError("Name is required");
    isValid = false;
  }



    if(!isValid){
    window.scrollTo(0,0)
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
     paddingLeft:"0px"
    }),
    control: styles => ({ ...styles, border: 'unset',boxShadow:"unset",borderColor:"unset",minHeight:"0" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
     
      return {
        ...styles,
      
     
      };
    },
  
  };
  const url = process.env.REACT_APP_API_URL;



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
    try {
      const response = await axios.post(`${url}api/categories/create`, contact, {
        headers,
      });

      if (response.status === 201) {
        // Contact added successfully
        navigate("/categories");
        toast.success('Category added successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
        // Redirect to the contacts list page
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
    navigate(-1); // This function takes you back one step in the navigation stack
  };

  return (
    <form onSubmit={handleSubmit} className="form-user-add">
           <div className="property_header header-with-back-btn">
          
          <h3> <button  type="button" className="back-only-btn" onClick={goBack}> <img src="/back.svg" /></button>Add Category</h3>
        
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

export default AddCategory;
