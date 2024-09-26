import React, { useState, useEffect, useContext } from "react";
import "./admin.css"
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { toast } from "react-toastify";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';



const ChatMessages = () => {
    const { id, chatId } = useParams()
    const location = useLocation();
    const { data } = location.state;
    const navigate = useNavigate()
    const { auth, userID } = useContext(AuthContext);
    const headers = { Authorization: auth.token };
    const url = process.env.REACT_APP_API_URL;
    const [dataLoader, setDataLoader] = useState(false)
    const [messageText, setMessageText] = useState("")
    const [messages, setMessages] = useState([]);
    const [totalPages, setTotalPages] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const getChat = async () => {
        setDataLoader(true)
        try {

            const response = await axios.get(`${url}api/get-message/${id}?chat_id=${chatId}&page=${currentPage}`, { headers, })
            let data = response.data;

            setMessages(data.messages.reverse());
            setTotalPages(data.total_pages)
            setDataLoader(false)
        } catch (error) {
            setDataLoader(false)
            toast.error("Serve sdfvdg is Busy");
            console.error(error)
        }
    }

    useEffect(() => {
        if (id && chatId)
            getChat()
    }, [])

    const goBack = () => {
        navigate('/inquiries', { state: { queryState: 2 } });
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()

        if (!messageText) {
            toast.error("Please Enter Message to Send")
            return
        }
        let receiverId;
        if (userID == data.sender_id) {
            receiverId = data?.reciever_id
        } else {
            receiverId = data?.sender_id
        }
        let dataSend = {
            inquiry_id: data.inquiry_id,
            chat_id: chatId,
            message: messageText,
            reciever_id: receiverId,
            sender_id: userID,
            date: new Date()
        }

        try {
            const response = await axios.post(`${url}api/send-inquiry-message`, dataSend, { headers, })
            if (response.status === 200) {
                toast.success("Message Send Successfully")
            }

            setMessageText("")
            setDataLoader(false)
            goBack()
        } catch (error) {
            setDataLoader(false)
            console.error(error);
            toast.error("Server is Busy")
        }

    }


    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        getChat()
    }, [currentPage])


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


    ;



    return (
        <div className="add_property_btn">
            <div className="property_header header-with-back-btn">
                <h3>
                    <button type="button"
                        className="back-only-btn" onClick={goBack}>
                        <img src="/back.svg" />
                    </button>
                    Messages
                </h3>
            </div>

            {dataLoader ?
                (<div className="sekelton-class" style={{ backgroundColor: 'white' }} >
                    <Skeleton height={50} count={10} style={{ margin: '5px 0' }} />
                </div>)
                : (<>

                    <div className="message-box">
                        <textarea
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Type your message here..."
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>From</th>
                                    <th>Message</th>
                                    <th>Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {messages?.length > 0 && messages?.map((msg) => (
                                    <tr key={msg.id}>

                                        <td>{msg.sender_id == userID ? 'Me' : msg.sender_name}</td>
                                        <td>{msg.message}</td>
                                        <td >{msg.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {messages?.length > 0 && (
                            <div className="pagination">
                                {renderPageNumbers()}
                            </div>)}
                    </div>
                </>)}


            {/* {dataLoader ?
                (<div className="sekelton-class" style={{ backgroundColor: 'white' }} >
                    <Skeleton height={50} count={10} style={{ margin: '5px 0' }} />
                </div>)

                : (<>{messages.length > 0 && <>
                    <div className="main-chat-div">
                        <div className="user-detail-title-info">
                            <label>{data?.sender_name}</label>
                            <label>{data?.description}</label>
                        </div>

                        <div className="messages-div">
                            {messages.length > 0 && messages.map((msg, index) => (
                                <div key={index} className={`message-div  ${userID == msg.sender_id   ? "receiver-div" : "sender-div"}`}>
                                    <p >{msg.message}</p>
                                    <small>{msg.date}</small> 
                                </div>))}

                        </div>

                        <div className="message-box">
                            <textarea
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Type your message here..."
                            />
                            <button onClick={handleSendMessage}>Send</button>
                        </div>
                    </div>
                </>}
                </>)} */}

            {messages.length == 0 && <p className="no-data">No data Found</p>}
        </div>
    )
}



export default ChatMessages




