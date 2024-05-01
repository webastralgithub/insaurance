import React, { useState, useContext } from 'react';
import { AuthContext } from "./context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import './Upgradeplan.css'
import { useCreditCardValidator, images } from 'react-creditcard-validator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Modal from "react-modal";

const UpgradePlan = () => {
    const url = process.env.REACT_APP_API_URL;
    const { auth } = useContext(AuthContext);
    const headers = {
        Authorization: auth.token,
    };

    const [errors, setErrors] = useState('')
    const [selectMonth, setSelectMonth] = useState()
    const [modalIsOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        expiryDate: '',
        cvc: '',
    });

    function expDateValidate(month, year) {
        if (Number(year) > 2035) {
            return 'Expiry Date Year cannot be greater than 2035';
        }
        return;
    }

    const {
        getCardNumberProps,
        getCardImageProps,
        getCVCProps,
        getExpiryDateProps,
        meta: { erroredInputs }
    } = useCreditCardValidator({ expiryDateValidator: expDateValidate });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name == "name" && value != '') {
            setErrors('');
        }
        setFormData({
            ...formData,
            [name]: value
        });

    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        let isValid = true;
        const newErrors = {};

        if (formData.name.trim() === '' || formData.number.trim() === '' || formData.expiryDate.trim() === '' || formData.cvc.trim() === '') {
            isValid = false;
        }

        if (formData.name.trim() === '') {
            newErrors['name'] = 'Name is required';
            isValid = false;
        } else if (!/^[A-Za-z ]+$/.test(formData.name)) {
            newErrors['name'] = 'Name can only contain letters';
            isValid = false;
        }
        setErrors(newErrors);
        if (!isValid) {
            return; // Exit the function if name field is invalid
        }

        const extract = formData.expiryDate
        const [month, year] = extract.split(' / ');
        const cardData = {
            name: formData.name,
            card_number: formData.number,
            exp_year: year,
            exp_month: month,
            cvc: formData.cvc,
            plan_month: selectMonth
        }

        try {
            const response = await axios.post(`${url}api/subscribe`, cardData, { headers });
            if (response.status === 200) {
                toast.success(response.data.message);
            } else {
                console.error("error while doing payment")
            }

        } catch (error) {
            toast.error("error in payment")
        }
    }

    return (
        <>
            <div className="add_property_btn upgrade-plan">
                <div className="inner-pages-top upgrade-plan-heading">
                    <h3>Upgrade Plan</h3>
                </div>
                <div className='plan-deatls-n-form'>
                    <div className='plan-details'>

                        <section id="" className="features pricing-plan-sec">
                            <div className="container" data-aos="fade-up">
                                <div className="row">
                                    <div className="pricing-table-pnts">
                                        <table className="table" style={{ textAlign: 'center', paddingLeft: '200px', paddingRight: '200px' }}>
                                            <thead>
                                                <tr className="active">
                                                    <th className="td-width-wide" style={{ color: "rgb(0 63 125)" }}>CRM</th>
                                                    <th style={{ background: "#67b733" }}>
                                                        <center>
                                                            <h3>Basic</h3>
                                                        </center>
                                                    </th>
                                                    <th style={{ background: "rgb(0 63 125)" }}>
                                                        <center>
                                                            <h3>Premium</h3>
                                                        </center>
                                                    </th>
                                                    {/* <th style={{ background: "#0c579a" }}>
                                                        <center>
                                                            <h3>Ultimate</h3>
                                                        </center>
                                                    </th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="tble-td-left">
                                                        Contact management
                                                        <span>
                                                            House all your client activity, data, and communications in one easily
                                                            accessible place
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                            className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                            <path
                                                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                        </svg>
                                                    </td>
                                                    <td className="border-botheside">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                            className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                            <path
                                                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                        </svg>
                                                    </td>
                                                    {/* <td>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                            className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                            <path
                                                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                        </svg>
                                                    </td> */}
                                                </tr>

                                                <tr>
                                                    <td className="tble-td-left">
                                                        Contact management
                                                        <span>
                                                            House all your client activity, data, and communications in one easily
                                                            accessible place
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                            className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                            <path
                                                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                        </svg>
                                                    </td>
                                                    <td className="border-botheside">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                            className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                            <path
                                                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                        </svg>
                                                    </td>
                                                    {/* <td>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                            className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                            <path
                                                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                        </svg>
                                                    </td> */}
                                                </tr>

                                                <tr>
                                                    <td className="tble-td-left">
                                                        Contact segmentation (tags)
                                                        <span>
                                                            Use tags to prioritize your hottest leads and close more deals
                                                        </span>
                                                    </td>
                                                    <td>

                                                    </td>
                                                    <td className="border-botheside">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                            className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                            <path
                                                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                        </svg>
                                                    </td>
                                                    {/* <td>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                            className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                            <path
                                                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                        </svg>
                                                    </td> */}
                                                </tr>

                                                <tr>
                                                    <td className="tble-td-left">
                                                        Contact lists, filters, and saved searches
                                                        <span>
                                                            Create custom lists within your contacts, filter your contacts easily, and send
                                                            the right messages to the right contacts.
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                            className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                            <path
                                                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                        </svg>
                                                    </td>
                                                    <td className="border-botheside">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                            className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                            <path
                                                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                        </svg>
                                                    </td>
                                                    {/* <td>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                            className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                            <path
                                                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                        </svg>
                                                    </td> */}
                                                </tr>

                                                <tr>
                                                    <td className="tble-td-left">
                                                        Custom fields
                                                        <span>
                                                            Store business-specific information on the contact or company record
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="td-value">100</span>
                                                    </td>
                                                    <td className="border-botheside">
                                                        <span className="td-value">150</span>
                                                    </td>
                                                    {/* <td>
                                                        <span className="td-value">150</span>
                                                    </td> */}
                                                </tr>

                                                <tr>
                                                    <td className="tble-td-left">
                                                        Lead source tracking
                                                        <span>
                                                            Easily segment leads based on where they came from so you know the sources of
                                                            your most valuable clients
                                                        </span>
                                                    </td>
                                                    <td>

                                                    </td>
                                                    <td className="border-botheside">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                            className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                            <path
                                                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                        </svg>
                                                    </td>
                                                    {/* <td>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                            className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                            <path
                                                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                        </svg>
                                                    </td> */}
                                                </tr>
                                                <button onClick={() => setIsOpen(true)}>Choose Plan</button>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </section>

                        <section className="info-img">
                            <div className="container" data-aos="fade-up">
                                <div className="row">
                                    <div className="col-md-12">
                                        <img src="{{asset('frontend/img/features-6.png')}}" className="img-fluid" alt="" />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="add_property_btn upgrade-plan">
                        <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={() => setIsOpen(false)}
                        >
                            <form onSubmit={handleSubmit} >
                                <h2>Card Details</h2>
                                <div className="input-group">
                                    <label>Card Holder Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Name"
                                    /> {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
                                </div>
                                <div className="input-group">

                                    <svg {...getCardImageProps({ images })} />
                                    <label>Card Number</label>

                                    <input {...getCardNumberProps({ onChange: handleChange })} name="number" />
                                    <small>{erroredInputs.cardNumber && erroredInputs.cardNumber}</small>
                                </div>
                                <div className="multi-input">
                                    <div className="input-group">
                                        <label>Name on Card</label>
                                        <input type='text' name="nameOnCard" />
                                        <small>{erroredInputs.nameOnCard && erroredInputs.nameOnCard}</small>
                                    </div>

                                    <div className="input-group">
                                        <label>Valid Till</label>
                                        <input {...getExpiryDateProps({ onChange: handleChange })} name="expiryDate" />
                                        <small>{erroredInputs.expiryDate && erroredInputs.expiryDate}</small>
                                    </div>

                                    <div className="input-group">
                                        <label>CVC</label>
                                        <input {...getCVCProps({ onChange: handleChange })} name="cvc" />
                                        <small>{erroredInputs.cvc && erroredInputs.cvc}</small>
                                    </div>
                                    <div className="input-group">
                                        <select value={selectMonth} onChange={(e) => setSelectMonth(e.target.value)}>
                                            <option value="">Billing Period</option>
                                            <option value="1">1 Month</option>
                                            <option value="3">3 Month</option>
                                            <option value="6">6 Month</option>
                                            <option value="9">9 Month</option>
                                        </select>
                                    </div>

                                </div>
                                {selectMonth == "" || errors.name || erroredInputs.cvc || erroredInputs.expiryDate || erroredInputs.cardNumber ? <button disabled type="button">Pay</button> : <button type="submit">Pay</button>}
                            </form>
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpgradePlan