import React, { useContext, useEffect, useState } from 'react'
import "./ManageSubscription.css"
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ManageSubscription = () => {

  const [subscriptions, setSubscrition] = useState([]);
  const [activeSubscriptionStatus, setActiveSubscriptionStatus] = useState([]);
  const { auth, plan, setPlan } = useContext(AuthContext);
  const navigate = useNavigate()
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    getSubscription();
  }, []);

  const getSubscription = async () => {
    try {
      const response = await axios.get(`${url}api/get-subscription`, { headers });
      const responseData = response?.data?.active
      setSubscrition(responseData);
      setActiveSubscriptionStatus(responseData?.status)

    } catch (error) {
      console.error("error", error)
    }
  }

  const handleView = async (id) => {

    let status;
    if (activeSubscriptionStatus == "active") {
      status = "canceled"
    } else {
      status = 'active'
    }
    console.log("id", id)
    console.log("status", status);
    try {
      const res = await axios.get(`${url}api/cancel-subscription/${id}/${status}`, { headers });
      toast.success(res.data.message)
      if (activeSubscriptionStatus == "active") {
        setPlan(1)
        getSubscription()
      } else {
        setPlan(2)
        getSubscription()
      }
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


              {subscriptions &&
                <tr key={subscriptions?.id}>
                  <td>Premium</td>
                  <td >{subscriptions?.plan_amount}</td>
                  <td >{subscriptions?.currency}</td>
                  <td >{subscriptions?.subscription_start}</td>
                  <td >{subscriptions?.subscription_end}</td>
                  <td>
                    {activeSubscriptionStatus == "active" ? <button style={{ background: "#ff0000c2", borderColor: "#ff0000c2" }} className="subscription delete-btn-ico manage-active-buttons "
                      onClick={() => handleView(subscriptions.id)}>Cancel Plan</button> : <button className="manage-active-buttons subscription delete-btn-ico"
                        onClick={() => navigate("/upgrade-plan")}>Upgrade Plan</button>}

                  </td>
                </tr>}

              {subscriptions == null && <tr >
                <td>Premium</td>
                <td >10</td>
                <td >Cad</td>
                <td >-</td>
                <td >-</td>
                <td>
                  <button className="manage-active-buttons subscription delete-btn-ico"
                    onClick={() => navigate("/upgrade-plan")}>Upgrade Plan</button>

                </td>
              </tr>}


              <tr>
                <td>Basic</td>
                <td >0</td>
                <td >-</td>
                <td >{subscriptions ? "-" : 'Unlimited'}</td>
                <td >{subscriptions ? "-" : 'Unlimited'}</td>
                <td>
                  {activeSubscriptionStatus == "active" ? '' : 'Activated'}

                </td>
              </tr>
            </tbody>
 </table>

        </div>
      </div>
    </div>
  )
}

export default ManageSubscription
