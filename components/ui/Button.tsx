/**
 * Reusable Button component with TypeScript props
 */

import React from "react";

/**
 * Button variant types
 */
type ButtonVariant = "primary" | "secondary" | "danger" | "outline" | "ghost";

/**
 * Button size types
 */
type ButtonSize = "sm" | "md" | "lg";

/**
 * Button component props
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * Get variant-specific Tailwind classes
 */
function getVariantClasses(variant: ButtonVariant): string {
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300",
    secondary:
      "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300",
    outline:
      "border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500 disabled:border-green-300 disabled:text-green-300",
    ghost:
      "text-green-600 hover:bg-green-50 focus:ring-green-500 disabled:text-green-300",
  };

  return variants[variant];
}

/**
 * Get size-specific Tailwind classes
 */
function getSizeClasses(size: ButtonSize): string {
  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return sizes[size];
}

/**
 * Button component
 */
export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  disabled,
  children,
  className = "cursor-pointer",
  ...props
}) => {
  const baseClasses =
    "font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ";

  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  const widthClasses = fullWidth ? "w-full" : "";

  const combinedClasses =
    `${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`.trim();

  return (
    <button
      className={combinedClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Memuat...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
