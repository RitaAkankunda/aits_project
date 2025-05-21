import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import "../css/pagecss/ForgotPassword.css";
import TopNavbar from "../components/Navbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    
    try {
      const res = await axios.post("https://rita004.pythonanywhere.com/api/accounts/forgot-password/", {
        email: email.trim(),
      });
      
      setIsSubmitting(false);
      
      if (res.data.success) {
        toast.success(res.data.message);
        setEmail(""); // Clear the form
      } else {
        toast.error(res.data.message || "An error occurred");
      }
    } catch (error) {
      setIsSubmitting(false);
      console.log("Full error:", error);
      
      if (error.response && error.response.data) {
        console.log("Error response data:", error.response.data);
        
        const errorData = error.response.data;
        
        // Handle various error response formats
        if (typeof errorData.message === 'object') {
          // Log specific field errors
          const errorMessages = Object.values(errorData.message).flat();
          console.log("Serializer errors:", errorMessages);
          toast.error(errorMessages[0] || "Error processing request.");
        } else if (errorData.message) {
          toast.error(errorData.message);
        } else if (errorData.detail) {
          toast.error(errorData.detail);
        } else if (errorData.error) {
          toast.error(errorData.error);
        } else if (error.response.status === 404) {
          toast.error("Email address not found");
        } else {
          toast.error("Error processing request. Please try again.");
        }
      } else if (error.request) {
        toast.error("No response from server. Check your connection.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
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

            <Button 
              type="submit" 
              className="forgot-password-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
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
