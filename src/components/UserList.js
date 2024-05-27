import { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from "./context/AuthContext";
import { useNavigate, useLocation } from 'react-router-dom';
import { Circles } from 'react-loader-spinner'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


const UserList = () => {
    const [dataLoader, setDataLoader] = useState(false)
    const [buttonActive, setButtonActive] = useState(1)
    const { auth } = useContext(
        AuthContext
    );
   
    const url = process.env.REACT_APP_API_URL;
    const headers = {
        Authorization: auth.token,
    };
    const [userList, setUserList] = useState([])

    let searchRef = useRef("")
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState("");

    const getUserList = async () => {
        setDataLoader(true)
        let currPage
        if (searchRef.current.value) {
            currPage = ''
        } else {
            currPage = currentPage
        }
        try {

            const response = await axios.get(`${url}api/admin/get-user?page=${currPage}&search=${searchRef.current.value}`, { headers });
            setUserList(response.data.users);
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


//     const [checkEmptySearch , setCheckEmptySearch] =useEffect(2)    
// useEffect(() => {
//     if (searchRef?.current && searchRef?.current?.value == "") { 
//       setCheckEmptySearch(1)
//     }
//   }, [checkEmptySearch]);


    return (
        <div className="add_property_btn">

            <div className="inner-pages-top">
                <h3>Users List</h3>
                <div className="search-group">

                    <input type="text"
                        onKeyDown={handleKeyDownEnter}
                        ref={searchRef}
                        placeholder="Search here" />
                    {buttonActive == 1 && <img src="/search.svg" onClick={handleKeyDown} />}
                    {buttonActive == 2 && <FontAwesomeIcon icon={faXmark} onClick={clearSearch} />}
                </div>

            </div>
            <div className="table-container share-ref-table-in">
                {dataLoader ?
                    (<div className="sekelton-class" style={{ backgroundColor: 'white' }} >
                        <Skeleton count={50} />
                    </div>)

                    : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Username</th>
                                    {/* <th>User Type</th>
                            <th>Membership</th>
                            <th>Actions</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                <Circles

                                    height="100"
                                    width="100%"
                                    color="#004382"
                                    ariaLabel="circles-loading"
                                    wrapperStyle={{
                                        height: "100%",
                                        width: "100%",
                                        position: "absolute",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        zIndex: 9,
                                        background: "#00000082"
                                    }}
                                    wrapperClass=""
                                    visible={dataLoader}
                                />
                                {userList?.length > 0 && userList?.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.username}</td>
                                        {/* <td>{user.user_role}</td>
                                <td>{user.membership_name}</td>
                                <td>{user.user_role}</td> */}
                                        <td>
                                            {/* <button className="permissions share-ref-button-tb"
                                        onClick={() => {
                                            navigate(`/klientale-contacts/share/${user.id}/${user.name}`)
                                        }}       >Share Me</button> */}
                                        </td>
                                        <td>
                                            {/* <button className="permissions share-ref-button-tb"
                                    onClick={() => {
                                        navigate(`/klientale-contacts/contacts/send/${user.id}`)
                                    }}       >Send me Referrals</button>  */}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>)}

                {userList?.length > 0 && (
                    <div className="pagination">
                        {renderPageNumbers()}
                    </div>
                )}
            </div>
            {!userList && !dataLoader && <p className="no-data">No data Found</p>}
        </div>
    )
}

export default UserList
