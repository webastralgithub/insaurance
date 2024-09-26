import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // AuthProvider.js
  const [totalReffralEarnedMoney, settotalReffralEarnedMoney] = useState()
  const [totalAvailableJobs, settotalAvailableJobs] = useState()
  const [totalReffrals, settotalReffrals] = useState()
  const [totalReffralsReceived, settotalReffralsReceived] = useState()


  const [toggle, setToggle] = useState(false)
  const [auth, setAuth] = useState(
    localStorage.getItem('token') ? { token: localStorage.getItem('token') } : null
  );
  const [email, setEmail] = useState(
    localStorage.getItem('email') ? { email: localStorage.getItem('email') } : null
  );


  const [userID, setUserId] = useState(localStorage.getItem('id') ? localStorage.getItem('id') : null)

  const [roleId, setroleId] = useState(
    localStorage.getItem('roleId') ? localStorage.getItem('roleId') : null
  )
  const [plan, setPlan] = useState(
    localStorage.getItem('plan') ? localStorage.getItem('plan') : null
  )
  const [subscriptionStatus, setSubscriptionStatus] = useState()
  const [property, setProperty] = useState([]);
  const [todo, setTodo] = useState({});
  const [tasklength, setTasklength] = useState(0)
  const [leadlength, setLeadlength] = useState(0)
  const [contactlength, setConatctlength] = useState(0)

  //notificationsLength
  const [notifications, setNotifications] = useState()
  const [notificatioData, setNotificationData] = useState([])
  const [unredMessages, setUnreadMessages] = useState(0)
  return (
    <AuthContext.Provider value={{
      toggle, setToggle,
      subscriptionStatus, setSubscriptionStatus, email, setEmail,
      auth, setAuth, property, setProperty, todo, setTodo, tasklength, setTasklength,
      plan, setPlan, leadlength, setLeadlength, contactlength, setConatctlength,
      roleId, totalReffralEarnedMoney, totalAvailableJobs, totalReffrals, totalReffralsReceived,
      settotalAvailableJobs, settotalReffralEarnedMoney, settotalReffrals, settotalReffralsReceived,
      userID, setUserId, notifications, setNotifications, notificatioData, setNotificationData,
      unredMessages, setUnreadMessages
    }}>
      {children}
    </AuthContext.Provider>
  );
}