import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

interface VoteButtonsProps {
  votes: number;
  userVote: "up" | "down" | null;
  onVote: (type: "up" | "down") => void;
  layout?: "vertical" | "horizontal";
  ocidPrefix?: string;
}

export default function VoteButtons({
  votes,
  userVote,
  onVote,
  layout = "vertical",
  ocidPrefix = "vote",
}: VoteButtonsProps) {
  const [localVotes, setLocalVotes] = useState(votes);
  const [localUserVote, setLocalUserVote] = useState(userVote);

  const handleVote = (type: "up" | "down") => {
    if (localUserVote === type) {
      // undo vote
      setLocalVotes((v) => (type === "up" ? v - 1 : v + 1));
      setLocalUserVote(null);
    } else {
      const delta = localUserVote
        ? type === "up"
          ? 2
          : -2
        : type === "up"
          ? 1
          : -1;
      setLocalVotes((v) => v + delta);
      setLocalUserVote(type);
    }
    onVote(type);
  };

  const containerClass =
    layout === "vertical"
      ? "flex flex-col items-center gap-1"
      : "flex items-center gap-1";

  return (
    <div className={containerClass}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "w-8 h-8 rounded-lg",
          localUserVote === "up" && "bg-primary/10 text-primary",
        )}
        onClick={() => handleVote("up")}
        data-ocid={`${ocidPrefix}.button`}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
      </Button>
      <span className="text-sm font-semibold tabular-nums min-w-[1.5rem] text-center">
        {localVotes}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "w-8 h-8 rounded-lg",
          localUserVote === "down" && "bg-destructive/10 text-destructive",
        )}
        onClick={() => handleVote("down")}
        data-ocid={`${ocidPrefix}.button`}
      >
        <ThumbsDown className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
