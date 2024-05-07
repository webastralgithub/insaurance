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
