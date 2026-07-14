import { createContext, useCallback, useMemo, useState } from "react";

export const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, tone = "success") => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, tone }]);
      setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      success: (m) => push(m, "success"),
      error: (m) => push(m, "error"),
      info: (m) => push(m, "info"),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="no-print fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-80">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`rounded-xl px-4 py-3 text-sm font-medium shadow-card border animate-[fadeIn_.15s_ease-out] ${
              t.tone === "error"
                ? "bg-cardio-50 border-cardio-400/30 text-cardio-600"
                : t.tone === "info"
                ? "bg-pulse-50 border-pulse-400/30 text-pulse-600"
                : "bg-white border-pulse-100 text-pulse-600"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
