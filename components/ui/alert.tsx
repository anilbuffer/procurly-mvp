"use client";

import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface AlertProps {
  variant?: "error" | "warning" | "success" | "info";
  title?: string;
  description: React.ReactNode;
  icon?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
  action?: React.ReactNode;
}

export function Alert({
  variant = "error",
  title,
  description,
  icon,
  onDismiss,
  className,
  action,
}: AlertProps) {
  const variantMap = {
    error: {
      bg: "bg-red-50 border-red-200 text-red-900",
      iconColor: "text-[#DC2626]",
      defaultIcon: AlertCircle,
    },
    warning: {
      bg: "bg-amber-50 border-amber-200 text-amber-900",
      iconColor: "text-[#D97706]",
      defaultIcon: AlertTriangle,
    },
    success: {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-900",
      iconColor: "text-[#059669]",
      defaultIcon: CheckCircle2,
    },
    info: {
      bg: "bg-blue-50 border-blue-200 text-blue-900",
      iconColor: "text-blue-600",
      defaultIcon: Info,
    },
  };

  const current = variantMap[variant];
  const IconComponent = current.defaultIcon;

  return (
    <div
      role="alert"
      className={twMerge(
        clsx(
          "p-3.5 rounded-lg border text-sm flex items-start gap-3 transition-all duration-200",
          current.bg,
          className
        )
      )}
    >
      <div className={clsx("shrink-0 mt-0.5", current.iconColor)}>
        {icon || <IconComponent className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-semibold text-xs leading-none mb-1">{title}</h4>}
        <div className="text-xs leading-relaxed text-slate-700">{description}</div>
        {action && <div className="mt-2">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
