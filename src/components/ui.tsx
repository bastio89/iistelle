"use client";

import { X, Star } from "lucide-react";
import { STAGES, Stage, JOB_STATUS_META, JobStatus } from "@/lib/types";

// ============================================
// Design Engineering Polish - Emil Kowalski
// Key: Specific properties, not "all"
// ============================================

/* Badge Components */
export function StageBadge({ stage }: { stage: Stage }) {
  const meta = STAGES.find((s) => s.key === stage)!;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-transform ${meta.color} badge-pop`}
    >
      {meta.label}
    </span>
  );
}

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const meta = JOB_STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-transform ${meta.color} badge-pop`}
    >
      {meta.label}
    </span>
  );
}

/* Rating Stars with Hover Animation */
export function RatingStars({
  value,
  onChange,
  size = 16,
}: {
  value: number | null;
  onChange?: (v: number) => void;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(i)}
          className={`transition-transform ${onChange ? "cursor-pointer hover:scale-110 active:scale-95" : "cursor-default"}`}
        >
          <Star
            width={size}
            height={size}
            className={`transition-colors duration-150 ${
              value && i <= value
                ? "fill-amber-400 text-amber-400"
                : "text-petrol-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/* Avatar with Hover Effect */
export function Avatar({
  name,
  size = "md",
  className = "",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  const sizeClasses =
    size === "lg"
      ? "h-14 w-14 text-lg"
      : size === "sm"
        ? "h-7 w-7 text-[10px]"
        : "h-9 w-9 text-xs";

  return (
    <div
      className={`avatar-hover flex shrink-0 items-center justify-center rounded-full bg-petrol-100 font-bold text-petrol-700 ${sizeClasses} ${className}`}
    >
      {initials}
    </div>
  );
}

/* Modal with Scale Animation */
export function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-petrol-950/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      style={{ animation: "fadeIn 200ms ease-out" }}
    >
      <div
        className={`card mt-10 w-full ${wide ? "max-w-2xl" : "max-w-lg"} p-6`}
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "scaleInSpring 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-petrol-900">{title}</h3>
          <button
            onClick={onClose}
            className="interactive rounded-lg p-1.5 text-petrol-400 hover:bg-petrol-50 hover:text-petrol-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* Empty State with Subtle Animation */
export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div
      className="card flex flex-col items-center justify-center px-6 py-14 text-center"
      style={{ animation: "fadeInUp 300ms ease-out" }}
    >
      <p className="font-semibold text-petrol-700">{title}</p>
      {hint && <p className="mt-1 text-sm text-petrol-400">{hint}</p>}
    </div>
  );
}

/* Stat Card with Number Animation */
export function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-petrol-400">
        {label}
      </p>
      <p
        className={`mt-2 text-3xl font-bold transition-colors ${accent ? "text-coral-500" : "text-petrol-900"}`}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-petrol-400">{sub}</p>}
    </div>
  );
}

/* Page Header with Subtle Animation */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1
          className="text-2xl font-bold text-petrol-900"
          style={{ animation: "fadeInUp 200ms ease-out" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-1 text-sm text-petrol-500"
            style={{ animation: "fadeInUp 200ms ease-out 50ms both" }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

/* Date Formatting */
export function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(d: string | Date) {
  return new Date(d).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}