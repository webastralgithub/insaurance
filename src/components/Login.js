// src/components/Login.js
import './Login.css';
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from './context/AuthContext';
import { Message, toaster } from 'rsuite';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isValid } from 'rsuite/esm/utils/dateUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Login = () => {

  const { auth, setAuth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate()
  const [formState, setFormState] = useState(0)
  const [myMail, setMyMail] = useState("")
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.clear();
    try {
      // Make a POST request to the login API endpoint
      const response = await axios.post(`${process.env.REACT_APP_API_URL}api/auth/login`, formData);
      const responseData = await response.data.details
      // Extract the token from the response data


      const token = response.data.token;
      setAuth({ token: `Bearer ${token}` });
      localStorage.setItem('token', `Bearer ${token}`);
      localStorage.setItem("id", response.data.details.id)
      localStorage.setItem("email", response.data.details.email)
      localStorage.setItem("name", response.data.details.name)
      localStorage.setItem("roleId", response.data.details.roleId)
      localStorage.setItem("plan", response.data.details.plan);

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.response.data.error);
      toast.error(error.response.data.error, { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
    }
  };





  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!myMail) {
      toast.error("please enter email")
      return
    }

    let isValidEmail;

    if (isValidEmail === false) {

    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}api/forgot-password`, { email: myMail })
      toast.success("Reset Password Link Sent to your Registered Email")
      setFormState(0)
    } catch (error) {
      toast.error("Server is Busy")
      console.error(error)
    }
  }



  return (
    <>

      {formState === 0 &&
        <>

          <div className="login-form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Email</label>
                <input
                  type="text"
                  placeholder='Please Enter Your Email'
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder='Please Enter Your Password ...'
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <button type="submit">Login</button>
              <button
                type="button"
                name="action"
                value="forgot-password"
                onClick={() => { setFormState(1); setMyMail('') }}
              >
                Forgot Password
              </button>
            </form>
          </div>

        </>
      }


      {formState === 1 &&
        <div className="login-form">
          <h2>Forgot Password</h2>
          <form onSubmit={handleForgotPasswordSubmit}>
            <div>
              <label>Email</label>
              <input
                type="text"
                name="email"
                placeholder='Please Enter Your Email'
                value={myMail}
                onChange={(e) => setMyMail(e.target.value)}
              />
            </div>

            <button type="submit">Submit</button>
            <button
              type="button"
              name="action"
              value="Cancel"
              onClick={() => {
                setFormState(0); setFormData({
                  email: "",
                  password: "",
                })
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />  Back To Login
            </button>
          </form>
        </div>
      }
    </>

  );
};

export default Login;
