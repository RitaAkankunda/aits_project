 import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useRole } from "../contexts/RoleContext"; // Import the custom hook

const DashboardLayout = ({ children, isLoggedIn, setIsLoggedIn }) => {
  const { role } = useRole();  // Get the current role from context
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Sidebar role={role} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setName={setName} setEmail={setEmail} /> 
        <main className="main-content">
          {name && email ? (
            <div className="user-info">
              <h3>Welcome, {name}</h3>
              <p>Email: {email}</p>
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
