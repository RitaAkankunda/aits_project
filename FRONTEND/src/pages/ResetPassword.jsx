import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../css/pagecss/ResetPassword.css";
import TopNavbar from "../components/Navbar";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate query parameters on mount
  useEffect(() => {
    if (!id || !token) {
      toast.error("Invalid or missing reset link parameters.");
      setTimeout(() => navigate("/forgot-password"), 3000);
    }
  }, [id, token, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleResetPassword = async (ev) => {
    ev.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await axios.post("http://localhost:8000/api/accounts/reset-password/", {
        id,
        token,
        password: newPassword,
      });

      setIsSubmitting(false);

      if (res.data.success) {
        toast.success(res.data.message);
        setTimeout(() => navigate("/login"), 2000); // Delay navigation to show toast
      } else {
        toast.error(res.data.message || "An error occurred");
      }
    } catch (error) {
      setIsSubmitting(false);
      console.log("Reset Password Error:", error);

      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          toast.error(errorData.message);
        } else if (errorData.detail) {
          toast.error(errorData.detail);
        } else if (error.response.status === 400) {
          toast.error("Invalid or expired reset link.");
        } else if (error.response.status >= 500) {
          toast.error("Server error. Please try again later.");
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
      <div className="reset-password-container">
        <div className="reset-password-box">
          <h5 className="reset-password-title">Reset Password</h5>
          <p className="reset-password-text">
            Enter your new password below.
          </p>
          <Form className="reset-password-form" onSubmit={handleResetPassword}>
            <Form.Group className="reset-password-group">
              <Form.Label htmlFor="newpassword" className="reset-password-label">
                New Password
              </Form.Label>
              <Form.Control
                id="newpassword"
                name="newpassword"
                type="password"
                placeholder="New Password"
                required
                className="reset-password-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                isInvalid={!!errors.newPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.newPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="reset-password-group">
              <Form.Label htmlFor="confirmpassword" className="reset-password-label">
                Confirm Password
              </Form.Label>
              <Form.Control
                id="confirmpassword"
                name="confirmpassword"
                type="password"
                placeholder="Confirm Password"
                required
                className="reset-password-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                isInvalid={!!errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              type="submit"
              className="reset-password-button"
              disabled={isSubmitting || !id || !token}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Form>
          <p className="reset-password-text">
            Not yet registered?{" "}
            <a href="/signup" className="reset-password-link">
              Register Here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
