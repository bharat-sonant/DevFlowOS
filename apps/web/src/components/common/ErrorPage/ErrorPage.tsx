import React from "react";
import "./ErrorPage.css";

interface ErrorPageProps {
  icon?: string;
  title?: string;
  message: string;
  email?: string;
  steps?: string[];
  actionText?: string;
  onAction?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  icon = "❌",
  title = "Error",
  message,
  email,
  steps = [],
  actionText = "Try Again",
  onAction,
}) => {
  return (
    <div className="error-page">
      {/* Left side */}
      <div className="error-page__left">
        <div className="error-page__icon-container">
          <span className="error-page__icon">{icon}</span>
        </div>
        <h2 className="error-page__title">{title}</h2>
        <p className="error-page__message">
          {message}
          {email && <span className="error-page__email">{email}</span>}
        </p>
      </div>

      {/* Right side */}
      <div className="error-page__right">
        {steps.length > 0 && (
          <div className="error-page__troubleshooting">
            <div className="error-page__troubleshooting-header">
              <div className="error-page__status-dot"></div>
              <p className="error-page__troubleshooting-title">
                Troubleshooting Steps
              </p>
            </div>
            <div className="error-page__steps">
              {steps.map((step, index) => (
                <div key={index} className="error-page__step">
                  <div className="error-page__step-number">!</div>
                  <span className="error-page__step-text">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="error-page__footer">
          <p className="error-page__footer-text">Ready to try again?</p>
          <button onClick={onAction} className="error-page__action-button">
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;