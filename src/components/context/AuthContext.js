import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
// AuthProvider.js

const [auth, setAuth] = useState(
    localStorage.getItem('token') ? { token: localStorage.getItem('token') } : null
  );
  const [email, setEmail] = useState(
    localStorage.getItem('email') ? { email: localStorage.getItem('email') } : null
  );

  const [roleId, setroleId]= useState(
    localStorage.getItem('roleId')? localStorage.getItem('roleId') : null
  )
  const [plan, setPlan]= useState(
    localStorage.getItem('plan')? localStorage.getItem('plan') : null
  )
  const [property, setProperty] = useState([ ]); 
  const [todo, setTodo] = useState({}); 
  const [tasklength,setTasklength]=useState(0)
  const [leadlength,setLeadlength]=useState(0)
  const [contactlength,setConatctlength]=useState(0)

  return (
    <AuthContext.Provider value={{ email, setEmail ,auth, setAuth,property,setProperty,todo,setTodo,tasklength,setTasklength, plan, setPlan,leadlength,setLeadlength,contactlength,setConatctlength ,roleId}}>
      {children} 
    </AuthContext.Provider>
  );
}