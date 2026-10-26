"use client";

import React from "react";
import Image from "next/image";

interface PotatoFitLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?: "dark" | "light" | string;
}

export default function PotatoFitLogo({
  className = "",
  size = "md",
  showText = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  variant = "dark",
}: PotatoFitLogoProps) {
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

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className={`relative ${sizeMap[size]} shrink-0 flex items-center justify-center`}>
        <Image
          src="/uchitatvam-logo.svg"
          alt="Uchitatvam"
          width={dimensionMap[size]}
          height={dimensionMap[size]}
          priority
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain"
        />
      </div>

      {showText && (
        <span className={`font-bold tracking-tight text-white font-sans ${textMap[size]}`}>
          Uchitatvam
        </span>
      )}
    </div>
  );
}export { PotatoFitLogo as UchitatvamLogo };
