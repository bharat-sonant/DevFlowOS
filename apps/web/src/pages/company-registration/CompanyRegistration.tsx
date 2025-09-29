import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "../company-registration/CompanyRegistration.css";
import SuccessPage from "../../components/common/SuccessPage/SuccessPage";

const CompanyRegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "" });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error as soon as user starts typing
  if (error) {
    setError("");
  }
  };

const handleSubmit = async () => {
  if (!formData.email) return;

  try {
    setLoading(true);
    setError("");

    await api.post("/companies/pre-register", { email: formData.email });

    // Success – show success page
    setStatus("success");
  } catch (error: any) {
    console.log("error", error);

    const message =
      error.response?.data?.error || "Something went wrong. Please try again.";

    setError(message); // This will show below the button
  } finally {
    setLoading(false);
  }
};


  if (status === "success") {
    return (
      <SuccessPage
        title="Email Sent Successfully!"
        message={`A verification email has been sent to ${formData.email}`}
        steps={[
          "Check your inbox for the verification email",
          "Click the verification link (expires in 24 hours)",
          "Don't forget to check your spam folder",
        ]}
        actionText="Back to Signup"
        onAction={() => setStatus("idle")}
      />
    );
  }

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
          <h2>Create Account</h2>

          <p>Use your email for registration:</p>

          <div className="form-fields">
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="input"
                disabled={loading}
              />
            </div>

            {error && (
              
              <p
                style={{
                  color: "red",
                  fontSize: "0.9rem",
                }}
              >
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !formData.email}
              className="signup-btn"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
    <span style={{ fontSize: '0.9rem', color: '#555' }}>
      Already have an account?{' '}
      <button
        onClick={() => navigate('/companycodescreen')}
        style={{
          background: 'none',
          border: 'none',
          color: '#1a73e8',
          cursor: 'pointer',
          textDecoration: 'underline',
          padding: 0,
          fontSize: '0.9rem'
        }}
      >
        Login
      </button>
    </span>
  </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistrationPage;
