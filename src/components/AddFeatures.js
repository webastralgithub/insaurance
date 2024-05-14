import React, { useState, useContext } from "react";

import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddFeatures = () => {
    const { auth } = useContext(AuthContext);
    const url = process.env.REACT_APP_API_URL;
    const headers = {
        Authorization: auth.token,
    };
    const navigate = useNavigate()

    const [errors, setErrors] = useState({
        title: "",
        limit: "",
        short_description: "",
        page: ""
    });

    const [formData, setFormdata] = useState({
        title: "",
        limit: "",
        short_description: "",
        page: ""
    })


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormdata(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ""
        }));
    };

    const createPlan = async (e) => {
        e.preventDefault()
        let newErrors = {};
        // Check if any field is empty
        Object.keys(formData).forEach(key => {
            if (formData[key].trim() === "") {
                newErrors[key] = `${key.replace('_', ' ')} is required`;
            }
        });
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return
        }

        const sendformData = {
            name :formData.title,
            set_limit :formData.limit,
            short_description : formData.short_description ,
            page : formData.page

        }
        try {
       
            const response = await axios.post(`${url}api/limit`, sendformData, { headers });
            const responseData = response.data;
            setFormdata({
                name: "",
                limit: "",
                short_description: "",
                page: ""
            })

            navigate("/upgrade-plan")
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="manage-configr-table ">
            <div className="manage-cross-btn">
                <h3 className="heading-category-group-contacts">Add Configuration
                    <img
                        className="close-modal-share"

                        src="/plus.svg"
                    /></h3>

            </div>
            <form onSubmit={createPlan} className="form-user-add form-add-lead add-configr-form">

                <div className="form-user-add-wrapper">

                    <div className="form-user-add-inner-wrap">
                        <label>Title <span style={{ color: 'red' }} className="required-star">*</span></label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                        {errors.title && <span style={{ color: 'red' }}>{errors.title}</span>}
                    </div>


                    <div className="form-user-add-inner-wrap">
                        <label>Limit</label>
                        <input
                            type="text"
                            name="limit"
                            value={formData.limit}
                            onChange={handleChange}
                        /> {errors.limit && <span style={{ color: 'red' }}>{errors.limit}</span>}
                    </div>

                    <div className="form-user-add-inner-wrap">
                        <label>Description</label>
                        <input
                            type="text"
                            name="short_description"
                            value={formData.short_description}
                            onChange={handleChange}
                        /> {errors.short_description && <span style={{ color: 'red' }}>{errors.short_description}</span>}
                    </div>
                    <div className="form-user-add-inner-wrap">
                        <label>Page</label>
                        <select
                            name="page"
                            value={formData.page}
                            onChange={handleChange}
                        >
                            <option value="">Select Option</option>
                            <option value="todo">To-Do</option>
                            <option value="leads">Leads</option>
                            <option value="contacts">Contacts</option>
                            <option value="referrals">Referrals</option>
                        </select>{errors.page && <span style={{ color: 'red' }}>{errors.page}</span>}

                    </div>

                </div>
                <div className="form-user-add-inner-btm-btn-wrap">
                    <button type="submit" >Save</button>
                </div>
            </form>
        </div>
    )
}

export default AddFeatures
