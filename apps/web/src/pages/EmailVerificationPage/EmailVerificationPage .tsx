import React, { useState, useEffect } from 'react';

const EmailVerificationPage = () => {
  const [verificationStatus, setVerificationStatus] = useState('success');
  const [email, setEmail] = useState('user@example.com');

 

  const renderContent = () => {
    switch (verificationStatus) {
      case 'success':
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "3rem", width: "100%" }}>
            {/* Left side - Icon and main message */}
            <div style={{ flex: "0 0 300px", textAlign: "center" }}>
              <div style={{
                borderRadius: "50%",
                padding: "2rem",
                width: "120px",
                height: "120px",
                margin: "0 auto 2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                boxShadow: "0 4px 20px rgba(34, 197, 94, 0.2)"
              }}>
                <span style={{ fontSize: "3rem" }}>✅</span>
              </div>
              <h2 style={{ 
                fontSize: "2rem", 
                fontWeight: "700", 
                color: "#1f2937", 
                marginBottom: "1rem",
                lineHeight: "1.2"
              }}>
                Email Sent Successfully!
              </h2>
              <p style={{ color: "#4b5563", fontSize: "1.1rem", lineHeight: "1.5" }}>
                A verification email has been sent to<br/>
                <span style={{ fontWeight: "600", color: "#111827" }}>{email}</span>
              </p>
            </div>

            {/* Right side - Instructions and actions */}
            <div style={{ flex: "1", minWidth: "0" }}>
              <div style={{
                background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                border: "1px solid #bfdbfe",
                borderRadius: "12px",
                padding: "2rem",
                marginBottom: "2rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                  <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#2563eb",
                    marginRight: "0.75rem"
                  }}></div>
                  <p style={{ fontWeight: "600", fontSize: "1.1rem", color: "#2563eb", margin: 0 }}>
                    Next Steps
                  </p>
                </div>
                <div style={{ display: "grid", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      background: "#2563eb",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: "600"
                    }}>1</div>
                    <span style={{ color: "#2563eb", fontSize: "1rem" }}>Check your inbox for the verification email</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      background: "#2563eb",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: "600"
                    }}>2</div>
                    <span style={{ color: "#2563eb", fontSize: "1rem" }}>Click the verification link (expires in 24 hours)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      background: "#2563eb",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: "600"
                    }}>3</div>
                    <span style={{ color: "#2563eb", fontSize: "1rem" }}>Don't forget to check your spam folder</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <p style={{ fontSize: "0.95rem", color: "#6b7280", margin: 0 }}>
                  Didn't receive the email?
                </p>
                <button
                  onClick={() => setVerificationStatus('error')}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.75rem 2rem",
                    fontSize: "1rem",
                    fontWeight: "500",
                    borderRadius: "8px",
                    border: "2px solid #e5e7eb",
                    background: "#fff",
                    color: "#374151",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}
                
                >
                  Resend Email
                </button>
              </div>
            </div>
          </div>
        );

      case 'error':
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "3rem", width: "100%" }}>
            {/* Left side - Icon and main message */}
            <div style={{ flex: "0 0 300px", textAlign: "center" }}>
              <div style={{
                borderRadius: "50%",
                padding: "2rem",
                width: "120px",
                height: "120px",
                margin: "0 auto 2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                boxShadow: "0 4px 20px rgba(239, 68, 68, 0.2)"
              }}>
                <span style={{ fontSize: "3rem" }}>❌</span>
              </div>
              <h2 style={{ 
                fontSize: "2rem", 
                fontWeight: "700", 
                color: "#1f2937", 
                marginBottom: "1rem",
                lineHeight: "1.2"
              }}>
                Failed to Send Email
              </h2>
              <p style={{ color: "#4b5563", fontSize: "1.1rem", lineHeight: "1.5" }}>
                There was an error sending the verification email to<br/>
                <span style={{ fontWeight: "600", color: "#111827" }}>{email}</span>
              </p>
            </div>

            {/* Right side - Error details and actions */}
            <div style={{ flex: "1", minWidth: "0" }}>
              <div style={{
                background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
                border: "1px solid #fecaca",
                borderRadius: "12px",
                padding: "2rem",
                marginBottom: "2rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                  <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#dc2626",
                    marginRight: "0.75rem"
                  }}></div>
                  <p style={{ fontWeight: "600", fontSize: "1.1rem", color: "#dc2626", margin: 0 }}>
                    Troubleshooting Steps
                  </p>
                </div>
                <div style={{ display: "grid", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      background: "#dc2626",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: "600"
                    }}>!</div>
                    <span style={{ color: "#dc2626", fontSize: "1rem" }}>Check your internet connection</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      background: "#dc2626",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: "600"
                    }}>@</div>
                    <span style={{ color: "#dc2626", fontSize: "1rem" }}>Verify your email address is correct</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      background: "#dc2626",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: "600"
                    }}>?</div>
                    <span style={{ color: "#dc2626", fontSize: "1rem" }}>Contact support if the problem persists</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <p style={{ fontSize: "0.95rem", color: "#6b7280", margin: 0 }}>
                  Ready to try again?
                </p>
                <button
                  onClick={() => setVerificationStatus('success')}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.75rem 2rem",
                    fontSize: "1rem",
                    fontWeight: "500",
                    borderRadius: "8px",
                    border: "none",
                    background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 8px rgba(220, 38, 38, 0.3)"
                  }}
                  
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      maxHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "3rem",
        width: "100%",
        maxWidth: "1000px",
        border: "1px solid #e2e8f0"
      }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ 
            fontSize: "2.5rem", 
            fontWeight: "800", 
            color: "#111827",
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Email Verification
          </h1>
        </div>
        
        {renderContent()}
        
        {verificationStatus !== 'loading' && (
          <div style={{
            borderTop: "1px solid #e5e7eb",
            marginTop: "3rem",
            paddingTop: "2rem",
            textAlign: "center",
            fontSize: "0.9rem",
            color: "#6b7280"
          }}>
            <p style={{ margin: 0 }}>
              Need help? Contact our{' '}
              <a 
                href="#" 
                style={{ 
                  color: "#2563eb", 
                  textDecoration: "none",
                  fontWeight: "500",
                  transition: "color 0.2s ease"
                }}
               
              >
                support team
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage;