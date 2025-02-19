"use client";

import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
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
    <>
      {href ? (
        <Link href={href} {...props}>
          <button
            className={cn(
              "flex items-center rounded-md bg-[#ebe9e9] px-[1rem] py-[0.25rem] text-base hover:bg-[#adadad] hover:underline dark:text-black",
              className
            )}
          >
            <ArrowLeft size={16} />
            <p>{text}</p>
          </button>
        </Link>
      ) : (
        <button
          onClick={handleBackClick}
          className={cn(
            "flex items-center rounded-md bg-[#ebe9e9] px-[1rem] py-[0.25rem] text-base hover:bg-[#adadad] hover:underline dark:text-black",
            className
          )}
          {...props}
        >
          <ArrowLeft size={16} />
          <p>{text}</p>
        </button>
      )}
    </>
  );
};

export default BackButton;
