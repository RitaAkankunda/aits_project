import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "../css/pagecss/Login.css";
import { Link, useNavigate } from "react-router-dom";
import TopNavbar from "../components/Navbar";
import axios from "axios";
import { useRole } from "../contexts/RoleContext";
import { useAuth } from "../contexts/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const { login } = useAuth();
  let navigate = useNavigate();
  const { changeRole } = useRole(); // Use context to update the role
   const notifySuccess = () => toast.success("Log in successful!", {closeButton: false, autoClose: 2000});
  const notifyError = () => toast.error("Log in failed.", {closeButton: false, autoClose: 2000});

  // State for managing login form and role
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
  
    try {
      const response = await axios.post(
        "https://backendaits.onrender.com/api/accounts/login/", 
        { email, password },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
  
      // Validate response structure
      if (!response.data?.success || !response.data?.token || !response.data?.user) {
        throw new Error("Invalid response format");
      }
  
      const { token, user } = response.data;
  
      // Ensure required user fields exist
      const authPayload = {
        token,
        user: {
          id: user.id,
          email: user.email || user.username, // Fallback to username if email missing
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          role: user.role || "STUDENT", // Default role
          student_number: user.student_number || null,
          lecturer_number: user.lecturer_number || null,
          registrar_number: user.registrar_number || null,
          token 
        }
      };
  
      // Call auth context login
      login(authPayload);
      console.log("Login successful:", authPayload);
  
      // Update role context
      changeRole(authPayload.user.role);
  
      // Show success and navigate
      
      navigate(`/dashboards/${authPayload.user.role}/${authPayload.user.role}-dashboard`);
      notifySuccess();
  
    } catch (error) {

      console.error("Login Error:", error);
      notifyError();
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.response) {
        // Handle Django/drf errors
        if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        }
        // Handle validation errors
        else if (typeof error.response.data === 'object') {
          errorMessage = Object.entries(error.response.data)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('; ');
        }
      }
  
      setErrors({ form: errorMessage });
      notifyError();
    }
  };

  // useEffect(() => {
  //   console.log("Role updated:", role);
  //   // Navigate when role is set
  //   if (role) {
  //     navigate(`/dashboards/${role}/profile`);
  //   }
  // }, [role, navigate]);  // Dependencies: role and navigate

  // useEffect to handle navigation after login and role change
  return (
    <>
      <TopNavbar />
      <div className="login-wrapper">
        <div className="login-form-container">
          <h2 className="login-title">Login</h2>
          <Form onSubmit={handleSubmit} className="login-form">
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            {errors.form && (
              <div className="text-danger mb-3">{errors.form}</div>
            )}

            <Button variant="success" type="submit" className="login-button">
              LOG IN
            </Button>
            <Form.Text className="text-right">
              New Here? <Link to="/signup">Signup</Link>
            </Form.Text>
            <Form.Text className="text-right">
              Forgot Password? <Link to="/ForgotPassword">Click Here</Link>
            </Form.Text>
          </Form>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default Login;
