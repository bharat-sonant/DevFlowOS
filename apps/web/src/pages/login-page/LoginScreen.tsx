import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./LoginScreen.css";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const companyId = localStorage.getItem('companyId')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.password) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/login", {
        companyId,
        username: formData.username,
        password: formData.password,
      });
      console.log('login result', res)

      if(res.data.success){
        localStorage.setItem("token", res.data.data.token);
      navigate("/project");
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("❌ Invalid username or password");
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
    <div className={`login-container ${loading ? 'login-loading' : ''}`}>
      {/* Left Panel */}
      <div className="login-left-panel">
        <div className="login-logo">
          <div className="login-logo-container">
            <div className="login-logo-icon">
              <div className="login-logo-dots">
                <div className="login-logo-dot"></div>
                <div className="login-logo-dot"></div>
                <div className="login-logo-dot"></div>
                <div className="login-logo-dot"></div>
              </div>
            </div>
            <span className="login-logo-text">Task Management</span>
          </div>
        </div>

        <div className="login-welcome-content">
          <h1 className="login-welcome-title">Welcome Friend!</h1>
          <p className="login-welcome-text">
            To keep connected with us please
            <br />
            login with your personal info
          </p>
        </div>

        {/* Decorative shapes */}
        <div className="login-shape-1"></div>
        <div className="login-shape-2"></div>
        <div className="login-shape-3"></div>
      </div>

      {/* Right Panel */}
      <div className="login-right-panel">
        <div className="login-form-container">
          <h2 className="login-form-title">Login</h2>
          <p className="login-form-subtitle">
            Enter your username and password
          </p>


          <div className="login-form-fields">
            <div className="login-input-container">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                className="login-input"
                disabled={loading}
              />

              <div className="login-password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  className="login-input login-password-input"
                  disabled={loading}
                />

                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="login-password-toggle"
                  tabIndex={0}
                  role="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

          {error && <div className="login-error">{error}</div>}


            <button
              onClick={handleSubmit}
              disabled={loading}
              className="login-submit-button"
              type="button"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;