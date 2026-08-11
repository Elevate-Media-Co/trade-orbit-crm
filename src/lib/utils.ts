import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return phone;
}

export function formatDate(value: string | null | undefined, pattern = "dd MMM yyyy") {
  if (!value) return "—";
  return format(parseISO(value), pattern);
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  return format(parseISO(value), "dd MMM yyyy, hh:mm a");
}

export function formatRelative(value: string | null | undefined) {
  if (!value) return "—";
  const date = parseISO(value);
  if (isToday(date)) return `Today, ${format(date, "hh:mm a")}`;
  if (isTomorrow(date)) return `Tomorrow, ${format(date, "hh:mm a")}`;
  if (isYesterday(date)) return `Yesterday, ${format(date, "hh:mm a")}`;
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatPercent(value: number, digits = 0) {
  return `${value.toFixed(digits)}%`;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "").slice(-10);
  if (digits.length < 10) return phone;
  return `${digits.slice(0, 2)}${"X".repeat(6)}${digits.slice(8)}`;
}
