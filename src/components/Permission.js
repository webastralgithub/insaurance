import React, { useState, useEffect, useContext } from "react";
import "./Roles.css";
import Modal from "react-modal";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "./context/AuthContext";
import ReactSwitch from "react-switch";

const Permission = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [editingRole, setEditingRole] = useState(null);
  const [switchStates, setSwitchStates] = useState({});
  const {auth}=useContext(AuthContext)
  const headers={
    Authorization:auth.token
  }
const url=process.env.REACT_APP_API_URL
  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    try {
      const response = await axios.get(`${url}api/role`, headers);
      const rolesWithPermissions = response.data.roles.slice(1);
  
      // Initialize switch states based on received permissions
      const initialSwitchStates = {};
      rolesWithPermissions.forEach((role) => {
        initialSwitchStates[role.id] = {
          can_create: role.permissions[0]?.can_create || false,
          can_read: role.permissions[0]?.can_read || false,
          can_update: role.permissions[0]?.can_update || false,
          can_delete: role.permissions[0]?.can_delete || false,
        };
      });
  
      setRoles(rolesWithPermissions);
      setSwitchStates(initialSwitchStates);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };
  

  const handleSwitchChange = (roleId, permission) => {

   
    setSwitchStates((prevState) => ({
      ...prevState,
      [roleId]: {
        ...prevState[roleId],
        [permission]: !prevState[roleId]?.[permission],
      },
    }));
    console.log(switchStates);
    sendDataToApi(roleId, permission,'Property');
  };

  const sendDataToApi = async (roleId, permission,resource_name) => {

    try {
      const response = await axios.post(`${url}api/role/permission`, {
        roleId,
        permission,
        resource_name,
        value: switchStates[roleId]?.[permission]==true?false:true,
      });

      toast.success(' Permission updated successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });

    } catch (error) {
      console.error('Error sending data to the API:', error);
    }
  };


  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };



 

  return (
     <div className="add_property_btn">
      <div className="inner-pages-top">
         <h3>Permission</h3>
      </div>
      
      <div className="table-container">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Property</th>
      </tr>
    </thead>
    <tbody>
      {roles.length && roles.map((role) => (
       <tr key={role.id}>
       <td>{role.name}</td>
       <td className="permission-tick-block-wraper">
         <label className="permission-tick-block">
           Edit
           <ReactSwitch
             checked={switchStates[role.id]?.can_create || false}
             onChange={() => handleSwitchChange(role.id, 'can_create')}
           />
         </label>
         <label className="permission-tick-block">
           View
           <ReactSwitch
             checked={switchStates[role.id]?.can_read || false}
             onChange={() => handleSwitchChange(role.id, 'can_read')}
           />
         </label>
         <label className="permission-tick-block">
           Update
           <ReactSwitch
             checked={switchStates[role.id]?.can_update || false}
             onChange={() => handleSwitchChange(role.id, 'can_update')}
           />
         </label>
         <label className="permission-tick-block">
           Delete
           <ReactSwitch
             checked={switchStates[role.id]?.can_delete || false}
             onChange={() => handleSwitchChange(role.id, 'can_delete')}
           />
         </label>
       </td>
     </tr>
      ))}
    </tbody>
  </table>
</div>

</div>
  );
};

export default Permission;