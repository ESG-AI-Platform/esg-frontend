import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  title,
}) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow ${className}`}
    >
      {title && (
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};
