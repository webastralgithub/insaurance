import React, { useState, useEffect, useContext, useRef } from "react";
import Select, { components } from 'react-select';
import "./admin.css"

import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Message, toaster } from "rsuite";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate, useRouter } from "react-router-dom";

const Post = ({ role }) => {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();
  const [parentView, setParentView] = useState(false)
  const [parentName, setParentName] = useState([])
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [width, setWidth] = useState(window.innerWidth);
  const { auth} = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);


  const handleDeleteClick = (propertyId) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this Post?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleDelete(propertyId),
        },
        {
          label: 'No',
          onClick: () => { },
        },
      ],
    });
  };

  const handleView = (postId) => {
    navigate(`/social/${postId}`)
  }

  const handleDelete = async (postid) => {
    await axios.delete(`${url}api/post/${postid}`, { headers });
    toast.success('Post deleted successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
    setContacts(contacts.filter((p) => p.id !== postid));
  };

  useEffect(() => {
    getContacts();
  }, []);

  const filteredContacts = contacts.filter((contact) => {
    const searchText = searchQuery.toLowerCase();
    return (
      contact?.name?.toLowerCase().includes(searchText) ||
      contact.description?.toLowerCase().includes(searchText)
    );
  });

  const getContacts = async () => {
    try {
      const response = await axios.get(`${url}api/post`, { headers });
      setContacts(response.data);
    } catch (error) {
      console.error(error)
      // localStorage.removeItem('token');
      // setAuth(null);
      // navigate('/');
    }

  };

  const contactsPerPage = 10;
  const contactsToDisplay = filteredContacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
  );

  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  // Rest of your component remains the same...

  return (
    <div className="add_property_btn">
      <div className="inner-pages-top">


        <h3>  {parentView ? `${parentName} Family ` : "Social Media Posts"}</h3>
        <div className="add_user_btn">
          <button onClick={() => navigate("/add-post")}>
            <img src="/plus.svg" />
            Add Post</button>
        </div>
        <div className="search-group">

          <input type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search here" />
          <img src="/search.svg" />
        </div>


        {/* Rest of your component remains the same... */}
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          {contacts.length > 0 &&
            contactsToDisplay.map((contact) => (<tbody>
              <tr key={contact.id}>
                <td className="property-link" onClick={() => handleView(contact.id)}>{contact.name}</td>
                <td >{contact?.description?.replace(/(<([^>]+)>)/gi, '').slice(0, 100).replace(/(?<=\s)\S*$/i, '')}</td>
                <td> <img className="delete-btn-ico" src="/delete.svg"
                  onClick={() => handleDeleteClick(contact.id)}       ></img>
                </td>
              </tr>
            </tbody>))}
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
      {contactsToDisplay.length == 0 && <p className="no-data">No data Found</p>}
    </div>
  );
};

export default Post;
