import React, { useState, useContext } from "react";

import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";



const FeatureUpdate = (props) => {
    const location = useLocation();
    const { data } = location.state;
    const { auth } = useContext(AuthContext);
    const url = process.env.REACT_APP_API_URL;
    const headers = {
        Authorization: auth.token,
    };
    const navigate = useNavigate()

    const [errors, setErrors] = useState({
        id: "",
        name: "",
        set_limit: "",
        short_description: "",
        page: ""
    });

    const [formData, setFormdata] = useState({
        id: data?.id,
        name: data?.name,
        set_limit: data?.set_limit,
        short_description: data?.short_description,
        page: data?.page
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

    const updatePlanData = async (e) => {
        e.preventDefault()
        // let newErrors = {};
        // // Check if any field is empty
        // Object.keys(formData).forEach(key => {
        //     if (formData[key].trim() === "") {
        //         newErrors[key] = `${key.replace('_', ' ')} is required`;
        //     }
        // });
        // if (Object.keys(newErrors).length > 0) {
        //     setErrors(newErrors);
        //     return
        // }

        let updatedData = {
            name: formData.name,
            set_limit: formData.set_limit,
            short_description: formData.short_description,
            page: formData.page
        }

        try {

            const response = await axios.patch(`${url}api/update-limit/${formData.id}`, updatedData, { headers });
            const responseData = response.data;
            setFormdata({
                id: "",
                name: "",
                set_limit: "",
                short_description: "",
                page: ""
            })

            navigate("/upgrade-plan")
        } catch (error) {
            toast.error("error when updating data")
            console.error(error);
        }
    }


    return (
        <div className="manage-configr-table ">
            <div className="manage-cross-btn">
                <h3 className="heading-category-group-contacts">Update configuration
                    <img
                        className="close-modal-share"
                        src="/plus.svg"
                    /></h3>

            </div>
            <form onSubmit={updatePlanData} className="form-user-add form-add-lead add-configr-form">

                <div className="form-user-add-wrapper">

                    <div className="form-user-add-inner-wrap">
                        <label>Title <span className="required-star">*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
                    </div>


                    <div className="form-user-add-inner-wrap">
                        <label>Limit</label>
                        <input
                            type="text"
                            name="set_limit"
                            value={formData.set_limit}
                            onChange={handleChange}
                        /> {errors.set_limit && <span style={{ color: 'red' }}>{errors.set_limit}</span>}
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
                            <option value={formData.page}>{formData.page}</option>
                            <option value="todo">To-Do</option>
                            <option value="leads">Leads</option>
                            <option value="contacts">Contacts</option>
                            <option value="referrals">Referrals</option>
                        </select>{errors.page && <span style={{ color: 'red' }}>{errors.page}</span>}

                    </div>

                </div>
                <div className="form-user-add-inner-btm-btn-wrap">
                    <button type="submit" >Update Features</button>
                </div>
            </form>
        </div>
    )
}






export default FeatureUpdate
