interface BadgeChipProps {
  badge: string;
  size?: "sm" | "md";
}

const badgeStyles: Record<string, string> = {
  "Top Helper": "badge-gold",
  "Science Expert": "badge-emerald",
  "Maths Master": "badge-teal",
  "Physics Pro": "badge-violet",
};

const badgeIcons: Record<string, string> = {
  "Top Helper": "🏆",
  "Science Expert": "🔬",
  "Maths Master": "📐",
  "Physics Pro": "⚡",
};

export default function BadgeChip({ badge, size = "sm" }: BadgeChipProps) {
  const style = badgeStyles[badge] || "badge-violet";
  const icon = badgeIcons[badge] || "⭐";
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${style} ${sizeClass}`}
    >
      <span>{icon}</span>
      {badge}
    </span>
  );
}
