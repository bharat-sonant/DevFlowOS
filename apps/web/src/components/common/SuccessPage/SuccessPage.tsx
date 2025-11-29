import React from "react";
import '../SuccessPage/SuccessPage.css'

interface SuccessPageProps {
  title: string;
  message?: string;
  steps?: string[];
  actionText?: string;
  onAction?: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({
  title,
  message,
  steps = [],
  actionText = "OK",
  onAction,
}) => {
  return (
    <div className="success-page">
      {/* Icon + Title */}
      <div className="success-page__left">
        <div className="success-page__icon-container">
          <span className="success-page__icon">✅</span>
        </div>
        <h2 className="success-page__title">{title}</h2>
        {message && <p className="success-page__message">{message}</p>}
      </div>

      {/* Steps */}
      {steps.length > 0 && (
        <div className="success-page__right">
          <div className="success-page__instructions">
            <div className="success-page__instructions-header">
              <div className="success-page__status-dot"></div>
              <p className="success-page__instructions-title">Next Steps</p>
            </div>
            <div className="success-page__steps">
              {steps.map((step, idx) => (
                <div key={idx} className="success-page__step">
                  <div className="success-page__step-number">{idx + 1}</div>
                  <span className="success-page__step-text">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      {onAction && (
        <div className="success-page__footer">
          <button className="success-page__resend-button" onClick={onAction}>
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};

export default SuccessPage;
