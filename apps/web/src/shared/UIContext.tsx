import React, { createContext, useContext, useState, ReactNode } from "react";
import Alert from "./Alert";
import ConfirmModal from "./ConfirmModal";

type ConfirmOptions = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
};

type UIContextType = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  alert: (type: "success" | "danger" | "warning" | "info", message: string) => void;
};

const UIContext = createContext<UIContextType | null>(null);

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
};

export function UIProvider({ children }: { children: ReactNode }) {
  // === Confirm modal state ===
  const [confirmState, setConfirmState] = useState<{
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  // === Alert state ===
  const [alerts, setAlerts] = useState<
    { id: number; type: "success" | "danger" | "warning" | "info"; message: string }[]
  >([]);

  const confirm = (options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ options, resolve });
    });
  };

  const alert = (type: "success" | "danger" | "warning" | "info", message: string) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 3000); // auto-dismiss after 3s
  };

  return (
    <UIContext.Provider value={{ confirm, alert }}>
      {children}

      {/* Alerts */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
        {alerts.map((a) => (
          <Alert
            key={a.id}
            type={a.type}
            message={a.message}
            onClose={() => setAlerts((prev) => prev.filter((x) => x.id !== a.id))}
          />
        ))}
      </div>

      {/* Confirm Modal */}
      {confirmState && (
        <ConfirmModal
          {...confirmState.options}
          onCancel={() => {
            confirmState.resolve(false);
            setConfirmState(null);
          }}
          onConfirm={() => {
            confirmState.resolve(true);
            setConfirmState(null);
          }}
        />
      )}
    </UIContext.Provider>
  );
}
