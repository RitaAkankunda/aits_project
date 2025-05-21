import DashboardLayout from "../../../layouts/DashboardLayout";
import React, { useEffect, useState } from "react";
import "../../../css/dashboardcss/lecturer/LecturerDashboard.css";
import { useAuth } from "../../../contexts/AuthContext";
import axios from "axios";

const LecturerDashboard = () => {
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

        const response = await axios.get("http://127.0.0.1:8000/api/issues/", 
          {
            headers: {
              Authorization: `Token ${user.token}`,
            },
          });

        if (!Array.isArray(response.data)) {
          setError("Unexpected response format from server.");
          setLoading(false);
          return;
        }
        // Filter issues assigned to the current lecturer
        const lecturerIssues = response.data.filter(issue => 
          issue.assigned_to?.id === user.id 
        );
        
        setIssues(lecturerIssues);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching issues:", error);
        setError(error.response?.status === 401 
          ? "You are not authorized. Please log in again."
          : "Failed to fetch issues. Please try again."
        );
        setLoading(false);
      }
    };

    fetchIssues();
  }, [user]);

  // Calculate statistics
  const assignedIssues = issues.length;
  const resolvedIssues = issues.filter(issue => issue.status?.toLowerCase() === 'resolved').length;
  const pendingIssues = issues.filter(issue => issue.status?.toLowerCase() !== 'resolved').length;

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <DashboardLayout role="Lecturer">
      <div className="lecturer-dashboard-container">
        <div className="lec-heading-dash">
          <h2>Lecturer Dashboard</h2>
          <div className="stats-container">
            <div className="stat-box">
              <h3>Assigned Issues</h3>
              <p>{assignedIssues}</p>
            </div>
            <div className="stat-box">
              <h3>Resolved Issues</h3>
              <p>{resolvedIssues}</p>
            </div>
            <div className="stat-box">
              <h3>Pending Issues</h3>
              <p>{pendingIssues}</p>
            </div>
          </div>
        </div>

        <div className="lecturer-issues-list">
          <h3>All Assigned Issues</h3>
          <div className="table-wrapper">
            <table className="large-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Student Number</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {issues.length > 0 ? (
                  issues.map((issue, index) => (
                    <tr key={issue.id}>
                      <td>{index + 1}</td>
                      <td>{issue.user?.first_name} {issue.user?.last_name}</td>
                      <td>{issue.user?.student_number}</td>
                      <td>{issue.title}</td>
                      <td>{issue.category}</td>
                      <td
                        className={
                          issue.status.toLowerCase() === "resolved"
                            ? "status-resolved-highlight"
                            : "status-pending"
                        }
                      >
                        {issue.status}
                      </td>
                      <td>{new Date(issue.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No issues assigned.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LecturerDashboard;
