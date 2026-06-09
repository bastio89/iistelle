"use client";

import { X, Star } from "lucide-react";
import { STAGES, Stage, JOB_STATUS_META, JobStatus } from "@/lib/types";

export function StageBadge({ stage }: { stage: Stage }) {
  const meta = STAGES.find((s) => s.key === stage)!;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.color}`}
    >
      {meta.label}
    </span>
  );
}

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const meta = JOB_STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.color}`}
    >
      {meta.label}
    </span>
  );
}

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
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            width={size}
            height={size}
            className={
              value && i <= value
                ? "fill-amber-400 text-amber-400"
                : "text-petrol-200"
            }
          />
        </button>
      ))}
    </div>
  );
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
  const cls =
    size === "lg"
      ? "h-14 w-14 text-lg"
      : size === "sm"
        ? "h-7 w-7 text-[10px]"
        : "h-9 w-9 text-xs";
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-petrol-100 font-bold text-petrol-700 ${cls}`}
    >
      {initials}
    </div>
  );
}

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
    >
      <div
        className={`card mt-10 w-full ${wide ? "max-w-2xl" : "max-w-lg"} p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-petrol-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-petrol-400 transition hover:bg-petrol-50 hover:text-petrol-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-14 text-center">
      <p className="font-semibold text-petrol-700">{title}</p>
      {hint && <p className="mt-1 text-sm text-petrol-400">{hint}</p>}
    </div>
  );
}

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
        className={`mt-2 text-3xl font-bold ${accent ? "text-coral-500" : "text-petrol-900"}`}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-petrol-400">{sub}</p>}
    </div>
  );
}

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
        <h1 className="text-2xl font-bold text-petrol-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-petrol-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

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
