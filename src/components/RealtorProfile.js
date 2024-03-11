import React, { useState, useLayoutEffect,useRef, useContext} from "react";



import axios from "axios";



import { AuthContext } from "./context/AuthContext";
import Modal from "react-modal";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import InputMask from 'react-input-mask';

const INITIAL_STATE = {
  
  username: "",
  name:"",
  email: "",

  image:""
};



const AddRoleForm = ({ onAdd, onCancel }) => {
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ newPassword });


  };
  console.log(newPassword)

  return (

    <div className="modal-roles-add">
    <form onSubmit={handleSubmit}>
      <input
       type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
      />
      <button type="submit">Change Password</button>
      <button onClick={onCancel}>Cancel</button>
    </form>
    </div>
  );
};
export default function RealtorProfile() {
  const [user, setUser] = useState(INITIAL_STATE);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [usernameError, setUsernameError] = useState("");
  
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const navigate=useNavigate()
 const {id}=useParams()
 const fileInputRef = useRef(null); // Create a ref for the file input

  const[show,setShow]=useState(false)
  const[msg,setMsg]=useState('')
  const [previewImage, setPreviewImage] = useState('');

  const { auth} = useContext(AuthContext)
  const headers = {
    Authorization: auth.token,
  };
  
  const url = process.env.REACT_APP_API_URL;

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "#000",
      border:"1px solid #fff",
    },
    overlay:{
      backgroundColor: "rgb(0 0 0 / 75%)",
    }
  };
  const addRole = async (role) => {
    console.log(role)
    if(role.newPassword.length<6){
      toast.error('password must be min 6 charcters', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
      return
    }
   const response = await axios.put(`${url}api/admin/admin/change-password/${id}`, role,{headers});

   if (response.status === 200) {
    
    toast.success(' Password changed successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
   // getRoles()
   }
    closeModal();
  };

  useLayoutEffect(() => {
    (async () => {
      try {
        const user = await 
          axios.get(`${url}api/admin/get-realtor/${id}`,{ headers })
     let userData=user.data
console.log(userData)
     setPreviewImage(userData.profileImg)
        setUser({
            username:userData.username,
            name:userData.name,
          email:userData.email,
          phone:userData.phone,
          profileImg:userData.profileImg?user.profileImg:"/placeholder@2x.png",
          tiktok:userData.tiktok,
          twitter:userData.twitter,
          fb:userData.fb,
          insta:userData.insta
        }
          );
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleClose = () => 
  {
    setShow(false);
  }

  const handleInput = async(e) => {
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
      setUser({ ...user,profileImg: uploadedImageUrls[0] }); // Store the image file in the user state
    }
    } else {
      console.log("herrrrrrrrr")
      // Handle other input fields
  
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
  
  const handlePhoneNumberChange = (event) => {
    // Extract the raw phone number from the input
    setPhoneError("")
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");

    // Update the phone number state with the raw input
    setUser({ ...user,phone: rawPhoneNumber.slice(1,11) });
  };



  const openModal = (mode, role) => {
    setModalMode(mode);
 
    setIsOpen(true);
  };
  const goBack = () => {
    navigate(`/users`);
  };
  const closeModal = () => {
    setModalMode("");
 
    setIsOpen(false);
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

      const response = await axios.put(`${url}api/admin/admin/change-realtor/${id}`,user,{headers});
      setMsg(response.data.message)
      navigate(-1)
      toast.success("Owner data updated successfully", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log(error);
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
if(user.email){
  if(!validateEmail(user.email)){
    setEmailError("Invalid email")
}
}
    if (!user.email) {
      setEmailError("Email is required");
      isValid = false;
    } else {
      setEmailError("");
    }
    if(user.phone){
      if(user.phone.length!=10){
        setPhoneError("Invalid phone number")
        isValid = false;
      }
      }
    if (!user.phone) {
      setPhoneError("Phone is required");
      isValid = false;
    }

      if(!isValid){
    window.scrollTo(0,0)
  }
      return isValid;
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
       <h3>
        
       {" "}
            <button  type="button" className="back-only-btn" onClick={goBack}>
              {" "}
              <img src="/back.svg" />
            </button>{" "}
        User profile</h3>
    </div>
    {msg.length>0 &&<p style={{color:"red"}}>{msg}</p>}
      <form onSubmit={handleSubmit} className="profile-page-form">

        <div className="profilepg-top-from-cnt">
            <div className="profile-bg">
               {/* <img src="/cover.png" /> */}
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
    
          <label  onClick={handleUploadButtonClick}>
            <img src="/change.svg" alt="Change Image" />
          </label>
          <div style={{ display: 'none' }}>
            <input ref={fileInputRef} name="image"  type="file" onChange={handleInput} />
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
                placeholder={"Names"}
                onKeyUp={handleInput}
                />
                 <span style={{color:"red"}} className="error-message">{nameError}</span>
                </label>
                <label>Email
                <input
                name="email"
                type="text"
                defaultValue={user.email}
                placeholder={"Email Id"}
                onKeyUp={handleInput}
                />
                 <span style={{color:"red"}} className="error-message">{emailError}</span> </label>
            
                <label>Phone Number
             
              <InputMask
          mask="+1 (999) 999-9999"
          type="text"
          name="phone"
          value={user.phone}
          onChange={handlePhoneNumberChange}
          placeholder="+1 (___) ___-____"
  
        />
           <span style={{color:"red"}} className="error-message">{phoneError}</span>
            </label>
            <label><button onClick={(e) => 
              {
                e.preventDefault()
              openModal("add")
            
            }}> Change Password</button></label>
            </div>
             
           <div className="add-social-icon">
            <label>Facebook
                <input
                name="fb"
                type="text"
                defaultValue={user.fb}
               
                onKeyUp={handleInput}
                />
                </label>
          
             <label>Instagram
                <input
                name="insta"
                type="text"
                defaultValue={user.insta}
               
                onKeyUp={handleInput}
                />
                </label>
        
   
             <label>Twitter
                <input
                name="twitter"
                type="text"
                defaultValue={user.twitter}
               
                onKeyUp={handleInput}
                />
                </label>
         
              
           
             <label>Tiktok
                <input
                name="tiktok"
                type="text"
                defaultValue={user.tiktok}
               
                onKeyUp={handleInput}
                />
                </label>
                
                </div>
         
            
                </div>
        </div>

                <div style={{textAlign:'end'}} className="custom_profile_btn">
                <button className="btn-save" type="submit">Save</button>
                </div>
        </div>
      </form>
    </div>
  );
}

