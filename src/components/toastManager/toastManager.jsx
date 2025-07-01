"use client";

import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { AlertTriangle, AlertCircle, X, CheckCircle } from "lucide-react";

const ToastManager = () => {
  const [toasts, setToasts] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      window.customToast = {
        success: (message) => addToast({ type: "success", message }),
        error: (message) => addToast({ type: "error", message }),
      };
    }
  }, []);

  const addToast = ({ type, message }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message, visible: true }]);

    setTimeout(() => {
      removeToast(id);
    }, 10000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleCancel = (id) => {
    removeToast(id);
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case "success":
        return "linear-gradient(171.83deg, #D9FFEF -29.53%, #FFFFFF 120.07%)";
      case "error":
        return "linear-gradient(152.05deg, #FFEDED 7.8%, #FFFFFF 97.31%)";
      default:
        return "linear-gradient(201.1deg, #FFF6EE 5.88%, #FFFFFF 133.35%)";
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "success":
        return "#1A9B65";
      case "error":
        return "#FF7171";
      default:
        return "#F77400";
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case "success":
        return "#DAFFF0";
      case "error":
        return "#FFEDE5";
      default:
        return "#FFF3E9";
    }
  };

  if (!isClient) return null; // Prevent SSR hydration mismatch

  return ReactDOM.createPortal(
    <div style={styles.container}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            ...styles.toast,
            background: getBackgroundColor(toast.type),
            color: "#787878",
            border: "2px solid #FFFFFF",
            opacity: toast.visible ? "1" : "0",
            transform: toast.visible ? "translateY(0)" : "translateY(-200px)",
            transition: "transform 0.5s ease-out, opacity 0.5s ease-out",
          }}
        >
          <div
            style={{
              ...styles.iconContainer,
              borderColor: getBorderColor(toast.type),
            }}
          >
            {toast.type === "success" ? (
              <CheckCircle style={{ color: getColor(toast.type) }} size={24} />
            ) : toast.type === "error" ? (
              <AlertTriangle
                style={{ color: getColor(toast.type) }}
                size={24}
              />
            ) : (
              <AlertCircle style={{ color: getColor(toast.type) }} size={24} />
            )}
          </div>

          <div style={styles.content}>
            <h1 style={styles.title}>
              {toast.type === "success"
                ? "Success"
                : toast.type === "error"
                ? "Error"
                : "Warning"}
            </h1>
            <div style={styles.toastMessage}>{toast.message}</div>
          </div>

          <X
            onClick={() => handleCancel(toast.id)}
            size={18}
            color={"#000000"}
            style={styles.cancelButton}
          />
        </div>
      ))}
    </div>,
    document.body
  );
};

const styles = {
  container: {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  toast: {
    padding: "10px 15px",
    paddingRight: "40px",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    minWidth: "200px",
    display: "flex",
    gap: "12px",
    fontWeight: "bold",
    maxWidth: "500px",
    position: "relative",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  title: {
    fontSize: "18px",
    color: "#000000",
  },
  iconContainer: {
    backgroundColor: "#ffffff",
    padding: "12px",
    height: "50px",
    width: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "12px",
    border: "1px solid",
  },
  toastMessage: {
    flex: 1,
    fontWeight: 500,
  },
  cancelButton: {
    cursor: "pointer",
    position: "absolute",
    top: "10px",
    right: "10px",
  },
};

export default ToastManager;
