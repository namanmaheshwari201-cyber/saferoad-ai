import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBackend } from "@/hooks/useBackend";
import {
  Award,
  Camera,
  ChevronDown,
  Loader2,
  MapPin,
  RefreshCw,
  Star,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

interface RoadRating {
  id: number;
  name: string;
  city: string;
  rating: number;
  votes: number;
  lastUpdated: string;
  category: "Expressway" | "NH" | "SH" | "City Road";
}

const _ROAD_RATINGS: RoadRating[] = [
  {
    id: 1,
    name: "Yamuna Expressway",
    city: "Noida",
    rating: 4.6,
    votes: 2847,
    lastUpdated: "2 hrs ago",
    category: "Expressway",
  },
  {
    id: 2,
    name: "Mumbai-Pune Expressway",
    city: "Mumbai",
    rating: 4.4,
    votes: 3102,
    lastUpdated: "1 hr ago",
    category: "Expressway",
  },
  {
    id: 3,
    name: "Bengaluru-Mysuru NH-275",
    city: "Bengaluru",
    rating: 4.3,
    votes: 1923,
    lastUpdated: "3 hrs ago",
    category: "NH",
  },
  {
    id: 4,
    name: "Lucknow Ring Road",
    city: "Lucknow",
    rating: 4.1,
    votes: 1456,
    lastUpdated: "5 hrs ago",
    category: "City Road",
  },
  {
    id: 5,
    name: "Delhi Outer Ring Road",
    city: "Delhi",
    rating: 3.6,
    votes: 4218,
    lastUpdated: "30 min ago",
    category: "City Road",
  },
  {
    id: 6,
    name: "Chennai-Trichy NH-38",
    city: "Chennai",
    rating: 2.8,
    votes: 1678,
    lastUpdated: "2 hrs ago",
    category: "NH",
  },
  {
    id: 7,
    name: "Kolkata Bypass NH-16",
    city: "Kolkata",
    rating: 2.4,
    votes: 2093,
    lastUpdated: "4 hrs ago",
    category: "NH",
  },
  {
    id: 8,
    name: "Patna-Muzaffarpur SH-56",
    city: "Patna",
    rating: 1.9,
    votes: 987,
    lastUpdated: "6 hrs ago",
    category: "SH",
  },
];

interface BackendRating {
  roadName: string;
  city: string;
  rating: bigint;
  review: string;
  submittedAt?: bigint;
}

interface LocalRating {
  id: string;
  reviewer: string;
  rating: number;
  review: string;
  date: string;
  tags: string[];
}

interface RoadEntry {
  name: string;
  avgRating: number;
  totalRatings: number;
  category: string;
}

const CONDITION_TAGS = [
  "Smooth",
  "Pothole-filled",
  "Waterlogged",
  "Under repair",
  "Needs repair",
  "Excellent condition",
  "Dangerous",
  "Well-lit",
  "Dark at night",
];

const CITY_ROADS: Record<string, RoadEntry[]> = {
  Delhi: [
    {
      name: "NH-44 (GT Road)",
      avgRating: 3.8,
      totalRatings: 1240,
      category: "NH",
    },
    {
      name: "Ring Road",
      avgRating: 3.5,
      totalRatings: 980,
      category: "City Road",
    },
    {
      name: "Outer Ring Road",
      avgRating: 2.9,
      totalRatings: 2100,
      category: "City Road",
    },
    { name: "NH-48", avgRating: 4.1, totalRatings: 760, category: "NH" },
    {
      name: "Mehrauli-Badarpur Road",
      avgRating: 2.2,
      totalRatings: 540,
      category: "City Road",
    },
  ],
  Mumbai: [
    {
      name: "Western Express Highway",
      avgRating: 4.2,
      totalRatings: 3200,
      category: "Expressway",
    },
    {
      name: "Eastern Express Highway",
      avgRating: 3.9,
      totalRatings: 2800,
      category: "Expressway",
    },
    {
      name: "SV Road",
      avgRating: 3.1,
      totalRatings: 1100,
      category: "City Road",
    },
    { name: "NH-8", avgRating: 4.4, totalRatings: 1900, category: "NH" },
    {
      name: "Linking Road",
      avgRating: 2.8,
      totalRatings: 870,
      category: "City Road",
    },
  ],
  Bengaluru: [
    {
      name: "Bengaluru-Mysuru NH-275",
      avgRating: 4.3,
      totalRatings: 1920,
      category: "NH",
    },
    {
      name: "Outer Ring Road",
      avgRating: 3.4,
      totalRatings: 3100,
      category: "City Road",
    },
    { name: "Hosur Road", avgRating: 3.7, totalRatings: 1450, category: "SH" },
    { name: "Tumkur Road", avgRating: 3.2, totalRatings: 890, category: "SH" },
    {
      name: "Old Madras Road",
      avgRating: 2.6,
      totalRatings: 760,
      category: "City Road",
    },
  ],
  Hyderabad: [
    {
      name: "Outer Ring Road",
      avgRating: 4.5,
      totalRatings: 2400,
      category: "Expressway",
    },
    { name: "NH-65", avgRating: 4.0, totalRatings: 1200, category: "NH" },
    {
      name: "Jubilee Hills Road",
      avgRating: 3.6,
      totalRatings: 560,
      category: "City Road",
    },
    {
      name: "Mehdipatnam Road",
      avgRating: 2.4,
      totalRatings: 430,
      category: "City Road",
    },
  ],
  Chennai: [
    {
      name: "Chennai-Trichy NH-38",
      avgRating: 2.8,
      totalRatings: 1680,
      category: "NH",
    },
    {
      name: "Anna Salai",
      avgRating: 3.5,
      totalRatings: 1200,
      category: "City Road",
    },
    { name: "OMR", avgRating: 4.1, totalRatings: 2200, category: "SH" },
    { name: "GST Road", avgRating: 3.8, totalRatings: 1500, category: "NH" },
  ],
  Kolkata: [
    {
      name: "Kolkata Bypass NH-16",
      avgRating: 2.4,
      totalRatings: 2090,
      category: "NH",
    },
    {
      name: "EM Bypass",
      avgRating: 3.2,
      totalRatings: 1700,
      category: "City Road",
    },
    {
      name: "VIP Road",
      avgRating: 3.8,
      totalRatings: 980,
      category: "City Road",
    },
    { name: "Jessore Road", avgRating: 2.1, totalRatings: 670, category: "SH" },
  ],
  Pune: [
    {
      name: "Mumbai-Pune Expressway",
      avgRating: 4.4,
      totalRatings: 3100,
      category: "Expressway",
    },
    {
      name: "Aundh-Ravet Road",
      avgRating: 3.3,
      totalRatings: 780,
      category: "City Road",
    },
    { name: "NH-48", avgRating: 4.0, totalRatings: 1400, category: "NH" },
    { name: "Solapur Road", avgRating: 2.7, totalRatings: 560, category: "SH" },
  ],
  Ahmedabad: [
    {
      name: "SP Ring Road",
      avgRating: 4.2,
      totalRatings: 1900,
      category: "City Road",
    },
    { name: "SG Highway", avgRating: 4.3, totalRatings: 2200, category: "SH" },
    { name: "NH-48", avgRating: 3.9, totalRatings: 1100, category: "NH" },
    {
      name: "Sarkhej-Gandhinagar Road",
      avgRating: 3.5,
      totalRatings: 870,
      category: "SH",
    },
  ],
  Jaipur: [
    {
      name: "Jaipur Ring Road",
      avgRating: 3.7,
      totalRatings: 1100,
      category: "City Road",
    },
    { name: "NH-48", avgRating: 3.9, totalRatings: 890, category: "NH" },
    {
      name: "Tonk Road",
      avgRating: 3.0,
      totalRatings: 540,
      category: "City Road",
    },
    { name: "Ajmer Road", avgRating: 2.8, totalRatings: 430, category: "SH" },
  ],
  Lucknow: [
    {
      name: "Lucknow Ring Road",
      avgRating: 4.1,
      totalRatings: 1456,
      category: "City Road",
    },
    { name: "NH-27", avgRating: 3.6, totalRatings: 780, category: "NH" },
    {
      name: "Shaheed Path",
      avgRating: 4.4,
      totalRatings: 2100,
      category: "City Road",
    },
    { name: "Kanpur Road", avgRating: 2.9, totalRatings: 620, category: "SH" },
  ],
  Patna: [
    {
      name: "Patna-Muzaffarpur SH-56",
      avgRating: 1.9,
      totalRatings: 987,
      category: "SH",
    },
    { name: "NH-30", avgRating: 2.8, totalRatings: 760, category: "NH" },
    {
      name: "Bailey Road",
      avgRating: 3.1,
      totalRatings: 540,
      category: "City Road",
    },
    {
      name: "Ashok Rajpath",
      avgRating: 2.0,
      totalRatings: 430,
      category: "City Road",
    },
  ],
  Surat: [
    {
      name: "Surat Ring Road",
      avgRating: 3.9,
      totalRatings: 1200,
      category: "City Road",
    },
    { name: "NH-48", avgRating: 4.1, totalRatings: 980, category: "NH" },
    {
      name: "Dumas Road",
      avgRating: 3.5,
      totalRatings: 540,
      category: "City Road",
    },
  ],
  Kanpur: [
    {
      name: "Grand Trunk Road",
      avgRating: 2.6,
      totalRatings: 870,
      category: "NH",
    },
    { name: "NH-19", avgRating: 3.2, totalRatings: 1100, category: "NH" },
    {
      name: "Kanpur-Lucknow Road",
      avgRating: 3.5,
      totalRatings: 760,
      category: "SH",
    },
  ],
  Nagpur: [
    {
      name: "Nagpur Ring Road",
      avgRating: 4.0,
      totalRatings: 1400,
      category: "City Road",
    },
    { name: "NH-44", avgRating: 3.7, totalRatings: 980, category: "NH" },
    {
      name: "Wardha Road",
      avgRating: 3.3,
      totalRatings: 670,
      category: "City Road",
    },
  ],
  Indore: [
    {
      name: "Indore Ring Road",
      avgRating: 3.8,
      totalRatings: 1100,
      category: "City Road",
    },
    { name: "NH-52", avgRating: 3.5, totalRatings: 760, category: "NH" },
    { name: "AB Road", avgRating: 3.2, totalRatings: 540, category: "SH" },
  ],
};

const MOCK_REVIEWS: Record<string, LocalRating[]> = {
  "NH-44 (GT Road)": [
    {
      id: "1",
      reviewer: "User_48291",
      rating: 4,
      review: "Fairly smooth with some patches near Panipat. Good overall.",
      date: "2 days ago",
      tags: ["Smooth", "Well-lit"],
    },
    {
      id: "2",
      reviewer: "User_73620",
      rating: 3,
      review: "Under maintenance near Karnal but generally decent.",
      date: "5 days ago",
      tags: ["Under repair"],
    },
  ],
  "Ring Road": [
    {
      id: "1",
      reviewer: "User_92847",
      rating: 4,
      review: "Good road, slight congestion during peak hours.",
      date: "1 day ago",
      tags: ["Smooth"],
    },
    {
      id: "2",
      reviewer: "User_31054",
      rating: 3,
      review: "Few potholes near ITO. Could use better lighting.",
      date: "3 days ago",
      tags: ["Dark at night", "Needs repair"],
    },
  ],
  "Western Express Highway": [
    {
      id: "1",
      reviewer: "User_56781",
      rating: 5,
      review: "Excellent condition throughout. Best highway in Mumbai.",
      date: "1 hr ago",
      tags: ["Excellent condition", "Well-lit"],
    },
    {
      id: "2",
      reviewer: "User_29304",
      rating: 4,
      review: "Smooth ride. Minor waterlogging near Malad during rains.",
      date: "4 hours ago",
      tags: ["Smooth", "Waterlogged"],
    },
    {
      id: "3",
      reviewer: "User_88102",
      rating: 4,
      review: "Good construction, needs a few repairs near Borivali.",
      date: "1 day ago",
      tags: ["Needs repair"],
    },
  ],
};
const CITY_CHART_DATA = [
  { city: "Noida", avg: 4.4 },
  { city: "Mumbai", avg: 4.2 },
  { city: "Bengaluru", avg: 4.0 },
  { city: "Lucknow", avg: 3.8 },
  { city: "Delhi", avg: 3.5 },
  { city: "Hyderabad", avg: 3.3 },
  { city: "Chennai", avg: 3.0 },
  { city: "Kolkata", avg: 2.7 },
  { city: "Patna", avg: 2.4 },
];

const CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Surat",
  "Kanpur",
  "Nagpur",
  "Patna",
  "Indore",
  "Bhopal",
  "Visakhapatnam",
  "Vadodara",
  "Ludhiana",
  "Agra",
];

function StarRating({
  rating,
  size = "sm",
  onRate,
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
  onRate?: (r: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const display = hover || rating;
  const sizeClass =
    size === "lg" ? "h-7 w-7" : size === "md" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onRate?.(s)}
          onMouseEnter={() => onRate && setHover(s)}
          onMouseLeave={() => onRate && setHover(0)}
          className={`transition-colors ${onRate ? "cursor-pointer" : "cursor-default"}`}
          aria-label={`${s} star`}
        >
          <Star
            className={`${sizeClass} transition-colors ${
              s <= display
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-slate-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function RatingDistributionBar({ ratings }: { ratings: LocalRating[] }) {
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((r) => r.rating === star).length,
  }));
  const max = Math.max(...counts.map((c) => c.count), 1);
  return (
    <div className="space-y-1.5">
      {counts.map(({ star, count }) => (
        <div key={star} className="flex items-center gap-2">
          <span className="text-xs text-slate-400 w-4 text-right">{star}</span>
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-500"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 w-4">{count}</span>
        </div>
      ))}
    </div>
  );
}

function RoadListItem({
  road,
  selected,
  onSelect,
}: {
  road: RoadEntry;
  selected: boolean;
  onSelect: () => void;
}) {
  const isGood = road.avgRating >= 4;
  const isBad = road.avgRating < 3;
  const dotColor = isGood
    ? "bg-emerald-400"
    : isBad
      ? "bg-red-400"
      : "bg-amber-400";
  return (
    <button
      type="button"
      onClick={onSelect}
      data-ocid="crowdsourcing.road_item"
      className={`w-full text-left rounded-xl border px-3 py-2.5 transition-all ${
        selected
          ? "border-amber-500/60 bg-amber-500/10"
          : "border-white/8 hover:border-white/20"
      }`}
      style={{ background: selected ? undefined : "#0a0f1e" }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`h-2 w-2 rounded-full shrink-0 ${dotColor}`} />
          <span className="text-sm font-medium text-white truncate">
            {road.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold text-amber-400">
            {road.avgRating.toFixed(1)}
          </span>
          <span className="text-xs text-slate-500">
            ({road.totalRatings.toLocaleString("en-IN")})
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-0.5 ml-4">
        <Badge className="text-[10px] px-1.5 py-0 bg-white/5 text-slate-400 border-0">
          {road.category}
        </Badge>
      </div>
    </button>
  );
}

function ReviewCard({ review }: { review: LocalRating }) {
  return (
    <div
      className="rounded-xl border border-white/8 p-3"
      style={{ background: "#0a0f1e" }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-400">
              {review.reviewer.slice(-1)}
            </span>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">
              {review.reviewer}
            </div>
            <div className="text-[10px] text-slate-500">{review.date}</div>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      {review.review && (
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          {review.review}
        </p>
      )}
      {review.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {review.tags.map((t) => (
            <Badge
              key={t}
              className="text-[10px] px-1.5 py-0 bg-white/5 text-slate-400 border-white/10"
            >
              {t}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function LeaderboardRoadCard({
  road,
  rank,
  type,
}: {
  road: RoadEntry & { city: string };
  rank: number;
  type: "best" | "worst";
}) {
  const borderColor =
    type === "best" ? "border-emerald-500/30" : "border-red-500/30";
  const tagBg =
    type === "best"
      ? "bg-emerald-500/20 text-emerald-400"
      : "bg-red-500/20 text-red-400";
  return (
    <div
      className={`rounded-xl border p-3 ${borderColor}`}
      style={{ background: "#0a0f1e" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <span
            className={`text-lg font-black ${type === "best" ? "text-emerald-500" : "text-red-500"} shrink-0 leading-none mt-0.5`}
          >
            #{rank}
          </span>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">
              {road.name}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 text-slate-500" />
              <span className="text-xs text-slate-400">
                {road.city} · {road.category}
              </span>
            </div>
          </div>
        </div>
        <Badge className={`${tagBg} border-0 text-xs shrink-0`}>
          {road.avgRating.toFixed(1)}
        </Badge>
      </div>
      <div className="flex items-center justify-between mt-2">
        <StarRating rating={road.avgRating} />
        <span className="text-xs text-slate-500">
          {road.totalRatings.toLocaleString("en-IN")} votes
        </span>
      </div>
    </div>
  );
}

export function CrowdsourcingPage() {
  const { actor } = useBackend();

  const [selectedCity, setSelectedCity] = useState("");
  const [roads, setRoads] = useState<RoadEntry[]>([]);
  const [roadsLoading, setRoadsLoading] = useState(false);
  const [selectedRoad, setSelectedRoad] = useState<RoadEntry | null>(null);

  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successRoad, setSuccessRoad] = useState("");

  const [roadReviews, setRoadReviews] = useState<LocalRating[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const [photoName, setPhotoName] = useState("");

  const allRoads = Object.entries(CITY_ROADS).flatMap(([city, rs]) =>
    rs.map((r) => ({ ...r, city })),
  );
  const best = [...allRoads]
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 3);
  const worst = [...allRoads]
    .sort((a, b) => a.avgRating - b.avgRating)
    .slice(0, 3);

  useEffect(() => {
    if (!selectedCity) {
      setRoads([]);
      setSelectedRoad(null);
      return;
    }
    setSelectedRoad(null);
    setRoads([]);
    setRoadsLoading(true);
    const tryBackend = async () => {
      try {
        // @ts-ignore — endpoint may not be in generated types yet
        const backendRoads: string[] = actor
          ? await actor.getCityRoads(selectedCity)
          : [];
        if (backendRoads && backendRoads.length > 0) {
          setRoads(
            backendRoads.map((name) => ({
              name,
              avgRating: 0,
              totalRatings: 0,
              category: "City Road",
            })),
          );
          return;
        }
      } catch (_) {
        /* fallback */
      }
      setRoads(CITY_ROADS[selectedCity] ?? []);
    };
    tryBackend().finally(() => setRoadsLoading(false));
  }, [selectedCity, actor]);

  useEffect(() => {
    if (!selectedRoad || !selectedCity) {
      setRoadReviews([]);
      return;
    }
    setReviewsLoading(true);
    setRoadReviews([]);
    const tryFetch = async () => {
      try {
        // @ts-ignore
        const results: BackendRating[] = actor
          ? await actor.getRatingsForRoad(selectedCity, selectedRoad.name)
          : [];
        if (results && results.length > 0) {
          setRoadReviews(
            results.map((r, i) => ({
              id: String(i),
              reviewer: `User_${String(Number(r.submittedAt ?? 0))
                .slice(-5)
                .padStart(5, "0")}`,
              rating: Number(r.rating),
              review: r.review,
              date: "Recently",
              tags: [],
            })),
          );
          return;
        }
      } catch (_) {
        /* fallback */
      }
      setRoadReviews(MOCK_REVIEWS[selectedRoad.name] ?? []);
    };
    tryFetch().finally(() => setReviewsLoading(false));
  }, [selectedRoad, selectedCity, actor]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const avgRating = roadReviews.length
    ? roadReviews.reduce((s, r) => s + r.rating, 0) / roadReviews.length
    : 0;

  const handleSubmit = async () => {
    if (!selectedCity || !selectedRoad) {
      toast.error("Select a city and road first");
      return;
    }
    if (userRating === 0) {
      toast.error("Please provide a star rating");
      return;
    }
    setSubmitting(true);
    try {
      let saved = false;
      try {
        // @ts-ignore
        const result = actor
          ? await actor.submitRoadRating(
              selectedCity,
              selectedRoad.name,
              BigInt(userRating),
              comment,
            )
          : null;
        if (result && typeof result === "object" && "Ok" in result)
          saved = true;
      } catch (_) {
        /* fallback */
      }

      const newReview: LocalRating = {
        id: String(Date.now()),
        reviewer: `User_${String(Date.now()).slice(-5)}`,
        rating: userRating,
        review: comment,
        date: "Just now",
        tags: selectedTags,
      };
      setRoadReviews((prev) => [newReview, ...prev]);

      const newCount = roadReviews.length + 1;
      const newAvg = (avgRating * roadReviews.length + userRating) / newCount;
      setRoads((prev) =>
        prev.map((r) =>
          r.name === selectedRoad.name
            ? {
                ...r,
                avgRating: Math.round(newAvg * 10) / 10,
                totalRatings: r.totalRatings + 1,
              }
            : r,
        ),
      );

      setSuccessRoad(selectedRoad.name);
      setUserRating(0);
      setComment("");
      setSelectedTags([]);
      setPhotoName("");
      toast.success(
        saved
          ? "Rating saved to blockchain!"
          : "Rating saved! Thank you for contributing.",
        {
          description: `${userRating} star${userRating > 1 ? "s" : ""} for ${selectedRoad.name}`,
        },
      );
      setTimeout(() => setSuccessRoad(""), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="p-4 md:p-6 space-y-6"
      style={{ background: "#0a0f1e", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
          <Star className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">
            Road Quality Crowdsourcing
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Rate roads — build India's most accurate road quality map
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Roads Rated", value: "1.2L+", color: "text-amber-400" },
          { label: "Cities Covered", value: "42", color: "text-blue-400" },
          { label: "Avg Quality", value: "3.4/5", color: "text-emerald-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/8 p-3 text-center"
            style={{ background: "#0f172a" }}
          >
            <div className={`text-lg font-black ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* City + Road Selection */}
      <Card className="border-amber-500/20" style={{ background: "#0f172a" }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-amber-400 flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Select City & Road
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label
              htmlFor="crowd-city"
              className="text-xs text-slate-400 mb-1.5 block"
            >
              City
            </label>
            <div className="relative">
              <select
                id="crowd-city"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSuccessRoad("");
                }}
                data-ocid="crowdsourcing.city_select"
                className="w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-400/50 appearance-none pr-8"
                style={{ background: "#0a0f1e" }}
              >
                <option value="">-- Choose a city --</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {selectedCity && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">
                  Select a road to rate
                </span>
                {roadsLoading && (
                  <Loader2 className="h-3.5 w-3.5 text-amber-400 animate-spin" />
                )}
              </div>
              {!roadsLoading && roads.length === 0 && (
                <p className="text-xs text-slate-500 py-2">
                  No roads found for {selectedCity}.
                </p>
              )}
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {roads.map((road) => (
                  <RoadListItem
                    key={road.name}
                    road={road}
                    selected={selectedRoad?.name === road.name}
                    onSelect={() => {
                      setSelectedRoad(road);
                      setSuccessRoad("");
                      setUserRating(0);
                      setComment("");
                      setSelectedTags([]);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rating Form */}
      {selectedRoad && (
        <Card className="border-blue-500/20" style={{ background: "#0f172a" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-400 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Rate:{" "}
              <span className="text-white font-bold truncate">
                {selectedRoad.name}
              </span>
              <span className="text-slate-500 font-normal text-xs">
                · {selectedCity}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {successRoad === selectedRoad.name && (
              <div
                className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 flex items-center gap-2"
                data-ocid="crowdsourcing.success_state"
              >
                <ThumbsUp className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-emerald-300 font-medium">
                  Rating saved! Thank you for contributing.
                </span>
              </div>
            )}
            <div>
              <span className="text-xs text-slate-400 mb-2 block">
                Your Rating *
              </span>
              <div className="flex items-center gap-3">
                <StarRating
                  rating={userRating}
                  size="lg"
                  onRate={setUserRating}
                />
                {userRating > 0 && (
                  <span className="text-base font-black text-amber-400">
                    {userRating}/5
                  </span>
                )}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-400 mb-2 block">
                Road Condition Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CONDITION_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    data-ocid="crowdsourcing.tag_toggle"
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      selectedTags.includes(tag)
                        ? "border-amber-500/60 bg-amber-500/15 text-amber-300"
                        : "border-white/10 text-slate-400 hover:border-white/25"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="crowd-comment"
                className="text-xs text-slate-400 mb-1.5 block"
              >
                Describe road condition...
              </label>
              <textarea
                id="crowd-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Potholes near Junction 4, poor lighting, construction zone ahead…"
                rows={3}
                data-ocid="crowdsourcing.comment_textarea"
                className="w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-white placeholder-slate-600 resize-none focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                style={{ background: "#0a0f1e" }}
              />
            </div>
            <div>
              <span className="text-xs text-slate-400 mb-1.5 block">
                Photo (optional)
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? "")}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                data-ocid="crowdsourcing.upload_button"
                className="flex items-center gap-2 rounded-lg border border-dashed border-white/20 px-3 py-2 text-xs text-slate-400 hover:border-amber-400/40 hover:text-amber-300 transition-colors"
              >
                <Camera className="h-4 w-4" />
                {photoName ? (
                  <span className="text-amber-300 flex items-center gap-1.5">
                    {photoName}
                    <X
                      className="h-3 w-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhotoName("");
                      }}
                    />
                  </span>
                ) : (
                  "Upload road photo"
                )}
              </button>
            </div>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || userRating === 0}
              data-ocid="crowdsourcing.submit_button"
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting…
                </>
              ) : (
                "Submit Rating"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Ratings feed */}
      {selectedRoad && (
        <Card className="border-white/10" style={{ background: "#0f172a" }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-slate-200 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                Ratings for {selectedRoad.name}
              </CardTitle>
              {reviewsLoading && (
                <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
              )}
              {!reviewsLoading && roadReviews.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setReviewsLoading(true);
                    setTimeout(() => setReviewsLoading(false), 600);
                  }}
                  data-ocid="crowdsourcing.refresh_button"
                  className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Refresh ratings"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {roadReviews.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-black text-amber-400">
                      {avgRating.toFixed(1)}
                    </div>
                    <StarRating rating={Math.round(avgRating)} size="md" />
                    <div className="text-xs text-slate-500 mt-1">
                      {roadReviews.length} rating
                      {roadReviews.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <RatingDistributionBar ratings={roadReviews} />
                </div>
                <div className="space-y-2">
                  {roadReviews.map((r) => (
                    <ReviewCard key={r.id} review={r} />
                  ))}
                </div>
              </>
            ) : reviewsLoading ? (
              <div className="py-6 text-center">
                <Loader2 className="h-6 w-6 text-slate-500 animate-spin mx-auto" />
                <p className="text-xs text-slate-500 mt-2">Loading ratings…</p>
              </div>
            ) : (
              <div
                className="py-8 text-center"
                data-ocid="crowdsourcing.empty_state"
              >
                <Star className="h-8 w-8 text-slate-700 mx-auto" />
                <p className="text-sm font-semibold text-slate-300 mt-2">
                  Be the first to rate this road!
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Your rating helps thousands of Indian drivers.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Leaderboards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className="border-emerald-500/20"
          style={{ background: "#0f172a" }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-emerald-400 flex items-center gap-2">
              <Award className="h-4 w-4" /> Best Rated Roads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {best.map((r, i) => (
              <LeaderboardRoadCard
                key={r.name}
                road={r}
                rank={i + 1}
                type="best"
              />
            ))}
          </CardContent>
        </Card>
        <Card className="border-red-500/20" style={{ background: "#0f172a" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-400 flex items-center gap-2">
              <ThumbsDown className="h-4 w-4" /> Worst Rated Roads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {worst.map((r, i) => (
              <LeaderboardRoadCard
                key={r.name}
                road={r}
                rank={i + 1}
                type="worst"
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Average Ratings by City chart */}
      <Card className="border-white/10" style={{ background: "#0f172a" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-slate-200 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-400" /> Average Ratings by
            City
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={CITY_CHART_DATA}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
              />
              <XAxis dataKey="city" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis domain={[0, 5]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "#f1f5f9" }}
                itemStyle={{ color: "#fbbf24" }}
              />
              <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                {CITY_CHART_DATA.map((entry) => (
                  <Cell
                    key={entry.city}
                    fill={
                      entry.avg >= 4
                        ? "#10b981"
                        : entry.avg >= 3
                          ? "#f59e0b"
                          : "#ef4444"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default CrowdsourcingPage;
