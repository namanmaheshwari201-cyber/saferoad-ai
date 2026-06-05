import { Flame } from "lucide-react";

interface PointsDisplayProps {
  points: number;
  size?: "sm" | "md" | "lg";
}

export default function PointsDisplay({
  points,
  size = "sm",
}: PointsDisplayProps) {
  const sizeMap = {
    sm: { icon: "w-3 h-3", text: "text-xs", wrapper: "gap-0.5" },
    md: { icon: "w-4 h-4", text: "text-sm", wrapper: "gap-1" },
    lg: { icon: "w-5 h-5", text: "text-base", wrapper: "gap-1" },
  };
  const s = sizeMap[size];

  return (
    <span
      className={`inline-flex items-center ${s.wrapper} points-text font-semibold`}
    >
      <Flame className={s.icon} fill="currentColor" />
      <span className={s.text}>{points} pts</span>
    </span>
  );
}
