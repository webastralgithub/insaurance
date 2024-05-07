// src/components/Admin.js
import React, { useContext, useEffect, useState } from "react";
import "./admin.css"
import axios from "axios";

import { AuthContext } from "./context/AuthContext";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Fbnew from "./Fbnew";
import Instanew from "./Instanew";

const SocialMedia = () => {


const [users,setUsers]=useState([])

const [width, setWidth] = useState(window.innerWidth);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  function formatPhoneNumber(phoneNumber) {
    // Check if the phoneNumber is valid (you can add more validation)
    if (/^\+?[0-9\s]+$/.test(phoneNumber)) {
phoneNumber=phoneNumber.slice(0,10)
        return phoneNumber.replace(/\s/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '+1 ($1) $2-$3').replace(/ /g, '\u00a0');
    } else {
        return 'Invalid phone number';
    }
}
const navigate=useNavigate()
  const {auth}=useContext(AuthContext)

  const headers={
    Authorization:auth.token
  }

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };
  const handleFacebookLogin = (response) => {
    // Handle the response from Facebook login
   
  };
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);
const url=process.env.REACT_APP_API_URL
const [roles,setRoles]=useState([])
  useEffect(()=>{
    getUsers()
    getRoles()
  },[])


  const styles = {
    overlay:{
      backgroundColor:"rgb(0 0 0 / 75%)",
      zIndex: "99999",
      overflow:'scroll',
    },
    content:width>400? {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      border:"none",
      background: "#000",
      border:"1px solid #fff",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",

      width: "60%",
      borderRadius:"24px",
    }:{
      
        position: "absolute",
        inset: "56% auto auto 50%",
        border:" none",
        background: "#000",
        border:"1px solid #fff",
        overflow:" auto",
        borderRadius: "10px",
        outline: "none",

        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "68%",
       
    
    },
  };



 
  const mediaQuery = window.matchMedia("(max-width: 768px)");
  const mediaQueryMobile = window.matchMedia("(max-width: 480px)");
  const mediaQueryMobileNext = window.matchMedia("(max-width: 600px)");

  const customStyles = {
    overlay: {
      ...styles.overlay,
    },
    content: {
      ...styles.content,
   
      width:mediaQueryMobileNext.matches?"80%":mediaQuery.matches?"68%":"60%"
      

    },
  };
  const filteredUsersNew = users?.filter((user) =>

  (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
   user.email.toLowerCase().includes(searchQuery.toLowerCase()) )
);
 
const ITEMS_PER_PAGE = 10;
const handlePageChange = (newPage) => {
  setCurrentPage(newPage);
};
const totalPages = Math.ceil(filteredUsersNew?.length / ITEMS_PER_PAGE);

// Calculate the start and end indices for the current page
const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
const endIndex = startIndex + ITEMS_PER_PAGE;
const filteredUsers = filteredUsersNew?.slice(startIndex, endIndex);

  const getRoles = async () => {
    try {
    //  const res= await axios.get(`${process.env.REACT_APP_API_URL}api/role`);
    //  setRoles(res.data.roles)

    } catch (error) {
      console.error("User creation failed:", error);
    }
  };
  const getUsers = async () => {
    try {
     const res= await axios.get(`${process.env.REACT_APP_API_URL}api/social/get`, { headers });

     setUsers(res.data)

    } catch (error) {
      console.error("User creation failed:", error);
    }
  };
  const activate = async (status,id) => {
  

    try {
//       var form_data = new FormData();
// for ( var key in user ) {
//     form_data.append(key, user[key]);
// }

      const response = await axios.put(`${url}api/admin/admin/change-realtor/${id}`,{
isActivate:status
      },{headers});
getUsers()
      toast.success("User data updated successfully", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="add_property_btn">




<div className="inner-pages-top">
<h3>Social Media Users</h3>


      <div className="add_user_btn">
    <Fbnew url={url} headers={headers}/>
    {/* <Instanew /> */}
      </div>   
     <div className="search-group">
       <input type="text"
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
       
       placeholder="Search here"/>
       <img src="/search.svg" />
      </div>
   
      </div>
      <div className="table-container">
      <table>
        <thead>
          <tr>
         
           
            <th>Full Name</th>
            <th>Email</th>
           
      
        <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers?.map((user) => (
            <>
              { <tr key={user.id}>
               
          
                <td className="property-link" onClick={()=>{
                  
                }}>{user?.name}</td>
                <td>{user.email}</td>
            
               <td></td>
              </tr>}

              </>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
  <div className="pagination">
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index + 1}
        onClick={() => handlePageChange(index + 1)}
        className={currentPage === index + 1 ? 'active' : ''}
      >
        {index + 1}
      </button>
    ))}
  </div>
)}
      </div>
      {filteredUsers?.length==0 && <p className="no-data">No data Found</p>}
     
   
    </div>
  );
};




export default SocialMedia;
