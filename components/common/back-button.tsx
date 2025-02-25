"use client";

import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

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
    <>
      {href ? (
        <Link href={href} {...props}>
          <Button className={className}>
            <ArrowLeft size={16} />
            <p>{text}</p>
          </Button>
        </Link>
      ) : (
        <Button onClick={handleBackClick} className={className} {...props}>
          <ArrowLeft size={16} />
          <p>{text}</p>
        </Button>
      )}
    </>
  );
};

export default BackButton;
