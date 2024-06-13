import React, { useState, useEffect, useContext, useRef } from "react";
import "./admin.css"
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Post = ({ role }) => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const headers = { Authorization: auth.token };
  const url = process.env.REACT_APP_API_URL;
  let searchRef = useRef("")
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userList, setUserList] = useState([])
  const [totalPages, setTotalPages] = useState("");
  const [dataLoader, setDataLoader] = useState(false)
  const [buttonActive, setButtonActive] = useState(1)

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
    try {
      setDataLoader(true)
      await axios.delete(`${url}api/post/${postid}`, { headers });
      toast.success('Post deleted successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
      getUserList()
      setDataLoader(false)
    } catch (error) {
      setDataLoader(false)
      toast.error("Server is Busy")
      console.error(error)
    }
  }

  const getUserList = async () => {
    setDataLoader(true)
    let currPage
    if (searchRef.current.value) {
      currPage = ''
    } else {
      currPage = currentPage
    }
    try {
      const response = await axios.get(`${url}api/post?search=${searchRef.current.value}&page=${currPage}`, { headers });
      setUserList(response.data.posts);
      setTotalPages(response.data.totalPages);
      setDataLoader(false)
    } catch (error) {
      setDataLoader(false)
      console.error("Server is busy");
    }
  };

  useEffect(() => {
    getUserList();
  }, [currentPage]);

  const clearSearch = () => {
    searchRef.current.value = ""
    setButtonActive(1)
    getUserList();
  };

  const handleKeyDownEnter = (event) => {
    if (event.key === 'Enter') {
      setButtonActive(2)
      getUserList()
    }
  };

  const handleKeyDown = () => {
    setButtonActive(2)
    getUserList();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers.map((number) => (
      <button className={currentPage === number ? "active" : ""}
        key={number} onClick={() => handlePageChange(number)}>{number}</button>
    ));
  };
  return (
    <div className="add_property_btn">
      <div className="inner-pages-top">


        <h3>Social Media Posts</h3>
        <div className="add_user_btn">
          <button onClick={() => navigate("/add-post")}>
            <img src="/plus.svg" />
            Add Post</button>
        </div>
        <div className="search-grp-with-btn">
          <div className="search-group">
            <input type="text"
              onKeyDown={handleKeyDownEnter}
              ref={searchRef}
              placeholder="Search here" />
            {/* {buttonActive == 1 && <img src="/search.svg" onClick={handleKeyDown} />}
            {buttonActive == 2 && <FontAwesomeIcon icon={faXmark} onClick={clearSearch} />} */}
          </div>
          <div className="add_user_btn ">
            <button className='custom-search-btn-btn-search' onClick={handleKeyDown}>Search</button>
          </div>
        </div>


        {/* Rest of your component remains the same... */}
      </div>
      <div className="table-container">
        {dataLoader ?
          (<div className="sekelton-class" style={{ backgroundColor: 'white' }} >
            <Skeleton height={50} count={10} style={{ margin: '5px 0' }} />
          </div>)

          : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              {userList.length > 0 &&
                userList.map((contact) => (<tbody>
                  <tr key={contact.id}>
                    <td className="property-link" onClick={() => handleView(contact.id)}>{contact.name}</td>
                    <td >{contact?.description?.replace(/(<([^>]+)>)/gi, '').slice(0, 100).replace(/(?<=\s)\S*$/i, '')}</td>
                    <td> <img className="delete-btn-ico" src="/delete.svg"
                      onClick={() => handleDeleteClick(contact.id)}       ></img>
                    </td>
                  </tr>
                </tbody>))}
            </table>
          )}

        {userList?.length > 0 && (
          <div className="pagination">
            {renderPageNumbers()}
          </div>
        )}
      </div>
      {!userList && !dataLoader && <p className="no-data">No data Found</p>}
    </div>
  );
};

export default Post;
