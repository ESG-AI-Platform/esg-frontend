import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 touch-manipulation select-none";

  const variantClasses = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm min-h-[40px]",
    md: "px-4 py-2 text-base min-h-[44px]",
    lg: "px-6 py-3 text-lg min-h-[48px]",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? <span className="mr-2">Loading...</span> : null}
      {children}
    </button>
  );
};
