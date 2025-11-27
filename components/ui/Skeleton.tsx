/**
 * Reusable Skeleton component for loading states
 */

import React from "react";

/**
 * Skeleton component props
 */
interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

/**
 * Get variant classes
 */
function getVariantClasses(variant: SkeletonProps["variant"]): string {
  const variants: Record<
    Exclude<SkeletonProps["variant"], undefined>,
    string
  > = {
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return variants[variant ?? "text"];
}

/**
 * Get animation classes
 */
function getAnimationClasses(animation: SkeletonProps["animation"]): string {
  const animations: Record<
    Exclude<SkeletonProps["animation"], undefined>,
    string
  > = {
    pulse: "animate-pulse",
    wave: "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]",
    none: "",
  };

  return animations[animation ?? "pulse"];
}

/**
 * Skeleton component
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "text",
  width,
  height,
  animation = "pulse",
}) => {
  const baseClasses = "bg-gray-200";
  const variantClasses = getVariantClasses(variant);
  const animationClasses = getAnimationClasses(animation);

  const combinedClasses =
    `${baseClasses} ${variantClasses} ${animationClasses} ${className}`.trim();

  const style: React.CSSProperties = {
    width: width || undefined,
    height: height || undefined,
  };

  return <div className={combinedClasses} style={style} />;
};

/**
 * SkeletonText component for text loading
 */
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? "70%" : "100%"}
        />
      ))}
    </div>
  );
};
