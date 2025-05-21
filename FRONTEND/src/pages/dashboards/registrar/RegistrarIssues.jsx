import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import DashboardLayout from "../../../layouts/DashboardLayout";
import "../../../css/dashboard.css";
import "../../../css/dashboardcss/registrar/RegistrarIssues.css";
import { useNavigate } from "react-router-dom";




function RegistrarIssues() {
  const [issues, setIssues] = useState([]); // Store all issues
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error handling state
  const { user } = useAuth(); // Get logged-in user
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  
  const handleAllocateClick = (id)=>{
    navigate(`/Registrar/Issues/${id}`);
  };
  
  const handleDeleteClick = (id) => {
    setIssueToDelete(id);
    setConfirmDelete(true);
  };
  
  const confirmDeletion = async () => {
    try {
      await axios.delete(`https://rita004.pythonanywhere.com/api/issues/${issueToDelete}/`, {
        headers: {
          Authorization: `Token ${user.token}`,
        },
      });
  
      setIssues(prev => prev.filter(issue => issue.id !== issueToDelete));
      setMessage("Issue deleted successfully!");
      setIsError(false);
      setTimeout(()=>setMessage(""),5000);
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("Failed to delete issue.");
      setIsError(true);
      setTimeout(()=>setMessage(""),5000);
    }
    setConfirmDelete(false);
    setIssueToDelete(null);
  };
  
  const cancelDeletion = () => {
    setConfirmDelete(false);
    setIssueToDelete(null);
  };
  
  // Fetching all issues 
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

  return (
    <DashboardLayout role="registrar">
      <div className="reg-issues-container">
      {message && (
          <div
            style={{
              backgroundColor: isError ? "#ffe6e6" : "#e6ffea",
              color: isError ? "#cc0000" : "#006600",
              padding: "10px",
              border: `1px solid ${isError ? "#cc0000" : "#006600"}`,
              borderRadius: "5px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}
        {confirmDelete && (
          <div
            style={{
              backgroundColor: "#fff3cd",
              border: "1px solid #ffcc00",
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            <p>Are you sure you want to delete this issue?</p>
            <button
              onClick={confirmDeletion}
              style={{
                backgroundColor: "#cc0000",
                color: "white",
                padding: "5px 10px",
                marginRight: "10px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Yes, Delete
            </button>
            <button
              onClick={cancelDeletion}
              style={{
                backgroundColor: "#ddd",
                color: "black",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        )}
        <div className="reg-issues-heading">
        
        <h1>Registrar Issues</h1>
        <p>View and manage all academic issues.</p>
        </div>
        

        
        {issues.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Student Number</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Assign Issue</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <td>{issue.id}</td>
                  <td>{issue.user?.first_name} {issue.user?.last_name}</td>
                  <td>{issue.user?.student_number}</td>
                  <td>{issue.title}</td>
                  <td>{issue.category}</td>
                  <td
                    style={{
                      color:
                        issue.status === "pending"
                          ? "red"
                          : issue.status === "assigned"
                          ? "green"
                          : issue.status === "resolved"
                          ? "purple"
                          : "black",
                    }}
                  >
                    {issue.status}
                  </td>

                  
                  <td>{new Date(issue.created_at).toLocaleDateString()}</td>
                  <td>
                    <button onClick={()=>handleAllocateClick(issue.id)}>
                      {issue.status === "assigned" ? "Reassign Issue" : "Assign Issue"}
                    </button>
                  </td>
                  <td>
                    <button onClick={()=>handleDeleteClick(issue.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No issues found.</p>
        )}
      </div>
    </DashboardLayout>
  );
}

export default RegistrarIssues;
