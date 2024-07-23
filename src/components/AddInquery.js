import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Select from "react-select";
import { queries } from '@testing-library/react';

const AddInquery = () => {

    const [profession, setProfession] = useState([])
    const [seletedProfession, setSeletedProfession] = useState([])
    const [query, setQuery] = useState([])
    const [errors, setErrors] = useState({
        seletedProfession: ''
    });

    const navigate = useNavigate();
    const [contact, setContact] = useState({
        Followup: "",
        FollowupDate: "",
        Comments: "",
        IsRead: false,
        ContactID: "",
    });

    const url = process.env.REACT_APP_API_URL;
    const { auth } = useContext(AuthContext);
    const headers = {
        Authorization: auth.token,
    };

    const inquries = [
        { value: 1, label: "I'm looking for Plumber" },
        { value: 2, label: "I'm looking for Electrician" },
        { value: 3, label: "I'm looking for Accountant" },
        { value: 4, label: "I'm looking for Real Estate Agent." },


    ]


    const colourStyles = {
        valueContainer: (provided, state) => ({
            ...provided,
            paddingLeft: "10px",
            fontSize: "14px",
            fontWeight: '550',
            color: '#000000e8',
        }),
        control: (styles) => ({ ...styles, border: "unset", boxShadow: "unset", zIndex: "99999", borderColor: "unset", minHeight: "0" }),
        input: (styles) => ({ ...styles, margin: "0px", marginLeft: "123px" }),
        listbox: (styles) => ({ ...styles, zIndex: "99999", }),

        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
                ...styles,
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#fff', // semi-transparent black
                zIndex: 999999,
                backGround: "#fff",
                color: "#000",
                position: "relative",
                cursor :"pointer",
                fontSize: "14px"
            };
        },
        placeholder: (provided, state) => ({
            ...provided,
            color: '#000000e8',
            marginLeft: "10px",
            fontSize: "14px",
            fontWeight: '500'

        })
    };

    useEffect(() => {
        getProfession()
    }, []);


    const getProfession = async () => {
        try {
            const res = await axios.get(`${url}api/profession`, { headers });
            const options = res.data.map((realtor) => ({
                value: realtor.id,
                label: realtor.name,
            }));
            setProfession(options)

        } catch (error) {
            console.error("User creation failed:", error);
        }
    };

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
        <div className="div-add-contact-parent"  >
            <form onSubmit={handleSubmit} className="form-user-add add-task-setion-form"   >
                <div className="property_header header-with-back-btn">
                    <h3> <button type="button" className="back-only-btn" onClick={() => navigate(-1)}> <img src="/back.svg" />
                    </button>Add Inquery</h3>

                </div>
                <div className="form-user-add-wrapper">
                    <div className="todo-section">
                        <div className="todo-main-section" >
                            <div className="form-user-add-inner-wrap">

                                <label>Inquery  <span className="required-star">*</span></label>
                                <input

                                    type="text"
                                    name="Followup"
                                    value={contact.Followup}
                                    onChange={handleChange}
                                    placeholder='Enter your Enquery Here'
                                />
                                <span className="error-message">{""}</span>
                            </div>


                            {/* <div className="form-user-add-inner-wrap">
                                <label>Inquery description</label>
                                <input

                                    type="text"
                                    name="description"
                                    value={contact.description}
                                    onChange={handleChange}
                                />
                            </div> */}

                            {/* <div className="form-user-add-inner-wrap" style={{
                                background: '#fff',
                                zIndex: 999999
                            }}>
                                <label>Inquery <span className="required-star">*</span></label>
                                <img src="/icons-form/Group30055.svg" />
                                <Select
                                    placeholder="Select Inquery .."
                                    value={query}
                                    onChange={(selectedOption) => {
                                        setErrors({ query: "" })
                                        setContact({ ...contact, query: selectedOption.label })
                                        setQuery(selectedOption)
                                    }}
                                    options={inquries}
                                    components={{
                                        DropdownIndicator: () => null,
                                        IndicatorSeparator: () => null
                                    }}
                                    styles={colourStyles}
                                    className="select-new"
                                />
                            </div> */}


                            <div className="form-user-add-inner-wrap">
                                <label>Profession<span className="required-star">*</span>       </label>
                                <img src="/icons-form/Group30055.svg" />
                                <Select
                                    placeholder="Select Profession.."
                                    value={seletedProfession}
                                    onChange={(selectedOption) => {
                                        setErrors({ profession_id: "" })
                                        setContact({ ...contact, profession_id: selectedOption.value })
                                        setSeletedProfession(selectedOption)
                                    }}
                                    options={profession}
                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                    styles={colourStyles}
                                    className="select-new"
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
