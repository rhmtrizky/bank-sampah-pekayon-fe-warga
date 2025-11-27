/**
 * Reusable Card component with TypeScript props
 */

import React from "react";

/**
 * Card component props
 */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
}

/**
 * Get padding classes based on size
 */
function getPaddingClasses(padding: CardProps["padding"]): string {
  const paddings: Record<Exclude<CardProps["padding"], undefined>, string> = {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return paddings[padding ?? "md"];
}

/**
 * Get shadow classes based on size
 */
function getShadowClasses(shadow: CardProps["shadow"]): string {
  const shadows: Record<Exclude<CardProps["shadow"], undefined>, string> = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };

  return shadows[shadow ?? "md"];
}

/**
 * Card component
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
  shadow = "md",
  hover = false,
  onClick,
}) => {
  const baseClasses = "bg-white rounded-lg border border-gray-200";
  const paddingClasses = getPaddingClasses(padding);
  const shadowClasses = getShadowClasses(shadow);
  const hoverClasses = hover
    ? "hover:shadow-xl transition-shadow duration-200 cursor-pointer"
    : "";
  const clickableClasses = onClick ? "cursor-pointer" : "";

  const combinedClasses =
    `${baseClasses} ${paddingClasses} ${shadowClasses} ${hoverClasses} ${clickableClasses} ${className}`.trim();

  return (
    <div className={combinedClasses} onClick={onClick}>
      {children}
    </div>
  );
};

/**
 * Card header component
 */
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`border-b border-gray-200 pb-3 mb-3 ${className}`}>
      {children}
    </div>
  );
};

/**
 * Card title component
 */
interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = "",
}) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

/**
 * Card body component
 */
interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = "",
}) => {
  return <div className={className}>{children}</div>;
};

/**
 * Card footer component
 */
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`border-t border-gray-200 pt-3 mt-3 ${className}`}>
      {children}
    </div>
  );
};
