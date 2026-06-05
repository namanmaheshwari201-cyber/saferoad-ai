import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Medal, Trophy } from "lucide-react";
import { motion } from "motion/react";
import BadgeChip from "../components/BadgeChip";
import PointsDisplay from "../components/PointsDisplay";
import { leaderboard } from "../data/sampleData";

const rankStyles = [
  {
    icon: <Crown className="w-4 h-4 text-yellow-500" />,
    bg: "bg-yellow-500/10 border-yellow-500/30",
    ring: "ring-yellow-500/30",
  },
  {
    icon: <Medal className="w-4 h-4 text-slate-400" />,
    bg: "bg-slate-500/5 border-slate-500/20",
    ring: "ring-slate-400/30",
  },
  {
    icon: <Medal className="w-4 h-4 text-amber-600" />,
    bg: "bg-amber-500/5 border-amber-500/20",
    ring: "ring-amber-600/30",
  },
];

export default function LeaderboardPage() {
  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-display font-bold text-2xl flex items-center gap-2 justify-center">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Top students ranked by contribution points
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8 items-end">
        {[top3[1], top3[0], top3[2]].map((user, podiumIdx) => {
          if (!user) return null;
          const originalIdx = user.rank - 1;
          const heights = ["h-28", "h-36", "h-24"];
          const style = rankStyles[originalIdx] || rankStyles[2];

          return (
            <motion.div
              key={user.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: podiumIdx * 0.1, duration: 0.4 }}
              className="flex flex-col items-center"
              data-ocid={`leaderboard.item.${originalIdx + 1}`}
            >
              <Avatar className={`w-12 h-12 ring-2 ${style.ring} mb-2`}>
                <AvatarFallback className="font-display font-bold text-sm bg-primary/10 text-primary">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              <p className="font-display font-semibold text-xs text-center truncate w-full px-1">
                {user.name}
              </p>
              <PointsDisplay points={user.points} size="sm" />
              <div
                className={`w-full rounded-t-xl border ${style.bg} ${heights[podiumIdx]} mt-2 flex items-start justify-center pt-2`}
              >
                {style.icon}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full Table */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base">All Rankings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {leaderboard.map((user, idx) => {
              const rankStyle = rankStyles[idx] || null;
              return (
                <motion.div
                  key={user.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors"
                  data-ocid={`leaderboard.item.${idx + 1}`}
                >
                  <div className="w-8 text-center">
                    {rankStyle ? (
                      <span>{rankStyle.icon}</span>
                    ) : (
                      <span className="font-display font-bold text-sm text-muted-foreground">
                        {user.rank}
                      </span>
                    )}
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.className}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {user.badges.map((b) => (
                        <BadgeChip key={b} badge={b} size="sm" />
                      ))}
                      {user.badges.length === 0 && (
                        <span className="text-xs text-muted-foreground">
                          No badges yet
                        </span>
                      )}
                    </div>
                  </div>
                  <PointsDisplay points={user.points} size="md" />
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* How to earn points */}
      <Card className="border-border/60 mt-5 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base">
            How to Earn Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { action: "Ask a question", pts: "+2 pts" },
              { action: "Answer a question", pts: "+5 pts" },
              { action: "Answer accepted", pts: "+10 pts" },
              { action: "Upload notes", pts: "+8 pts" },
              { action: "Get upvoted", pts: "+1 pt" },
              { action: "Complete a quiz", pts: "+5 pts" },
            ].map((item) => (
              <div
                key={item.action}
                className="flex items-center justify-between p-2 rounded-lg bg-background/60 border border-border/60"
              >
                <span className="text-xs text-muted-foreground">
                  {item.action}
                </span>
                <span className="text-xs font-bold points-text">
                  {item.pts}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
