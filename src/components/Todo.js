// src/components/Admin.js
import React, { useContext, useEffect, useState } from "react";
import "./admin.css";
import axios from "axios";
import Modal from "react-modal";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { AuthContext } from "./context/AuthContext";
import Show from "./Show";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-confirm-alert/src/react-confirm-alert.css';

const TodoList = ({role}) => {

  const [tasks, setTasks] = useState([]); // Replace 'users' with 'tasks'
  const [width, setWidth] = useState(window.innerWidth);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [editingTask, setEditingTask] = useState(null); // Replace 'editingUser' with 'editingTask'

  const navigate = useNavigate();
  const { auth,setAuth,todo,setTodo,tasklength,setTasklength } = useContext(AuthContext);


  const headers = {
    Authorization: auth.token,
  };
  // const formatDate = (dateTimeString) => {
  //   if (!dateTimeString) {
  //     return ""; // Handle cases where the date-time string is empty or undefined
  //   }
 
  //   const dateTime = new Date(dateTimeString);
  
  //   const year = dateTime.getFullYear();
  //   const month = String(dateTime.getMonth() + 1).padStart(2, "0");
  //   const day = String(dateTime.getDate()).padStart(2, "0");
  //   const hours = String(dateTime.getHours()).padStart(2, "0");
  
  //   const minutes = String(dateTime.getMinutes()).padStart(2, "0");
  //   const seconds = String(dateTime.getSeconds()).padStart(2, "0");
  
  //   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  // };
  const formatDate = (dateTimeString) => {
    if (!dateTimeString) {
      return "";
    }
  
    const dateTime = new Date(dateTimeString);
  
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    };
  
    const localDateTimeString = dateTime.toLocaleString('en-US', options);
  
    return localDateTimeString;
  };
  const formatDateNew = (dateTimeString) => {
    if (!dateTimeString) {
      return ""; // Handle cases where the date-time string is empty or undefined
    }
 
    const dateTime = new Date(dateTimeString);
   
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const day = String(dateTime.getDate()).padStart(2, "0");
    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");
    const seconds = String(dateTime.getSeconds()).padStart(2, "0");
  
    return `${month}-${day}`;
  };
  // Example usage:
 // Outputs: "2023-09-26 14:30:00"
  
  const url = process.env.REACT_APP_API_URL;
  // Rest of your code...


  const handleDeleteClick = (propertyId) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this task?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleDelete(propertyId),
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  const handleDelete = async (propertyId) => {
    await axios.delete(`${url}api/todo/delete/${propertyId}`, { headers });

    toast.success('Todo deleted successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
    setTasks(tasks.filter((p) => p.id !== propertyId));
  };
  const filteredContacts = tasks.filter((contact) => {
    const searchText = searchQuery.toLowerCase();

    return (
      contact?.Followup?.toLowerCase().includes(searchText) ||
      
    
      contact?.Comments?.toLowerCase().includes(searchText) ||
 
      contact?.phone?.toLowerCase().includes(searchText) 
)

  });



  const getTasks = async () => {
    try {
      const response = await axios.get(`${url}api/todo/get`, { headers });
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      // const filteredData = response.data.filter((item) => {
      //   return new Date(item.FollowupDate) > today &&  
      //   new Date(item.FollowupDate) < weekFromNow;
      // });
      // Set the filtered contacts in the state

const todayMonthDay = (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');

const birthdayTodos = response.data.filter((todo) => {
  if (todo.isBirthday || todo.isAnniversary) {
   
    // Extract the month and day part of the FollowupDate
    const todoMonthDay = formatDateNew(todo?.FollowupDate)

    return todoMonthDay === todayMonthDay;
  }
  return todo
});
      setTasks(birthdayTodos);

    

    } catch (error) {
      console.error(error)
      // localStorage.removeItem('token');
      // setAuth(null);
      // navigate('/');
    }

  };





  useEffect(() => {
    getTasks(); // Replace 'getUsers' with 'getTasks'
    // Rest of your code...
  }, []);

  const changeStatus=async(status,id)=>{
    const response = await axios.put(`${url}api/todo/update/${id}`,
    {IsRead:status},
    { headers });

    getTasks()
    
  } 
  const formatPhoneNumber = (phoneNumber) => {
    if(!phoneNumber){
      return ''
    }
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  };
  
  // Rest of your code...
  const contactsPerPage = 20; // Adjust the number of contacts per page as needed

  const contactsToDisplay = filteredContacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
  )
  
// Adjust the number of contacts per page as needed
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  return (
    <div className="add_property_btn">
   

      

      <div className="inner-pages-top">
        <h3>To-Do List</h3>

        <div className="add_user_btn">
          <button onClick={() =>navigate("/todo-list/add")}>
            <img src="/plus.svg" />
           Create Task
          </button>
        </div>
        <div className="search-group">
          <input type="text" 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search here" />
          <img src="/search.svg" />
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
           

<th>Task Title</th>
<th>Follow Up Date</th>	
<th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {contactsToDisplay?.map((task, index) => (
              <>
             { !task.IsRead&&<tr key={task.id}>
                <td
                  className="property-link"
                  onClick={() => {
                    setTodo(task)
                    navigate(`/todo-list/edit/${task.id}`);
                  }}
                >
                  {task.Followup}
                </td>
              
              <td>
                {formatDate(task.FollowupDate)}
              </td>
        
              <td>
                {task.phone!=undefined || task.phone!="null" ?formatPhoneNumber(task.phone):""}
              </td>
              {/* <td>
                {task.client?.firstname}
              </td>
            
              <td>
                {task.realtor?.name}
              </td> */}
             {/* {task.contact? <td   className="property-link"   onClick={() => {
                   
                    navigate(`/contact/edit/${task.contact.id}`);
                  }}>
                { task.contact.firstname}
              </td>:<td></td>} */}
      
              <td>
              <button className="permissions"
                   onClick={()=>{
                    changeStatus(!task.IsRead,task.id)
                 setTasklength(tasklength-1)
                   }}
                   
                   > Mark as {task.IsRead ? "unread" : "read"}</button>
               </td>
           <td> <button className="permissions"
          onClick={()=>navigate(`/todo-list/followup/${task.id}`)} >Create Follow-Up</button></td>  
             
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
      { contactsToDisplay.length==0 && <p className="no-data">No data Found</p>}
    </div>
  );
};

export default TodoList;
