"use client";
import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
  return (
    <Toaster
      toastOptions={{
        style: {
          background: "#333",
          color: "#fff",
        },
        success: {
          style: {
            background: "#4caf50",
            color: "#fff",
          },
        },
        error: {
          style: {
            background: "#f44336",
            color: "#fff",
          },
        },
      }}
    />
  );
};

export default ToasterProvider;
