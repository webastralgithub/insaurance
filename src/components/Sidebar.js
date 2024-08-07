import "./Sidebar.css"
import axios from "axios";
import React, { useContext, useEffect, useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import './Navbar.css';
import { AuthContext } from './context/AuthContext';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Sidebar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [sub, setSub] = useState('');
  const [IsOpenSub, setIsOpenSub] = useState(false);
  const location = useLocation();
  const [count, setCount] = useState({})
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isOpenSub = () => {
    if (IsOpenSub == true)
      setIsOpenSub(false)
    else
      setIsOpenSub(true)
  }

  const { auth, setAuth, tasklength, setTasklength, contactlength,
    setConatctlength, leadlength, setLeadlength, activeID, roleId } = useContext(AuthContext);
  const [width, setWidth] = useState(window.innerWidth);
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(null);
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/');
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };
  useEffect(() => {
    (async () => {
      try {
        const user = await
          axios.get(`${url}api/admin/get-current-user`, { headers })
        let userData = user.data.user
        setCount(userData)
        setConatctlength(userData.contact_count)
        setLeadlength(userData.leads_count);

        setTasklength(userData?.todo_count)
      } catch (error) {
        handleLogout()
      }
    })();
  }, []);

  const handleStateChange = (state) => {
    setMenuOpen(state.isOpen);
  };


  const handleMenuItemClick = () => {
    setMenuOpen(false);
  };

  const handleInnerOptionClick = (e) => {
    e.stopPropagation();
    setSub("camp");
    isOpenSub();
  };

  return (
    <>

      {width > 991 ? (
        <>
          <div className="side-menu">
            <Link className="top-man-logo" to="/">
              <img className="icon" alt="" src="/insurance.png" />
            </Link>
            <div className="side-menu-child" />
            <div className="menu">
              <Link to="/" className={location.pathname === "/" || location.pathname.includes("/todo-list/add/new-dashboard/") || location.pathname.includes("/todo-list-dashboard/edit/") ? "active" : ""}>
                <div className="dashboard">
                  <img className="icon" alt="" src="/icon.svg" />
                  <div className="daily-events">Dashboard </div>

                </div>
              </Link>

              <Link to="/todo-list" className={location.pathname === "/todo-list" || location.pathname.includes("/todo-list/add-task")
                || location.pathname.includes("/todo-list-todo/edit/")
                ? "active" : ""}>
                <div className="order-list">
                  <img className="group-icon" alt="" src="/group.svg" />
                  <div className="daily-events">To-Do List ({tasklength})</div>
                </div>
              </Link>
              <Link to="/leads" className={location.pathname === "/leads" || location.pathname.includes("/leads/edit/") || location.pathname === "/leads/add" ? "active" : ""}>
                <div className="order-detail">
                  <img className="order-detail-child" alt="" src="/group-30036.svg" />
                  <div className="daily-events">Leads ({leadlength})</div>

                </div>
              </Link>
              <Link to="/contacts" className={location.pathname === "/contacts" || location.pathname === "/contacts/add"
                || location.pathname.includes("/contacts/share/") || location.pathname.includes("/contacts/send/") ||
                location.pathname.includes('/contact/edit/') ? "active" : ""}>
                <div className="order-detail">

                  <img className="order-detail-child" alt="" src="/group-30036.svg" />
                  <div className="daily-events">Contacts ({contactlength})</div>

                </div>
              </Link>

              <Link to="/referral" className={location.pathname.includes('/referral-sent') || location.pathname === "/referral" ? "active" : ""}>
                <div className="order-detail">

                  <img className="order-detail-child" alt="" src="/referral.svg" />
                  <div className="daily-events">Referrals</div>

                </div>
              </Link>

              <Link to="/inquires" className={location.pathname.includes('/add-inquery') || location.pathname === "/inquires" ? "active" : ""}>
                <div className="order-detail">

                  <img className="order-detail-child" alt="" src="/referral.svg" />
                  <div className="daily-events">Inquery</div>

                </div>
              </Link>

              {roleId == 1 &&
                <Link to="/analytics" className={location.pathname === "/analytics" ? "active" : ""}>
                  <div className="order-detail">

                    <img className="order-detail-child" alt="" src="/analytic.svg" />
                    <div className="daily-events">Analytics</div>

                  </div>
                </Link>}

              {/* <div onClick={() => { setSub("admin"); isOpenSub(); }} className={IsOpenSub && sub == "admin" ? "customer-detail administrator-drop active" : "customer-detail administrator-drop"} >
                  <img className="vector-icon" alt="" src="/vector.svg" />
                  <div className="properties daily-events" >Administrator </div>
                </div>
          <div className="subMenu-drp">
          {IsOpenSub && sub == "admin" && props.role == 1 && <Link to="/users" className={location.pathname === "/users" ? "active" : ""}>
              <div className="order-list">

                <img className="customer-child" alt="" src="/group-30037.svg" />
                <div className="daily-events">Users ({count?.owner_count})</div>

              </div>
            </Link>}
            {IsOpenSub && sub == "admin" && props.role == 1 && <Link to="/suppliers" className={location.pathname === "/supplier" ? "active" : ""}>
              <div className="order-detail">

                <img className="order-detail-child" alt="" src="/group-30036.svg" />
                <div className="daily-events">Suppliers ({count?.vendor_count})</div>

              </div>
            </Link>}
            
            
            {IsOpenSub && sub == "admin" && props.role == 1 && <Link to="/categories" className={location.pathname === "/categories" ? "active" : ""} >
              <div className="customer-detail">

                <img className="vector-icon" alt="" src="/vector.svg" />
                <div className="properties">Categories ({count?.category_count})</div>

              </div>
            </Link>}
                   
            </div> */}

              <div onClick={() => { setSub("camp"); isOpenSub(); }} className={IsOpenSub && sub == "camp" ? "customer-detail administrator-drop active" : "customer-detail administrator-drop"} >
                <img className="vector-icon" alt="" src="/vector.svg" />
                <div className="properties daily-events" >Campaigns</div>
              </div>

              <div className="subMenu-drp">
                {IsOpenSub && sub == "camp" && <Link to="/email-campaign" className={location.pathname === "/email-campaign" || location.pathname === '/templates' ? "active" : ""}>
                  <div className="order-detail">

                    <img className="order-detail-child" alt="" src="campaign.svg" />
                    <div className="daily-events">Email Campaigns</div>
                  </div>
                </Link>}

                {IsOpenSub && sub == "camp" && <Link to="/send-messages" className={location.pathname === "/send-messages" ? "active" : ""}>
                  <div className="order-detail">

                    <img className="order-detail-child" alt="" src="/email-campaign.svg" />
                    <div className="daily-events">Send SMS</div>

                  </div>
                </Link>}

                {IsOpenSub && sub == "camp" &&
                  // <Link to="/social-media" className={location.pathname === "/social-media" ? "active" : ""}>
                  //   <div className="order-list">

                  //     <img className="customer-child" alt="" src="/group-30037.svg" />
                  //     <div className="daily-events">Social Media</div>

                  //   </div>


                  // </Link>
                  <Link to="/posts" className={location.pathname === "/posts" ? "active" : ""}>
                    <div className="order-detail">

                      <img className="order-detail-child" alt="" src="/social-media.svg" />
                      <div className="daily-events">Social Media Campaigns</div>

                    </div>
                  </Link>
                }
                {IsOpenSub && sub == "camp" &&
                  <Link to="/unsubscribe" className={location.pathname === "/unsubscribe" ? "active" : ""}>
                    <div className="order-detail">

                      <img className="order-detail-child" alt="" src="/unsubscribe.svg" />
                      <div className="daily-events">Unsubscribed Users</div>

                    </div>
                  </Link>}
              </div>

              <Link to="/klientale-contacts" className={location.pathname === "/klientale-contacts" ? "active" : ""}>
                <div className="order-detail">

                  <img className="order-detail-child" alt="" src="/group-30036.svg" />
                  <div className="daily-events">Klientale Contacts</div>

                </div>
              </Link>
              {roleId == 1 &&
                <Link to="/userlist" className={location.pathname === "/userlist" ? "active" : ""}>
                  <div className="order-detail">

                    <img className="order-detail-child" alt="" src="/group-30036.svg" />
                    <div className="daily-events">Users</div>

                  </div>
                </Link>

              }

              {/* {props.role==1&& <Link to="/roles" className={location.pathname === "/roles" ? "active" : ""} >
  <div className="customer-detail">

    <img className="vector-icon" alt="" src="/role.svg" />
    <div className="properties">Roles</div>
   
  </div>
  </Link>} */}
              {/* <Link to="/mortgage" className={location.pathname === "/mortgage" ? "active" : ""} >
  <div className="customer-detail">

    <img className="vector-icon" alt="" src="/vector.svg" />
    <div className="properties">Mortgage Calculator</div>
   
  </div>
  </Link> */}
              {/* {props.role==1&&<Link to="/website-visitors" className={location.pathname === "/website" ? "active" : ""}>
  <div className="order-list">

    <img className="customer-child" alt="" src="/group-30037.svg" />
    <div className="daily-events">Website Visitors</div>
   
  </div>
  </Link>} */}
              {/* {props.role==1&& <Link to="/permission" className={location.pathname === "/permission" ? "active" : ""} >
  <div className="customer-detail">

      <img className="vector-icon" alt="" src="/permisson.svg" />
        <div className="properties">Permission</div>
    
    </div>
    </Link>} */}




              {auth ? (
                <button className="btn-logout" onClick={() => handleLogout()}>Logout</button>
              ) : (
                <button className="btn-logout" onClick={() => handleLogin()}>Login</button>
              )}


              {/* <div className="add-property-box-side-nav">
    <h6>Add new listing here
to multiply the revenue. </h6>
   
     <div className="add_user_btn">
      <button onClick={() =>navigate("/listing/add")}>
        <img src="/plus.svg" />
        Add Exclusive Listing</button>
      </div>
    </div>          */}

            </div>
          </div>
        </>) :
        <div>
          <Menu
            customBurgerIcon={<FontAwesomeIcon icon={faBars} />} // Use FontAwesome hamburger icon
            isOpen={menuOpen}
            onStateChange={handleStateChange}
          >
            <div className="side-menu" onClick={closeMenu}>
              <Link className="side-users-logo" to="/listing">
                <img className="icon" alt="" src="/insurance.png" />
              </Link>
              <div className="side-menu-child" />
              <div className="menu">
                <Link to="/" className={location.pathname === "/" || location.pathname.includes("/todo-list/add/new-dashboard/") || location.pathname.includes("/todo-list-dashboard/edit/") ? "active" : ""}>
                  <div className="dashboard">

                    <img className="icon" alt="" src="/icon.svg" />

                    <div className="daily-events">Dashboard</div>

                  </div>
                </Link>

                <Link to="/todo-list" className={location.pathname === "/todo-list" || location.pathname.includes("/todo-list/add-task")
                  || location.pathname.includes("/todo-list-todo/edit/")
                  ? "active" : ""}>
                  <div className="order-list">
                    <img className="group-icon" alt="" src="/group.svg" />
                    <div className="daily-events">To-Do List ({tasklength})</div>
                  </div>
                </Link>
                <Link to="/leads" className={location.pathname === "/leads" || location.pathname.includes("/leads/edit/") || location.pathname === "/leads/add" ? "active" : ""}>
                  <div className="order-detail">

                    <img className="order-detail-child" alt="" src="/group-30036.svg" />
                    <div className="daily-events">Leads ({leadlength})</div>

                  </div>
                </Link>

                <Link to="/contacts" className={location.pathname === "/contacts" || location.pathname === "/contacts/add"
                  || location.pathname.includes("/contacts/share/") || location.pathname.includes("/contacts/send/") ||
                  location.pathname.includes('/contact/edit/') ? "active" : ""}>
                  <div className="order-detail">

                    <img className="order-detail-child" alt="" src="/group-30036.svg" />
                    <div className="daily-events">Contacts ({count?.contact_count})</div>

                  </div>
                </Link>
                <Link to="/referral" className={location.pathname.includes('/referral-sent') || location.pathname === "/referral" ? "active" : ""}>
                  <div className="order-detail">

                    <img className="order-detail-child" alt="" src="/referral.svg" />
                    <div className="daily-events">Referrals</div>

                  </div>
                </Link>

                <Link to="/inquires" className={location.pathname.includes('/add-inquery') || location.pathname === "/inquires" ? "active" : ""}>
                <div className="order-detail">

                  <img className="order-detail-child" alt="" src="/referral.svg" />
                  <div className="daily-events">Inquery</div>

                </div>
              </Link>
                {/* 
              {props.role == 1 && <Link to="/vendors" className={location.pathname === "/vendors" ? "active" : ""}>
                <div className="order-detail">

                  <img className="order-detail-child" alt="" src="/group-30036.svg" />
                  <div className="daily-events">Vendors ({count?.vendor_count})</div>

                </div>
              </Link>} */}
                {/* {props.role == 1 && <Link to="/categories" className={location.pathname === "/categories" ? "active" : ""} > */}
                {/* <div className="customer-detail">

                  <img className="vector-icon" alt="" src="/vector.svg" />
                  <div className="properties">Categories ({count?.category_count})</div>

                </div>
              </Link>} */}
                {/* {props.role == 1 && <Link to="/social-media" className={location.pathname === "/social-media" ? "active" : ""}>
                <div className="order-list">

                  <img className="customer-child" alt="" src="/group-30037.svg" />
                  <div className="daily-events">Social Media</div>

                </div>
              </Link>} */}

                {/* {props.role == 1 && <Link to="/social" className={location.pathname === "/social" ? "active" : ""}>
                <div className="order-list">

                  <img className="customer-child" alt="" src="/group-30037.svg" />
                  <div className="daily-events">Social Share</div>

                </div>

              </Link>} */}
                {/* {props.role == 1 && <Link to="/users" className={location.pathname === "/users" ? "active" : ""}>
                <div className="order-list">

                  <img className="customer-child" alt="" src="/group-30037.svg" />
                  <div className="daily-events">Users ({count?.owner_count})</div>

                </div>
              </Link>} */}
                {/* {props.role==1&&<Link to="/roles" className={location.pathname === "/roles" ? "active" : ""} >
  <div className="customer-detail">

    <img className="vector-icon" alt="" src="/role.svg" />
    <div className="properties">Roles</div>
   
  </div>
  </Link>} */}
                {/* <Link to="/mortgage" className={location.pathname === "/mortgage" ? "active" : ""} >
  <div className="customer-detail">

    <img className="vector-icon" alt="" src="/vector.svg" />
    <div className="properties">Mortgage Calculator</div>
   
  </div>

  </Link> */}
                {roleId == 1 &&
                  <Link to="/analytics" className={location.pathname === "/analytics" ? "active" : ""}>
                    <div className="order-list">

                      <img className="customer-child" alt="" src="/group-30037.svg" />
                      <div className="daily-events">Analytics</div>

                    </div>
                  </Link>}
                {/* {props.role == 1 && <div onClick={() => { setSub("camp"); isOpenSub(); }} className={IsOpenSub && sub == "camp" ? "customer-detail administrator-drop active" : "customer-detail administrator-drop"} >
                <img className="vector-icon" alt="" src="/vector.svg" />
                <div className="properties daily-events" >Campaigns</div>
              </div>} */}

                <div onClick={handleInnerOptionClick} className={IsOpenSub && sub == "camp" ? "customer-detail administrator-drop active" : "customer-detail administrator-drop"} >
                  <img className="vector-icon" alt="" src="/vector.svg" />
                  <div className="properties daily-events" >Campaigns</div>
                </div>

                <div className="subMenu-drp">
                  {IsOpenSub && sub == "camp" && <Link to="/email-campaign" className={location.pathname === "/email-campaign" ? "active" : ""}>
                    <div className="order-detail">

                      <img className="order-detail-child" alt="" src="/group-30036.svg" />
                      <div className="daily-events">Email Campaigns</div>
                    </div>
                  </Link>}

                  {IsOpenSub && sub == "camp" && <Link to="/send-messages" className={location.pathname === "/send-messages" ? "active" : ""}>
                    <div className="order-detail">

                      <img className="order-detail-child" alt="" src="/group-30036.svg" />
                      <div className="daily-events">Send SMS</div>

                    </div>
                  </Link>}

                  {IsOpenSub && sub == "camp" &&
                    // <Link to="/social-media" className={location.pathname === "/social-media" ? "active" : ""}>
                    //   <div className="order-list">

                    //     <img className="customer-child" alt="" src="/group-30037.svg" />
                    //     <div className="daily-events">Social Media</div>

                    //   </div>


                    // </Link>
                    <Link to="/posts" className={location.pathname === "/posts" ? "active" : ""}>
                      <div className="order-detail">

                        <img className="order-detail-child" alt="" src="/group-30036.svg" />
                        <div className="daily-events">Social Media Campaigns</div>

                      </div>
                    </Link>
                  }
                  {IsOpenSub && sub == "camp" &&
                    <Link to="/unsubscribe" className={location.pathname === "/unsubscribe" ? "active" : ""}>
                      <div className="order-detail">

                        <img className="order-detail-child" alt="" src="/group-30036.svg" />
                        <div className="daily-events">Unsubscribed Users</div>

                      </div>
                    </Link>}
                </div>


                <Link to="/klientale-contacts" className={location.pathname === "/klientale-contacts" ? "active" : ""}>
                  <div className="order-detail">

                    <img className="order-detail-child" alt="" src="/group-30036.svg" />
                    <div className="daily-events">Klientale Contacts</div>

                  </div>
                </Link>
                {roleId == 1 &&
                  <Link to="/userlist" className={location.pathname === "/userlist" ? "active" : ""}>
                    <div className="order-detail">

                      <img className="order-detail-child" alt="" src="/group-30036.svg" />
                      <div className="daily-events">Users</div>

                    </div>
                  </Link>}



                {/* {props.role==1&&<Link to="/permission" className={location.pathname === "/permission" ? "active" : ""} >
  <div className="customer-detail">

    <img className="vector-icon" alt="" src="/permisson.svg" />
    <div className="properties">Permission</div>
   
  </div>
  </Link>} */}
                <div className="add_user_btn">
                  {auth ? (
                    <button onClick={() => handleLogout()}>Logout</button>
                  ) : (
                    <button onClick={() => handleLogin()}>Login</button>
                  )}
                </div>

              </div>
            </div>
          </Menu>
        </div>
      }
    </>


  )



}
export default Sidebar