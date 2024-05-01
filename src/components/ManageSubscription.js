import React, { useContext, useEffect, useState } from 'react'
import "./ManageSubscription.css"
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import { toast } from 'react-toastify';

const ManageSubscription = () => {

  const [subscriptions, setSubscrition] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState();
  const { auth } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };


  useEffect(() => {
    getSubscription();
  }, []);

  const getSubscription = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/get-subscription`, { headers });

      setSubscrition(res.data.all);
      setActiveSubscription(res.data.active)
    } catch (error) {

    }
  }

  const handleView = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/cancel-subscription/${activeSubscription.id}`, { headers });
      setSubscrition([...subscriptions, activeSubscription]);
      setActiveSubscription();
      toast.success("Subscription Canceled Successfully")
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
                <th>Stipe Subscription Id</th>
                <th>Plan Amount</th>
                <th>Currency</th>
                <th>Subscription Start</th>
                <th>Subscription End</th>
                <th>Cancel Subscription</th>
              </tr>
            </thead>
            {activeSubscription &&
              <tbody>

                <tr key={activeSubscription.id}>
                  <td>{activeSubscription.subscription_id}</td>
                  <td >{activeSubscription?.plan_amount}</td>
                  <td >{activeSubscription?.currency}</td>
                  <td >{activeSubscription?.subscription_start}</td>
                  <td >{activeSubscription?.subscription_end}</td>
                  <td>
                    <img className="subscription delete-btn-ico" src="/subscription.svg"
                      onClick={() => handleView(activeSubscription.id)}></img>
                  </td>
                </tr>
              </tbody>}

            {!activeSubscription && <tbody> <p className="no-data">No data Found</p>  </tbody>}
          </table>

        </div>
        <h3>Subscriptions History</h3>
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
          <div className="pagination">

          </div>


        </div>
      </div>
    </div>
  )
}

export default ManageSubscription
