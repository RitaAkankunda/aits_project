import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Button } from "react-bootstrap";
import "../css/pagecss/ResetPassword.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  let navigate = useNavigate();
  const id = searchParams.get("id");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!newPassword) newErrors.newPassword = "New password is required";
    else if (newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters";
    if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleResetPassword = async (ev) => {
    ev.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const formData = { id, token, password: newPassword };
      const res = await axios.post(
        "https://rita004.pythonanywhere.com/api/resetPassword",
        formData
      );
      const data = res.data;

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h5 className="reset-password-title">Reset Password</h5>
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
            <Form.Label
              htmlFor="confirmpassword"
              className="reset-password-label"
            >
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

          <Button type="submit" className="reset-password-button">
            Submit
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
  );
};

export default ResetPassword;
