"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const baseStyles = "font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";
  
  const variants = {
    primary: "bg-[#60a5fa] text-black hover:bg-[#1db954] hover:shadow-lg",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-md",
    outline: "border-2 border-gray-200 text-gray-900 hover:border-black hover:bg-black hover:text-white",
  };

  const sizes = {
    sm: "px-6 py-2 text-base",
    md: "px-8 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl",
    lg: "px-12 sm:px-16 py-4 sm:py-5 text-xl sm:text-2xl",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
