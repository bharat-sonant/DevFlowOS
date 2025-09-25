import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import ErrorPage from "../../components/common/ErrorPage/ErrorPage";
import '../EmailVerificationPage/EmailVerificationPage.css';

const EmailVerificationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorType, setErrorType] = useState<string | null>(null);

  // Map backend error types to friendly messages
  const errorMessages: Record<string, string> = {
    token_used: "This verification link has already been used. Please request a new one.",
    token_expired: "This verification link has expired. Please request a new one.",
    token_invalid: "This verification link is invalid.",
    token_not_found: "The verification token was not found.",
    missing_params: "Missing verification token in the URL.",
    network_error: "Network error occurred while verifying your email. Please try again.",
    verification_failed: "Email verification failed due to an unknown reason.",
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    console.log('token on frontend', token);

    if (!token) {
      setStatus("error");
      setErrorType("missing_params");
      return;
    }

    const verifyEmail = async () => {
      try {
        console.log('api hit started');
        const response = await api.get(`/companies/auth/verify-email?token=${encodeURIComponent(token)}`);
        console.log('frontend verify', response);
        const data = response.data;

        if (data.data.email) {
          localStorage.setItem('userTokenId', data.data.tokenId)
          // Navigate to registration form with email & verified
          navigate(`/registrationForm?email=${encodeURIComponent(data.data.email)}&verified=true`);
        } else {
          // Show friendly error
          setErrorType(data.error || "verification_failed");
          setStatus("error");
        }
      } catch (err) {
        console.error("Email verification failed:", err);
        setErrorType("network_error");
        setStatus("error");
      }
    };

    verifyEmail();
  }, [location.search, navigate]);

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <h2>Verifying your email...</h2>
        <p>Please wait a moment.</p>
        <div className="spinner"></div>
      </div>
    );
  }

  // Render error page with friendly messages
  return (
    <ErrorPage
      title="Email Verification Failed"
      message={errorType ? errorMessages[errorType] || "An unknown error occurred." : ""}
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
