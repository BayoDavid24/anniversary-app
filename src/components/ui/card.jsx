// src/components/ui/card.jsx
import React from "react";

export function Card({ className, children }) {
  return <div className={`rounded-2xl shadow bg-white/80 p-4 ${className}`}>{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="mb-2">{children}</div>;
}

export function CardTitle({ children }) {
  return <h2 className="text-lg font-bold">{children}</h2>;
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}
