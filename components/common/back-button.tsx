"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface BackButtonProps {
  text?: string;
  defaultRoute?: string;
  className?: string;
  href?: string;
  [key: string]: unknown;
}

const BackButton: React.FC<BackButtonProps> = ({
  text = "Back",
  defaultRoute = "/",
  className,
  href,
  ...props
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBackClick = () => {
    const rootPath = "/";

    if (pathname !== rootPath && window.history.length > 1) router.back();
    else router.push(defaultRoute);
  };

  return (
    <button
      onClick={href ? () => router.push(href) : handleBackClick}
      className={cn("flex items-center hover:underline", className)}
      {...props}
    >
      <ArrowLeft size={16} />
      <p>{text}</p>
    </button>
  );
};

export default BackButton;
