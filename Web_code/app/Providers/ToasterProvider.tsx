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
            background: "#fff",
            color: "#000a03",
          },
        },
        error: {
          style: {
            background: "#fff",
            color: "#f44336",
          },
        },
      }}
    />
  );
};

export default ToasterProvider;
