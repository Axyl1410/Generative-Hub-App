"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type GradientTextProps = {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  colors?: string[];
};

export function GradientText({
  children,
  as: Component = "p",
  className,
  duration = 3, // Thời gian chạy hiệu ứng
  colors = ["#ff7eb3", "#ff758c", "#ff7eb3", "#ff758c"],
}: GradientTextProps) {
  return (
    <Component
      className={cn(
        "relative inline-block text-transparent bg-clip-text animate-gradient",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
        backgroundSize: "200% auto",
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </Component>
  );
}
