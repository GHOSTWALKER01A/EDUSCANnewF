// src/components/ui/Button.tsx
import React from "react";

export default function Button({ children, onClick, className = "", ...rest }: any) {
  return (
    <button
      onClick={onClick}
      {...rest}
      className={`px-3 py-2 rounded-md font-medium transition-transform ${className}`}
    >
      {children}
    </button>
  );
}
