import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from "./context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import './Upgradeplan.css'
import { useCreditCardValidator, images } from 'react-creditcard-validator';
import Modal from "react-modal";
import { Circles } from 'react-loader-spinner'


const UpgradePlan = () => {
    const url = process.env.REACT_APP_API_URL;
    const { auth, setPlan, plan,subscriptionStatus,setSubscriptionStatus } = useContext(AuthContext);
    const headers = {
        Authorization: auth.token,
    };
    const [isLoader, setIsLoader] = useState(false)
    const [errors, setErrors] = useState('')
    const [selectMonth, setSelectMonth] = useState(1)
    const [modalIsOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        expiryDate: '',
        cvc: '',
    });
    const [configData, setconfigData] = useState([])

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
        if (name === "name" && value !== '') {
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
        setIsLoader(true)
        try {

            const response = await axios.post(`${url}api/subscribe`, cardData, { headers });

            if (response.status === 200) {
                toast.success(response.data.message);
                setSubscriptionStatus("active")
                setPlan(2)
                setIsLoader(false)
                setIsOpen(false)
            } else {
                console.error("error while doing payment")
                setIsLoader(false)
            }

        } catch (error) {
            setIsLoader(false)
            toast.error("error in payment")
        }
    }
    const getData = async () => {
        try {
          const response = await axios.get(`${url}api/list-limits`, { headers });
          const responseData = response.data.limits
          setconfigData(responseData);
        } catch (error) {
          console.error("error", error)
        }
      }
      useEffect(() => {
        getData()
      }, [])

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

                                                    <th  style={{ color: "black" , fontSize : '52px' }} className="td-width-wide feature-heading">
                                                        Features
                                                        </th>

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
                                            {configData.length>0 &&
                                               configData.map((data) => ( 
                                                <tr>
                                                    <td className="tble-td-left">
                                                        {data.name}
                                                        <span>
                                                        {data.short_description}
                                                        </span>
                                                    </td>
                                                    <td>{data.set_limit} </td>
                                                    <td className="border-botheside">Unlimited </td>
                                                </tr> ))}

                                                {/* <tr>
                                                    <td className="tble-td-left">
                                                    Leads & Vendors management
                                                        <span>
                                                        Leads will be managed according to categories.Vendors will be your suppliers or companies, which you dealing on frequent basis.
                                                        </span>
                                                    </td>
                                                    <td>10</td>
                                                    <td className="border-botheside">Unlimited  </td>
                                                </tr>

                                                <tr>
                                                    <td className="tble-td-left">
                                                    Categories & Owners
                                                        <span>
                                                        Your own Business categories. You can add or delete Categories also.This will help in giving access to your different employees or agents on restrictive basis.
                                                        </span>
                                                    </td>
                                                    <td>10</td>
                                                    <td className="border-botheside">Unlimited</td>
                                                </tr>

                                                <tr>
                                                    <td className="tble-td-left">
                                                        Contact lists, filters, and saved searches
                                                        <span>
                                                            Create custom lists within your contacts, filter your contacts easily, and send
                                                            the right messages to the right contacts.
                                                        </span>
                                                    </td>
                                                    <td>10</td>
                                                    <td className="border-botheside">Unlimited</td>
                                                </tr>

                                                <tr>
                                                    <td className="tble-td-left">
                                                        Custom fields
                                                        <span>
                                                            Store business-specific information on the contact or company record
                                                        </span>
                                                    </td>
                                                    <td>
                                                        10
                                                    </td>
                                                    <td className="border-botheside">
                                                        Unlimited
                                                    </td>

                                                </tr>

                                                <tr>
                                                    <td className="tble-td-left">
                                                        Lead source tracking
                                                        <span>
                                                            Easily segment leads based on where they came from so you know the sources of
                                                            your most valuable clients
                                                        </span>
                                                    </td>
                                                    <td>10</td>
                                                    <td className="border-botheside">Unlimited
                                                    </td>
                                                </tr> */}

                                            </tbody>
                                        </table>
                                        {plan ===2 ? "" : <button onClick={() => setIsOpen(true)}>Choose Plan</button>}
                                   
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

                    <div className="add_property_btn upgrade-plan ">
                        <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={() => setIsOpen(false)}
                            className='credit-card-model'

                        >

                            <Circles

                                height="100"
                                width="100%"
                                color="#004382"
                                ariaLabel="circles-loading"
                                wrapperStyle={{
                                    height: "100%",
                                    width: "100%",
                                    position: "absolute",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    zIndex: 9,
                                    background: "#00000082"
                                }}
                                wrapperClass=""
                                visible={isLoader}
                            />

                            <div className="add_property_btn upgrade-plan">

                                <form onSubmit={handleSubmit} >
                                    <h2>Card Details
                                        <span onClick={() => setIsOpen(false)}>X</span>
                                    </h2>

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
                                            <label>Valid Till</label>
                                            <input {...getExpiryDateProps({ onChange: handleChange })} name="expiryDate" />
                                            <small>{erroredInputs.expiryDate && erroredInputs.expiryDate}</small>
                                        </div>

                                        <div className="input-group">
                                            <label>CVC</label>
                                            <input {...getCVCProps({ onChange: handleChange })} name="cvc" />
                                            <small>{erroredInputs.cvc && erroredInputs.cvc}</small>
                                        </div>
                                        <div className="input-group input-plan-tenure">
                                            <select value={selectMonth} onChange={(e) => setSelectMonth(e.target.value)}>
                                                {/* <option value="">Billing Period</option> */}
                                                <option value="1">1 Month</option>
                                                {/* <option value="3">3 Month</option>
                                                <option value="6">6 Month</option>
                                                <option value="9">9 Month</option>
                                                <option value="12">1 year</option> */}
                                            </select>
                                        </div>

                                    </div>
                                    {selectMonth == "" || errors.name || erroredInputs.cvc || erroredInputs.expiryDate || erroredInputs.cardNumber ? <button disabled type="button">Pay</button> : <button type="submit">Pay</button>}
                                </form>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpgradePlan