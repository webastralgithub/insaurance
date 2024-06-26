import React, { useState, useEffect, useContext, useRef } from "react";
import "./admin.css"
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { toast } from "react-toastify";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const ShareMe = ({ role }) => {

  const { id } = useParams()
  const location = useLocation();
  const { data } = location.state;
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataLoader, setDataLoader] = useState(false)
  const { auth } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;
  const klintaleUrl = process.env.REACT_APP_KLINTALE_URL;

  const sendRefferal = async (contact) => {
    setDataLoader(true)
    try {
      setDataLoader(true);
      const response = await axios.post(`${url}api/contacts/share`,
        { sendTo: contact, selectedContacts: [id], type: 1 }, {
        headers,
      });
      if (response.status === 200) {
        toast.success(`${contact.firstname} Shared successfully`, {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
        setDataLoader(false)


      }
      setDataLoader(false)
    } catch (error) {
      setDataLoader(false)
      setDataLoader(false)
      toast.error('Please try after some time email server is busy')
    }
  }

  const handleShareKlintaleClick = async (contact) => {
    setDataLoader(true)
    const { email, phone, name, category_name } = contact;
    const combinedObject = {
      name,
      email,
      phone,
      category_name,
      sendTo: contact.id, selectedContacts: [id],
    };
    try {
      const response = await axios.post(`${url}api/klientale-contact-share-me`, combinedObject, { headers }
      );

      if (response.status === 200) {
        toast.success(`${contact.name} Shared successfully`, {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      setDataLoader(false)
    } catch (error) {
      setDataLoader(false)
      toast.error("error on sharing klintale contact", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error("error on sharing klintale contact", error)
    }

  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const formatPhoneNumber = (phoneNumber) => {
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };


  let searchRef = useRef()
  const [userss, setusers] = useState([])
  const [totalPagess, setTotalPages] = useState("");

  const getTaskss = async () => {
    let currPage
    if (searchRef.current.value) {
      currPage = ''
    } else {
      currPage = currentPage
    }
    try {
      if (active == 0) {
        setDataLoader(true)
        const response = await axios.get(`${url}api/contacts-list?page=${currPage}&search=${searchRef.current.value}`, { headers });
        setusers(response?.data?.contacts)
        setTotalPages(response?.data?.totalPages)
        setDataLoader(false)
      }
      if (active == 1) {
        setDataLoader(true)
        const response = await axios.get(`${klintaleUrl}listings/${localStorage.getItem('email')}?page=${currPage}&search=${searchRef.current.value}&categories=${[]}`, { headers });
        setusers(response?.data?.users)
        setTotalPages(response?.data?.totalPages)
        setDataLoader(false)
      }

    } catch (error) {
      setDataLoader(false)
      console.error("Server is busy");
    }
  };
  useEffect(() => {
    getTaskss();
  }, [currentPage, active]);


  const handleKeyDownEnter = (event) => {
    if (event.key === 'Enter') {
      // setButtonActive(2)
      getTaskss()
    }
  };

  const clearSearch = () => {
    // setButtonActive(1)
    searchRef.current.value = ""
    getTaskss();
  };
  const handleKeyDown = () => {
    // setButtonActive(2)
    getTaskss();
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPagess; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers.map((number) => (
      <button className={currentPage === number ? "active" : ""}
        key={number} onClick={() => handlePageChange(number)}>{number}</button>
    ));
  };


  return (
    <div>
      <div className="add_property_btn">
        <div className="inner-pages-top inner-pages-top-share-ref" style={{ "padding-bottom": "34px" }}>
          <h3> <button className="back-only-btn"
            onClick={() => {
              navigate("/contacts"); // Change the view state to "contacts"
            }}
          > <img src="/back.svg" /></button> {"Share Me"} ({data?.firstname})</h3>
          <span className="share-text" style={{ "font-size": "17px", "font-weight": "700", "display": "flex", "margin-top": "6px", "position": "absolute", "top": "200px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-share" viewBox="0 0 16 16">
              <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" />
            </svg>
            Share my info to your following contacts</span>
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
        </div>

        <div className="inner-pages-top inner-pages-top-share-ref inner-pages-top-share-ref-tab">
          <div className="add_user_btn">
            <button className={!active ? 'active' : ''} onClick={() => { setCurrentPage(1); setActive(0) }}>
              Personal Contacts</button>
            <button className={active ? 'active' : ''} onClick={() => { setCurrentPage(1); setActive(1) }}>
              Klientale Contacts</button>
          </div>
        </div>

        {/* Rest of your component remains the same... */}

        <div className="table-container share-ref-table-in">
          {dataLoader ?
            (<div className="sekelton-class" style={{ backgroundColor: 'white' }} >
              <Skeleton height={50} count={10} style={{ margin: '5px 0' }} />
            </div>)
            : (
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Business Name</th>
                    <th>Profession</th>
                    <th>Phone</th>
                    <th>Email Id</th>
                  </tr>
                </thead>

                {active === 0 && <>
                  {userss?.length > 0 &&
                    userss?.map((contact) => (contact.id != id && <tbody>
                      <tr key={contact.id}>
                        <td>  <button className="permissions share-ref-button-tb"
                          onClick={() => {
                            sendRefferal(contact)
                          }} >Share</button>       </td>
                        <td>{contact.firstname}</td>
                        <td>{contact.business_name}</td>
                        <td>{contact.profession_id > 0 ? contact.profession.name : ""}</td>
                        <td>{contact.phone && formatPhoneNumber(contact.phone)}</td>
                        <td>{contact.email}</td>
                      </tr>
                    </tbody>))}
                </>
                }

                {/* {  klintale contacts} */}
                {active === 1 && <>
                  {userss?.length > 0 &&
                    userss?.map((contact) => (contact.id != id && <tbody>

                      <tr key={contact.id}>
                        <td>  <button className="permissions share-ref-button-tb"
                          onClick={() => {
                            handleShareKlintaleClick(contact)
                          }} >Share</button>       </td>
                        <td>{contact?.name}</td>
                        <td>{contact?.business_name}</td>
                        <td>{contact?.category_name}</td>
                        <td>{contact?.phone && formatPhoneNumber(contact?.phone)}</td>
                        <td>{contact?.email}</td>
                      </tr>
                    </tbody>))
                  }
                </>
                }
              </table>)}

          {userss?.length > 0 && (
            <div className="pagination">
              {renderPageNumbers()}
            </div>
          )}
        </div>
      </div>
      {active === 1 && userss?.length == 0 && !dataLoader && <p className="no-data">No Data Found</p>}
      {active === 0 && userss?.length == 0 && !dataLoader && <p className="no-data">No Data Found</p>}
    </div>
  );
};

export default ShareMe;
