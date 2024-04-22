
import "./Sidebar.css"
import axios from "axios";
import React, { useContext, useEffect, useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import './Navbar.css';
import { AuthContext } from './context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

  const isOpenSub=()=>{
    if(IsOpenSub == true)
    setIsOpenSub(false)
    
  else
  setIsOpenSub(true)
  }


  const { auth, setAuth, tasklength } = useContext(AuthContext);
  const [toggle, setToggle] = useState(false)
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
  //console.log(window.innerWidth, window.innerHeight)
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

      } catch (error) {
        handleLogout()
      }
    })();
  }, []);

  return (<>
    {width > 991 ? (
      <>
        <div className="side-menu">
          <Link className="top-man-logo" to="/">
            <img className="icon" alt="" src="/insurance.png" />
          </Link>
          <div className="side-menu-child" />
          <div className="menu">
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              <div className="dashboard">

                <img className="icon" alt="" src="/icon.svg" />

                <div className="daily-events">Dashboard </div>

              </div>
            </Link>
           
            <Link to="/todo-list" className={location.pathname === "/todo-list" ? "active" : ""}>
              <div className="order-list">
                <img className="group-icon" alt="" src="/group.svg" />
                <div className="daily-events">To-Do List ({tasklength})</div>
              </div>
            </Link>
            <Link to="/leads" className={location.pathname === "/leads" ? "active" : ""}>
              <div className="order-detail">
                <img className="order-detail-child" alt="" src="/group-30036.svg" />
                <div className="daily-events">Leads ({count?.leads_count})</div>

              </div>
            </Link>
            <Link to="/contacts" className={location.pathname === "/contacts" ? "active" : ""}>
              <div className="order-detail">

                <img className="order-detail-child" alt="" src="/group-30036.svg" />
                <div className="daily-events">Contacts ({count?.contact_count})</div>

              </div>
            </Link>
            <Link to="/referral" className={location.pathname === "/refrals" ? "active" : ""}>
              <div className="order-detail">

                <img className="order-detail-child" alt="" src="/group-30036.svg" />
                <div className="daily-events">Referrals</div>

              </div>
            </Link>
            <Link to="/analytics" className={location.pathname === "/analytics" ? "active" : ""}>
              <div className="order-detail">

                <img className="order-detail-child" alt="" src="/group-30036.svg" />
                <div className="daily-events">Analytics</div>

              </div>
            </Link>
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
            {props.role == 1 && <div onClick={() => { setSub("camp"); isOpenSub(); }} className={IsOpenSub && sub == "camp" ? "customer-detail administrator-drop active" : "customer-detail administrator-drop"} >
                  <img className="vector-icon" alt="" src="/vector.svg" />
                  <div className="properties daily-events" >Campaigns</div>
                </div>}
              
                <div className="subMenu-drp">
                {IsOpenSub && sub == "camp" && props.role == 1 && <Link to="/email-campaign" className={location.pathname === "/email-campaign" ? "active" : ""}>
              <div className="order-detail">

                <img className="order-detail-child" alt="" src="/group-30036.svg" />
                <div className="daily-events">Email Campaigns</div>
               </div>
              </Link>}

            {IsOpenSub && sub == "camp" && props.role == 1 && <Link to="/send-messages" className={location.pathname === "/send-messages" ? "active" : ""}>
              <div className="order-detail">

                <img className="order-detail-child" alt="" src="/group-30036.svg" />
                <div className="daily-events">Send SMS</div>

              </div>
            </Link>}
      
            {IsOpenSub && sub == "camp" && props.role == 1 && 
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
            {IsOpenSub && sub == "camp" && props.role == 1 && <Link to="/unsubscribe" className={location.pathname === "/unsubscribe" ? "active" : ""}>
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
          isOpen={true}
          onStateChange={({ isOpen }) => setMenuOpen(isOpen)}
        >
          <div className="side-menu" onClick={closeMenu}>
            <Link className="side-users-logo" to="/listing">
              <img className="icon" alt="" src="/insurance.png" />
            </Link>
            <div className="side-menu-child" />
            <div className="menu">
              <Link to="/" className={location.pathname === "/" ? "active" : ""}>
                <div className="dashboard">

                  <img className="icon" alt="" src="/icon.svg" />

                  <div className="daily-events">Dashboard</div>

                </div>
              </Link>
             
              <Link to="/todo-list" className={location.pathname === "/todo-list" ? "active" : ""}>
                <div className="order-list">
                  <img className="group-icon" alt="" src="/group.svg" />
                  <div className="daily-events">To-Do List ({tasklength})</div>
                </div>
              </Link>
              <Link to="/leads" className={location.pathname === "/leads" ? "active" : ""}>
                <div className="order-detail">

                  <img className="order-detail-child" alt="" src="/group-30036.svg" />
                  <div className="daily-events">Leads ({count?.leads_count})</div>

                </div>
              </Link>

              <Link to="/contacts" className={location.pathname === "/contacts" ? "active" : ""}>
                <div className="order-detail">

                  <img className="order-detail-child" alt="" src="/group-30036.svg" />
                  <div className="daily-events">Contacts ({count?.contact_count})</div>

                </div>
              </Link>

              {props.role == 1 && <Link to="/vendors" className={location.pathname === "/vendors" ? "active" : ""}>
                <div className="order-detail">

                  <img className="order-detail-child" alt="" src="/group-30036.svg" />
                  <div className="daily-events">Vendors ({count?.vendor_count})</div>

                </div>
              </Link>}
              {props.role == 1 && <Link to="/categories" className={location.pathname === "/categories" ? "active" : ""} >
                <div className="customer-detail">

                  <img className="vector-icon" alt="" src="/vector.svg" />
                  <div className="properties">Categories ({count?.category_count})</div>

                </div>
              </Link>}
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
              {props.role == 1 && <Link to="/users" className={location.pathname === "/users" ? "active" : ""}>
                <div className="order-list">

                  <img className="customer-child" alt="" src="/group-30037.svg" />
                  <div className="daily-events">Users ({count?.owner_count})</div>

                </div>
              </Link>}
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
     {props.role==1&&<Link to="/analytics" className={location.pathname === "/analytics" ? "active" : ""}>
  <div className="order-list">

    <img className="customer-child" alt="" src="/group-30037.svg" />
    <div className="daily-events">Analytics</div>
   
  </div>
  </Link>} 
  {props.role == 1 && <div onClick={() => { setSub("camp"); isOpenSub(); }} className={IsOpenSub && sub == "camp" ? "customer-detail administrator-drop active" : "customer-detail administrator-drop"} >
                  <img className="vector-icon" alt="" src="/vector.svg" />
                  <div className="properties daily-events" >Campaigns</div>
                </div>}
                <div className="subMenu-drp">
                {IsOpenSub && sub == "camp" && props.role == 1 && <Link to="/email-campaign" className={location.pathname === "/email-campaign" ? "active" : ""}>
              <div className="order-detail">

                <img className="order-detail-child" alt="" src="/group-30036.svg" />
                <div className="daily-events">Email Campaigns</div>

              </div>
            </Link>}
            {IsOpenSub && sub == "camp" && props.role == 1 && <Link to="/send-messages" className={location.pathname === "/send-messages" ? "active" : ""}>
            <div className="order-detail">

              <img className="order-detail-child" alt="" src="/group-30036.svg" />
              <div className="daily-events">Send SMS</div>

            </div>
          </Link>}
                 
            {IsOpenSub && sub == "camp" && props.role == 1 && 
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
            {IsOpenSub && sub == "camp" && props.role == 1 && <Link to="/unsubscribe" className={location.pathname === "/unsubscribe" ? "active" : ""}>
              <div className="order-detail">

                <img className="order-detail-child" alt="" src="/group-30036.svg" />
                <div className="daily-events">Unsubscribed Users</div>

              </div>
            </Link>}
           
            </div>
            
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