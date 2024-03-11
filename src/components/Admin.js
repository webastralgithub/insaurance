// src/components/Admin.js
import React, { useContext, useEffect, useState } from "react";
import "./admin.css"
import axios from "axios";
import Modal from "react-modal";
import { AuthContext } from "./context/AuthContext";
import Show from "./Show";

const Admin = () => {


const [users,setUsers]=useState([])


  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const [width, setWidth] = useState(window.innerWidth);
  const {auth}=useContext(AuthContext)

  const headers={
    Authorization:auth.token
  }
const url=process.env.REACT_APP_API_URL
const [roles,setRoles]=useState([])



const handleWindowSizeChange = () => {
  setWidth(window.innerWidth);
};

useEffect(() => {
  window.addEventListener('resize', handleWindowSizeChange);
  return () => {
    window.removeEventListener('resize', handleWindowSizeChange);
  };
}, []);
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
  const updateRole = async (updatedRole) => {
    const response = await axios.put(
      `/roles/${updatedRole.id}`,
      updatedRole
    );
    const updatedRoles = roles.map((r) =>
      r.id === updatedRole.id ? response.data : r
    );
    setRoles(updatedRoles);
    closeModal();
  };
  const handleCreateUser = async (userData) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}api/admin/create-user`,userData,{headers} );
      console.log("User created successfully!");
      getUsers()
      closeModal()
    } catch (error) {
      console.error("User creation failed:", error);
    }
  };
 

  const openModal = (mode, role) => {
    setModalMode(mode);
    setEditingUser (role);
    setIsOpen(true);
  };
  const closeModal = () => {
    setModalMode("");
    setEditingUser(null);
    setIsOpen(false);
  };
 
  console.log("Userfggfg ",roles);
  const getRoles = async () => {
    try {
     const res= await axios.get(`${process.env.REACT_APP_API_URL}api/role`);
     setRoles(res.data.roles)
      console.log("User created successfully!",res);
    } catch (error) {
      console.error("User creation failed:", error);
    }
  };
  const getUsers = async () => {
    try {
     const res= await axios.get(`${process.env.REACT_APP_API_URL}api/admin/get-users`, { headers });
     setUsers(res.data)
      console.log("User created successfully!",res);
    } catch (error) {
      console.error("User creation failed:", error);
    }
  };

  return (
    <div className="add_property_btn">


<Modal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  style={customStyles}
>
  {modalMode === "add" && (
    <AddUserForm onAdd={handleCreateUser} roles={roles} onCancel={closeModal} />
  )}

  {modalMode === "edit" && (
    <EditRoleForm
      role={editingUser}
      onSave={updateRole}
      onCancel={closeModal}
    />
  )}
</Modal>

<div className="inner-pages-top">
<h3>Contacts</h3>


      <div className="add_user_btn">
      <button onClick={() => openModal("add")}>
        <img src="/plus.svg" />
        Add User</button>
      </div>
     <div className="search-group">
       <input type="text" placeholder="Search here"/>
       <img src="/search.svg" />
      </div>
   
      </div>
      <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Name</th>
            <th>Email Address</th>
            <th>Phone</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <>
              {user.roles?.name!='Realtor' && <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user?.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.roles?.name}</td>
              </tr>}
              </>
          ))}
        </tbody>
      </table>
      </div>
     
     
   
    </div>
  );
};



const AddUserForm = ({ onAdd, onCancel,roles }) => {
  const [name, setName] = useState("");

  const [userData, setUserData] = useState({
    username: "",
    password: "",
    roleId: "",
    name:"",
    email:"",
    phone:""
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(userData)
    setUserData({ ...userData,[name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(userData);
  };
  

  return (
    <form onSubmit={handleSubmit} className="form-user-add add-user-new">
      <div className="form-user-add-wrapper">
        <div className="form-user-add-inner-wrap">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={userData.username}
          onChange={handleChange}
        />
        </div>

        <div className="form-user-add-inner-wrap">
          <label>Email</label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
        />
        </div>
        <div className="form-user-add-inner-wrap">
          <label>Name</label>
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
        />
        </div>


        <div className="form-user-add-inner-wrap">
              <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={userData.phone}
          onChange={handleChange}
        />
        </div>


        <div className="form-user-add-inner-wrap">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
        />
        </div>

      <div className="form-user-add-inner-wrap">
        <label>Role</label>
        <select name="roleId" value={userData.role} onChange={handleChange}>
        {roles?.map(role=> <option value={role.id}>{role.name}</option>)}
         
        </select>
      </div>

      </div>
      <div className="form-user-add-inner-btm-btn-wrap">
        <button type="submit">Add User</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

const EditRoleForm = ({ role, onSave, onCancel }) => {
  
  const [name, setName] = useState(role.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...role, name });
  };

  return (
    <form onSubmit={handleSubmit}>
     
      <button type="submit">Save Role</button>
      <button onClick={onCancel}>Cancel</button>
    </form>
  );
};
export default Admin;
