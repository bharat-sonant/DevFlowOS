import React, { useState, useEffect } from "react";
import "../invite-user/RegistrationFlow.css";
import { api } from "../../services/api";

interface FormData {
  companyCode: string;
  fullName: string;
  username: string;
  password: string;
}

const RegistrationFlow: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isValidating, setIsValidating] = useState<boolean>(true);
  const [tokenValid, setTokenValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    companyCode: "ABC123",
    fullName: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setError("Invalid or missing invitation token");
      setIsValidating(false);
      return;
    }

    validateToken(token);
  }, []);

  const validateToken = async (token: string) => {
    try {
      setIsValidating(true);

      // TODO: Replace with actual API call
      // const response = await fetch('/api/validate-token', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token })
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockData = {
        valid: true,
        companyCode: "COMP-12345",
      };

      if (mockData.valid) {
        setFormData((prev) => ({ ...prev, companyCode: mockData.companyCode }));
        setTokenValid(true);
      } else {
        setError("Invalid or expired invitation token");
      }
    } catch (err) {
      setError("Failed to validate token. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    setError("");
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      setError("Please enter a username");
      return;
    }

    if (!formData.password.trim()) {
      setError("Please enter a password");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    const payload = {
      companyCode: formData.companyCode,
      username: formData.username,
      password: formData.password,
    };
    try {
      setLoading(true);
      setError("");

      const result = api.post("/users/complete-registration", payload);

      //       if(result.success){
      localStorage.setItem("companyCode", formData.companyCode);
      localStorage.setItem("isOwner", "No");
      //       setSuccess('Registration completed successfully! Redirecting to dashboard...');
      // setTimeout(() => {
      //         // TODO: Store auth token and redirect
      //         // window.location.href = '/dashboard';
      //         console.log('Redirecting to dashboard...');
      //       }, 2000);
      //       }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="registration-container">
        <div className="registration-card">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Validating invitation...</p>
          </div>
        </div>
      </div>
    );
  }

  // if (!tokenValid) {
  //   return (
  //     <div className="registration-container">
  //       <div className="registration-card">
  //         <div className="error-state">
  //           <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
  //             <circle cx="12" cy="12" r="10" strokeWidth="2"/>
  //             <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/>
  //             <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/>
  //           </svg>
  //           <h2>Invalid Invitation</h2>
  //           <p>{error}</p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="card-header">
          <h1>Complete Your Registration</h1>
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? "active" : ""}`}>
              <span className="step-number">1</span>
              <span className="step-label">Personal Info</span>
            </div>
            <div className="step-divider"></div>
            <div className={`step ${step >= 2 ? "active" : ""}`}>
              <span className="step-number">2</span>
              <span className="step-label">Account Setup</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2" />
              <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2" />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" />
              <polyline points="22 4 12 14.01 9 11.01" strokeWidth="2" />
            </svg>
            {success}
          </div>
        )}

        {step === 1 && (
          <form className="registration-form" onSubmit={handleStep1Next}>
            <div className="form-group">
              <label htmlFor="companyCode">Company Code</label>
              <input
                type="text"
                id="companyCode"
                name="companyCode"
                value={formData.companyCode}
                disabled
                className="form-input disabled"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="form-input"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              Next
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" />
                <polyline points="12 5 19 12 12 19" strokeWidth="2" />
              </svg>
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="registration-form" onSubmit={handleStep2Submit}>
            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a username"
                className="form-input"
                required
              />
            </div>

            <div className="form-group password-wrapper">
              <label htmlFor="password">Password *</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  className="form-input"
                  required
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="password-toggle"
                  tabIndex={0}
                  role="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
              <span className="form-hint">Minimum 8 characters</span>
            </div>

            <div className="button-group">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-secondary"
                disabled={loading}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="19" y1="12" x2="5" y2="12" strokeWidth="2" />
                  <polyline points="12 19 5 12 12 5" strokeWidth="2" />
                </svg>
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner-small"></div>
                    Completing...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistrationFlow;
