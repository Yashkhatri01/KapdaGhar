import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import ToastContainer from "../components/ui/toast/ToastContainer";
import type {
  ToastItem,
  ToastVariant,
} from "../components/ui/toast/types";

type ToastPayload = {
  title: string;
  description?: string;
  duration?: number;
};

type ToastContextType = {
  success: (toast: ToastPayload) => void;
  error: (toast: ToastPayload) => void;
  warning: (toast: ToastPayload) => void;
  info: (toast: ToastPayload) => void;
};

const ToastContext =
  createContext<ToastContextType | null>(null);

const MAX_TOASTS = 4;

export function ToastProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [toasts, setToasts] =
    useState<ToastItem[]>([]);

  function removeToast(id: string) {

    setToasts((prev) =>
      prev.filter((t) => t.id !== id)
    );

  }

  function addToast(
    variant: ToastVariant,
    toast: ToastPayload
  ) {

    const id =
      crypto.randomUUID();

    const newToast: ToastItem = {
      id,
      variant,
      title: toast.title,
      description: toast.description,
      duration:
        toast.duration ?? 4000,
    };

    setToasts((prev) => {

      const updated = [
        ...prev,
        newToast,
      ];

      if (
        updated.length >
        MAX_TOASTS
      ) {

        updated.shift();

      }

      return updated;

    });


  }

  const value = {
  success: (toast: ToastPayload) =>
    addToast("success", toast),

  error: (toast: ToastPayload) =>
    addToast("error", toast),

  warning: (toast: ToastPayload) =>
    addToast("warning", toast),

  info: (toast: ToastPayload) =>
    addToast("info", toast),
};

  return (

    <ToastContext.Provider
      value={value}
    >

      {children}

      <ToastContainer
        toasts={toasts}
        onClose={removeToast}
      />

    </ToastContext.Provider>

  );

}

export function useToast() {

  const context =
    useContext(
      ToastContext
    );

  if (!context) {

    throw new Error(
      "useToast must be used inside ToastProvider."
    );

  }

  return context;

}