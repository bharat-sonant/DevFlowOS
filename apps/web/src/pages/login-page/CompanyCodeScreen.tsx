import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "../login-page/CompanyCodeScreen.css";

const CompanyCodeScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Convert to uppercase and remove any non-alphanumeric characters
    const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setFormData((prev) => ({
      ...prev,
      [name]: cleanValue,
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!formData.companyCode) {
      setError("⚠️ Please enter company code");
      return;
    }
    
    try {
      setLoading(true);
      setError("");

      const result = await api.get("/auth/validate-company", {
      params: { companyCode: formData.companyCode },
    });

    console.log('result', result)

      
      if (result.data?.success) {
        localStorage.setItem("companyId", result?.data?.companyId);
        navigate("/login");
      } else {
        setError("❌ Invalid company code");
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        setError("❌ Company code not found");
      } else if (err.response?.status === 400) {
        setError("❌ Invalid company code format");
      } else {
        setError("❌ Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={`company-code-container ${loading ? 'company-code-loading' : ''}`}>
      {/* Left Panel */}
      <div className="company-code-left-panel">
        <div className="company-code-logo">
          <div className="company-code-logo-container">
            <div className="company-code-logo-icon">
              <div className="company-code-logo-dots">
                <div className="company-code-logo-dot"></div>
                <div className="company-code-logo-dot"></div>
                <div className="company-code-logo-dot"></div>
                <div className="company-code-logo-dot"></div>
              </div>
            </div>
            <span className="company-code-logo-text">Task Management</span>
          </div>
        </div>

        <div className="company-code-welcome-content">
          <h1 className="company-code-welcome-title">Welcome Friend!</h1>
          <p className="company-code-welcome-text">
            To keep connected with us please
            <br />
            login with your personal info
          </p>
        </div>

        {/* Decorative shapes */}
        <div className="company-code-shape-1"></div>
        <div className="company-code-shape-2"></div>
        <div className="company-code-shape-3"></div>
      </div>

      {/* Right Panel */}
      <div className="company-code-right-panel">
        <div className={`company-code-form-container ${loading ? 'validating' : ''}`}>
          <h2 className="company-code-form-title">Login</h2>
          <p className="company-code-form-subtitle">
            Enter your company code for login:
          </p>

          <div className="company-code-form-fields">
            <div className={`company-code-input-container ${error ? 'has-error' : ''}`}>
              <input
                type="text"
                name="companyCode"
                placeholder="Company Code (e.g., COMP123)"
                value={formData.companyCode}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                className="company-code-input"
                disabled={loading}
                maxLength={10}
                autoComplete="organization"
                autoCapitalize="characters"
                spellCheck={false}
              />
            </div>
            {error && <div className="company-code-error">{error}</div>}

            <button
              onClick={handleSubmit}
              disabled={loading || !formData.companyCode}
              className="company-code-submit-button"
              type="button"
            >
              {loading ? "Validating..." : "Continue"}
            </button>
 <div style={{ marginTop: '1rem', textAlign: 'center' }}>
    <span style={{ fontSize: '0.9rem', color: '#555' }}>
      Don't have an account?{' '}
      <button
        onClick={() => navigate('/register-company')}
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
        Sign Up
      </button>
    </span>
  </div>
          </div>

          <div style={{ 
            marginTop: '2rem', 
            fontSize: '0.8rem', 
            color: '#888',
            textAlign: 'center' 
          }}>
            Don't have a company code? Contact your administrator.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCodeScreen;