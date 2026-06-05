import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: bigint | number): string {
  const ms =
    typeof timestamp === "bigint" ? Number(timestamp) / 1_000_000 : timestamp;
  const date = new Date(ms);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export type TrustLevel = "new" | "rising" | "trusted" | "elite" | "legendary";

export function trustScoreLevel(score: bigint | number): TrustLevel {
  const n = typeof score === "bigint" ? Number(score) : score;
  if (n < 10) return "new";
  if (n < 30) return "rising";
  if (n < 60) return "trusted";
  if (n < 90) return "elite";
  return "legendary";
}

export function trustScoreColor(score: bigint | number): string {
  const level = trustScoreLevel(score);
  const map: Record<TrustLevel, string> = {
    new: "text-muted-foreground",
    rising: "text-secondary",
    trusted: "text-accent",
    elite: "text-primary",
    legendary: "text-chart-2",
  };
  return map[level];
}

export function badgeIcon(badgeName: string): string {
  const icons: Record<string, string> = {
    "Verified Creator": "✓",
    "Startup Leader": "🚀",
    "Top Mentor": "🎓",
    "Elite Designer": "🎨",
    "AI Builder": "🤖",
    "Top Helper": "🌟",
    "Science Expert": "🔬",
    "Maths Master": "📐",
  };
  return icons[badgeName] ?? "🏆";
}

export function formatCurrency(amount: bigint | number): string {
  const n = typeof amount === "bigint" ? Number(amount) : amount;
  return formatINR(n);
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
