import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  // inside your component state
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordRules, setPasswordRules] = useState<
    { rule: string; isValid: boolean }[]
  >([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") validatePassword(value);

    if (name === "confirmPassword") {
      if (!value) {
      setConfirmPasswordError("")
    }  else if (formData.password && value !== formData.password) {
        setConfirmPasswordError("Passwords do not match ❌");
      } else if (formData.password && value === formData.password) {
        setConfirmPasswordError("Passwords match ✅");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const validatePassword = (password: string): void => {
    const checks = [
      { rule: "At least 8 characters required", isValid: password.length >= 8 },
      { rule: "At least one uppercase letter", isValid: /[A-Z]/.test(password) },
      { rule: "At least one lowercase letter", isValid: /[a-z]/.test(password) },
      { rule: "At least one number", isValid: /[0-9]/.test(password) },
      { rule: "At least one special character (!@#$%^&*)", isValid: /[!@#$%^&*]/.test(password) },
    ];

    setPasswordRules(checks);

    const passed = checks.filter((c) => c.isValid).length;
    if (passed === checks.length) {
      if (password.length >= 12) setPasswordStrength("Strong");
      else setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Weak");
    }
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("Passwords do not match ❌");
      return;
    }
    setLoading(true)
    try{
      const res = await api.post('/auth/register',{
        companyName : formData.companyName,
        username: formData.username,
        password: formData.password,
      })

       console.log("Registration success:", res.data);
       navigate('/login')
    }catch(error){
      console.log('error', error)
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <div
      style={{
        display: "flex",
        fontFamily: "Arial, sans-serif",
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {/* Left Panel */}
      <div
        style={{
          flex: "1 1 50%",
          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          padding: "2rem",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 300,
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          Welcome Friend!
        </h1>
        <p
          style={{
            fontSize: "clamp(0.9rem, 2vw, 1rem)",
            textAlign: "center",
            opacity: 0.9,
          }}
        >
          To connect with us please sign up with your personal info
        </p>
      </div>

      {/* Right Panel */}
      <div
        style={{
          flex: "1 1 50%",
          background: "#f5f5f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            width: "90%",
            maxWidth: "500px",
            textAlign: "center",
            margin: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              color: "#4facfe",
              marginBottom: "1rem",
              fontWeight: 300,
            }}
          >
            Create Account
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Company Name */}
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleInputChange}
              style={inputStyle}
            />

            {/* Username */}
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              style={inputStyle}
            />

         

            {/* Password */}
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                style={inputStyle}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {/* Password Rules */}
            {formData.password && (
              <ul
                style={{
                  textAlign: "left",
                  fontSize: "0.85rem",
                  margin: "0.5rem 0",
                  paddingLeft: "1rem",
                }}
              >
                {passwordRules.map((r, idx) => (
                  <li
                    key={idx}
                    style={{
                      color: r.isValid ? "green" : "red",
                      listStyleType: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>{r.isValid ? "✅" : "❌"}</span>
                    {r.rule}
                  </li>
                ))}
              </ul>
            )}

           {/* Confirm Password */}
<div style={{ position: "relative" }}>
  <input
    type={showConfirmPassword ? "text" : "password"}
    name="confirmPassword"
    placeholder="Confirm Password"
    value={formData.confirmPassword}
    onChange={handleInputChange}
    style={inputStyle}
  />
  <span
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    style={{
      position: "absolute",
      right: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      fontSize: "0.9rem",
    }}
  >
    {showConfirmPassword ? "🙈" : "👁️"}
  </span>
</div>

{confirmPasswordError && (
  <p
    style={{
      color: confirmPasswordError.includes("match") ? "green" : "red",
      fontSize: "0.85rem",
      marginTop: "-0.5rem",
      marginBottom: "0.5rem",
      textAlign: "left",
      paddingLeft: "1rem",
    }}
  >
    {confirmPasswordError}
  </p>
)}


            {/* Sign Up Button */}
           <button
  onClick={handleSubmit}
  style={{
    ...buttonStyle,
    background: !formData.companyName ||
               !formData.username ||
               !formData.password ||
               !formData.confirmPassword
      ? "linear-gradient(135deg, #b0bec5 0%, #90a4ae 100%)" // dull when disabled
      : buttonStyle.background,
    cursor: !formData.companyName ||
            !formData.username ||
            !formData.password ||
            !formData.confirmPassword
      ? "not-allowed"
      : "pointer",
  }}
  disabled={
    !formData.companyName ||
    !formData.username ||
    !formData.password ||
    !formData.confirmPassword   }
>
  SIGN UP
</button>

          </div>
        </div>
      </div>
    </div>
  );
};

/* Inline reusable styles */
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.8rem 1rem",
  border: "1px solid #e0e0e0",
  borderRadius: "25px",
  background: "#f8f8f8",
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  border: "none",
  color: "white",
  padding: "0.8rem 2rem",
  borderRadius: "25px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1rem",
  width: "100%",
  marginTop: "1rem",
};

export default RegistrationForm;