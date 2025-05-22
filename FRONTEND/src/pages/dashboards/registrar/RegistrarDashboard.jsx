import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../../layouts/DashboardLayout";
import "../../../css/dashboardcss/registrar/RegistrarDashboard.css";
import { useAuth } from "../../../contexts/AuthContext";
import AssignedIssues from "../../dashboards/registrar/Assignedissues";

const RegistrarDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        if (!user || !user.token) {
          setError("User not authenticated. Please log in again.");
          setLoading(false);
          return;
        }

        console.log("User Token:", user.token);

        const response = await axios.get("https://backendaits.onrender.com/api/issues/", {
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
          setError(`Failed to fetch issues: ${error.message}`);
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

  // Processing issue data for the dashboard
  const resolvedIssues = issues.filter(issue => issue.status === 'resolved');
  const pendingIssues = issues.filter(issue => issue.status === 'pending');
  const assignedIssues = issues.filter(issue => issue.status === 'assigned');

  // Dashboard loading and error states
  if (loading) {
    return (
      <DashboardLayout role="registrar">
        <div className="reg-dashboard-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="registrar">
        <div className="reg-dashboard-container">
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="registrar">
      <div className="reg-dashboard-container">
        <div className="reg-heading-dash">
          <h2>Registrar Dashboard</h2>
          
          <div className="stats-container">
            <div className="stat-box">
              <h3>Total Issues</h3>
              <p>{issues.length}</p>
            </div>
            
            <div className="stat-box">
              <h3>Pending Issues</h3>
              <p>{pendingIssues.length}</p>
            </div>
            
            <div className="stat-box">
              <h3>Assigned Issues</h3>
              <p>{assignedIssues.length}</p>
            </div>
            
            <div className="stat-box">
              <h3>Resolved Issues</h3>
              <p>{resolvedIssues.length}</p>
            </div>
          </div>
        </div>
        
        <AssignedIssues userToken={user?.token} />
      </div>
    </DashboardLayout>
  );
};

export default RegistrarDashboard;