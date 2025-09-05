import React from "react";

type AlertProps = {
  type: "success" | "danger" | "warning" | "info";
  message: string;
  onClose?: () => void;
};

export default function Alert({ type, message, onClose }: AlertProps) {
  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show`}
      role="alert"
    >
      {message}
      {onClose && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        />
      )}
    </div>
  );
}
