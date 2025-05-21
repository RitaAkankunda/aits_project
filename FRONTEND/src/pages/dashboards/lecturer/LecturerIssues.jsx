import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import DashboardLayout from "../../../layouts/DashboardLayout";
import "../../../css/dashboard.css";
import "../../../css/dashboardcss/lecturer/LecturerIssues.css";

function LecturerIssues() {
  const [issues, setIssues] = useState([]); // Store all issues
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error handling state
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const { user } = useAuth(); // Get logged-in user

  // Fetching all issues 
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        if (!user || !user.token) {
          setError("User not authenticated. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/api/issues/", {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        });

        if (!Array.isArray(response.data)) {
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

  const handleResolve = async (id) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/issues/${id}/resolve/`,
        {},
        {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        }
      );

      const updatedIssues = issues.map((issue) =>
        issue.id === id ? { ...issue, status: "Resolved" } : issue
      );
      setIssues(updatedIssues);
      setToastMsg("Issue marked as resolved.");
    } catch (error) {
      console.error("Error resolving issue:", error);
      setToastMsg("Failed to resolve issue.");
    }
  };

  const filteredIssues = issues.filter((issue) =>
    issue.user?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.user?.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (toastMsg) {
      const timeout = setTimeout(() => setToastMsg(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [toastMsg]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <DashboardLayout role="Lecturer">
      <div className="lec-issues-container">
        <div className="lec-issues-heading">
          <h1>Lecturer Issues</h1>
          <p>View and manage all assigned academic issues.</p>
        </div>
        
        <input 
          type="text"
          placeholder='Search student by name...'
          className='search-input'
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {toastMsg && <div className='toast-message'>{toastMsg}</div>}

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Student Number</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Attachments</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.length > 0 ? (
                filteredIssues.map((issue, index) => (
                  <tr key={issue.id}>
                    <td>{index + 1}</td>
                    <td>{issue.user?.first_name} {issue.user?.last_name}</td>
                    <td>{issue.user?.student_number}</td>
                    <td>{issue.title}</td>
                    <td>{issue.category}</td>
                    <td>
                      <span className={
                        issue.status.toLowerCase() === 'resolved'
                        ? 'status-resolved-highlight'
                        : 'status-pending'
                      }>
                        {issue.status}
                      </span>
                    </td>
                    <td>
                      {issue.attachment ? (
                        <a href={issue.attachment} target="_blank" rel="noopener noreferrer">
                          Attachment
                        </a>
                      ) : (
                        <span>No attachment</span>
                      )}
                    </td>
                    <td>{new Date(issue.created_at).toLocaleDateString()}</td>
                    <td>
                      {issue.status.toLowerCase() !== 'resolved' ? (
                        <button
                          className='resolve-button'
                          onClick={() => handleResolve(issue.id)}
                        >
                          Mark as Resolved
                        </button>
                      ) : (
                        <span className='resolved-check'>issue resolved</span>
                      )}
                    </td>
                    <td>
                      <button disabled>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='10' style={{ textAlign: 'center' }}>
                    No issues found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
    </DashboardLayout>
  );
}

export default LecturerIssues;
