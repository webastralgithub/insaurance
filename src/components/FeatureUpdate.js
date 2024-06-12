import React, { useState, useContext } from "react";

import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { isValid } from "rsuite/esm/utils/dateUtils";

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
    const [errorsName, setErrorsName] = useState("")
    const [errorsLimit, setErrorsLimit] = useState("")
    const [errorsDescription, setErrorsDescription] = useState("")
    const [errorsPage, setErrorsPage] = useState("")

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormdata(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrorsPage("")
        setErrorsDescription("")
        setErrorsName("")
        setErrorsLimit("")
    };

    const validateFields = () => {
        let isValid = true;

        if (!formData?.name) {
            setErrorsName("Name should not be empty");
            isValid = false;
        } else if (!/^[a-zA-Z\s,.]+$/.test(formData.name)) {
            setErrorsName("Name should contain only letters");
            isValid = false;
        } else {
            setErrorsName("");
        }

        if (!formData?.short_description) {
            setErrorsDescription("Description should not be empty");
            isValid = false;
        } else if (!/^[a-zA-Z\s,.]+$/.test(formData.short_description)) {
            setErrorsDescription("Description should contain only letters");
            isValid = false;
        } else {
            setErrorsDescription("");
        }

        if (!formData?.set_limit) {
            setErrorsLimit("Limit should not be empty");
            isValid = false;
        } else if (!/^\d+$/.test(formData.set_limit)) {
            setErrorsLimit("Limit should contain only numbers");
            isValid = false;
        } else {
            setErrorsLimit("");
        }

        return isValid;
    };

    const updatePlanData = async (e) => {
        e.preventDefault()

        let updatedData = {
            name: formData.name,
            set_limit: formData.set_limit,
            short_description: formData.short_description,
            page: formData.page
        }

        try {
            if (validateFields()) {
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
            }
        } catch (error) {
            toast.error("error when updating data")
            console.error(error);
        }
    }


    return (
        <div className="manage-configr-table ">
            <div className="manage-cross-btn">

                <h3 className="heading-category-group-contacts">
                    <button className="back-only-btn"
                        onClick={() => {
                            navigate(-1);
                        }}
                    > <img src="/back.svg" />
                    </button>
                    Update configuration
                    <img
                        className="close-modal-share"
                        src="/plus.svg"
                    /></h3>
            </div>

            <form onSubmit={updatePlanData} className="form-user-add form-add-lead add-configr-form">
                <div className="form-user-add-wrapper">
                    <div className="form-user-add-inner-wrap">
                        <label>Title <span className="required-star" style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errorsName && <span className="error-message" style={{ color: 'red' }}>{errorsName}</span>}
                    </div>
                    <div className="form-user-add-inner-wrap">
                        <label>Limit<span className="required-star" style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            name="set_limit"
                            value={formData.set_limit}
                            onChange={handleChange}
                        /> {errorsLimit && <span className="error-message" style={{ color: 'red' }}>{errorsLimit}</span>}
                    </div>

                    <div className="form-user-add-inner-wrap">
                        <label>Description<span className="required-star" style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            name="short_description"
                            value={formData.short_description}
                            onChange={handleChange}
                        /> {errorsDescription && <span className="error-message" style={{ color: 'red' }}>{errorsDescription}</span>}
                    </div>
                    <div className="form-user-add-inner-wrap">
                        <label>Page<span className="required-star" style={{ color: 'red' }}>*</span></label>
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
                        </select>{errorsPage && <span className="error-message" style={{ color: 'red' }}>{errorsPage}</span>}

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
