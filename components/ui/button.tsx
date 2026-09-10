"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold tracking-tight rounded-lg transition-all duration-150 ease-in-out select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.985]";

    const variantStyles = {
      primary:
        "bg-[#ED2025] hover:bg-[#D81419] active:bg-[#C01216] text-white shadow-sm hover:shadow focus:ring-[#ED2025]/50 border border-transparent",
      secondary:
        "bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white shadow-sm focus:ring-slate-900/40 border border-transparent",
      outline:
        "bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border border-slate-300 focus:ring-slate-400 shadow-sm",
      ghost:
        "bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-700 focus:ring-slate-400",
      danger:
        "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white focus:ring-red-500 shadow-sm",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs gap-1.5",
      md: "h-12 px-5 text-sm gap-2",
      lg: "h-[50px] px-6 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            isLoading && "cursor-wait",
            className
          )
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
