import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import DashboardLayout from "../../../layouts/DashboardLayout";
import "../../../css/dashboardcss/Registrar/RegistrarProfile.css";

function RegistrarProfile() {
  const { user, isLoggedIn } = useAuth(); // Use user directly from context

  if (!isLoggedIn || !user) {
    return (
      <DashboardLayout>
        <div className="Registrar-profile-container">
          <h2>Loading or not authenticated</h2>
          <p>Please log in again if you're seeing this message.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isLoggedIn={isLoggedIn}>
      <div className="Registrar-profile-container">
        <div className="Registrar-heading">
          <h1>Registrar Profile Page</h1>
          <p>View and update your profile details here.</p>
        </div>

        <div className="profile-details">
          <p><strong>Full Name:</strong> {user.first_name} {user.last_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Registrar Number:</strong> {user.registrar_number}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default RegistrarProfile;
