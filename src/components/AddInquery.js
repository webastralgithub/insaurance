import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddInquery = () => {
    const navigate = useNavigate();
    const [contact, setContact] = useState({
        Followup: "",
        FollowupDate: "",
        Comments: "",
        IsRead: false,
        ContactID: "",
    });
    const [nameError, setnameError] = useState("")
    const url = process.env.REACT_APP_API_URL;
    const { auth } = useContext(AuthContext);
    const headers = {
        Authorization: auth.token,
    };

    const [post, setPost] = useState({
        name: "",
        title: "",
        description: "",
    });
    const [error, setError] = useState("");


    const handleChange = (e) => {
        const { name, value } = e.target;

        setContact({ ...contact, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            toast.success("Inquery Added Succesfully")
            navigate("/inquires")
        } catch (error) {
            toast.error("Server is Busy")
            console.error(error)
        }
    }
    return (
        <div className="div-add-contact-parent" style={{ position: 'relative' }} >
            <form onSubmit={handleSubmit} className="form-user-add add-task-setion-form"   >
                <div className="property_header header-with-back-btn">
                    <h3> <button type="button" className="back-only-btn" onClick={() => navigate(-1)}> <img src="/back.svg" />
                    </button>Add Inquery</h3>

                </div>
                <div className="form-user-add-wrapper">
                    <div className="todo-section">
                        <div className="todo-main-section">
                            <div className="form-user-add-inner-wrap">

                                <label>Inquery Title <span className="required-star">*</span></label>
                                <input

                                    type="text"
                                    name="Followup"
                                    value={contact.Followup}
                                    onChange={handleChange}

                                />
                                <span className="error-message">{""}</span>
                            </div>


                            <div className="form-user-add-inner-wrap">
                                <label>Inquery description</label>
                                <input

                                    type="text"
                                    name="description"
                                    value={contact.description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>


                    </div>

                </div>
                <div className="form-user-add-inner-btm-btn-wrap">
                    <button type="submit" >Save</button>
                </div>
            </form>
        </div>
    )
}

export default AddInquery
