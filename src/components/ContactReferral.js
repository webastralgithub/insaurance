import React, { useState, useEffect, useContext, useRef } from "react";
import "./admin.css"
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


const ContactReferral = ({ role }) => {
  const [dataLoader, setDataLoader] = useState(false)
  const { id } = useParams()
  const location = useLocation();
  const { data } = location.state;
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { auth } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;
  const klintaleUrl = process.env.REACT_APP_KLINTALE_URL;
  let searchRef = useRef()
  const [userss, setusers] = useState([])
  const [totalPagess, setTotalPages] = useState("");

  const sendRefferal = async (contact) => {
    setDataLoader(true)
    try {
      const response = await axios.post(`${url}api/contacts/share`,
        { sendTo: contact, selectedContacts: [id], type: 2 }, {
        headers,
      });
      setDataLoader(false)
      if (response.status === 200) {
        toast.success(`${contact.firstname} Sent successfully to ${data?.firstname}  `, {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        })
       
      }
    } catch (error) {
      setDataLoader(false)
      toast.error("error in sending refferal")
      console.error("error", error)
    }
  }

  const handleDeleteClick = (property) => {
    confirmAlert({
      title: 'Confirm Send',
      message: 'Are you sure you want to send this contact?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => sendRefferal(property),
        },
        {
          label: 'No',
          onClick: () => { },
        },
      ],
    });
  };

  const handleShareKlintaleClick = async (contact) => {
    const { email, phone, name, category_name } = contact;
    const combinedObject = {
      name,
      email,
      phone,
      category_name,
      sendTo: id, selectedContacts: [contact.id],
    };
    try {
      const response = await axios.post(`${url}api/klientale-contact-send-me`, combinedObject, { headers }
      );

      if (response.status === 200) {
        toast.success("Contact Shared successfully", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("Error on sharing klintale contact", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error("error on sharing klintale contact", error)
    }

  }

  const handleDeleteKlintaleClick = (propertyId) => {
    confirmAlert({
      title: 'Confirm Send',
      message: 'Are you sure you want to send this contact?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleShareKlintaleClick(propertyId),
        },
        {
          label: 'No',
          onClick: () => { },
        },
      ],
    });
  };



  const formatPhoneNumber = (phoneNumber) => {
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const getTaskss = async () => {
    let currPage
    if (searchRef.current.value) {
      currPage = ''
    } else {
      currPage = currentPage
    }
    try {
      if (active === 0) {
        setDataLoader(true)
        const response = await axios.get(`${url}api/contacts-list?page=${currPage}&search=${searchRef.current.value}`, { headers });
        setusers( await response?.data?.contacts)
        setTotalPages(response?.data?.totalPages)
        setDataLoader(false)
      }
      if (active === 1) {
        setDataLoader(true)
        setusers([])
        const response = await axios.get(`${klintaleUrl}listings/${localStorage.getItem('email')}?page=${currPage}&search=${searchRef.current.value}&categories=${[]}`, { headers });
        setusers(response?.data?.users)
        setTotalPages(response?.data?.totalPages)
        setDataLoader(false)
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


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
    <div className="add_property_btn">
      <div className="inner-pages-top inner-pages-top-share-ref" style={{ "padding-bottom": "30px" }}>


        <h3> <button className="back-only-btn"
          onClick={() => {
            navigate("/contacts"); // Change the view state to "contacts"
          }}
        > <img src="/back.svg" /></button> {"Send Me Referrals"}({data?.firstname})</h3>
        <span className="share-text" style={{ "font-size": "17px", "font-weight": "700", "display": "flex", "margin-top": "6px", "position": "absolute", "top": "200px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-share" viewBox="0 0 16 16">
            <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" />
          </svg>
          Send me referrals from your following contacts</span>


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

          <button className={active ? 'active' : ''} onClick={() => { setusers([]); setCurrentPage(1); setActive(1) }}>
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
                {userss.length > 0 &&
                  userss?.map((contact) => (contact.id != id && <tbody>

                    <tr key={contact.id}>
                      {/* <td className="property-link" onClick={() => navigate("/contact/edit/"+contact.id)}>{contact.firstname}</td> */}
                      <td>  <button className="permissions share-ref-button-tb"
                        onClick={() => {
                          handleDeleteClick(contact)
                        }}>Send</button>       </td>
                      <td>{contact.firstname}</td>
                      <td>{contact.business_name}</td>
                      <td>{contact.profession_id > 0? contact.profession.name : ""}</td>
                      <td>{contact.phone && formatPhoneNumber(contact.phone)}</td>
                      <td>{contact.email}</td>
                    </tr>
                  </tbody>))}
              </>
              }

              {/* {  klintale contacts} */}
              {active === 1 && <>
                {userss.length > 0 &&
                  userss.map((contact) => (contact.id != id && <tbody>

                    <tr key={contact.id}>
                      {/* <td className="property-link" onClick={() => navigate("/contact/edit/"+contact.id)}>{contact.firstname}</td> */}
                      <td>  <button className="permissions share-ref-button-tb"
                        onClick={() => {
                          handleDeleteKlintaleClick(contact)
                        }} >Send</button>       </td>
                      <td>{contact.name}</td>
                      <td>{contact.business_name}</td>
                      <td>{contact?.category_name}</td>
                      <td>{contact.phone && formatPhoneNumber(contact.phone)}</td>
                      <td>{contact.email}</td>
                     
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

   
      {active === 1 && userss.length == 0 && !dataLoader && <p className="no-data">No Data Found</p>}
      {active === 0 && userss.length == 0 && !dataLoader && <p className="no-data">No Data Found</p>}
      {/* {contactsToDisplay.length == 0 || active == "1" && <p className="no-data">No data Found</p>} */}
    </div>
  );
};

export default ContactReferral;
