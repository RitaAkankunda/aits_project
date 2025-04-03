import { useState, useEffect } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";

// Declaring state for the lecturer's profile by defining a component (LecturerProfile)
function LecturerProfile() {
  const [lecturer, setLecturer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });

  // UseEffect hook to fetch the lecturer profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Retrieving auth token
        const response = await fetch(
          "https://rita004.pythonanywhere.com/api/lecturer/profile/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const lecturerInfo = await response.json(); // Convert response to JSON
        setLecturer({
          firstName: lecturerInfo.first_name,
          lastName: lecturerInfo.last_name,
          email: lecturerInfo.email,
          department: lecturerInfo.department,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []); // Empty dependency array ensures it runs only once on component mount

  return (
    <DashboardLayout>
      <div style={styles.container}>
        <h1>Lecturer Profile</h1>
        <div style={styles.profileInfo}>
          <p>
            <strong>First Name:</strong> {lecturer.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {lecturer.lastName}
          </p>
          <p>
            <strong>Email:</strong> {lecturer.email}
          </p>
          <p>
            <strong>Department:</strong> {lecturer.department}
          </p>
        </div>

        <div style={styles.updateSection}>
          <h1>Update Profile Information</h1>
          <p>To update your profile, fill out the fields below:</p>

          <div style={styles.inputField}>
            <label>First Name:</label>
            <input
              type="text"
              defaultValue={lecturer.firstName}
              className="editable"
              // Optionally, you can add an onChange handler to update state
            />
          </div>

          <div style={styles.inputField}>
            <label>Last Name:</label>
            <input
              type="text"
              defaultValue={lecturer.lastName}
              className="editable"
            />
          </div>

          <div style={styles.inputField}>
            <label>Email:</label>
            <input
              type="email"
              defaultValue={lecturer.email}
              className="editable"
            />
          </div>

          <div style={styles.inputField}>
            <label>Department:</label>
            <input
              type="text"
              defaultValue={lecturer.department}
              className="editable"
            />
          </div>

          <div style={styles.submitSection}>
            <button style={styles.submitButton}>Save Changes</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// CSS styles for the container and profile layout
const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  profileInfo: {
    marginTop: "20px",
    fontSize: "16px",
    color: "#333",
  },
  updateSection: {
    marginTop: "30px",
    borderTop: "1px solid #ddd",
    paddingTop: "20px",
  },
  inputField: {
    marginBottom: "15px",
  },
  submitSection: {
    marginTop: "20px",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default LecturerProfile;
