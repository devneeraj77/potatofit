"use client";

import React from "react";
import Image from "next/image";

export interface UchitatvamLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?: "dark" | "light" | string;
  subtext?: string;
}

export default function PotatoFitLogo({
  className = "",
  size = "md",
  showText = true,
  variant = "dark",
  subtext,
}: UchitatvamLogoProps) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textMap = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const dimensionMap = {
    sm: 32,
    md: 36,
    lg: 48,
    xl: 64,
  };

  // Ensure high contrast in both dark and light contexts
  const textColor =
    variant === "pure-white"
      ? "text-white"
      : variant === "light"
      ? "text-[#121815] dark:text-[#CBD2C7]"
      : "text-[#121815] dark:text-white";

  const subtextColor =
    variant === "pure-white"
      ? "text-white/80"
      : "text-[#7A5A00] dark:text-[#f7fe72]";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className={`relative ${sizeMap[size]} shrink-0 flex items-center justify-center`}>
        <Image
          src="/universal-uchi-logo.svg"
          alt="Uchitatvam"
          width={dimensionMap[size]}
          height={dimensionMap[size]}
          priority
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain"
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <span className={`font-bold uppercase tracking-[0.15em] font-heading leading-tight ${textColor} ${textMap[size]}`}>
            Uchitatvam
          </span>
          {subtext && (
            <span
              className={`font-semibold uppercase tracking-[0.24em] font-mono leading-none mt-0.5 ${
                size === "sm" ? "text-[8px]" : size === "md" ? "text-[9px]" : "text-[10px]"
              } ${subtextColor}`}
            >
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export { PotatoFitLogo as UchitatvamLogo };
