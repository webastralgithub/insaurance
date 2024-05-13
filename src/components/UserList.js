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
    const [searchQuery, setSearchQuery] = useState("");
    const getUserList = async () => {
        try {
            const response = await axios.get(`${url}api/admin/get-users-website`, { headers });
            const responseData = await response.data;
            setUserList(responseData)
         
        } catch (error) {
            console.error("server is busy")
        }
    }

    useEffect(() => {
        getUserList();
    }, [])
    const [currentPage, setCurrentPage] = useState(1);

    const filteredContacts = userList?.filter((contact) => {
        const searchText = searchQuery.toLowerCase();
        return (
          contact?.firstname?.toLowerCase().includes(searchText) ||
          contact.email?.toLowerCase().includes(searchText)
        );
      });
    const contactsPerPage = 20;
   
    const contactsToDisplay = filteredContacts?.slice(
      (currentPage - 1) * contactsPerPage,
      currentPage * contactsPerPage
    );


    // Adjust the number of contacts per page as needed
    const totalPages = Math.ceil(filteredContacts?.length / contactsPerPage);
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };;
    

    return (
        
        <div className="add_property_btn">
                  <div className="inner-pages-top">
            <h3>Users List</h3>
            <div className="search-group">

<input type="text"
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
placeholder="Search here"/>
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
                            <th>Membership Type</th>
                            {/* <th>User Type</th>
                            <th>Membership</th>
                            <th>Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {contactsToDisplay && contactsToDisplay.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.username}</td>
                                <td>{user?.membership_type}</td>
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

                {totalPages > 1 && (

                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={currentPage === index + 1 ? "active" : ""}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserList
