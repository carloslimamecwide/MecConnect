import React, { createContext, useContext, useMemo, useState } from "react";
import { Toast } from "../components/Common/Toast";

export type ToastType = "error" | "success" | "info";
export type ToastPosition = "top" | "bottom";

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  position: ToastPosition;
  autoHide: boolean;
  duration: number;
}

interface ToastContextValue {
  showToast: (options: Partial<Omit<ToastState, "visible">> & { message: string }) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ToastState>({
    visible: false,
    message: "",
    type: "info",
    position: "top",
    autoHide: true,
    duration: 2500,
  });

  const showToast: ToastContextValue["showToast"] = (options) => {
    setState((prev) => ({
      ...prev,
      visible: true,
      message: options.message,
      type: options.type ?? prev.type,
      position: options.position ?? prev.position,
      autoHide: options.autoHide ?? prev.autoHide,
      duration: options.duration ?? prev.duration,
    }));
  };

  const hideToast = () => setState((prev) => ({ ...prev, visible: false }));

  const value = useMemo(() => ({ showToast, hideToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast
        visible={state.visible}
        message={state.message}
        type={state.type}
        position={state.position}
        autoHide={state.autoHide}
        duration={state.duration}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
