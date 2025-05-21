import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/componentcss/IssueForm.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const courseOptions = {
  1: ["CS101", "CS102", "CS103", "CS104"],
  2: ["BA201", "BA202", "BA203", "BA204"],
  3: ["IT301", "IT302", "IT303", "IT304"],
  4: ["NW401", "NW402", "NW403", "NW404"],
};

const IssueForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [courseCode, setCourseCode] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const notifySuccess = () => toast.success("Issue submitted successfully!", {autoClose: 2000});
  const notifyError = () => toast.error("Failed to submit issue.", { autoClose: 2000});

  // ✅ Get user data from localStorage
  const user = JSON.parse(localStorage.getItem("userData"));
  // console.log(user);


  // ✅ Fetch departments from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/departments/", {
          headers: {
            Authorization: `Token ${user?.token}`,
          },
        });
        console.log("Departments API response:", response.data);

        setDepartments(response.data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchDepartments();
  }, [user?.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user || !user.student_number || !user.id || !user.token) {
      setError("User details missing. Please log in again.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("course_code", courseCode);
      formData.append("department", parseInt(department));
      formData.append("student_number", user.student_number);
      formData.append("assigned_to", null);
      formData.append("status", "open");
      if (attachment) {
        formData.append("attachment", attachment);
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/issues/",
        formData,
        {
          headers: {
            Authorization: `Token ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        notifySuccess();
        setTitle("");
        setDescription("");
        setCategory("");
        setDepartment("");
        setCourseCode("");
        setAttachment(null);
      } else {
        setError("Failed to submit issue. Please try again.");
        notifyError();
      }
    } catch (error) {
      console.error("Issue submission failed:", error);
      notifyError();
      if (error.response) {
        setError(
          error.response.data.detail ||
            "Failed to submit issue. Please check the data and try again."
        );
      } else {
        setError("Failed to submit issue. Please try again.");
        notifyError();
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

        {/* ✅ Department Dropdown - fetched from API */}
        <select
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            setCourseCode("");
          }}
          required
        >
          <option value="" disabled>Select Programme</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        {/* ✅ Course dropdown based on department */}
        <select
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          required
          disabled={!department}
        >
          <option value="" disabled>Select Course</option>
          {department &&
            courseOptions[department]?.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
        </select>

        <input
          type="file"
          onChange={(e) => setAttachment(e.target.files[0])}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />

        <button type="submit">Submit Issue</button>
        <ToastContainer />
      </form>
    </div>
  );
};

export default IssueForm;
