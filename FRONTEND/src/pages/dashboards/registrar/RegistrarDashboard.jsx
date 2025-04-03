import DashboardLayout from "../../../layouts/DashboardLayout";
import React, { useEffect, useState } from "react";
import "../../../css/dashboardcss/registrar/RegistrarDashboard.css";
import { useAuth } from "../../../contexts/AuthContext"; // Import useAuth
import axios from "axios";

const RegistrarDashboard = () => {
  const [issues, setIssues] = useState([]); // Store all issues
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error handling state
  const { user } = useAuth(); // Get logged-in user

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        if (!user || !user.token) {
          setError("User not authenticated. Please log in again.");
          setLoading(false);
          return;
        }

        console.log("User Token:", user.token);

        const response = await axios.get("https://rita004.pythonanywhere.com/api/issues/", {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        });

        console.log("Full API Response:", response.data);

        if (!Array.isArray(response.data)) {
          console.error("Error: API response is not an array", response.data);
          setError("Unexpected response format from server.");
          setLoading(false);
          return;
        }

        setIssues(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching issues:", error);
        if (error.response?.status === 401) {
          setError("You are not authorized. Please log in again.");
        } else {
          setError("Failed to fetch issues. Please try again.");
        }
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchIssues();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  // Safeguard for resolved and pending issues if not available
  const resolvedIssues = issues?.status?.resolved || []; 
  const pendingIssues = issues?.status?.pending || [];

  return (
    <DashboardLayout role="registrar">
      <div className="reg-dashboard-container">
    
        <div className="reg-heading-dash">
        <h2>Registrar Dashboard</h2>
      

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/* Total Issues */}
        <div className="stat-box">
          <h3>Total Issues</h3>
          <p>{issues.length}</p>
        </div>

        {/* Resolved Issues */}
        <div className="stat-box">
          <h3>Resolved Issues</h3>
          <p>{resolvedIssues.length}</p>
        </div>

        {/* Pending Issues */}
        <div className="stat-box">
          <h3>Pending Issues</h3>
          <p>{pendingIssues.length}</p>
        </div>
      </div>
        
      </div>

      </div>
     
      
    </DashboardLayout>
  );
};

export default RegistrarDashboard;
