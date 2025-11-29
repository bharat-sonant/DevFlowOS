import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import ErrorPage from "../../components/common/ErrorPage/ErrorPage";
import '../invite-user/ValidateUser.css'

const ValidateUser: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "error">("loading");
   const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    console.log('token on frontend', token);

    if (!token) {
      setErrorMessage("Missing verification token in the URL.");
      setStatus("error");
      return;
    }

    const validateUser = async () => {
     try {
  const response = await api.get(`/users/validate-invite?token=${token}`);
console.log(response, 'verify')
  if (response.data.success) {
    // success path
    // localStorage.setItem('userTokenId', response.data.tokenId)
    localStorage.setItem('companyCode',response.data.companyCode)
     localStorage.setItem('companyName',response.data.companyName)
     localStorage.setItem('companyId', response.data.companyId)
    localStorage.setItem('tokenFromUrl', token)
    navigate(`/invited-user-registration-flow?email=${response.data.email}&verified=true`);
  } else {
    // backend provided error
    setErrorMessage(response.data.error || "Email verification failed.");
    setStatus("error");
  }
} catch (err: any) {
  // network or unhandled errors
  setErrorMessage(err.message || "Network error occurred.");
  setStatus("error");
}

    };

    validateUser();
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
      title="User Validation Failed"
      message={errorMessage}
      email=""
      steps={[
        "Check if you already verified your email",
        "Request a new verification link",
        "Contact support if the issue persists",
      ]}
      // actionText="Back to Signup"
      // onAction={() => navigate("/register-company")}
    />
  );
};

export default ValidateUser;
