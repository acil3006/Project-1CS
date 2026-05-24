import type { AppointmentStatus, DocumentStatus, PrescriptionStatus } from "../types";

export function statusLabel(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function statusClass(status: string) {
  const normalized = status.toUpperCase();

  if (["COMPLETED", "DISPENSED", "VERIFIED", "PUBLISHED", "OK", "RESOLVED", "FINALIZED"].includes(normalized)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (["CONFIRMED", "READY", "ASSIGNED", "IN_PROGRESS"].includes(normalized)) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (["PENDING", "PENDING_VERIFICATION", "UNDER REVIEW", "DRAFT", "NEEDS_CLARIFICATION"].includes(normalized)) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (["LOW", "CRITICAL", "REJECTED", "CANCELLED", "MISSING", "MAINTENANCE REQUIRED"].includes(normalized)) {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

export function appointmentProgress(status: AppointmentStatus) {
  if (status === "PENDING") return 20;
  if (status === "CONFIRMED") return 55;
  if (status === "IN_PROGRESS") return 75;
  if (status === "COMPLETED") return 100;
  return 0;
}

export function canDispense(status: PrescriptionStatus) {
  return status === "ISSUED" || status === "READY";
}

export function documentNeedsReview(status: DocumentStatus) {
  return status === "PENDING_VERIFICATION" || status === "NEEDS_CLARIFICATION";
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}
