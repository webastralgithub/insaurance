// src/components/Login.js
import './Login.css';
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from './context/AuthContext';
import { Message, toaster } from 'rsuite';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

  const { auth, setAuth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the login API endpoint
      const response = await axios.post(`${process.env.REACT_APP_API_URL}api/auth/login`, formData);

      // Extract the token from the response data
      const token = response.data.token;

      // Store the token in local storage or context for authentication
      setAuth({ token: `Bearer ${token}` });
      localStorage.setItem('token', `Bearer ${token}`);
      localStorage.setItem("id", response.data.details.id)
      localStorage.setItem("email", response.data.details.email)
      localStorage.setItem("name", response.data.details.name)
      localStorage.setItem("roleId", response.data.details.roleId)
      let plan = localStorage.setItem("plan", response.data.details.plan);
      // Show a success message to the user using react-toastify
      // toast.success('Login was successful', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });

      // Navigate to the "/property" page (assuming "navigate" is a function that does this)
      navigate("/");
    } catch (error) {
      // Handle login failure
      console.error("Login failed:", error.response.data.error);
      toast.error(error.response.data.error, { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
      // You may want to display an error message to the user here
    }
  };


  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
