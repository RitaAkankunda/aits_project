import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth
import { useRole } from "../contexts/RoleContext";
import TopNavbar from "../components/Navbar";
import FormInput from "../components/FormInput";
import { Form, Button, FormLabel } from "react-bootstrap";
import "../css/pagecss/Signup.css";

function Signup() {
  const { login } = useAuth(); // Use context
  const { changeRole } = useRole();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [roleSpecificId, setRoleSpecificId] = useState("");
  const [department,setDepartment] = useState("");
  const departments = [
    { code: "cs", name: "Department of Computer Science" },
    { code: "is", name: "Department of Information Systems" },
    { code: "it", name: "Department of Information Technology" },
  ];
  
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
        role === "STUDENT"
          ? "Student number is required"
          : role === "LECTURER"
          ? "Lecturer number is required"
          : "Registrar number is required";
    }
    if (role === "LECTURER"&&!department){
      newErrors.department="Department is required";
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Early return if errors exist
    }

    setErrors({});

    // Prepare request data
    const requestData = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      role,
      ...(role === "STUDENT" && { student_number: roleSpecificId }),
      ...(role === "LECTURER" && {
        lecturer_number: roleSpecificId,
        department,
      }),
      ...(role === "REGISTRAR" && { registrar_number: roleSpecificId }),
    };
    console.log(requestData);
    

    try {
      const response = await axios.post(
        "https://backendaits.onrender.com/api/accounts/register/", // Corrected endpoint
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Ensure response has the expected structure
      if (response.data?.success && response.data?.token && response.data?.user) {
        // Transform the response data to match your auth system
        const authData = {
          token: response.data.token,
          user: {
            id: response.data.user.id,
            email: response.data.user.email,
            first_name: response.data.user.first_name,
            last_name: response.data.user.last_name,
            role: response.data.user.role,
            student_number: response.data.user.student_number || null,
            lecturer_number: response.data.user.lecturer_number || null,
            registrar_number: response.data.user.registrar_number || null,
            department: response.data.user.department || null,
          },
        };

        // Call login with properly formatted data
        login(authData);
        changeRole(authData.user.role);
        console.log(authData);

        // Navigate based on role
        navigate(`/dashboards/${role.toLowerCase()}/${role.toLowerCase()}-dashboard`);
        toast.success("Signup successful!");
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Signup error:", error);

      let errorMessage = "Signup failed. Please try again.";

      if (error.response) {
        // Handle field-specific errors
        if (error.response.data) {
          // Handle Django/DRF validation errors
          if (typeof error.response.data === "object") {
            // Field errors (e.g., {"email": ["This field must be unique"]})
            const fieldErrors = Object.entries(error.response.data)
              .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
              .join("; ");

            errorMessage = fieldErrors || errorMessage;
          }
          // Handle custom error messages
          else if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          }
        }
      }

      setErrors({ form: errorMessage });
      toast.error(errorMessage);
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
                <option value="LECTURER">Lecturer</option>
                <option value="REGISTRAR">Registrar</option>
              </Form.Control>
            </Form.Group>

            {role === "LECTURER"&&(
              <Form.Group controlId="formDepartment">
                <Form.Label>Select Department</Form.Label>
                <Form.Control
                  as="select"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    console.log("Selected department:", e.target.value);
                  }}
                  isInvalid={!!errors.department}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept,index)=>(
                    <option key={index} value={dept.code}>
                      {dept.name}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.department}

                </Form.Control.Feedback>

              </Form.Group>
            )

            }

            <FormInput
              controlId="formRoleSpecificId"
              label={
                role === "STUDENT"
                  ? "Student Number"
                  : role === "LECTURER"
                  ? "Lecturer Number"
                  : role === "REGISTRAR"
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
              Already Registered? <Link to="/login">Login</Link>
            </Form.Text>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Signup;
