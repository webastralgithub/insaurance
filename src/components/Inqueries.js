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

const Inqueries = () => {
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

    const clearSearch = () => {
        searchRef.current.value = ""
        setButtonActive(1)

    };

    const handleKeyDownEnter = (event) => {
        if (event.key === 'Enter') {
            setButtonActive(2)

        }
    };

    const handleKeyDown = () => {
        setButtonActive(2)

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


                <h3>Inqueries</h3>
                <div className="add_user_btn">
                    <button onClick={() => navigate("/add-inquery")}>
                        <img src="/plus.svg" />
                        Add Inquery</button>
                </div>
                <div className="search-grp-with-btn">
                    <div className="search-group">
                        <input type="text"
                            onKeyDown={handleKeyDownEnter}
                            ref={searchRef}
                            placeholder="Search here" />

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
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            {userList.length > 0 &&
                                userList.map((contact) => (<tbody>
                                    <tr key={contact.id}>
                                        <td className="property-link"></td>
                                        <td >{contact?.description?.replace(/(<([^>]+)>)/gi, '').slice(0, 100).replace(/(?<=\s)\S*$/i, '')}</td>
                                        <td> <img className="delete-btn-ico" src="/delete.svg"
                                        ></img>
                                        </td>
                                    </tr>
                                </tbody>))}
                        </table>
                    )}

               
            </div>
            {userList && userList.length === 0 &&<p className="no-data">No data Found</p>}
        </div>
    )
}

export default Inqueries
