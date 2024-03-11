import React, { useContext, useEffect, useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import './Navbar.css';
import { AuthContext } from './context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [width, setWidth] = useState(window.innerWidth);
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

  return (
    <>
      {width > 768 ? (
        <nav>
          <ul className="nav-links">
            <div className="logo logo-desktop">
              <a href="http://realestate.millennialgroup.ca">
                <img
                  src="http://realestate.millennialgroup.ca/wp-content/uploads/2021/06/logo-transparent-min.png"
                  height="90"
                  width=""
                  alt="logo"
                />
              </a>
            </div>
            <div className="links-handle">
              {!auth && <li><Link to="/">Home</Link></li>}
              <li> <Link to="/property">Property</Link>  </li>
              <li><Link to="/add-user">Users</Link></li>
              <li><Link to="/roles">Role</Link></li>
            </div>
            {auth ? (
              <button onClick={() => handleLogout()}>Logout</button>
            ) : (
              <button onClick={() => handleLogin()}>Login</button>
            )}
          </ul>
        </nav>
      ) : (
        <nav>
            <div className="logo logo-desktop">
              <a href="http://realestate.millennialgroup.ca">
                <img
                  src="http://realestate.millennialgroup.ca/wp-content/uploads/2021/06/logo-transparent-min.png"
                  height="90"
                  width=""
                  alt="logo"
                />
              </a>
            </div>
        <Menu
          customBurgerIcon={<FontAwesomeIcon icon={faBars} />} // Use FontAwesome hamburger icon
        >
          
            {!auth && <Link className="menu-item" to="/">Home</Link>}
            <Link className="menu-item" to="/add-user">Users</Link>
            <Link className="menu-item" to="/property">Property</Link>
            <Link className="menu-item" to="/roles">Role</Link>
          
          {auth ? (
            <button className="menu-item" onClick={() => handleLogout()}>Logout</button>
          ) : (
            <button className="menu-item" onClick={() => handleLogin()}>Login</button>
          )}
        </Menu>
        </nav>
      )}
    </>
  );
};

export default Navbar;
