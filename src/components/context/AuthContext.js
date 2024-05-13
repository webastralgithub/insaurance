import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // AuthProvider.js
  const [totalReffralEarnedMoney, settotalReffralEarnedMoney] = useState(localStorage.getItem("totalReffralEarnedMoney"))
  const [totalAvailableJobs, settotalAvailableJobs] = useState(localStorage.getItem("totalAvailableJobs"))
  const [totalReffrals, settotalReffrals] = useState(localStorage.getItem("totalReffrals"))
  const [totalReffralsReceived, settotalReffralsReceived] = useState(localStorage.getItem("totalReffralsReceived"))

  const [auth, setAuth] = useState(
    localStorage.getItem('token') ? { token: localStorage.getItem('token') } : null
  );
  const [email, setEmail] = useState(
    localStorage.getItem('email') ? { email: localStorage.getItem('email') } : null
  );

  const [roleId, setroleId] = useState(
    localStorage.getItem('roleId') ? localStorage.getItem('roleId') : null
  )
  const [plan, setPlan] = useState(
    localStorage.getItem('plan') ? localStorage.getItem('plan') : null
  )
  const [subscriptionStatus, setSubscriptionStatus] = useState(localStorage.getItem("subscription_status"))
  const [property, setProperty] = useState([]);
  const [todo, setTodo] = useState({});
  const [tasklength, setTasklength] = useState(0)
  const [leadlength, setLeadlength] = useState(0)
  const [contactlength, setConatctlength] = useState(0)
  const [currentUsercategory_id, setcurrentUsercurrentUsercategory_id] = useState(localStorage.getItem('category_id'))

  return (
    <AuthContext.Provider value={{
      subscriptionStatus, setSubscriptionStatus, email, setEmail,
      auth, setAuth, property, setProperty, todo, setTodo, tasklength, setTasklength,
      plan, setPlan, leadlength, setLeadlength, contactlength, setConatctlength,
      roleId, totalReffralEarnedMoney, totalAvailableJobs, totalReffrals, totalReffralsReceived,
      currentUsercategory_id,settotalAvailableJobs,settotalReffralEarnedMoney,settotalReffrals,settotalReffralsReceived
    }}>
      {children}
    </AuthContext.Provider>
  );
}