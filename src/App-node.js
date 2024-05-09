import React, { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login-node";
import Admin from "./components/Admin";
import Roles from "./components/Roles";
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
import Navbar from "./components/Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute";
import { AuthContext } from "./components/context/AuthContext";
import Footer from "./components/Footer";
import Property from "./components/Property";
import NavbarContainer from "./components/NavbarContainer";
import Sidebar from "./components/Sidebar";
import Realtor from "./components/Realtor";
import AddProperty from "./components/AddProperty";
import EditPropertyForm from "./components/EditProperty";
import Permission from "./components/Permission";
import Profile from "./components/Profile";
import RealtorProperty from "./components/Realtorproperty";
import Contact from "./components/Contact";
import AddContact from "./components/AddContact";
import AddContactNew from "./components/AddContactNew";
import EditContact from "./components/EditContact";
import ChildContact from "./components/ChildContact";
import ContactProperty from "./components/contact/ContactProperty";
import AddPropertyContact from "./components/contact/AddPropertyContact";
import EditPropertyContactForm from "./components/contact/EditPropertyContact";
import ChildContactChild from "./components/ChildContactChild";
import RealtorProfile from "./components/RealtorProfile";
import TodoList from "./components/Todo";
import AddTodo from "./components/AddTodo";
import EditTodo from "./components/EditTodo";
import Lead from "./components/Lead";
import AddLead from "./components/Addlead";
import EditLeads from "./components/EditLeads";
import MyCalendar from "./components/MyCalendar";
import AddUserForm from "./components/AddUserForm";
import Followup from "./components/FollowUp";
import Vendor from "./components/Vendor";
import AddVendor from "./components/AddVendor";
import EditVendor from "./components/EditVendor";
import AddTaskContact from "./components/contact/AddTaskContact";


const App = () => {

  const[toggle,setToggle]=useState(false)
  const {auth} =useContext(AuthContext)
const[role,setRole]=useState(0)
const[id,setId]=useState(0)
const[nameofuser,setnameofUser]=useState("")

function parseJwt (token) {
  if(!token){
    return 0
  }
  var base64Url = token.split('.')[1];
  var base64 = base64Url?.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}


useEffect(()=>{
  const role=parseJwt(auth?.token)
 setnameofUser(role?.permission?.name)
 if(id==0){
  setId(0)
 }
setId(role?.userId)
  if(role==0){
    setRole(0)
  }
setRole(role?.roleId)
if(role==4){

}
},[auth])


  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_SECRET_API_KEY}  libraries={["places"]}>
    <div className="main-dashbord-wrapper">
      <div style={{position:"absolute"}}>
  <ToastContainer />
  </div>
 
{auth&& <>


{!toggle&&<div className="main-sidenav-wrapper">
      <Sidebar role={role}/>
      </div>}
      </>}

      <div className={auth ? `main-sidecontent-wrapper${toggle ? " side-new" : ""}` : "login-main-page"}>
      {auth&&<img onClick={
  ()=>{setToggle(!toggle)}
 }

 className="toggle-new" src="/toggle.svg"/> }
       {auth&&<NavbarContainer nameofuser={nameofuser}/>}

        <Routes>
        {!auth? <Route path="/" element={<Login />} />:  <Route
            path="/" exact
            element={
              <PrivateRoute>
                <MyCalendar />
              </PrivateRoute>
            }
          />}
      {
        auth && <Route path="/" element={<MyCalendar />} />
      }
          <Route
            path="/contacts" exact
            element={
              <PrivateRoute>
                <Contact role={role} />
              </PrivateRoute>
            }
          />
            <Route
            path="/leads" exact
            element={
              <PrivateRoute>
                <Lead role={role}/>
              </PrivateRoute>
            }
          />
           <Route
            path="/leads/add" exact
            element={
              <PrivateRoute>
            <AddLead user={id}/>
              </PrivateRoute>
            }
          />
          <Route
            path="/leads/edit/:id" exact
            element={
              <PrivateRoute>
            <EditLeads />
              </PrivateRoute>
            }
          />
            <Route
            path="/vendors" exact
            element={
              <PrivateRoute>
                <Vendor role={role} />
              </PrivateRoute>
            }
          />
           <Route
            path="/vendors/add" exact
            element={
              <PrivateRoute>
            <AddVendor />
              </PrivateRoute>
            }
          />
          <Route
            path="/vendors/edit/:id" exact
            element={
              <PrivateRoute>
            <EditVendor />
              </PrivateRoute>
            }
          />
             <Route
            path="/todo-list" exact
            element={
              <PrivateRoute>
                <TodoList  role={role}/>
              </PrivateRoute>
            }
          />

<Route
            path="/todo-list/add" exact
            element={
              <PrivateRoute>
                <AddTodo />
              </PrivateRoute>
            }
          />
          <Route
            path="/todo-list/add/:id" exact
            element={
              <PrivateRoute>
                <AddTaskContact />
              </PrivateRoute>
            }
          />
          <Route
            path="/todo-list/edit/:id" exact
            element={
              <PrivateRoute>
                <EditTodo />
              </PrivateRoute>
            }
          />
            <Route
            path="/todo-list/followup/:id" exact
            element={
              <PrivateRoute>
                <Followup/>
              </PrivateRoute>
            }
          />
           <Route
            path="/contacts/:id" exact
            element={
              <PrivateRoute>
                <ChildContact />
              </PrivateRoute>
            }
          />
            <Route
            path="/contacts/:id/:id" exact
            element={
              <PrivateRoute>
                <ChildContactChild />
              </PrivateRoute>
            }
          />
            <Route
            path="/contacts/add" exact
            element={
              <PrivateRoute>
                <AddContact user={id}/>
              </PrivateRoute>
            }
          />
            <Route
            path="/contacts/add/:id" exact
            element={
              <PrivateRoute>
                <AddContactNew/>
              </PrivateRoute>
            }
          />
                 <Route
            path="/contacts/property/:id" exact
            element={
              <PrivateRoute>
                <ContactProperty/>
              </PrivateRoute>
            }
          />
                 <Route
            path="/contacts/property/add/:id" exact
            element={
              <PrivateRoute>
                <AddPropertyContact/>
              </PrivateRoute>
            }
          />
              <Route
            path="/contacts/property/edit/:id" exact
            element={
              <PrivateRoute>
                <EditPropertyContactForm/>
              </PrivateRoute>
            }
          />
             <Route
            path="/contact/edit/:id" exact
            element={
              <PrivateRoute>
                <EditContact nameofuser={nameofuser}/>
              </PrivateRoute>
            }
          />
             <Route
            path="/listing" exact
            element={
              <PrivateRoute>
                <Property role={role}/>
              </PrivateRoute>
            }
          />
            <Route
            path="/listing/:id" exact
            element={
              <PrivateRoute>
                <RealtorProperty role={role}/>
              </PrivateRoute>
            }
          />
            <Route
            path="/profile" exact
            element={
              <PrivateRoute>
                <Profile nameofuser={nameofuser} />
              </PrivateRoute>
            }
          />
             <Route
            path="/listing/add" exact
            element={
              <PrivateRoute>
                <AddProperty/>
              </PrivateRoute>
            }
          />
            { role==1&& <Route
            path="/owners/:id" exact
            element={
              <PrivateRoute>
                <RealtorProfile/>
              </PrivateRoute>
            }
          />}
               { role==1&& <Route
            path="/owners/add" exact
            element={
              <PrivateRoute>
                <AddUserForm/>
              </PrivateRoute>
            }
          />}
           <Route
            path="/listing/edit/:id" exact
            element={
              <PrivateRoute>
                <EditPropertyForm role={role}/>
              </PrivateRoute>
            }
          />
          {role==1&&<Route
          path="/users" exact
          element={
            <PrivateRoute>
              <Realtor/>
            </PrivateRoute>
          }
        />}
          {/* <Route
            path="/listing" exact
            element={
              <PrivateRoute>
                <Property />
              </PrivateRoute>
            }
          /> */}
{/* 
          <Route
            path="/roles"
            element={
              <PrivateRoute>
                <Roles />
              </PrivateRoute>
            }
          /> */}
  
        {/* <Route
            path="/permission"
            element={
              <PrivateRoute>
                <Permission />
              </PrivateRoute>
            }
          /> */}
        </Routes>
    
      </div>


     {/* {auth&& <Footer />} */}

     </div>
     </LoadScript>
 
  );
};

export default App;
