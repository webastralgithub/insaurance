
import React, { useState, useContext, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import '@fullcalendar/common/main.css';
import './mycalander.css'
import { AuthContext } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip'

const MyCalendar = () => {
  const [view, setView] = useState('month');
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [tooltipContent, setTooltipContent] = useState('');
  const { auth, setAuth, setTodo, totalReffralEarnedMoney, currentUsercategory_id,
    totalAvailableJobs, totalReffrals, totalReffralsReceived } = useContext(
      AuthContext
    );
  const url = process.env.REACT_APP_API_URL;
  const klintaleUrl = process.env.REACT_APP_KLINTALE_URL;
  const headers = {
    Authorization: auth.token,
  };
  const handleDateClick = (selected) => {
    const clickedDate = selected.date;

    const currentDate = new Date(); // Get the current date
    const currentTime = new Date();
    let time = selected?.dateStr + ' ' + currentTime.toLocaleTimeString();
    // Check if the clicked date is before the current date
    // if (clickedDate < currentDate) {
    //   // If the clicked date is before the current date, prevent further action
    //   toast.error('Invalid date selection', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
    //   return;
    // }
    navigate("/todo-list/add/new-dashboard/" + time)
  }

  const eventClick = (selected) => {
    const newtask = tasks?.find((option) => option?.id === selected?.event.id)
    setTodo(newtask)
    navigate(`/todo-list-dashboard/edit/${selected.event.id}`)
  }


  useEffect(() => {
    getTasks();
  }, []);

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject.toISOString();
  }

  const getTasks = async () => {
    try {
      const response = await axios.get(`${url}api/todo`, { headers });
      setTasks(response?.data?.todo);
      const eventsdata = response?.data?.todo.map((item, index) => ({
        key: item.id,
        id: item.id,
        title: item.Followup, // Use the desired property as the event title
        start: item.FollowupDate.slice(0, -4), // Convert the date string to a Date object
        // end: new Date(item.FollowupDate), // You can adjust the end date if needed
        // Add more event properties as needed
      }));
      setEvents(eventsdata);
    } catch (error) {
      localStorage.removeItem('token');
      setAuth(null);
      navigate('/');
    }
  };
  const eventMouseEnter = (info) => {
    const startTime = new Date(info.event.start);
    const istStartTime = startTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true });
    const tooltipContent = `${istStartTime} - ${info.event.title}`;
    setTooltipContent(tooltipContent); setTooltipContent(tooltipContent);

  };

  const eventMouseLeave = () => {
    setTooltipContent('');

  };
  const handleChangeView = (newView) => {
    setView(newView);
  };

  const buttonText = {
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day',
  };
  for (const key in buttonText) {
    if (buttonText.hasOwnProperty(key)) {
      buttonText[key] = buttonText[key].charAt(0).toUpperCase() + buttonText[key].slice(1);
    }
  }

  const handleRedirect = async () => {
    navigate("/klientale-contacts")
    try {
      const response = await axios.post(`${klintaleUrl}create-preference-category`);

      if (response.status === 200) {
        toast.success('Category added successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
        //Redirect to the contacts list page
        navigate("")
      } else {
        console.error("Failed to add contact");
      }
    } catch (error) {
      console.error("An error occurred while adding a contact:", error);
    }
  }
  return (

    <div className='add_property_btn'>
      {!tooltipContent && <Tooltip anchorSelect=".fc-daygrid-day-frame" place="top"
        style={{ zIndex: 999999999999 }}
      >
        Do you want to add task? Click here
      </Tooltip>}
      <Tooltip anchorSelect=".fc-daygrid-event-harness" place="top"
        style={{ zIndex: 999999999999, maxWidth: "200px", whiteSpace: "normal", wordWrap: 'break-word' }}
      >
        {tooltipContent}
      </Tooltip>
      <section className="inner-sec-stats">
        <div className="stats-heading-section">
          <div className="stats-heading">
            <h3>DASHBOARD</h3>
            <span>Check reports and review statistics</span>
          </div>
        </div>

        <div className="stats-parent-section">
          <div className="stats-sec">
            <div className="stats-order">
              <span>Total Referral Earned Money</span>
              <span className="order-numbers">{totalReffralEarnedMoney}</span>
            </div>
            <div className="stats-percentage">
              <div className="stats-inner-perc"></div>
            </div>
            <div className="total-stats-perc">
              <span className="total-stats-num">Total % of order</span>
              <span className="stats-full-perc">100%</span>
            </div>
          </div>

          <div className="stats-sec" onClick={handleRedirect} style={{ "cursor": "pointer" }}>
            <div className="stats-order">
              <span>Total Available Jobs</span>
              <span className="order-numbers">{totalAvailableJobs}</span>
            </div>
            <div className="stats-percentage">
              <div className="stats-inner-perc"></div>
            </div>
            <div className="total-stats-perc">
              <span className="total-stats-num">Total % of order</span>
              <span className="stats-full-perc">100%</span>
            </div>
          </div>

          <div className="stats-sec"  style={{ "cursor": "pointer" }} onClick={()=>navigate(`/referral-sent/${2}`)}>
            <div className="stats-order">
              <span>Total Referrals</span>
              <span className="order-numbers">{totalReffrals}</span>
            </div>
            <div className="stats-percentage">
              <div className="stats-inner-perc"></div>
            </div>
            <div className="total-stats-perc">
              <span className="total-stats-num">Total % of order</span>
              <span className="stats-full-perc">100%</span>
            </div>
          </div>
          <div className="stats-sec" onClick={()=>navigate("/referral")} style={{ "cursor": "pointer" }}>
            <div className="stats-order">
              <span>Total Referrals Received</span>
              <span className="order-numbers">{totalReffralsReceived}</span>
            </div>
            <div className="stats-percentage">
              <div className="stats-inner-perc"></div>
            </div>
            <div className="total-stats-perc">
              <span className="total-stats-num">Total % of order</span>
              <span className="stats-full-perc">100%</span>
            </div>
          </div>
        </div>
      </section>
      <div>
        {/* <button onClick={() => handleChangeView('day')}>Day</button>
        <button onClick={() => handleChangeView('week')}>Week</button>
        <button onClick={() => handleChangeView('month')}>Month</button> */}
        {/* <button onClick={() => handleChangeView('year')}>Year</button> */}
        {/* Add a Year view button if needed */}
      </div>

      <FullCalendar
        initialView="dayGridMonth"

        headerToolbar={{
          left: 'prevYear,prev,next today,nextYear',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
        }}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        }}
        timeZone="local"
        buttonText={buttonText}
        dayHeaders={true}
        plugins={[dayGridPlugin, interactionPlugin]}
        events={events}
        dateClick={handleDateClick}
        eventClick={eventClick}
        eventMouseEnter={eventMouseEnter}
        eventMouseLeave={eventMouseLeave}
      />
    </div>
  );
};

export default MyCalendar;
