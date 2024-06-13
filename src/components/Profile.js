import React, { useState, useLayoutEffect, useRef, useContext } from "react";

import axios from "axios";

import { AuthContext } from "./context/AuthContext";
import Modal from "react-modal";
import InputMask from 'react-input-mask';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Realtor from "./Realtor";
import Vendor from "./Vendor";
import Category from "./Category";
import Profession from "./Profession";

const INITIAL_STATE = {
  username: "",
  email: "",
  name: '',
  phone: "",
  image: ""
};


const AddRoleForm = ({ onAdd, onCancel }) => {
  const [newPassword, setNewPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ newPassword });
  };


  return (

    <div className="modal-roles-add change-password-popup">
      <form onSubmit={handleSubmit}>
        <h3>Change Password</h3>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
        />
        <div className="change-password-popup-btns">
          <button type="submit">Change Password</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};
export default function Profile(props) {
  const [user, setUser] = useState(INITIAL_STATE);
  const [contacts, setContacts] = useState([]);
  const [active, setActive] = useState(1);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [show, setShow] = useState(false)
  const [msg, setMsg] = useState('')
  const [previewImage, setPreviewImage] = useState('');
  const navigate = useNavigate()
  const { auth } = useContext(AuthContext)
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;
  const fileInputRef = useRef(null);

  useLayoutEffect(() => {
    (async () => {
      try {
        const user = await
          axios.get(`${url}api/admin/get-current-user`, { headers })
        let userData = user.data.user
        setPreviewImage(userData.profileImg ? userData.profileImg : "/placeholder@2x.png")
        setUser({
          id: userData.id,
          username: userData.username,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          profileImg: userData.profileImg ? user.profileImg : "/placeholder@2x.png",
          fb: userData?.fb,
          tiktok: userData?.tiktok,
          twitter: userData?.twitter,
          insta: userData?.insta,
          referal_amount: userData?.referal_amount,
          //  referral_description:userData?.referral_description,
          isPay: userData?.is_pay,

        }
        );
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleClose = () => {
    setShow(false);
  }
  const handlePhoneNumberChange = (event) => {
    setPhoneError("")
    // Extract the raw phone number from the input
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");

    // Update the phone number state with the raw input
    setUser({ ...user, phone: rawPhoneNumber.slice(1, 11) });
  };
  const handleEmailChange = (event) => {
    // Update the phone number state with the raw input
    setUser({ ...user, email: event.target.value });
  };
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "#000",
      border: "1px solid #fff",
      padding: "0",
      width: "400px"
    },
    overlay: {
      backgroundColor: "rgb(0 0 0 / 75%)",
    }
  };
  const handleInput = async (e) => {

    if (e.target.name === 'image') {
      // Handle image file upload

      const formData = new FormData();

      const imageFile = e.target.files[0];
      formData.append(`images[]`, imageFile)

      const response = await fetch(`${url}api/upload-images`, {
        method: 'POST', // Use POST for file uploads
        headers,
        body: formData,
      });
      if (response) {
        const responseData = await response.json(); // Parse the JSON response
        const uploadedImageUrls = responseData
        setPreviewImage(uploadedImageUrls[0]);

        // Display a preview of the image
        setUser({ ...user, profileImg: uploadedImageUrls[0] }); // Store the image file in the user state
      }
    } else {

      const { name, value } = e.target;
      switch (name) {


        case "name":
          setNameError("");
          break;
        case "email":
          setEmailError("");
          break;

        default:
          break;
      }

      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const validateEmail = (email) => {
    // Define a regular expression pattern for email validation.
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailPattern.test(email);
  };

  const validateForm = () => {
    let isValid = true;





    if (!user.name) {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }
    if (user.email) {
      if (!validateEmail(user.email)) {
        setEmailError("Invalid email")
      }
    }
    if (!user.email) {
      setEmailError("Email is required");
      isValid = false;
    } else {
      setEmailError("");
    }
    if (user.phone) {
      if (user.phone.length != 10) {
        setPhoneError("Invalid phone number")
        isValid = false;
      }
    }
    if (!user.phone) {
      setPhoneError("Phone is required");
      isValid = false;
    }

    if (!isValid) {
      window.scrollTo(0, 0)
    }
    return isValid;
  };
  const addRole = async (role) => {
    if (role.newPassword.length < 6) {
      toast.error('password must be min 6 charcters', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
      return
    }
    const response = await axios.put(`${url}api/admin/admin/change-password/${user.id}`, role, { headers });

    if (response.status === 200) {

      toast.success(' Password changed successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
      // getRoles()
    }
    closeModal();
  };

  const openModal = (mode, role) => {
    setModalMode(mode);

    setIsOpen(true);
  };

  const closeModal = () => {
    setModalMode("");

    setIsOpen(false);
  };
  const getContacts = async (value = active) => {
    setActive(value === active ? null : value);
  };

  const handleUploadButtonClick = () => {
    // Trigger the file input when the label is clicked
    fileInputRef.current.click();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return
    }


    try {
      //       var form_data = new FormData();
      // for ( var key in user ) {
      //     form_data.append(key, user[key]);
      // }

      const response = await axios.put(`${url}api/admin/admin/change-realtor/${user.id}`, user, { headers });
      setMsg(response.data.message)
      navigate("/")
      toast.success("User data updated successfully", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="add_property_btn">
      <div className="inner-pages-top">

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
        >
          {modalMode === "add" && (
            <AddRoleForm onAdd={addRole} onCancel={closeModal} />
          )}


        </Modal>
        <h3>My Profile</h3>

      </div>

      <>
        {msg.length > 0 && <p style={{ color: "red" }}>{msg}</p>}
        <form onSubmit={handleSubmit} className="profile-page-form">

          <div className="profilepg-top-from-cnt">
            <div className="profile-bg">
              <img src="/profile-cover.png" />
              {/* <button>Edit cover</button> */}
            </div>


            <div className="profile-cntnt-blck">
              <div className="img-display-blck">
                {previewImage ? (
                  <img className="profile-img" src={previewImage} alt="User Preview" />
                ) : (
                  <img className="profile-img" src={user.profileImg} alt="User Placeholder" />
                )}
                <div className="user-image">

                  <label onClick={handleUploadButtonClick}>
                    <img src="/change.svg" alt="Change Image" />
                  </label>
                  <div style={{ display: 'none' }}>
                    <input ref={fileInputRef} name="image" type="file" onChange={handleInput} />
                  </div>
                </div>
              </div>
              <div className="admin-name-pg"><p>Hello, <span>{user.username}</span></p></div>

            </div>


          </div>

          <div className="profilepg-btm-from-cnt">

            <div className="form-devider">

              <div className="input-feilds">

                <div className="add-social-icon">
                  <label>Name
                    <input
                      name="name"
                      type="text"
                      defaultValue={user.name}
                      placeholder={"Name"}
                      onChange={handleInput}
                    />
                    <span style={{ color: "red" }} className="error-message">{nameError}</span>
                  </label>
                  <label>Email
                    <input
                      name="email"
                      type="email"
                      defaultValue={user.email}
                      placeholder={"Your email"}
                      onChange={handleEmailChange}
                    />
                    <span style={{ color: "red" }} className="error-message">{emailError}</span>
                  </label>

                  <label>Phone Number

                    <InputMask
                      mask="+1 (999) 999-9999"
                      type="text"
                      name="phone"
                      value={user.phone}
                      onChange={handlePhoneNumberChange}
                      placeholder="+1 (___) ___-____"

                    />
                    <span style={{ color: "red" }} className="error-message">{phoneError}</span>
                  </label>

                  <label><button onClick={(e) => {
                    e.preventDefault()
                    openModal("add")
                  }}> Change Password</button></label>

                  <Modal className='login-modal' show={show}

                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button style={{ border: "none", background: "transparent" }} onClick={handleClose} ><img className='img-fluid' src="/images/cross.png" /></button>

                    </div>

                  </Modal>
                </div>

                <div className="add-social-icon">
                  <label>Facebook
                    <input
                      name="fb"
                      type="text"
                      defaultValue={user.fb}

                      onChange={handleInput}
                    />
                  </label>

                  <label>Instagram
                    <input
                      name="insta"
                      type="text"
                      defaultValue={user.insta}

                      onChange={handleInput}
                    />
                  </label>


                  <label>Twitter
                    <input
                      name="twitter"
                      type="text"
                      defaultValue={user.twitter}

                      onChange={handleInput}
                    />
                  </label>



                  <label>Tiktok
                    <input
                      name="tiktok"
                      type="text"
                      defaultValue={user.tiktok}

                      onChange={handleInput}
                    />
                  </label>
                  <div className="profile-btm-cnt-last-line">
                    {user.isPay == 0 && <span className="for-bussiness" style={{ "color": "red" }}>For business profiles only</span>}
                    <div className="add-contact-user-custom-right">
                      <div className="form-user-add-inner-wrap">
                        <label style={{ "padding-bottom": "10px" }}>Referral Description</label>
                        <CKEditor
                          editor={ClassicEditor}
                          data={user?.referral_description || ""} // Provide a default value if user?.referral_description is null or undefined
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setUser({ ...user, referral_description: data });
                          }}
                          config={{
                            toolbar: ["heading", "|", "bold", "italic", "link", "|", "bulletedList", "numberedList", "|", "undo", "redo"],
                          }}
                          disabled={user.isPay == 0 ? "false" : "true"}
                          className="custom-ckeditor"
                          style={{ width: "100%", maxWidth: "800px", height: "200px" }}
                        />
                      </div>
                   </div>

                    <div className="profile-btm-cnt-last-line-right">
                      <label>Referral Amount
                        <input
                          name="referal_amount"
                          type="number"
                          value={user.referal_amount}
                          step="0.01"
                          onChange={handleInput}
                          disabled={user.isPay == 0 ? "false" : "true"}
                        />
                        <span style={{ color: "red" }} className="error-message">{phoneError}</span>
                      </label>
                      <div style={{ textAlign: 'center' }} className="custom_profile_btn">
                        <button className="btn-save" type="submit">Save</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </>
      <div className="add_user_btn profile-page-btm-tabs-ind">


        {/* <button
            className={active == 2 ? "active" : ""}
            onClick={() => getContacts(2)}
          >
            Users <span>{active == 2 ?"-":"+"}</span>
          </button> */}
        {active == 2 &&
          <Realtor />
        }
        <button
          className={active == 3 ? "active" : ""}
          onClick={() => getContacts(3)}
        >
          Suppliers <span>{active == 3 ? "-" : "+"}</span>
        </button>
        {active == 3 &&
          <Vendor />
        }
        <button
          className={active == 4 ? "active" : ""}
          onClick={() => getContacts(4)}
        >
          My Categories <span>{active == 4 ? "-" : "+"}</span>
        </button>
        {active == 4 &&
        <Category />
      }
        <button
          className={active == 5 ? "active" : ""}
          onClick={() => getContacts(5)}
        >
          Profession <span>{active == 5 ? "-" : "+"}</span>
        </button>
        {active == 5 &&
       <Profession/>
      }
      </div>
    </div>
  );
}

