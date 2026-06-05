import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "card" | "text" | "avatar" | "list" | "page";
  count?: number;
}

const SKELETON_KEYS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted/60", className)} />
  );
}

function CardSkeleton({ id }: { id: string }) {
  return (
    <div className="glass-card p-6 space-y-4" key={id}>
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-3 w-24" />
        </div>
      </div>
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-4/5" />
      <SkeletonBlock className="h-4 w-3/5" />
      <div className="flex gap-2">
        <SkeletonBlock className="h-6 w-16 rounded-full" />
        <SkeletonBlock className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

function TextSkeleton() {
  return (
    <div className="space-y-2">
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-5/6" />
      <SkeletonBlock className="h-4 w-4/6" />
    </div>
  );
}

function AvatarSkeleton() {
  return <SkeletonBlock className="h-10 w-10 rounded-full" />;
}

function ListSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-3">
      {SKELETON_KEYS.slice(0, count).map((k) => (
        <div key={k} className="flex items-center gap-3 p-3 glass-card">
          <SkeletonBlock className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-4 w-40" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
          <SkeletonBlock className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <SkeletonBlock className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SKELETON_KEYS.slice(0, 6).map((k) => (
          <CardSkeleton key={k} id={k} />
        ))}
      </div>
    </div>
  );
}

export function LoadingSkeleton({
  variant = "card",
  count = 3,
  className,
}: LoadingSkeletonProps) {
  if (variant === "text") return <TextSkeleton />;
  if (variant === "avatar") return <AvatarSkeleton />;
  if (variant === "list") return <ListSkeleton count={count} />;
  if (variant === "page") return <PageSkeleton />;

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className,
      )}
    >
      {SKELETON_KEYS.slice(0, count).map((k) => (
        <CardSkeleton key={k} id={k} />
      ))}
    </div>
  );
}

export default LoadingSkeleton;
