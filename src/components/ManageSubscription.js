import React, { useContext, useEffect, useState } from 'react'
import "./ManageSubscription.css"
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ManageSubscription = () => {

  const [subscriptions, setSubscrition] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState();
  const { auth, plan, setPlan } = useContext(AuthContext);
  const navigate = useNavigate()
  const headers = {
    Authorization: auth.token,
  };


  useEffect(() => {
    getSubscription();
  }, []);

  const [premium, setPremium] = useState("") // parameters (canceled,  active)

  const getSubscription = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/get-subscription`, { headers });

      setSubscrition(res.data.all);
      setActiveSubscription(res.data.active)
      setPremium(res.data.active.status)
    } catch (error) {

    }
  }


  const handleView = async () => {
    let status;
    if (premium == "active") {
      status = "canceled"
    } else {
      status = 'active'
    }
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/cancel-subscription/${activeSubscription.id}/${status}`, { headers });
      toast.success(res.data.message)
      getSubscription()
      console.log("premium", premium)
      if (premium == "active") {
       setPlan(1)
      } else {
        setPlan(2)
      }
    } catch (error) {
      toast.error("error");
    }
  }

  const handleBasic = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/cancel-subscription/${activeSubscription.id}/canceled`, { headers });
      toast.success(res.data.message)
      getSubscription()
      setPlan(1)
    } catch (error) {
      toast.error("error");
    }
  }
  return (
    <div>
      <div className="add_property_btn">
        <div className="inner-pages-top">
          <h3>  {"Manage Subscription"}</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Plan Type</th>
                <th>Plan Amount</th>
                <th>Currency</th>
                <th>Subscription Start</th>
                <th>Subscription End</th>
                <th>Actions</th>
              </tr>
            </thead>
           
              <tbody>
              {activeSubscription &&
                <tr key={activeSubscription?.id}>
                  <td>Premium</td>
                  <td >{activeSubscription?.plan_amount}</td>
                  <td >{activeSubscription?.currency}</td>
                  <td >{activeSubscription?.subscription_start}</td>
                  <td >{activeSubscription?.subscription_end}</td>
                  <td>
                    {premium == "active" ? <button style={{background:"#ff0000c2", borderColor:"#ff0000c2"}} className="subscription delete-btn-ico manage-active-buttons "
                      onClick={() => handleView(activeSubscription.id)}>Cancel Plan</button> : <button className="manage-active-buttons subscription delete-btn-ico"
                        onClick={() =>navigate("/upgrade-plan")}>Upgrade Plan</button>}

                  </td>
                </tr>}
                <tr key={activeSubscription?.id}>
                  <td>Basic</td>
                  <td >0</td>
                  <td >-</td>
                  <td >Unlimited</td>
                  <td >Unlimited</td>
                  <td>
                    {premium == "active" ? <button className="subscription delete-btn-ico manage-active-buttons"
                      onClick={() => handleBasic(activeSubscription.id)}>Basic</button> : <button disabled={true}>Actived</button>}

                  </td>
                </tr>
              </tbody>

           
          </table>
        
        </div>
        {/* {!activeSubscription && <p className="no-data-found" style={{width:"100%", textAlign:"center", fontWeight:"600"}}>No data Found</p>} */}
        {/* <h3>Subscriptions History</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Stipe Subscription Id</th>
                <th>Plan Amount</th>
                <th>Currency</th>
                <th>Subscription Start</th>
                <th>Subscription End</th>
              </tr>
            </thead>
            {subscriptions.length > 0 ?
              subscriptions.map((subscription) => (
                <tbody>
                  <tr key={subscription.id}>
                    <td>{subscription.subscription_id}</td>
                    <td >{subscription?.plan_amount}</td>
                    <td >{subscription?.currency}</td>
                    <td >{subscription?.subscription_start}</td>
                    <td >{subscription?.subscription_end}</td>
                  </tr>

                </tbody>
              )) : <p className="no-data">No data Found</p>}
          </table>
        </div> */}
      </div>
    </div>
  )
}

export default ManageSubscription
