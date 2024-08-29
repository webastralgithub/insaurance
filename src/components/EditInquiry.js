import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Select from "react-select";


const EditInquiry = () => {
    const { id } = useParams();
    const location = useLocation();
    const { data } = location.state;
    const [profession, setProfession] = useState([])
    const [seletedProfession, setSeletedProfession] = useState([])



    const [errors, setErrors] = useState({
        seletedProfession: '',
        descriptionError: ''
    });

    const navigate = useNavigate();
    const [contact, setContact] = useState(data?.description);

    const url = process.env.REACT_APP_API_URL;
    const { auth } = useContext(AuthContext);
    const headers = {
        Authorization: auth.token,
    };

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
                cursor: "pointer",
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
        const getProfession = async () => {
            try {
                const res = await axios.get(`${url}api/profession`, { headers });
                const options = res.data.map((realtor) => ({
                    value: realtor.id,
                    label: realtor.name,
                }));
                setProfession(options)
                const matchedprofession = options?.find(insurance => insurance.value === data.profession_id);
                setSeletedProfession(matchedprofession)


            } catch (error) {
                console.error("User creation failed:", error);
            }
        };
        getProfession()
    }, []);



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!seletedProfession.value) {
            toast.error("please Select a Profession")
            return
        }

        if (!contact) {
            toast.error("please enter your Inquiry")
            return
        }

        let updatedData = {
            profession_id: seletedProfession.value,
            description: contact,
        }

        try {

            const response = await axios.put(`${url}api/inquiry/${data.id}`, updatedData, {
                headers,
            });
            if (response.status === 200) {
                toast.success("Inquiry updated successfully", {
                    autoClose: 2000,
                    position: toast.POSITION.TOP_RIGHT,
                });
                navigate("/inquiries")
            } else {
                console.error("Failed to update contact");
            }
        } catch (error) {
            console.error(error)
            toast.error("Server is Busy")
        }


    }
    return (
        <div className="div-add-contact-parent"  >
            <form onSubmit={handleSubmit} className="form-user-add add-task-setion-form"   >
                <div className="property_header header-with-back-btn">
                    <h3> <button type="button" className="back-only-btn" onClick={() => navigate(-1)}> <img src="/back.svg" />
                    </button>Edit Inquiry</h3>
                </div>
                <div className="form-user-add-wrapper">
                    <div className="todo-section">
                        <div className="todo-main-section" >
                            <div className="form-user-add-inner-wrap">
                                <label>I am Lookin For <span className="required-star">*</span>       </label>
                                <img src="/icons-form/Group30055.svg" />
                                <Select
                                    placeholder="Select Profession.."
                                    value={seletedProfession}
                                    onChange={(selectedOption) => {
                                        setErrors({ profession_id: "" })
                                        setSeletedProfession(selectedOption)
                                    }}
                                    options={profession}
                                    components={{
                                        DropdownIndicator: () => null,
                                        IndicatorSeparator: () => null
                                    }}
                                    styles={colourStyles}
                                    className="select-new"
                                />
                            </div>
                            <div className="form-user-add-inner-wrap">
                                <label>Description <span className="required-star">*</span></label>
                                <input

                                    type="text"
                                    name="Followup"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    placeholder='Enter your Inquiry Here'
                                />
                                <span className="error-message">{""}</span>
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

export default EditInquiry
