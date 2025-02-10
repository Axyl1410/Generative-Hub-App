"use client";

import { useTheme } from "@/components/theme/theme-context";
import DottedMap from "dotted-map";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

// Move map creation outside component to avoid recreation on each render
const createInitialMap = (isDark: boolean) => {
  const map = new DottedMap({ height: 100, grid: "diagonal" });
  return map.getSVG({
    radius: 0.22,
    color: isDark ? "#FFFFFF40" : "#00000040",
    shape: "circle",
    backgroundColor: isDark ? "#15171b" : "#f4f4f4",
  });
};

export function WorldMap({ dots = [], lineColor = "#0ea5e9" }: MapProps) {
  const { theme } = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgMap, setSvgMap] = useState("");

  // Memoize projectPoint function
  const projectPoint = useMemo(() => {
    return (lat: number, lng: number) => {
      const x = (lng + 180) * (800 / 360);
      const y = (90 - lat) * (400 / 180);
      return { x, y };
    };
  }, []);

  // Memoize createCurvedPath function
  const createCurvedPath = useMemo(() => {
    return (start: { x: number; y: number }, end: { x: number; y: number }) => {
      const midX = (start.x + end.x) / 2;
      const midY = Math.min(start.y, end.y) - 50;
      return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
    };
  }, []);

  useEffect(() => {
    setSvgMap(createInitialMap(theme === "dark"));
  }, [theme]);

  // Memoize dots calculations
  const dotElements = useMemo(() => {
    return dots.map((dot, i) => {
      const startPoint = projectPoint(dot.start.lat, dot.start.lng);
      const endPoint = projectPoint(dot.end.lat, dot.end.lng);

      return {
        path: createCurvedPath(startPoint, endPoint),
        startPoint,
        endPoint,
        index: i,
      };
    });
  }, [dots, projectPoint, createCurvedPath]);

  return (
    <div className="relative aspect-[2/1] w-full rounded-lg bg-background font-sans dark:bg-background-dark">
      <Image
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="pointer-events-none h-full w-full select-none [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]"
        alt="world map"
        height={495}
        width={1056}
        priority
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
      >
        {dotElements.map(({ path, startPoint, endPoint, index }) => (
          <g key={`path-group-${index}`}>
            <motion.path
              d={path}
              fill="none"
              stroke="url(#path-gradient)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1,
                delay: 0.5 * index,
                ease: "easeOut",
              }}
            />
            <>
              {[startPoint, endPoint].map((point, pointIndex) => (
                <g key={`point-${pointIndex}`}>
                  <circle cx={point.x} cy={point.y} r="2" fill={lineColor} />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="2"
                    fill={lineColor}
                    opacity="0.5"
                  >
                    <animate
                      attributeName="r"
                      from="2"
                      to="8"
                      dur="1.5s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.5"
                      to="0"
                      dur="1.5s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              ))}
            </>
          </g>
        ))}

        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
