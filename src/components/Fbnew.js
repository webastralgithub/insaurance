
import React from 'react';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
import { toast } from 'react-toastify';

const YourComponent = ({url,headers}) => {
  const responseFacebook = async(facebookLoginResponse) => {

    const responseObject = {
        name: facebookLoginResponse.name,
        email: facebookLoginResponse.email,
        userID: facebookLoginResponse.userID,
        accessToken: facebookLoginResponse.accessToken,
        type: "facebook"
    };
    if(facebookLoginResponse.name){
    try {
        const response = await axios.post(`${url}api/social/create`, responseObject, {
          headers,
        });
  
        if (response.status === 200) {
            toast.success('User added successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT })
          // Contact added successfully
        //   navigate("/todo-list"); // Redirect to the contacts list page
        } else {
          console.error("Failed to add contact");
        }
      } catch (error) {
        toast.error(error.response.data.message, { autoClose: 3000, position: toast.POSITION.TOP_RIGHT })
        console.error("An error occurred while adding a contact:", error);
      }
    }
  };

  return (

    <div>
      <FacebookLogin
        appId="255596625009891"
        
        autoLoad={false}
        fields="name,email,picture,friends"
        callback={responseFacebook}
        textButton="Add User Facebook"
      />
    </div>
  );
};

export default YourComponent;
