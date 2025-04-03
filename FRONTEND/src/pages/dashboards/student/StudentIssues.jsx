import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext"; // Import useAuth
import DashboardLayout from "../../../layouts/DashboardLayout";
import "../../../css/dashboardcss/student/StudentIssues.css"

function StudentIssues() {
  const [issues, setIssues] = useState([]); // State to store issues
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(""); // State to handle errors
  const { user } = useAuth(); // Get the logged-in user from AuthContext

  // Fetch issues created by the logged-in user
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
  
        // Ensure response.data is an array
        if (!Array.isArray(response.data)) {
          console.error("Error: API response is not an array", response.data);
          setError("Unexpected response format from server.");
          setLoading(false);
          return;
        }
  
        // Debugging each issue's student_number
        response.data.forEach((issue, index) => {
          console.log(
            `Issue ${index + 1}: student_number=${issue.user.student_number}, user.student_number=${user.student_number}`
          );
        });
  
        const userIssues = response.data.filter(
          (issue) => issue.user.student_number === user.student_number
        );
  
        console.log("Filtered Issues:", userIssues);
  
        setIssues(userIssues);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching issues:", error);
  
        if (error.response && error.response.status === 401) {
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
  
  if (loading) {
    return <div>Loading...</div>; // Show a loading message
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>; // Show an error message
  }

  return (
    <DashboardLayout>
      <div className="student-issues-container">
        <div className="student-headings">
        <h1>Student Issues</h1>
        <p>View and manage academic issues.</p>

        </div>
       

        {/* Display issues in a table */}
        {issues.length > 0 ? (
          <table>
            <thead>
              <tr>
              <th>Course Code</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <td>{issue.course_code}</td>
                  <td>{issue.title}</td>
                  <td>{issue.category}</td>
                  <td>{issue.status}</td>
                  
                  <td>{new Date(issue.created_at).toLocaleDateString()}</td>
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

export default StudentIssues;
