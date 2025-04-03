import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "../css/componentcss/IssueForm.css";

const departmentOptions = [
  { id: 1, name: "Computer Science" },
  { id: 2, name: "Business Administration" },
];

const courseOptions = {
  1: ["CS101", "CS102", "CS103", "CS104"], // Courses for Computer Science
  2: ["BA201", "BA202", "BA203", "BA204"], // Courses for Business Administration
};

const IssueForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (!user || !user.student_number) {
        setError("Student number not found. Please log in again.");
        return;
      }

      const payload = {
        title,
        description,
        category,
        course_code: courseCode,
        department: parseInt(department), // Convert to number
        student_number: user.student_number,
        user: 1,
        assigned_to: null,
        status: "open",
      };

      console.log("Request Payload:", payload);

      const response = await axios.post(
        "https://rita004.pythonanywhere.com/api/issues/",
        payload,
        {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccess("Issue submitted successfully!");
        setTitle("");
        setDescription("");
        setCategory("");
        setDepartment("");
        setCourseCode("");
      } else {
        setError("Failed to submit issue. Please try again.");
      }
    } catch (error) {
      console.error("Issue submission failed:", error);
      if (error.response) {
        console.error("Server Error Response:", error.response.data);
        setError(
          error.response.data.detail ||
            "Failed to submit issue. Please check the data and try again."
        );
      } else {
        setError("Failed to submit issue. Please try again.");
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Submit an Issue</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Issue Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Issue Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="" disabled>Select Category</option>
          <option value="missing_marks">Missing Marks</option>
          <option value="appeal">Appeal</option>
          <option value="other">Other</option>
        </select>
        
        {/* Department Selection */}
        <select
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            setCourseCode(""); // Reset course code when department changes
          }}
          required
        >
          <option value="" disabled>Select Programme</option>
          {departmentOptions.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        {/* Course Selection - Changes Based on Department */}
        <select
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          required
          disabled={!department} // Disable if no department is selected
        >
          <option value="" disabled>Select Course</option>
          {department &&
            courseOptions[department].map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
        </select>

        <button type="submit">Submit Issue</button>
      </form>
    </div>
  );
};

export default IssueForm;
