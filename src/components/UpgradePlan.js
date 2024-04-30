import React, { useState, useContext } from 'react';
import { AuthContext } from "./context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import './Upgradeplan.css'
import { useCreditCardValidator, images } from 'react-creditcard-validator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';


const UpgradePlan = () => {
    const url = process.env.REACT_APP_API_URL;
    const { auth } = useContext(AuthContext);
    const headers = {
        Authorization: auth.token,
    };

    const[errors, setErrors] = useState('')
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
        setFormData({
            ...formData,
            [name]: value
        });

    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        let isValid = true;
        const newErrors = {};
    
        if (formData.name.trim() === '') {
            newErrors['name'] = 'Name is required';
            isValid = false;
        } else if (!/^[A-Za-z ]+$/.test(formData.name)) {
            newErrors['name'] = 'Name can only contain letters';
            isValid = false;
        }
    
        // Update errors state with new errors
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
        }
        console.log("card data", cardData);
        try {
            const response = await axios.post(`${url}api/subscribe`, cardData, { headers });
            if (response.status === 200) {
                toast.success(response.data.message);
                
            }
            // setFormData({
            //     name: '',
            //     number: '',
            //     expiryDate: '',
            //     cvc: '',
            // })
            console.log("form data" , formData);

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
                        <h3>Plan Details</h3>
                        <div className='payment-amount'>
                            <p>Total amount</p>
                            <span>$10.00</span>


                        </div>
                        <div className='upgradre-plan-description'>
                            <h4>Product description:</h4>
                            <div className='product-list'>
                                <FontAwesomeIcon icon={faCheck} />
                                <li>Unlimited Contacts</li>
                            </div>
                            <div className='product-list'>
                                <FontAwesomeIcon icon={faCheck} />
                                <li>Unlimited Leads</li>
                            </div>
                            <div className='product-list'>
                                <FontAwesomeIcon icon={faCheck} />
                                <li>Unlimited Todo</li>
                            </div>
                            <div className='product-list'>
                                <FontAwesomeIcon icon={faCheck} />
                                <li>Unlimited Campaigns</li>
                            </div>
                            <div className='product-list'>
                                <FontAwesomeIcon icon={faCheck} />
                                <li>Unlimited Referrals</li>
                            </div>
                        </div>




                    </div>

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
                            {/* <div className="input-group">
                            <label>Name on Card</label>
                            <input type='text' name="nameOnCard" />
                            <small>{erroredInputs.nameOnCard && erroredInputs.nameOnCard}</small>
                        </div> */}

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

                        </div>
                        <button type="submit">Pay</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default UpgradePlan