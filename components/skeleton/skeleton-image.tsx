"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface SkeletonImageProps {
  src: string;
  height?: string;
  width?: string;
  className?: string;
  isPriority?: boolean;
}

const SkeletonImage: React.FC<SkeletonImageProps> = ({
  src,
  height = "16rem",
  width = "100%",
  className = "",
  isPriority = false,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [pulsing, setPulsing] = useState(true);

  useEffect(() => {
    if (!imageLoading) {
      const timer = setTimeout(() => setPulsing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [imageLoading]);

  const imageLoaded = () => {
    setImageLoading(false);
  };

  return (
    <div
      className={cn(
        `overflow-hidden bg-[#ccc] shadow-sm`,
        pulsing ? "animate-pulse" : "",
        className
      )}
      style={{ width }}
    >
      <motion.div
        initial={{ height: height, opacity: 0 }}
        animate={{
          height: imageLoading ? height : "auto",
          opacity: imageLoading ? 0 : 1,
        }}
        transition={{
          height: { delay: 0, duration: 0.4 },
          opacity: { delay: 0.5, duration: 0.4 },
        }}
      >
        <Image
          alt=""
          onLoad={imageLoaded}
          src={src.trimStart()}
          fill
          className={cn("static object-cover", className)}
          {...(isPriority && { priority: true })}
        />
      </motion.div>
    </div>
  );
};
export default SkeletonImage;
