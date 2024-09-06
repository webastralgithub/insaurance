import './Login.css';
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from './context/AuthContext';
import { Message, toaster } from 'rsuite';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isValid } from 'rsuite/esm/utils/dateUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [password, setPassword] = useState({
        newPassword: "",
        confirmPassword: ""
    })


    const [token, setToken] = useState('')
    const [email, setEmail] = useState('')


    //e23ce23498a366f3914ce4d567c1ffee77bee3b6c9616d49ffc9ed98153d011e&email=ajay@yopmail.com

    useEffect(() => {
        let [tokenPart, emailPart] = id?.split('&');
        setToken(tokenPart)
        setEmail(emailPart.split('=')[1]);
    }, [id])


    const handleChange = (e) => {
        const { name, value } = e.target;
        setPassword({ ...password, [name]: value });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password.newPassword) {
            toast.error("Please Enter New Password")
            return
        }

        if (!password.confirmPassword) {
            toast.error("Please Enter Confirm Password")
            return
        }

        if (password.newPassword !== password.confirmPassword) {
            toast.error("Password annd Confirm Password are Not Same")
            return
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}api/reset-password`, {
                token: token,
                email: email,
                password: password.newPassword,
                password_confirmation: password.confirmPassword

            })
            if (response.status === 200) {
                toast.success("Password is Changed.Please Login With New Password")
                navigate("/");
            }

        } catch (error) {
            toast.error("Server is Busy");
            console.error(error);

        }
    };

    return (


        <div className="login-form">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>New Password</label>
                    <input
                        type="password"
                        placeholder='Please Enter New Password'
                        name="newPassword"
                        value={password.newPassword}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder='Please Enter Confirm Password ...'
                        value={password.confirmPassword}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">Reset Password</button>

            </form>
        </div>

    )
}

export default ResetPassword
