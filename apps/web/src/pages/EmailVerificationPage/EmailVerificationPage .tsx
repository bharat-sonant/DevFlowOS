import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import ErrorPage from "../../components/common/ErrorPage/ErrorPage";
import '../EmailVerificationPage/EmailVerificationPage.css';

const EmailVerificationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "error">("loading");

  // Extract token from URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        await api.get(`/auth/verify?token=${token}`);
        // Success: redirect immediately
        navigate("/registrationForm");
      } catch (error) {
        console.error("Token verification failed:", error);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <h2>Verifying your email...</h2>
        <p>Please wait a moment.</p>
        <div className="spinner"></div>
      </div>
    );
  }

  // Only render error page if verification fails
  return (
    <ErrorPage
      title="Invalid or Expired Token"
      message="The verification link is invalid or has expired."
      email=""
      steps={[
        "Check if you already verified your email",
        "Request a new verification link",
        "Contact support if the issue persists",
      ]}
      actionText="Back to Signup"
      onAction={() => navigate("/register-company")}
    />
  );
};

export default EmailVerificationPage;
