import React, { useState, useEffect, useContext } from "react";
import "./Roles.css";
import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";

const Roles = () => {
const navigate=useNavigate()
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [editingRole, setEditingRole] = useState(null);


  const {auth}=useContext(AuthContext)
  const headers={
    Authorization:auth.token
  }
const url=process.env.REACT_APP_API_URL
  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    const response = await axios.get(`${url}api/role`,headers);
    setRoles(response.data.roles.slice(1));
  };

  const openModal = (mode, role) => {
    setModalMode(mode);
    setEditingRole(role);
    setIsOpen(true);
  };

  const closeModal = () => {
    setModalMode("");
    setEditingRole(null);
    setIsOpen(false);
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "#000",
      border:"1px solid #fff",
    },
    overlay:{
      backgroundColor: "rgb(0 0 0 / 75%)",
    }
  };


  const addRole = async (role) => {
    console.log(headers)
    const response = await axios.post(`${url}api/role/create`, role,{headers});
    getRoles()
    closeModal();
  };

  const updateRole = async (updatedRole) => {
    const response = await axios.put(
      url+`api/role/update/${updatedRole.id}`,
      updatedRole
    );
    const updatedRoles = roles.map((r) =>
      r.id === updatedRole.id ? response.data : r
    );
    setRoles(updatedRoles);
    closeModal();
  };

  const deleteRole = async (roleId) => {
    await axios.delete(`/roles/${roleId}`);
    setRoles(roles.filter((r) => r.id !== roleId));
  };

  return (
     <div className="add_property_btn">
 <div className="inner-pages-top">
     <h3>Roles</h3>
      <div className="add_user_btn">
        <button onClick={() => openModal("add")}>Add Role</button>
      </div>


      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >

    
        {modalMode === "add" && (
          <AddRoleForm onAdd={addRole} onCancel={closeModal} />
        )}

        {modalMode === "edit" && (
          <EditRoleForm
            role={editingRole}
            onSave={updateRole}
            onCancel={closeModal}
          />
        )}
      </Modal>
  
  </div> 
      <div className="table-container">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th></th>
        <th>Actions</th>
   
      </tr>
    </thead>
    <tbody>
      {roles.length && roles.map((role) => (
        <tr key={role.id}>
          <td>{role.name}</td>
          <td onClick={()=>{
           navigate("/permission")
          }
          }><button className="permissions"> Permissions</button></td>
          <td className="table-action-btn">
            <button onClick={() => openModal("edit", role)} className="edit-btn">
              Edit
            </button>
            <button onClick={() => deleteRole(role.id)} className="delet-btn">
              Delete
            </button>
          </td>
        
        </tr>
      ))}
    </tbody>
  </table>
</div>

</div>
  );
};

const AddRoleForm = ({ onAdd, onCancel }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ name });


  };

  return (

    <div className="modal-roles-add">
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Role name"
      />
      <button type="submit">Add Role</button>
      <button onClick={onCancel}>Cancel</button>
    </form>
    </div>
  );
};

const EditRoleForm = ({ role, onSave, onCancel }) => {
  const [name, setName] = useState(role.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...role, name });
  };

  return (
    <div className="modal-roles-add">
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Role name"
      />
      <button type="submit">Save Role</button>
      <button onClick={onCancel}>Cancel</button>
    </form>
    </div>
  );
};

export default Roles;