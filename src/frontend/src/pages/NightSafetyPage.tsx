import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Lightbulb,
  MapPin,
  Moon,
  Shield,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Data ────────────────────────────────────────────────────────────────────

const CITY_SCORES = [
  {
    city: "Chandigarh",
    score: 84,
    lighting: 88,
    crime: 82,
    traffic: 80,
    road: 87,
  },
  { city: "Pune", score: 77, lighting: 80, crime: 74, traffic: 76, road: 79 },
  {
    city: "Bengaluru",
    score: 68,
    lighting: 72,
    crime: 65,
    traffic: 64,
    road: 71,
  },
  { city: "Delhi", score: 61, lighting: 65, crime: 55, traffic: 58, road: 66 },
  { city: "Mumbai", score: 64, lighting: 70, crime: 60, traffic: 59, road: 68 },
  {
    city: "Kolkata",
    score: 57,
    lighting: 60,
    crime: 52,
    traffic: 55,
    road: 61,
  },
];

const STREET_LIGHT_DATA = [
  { city: "Mumbai", pct: 84 },
  { city: "Chennai", pct: 79 },
  { city: "Pune", pct: 77 },
  { city: "Hyderabad", pct: 73 },
  { city: "Delhi", pct: 71 },
  { city: "Ahmedabad", pct: 70 },
  { city: "Bangalore", pct: 68 },
  { city: "Kolkata", pct: 65 },
];

const ACCIDENT_TIMELINE = [
  { hour: "5 AM", accidents: 12 },
  { hour: "6 AM", accidents: 18 },
  { hour: "7 AM", accidents: 34 },
  { hour: "8 AM", accidents: 58 },
  { hour: "9 AM", accidents: 42 },
  { hour: "10 AM", accidents: 28 },
  { hour: "11 AM", accidents: 22 },
  { hour: "12 PM", accidents: 25 },
  { hour: "1 PM", accidents: 30 },
  { hour: "2 PM", accidents: 24 },
  { hour: "3 PM", accidents: 20 },
  { hour: "4 PM", accidents: 38 },
  { hour: "5 PM", accidents: 62 },
  { hour: "6 PM", accidents: 55 },
  { hour: "7 PM", accidents: 48 },
  { hour: "8 PM", accidents: 64 },
  { hour: "9 PM", accidents: 72 },
  { hour: "10 PM", accidents: 95 },
  { hour: "11 PM", accidents: 118 },
  { hour: "12 AM", accidents: 124 },
  { hour: "1 AM", accidents: 131 },
  { hour: "2 AM", accidents: 108 },
  { hour: "3 AM", accidents: 78 },
  { hour: "4 AM", accidents: 44 },
];

const DANGER_ZONES = [
  {
    id: 1,
    name: "Rohini Sector 7, Delhi",
    risk: "Critical",
    incidents: 14,
    lighting: 28,
    lastIncident: "11:43 PM",
    description:
      "High-speed unlit stretch with blind corners. Repeated accidents due to poor road markings and missing streetlights.",
    lat: 28.745,
    lng: 77.07,
  },
  {
    id: 2,
    name: "Dharavi, Mumbai",
    risk: "Critical",
    incidents: 11,
    lighting: 35,
    lastIncident: "1:15 AM",
    description:
      "Dense intersection with no traffic signals at night. Frequent pedestrian accidents and vehicle collisions.",
    lat: 19.04,
    lng: 72.855,
  },
  {
    id: 3,
    name: "Silk Board Junction, Bangalore",
    risk: "High",
    incidents: 9,
    lighting: 52,
    lastIncident: "12:30 AM",
    description:
      "High traffic merge point with inadequate night signage. Peak risk between midnight and 2 AM.",
    lat: 12.917,
    lng: 77.622,
  },
  {
    id: 4,
    name: "Red Hills, Chennai",
    risk: "High",
    incidents: 7,
    lighting: 41,
    lastIncident: "2:00 AM",
    description:
      "Unlit flyover approach with worn road surface. Construction zone merges without proper night warnings.",
    lat: 13.115,
    lng: 80.252,
  },
  {
    id: 5,
    name: "PVNR Expressway, Hyderabad",
    risk: "High",
    incidents: 8,
    lighting: 47,
    lastIncident: "11:55 PM",
    description:
      "High-speed expressway with insufficient emergency lighting. Vehicles often exceed safe night speeds.",
    lat: 17.43,
    lng: 78.448,
  },
  {
    id: 6,
    name: "Howrah Bridge approach, Kolkata",
    risk: "Medium",
    incidents: 5,
    lighting: 63,
    lastIncident: "10:45 PM",
    description:
      "Heavy goods vehicle congestion after 10 PM creates blind spots on the approach ramps.",
    lat: 22.585,
    lng: 88.347,
  },
  {
    id: 7,
    name: "Chandni Chowk, Delhi",
    risk: "Medium",
    incidents: 6,
    lighting: 58,
    lastIncident: "9:30 PM",
    description:
      "Narrow lanes with mixed traffic. Unregulated parking blocks emergency vehicle access at night.",
    lat: 28.657,
    lng: 77.231,
  },
  {
    id: 8,
    name: "Sarkhej-Gandhinagar Hwy, Ahmedabad",
    risk: "High",
    incidents: 8,
    lighting: 39,
    lastIncident: "1:40 AM",
    description:
      "Long stretches without streetlights. Stray animal crossings cause sudden braking incidents.",
    lat: 23.03,
    lng: 72.505,
  },
] as const;

const NEIGHBORHOODS: Record<
  string,
  {
    area: string;
    score: number;
    lighting: number;
    crime: "Low" | "Medium" | "High";
    traffic: number;
    road: number;
    ratings: { user: string; stars: number; comment: string }[];
  }[]
> = {
  Delhi: [
    {
      area: "Connaught Place",
      score: 78,
      lighting: 82,
      crime: "Medium",
      traffic: 74,
      road: 80,
      ratings: [
        {
          user: "Rahul S.",
          stars: 4,
          comment: "Well-lit but crowded at night",
        },
        {
          user: "Priya M.",
          stars: 3,
          comment: "Could use more police presence",
        },
        {
          user: "Ankit K.",
          stars: 4,
          comment: "Generally safe, good lighting",
        },
      ],
    },
    {
      area: "Lajpat Nagar",
      score: 71,
      lighting: 74,
      crime: "Medium",
      traffic: 68,
      road: 72,
      ratings: [
        {
          user: "Neha R.",
          stars: 3,
          comment: "Market area, needs more patrols",
        },
        {
          user: "Suresh P.",
          stars: 4,
          comment: "Decent lighting on main roads",
        },
      ],
    },
    {
      area: "Saket",
      score: 82,
      lighting: 86,
      crime: "Low",
      traffic: 78,
      road: 84,
      ratings: [
        {
          user: "Amit G.",
          stars: 5,
          comment: "Very safe area, good infrastructure",
        },
        {
          user: "Kavya L.",
          stars: 4,
          comment: "Mall area well covered by CCTV",
        },
      ],
    },
    {
      area: "Rohini",
      score: 65,
      lighting: 68,
      crime: "Medium",
      traffic: 62,
      road: 65,
      ratings: [
        {
          user: "Vikram S.",
          stars: 3,
          comment: "Mixed - some areas need improvement",
        },
      ],
    },
    {
      area: "Dwarka",
      score: 74,
      lighting: 77,
      crime: "Low",
      traffic: 70,
      road: 75,
      ratings: [
        {
          user: "Pooja N.",
          stars: 4,
          comment: "Planned township, reasonably safe",
        },
        { user: "Raj M.", stars: 4, comment: "Good connectivity and lighting" },
      ],
    },
    {
      area: "Karol Bagh",
      score: 63,
      lighting: 66,
      crime: "Medium",
      traffic: 60,
      road: 66,
      ratings: [
        {
          user: "Sita R.",
          stars: 3,
          comment: "Busy market, careful at late night",
        },
      ],
    },
    {
      area: "Paharganj",
      score: 52,
      lighting: 55,
      crime: "High",
      traffic: 50,
      road: 54,
      ratings: [
        {
          user: "Tourist A.",
          stars: 2,
          comment: "Not advisable for solo travel after midnight",
        },
      ],
    },
    {
      area: "Hauz Khas",
      score: 76,
      lighting: 80,
      crime: "Low",
      traffic: 72,
      road: 77,
      ratings: [
        { user: "Artist B.", stars: 4, comment: "Village area, good vibe" },
        {
          user: "Nisha D.",
          stars: 5,
          comment: "One of the safest in South Delhi",
        },
      ],
    },
  ],
  Mumbai: [
    {
      area: "Bandra",
      score: 83,
      lighting: 85,
      crime: "Low",
      traffic: 80,
      road: 84,
      ratings: [
        {
          user: "Deepa S.",
          stars: 5,
          comment: "Best night life safety in Mumbai",
        },
        { user: "Rahul V.", stars: 4, comment: "Well patrolled and lit" },
      ],
    },
    {
      area: "Andheri",
      score: 74,
      lighting: 77,
      crime: "Medium",
      traffic: 70,
      road: 75,
      ratings: [
        {
          user: "Meera P.",
          stars: 4,
          comment: "East is safer than West at night",
        },
      ],
    },
    {
      area: "Juhu",
      score: 79,
      lighting: 82,
      crime: "Low",
      traffic: 76,
      road: 80,
      ratings: [
        {
          user: "Beach Guy",
          stars: 4,
          comment: "Beachfront well-lit, interior lanes ok",
        },
      ],
    },
    {
      area: "Powai",
      score: 86,
      lighting: 88,
      crime: "Low",
      traffic: 84,
      road: 87,
      ratings: [
        {
          user: "IT Worker",
          stars: 5,
          comment: "Tech hub, excellent safety standards",
        },
        {
          user: "Ananya K.",
          stars: 5,
          comment: "Very safe for late night commutes",
        },
      ],
    },
    {
      area: "Thane",
      score: 68,
      lighting: 70,
      crime: "Medium",
      traffic: 65,
      road: 67,
      ratings: [
        { user: "Sunil K.", stars: 3, comment: "Some areas need improvement" },
      ],
    },
    {
      area: "Kurla",
      score: 55,
      lighting: 58,
      crime: "High",
      traffic: 52,
      road: 56,
      ratings: [
        {
          user: "Local F.",
          stars: 2,
          comment: "Station area crowded, exercise caution",
        },
      ],
    },
    {
      area: "Dadar",
      score: 70,
      lighting: 73,
      crime: "Medium",
      traffic: 66,
      road: 71,
      ratings: [
        { user: "Asha T.", stars: 3, comment: "Market area, mixed at night" },
      ],
    },
    {
      area: "Colaba",
      score: 81,
      lighting: 84,
      crime: "Low",
      traffic: 78,
      road: 82,
      ratings: [
        {
          user: "Tourist C.",
          stars: 4,
          comment: "Tourist-heavy, generally safe",
        },
        { user: "Naval W.", stars: 5, comment: "Well maintained and policed" },
      ],
    },
  ],
  Bangalore: [
    {
      area: "Koramangala",
      score: 80,
      lighting: 83,
      crime: "Low",
      traffic: 77,
      road: 81,
      ratings: [
        {
          user: "Startup E.",
          stars: 5,
          comment: "Vibrant late-night scene, well-lit",
        },
      ],
    },
    {
      area: "Indiranagar",
      score: 77,
      lighting: 80,
      crime: "Low",
      traffic: 74,
      road: 78,
      ratings: [
        {
          user: "Preethi L.",
          stars: 4,
          comment: "100 Feet Road excellently maintained",
        },
      ],
    },
    {
      area: "Whitefield",
      score: 72,
      lighting: 75,
      crime: "Medium",
      traffic: 68,
      road: 73,
      ratings: [
        {
          user: "IT Prof G.",
          stars: 3,
          comment: "Roads decent but isolated at night",
        },
      ],
    },
    {
      area: "Jayanagar",
      score: 74,
      lighting: 76,
      crime: "Low",
      traffic: 72,
      road: 75,
      ratings: [
        {
          user: "Resident H.",
          stars: 4,
          comment: "Quiet residential, fairly safe",
        },
      ],
    },
    {
      area: "BTM Layout",
      score: 65,
      lighting: 67,
      crime: "Medium",
      traffic: 62,
      road: 65,
      ratings: [
        {
          user: "Student I.",
          stars: 3,
          comment: "Student area, ok but watch out",
        },
      ],
    },
    {
      area: "HSR Layout",
      score: 76,
      lighting: 79,
      crime: "Low",
      traffic: 73,
      road: 77,
      ratings: [
        {
          user: "Young Fam.",
          stars: 4,
          comment: "Family-friendly and safe at night",
        },
      ],
    },
  ],
};

// ─── Helper components ───────────────────────────────────────────────────────

const scoreColor = (s: number) =>
  s >= 75 ? "text-emerald-400" : s >= 60 ? "text-amber-400" : "text-red-400";
const scoreBg = (s: number) =>
  s >= 75
    ? "bg-emerald-500/15 border-emerald-500/30"
    : s >= 60
      ? "bg-amber-500/15 border-amber-500/30"
      : "bg-red-500/15 border-red-500/30";
const crimeColor = (c: string) =>
  c === "Low"
    ? "text-emerald-400"
    : c === "Medium"
      ? "text-amber-400"
      : "text-red-400";

function SectionHeader({
  icon,
  title,
  subtitle,
}: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="h-9 w-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function CityMetrics({ city }: { city: (typeof CITY_SCORES)[0] }) {
  const metrics: [string, number][] = [
    ["Lighting", city.lighting],
    ["Crime Index", city.crime],
    ["Traffic", city.traffic],
    ["Road Quality", city.road],
  ];
  return (
    <div className="space-y-1.5 text-xs">
      {metrics.map(([label, val]) => (
        <div key={label} className="flex items-center gap-2">
          <span className="text-slate-500 w-24 flex-shrink-0">{label}</span>
          <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                val >= 75
                  ? "bg-emerald-500"
                  : val >= 60
                    ? "bg-amber-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${val}%` }}
            />
          </div>
          <span className="text-slate-400 w-6 text-right">{val}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Section 1: Danger Zone Alerts ───────────────────────────────────────────

function toIndiaMapSVG(lat: number, lng: number) {
  const x = ((lng - 68) / (97 - 68)) * 560 + 20;
  const y = ((37 - lat) / (37 - 8)) * 360 + 20;
  return { x, y };
}

function DangerZoneAlerts() {
  const [alerted, setAlerted] = useState<Set<number>>(new Set());

  const handleAlert = (zone: (typeof DANGER_ZONES)[number]) => {
    setAlerted((prev) => new Set(prev).add(zone.id));
    // eslint-disable-next-line no-console
    console.log(`Alert sent to local traffic authorities for ${zone.name}`);
  };

  const riskBadge = (risk: string) => {
    if (risk === "Critical")
      return "bg-red-500/20 text-red-400 border-red-500/30";
    if (risk === "High")
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  };

  const circleColor = (risk: string) => {
    if (risk === "Critical") return "#ef4444";
    if (risk === "High") return "#f97316";
    return "#eab308";
  };

  const circleRadius = (risk: string) => {
    if (risk === "Critical") return 12;
    if (risk === "High") return 10;
    return 8;
  };

  return (
    <Card className="p-4 border-white/8" style={{ background: "#0f172a" }}>
      <div className="flex items-start gap-3 mb-4">
        <div className="h-9 w-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Shield className="h-4 w-4 text-red-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">
              Danger Zone Alerts
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              LIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            AI-identified high-risk accident zones across India
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        {DANGER_ZONES.map((zone) => (
          <div
            key={zone.id}
            className="rounded-xl bg-white/4 border border-white/8 p-3 hover:bg-white/6 transition-colors"
            data-ocid={`nightsafety.danger.item.${zone.id}`}
          >
            <div className="flex items-start justify-between mb-1.5">
              <h3 className="text-sm font-semibold text-white">{zone.name}</h3>
              <Badge
                variant="outline"
                className={`text-[10px] ${riskBadge(zone.risk)}`}
              >
                {zone.risk}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2 mb-2">
              {zone.description}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
              <span>🔴 {zone.incidents} incidents this week</span>
              <span>💡 {zone.lighting}% lit</span>
              <span>🕐 Last: {zone.lastIncident}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              onClick={() => handleAlert(zone)}
              disabled={alerted.has(zone.id)}
              data-ocid={`nightsafety.danger.alert_button.${zone.id}`}
            >
              {alerted.has(zone.id) ? "Alert Sent ✓" : "Alert Authorities"}
            </Button>
          </div>
        ))}
      </div>

      {/* India Map */}
      <div className="rounded-xl bg-slate-900/50 border border-white/8 p-3 overflow-x-auto">
        <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
          Zone Map
        </p>
        <svg
          viewBox="0 0 600 400"
          className="w-full max-w-[600px] mx-auto"
          style={{ minWidth: 300 }}
          aria-label="India danger zone map"
        >
          <title>India Danger Zone Map</title>
          {/* Grid */}
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth={1}
              />
            </pattern>
          </defs>
          <rect width="600" height="400" fill="url(#grid)" />

          {/* India outline (simplified) */}
          <path
            d="M180,40 L220,35 L260,30 L300,25 L340,20 L380,22 L420,28 L460,35 L500,45 L520,60 L530,80 L525,100 L515,120 L500,140 L480,160 L460,180 L440,200 L420,220 L400,240 L380,260 L360,280 L340,300 L320,320 L300,340 L280,360 L260,370 L240,375 L220,370 L200,360 L180,350 L160,340 L140,330 L120,320 L100,310 L80,300 L70,280 L65,260 L70,240 L80,220 L90,200 L100,180 L110,160 L120,140 L130,120 L140,100 L150,80 L160,60 L170,50 Z"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth={2}
          />

          {/* Zone circles */}
          {DANGER_ZONES.map((zone) => {
            const { x, y } = toIndiaMapSVG(zone.lat, zone.lng);
            const r = circleRadius(zone.risk);
            const fill = circleColor(zone.risk);
            return (
              <g key={zone.id}>
                {zone.risk === "Critical" && (
                  <circle
                    cx={x}
                    cy={y}
                    r={r + 6}
                    fill="none"
                    stroke={fill}
                    strokeWidth={2}
                    opacity={0.4}
                  >
                    <animate
                      attributeName="r"
                      values={`${r + 2};${r + 10};${r + 2}`}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.6;0;0.6"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                <circle cx={x} cy={y} r={r} fill={fill} opacity={0.9}>
                  <title>{zone.name}</title>
                </circle>
              </g>
            );
          })}
        </svg>
        <div className="flex items-center gap-4 mt-2 justify-center text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block" />
            Critical
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500 inline-block" />
            High
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 inline-block" />
            Medium
          </span>
        </div>
      </div>
    </Card>
  );
}

// ─── Section 2: Live Night Conditions ────────────────────────────────────────

function getMoonPhase() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const c = Math.floor((year - 1900) / 100);
  const e = 2 - c + Math.floor(c / 4);
  const jd =
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    e -
    1524.5;
  const phase = ((jd - 2451550.1) / 29.530588) % 1;
  const p = phase < 0 ? phase + 1 : phase;
  if (p < 0.03 || p > 0.97) return { name: "New Moon", icon: "🌑" };
  if (p < 0.22) return { name: "Waxing Crescent", icon: "🌒" };
  if (p < 0.28) return { name: "First Quarter", icon: "🌓" };
  if (p < 0.47) return { name: "Waxing Gibbous", icon: "🌔" };
  if (p < 0.53) return { name: "Full Moon", icon: "🌕" };
  if (p < 0.72) return { name: "Waning Gibbous", icon: "🌖" };
  if (p < 0.78) return { name: "Last Quarter", icon: "🌗" };
  return { name: "Waning Crescent", icon: "🌘" };
}

function LiveNightConditions() {
  const [time, setTime] = useState(new Date());
  const [streetLights, setStreetLights] = useState(
    Math.floor(Math.random() * 14) + 65,
  );

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setStreetLights((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(60, Math.min(85, prev + delta));
      });
    }, 8000);
    return () => clearInterval(t);
  }, []);

  const hour = time.getHours();
  const isNightMode = hour >= 21 || hour < 5;
  const moon = getMoonPhase();

  return (
    <Card className="p-4 border-white/8" style={{ background: "#0f172a" }}>
      <SectionHeader
        icon={<Moon className="h-4 w-4 text-indigo-400" />}
        title="Live Night Conditions"
        subtitle="Real-time environmental and safety indicators"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="rounded-lg bg-white/5 border border-white/8 p-3 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
            Local Time
          </p>
          <p className="text-lg font-bold text-white font-mono">
            {time.toLocaleTimeString("en-IN", { hour12: false })}
          </p>
        </div>
        <div className="rounded-lg bg-white/5 border border-white/8 p-3 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
            Moon Phase
          </p>
          <p className="text-lg">{moon.icon}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{moon.name}</p>
        </div>
        <div className="rounded-lg bg-white/5 border border-white/8 p-3 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
            Street Lights
          </p>
          <p className="text-lg font-bold text-amber-400">{streetLights}%</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Active</p>
        </div>
        <div
          className={`rounded-lg border p-3 text-center ${
            isNightMode
              ? "bg-indigo-500/10 border-indigo-500/25"
              : "bg-white/5 border-white/8"
          }`}
        >
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
            Night Mode
          </p>
          <p
            className={`text-lg font-bold ${
              isNightMode ? "text-indigo-400" : "text-slate-500"
            }`}
          >
            {isNightMode ? "ACTIVE" : "OFF"}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {isNightMode ? "Enhanced monitoring" : "Daytime mode"}
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white/4 border border-white/8 p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300">
            <span className="text-white font-semibold">Tip:</span> Visibility
            drops significantly after 9 PM. Ensure headlights are on and
            maintain extra distance from other vehicles.
          </p>
        </div>
      </div>
    </Card>
  );
}

// ─── Section 3: Safest Night Hours ───────────────────────────────────────────

function SafestNightHours() {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const t = setInterval(() => setCurrentHour(new Date().getHours()), 60000);
    return () => clearInterval(t);
  }, []);

  const hourColor = (h: number) => {
    if (h >= 5 && h <= 8) return "bg-emerald-500/60";
    if (h >= 9 && h <= 19) return "bg-emerald-500/40";
    if (h >= 20 && h <= 22) return "bg-yellow-500/50";
    if (h === 23 || h === 0) return "bg-orange-500/60";
    if (h >= 1 && h <= 3) return "bg-red-500/70";
    return "bg-orange-500/50";
  };

  const hourLabel = (h: number) => {
    if (h === 0) return "12 AM";
    if (h < 12) return `${h} AM`;
    if (h === 12) return "12 PM";
    return `${h - 12} PM`;
  };

  return (
    <Card className="p-4 border-white/8" style={{ background: "#0f172a" }}>
      <SectionHeader
        icon={<Shield className="h-4 w-4 text-emerald-400" />}
        title="Safest Night Hours"
        subtitle="24-hour safety timeline for road travel"
      />

      <div className="mb-4">
        <div className="flex items-end gap-0.5 h-16">
          {Array.from({ length: 24 }, (_, h) => {
            const hourId = `night-hour-${h}`;
            return (
              <div
                key={hourId}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className={`w-full rounded-sm ${hourColor(h)} transition-all duration-500`}
                  style={{
                    height:
                      h >= 5 && h <= 8
                        ? "80%"
                        : h >= 9 && h <= 19
                          ? "70%"
                          : h >= 20 && h <= 22
                            ? "55%"
                            : h === 23 || h === 0
                              ? "40%"
                              : h >= 1 && h <= 3
                                ? "25%"
                                : "45%",
                  }}
                />
                {h % 3 === 0 && (
                  <span className="text-[9px] text-slate-500">
                    {hourLabel(h)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Current hour marker */}
        <div className="relative h-4 mt-1">
          <div
            className="absolute top-0 w-0.5 h-3 bg-white rounded-full"
            style={{ left: `${(currentHour / 23) * 100}%` }}
          />
          <div
            className="absolute -top-3 text-[9px] text-white font-semibold bg-indigo-500/80 px-1 rounded"
            style={{
              left: `${(currentHour / 23) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            Now
          </div>
        </div>
      </div>

      {/* Best window highlight */}
      <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌅</span>
          <div>
            <p className="text-xs font-semibold text-emerald-400">
              Best Window: 6 AM – 8 AM
            </p>
            <p className="text-[11px] text-slate-400">
              Lowest accident rate, best visibility, minimal traffic
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-emerald-500/60 inline-block" />
          Safe
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-yellow-500/50 inline-block" />
          Caution
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-orange-500/60 inline-block" />
          Risky
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-red-500/70 inline-block" />
          Danger
        </span>
      </div>

      <p className="text-xs text-slate-500 mt-3">
        <span className="text-white font-semibold">89%</span> of night accidents
        occur between{" "}
        <span className="text-red-400 font-semibold">11 PM – 3 AM</span>. Plan
        travel outside this window when possible.
      </p>
    </Card>
  );
}

// ─── Section 4: Street Light Coverage Index ──────────────────────────────────

function StreetLightIndex() {
  return (
    <Card className="p-4 border-white/8" style={{ background: "#0f172a" }}>
      <SectionHeader
        icon={<Lightbulb className="h-4 w-4 text-amber-400" />}
        title="Street Light Coverage Index"
        subtitle="% of roads with functional street lights by city"
      />

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={STREET_LIGHT_DATA}
          margin={{ top: 0, right: 8, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
          />
          <XAxis
            dataKey="city"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[50, 100]}
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
            }}
            labelStyle={{ color: "#e2e8f0" }}
            formatter={(v: number) => [`${v}%`, "Coverage"]}
          />
          <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
            {STREET_LIGHT_DATA.map((entry) => (
              <Cell
                key={entry.city}
                fill={
                  entry.pct >= 80
                    ? "#f59e0b"
                    : entry.pct >= 70
                      ? "#d97706"
                      : "#b45309"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-3 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
          <p className="text-xs text-amber-400 font-semibold">
            🇮🇳 India Average
          </p>
          <p className="text-xl font-bold text-white mt-0.5">
            72.1%{" "}
            <span className="text-sm font-normal text-slate-400">
              street light coverage
            </span>
          </p>
        </div>
        <div className="flex-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
          <p className="text-xs text-emerald-400 font-semibold">
            📈 This Month
          </p>
          <p className="text-xl font-bold text-white mt-0.5">
            12,847{" "}
            <span className="text-sm font-normal text-slate-400">
              lights repaired
            </span>
          </p>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
          Best-lit Cities Ranking
        </p>
        <div className="space-y-1.5">
          {[...STREET_LIGHT_DATA]
            .sort((a, b) => b.pct - a.pct)
            .map((city, i) => (
              <div key={city.city} className="flex items-center gap-2 text-sm">
                <span className="text-slate-600 w-4 text-right text-xs">
                  {i + 1}
                </span>
                <Lightbulb className="h-3 w-3 text-amber-400 flex-shrink-0" />
                <span className="text-slate-300 flex-1">{city.city}</span>
                <div className="w-28 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: `${((city.pct - 60) / 30) * 100}%` }}
                  />
                </div>
                <span className="text-amber-400 font-semibold text-xs w-10 text-right">
                  {city.pct}%
                </span>
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
}

// ─── Section 3: Night Accident Timeline ──────────────────────────────────────

const DANGER_HOURS = new Set(["10 PM", "11 PM", "12 AM", "1 AM", "2 AM"]);

function AccidentTimeline() {
  return (
    <Card className="p-4 border-white/8" style={{ background: "#0f172a" }}>
      <SectionHeader
        icon={<AlertTriangle className="h-4 w-4 text-red-400" />}
        title="When Night Accidents Happen Most"
        subtitle="Hourly accident frequency across Indian roads"
      />

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={ACCIDENT_TIMELINE}
          margin={{ top: 0, right: 8, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="accidentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
          />
          <XAxis
            dataKey="hour"
            tick={{ fill: "#64748b", fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            interval={3}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
            }}
            labelStyle={{ color: "#e2e8f0", fontSize: 12 }}
            formatter={(
              v: number,
              _: string,
              entry: { payload?: { hour: string } },
            ) => [
              `${v} accidents`,
              DANGER_HOURS.has(entry.payload?.hour ?? "")
                ? "⚠️ DANGER HOUR"
                : "Accidents",
            ]}
          />
          <Area
            type="monotone"
            dataKey="accidents"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#accidentGrad)"
            dot={(props: {
              cx: number;
              cy: number;
              payload: { hour: string };
            }) => {
              if (DANGER_HOURS.has(props.payload.hour)) {
                return (
                  <circle
                    key={`dot-${props.cx}`}
                    cx={props.cx}
                    cy={props.cy}
                    r={4}
                    fill="#ef4444"
                    stroke="#fca5a5"
                    strokeWidth={1.5}
                  />
                );
              }
              return <g key={`dot-${props.cx}`} />;
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-3 rounded-lg bg-red-500/10 border border-red-500/25 p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
            ⚠️ Danger Window: 10 PM – 2 AM
          </span>
        </div>
        <p className="text-xs text-slate-300">
          Most dangerous hour:{" "}
          <span className="text-red-400 font-semibold">11 PM – 1 AM</span> · 43%
          of night accidents occur in this window
        </p>
      </div>

      <div className="mt-3 rounded-lg bg-white/4 border border-white/8 p-3">
        <div className="flex items-start gap-2">
          <TrendingUp className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300">
            <span className="text-white font-semibold">Insight:</span> Night
            accidents are{" "}
            <span className="text-amber-400 font-semibold">
              2.3× more likely
            </span>{" "}
            during 10 PM – 2 AM. Always check Night Safety Score before driving
            late.
          </p>
        </div>
      </div>
    </Card>
  );
}

// ─── Section 4: Neighborhood Night Safety Ratings ────────────────────────────

type NeighborhoodEntry = (typeof NEIGHBORHOODS)["Delhi"][0];

function NeighborhoodRatings() {
  const [selectedCity, setSelectedCity] =
    useState<keyof typeof NEIGHBORHOODS>("Delhi");
  const [selectedArea, setSelectedArea] = useState<string>("Connaught Place");
  const [userStars, setUserStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [localScore, setLocalScore] = useState<Record<string, number>>({});

  const areas = NEIGHBORHOODS[selectedCity];
  const hood: NeighborhoodEntry =
    areas.find((a) => a.area === selectedArea) ?? areas[0];
  const displayScore =
    localScore[`${selectedCity}-${selectedArea}`] ?? hood.score;

  const handleCityChange = (c: string) => {
    setSelectedCity(c as keyof typeof NEIGHBORHOODS);
    setSelectedArea(NEIGHBORHOODS[c as keyof typeof NEIGHBORHOODS][0].area);
    setSubmitted(false);
    setUserStars(0);
  };

  const handleSubmit = () => {
    if (!userStars) return;
    const key = `${selectedCity}-${selectedArea}`;
    const base = localScore[key] ?? hood.score;
    const updated = Math.round(base * 0.85 + userStars * 20 * 0.15);
    setLocalScore((prev) => ({ ...prev, [key]: Math.min(100, updated) }));
    setSubmitted(true);
  };

  return (
    <Card className="p-4 border-white/8" style={{ background: "#0f172a" }}>
      <SectionHeader
        icon={<Users className="h-4 w-4 text-indigo-400" />}
        title="Neighborhood Night Safety Ratings"
        subtitle="Community-sourced safety scores by area"
      />

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Select value={selectedCity} onValueChange={handleCityChange}>
          <SelectTrigger
            className="flex-1 bg-white/5 border-white/15 text-white text-sm"
            data-ocid="nightsafety.neighborhood.city_select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/15">
            {Object.keys(NEIGHBORHOODS).map((c) => (
              <SelectItem
                key={c}
                value={c}
                className="text-slate-200 focus:bg-white/10"
              >
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedArea}
          onValueChange={(v) => {
            setSelectedArea(v);
            setSubmitted(false);
            setUserStars(0);
          }}
        >
          <SelectTrigger
            className="flex-1 bg-white/5 border-white/15 text-white text-sm"
            data-ocid="nightsafety.neighborhood.area_select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/15">
            {areas.map((a) => (
              <SelectItem
                key={a.area}
                value={a.area}
                className="text-slate-200 focus:bg-white/10"
              >
                {a.area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={`rounded-xl border p-4 mb-4 ${scoreBg(displayScore)}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              {hood.area}, {selectedCity}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Overall Night Safety
            </p>
          </div>
          <div className={`text-4xl font-bold ${scoreColor(displayScore)}`}>
            {displayScore}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { label: "Lighting", value: hood.lighting, type: "bar" },
            { label: "Road Quality", value: hood.road, type: "bar" },
            { label: "Traffic", value: hood.traffic, type: "bar" },
            { label: "Crime Level", value: hood.crime, type: "text" },
          ].map(({ label, value, type }) => (
            <div key={label} className="text-xs">
              <span className="text-slate-500">{label}</span>
              {type === "bar" ? (
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        (value as number) >= 75
                          ? "bg-emerald-500"
                          : (value as number) >= 60
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-slate-400 w-6 text-right">{value}</span>
                </div>
              ) : (
                <p
                  className={`mt-1 font-semibold ${crimeColor(value as string)}`}
                >
                  {value}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
        Recent Community Ratings
      </p>
      <div className="space-y-2 mb-4">
        {hood.ratings.map((r, i) => (
          <div
            key={r.user}
            className="flex items-start gap-2 rounded-lg bg-white/4 p-2.5"
            data-ocid={`nightsafety.rating.${i + 1}`}
          >
            <div className="h-7 w-7 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 text-xs text-indigo-400 font-semibold">
              {r.user[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-300">
                  {r.user}
                </span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((starNum) => (
                    <Star
                      key={`rev-star-${starNum}`}
                      className={`h-3 w-3 ${starNum <= r.stars ? "text-amber-400 fill-amber-400" : "text-slate-700"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {r.comment}
              </p>
            </div>
          </div>
        ))}
      </div>

      {submitted ? (
        <div
          className="rounded-lg bg-emerald-500/10 border border-emerald-500/25 p-3 text-center"
          data-ocid="nightsafety.rating.success_state"
        >
          <p className="text-sm font-semibold text-emerald-400">
            ✓ Thanks for your rating!
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Your feedback helps improve safety scores for everyone.
          </p>
          <button
            type="button"
            className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            onClick={() => {
              setSubmitted(false);
              setUserStars(0);
              setComment("");
            }}
            data-ocid="nightsafety.rating.rate_again_button"
          >
            Rate again
          </button>
        </div>
      ) : (
        <div className="rounded-lg bg-white/4 border border-white/8 p-3">
          <p className="text-xs font-semibold text-white mb-2">
            Rate This Area
          </p>
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }, (_, si) => (
              <button
                type="button"
                key={`rate-star-${si + 1}`}
                onMouseEnter={() => setHoverStars(si + 1)}
                onMouseLeave={() => setHoverStars(0)}
                onClick={() => setUserStars(si + 1)}
                data-ocid={`nightsafety.rating.star.${si + 1}`}
                aria-label={`Rate ${si + 1} stars`}
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    si < (hoverStars || userStars)
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-700"
                  }`}
                />
              </button>
            ))}
            {userStars > 0 && (
              <span className="text-xs text-slate-400 ml-2">
                {
                  ["Poor", "Fair", "Average", "Good", "Excellent"][
                    userStars - 1
                  ]
                }
              </span>
            )}
          </div>
          <Textarea
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none bg-white/5 border-white/15 text-white placeholder:text-slate-600 text-sm mb-2"
            rows={2}
            data-ocid="nightsafety.rating.comment_textarea"
          />
          <Button
            size="sm"
            disabled={!userStars}
            onClick={handleSubmit}
            className="bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-40"
            data-ocid="nightsafety.rating.submit_button"
          >
            Submit Rating
          </Button>
        </div>
      )}
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function NightSafetyPage() {
  return (
    <div
      className="p-4 md:p-6 space-y-6"
      style={{ background: "#0a0f1e", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
          <Moon className="h-5 w-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Night Safety Score</h1>
          <p className="text-sm text-slate-400">
            AI-calculated safety ratings for night travel across India
          </p>
        </div>
        <div className="sm:ml-auto flex items-center gap-2 text-xs">
          <Badge className="bg-indigo-500/15 text-indigo-400 border-0">
            Live Data
          </Badge>
          <Badge className="bg-emerald-500/15 text-emerald-400 border-0">
            AI-Powered
          </Badge>
        </div>
      </div>

      {/* City Night Safety Index */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
          City Night Safety Index
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CITY_SCORES.map((city, i) => (
            <Card
              key={city.city}
              className="p-4 border-white/8"
              style={{ background: "#0f172a" }}
              data-ocid={`nightsafety.city.${i + 1}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span className="font-semibold text-white text-sm">
                    {city.city}
                  </span>
                </div>
                <span
                  className={`text-2xl font-bold ${scoreColor(city.score)}`}
                >
                  {city.score}
                </span>
              </div>
              <CityMetrics city={city} />
            </Card>
          ))}
        </div>
      </div>

      {/* Feature sections */}
      <DangerZoneAlerts />
      <LiveNightConditions />
      <SafestNightHours />
      <StreetLightIndex />
      <AccidentTimeline />
      <NeighborhoodRatings />
    </div>
  );
}
