import DashboardLayout from "../../../layouts/DashboardLayout";
// import {useEffect,useState} from 'react';
import "../../../css/dashboardcss/lecturer/LecturerNotifications.css";




function LecturerNotifications() {
  // const [notifications, setNotifications] = useState([]);  
  // const [status, setStatus] = useState("Connecting...");

  // useEffect(() => {
  //   // Connecting to Django WebSocket server
  //   const socket = new WebSocket("ws://localhost:8000/ws/notifications/"); //creating a new web socket connection with django server

  //   // WebSocket connected
  //   socket.onopen = () => {
  //     console.log("WebSocket Connected!");
  //     setStatus("Connected ✅");
  //   };

  //   // WebSocket receives a message
  //   socket.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     setNotifications((prev) => [data.message, ...prev]);
  //   };

  //   // WebSocket error handling
  //   socket.onerror = (error) => {
  //     console.error("WebSocket Error:", error);
  //     setStatus("Connection Failed ❌");
  //   };

  //   // WebSocket disconnected
  //   socket.onclose = () => {
  //     console.warn("WebSocket Disconnected!");
  //     setStatus("Disconnected 🔴");
  //   };

  //   // Cleanup WebSocket when the component unmounts
  //   return () => socket.close();
  // }, []);

  return (
    <DashboardLayout>
      <div className="lec-notifs-container">
        <div className="lec-heading-notifs">
        <h1>Lecturer Notifications</h1>
        <p>Check your recent notifications here.</p>
        {/* <p>Status: {status}</p> */}
        </div>

        
       
        
        {/* <ul>
          {notifications.length === 0 ? (
            <p>No new notifications.</p>
          ) : (
            notifications.map((notif, index) => (
              <li key={index} className="bg-gray-200 p-2 my-2 rounded">
                {notif}
              </li>
            ))
          )}
        </ul> */}
      </div>
    </DashboardLayout>
  );
};
export default LecturerNotifications;

















