// src/components/ui/button.jsx
import React from "react";
import clsx from "clsx";

export function Button({ className, children, ...props }) {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded-lg font-medium bg-pink-500 text-white hover:bg-pink-600 transition",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
