import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import "../css/pagecss/ForgotPassword.css";
import TopNavbar from "../components/Navbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    return newErrors;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const res = await axios.post(
        "https://rita004.pythonanywhere.com/api/forgotPassword",
        {
          email,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <TopNavbar />
      <div className="forgot-password-container">
        <div className="forgot-password-box">
          <h5 className="forgot-password-title">Forgot Password</h5>
          <p className="forgot-password-text">
            Enter your email to reset your password.
          </p>
          <Form className="forgot-password-form" onSubmit={handleSubmit}>
            <Form.Group className="forgot-password-group">
              <Form.Label htmlFor="email" className="forgot-password-label">
                Email
              </Form.Label>
              <Form.Control
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="forgot-password-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" className="forgot-password-button">
              Submit
            </Button>
          </Form>
          <p className="forgot-password-text">
            Remember your password?{" "}
            <a href="/login" className="forgot-password-link">
              Login Here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
