import React, { useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import Login from "./components/Login";
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
import KlientaleContacts from "./components/KlientaleContacts";
import SendMessages from "./components/SendMessages";
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
import Ip from "./components/Ip";
import AddCategory from "./components/AddCategory";
import EditCategory from "./components/EditCategory";
import Category from "./components/Category";
import Content from "./components/Content";
import KlientaleContactReferral from "./components/KlientaleContactReferral";
import ContactReferral from "./components/ContactReferral";
import SocialMediaLogin from "./components/SocialMediaLogin";
import ShareMe from "./components/ShareMe";
import KlientaleShareMe from "./components/KlientaleShareMe";
import SocialMedia from "./components/SocialMedia";
import Referral from "./components/Referral";
import Post from "./components/Post";
import AddPost from "./components/AddPost";
import EmailCampaign from "./components/EmailCampaign";
import Unsubscribe from "./components/Unsubscribe";
import Groups from "./components/ManageGroup";
import Templates from "./components/Template";
import UpgradePlan from "./components/UpgradePlan";
import ManageSubscription from "./components/ManageSubscription";
import BecomeKlintale from "./components/BecomeKlintale";
import ManageConfigure from "./components/ManageConfigure";
import AddFeatures from "./components/AddFeatures";
import FeatureUpdate from "./components/FeatureUpdate";
import UserList from "./components/UserList";


const App = () => {
 
  const [toggle, setToggle] = useState(false)
  const { auth , roleId } = useContext(AuthContext)
  const [role, setRole] = useState(0)
  const [id, setId] = useState(0)
  const [nameofuser, setnameofUser] = useState("")

  function parseJwt(token) {
    if (!token) {
      return 0
    }
  
    const name = localStorage.getItem("name")
    const roleId = localStorage.getItem("roleId")
    const id = localStorage.getItem("id")

    return {
      name: name,
      roleId: roleId,
      userId: id,
    };
  }


  useEffect(() => {
    const role = parseJwt(auth?.token)
    setnameofUser(role?.name)
    if (id == 0) {
      setId(0)
    }
    setId(role?.userId)
    if (role == 0) {
      setRole(0)
    }
    setRole(role?.roleId)
    if (role == 4) {

    }
  }, [auth])

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_SECRET_API_KEY} libraries={["places"]}>
      <div className="main-dashbord-wrapper">
        <div style={{ position: "absolute" }}>
          <ToastContainer />
        </div>

        {auth && <>


          {!toggle && <div className="main-sidenav-wrapper">
            <Sidebar role={role} />
          </div>}
        </>}

        <div className={auth ? `main-sidecontent-wrapper${toggle ? " side-new" : ""}` : "login-main-page"}>
          {auth && <img onClick={
            () => { setToggle(!toggle) }
          }

            className="toggle-new" src="/toggle.svg" />}
          {auth && <NavbarContainer nameofuser={nameofuser} />}

          <Routes>
            {!auth ? <Route path="/" element={<Login />} /> : <Route
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
              path="/referral" exact
              element={
                <PrivateRoute>
                  <Referral role={role} />
                </PrivateRoute>
              }
            />

            <Route
              path="/contacts/send/:id" exact
              element={
                <PrivateRoute>
                  <ContactReferral role={role} />
                </PrivateRoute>
              }
            />

            <Route
              path="/contacts/send/:id" exact
              element={
                <PrivateRoute>
                  <ContactReferral role={role} />
                </PrivateRoute>
              }
            />

            <Route
              path="/klientale-contacts/contacts/send/:id" exact
              element={
                <PrivateRoute>
                  <KlientaleContactReferral role={role} />
                </PrivateRoute>
              }
            />
            <Route
              path="/klientale-contacts/share/:id/:name" exact
              element={
                <PrivateRoute>
                  <KlientaleShareMe role={role} />
                </PrivateRoute>
              }
            />

            <Route
              path="contacts/share/:id" exact
              element={
                <PrivateRoute>
                  <ShareMe role={role} />
                </PrivateRoute>
              }
            />
            <Route
              path="/content" exact
              element={
                <PrivateRoute>
                  <Content />
                </PrivateRoute>
              }
            />
            <Route
              path="/social-media" exact
              element={
                <PrivateRoute>
                  <SocialMedia />
                </PrivateRoute>
              }
            />
            <Route
              path="/social/:id" exact
              element={
                <PrivateRoute>
                  <SocialMediaLogin />
                </PrivateRoute>
              }
            />

            <Route
              path="/add-post" exact
              element={
                <PrivateRoute>
                  <AddPost />
                </PrivateRoute>
              }
            />
            <Route
              path="/posts" exact
              element={
                <PrivateRoute>
                  <Post />
                </PrivateRoute>
              }
            />
            <Route
              path="/leads" exact
              element={
                <PrivateRoute>
                  <Lead role={role} />
                </PrivateRoute>
              }
            />
            <Route
              path="/email-campaign" exact
              element={
                <PrivateRoute>
                  <EmailCampaign role={role} />
                </PrivateRoute>
              }
            />
            <Route
              path="/leads/add" exact
              element={
                <PrivateRoute>
                  <AddLead user={id} />
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
              path="/categories" exact
              element={
                <PrivateRoute>
                  <Category role={role} />
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
                  <AddProperty />
                </PrivateRoute>
              }
            />
            <Route
              path="/unsubscribe" exact
              element={
                <PrivateRoute>
                  <Unsubscribe />
                </PrivateRoute>
              }
            />
            {role == 1 && <Route
              path="/owners/:id" exact
              element={
                <PrivateRoute>
                  <RealtorProfile />
                </PrivateRoute>
              }
            />}
            {role == 1 && <Route
              path="/owners/add" exact
              element={
                <PrivateRoute>
                  <AddUserForm />
                </PrivateRoute>
              }
            />}
            <Route
              path="/analytics" exact
              element={
                <PrivateRoute>
                  <Ip role={role} />
                </PrivateRoute>
              }
            />
            <Route
              path="/listing/edit/:id" exact
              element={
                <PrivateRoute>
                  <EditPropertyForm role={role} />
                </PrivateRoute>
              }
            />
            {role == 1 && <Route
              path="/users" exact
              element={
                <PrivateRoute>
                  <Realtor />
                </PrivateRoute>
              }
            />}

            <Route
              path="/klientale-contacts" exact
              element={
                <PrivateRoute>
                  <KlientaleContacts />
                </PrivateRoute>
              }
            />

            <Route
              path="/groups" exact
              element={
                <PrivateRoute>
                  <Groups />
                </PrivateRoute>
              }
            />

            <Route
              path="/send-messages"
              element={
                <PrivateRoute>
                  <SendMessages />
                </PrivateRoute>
              }
            />


            <Route
              path="/categories/add" exact
              element={
                <PrivateRoute>
                  <AddCategory />
                </PrivateRoute>
              }
            />
            <Route
              path="/categories/:id" exact
              element={
                <PrivateRoute>
                  <EditCategory />
                </PrivateRoute>
              }
            />
            <Route
              path="/suppliers" exact
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
                  <TodoList role={role} />
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
              path="/todo-list/add/new/:date" exact
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
                  <Followup />
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
                  <AddContact user={id} />
                </PrivateRoute>
              }
            />
            <Route
              path="/upgrade-plan" exact
              element={
                <PrivateRoute>
                  <UpgradePlan />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-subscription" exact
              element={
                <PrivateRoute>
                  <ManageSubscription />
                </PrivateRoute>
              }
            />

    
            <Route
              path="/manage-configure" exact
              element={
                <PrivateRoute>
                  <ManageConfigure />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-configure/add-features" exact
              element={
                <PrivateRoute>
                  <AddFeatures />
                </PrivateRoute>
              }
            />

            <Route
              path="/features-update" exact
              element={
                <PrivateRoute>
                  <FeatureUpdate />
                </PrivateRoute>
              }
            />



            <Route
              path="/become-klintale" exact
              element={
                <PrivateRoute>
                  <BecomeKlintale />
                </PrivateRoute>
              }
            />
             <Route
              path="/admin-userlist" exact
              element={
                <PrivateRoute>
                  <UserList />
                </PrivateRoute>
              }
            />

            <Route
              path="/website-visitors" exact
              element={
                <PrivateRoute>
                  <Ip role={role} />
                </PrivateRoute>
              }
            />
            <Route
              path="/contacts/add/:id" exact
              element={
                <PrivateRoute>
                  <AddContactNew />
                </PrivateRoute>
              }
            />
            <Route
              path="/contacts/property/:id" exact
              element={
                <PrivateRoute>
                  <ContactProperty />
                </PrivateRoute>
              }
            />
            <Route
              path="/contacts/property/add/:id" exact
              element={
                <PrivateRoute>
                  <AddPropertyContact />
                </PrivateRoute>
              }
            />
            <Route
              path="/contacts/property/edit/:id" exact
              element={
                <PrivateRoute>
                  <EditPropertyContactForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/contact/edit/:id" exact
              element={
                <PrivateRoute>
                  <EditContact nameofuser={nameofuser} />
                </PrivateRoute>
              }
            />
            <Route
              path="/mortgage" exact
              element={
                <PrivateRoute>
                  <AddProperty />
                </PrivateRoute>
              }
            />
            <Route
              path="/listing/:id" exact
              element={
                <PrivateRoute>
                  <RealtorProperty role={role} />
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
                  <AddProperty />
                </PrivateRoute>
              }
            />
            <Route
              path="/unsubscribe" exact
              element={
                <PrivateRoute>
                  <Unsubscribe />
                </PrivateRoute>
              }
            />

            {role == 1 && <Route
              path="/owners/:id" exact
              element={
                <PrivateRoute>
                  <RealtorProfile />
                </PrivateRoute>
              }
            />}
            {role == 1 && <Route
              path="/owners/add" exact
              element={
                <PrivateRoute>
                  <AddUserForm />
                </PrivateRoute>
              }
            />}
            <Route
              path="/analytics" exact
              element={
                <PrivateRoute>
                  <Ip role={role} />
                </PrivateRoute>
              }
            />
            <Route
              path="/listing/edit/:id" exact
              element={
                <PrivateRoute>
                  <EditPropertyForm role={role} />
                </PrivateRoute>
              }
            />
            {role == 1 && <Route
              path="/users" exact
              element={
                <PrivateRoute>
                  <Realtor />
                </PrivateRoute>
              }
            />}
            <Route
              path="/klientale-contacts" exact
              element={
                <PrivateRoute>
                  <KlientaleContacts />
                </PrivateRoute>
              }
            />

            <Route
              path="/send-messages"
              element={
                <PrivateRoute>
                  <SendMessages />
                </PrivateRoute>
              }
            />
            <Route
              path="/templates"
              element={
                <PrivateRoute>
                  <Templates />
                </PrivateRoute>
              }
            />

            {/* <Route
            path="/permission"
            element={
              <PrivateRoute>
                <Permission />
              </PrivateRoute>
            }
          /> */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

        </div>


        {/* {auth&& <Footer />} */}

      </div>
    </LoadScript>

  );
};

export default App;
