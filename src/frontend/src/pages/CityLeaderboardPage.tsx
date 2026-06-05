import { Badge } from "@/components/ui/badge";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Crown,
  Flame,
  Medal,
  Minus,
  Search,
  Share2,
  Star,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type TrendDir = "up" | "down" | "flat";
type CityBadge =
  | "Top Performer"
  | "Most Improved"
  | "Rising Star"
  | "Under Watch"
  | null;

interface City {
  rank: number;
  city: string;
  state: string;
  overall: number;
  safety: number;
  infra: number;
  resolution: number;
  roadQuality: number;
  trend: TrendDir;
  trendDelta: number;
  badge: CityBadge;
  streak?: number;
}

const ALL_CITIES: City[] = [
  {
    rank: 1,
    city: "Surat",
    state: "Gujarat",
    overall: 91,
    safety: 93,
    infra: 94,
    resolution: 96,
    roadQuality: 88,
    trend: "up",
    trendDelta: 2,
    badge: "Top Performer",
    streak: 6,
  },
  {
    rank: 2,
    city: "Pune",
    state: "Maharashtra",
    overall: 88,
    safety: 89,
    infra: 87,
    resolution: 91,
    roadQuality: 86,
    trend: "up",
    trendDelta: 1,
    badge: "Top Performer",
  },
  {
    rank: 3,
    city: "Ahmedabad",
    state: "Gujarat",
    overall: 86,
    safety: 85,
    infra: 88,
    resolution: 89,
    roadQuality: 84,
    trend: "flat",
    trendDelta: 0,
    badge: null,
  },
  {
    rank: 4,
    city: "Bhopal",
    state: "Madhya Pradesh",
    overall: 83,
    safety: 82,
    infra: 84,
    resolution: 86,
    roadQuality: 81,
    trend: "up",
    trendDelta: 3,
    badge: "Most Improved",
  },
  {
    rank: 5,
    city: "Hyderabad",
    state: "Telangana",
    overall: 81,
    safety: 80,
    infra: 83,
    resolution: 84,
    roadQuality: 79,
    trend: "up",
    trendDelta: 1,
    badge: null,
  },
  {
    rank: 6,
    city: "Chandigarh",
    state: "Punjab",
    overall: 79,
    safety: 81,
    infra: 78,
    resolution: 82,
    roadQuality: 77,
    trend: "flat",
    trendDelta: 0,
    badge: null,
  },
  {
    rank: 7,
    city: "Bengaluru",
    state: "Karnataka",
    overall: 77,
    safety: 76,
    infra: 79,
    resolution: 80,
    roadQuality: 75,
    trend: "up",
    trendDelta: 2,
    badge: "Rising Star",
  },
  {
    rank: 8,
    city: "Coimbatore",
    state: "Tamil Nadu",
    overall: 75,
    safety: 74,
    infra: 76,
    resolution: 78,
    roadQuality: 73,
    trend: "up",
    trendDelta: 4,
    badge: "Most Improved",
  },
  {
    rank: 9,
    city: "Jaipur",
    state: "Rajasthan",
    overall: 73,
    safety: 72,
    infra: 74,
    resolution: 75,
    roadQuality: 71,
    trend: "down",
    trendDelta: -1,
    badge: null,
  },
  {
    rank: 10,
    city: "Nagpur",
    state: "Maharashtra",
    overall: 71,
    safety: 70,
    infra: 72,
    resolution: 74,
    roadQuality: 69,
    trend: "up",
    trendDelta: 2,
    badge: "Rising Star",
    streak: 3,
  },
  {
    rank: 11,
    city: "Mumbai",
    state: "Maharashtra",
    overall: 68,
    safety: 67,
    infra: 70,
    resolution: 71,
    roadQuality: 65,
    trend: "down",
    trendDelta: -2,
    badge: null,
  },
  {
    rank: 12,
    city: "Chennai",
    state: "Tamil Nadu",
    overall: 66,
    safety: 65,
    infra: 68,
    resolution: 69,
    roadQuality: 63,
    trend: "flat",
    trendDelta: 0,
    badge: null,
  },
  {
    rank: 13,
    city: "Kochi",
    state: "Kerala",
    overall: 64,
    safety: 66,
    infra: 63,
    resolution: 67,
    roadQuality: 62,
    trend: "up",
    trendDelta: 3,
    badge: "Rising Star",
  },
  {
    rank: 14,
    city: "Indore",
    state: "Madhya Pradesh",
    overall: 62,
    safety: 61,
    infra: 63,
    resolution: 65,
    roadQuality: 60,
    trend: "up",
    trendDelta: 1,
    badge: null,
  },
  {
    rank: 15,
    city: "Lucknow",
    state: "Uttar Pradesh",
    overall: 59,
    safety: 58,
    infra: 60,
    resolution: 62,
    roadQuality: 57,
    trend: "down",
    trendDelta: -1,
    badge: null,
  },
  {
    rank: 16,
    city: "Kolkata",
    state: "West Bengal",
    overall: 57,
    safety: 55,
    infra: 58,
    resolution: 60,
    roadQuality: 54,
    trend: "down",
    trendDelta: -3,
    badge: "Under Watch",
  },
  {
    rank: 17,
    city: "Delhi",
    state: "Delhi",
    overall: 54,
    safety: 52,
    infra: 56,
    resolution: 58,
    roadQuality: 50,
    trend: "down",
    trendDelta: -2,
    badge: "Under Watch",
  },
  {
    rank: 18,
    city: "Patna",
    state: "Bihar",
    overall: 51,
    safety: 50,
    infra: 52,
    resolution: 54,
    roadQuality: 48,
    trend: "up",
    trendDelta: 2,
    badge: "Most Improved",
  },
  {
    rank: 19,
    city: "Kanpur",
    state: "Uttar Pradesh",
    overall: 48,
    safety: 47,
    infra: 49,
    resolution: 50,
    roadQuality: 45,
    trend: "down",
    trendDelta: -1,
    badge: null,
  },
  {
    rank: 20,
    city: "Guwahati",
    state: "Assam",
    overall: 45,
    safety: 44,
    infra: 46,
    resolution: 48,
    roadQuality: 43,
    trend: "up",
    trendDelta: 4,
    badge: "Rising Star",
  },
];

const RANK_BY_OPTIONS = [
  "Overall",
  "Safety Score",
  "Infrastructure",
  "Complaint Resolution",
  "Road Quality",
];
const STATES = [
  "All States",
  ...Array.from(new Set(ALL_CITIES.map((c) => c.state))).sort(),
];
const VIEW_OPTIONS: { label: string; max: number }[] = [
  { label: "Top 10", max: 10 },
  { label: "Top 25", max: 25 },
  { label: "All Cities", max: 999 },
];

const ACHIEVEMENTS = [
  {
    city: "Surat",
    badge: "Zero Fatality Week",
    icon: Star,
    color: "text-amber-400",
    bg: "bg-amber-950/40 border-amber-800/30",
  },
  {
    city: "Pune",
    badge: "100% Complaint Resolution",
    icon: Trophy,
    color: "text-emerald-400",
    bg: "bg-emerald-950/40 border-emerald-800/30",
  },
  {
    city: "Nagpur",
    badge: "Best Night Safety",
    icon: Zap,
    color: "text-blue-400",
    bg: "bg-blue-950/40 border-blue-800/30",
  },
  {
    city: "Coimbatore",
    badge: "Fastest Improvement",
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-950/40 border-orange-800/30",
  },
  {
    city: "Bengaluru",
    badge: "Smart Infrastructure",
    icon: TrendingUp,
    color: "text-purple-400",
    bg: "bg-purple-950/40 border-purple-800/30",
  },
  {
    city: "Kochi",
    badge: "Rising Champion",
    icon: Crown,
    color: "text-pink-400",
    bg: "bg-pink-950/40 border-pink-800/30",
  },
];

const NEWS_FEED = [
  { text: "Coimbatore climbed 4 spots this week", type: "up" },
  { text: "Guwahati fastest riser in Northeast — +4 spots", type: "up" },
  { text: "Surat extends lead at #1 for 6th consecutive season", type: "up" },
  {
    text: "Delhi slipped 2 spots following monsoon complaint surge",
    type: "down",
  },
  { text: "Patna enters top 20 for the first time", type: "up" },
  { text: "Kolkata under watch — 3 consecutive rank drops", type: "down" },
];

function getBadgeStyle(badge: CityBadge) {
  switch (badge) {
    case "Top Performer":
      return "bg-amber-950/60 text-amber-300 border-amber-700/40";
    case "Most Improved":
      return "bg-emerald-950/60 text-emerald-300 border-emerald-700/40";
    case "Rising Star":
      return "bg-blue-950/60 text-blue-300 border-blue-700/40";
    case "Under Watch":
      return "bg-red-950/60 text-red-300 border-red-700/40";
    default:
      return "";
  }
}

function getRankStyle(rank: number) {
  if (rank <= 3) return "text-amber-400 font-black";
  if (rank <= 10) return "text-slate-300 font-bold";
  return "text-muted-foreground font-medium";
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1 w-16 rounded-full bg-muted/30 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-xs text-foreground font-medium w-6">{value}</span>
    </div>
  );
}

const RADAR_DIMS = [
  "Safety",
  "Infrastructure",
  "Resolution",
  "Road Quality",
  "Trend Score",
  "Citizen Rating",
];

function _cityToRadar(c: City) {
  return RADAR_DIMS.map((dim, i) => ({
    subject: dim,
    value: [
      c.safety,
      c.infra,
      c.resolution,
      c.roadQuality,
      Math.min(100, 50 + c.trendDelta * 8),
      c.overall,
    ][i],
  }));
}

export default function CityLeaderboardPage() {
  const [rankBy, setRankBy] = useState("Overall");
  const [stateFilter, setStateFilter] = useState("All States");
  const [search, setSearch] = useState("");
  const [viewMax, setViewMax] = useState(25);
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const [compareA, setCompareA] = useState("Surat");
  const [compareB, setCompareB] = useState("Bengaluru");
  const [daysLeft] = useState(5);

  const sortKey: keyof City = useMemo(() => {
    const map: Record<string, keyof City> = {
      Overall: "overall",
      "Safety Score": "safety",
      Infrastructure: "infra",
      "Complaint Resolution": "resolution",
      "Road Quality": "roadQuality",
    };
    return map[rankBy] ?? "overall";
  }, [rankBy]);

  const filtered = useMemo(() => {
    let cities = [...ALL_CITIES];
    if (stateFilter !== "All States")
      cities = cities.filter((c) => c.state === stateFilter);
    if (search.trim())
      cities = cities.filter((c) =>
        c.city.toLowerCase().includes(search.toLowerCase()),
      );
    cities.sort((a, b) => (b[sortKey] as number) - (a[sortKey] as number));
    return cities
      .slice(0, viewMax)
      .map((c, i) => ({ ...c, displayRank: i + 1 }));
  }, [sortKey, stateFilter, search, viewMax]);

  const top3 = ALL_CITIES.slice(0, 3);
  const cityAData = ALL_CITIES.find((c) => c.city === compareA);
  const cityBData = ALL_CITIES.find((c) => c.city === compareB);

  const winner =
    cityAData && cityBData
      ? cityAData.overall > cityBData.overall
        ? compareA
        : cityBData.overall > cityAData.overall
          ? compareB
          : null
      : null;

  const radarData = RADAR_DIMS.map((dim, i) => ({
    subject: dim,
    [compareA]: cityAData
      ? [
          cityAData.safety,
          cityAData.infra,
          cityAData.resolution,
          cityAData.roadQuality,
          Math.min(100, 50 + cityAData.trendDelta * 8),
          cityAData.overall,
        ][i]
      : 0,
    [compareB]: cityBData
      ? [
          cityBData.safety,
          cityBData.infra,
          cityBData.resolution,
          cityBData.roadQuality,
          Math.min(100, 50 + cityBData.trendDelta * 8),
          cityBData.overall,
        ][i]
      : 0,
  }));

  return (
    <div className="min-h-screen bg-background" data-ocid="leaderboard.page">
      {/* Championship Header */}
      <div className="bg-gradient-to-b from-amber-950/40 to-background border-b border-amber-800/20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-7 h-7 text-amber-400" />
            <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              National City Safety Championship
            </h1>
            <Trophy className="w-7 h-7 text-amber-400" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/30 border border-amber-700/30 text-amber-300 text-xs font-semibold">
            <Star className="w-3 h-3" />
            2024 Road Safety Rankings — Season 3
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* TOP 3 PODIUM */}
        <div
          className="flex items-end justify-center gap-3 sm:gap-6"
          data-ocid="leaderboard.podium_section"
        >
          {/* 2nd place */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-slate-700/60 border-2 border-slate-500 flex items-center justify-center">
              <Medal className="w-6 h-6 text-slate-300" />
            </div>
            <div className="text-center">
              <p className="font-display text-sm font-bold text-foreground">
                {top3[1].city}
              </p>
              <p className="text-xs text-muted-foreground">{top3[1].state}</p>
              <p className="text-lg font-black text-slate-300">
                {top3[1].overall}
              </p>
            </div>
            <div className="w-24 h-20 rounded-t-lg bg-gradient-to-t from-slate-800 to-slate-700 border border-slate-600 flex items-start justify-center pt-2">
              <span className="font-black text-slate-300 text-2xl">2</span>
            </div>
          </div>

          {/* 1st place */}
          <div className="flex flex-col items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />
            <div className="w-14 h-14 rounded-full bg-amber-700/60 border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-900/50">
              <Trophy className="w-7 h-7 text-amber-300" />
            </div>
            <div className="text-center">
              <p className="font-display text-base font-bold text-foreground">
                {top3[0].city}
              </p>
              <p className="text-xs text-muted-foreground">{top3[0].state}</p>
              <p className="text-2xl font-black text-amber-400">
                {top3[0].overall}
              </p>
              {top3[0].streak && (
                <div className="flex items-center justify-center gap-1 text-xs text-amber-300">
                  <Flame className="w-3 h-3" />
                  {top3[0].streak} season streak
                </div>
              )}
            </div>
            <div className="w-28 h-32 rounded-t-lg bg-gradient-to-t from-amber-900/80 to-amber-800/60 border border-amber-600 flex items-start justify-center pt-2">
              <span className="font-black text-amber-300 text-3xl">1</span>
            </div>
          </div>

          {/* 3rd place */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-amber-900/50 border-2 border-amber-700 flex items-center justify-center">
              <Medal className="w-6 h-6 text-amber-600" />
            </div>
            <div className="text-center">
              <p className="font-display text-sm font-bold text-foreground">
                {top3[2].city}
              </p>
              <p className="text-xs text-muted-foreground">{top3[2].state}</p>
              <p className="text-lg font-black text-amber-600">
                {top3[2].overall}
              </p>
            </div>
            <div className="w-24 h-16 rounded-t-lg bg-gradient-to-t from-amber-950/80 to-amber-900/60 border border-amber-800 flex items-start justify-center pt-2">
              <span className="font-black text-amber-600 text-2xl">3</span>
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div
          className="flex flex-wrap gap-3 items-center"
          data-ocid="leaderboard.filter_bar"
        >
          {/* Rank By */}
          <div className="flex items-center gap-1 bg-muted/40 border border-border rounded-lg p-1">
            {RANK_BY_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setRankBy(opt)}
                data-ocid={`leaderboard.rankby.${opt.toLowerCase().replace(/ /g, "_")}`}
                className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                  rankBy === opt
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* State Filter */}
          <div className="relative">
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              data-ocid="leaderboard.state_select"
              className="appearance-none bg-muted/40 border border-border rounded-lg px-3 py-2 text-xs text-foreground pr-8 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-40">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="leaderboard.search_input"
              className="w-full pl-8 pr-3 py-2 bg-muted/40 border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-muted/40 border border-border rounded-lg p-1">
            {VIEW_OPTIONS.map((v) => (
              <button
                key={v.label}
                type="button"
                onClick={() => setViewMax(v.max)}
                data-ocid={`leaderboard.view.${v.label.toLowerCase().replace(/ /g, "_")}`}
                className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMax === v.max
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* RANKINGS TABLE */}
        <div
          className="rounded-xl bg-card border border-border overflow-hidden"
          data-ocid="leaderboard.rankings_table"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground w-12">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    City
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">
                    Overall
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground hidden md:table-cell">
                    Safety
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground hidden lg:table-cell">
                    Infrastructure
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground hidden lg:table-cell">
                    Resolution
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">
                    Trend
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground hidden sm:table-cell">
                    Badge
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((city, idx) => (
                  <>
                    <tr
                      key={city.city}
                      data-ocid={`leaderboard.row.${idx + 1}`}
                      onClick={() =>
                        setExpandedCity(
                          expandedCity === city.city ? null : city.city,
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setExpandedCity(
                            expandedCity === city.city ? null : city.city,
                          );
                        }
                      }}
                      tabIndex={0}
                      className={`border-b border-border/50 cursor-pointer transition-colors ${
                        idx % 2 === 0 ? "bg-card" : "bg-muted/10"
                      } hover:bg-primary/10`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {city.displayRank <= 3 && (
                            <span className="text-xs">
                              {["🥇", "🥈", "🥉"][city.displayRank - 1]}
                            </span>
                          )}
                          <span
                            className={`text-sm ${getRankStyle(city.displayRank)}`}
                          >
                            {city.displayRank}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {city.city}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {city.state}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-base font-black ${
                            city.overall >= 80
                              ? "text-emerald-400"
                              : city.overall >= 65
                                ? "text-amber-400"
                                : "text-red-400"
                          }`}
                        >
                          {city.overall}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <ScoreBar value={city.safety} color="#3b82f6" />
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <ScoreBar value={city.infra} color="#a855f7" />
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <ScoreBar value={city.resolution} color="#22c55e" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {city.trend === "up" && (
                            <ArrowUp className="w-4 h-4 text-emerald-400" />
                          )}
                          {city.trend === "down" && (
                            <ArrowDown className="w-4 h-4 text-red-400" />
                          )}
                          {city.trend === "flat" && (
                            <Minus className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span
                            className={`text-xs font-bold ${
                              city.trend === "up"
                                ? "text-emerald-400"
                                : city.trend === "down"
                                  ? "text-red-400"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {city.trendDelta !== 0
                              ? `${city.trendDelta > 0 ? "+" : ""}${city.trendDelta}`
                              : "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {city.badge && (
                          <Badge
                            className={`text-xs border ${getBadgeStyle(city.badge)}`}
                          >
                            {city.badge}
                          </Badge>
                        )}
                      </td>
                    </tr>
                    {expandedCity === city.city && (
                      <tr
                        key={`${city.city}-expanded`}
                        className="bg-muted/20 border-b border-border"
                      >
                        <td colSpan={8} className="px-6 py-4">
                          <div className="grid sm:grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                                Score Breakdown
                              </p>
                              <div className="space-y-2">
                                {[
                                  {
                                    label: "Safety",
                                    value: city.safety,
                                    color: "#3b82f6",
                                  },
                                  {
                                    label: "Infrastructure",
                                    value: city.infra,
                                    color: "#a855f7",
                                  },
                                  {
                                    label: "Complaint Resolution",
                                    value: city.resolution,
                                    color: "#22c55e",
                                  },
                                  {
                                    label: "Road Quality",
                                    value: city.roadQuality,
                                    color: "#f97316",
                                  },
                                ].map((s) => (
                                  <div key={s.label}>
                                    <div className="flex justify-between text-xs mb-0.5">
                                      <span className="text-muted-foreground">
                                        {s.label}
                                      </span>
                                      <span className="font-bold text-foreground">
                                        {s.value}
                                      </span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
                                      <div
                                        className="h-full rounded-full"
                                        style={{
                                          width: `${s.value}%`,
                                          background: s.color,
                                        }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                                Active Initiatives
                              </p>
                              <ul className="space-y-1">
                                {[
                                  "Smart traffic signal rollout",
                                  "Pothole repair drive (Phase 2)",
                                  "Night patrol enhancement",
                                  "Citizen feedback integration",
                                ].map((init) => (
                                  <li
                                    key={init}
                                    className="flex items-start gap-1.5 text-xs text-muted-foreground"
                                  >
                                    <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary" />
                                    {init}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                                Season Performance
                              </p>
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">
                                    Season rank change
                                  </span>
                                  <span
                                    className={`font-bold ${city.trend === "up" ? "text-emerald-400" : city.trend === "down" ? "text-red-400" : "text-muted-foreground"}`}
                                  >
                                    {city.trendDelta > 0
                                      ? `+${city.trendDelta}`
                                      : city.trendDelta}{" "}
                                    spots
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">
                                    Complaints handled
                                  </span>
                                  <span className="font-bold text-foreground">
                                    {(
                                      city.resolution * 120 +
                                      1000
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">
                                    Roads inspected
                                  </span>
                                  <span className="font-bold text-foreground">
                                    {(city.infra * 48 + 200).toLocaleString()}
                                  </span>
                                </div>
                                {city.streak && (
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                                    <span className="text-xs text-amber-300 font-semibold">
                                      {city.streak}-season improvement streak
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* HEAD-TO-HEAD */}
        <section data-ocid="leaderboard.head_to_head_section">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h2 className="font-display text-base font-semibold text-foreground">
              Head-to-Head Challenge
            </h2>
          </div>
          <div className="rounded-xl bg-card border border-border p-5">
            <div className="grid sm:grid-cols-3 gap-6 items-center">
              {/* City A selector */}
              <div className="text-center">
                <div className="relative inline-block mb-3">
                  <select
                    value={compareA}
                    onChange={(e) => setCompareA(e.target.value)}
                    data-ocid="leaderboard.compare_city_a_select"
                    className="appearance-none bg-primary/20 border border-primary/40 rounded-xl px-6 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {ALL_CITIES.map((c) => (
                      <option key={c.city} value={c.city}>
                        {c.city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-4xl font-black text-primary">
                  {cityAData?.overall ?? "—"}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {cityAData?.state}
                </div>
                {winner === compareA && (
                  <Badge className="mt-2 bg-amber-900/50 text-amber-300 border-amber-700/50">
                    🏆 Winner
                  </Badge>
                )}
              </div>

              {/* Radar chart */}
              <div>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#64748b", fontSize: 10 }}
                    />
                    <Radar
                      name={compareA}
                      dataKey={compareA}
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name={compareB}
                      dataKey={compareB}
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: 8,
                        fontSize: 11,
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-0.5 bg-blue-500 inline-block" />
                    {compareA}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-0.5 bg-orange-500 inline-block" />
                    {compareB}
                  </div>
                </div>
              </div>

              {/* City B selector */}
              <div className="text-center">
                <div className="relative inline-block mb-3">
                  <select
                    value={compareB}
                    onChange={(e) => setCompareB(e.target.value)}
                    data-ocid="leaderboard.compare_city_b_select"
                    className="appearance-none bg-orange-900/20 border border-orange-800/40 rounded-xl px-6 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {ALL_CITIES.map((c) => (
                      <option key={c.city} value={c.city}>
                        {c.city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-4xl font-black text-orange-400">
                  {cityBData?.overall ?? "—"}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {cityBData?.state}
                </div>
                {winner === compareB && (
                  <Badge className="mt-2 bg-amber-900/50 text-amber-300 border-amber-700/50">
                    🏆 Winner
                  </Badge>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                data-ocid="leaderboard.share_comparison_button"
                onClick={() => {
                  const url = `${window.location.origin}?compare=${compareA}+vs+${compareB}`;
                  navigator.clipboard?.writeText(url).catch(() => {});
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share Comparison
              </button>
            </div>
          </div>
        </section>

        {/* ACHIEVEMENTS */}
        <section data-ocid="leaderboard.achievements_section">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-amber-500 rounded-full" />
            <h2 className="font-display text-base font-semibold text-foreground">
              City Achievement Badges
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {ACHIEVEMENTS.map((a) => (
              <div
                key={a.city}
                className={`rounded-xl border ${a.bg} p-3 text-center flex flex-col items-center gap-2`}
              >
                <div className="p-2 rounded-full bg-background/30">
                  <a.icon className={`w-5 h-5 ${a.color}`} />
                </div>
                <p className="text-xs font-bold text-foreground">{a.city}</p>
                <p
                  className={`text-xs font-semibold ${a.color} text-center leading-tight`}
                >
                  {a.badge}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* NEWS FEED + COUNTDOWN */}
        <section
          className="grid sm:grid-cols-2 gap-4 pb-8"
          data-ocid="leaderboard.news_section"
        >
          <div className="rounded-xl bg-card border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Recent Rankings Changes
              </h3>
            </div>
            <div className="space-y-2.5">
              {NEWS_FEED.map((item) => (
                <div
                  key={item.text.slice(0, 20)}
                  className="flex items-start gap-2"
                >
                  {item.type === "up" ? (
                    <ArrowUp className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <ArrowDown className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-card border border-border p-4 flex flex-col items-center justify-center text-center gap-3">
            <Crown className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Next Rankings Update
              </p>
              <p className="font-display text-4xl font-black text-foreground">
                {daysLeft}
              </p>
              <p className="text-sm text-muted-foreground">days remaining</p>
            </div>
            <div className="flex gap-2">
              {[2, 3, 4, 5, 6, 7, 1].map((dayNum, i) => (
                <div
                  key={`day-slot-${dayNum}`}
                  className={`w-4 h-4 rounded-sm ${
                    i < 7 - daysLeft ? "bg-primary" : "bg-muted/30"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Season 3 ends in {daysLeft} days
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
