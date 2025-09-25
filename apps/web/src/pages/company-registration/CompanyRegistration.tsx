import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import '../company-registration/CompanyRegistration.css'

const CompanyRegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const result = await api.post("/auth/pre-register", formData.email);
      console.log("result of pre registration", result);
      navigate("/emailVerification", {
        state: { status: "success", email: formData.email },
      });
    } catch (error) {
      console.log("error", error);
      navigate("/emailVerification", {
        state: { status: "error", email: formData.email },
      });
    }
  };

  return (
    <div className="signup-container">
      {/* Left Panel */}
      <div className="left-panel">
        <div className="logo">
          <div className="logo-box">
            <div className="dots">
               <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <span className="logo-text">Task Management</span>
        </div>

        <div className="welcome-text">
          <h1>Welcome Friend!</h1>
          <p>
            To keep connected with us please
            <br />
            login with your personal info
          </p>
        </div>

        {/* Decorative shapes */}
         <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="form-box">
          <h2>
            Create Account
          </h2>

          <p>
            Use your email for registration:
          </p>

          <div className="form-fields">
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              className="input"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="signup-btn"
            >
              SIGN UP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistrationPage;
