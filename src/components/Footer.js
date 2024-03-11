import React, { useContext } from 'react';
import './Navbar.css';
import { AuthContext } from './context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
    const { auth,setAuth } = useContext(AuthContext);
     const navigate=useNavigate()
console.log(auth)
    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuth(null);
        navigate('/')
      }
      const handleLogin=()=>{
        navigate('/')
      }
  return (
    <div>
      <ul className="nav_footer">

      <div className="logo logo-desktop">
		<a href="http://realestate.millennialgroup.ca">
							<img  className="footer-logo" src="https://realestate.millennialgroup.ca/wp-content/uploads/2021/12/logo-gray-300x281-1.png" height="140" width="auto"  alt="logo" />
					</a>
	</div>
    <div className='links-footer'>
       {!auth && <li><Link href="/">Home</Link></li>}
        <li><Link to="/add-user">Users</Link></li>
        <li><Link to="/roles">Role</Link></li>
        </div>
      </ul>
    </div>
  );
}

export default Footer;