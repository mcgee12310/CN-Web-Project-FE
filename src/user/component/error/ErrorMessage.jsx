import React from "react";

export default function ErrorMessage({ message, field }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      aria-live="assertive"
      className={
        field ? "text-sm text-red-600 mt-1" : "text-red-700 font-medium mb-2"
      }
    >
      {message}
    </p>
  );
}
