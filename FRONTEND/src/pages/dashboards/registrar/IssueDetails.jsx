import React, { useState, useEffect } from "react";
 import { useParams } from "react-router-dom";
 
 const IssueDetails = () => {
   const { id } = useParams();
   const [issue, setIssue] = useState(null);
   const [departments, setDepartments] = useState([]);
   const [lecturers, setLecturers] = useState([]);
   const [selectedDept, setSelectedDept] = useState("");
   const [selectedLecturer, setSelectedLecturer] = useState("");
   const [showLecturers, setShowLecturers] = useState(false);
 
   useEffect(() => {
     // Fetch issue details
     fetch(`https://backendaits.onrender.com/api/issues/${id}`)
       .then((res) => res.json())
       .then((data) => setIssue(data))
       .catch((error) => console.error("Error fetching issue details:", error));
 
     // Fetch departments
     fetch("https://backendaits.onrender.com/api/departments")
       .then((res) => res.json())
       .then((data) => setDepartments(data))
       .catch((error) => console.error("Error fetching departments:", error));
   }, [id]);
 
   const handleDepartmentChange = (e) => {
     setSelectedDept(e.target.value);
     setShowLecturers(true);
 
     // Fetch lecturers based on selected department
     fetch(`https://backendaits.onrender.com/api/departments/${e.target.value}/lecturers`)
       .then((res) => res.json())
       .then((data) => setLecturers(data))
       .catch((error) => console.error("Error fetching lecturers:", error));
   };
 
   const handleAssignIssue = () => {
     if (!selectedLecturer) {
       alert("Please select a lecturer to assign this issue.");
       return;
     }
     
     fetch(`https://backendaits.onrender.com/api/issues/${id}/assign`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ lecturer_id: selectedLecturer }),
     })
       .then((res) => res.json())
       .then(() => alert("Issue assigned successfully!"))
       .catch((error) => console.error("Error assigning issue:", error));
   };
 
   if (!issue) return <p>Loading issue details...</p>;
 
   return (
     <div>
       <h2>Issue Details</h2>
       <p><strong>ID:</strong> {issue.id}</p>
       <p><strong>Student Name:</strong> {issue.student_name}</p>
       <p><strong>Issue:</strong> {issue.description}</p>
       <p><strong>Status:</strong> {issue.status}</p>
 
       <h3>Assign Issue</h3>
       <label>Select Department:</label>
       <select onChange={handleDepartmentChange} value={selectedDept}>
         <option value="">--Select Department--</option>
         {departments.map((dept) => (
           <option key={dept.id} value={dept.id}>{dept.name}</option>
         ))}
       </select>
       
       {showLecturers && (
         <>
           <label>Select Lecturer:</label>
           <select onChange={(e) => setSelectedLecturer(e.target.value)} value={selectedLecturer}>
             <option value="">--Select Lecturer--</option>
             {lecturers.map((lecturer) => (
               <option key={lecturer.id} value={lecturer.id}>{lecturer.name}</option>
             ))}
           </select>
           <button onClick={handleAssignIssue}>Assign Issue</button>
         </>
       )}
     </div>
   );
 };
 
 export default IssueDetails;