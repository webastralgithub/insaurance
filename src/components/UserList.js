import { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from "./context/AuthContext";
import { useNavigate, useLocation } from 'react-router-dom';

const UserList = () => {

    const { auth } = useContext(
        AuthContext
    );
    const klintaleUrl = process.env.REACT_APP_KLINTALE_URL;
    const url = process.env.REACT_APP_API_URL;
    const headers = {
        Authorization: auth.token,
    };
    const [userList, setUserList] = useState()
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalPages, setTotalPages] = useState("");

    useEffect(() => {
        const getUserList = async () => {
            try {
                const response = await axios.get(`${url}api/admin/get-users-website?page=${currentPage}&perPage=${perPage}`, { headers });
                setUserList(response.data.users);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Server is busy");
            }
        };
        getUserList();
    }, [currentPage, perPage]);

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
                <h3>Users List</h3>
                <div className="search-group">

                    <input type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search here" />
                    <img src="/search.svg" />
                </div>
            </div>
            <div className="table-container share-ref-table-in">
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
                        {userList && userList.map((user) => (
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
                </table>

                {userList?.length > 0 && (

                    <div className="pagination">


                        {renderPageNumbers()}


                    </div>
                )}
            </div>
        </div>
    )
}

export default UserList
