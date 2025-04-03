import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth
import { useRole } from "../contexts/RoleContext";
import TopNavbar from "../components/Navbar";
import FormInput from "../components/FormInput";
import { Form, Button } from "react-bootstrap";
import "../css/pagecss/Signup.css";

function Signup() {
  const { login } = useAuth(); // Use context
  const { changeRole } = useRole();
  let navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [roleSpecificId, setRoleSpecificId] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!roleSpecificId) {
      newErrors.roleSpecificId =
        role === "student"
          ? "Student number is required"
          : role === "lecturer"
          ? "Lecturer number is required"
          : "Registrar number is required";
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});

      // Remove unnecessary fields based on the selected role
      const requestData = {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role,
        ...(role === "STUDENT" && { student_number: roleSpecificId }),
        ...(role === "LECTURER" && { lecturer_number: roleSpecificId }),
        ...(role === "REGISTRAR" && { registrar_number: roleSpecificId }),
      };

      console.log("Filtered Request Data:", requestData); // Log the filtered request data

      try {
        const response = await axios.post(
          "https://rita004.pythonanywhere.com/api/register/",
          requestData,
          {
            headers: {
              Authorization: null,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response); // Log the response to check if there's an issue with the response format

        if (response.status === 201 || response.status === 200) {
          changeRole(role);
          toast.success("Signup successful");
          login(response.data); // Call the login function with the user data
          localStorage.setItem("isLoggedIn", "true");
          navigate(`/dashboards/${role}/${role}-dashboard`);
        } else {
          toast.error("Unexpected response. Check logs.");
        }
      } catch (error) {
        console.error("Error:", error); // Log the error if something fails

        if (error.response && error.response.data) {
          console.error("Full error response:", error.response.data); // Log the full response from the server

          // Check if the error has a detailed message and field info
          const errorMessage = error.response.data.message || "Signup failed.";
          const field = error.response.data.field || "Unknown field"; // Look for 'field' in the response

          // Display the error message with the field if possible
          setErrors({
            form: `${errorMessage} (Missing: ${field})`,
          });
        } else {
          setErrors({ form: "Signup failed. Please try again." });
        }
      }
    }
  };

  return (
    <>
      <TopNavbar />
      <div className="Signup-wrapper">
        <div className="Signup-form-container">
          <h2 className="Signup-title">Signup</h2>
          <Form onSubmit={handleSubmit}>
            <FormInput
              controlId="formFirstName"
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              isInvalid={!!errors.firstName}
              errorMessage={errors.firstName}
            />

            <FormInput
              controlId="formLastName"
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              isInvalid={!!errors.lastName}
              errorMessage={errors.lastName}
            />

            <FormInput
              controlId="formEmail"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
              errorMessage={errors.email}
              type="email"
            />

            <FormInput
              controlId="formPassword"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
              errorMessage={errors.password}
              type="password"
            />

            <Form.Group controlId="formRole">
              <Form.Label>Select Role</Form.Label>
              <Form.Control
                as="select"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setRoleSpecificId("");
                }}
              >
                <option value="" disabled>
                  Pick a Role
                </option>
                <option value="STUDENT">Student</option>
                {/* <option value="LECTURER">Lecturer</option> THIS IS NOT READY */}
                <option value="REGISTRAR">Registrar</option>
              </Form.Control>
            </Form.Group>

            <FormInput
              controlId="formRoleSpecificId"
              label={
                role === "STUDENT"
                  ? "Student Number"
                  : // role === "LECTURER" ? "Lecturer Number" :
                  role === "REGISTRAR"
                  ? "Registrar Number"
                  : "Select Role First"
              }
              value={roleSpecificId}
              onChange={(e) => setRoleSpecificId(e.target.value)}
              isInvalid={!!errors.roleSpecificId}
              errorMessage={errors.roleSpecificId}
            />

            <Button variant="success" type="submit" className="Signup-button">
              SIGN UP
            </Button>

            {errors.form && <div className="text-danger">{errors.form}</div>}

            <Form.Text className="text-right">
              Already Registered? <a href="/login">Sign in</a>
            </Form.Text>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Signup;
