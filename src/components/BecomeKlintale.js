import React, { useState, useEffect, useContext, useRef } from "react";
import './Upgradeplan.css'
import axios from "axios";
import { AuthContext } from './context/AuthContext';
import { useCreditCardValidator, images } from 'react-creditcard-validator';
import Modal from "react-modal";
import { toast } from "react-toastify";
import { Circles } from 'react-loader-spinner'

const BecomeKlintale = () => {
    const url = process.env.REACT_APP_API_URL;
    const [categories, setCategories] = useState([])

    const [criticalIllnessInsurance, setCriticalIllnessInsurance] = useState([])
    const [disabilityInsurance, setDisabilityInsurance] = useState([])
    const [travelInsurance, setTravelInsurance] = useState([])
    const [healthInsurance, setHealthInsurance] = useState([])
    const [businessInsurance, setBusinessInsurance] = useState([])
    const [lifeInsurance, setLifeInsurance] = useState([])
    const [homeInsurance, setHomeInsurance] = useState([])
    const [autoInsurance, setAutoInsurance] = useState([])

    const [activeTab, setActiveTab] = useState('tab1');
    const { auth, plan, setPlan } = useContext(AuthContext);
    const [planData, setPlandata] = useState()
    const [isLoader, setIsLoader] = useState(false)

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
        if (name === "name" && value !== '') {
            setErrors('');
        }
        setFormData({
            ...formData,
            [name]: value
        });

    };



    const getCategories = async () => {
        try {
            const response = await axios.get('https://klientale.com/api/newMembership')
            const responseData = response?.data?.memberships
            console.log("response data", responseData)

            setCriticalIllnessInsurance(responseData?.['Critical Illness Insurance'] || []);
            setAutoInsurance(responseData?.['Auto_Insurance'] || []);
            setBusinessInsurance(responseData?.['Business Insurance'] || []);
            setDisabilityInsurance(responseData?.['Disability Insurance'] || []);
            setHealthInsurance(responseData?.['Health Insurance'] || []);
            setHomeInsurance(responseData?.['Home Insurance'] || []);
            setLifeInsurance(responseData?.['Life Insurance'] || []);
            setTravelInsurance(responseData?.['Travel Insurance'] || []);

      

        } catch (error) {
            console.error("error", error)
        }
    }



    const handleSubscribe = (id) => {
        setIsOpen(true)
        setPlan(id)
    }
    useEffect(() => {
        getCategories()
    }, [])

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
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
            plan_month: selectMonth,
            plan_id: planData
        }
        setIsLoader(true)
        try {
            const response = await axios.post(`${url}api/subscribe`, cardData, { headers });
            if (response.status === 200) {
                toast.success(response.data.message);
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
    return (
        <div>
            <main id="main">
                <section id="" className="features pricing-plan-sec membership-header-sec plan-subscriber-section">

                    <div className="tab-container plan-subscriber-div">
                        <div className="tab-menu">
                            <ul>
                                <li><a className={`tab-a ${activeTab === 'tab1' ? 'active-a' : ''}`} onClick={() => handleTabClick('tab1')} data-id="tab1">Critical Illness Insurance</a></li>
                                <li><a className={`tab-a ${activeTab === 'tab2' ? 'active-a' : ''}`} onClick={() => handleTabClick('tab2')} data-id="tab2">Disability Insurance</a></li>
                                <li><a className={`tab-a ${activeTab === 'tab3' ? 'active-a' : ''}`} onClick={() => handleTabClick('tab3')} data-id="tab3">Travel Insurance</a></li>
                                <li><a className={`tab-a ${activeTab === 'tab4' ? 'active-a' : ''}`} onClick={() => handleTabClick('tab4')} data-id="tab4">Business Insurance</a></li>
                                <li><a className={`tab-a ${activeTab === 'tab5' ? 'active-a' : ''}`} onClick={() => handleTabClick('tab5')} data-id="tab5">Health Insurance</a></li>
                                <li><a className={`tab-a ${activeTab === 'tab6' ? 'active-a' : ''}`} onClick={() => handleTabClick('tab6')} data-id="tab6">Life Insurance</a></li>
                                <li><a className={`tab-a ${activeTab === 'tab7' ? 'active-a' : ''}`} onClick={() => handleTabClick('tab7')} data-id="tab7">Home Insurance</a></li>
                                <li><a className={`tab-a ${activeTab === 'tab8' ? 'active-a' : ''}`} onClick={() => handleTabClick('tab8')} data-id="tab8">Auto Insurance</a></li>
                            </ul>
                        </div>

                        <div className="tab tab-active" data-id="tab1">
                            <div className="price-tab-intb popular">
                                <div className="price-blck-left">
                                    <h5></h5>
                                    <p></p>
                                </div>
                                <div className="price-blck-right">
                                    <div className="child-div-popup">

                                        {activeTab === 'tab1' && criticalIllnessInsurance?.length > 0 && criticalIllnessInsurance?.map((e, index) =>
                                            <div className="subscription-fee" key={e.id}>
                                                <div className="subscription-fee-text">
                                                    <h3>{e.name}</h3>
                                                    <p>{e.description}</p>
                                                </div>
                                                <div className="subscription-price-subs">
                                                    <span className="subscription-fee-price">
                                                        {`$ ${e.price}`}
                                                    </span>
                                                    <button className="subscription-fee-button" onClick={() => handleSubscribe(e.id)}>
                                                        Subscribe
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                        }

                                        {activeTab === 'tab2' && disabilityInsurance?.length > 0 && disabilityInsurance?.map((e, index) =>
                                            <div className="subscription-fee" key={e.id}>
                                                <div className="subscription-fee-text">
                                                    <h3>{e.name}</h3>
                                                    <p>{e.description}</p>
                                                </div>
                                                <div className="subscription-price-subs">
                                                    <span className="subscription-fee-price">
                                                        {`$ ${e.price}`}
                                                    </span>
                                                    <button className="subscription-fee-button" onClick={() => handleSubscribe(e.id)}>
                                                        Subscribe
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                        }
                                        {activeTab === 'tab3' && travelInsurance?.length > 0 && travelInsurance?.map((e, index) =>
                                            <div className="subscription-fee" key={e.id}>
                                                <div className="subscription-fee-text">
                                                    <h3>{e.name}</h3>
                                                    <p>{e.description}</p>
                                                </div>
                                                <div className="subscription-price-subs">
                                                    <span className="subscription-fee-price">
                                                        {`$ ${e.price}`}
                                                    </span>
                                                    <button className="subscription-fee-button" onClick={() => handleSubscribe(e.id)}>
                                                        Subscribe
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                        }
                                        {activeTab === 'tab4' && businessInsurance?.length > 0 && businessInsurance?.map((e, index) =>
                                            <div className="subscription-fee" key={e.id}>
                                                <div className="subscription-fee-text">
                                                    <h3>{e.name}</h3>
                                                    <p>{e.description}</p>
                                                </div>
                                                <div className="subscription-price-subs">
                                                    <span className="subscription-fee-price">
                                                        {`$ ${e.price}`}
                                                    </span>
                                                    <button className="subscription-fee-button" onClick={() => handleSubscribe(e.id)}>
                                                        Subscribe
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                        }
                                        {activeTab === 'tab5' && healthInsurance?.length > 0 && healthInsurance?.map((e, index) =>
                                            <div className="subscription-fee" key={e.id}>
                                                <div className="subscription-fee-text">
                                                    <h3>{e.name}</h3>
                                                    <p>{e.description}</p>
                                                </div>
                                                <div className="subscription-price-subs">
                                                    <span className="subscription-fee-price">
                                                        {`$ ${e.price}`}
                                                    </span>
                                                    <button className="subscription-fee-button" onClick={() => handleSubscribe(e.id)}>
                                                        Subscribe
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                        }



                                        {activeTab === 'tab6' && lifeInsurance?.length > 0 && lifeInsurance?.map((e, index) =>
                                            <div className="subscription-fee" key={e.id}>
                                                <div className="subscription-fee-text">
                                                    <h3>{e.name}</h3>
                                                    <p>{e.description}</p>
                                                </div>
                                                <div className="subscription-price-subs">
                                                    <span className="subscription-fee-price">
                                                        {`$ ${e.price}`}
                                                    </span>
                                                    <button className="subscription-fee-button" onClick={() => handleSubscribe(e.id)}>
                                                        Subscribe
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                        }

                                        {activeTab === 'tab7' && homeInsurance?.length > 0 && homeInsurance?.map((e, index) =>
                                            <div className="subscription-fee" key={e.id}>
                                                <div className="subscription-fee-text">
                                                    <h3>{e.name}</h3>
                                                    <p>{e.description}</p>
                                                </div>
                                                <div className="subscription-price-subs">
                                                    <span className="subscription-fee-price">
                                                        {`$ ${e.price}`}
                                                    </span>
                                                    <button className="subscription-fee-button" onClick={() => handleSubscribe(e.id)}>
                                                        Subscribe
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                        }

                                        {activeTab === 'tab8' && autoInsurance?.length > 0 && autoInsurance?.map((e, index) =>
                                            <div className="subscription-fee" key={e.id}>
                                                <div className="subscription-fee-text">
                                                    <h3>{e.name}</h3>
                                                    <p>{e.description}</p>
                                                </div>
                                                <div className="subscription-price-subs">
                                                    <span className="subscription-fee-price">
                                                        {`$ ${e.price}`}
                                                    </span>
                                                    <button className="subscription-fee-button" onClick={() => handleSubscribe(e.id)}>
                                                        Subscribe
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                        }
                                        <div className="data-not-found">

                                            {activeTab === 'tab1' && criticalIllnessInsurance.length === 0 && <p>Data Not Found</p>}
                                            {activeTab === 'tab2' && disabilityInsurance.length === 0 && <p>Data Not Found</p>}
                                            {activeTab === 'tab3' && travelInsurance.length === 0 && <p>Data Not Found</p>}
                                            {activeTab === 'tab4' && businessInsurance.length === 0 && <p>Data Not Found</p>}
                                            {activeTab === 'tab5' && healthInsurance.length === 0 && <p>Data Not Found</p>}
                                            {activeTab === 'tab6' && lifeInsurance.length === 0 && <p>Data Not Found</p>}
                                            {activeTab === 'tab7' && homeInsurance.length === 0 && <p>Data Not Found</p>}
                                            {activeTab === 'tab8' && autoInsurance.length === 0 && <p>Data Not Found</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tab" data-id="tab2"></div>
                        <div className="tab" data-id="tab3"></div>
                        <div className="tab" data-id="tab4"></div>
                        <div className="tab" data-id="tab5"></div>
                        <div className="tab" data-id="tab6"></div>
                        <div className="tab" data-id="tab7"></div>
                        <div className="tab" data-id="tab8"></div>
                    </div>
                </section>
            </main>

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
                                        <option value="">Billing Period</option>
                                        <option value="1">1 Month</option>
                                        <option value="3">3 Month</option>
                                        <option value="6">6 Month</option>
                                        <option value="9">9 Month</option>
                                        <option value="12">1 Year</option>
                                    </select>
                                </div>

                            </div>
                            {selectMonth == "" || errors.name || erroredInputs.cvc || erroredInputs.expiryDate || erroredInputs.cardNumber ? <button disabled type="button">Pay</button> : <button type="submit">Pay</button>}
                        </form>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default BecomeKlintale
