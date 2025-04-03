import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "../css/pagecss/Login.css";
import { Link, useNavigate } from "react-router-dom";
import TopNavbar from "../components/Navbar";
import { toast } from "react-toastify";
import axios from "axios";
import { useRole } from "../contexts/RoleContext";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const { login } = useAuth();
  let navigate = useNavigate();
  const { changeRole } = useRole(); // Use context to update the role

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
        "https://rita004.pythonanywhere.com/api/login/",
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        const { token, role, first_name, last_name, student_number } =
          response.data;

        login({
          email,
          role,
          first_name,
          last_name,
          student_number,
          token, // Include the student's number
        });

        changeRole(role);

        // Store in localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            email,
            role,
            student_number,
            first_name,
            last_name,
          })
        );

        toast.success("Login successful");
        navigate(`/dashboards/${role}/${role}-dashboard`);
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response && error.response.data) {
        setErrors({
          form: error.response.data.detail || "Login failed. Please try again.",
        });
      } else {
        setErrors({ form: "Login failed. Please try again." });
      }
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
        </div>
      </div>
    </>
  );
}

export default Login;
