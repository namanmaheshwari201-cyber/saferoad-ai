import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────
interface RoadInfo {
  name: string;
  type: "NH" | "SH" | "City" | "Rural";
  agency: string;
  contractor: string;
  sanctioned: number;
  spent: number;
  health: number;
  surface: number;
  safety: number;
  maintenance: number;
  citizenRating: number;
  lastMaintained: string;
}

interface ComplaintItem {
  id: string;
  type: string;
  location: string;
  date: string;
  status:
    | "Submitted"
    | "Under Review"
    | "Assigned"
    | "In Progress"
    | "Resolved";
  description: string;
}

interface ContractorRow {
  rank: number;
  name: string;
  quality: number;
  ontime: number;
  citizenRating: number;
  complaintsResolved: number;
  overall: number;
  grade: "A" | "B" | "C" | "D";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const ROADS: RoadInfo[] = [
  {
    name: "NH-48 (Delhi–Mumbai)",
    type: "NH",
    agency: "NHAI",
    contractor: "L&T Construction",
    sanctioned: 2840,
    spent: 2210,
    health: 78,
    surface: 82,
    safety: 74,
    maintenance: 79,
    citizenRating: 77,
    lastMaintained: "Mar 2025",
  },
  {
    name: "NH-44 (Delhi–Chennai)",
    type: "NH",
    agency: "NHAI",
    contractor: "Gawar Construction",
    sanctioned: 3200,
    spent: 2650,
    health: 72,
    surface: 70,
    safety: 73,
    maintenance: 75,
    citizenRating: 70,
    lastMaintained: "Jan 2025",
  },
  {
    name: "Mumbai–Pune Expressway",
    type: "SH",
    agency: "MSRDC",
    contractor: "IRB Infrastructure",
    sanctioned: 1850,
    spent: 1790,
    health: 91,
    surface: 93,
    safety: 90,
    maintenance: 92,
    citizenRating: 89,
    lastMaintained: "Apr 2025",
  },
  {
    name: "NH-8 (Delhi–Jaipur)",
    type: "NH",
    agency: "NHAI",
    contractor: "Dilip Buildcon",
    sanctioned: 980,
    spent: 810,
    health: 65,
    surface: 62,
    safety: 66,
    maintenance: 68,
    citizenRating: 64,
    lastMaintained: "Nov 2024",
  },
  {
    name: "Bengaluru ORR",
    type: "City",
    agency: "BBMP",
    contractor: "KMC Constructions",
    sanctioned: 640,
    spent: 420,
    health: 48,
    surface: 44,
    safety: 50,
    maintenance: 46,
    citizenRating: 52,
    lastMaintained: "Sep 2024",
  },
  {
    name: "NH-19 (Delhi–Kolkata)",
    type: "NH",
    agency: "NHAI",
    contractor: "NCC Limited",
    sanctioned: 4100,
    spent: 3200,
    health: 80,
    surface: 82,
    safety: 78,
    maintenance: 81,
    citizenRating: 79,
    lastMaintained: "Feb 2025",
  },
  {
    name: "NH-66 (Mumbai–Kochi)",
    type: "NH",
    agency: "NHAI",
    contractor: "Afcons Infrastructure",
    sanctioned: 2100,
    spent: 1600,
    health: 58,
    surface: 55,
    safety: 60,
    maintenance: 57,
    citizenRating: 61,
    lastMaintained: "Oct 2024",
  },
  {
    name: "Chennai–Bangalore Highway",
    type: "SH",
    agency: "PWD Tamil Nadu",
    contractor: "HCC Limited",
    sanctioned: 760,
    spent: 510,
    health: 35,
    surface: 30,
    safety: 38,
    maintenance: 33,
    citizenRating: 39,
    lastMaintained: "Jul 2024",
  },
];

const MOCK_COMPLAINTS: ComplaintItem[] = [
  {
    id: "CMP-2025-0041",
    type: "Pothole",
    location: "NH-44, Nagpur bypass",
    date: "2025-05-28",
    status: "In Progress",
    description: "Large pothole near km marker 642, causing vehicle damage",
  },
  {
    id: "CMP-2025-0038",
    type: "Broken Signal",
    location: "MG Road, Bengaluru",
    date: "2025-05-25",
    status: "Assigned",
    description: "Traffic signal non-functional for 3 days",
  },
  {
    id: "CMP-2025-0034",
    type: "Waterlogging",
    location: "NH-48, Vadodara",
    date: "2025-05-20",
    status: "Resolved",
    description: "Persistent waterlogging during rains blocking one lane",
  },
  {
    id: "CMP-2025-0029",
    type: "Missing Sign",
    location: "SH-5, Pune outskirts",
    date: "2025-05-15",
    status: "Under Review",
    description: "Speed limit sign missing near school zone",
  },
  {
    id: "CMP-2025-0022",
    type: "Damaged Road",
    location: "Outer Ring Road, Hyderabad",
    date: "2025-05-10",
    status: "Submitted",
    description: "Multiple cracks and surface erosion over 200m stretch",
  },
];

const BUDGET_BY_STATE = [
  { state: "MH", approved: 4200, released: 3800, utilized: 3400 },
  { state: "UP", approved: 5100, released: 4200, utilized: 3600 },
  { state: "KA", approved: 2800, released: 2400, utilized: 2100 },
  { state: "TN", approved: 3100, released: 2700, utilized: 2300 },
  { state: "RJ", approved: 2200, released: 1900, utilized: 1650 },
  { state: "GJ", approved: 2600, released: 2200, utilized: 1900 },
  { state: "WB", approved: 2900, released: 2400, utilized: 2000 },
  { state: "TS", approved: 1900, released: 1600, utilized: 1350 },
];

const BUDGET_PIE = [
  { name: "Road Construction", value: 42 },
  { name: "Maintenance", value: 28 },
  { name: "Signage & Markings", value: 16 },
  { name: "Safety Equipment", value: 14 },
];

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

const ONGOING_PROJECTS = [
  {
    name: "Delhi–Meerut RRTS Expressway",
    state: "UP",
    agency: "NHAI",
    sanctioned: 1482,
    released: 1200,
    utilized: 1050,
    status: "In Progress",
  },
  {
    name: "Nagpur–Mumbai Super Communication Expressway",
    state: "MH",
    agency: "MSRDC",
    sanctioned: 5500,
    released: 3800,
    utilized: 3200,
    status: "In Progress",
  },
  {
    name: "Bengaluru Peripheral Ring Road",
    state: "KA",
    agency: "BBMP",
    sanctioned: 2280,
    released: 1400,
    utilized: 1100,
    status: "Under Review",
  },
  {
    name: "Purvanchal Expressway Extension",
    state: "UP",
    agency: "UPEIDA",
    sanctioned: 990,
    released: 720,
    utilized: 610,
    status: "In Progress",
  },
  {
    name: "Chennai Port Connectivity Project",
    state: "TN",
    agency: "PWD TN",
    sanctioned: 840,
    released: 550,
    utilized: 420,
    status: "Assigned",
  },
];

const CONTRACTORS: ContractorRow[] = [
  {
    rank: 1,
    name: "L&T Construction",
    quality: 94,
    ontime: 92,
    citizenRating: 90,
    complaintsResolved: 98,
    overall: 94,
    grade: "A",
  },
  {
    rank: 2,
    name: "IRB Infrastructure",
    quality: 91,
    ontime: 89,
    citizenRating: 88,
    complaintsResolved: 95,
    overall: 91,
    grade: "A",
  },
  {
    rank: 3,
    name: "Afcons Infrastructure",
    quality: 88,
    ontime: 86,
    citizenRating: 85,
    complaintsResolved: 91,
    overall: 88,
    grade: "A",
  },
  {
    rank: 4,
    name: "Dilip Buildcon",
    quality: 82,
    ontime: 80,
    citizenRating: 78,
    complaintsResolved: 84,
    overall: 81,
    grade: "B",
  },
  {
    rank: 5,
    name: "NCC Limited",
    quality: 79,
    ontime: 77,
    citizenRating: 75,
    complaintsResolved: 82,
    overall: 78,
    grade: "B",
  },
  {
    rank: 6,
    name: "HCC Limited",
    quality: 72,
    ontime: 68,
    citizenRating: 66,
    complaintsResolved: 74,
    overall: 70,
    grade: "C",
  },
  {
    rank: 7,
    name: "Gawar Construction",
    quality: 65,
    ontime: 62,
    citizenRating: 60,
    complaintsResolved: 68,
    overall: 64,
    grade: "C",
  },
  {
    rank: 8,
    name: "KMC Constructions",
    quality: 55,
    ontime: 50,
    citizenRating: 48,
    complaintsResolved: 55,
    overall: 52,
    grade: "D",
  },
];

const RECENT_REPAIRS = [
  {
    id: 1,
    location: "NH-44 km 580, Jabalpur",
    completed: "2025-05-29",
    contractor: "L&T Construction",
    type: "Pothole repair",
  },
  {
    id: 2,
    location: "Ring Road, Lucknow",
    completed: "2025-05-27",
    contractor: "Dilip Buildcon",
    type: "Resurfacing",
  },
  {
    id: 3,
    location: "NH-48 km 210, Ajmer",
    completed: "2025-05-24",
    contractor: "IRB Infrastructure",
    type: "Crack sealing",
  },
  {
    id: 4,
    location: "SH-17, Coimbatore bypass",
    completed: "2025-05-20",
    contractor: "HCC Limited",
    type: "Drainage repair",
  },
  {
    id: 5,
    location: "Outer Ring Road, Pune",
    completed: "2025-05-18",
    contractor: "Afcons Infrastructure",
    type: "Signal replacement",
  },
];

const ROUTE_MAP: Record<string, string> = {
  Pothole: "Municipal Corporation / PWD",
  "Broken Signal": "Municipal Corporation Traffic Department",
  "Damaged Road": "NHAI / PWD (based on road type)",
  "Missing Sign": "NHAI / State Highway Authority",
  Waterlogging: "Municipal Corporation Drainage Department",
  "Dangerous Intersection": "Traffic Police & Municipal Corporation",
  Other: "Municipal Corporation",
};

const STATUS_CONFIG: Record<ComplaintItem["status"], { cls: string }> = {
  Submitted: { cls: "bg-muted text-muted-foreground border-border" },
  "Under Review": { cls: "bg-primary/20 text-primary border-primary/30" },
  Assigned: { cls: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  "In Progress": {
    cls: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  Resolved: { cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
};

const GRADE_COLOR: Record<string, string> = {
  A: "text-emerald-400",
  B: "text-primary",
  C: "text-amber-400",
  D: "text-red-400",
};

// ─── Sub-components ────────────────────────────────────────────────────────
function HealthBar({ value, label }: { value: number; label?: string }) {
  const color =
    value >= 70
      ? "bg-emerald-500"
      : value >= 40
        ? "bg-amber-500"
        : "bg-red-500";
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{label}</span>
          <span className="font-mono">{value}</span>
        </div>
      )}
      <div className="h-1.5 w-full rounded-full bg-muted">
        <div
          className={`h-1.5 rounded-full transition-all ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function HealthBadge({ score }: { score: number }) {
  if (score >= 70)
    return (
      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
        {score}
      </Badge>
    );
  if (score >= 40)
    return (
      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
        {score}
      </Badge>
    );
  return (
    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
      {score}
    </Badge>
  );
}

function StatusBadge({ status }: { status: ComplaintItem["status"] }) {
  return (
    <Badge className={`text-xs ${STATUS_CONFIG[status].cls}`}>{status}</Badge>
  );
}

// ─── Tab 1: Road Map & Health ─────────────────────────────────────────────
function RoadMapTab() {
  const [location, setLocation] = useState<{
    city: string;
    state: string;
  } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ city: "Delhi", state: "Delhi" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = (await res.json()) as {
            address?: {
              city?: string;
              state?: string;
              town?: string;
              county?: string;
            };
          };
          const addr = data.address ?? {};
          setLocation({
            city: addr.city ?? addr.town ?? addr.county ?? "Unknown",
            state: addr.state ?? "India",
          });
        } catch {
          setLocation({ city: "Delhi", state: "Delhi" });
        }
      },
      () => setLocation({ city: "Delhi", state: "Delhi" }),
    );
  }, []);

  return (
    <div className="space-y-6" data-ocid="roadwatch.map_tab">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3">
        <span className="text-2xl">📍</span>
        <div>
          <p className="text-xs text-muted-foreground">Detected Location</p>
          <p className="font-semibold text-foreground">
            {location ? `${location.city}, ${location.state}` : "Detecting…"}
          </p>
        </div>
        <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          Live GPS
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ROADS.map((road, i) => (
          <Card
            key={road.name}
            className="border-border bg-card"
            data-ocid={`roadwatch.road_card.${i + 1}`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm font-semibold leading-tight text-foreground">
                  {road.name}
                </CardTitle>
                <Badge variant="outline" className="shrink-0 text-xs">
                  {road.type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {road.agency} · {road.contractor}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Sanctioned</span>
                <span className="font-mono text-foreground">
                  ₹{road.sanctioned.toLocaleString()}Cr
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Spent</span>
                <span className="font-mono text-foreground">
                  ₹{road.spent.toLocaleString()}Cr
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Health Score
                </span>
                <HealthBadge score={road.health} />
              </div>
              <HealthBar value={road.health} />
              <div className="space-y-1.5 pt-1">
                <HealthBar value={road.surface} label="Surface" />
                <HealthBar value={road.safety} label="Safety" />
                <HealthBar value={road.maintenance} label="Maintenance" />
                <HealthBar value={road.citizenRating} label="Citizens" />
              </div>
              <p className="text-xs text-muted-foreground">
                Last maintained: {road.lastMaintained}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Tab 2: AI Damage Detection ────────────────────────────────────────────
interface AIResult {
  defects: { name: string; severity: "Critical" | "High" | "Medium" | "Low" }[];
  conditionScore: number;
  recommendation: string;
}

const SEVERITY_CONFIG: Record<string, string> = {
  Critical: "bg-red-500/20 text-red-400 border-red-500/30",
  High: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

function DamageDetectionTab() {
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function processFile(file: File) {
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setSubmitted(false);
    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        defects: [
          { name: "Deep pothole (diameter ~40cm)", severity: "Critical" },
          { name: "Longitudinal cracks along lane edge", severity: "High" },
          { name: "Surface erosion", severity: "Medium" },
          { name: "Minor waterlogging marks", severity: "Low" },
        ],
        conditionScore: 31,
        recommendation:
          "Immediate resurfacing required. Apply bituminous macadam layer and seal all cracks. Estimated repair time: 3 days.",
      });
      setAnalyzing(false);
    }, 2000);
  }

  return (
    <div className="space-y-6" data-ocid="roadwatch.damage_tab">
      {/* Back button */}
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700"
        data-ocid="roadwatch.damage_back_button"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Upload Photo Panel */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
        }}
        onDragOver={(e) => e.preventDefault()}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-card p-12 transition-colors hover:border-primary/60 hover:bg-primary/5"
        data-ocid="roadwatch.damage_dropzone"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) processFile(e.target.files[0]);
          }}
        />
        <span className="text-5xl">🛣️</span>
        <p className="text-base font-medium text-foreground">
          Drop a road photo here or click to upload
        </p>
        <p className="text-sm text-muted-foreground">
          Supports JPG, PNG, WEBP — AI will analyze for potholes, cracks &
          waterlogging
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-ocid="roadwatch.upload_button"
        >
          Browse files
        </Button>
      </div>

      {preview && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm">Uploaded Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={preview}
                alt="Road"
                className="w-full rounded-lg object-cover max-h-64"
              />
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                AI Analysis Results
                {analyzing && (
                  <span className="inline-block h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyzing && (
                <p className="text-sm text-muted-foreground">
                  Analyzing road surface conditions…
                </p>
              )}
              {result && (
                <>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Defects Detected
                    </p>
                    {result.defects.map((d) => (
                      <div
                        key={d.name}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="text-sm text-foreground">
                          {d.name}
                        </span>
                        <Badge
                          className={`shrink-0 text-xs ${SEVERITY_CONFIG[d.severity]}`}
                        >
                          {d.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg bg-muted/40 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Overall Road Condition
                      </span>
                      <HealthBadge score={result.conditionScore} />
                    </div>
                    <HealthBar value={result.conditionScore} />
                  </div>
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                    <p className="text-xs font-semibold text-amber-400 mb-1">
                      Recommended Action
                    </p>
                    <p className="text-sm text-foreground">
                      {result.recommendation}
                    </p>
                  </div>
                  {submitted ? (
                    <div
                      className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3"
                      data-ocid="roadwatch.submit_success_state"
                    >
                      <p className="text-sm text-emerald-400">
                        ✓ Repair request submitted to NHAI — ticket CMP-2025-
                        {Math.floor(Math.random() * 900 + 100)} created
                      </p>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => {
                        setSubmitted(true);
                        toast.success("Repair request submitted to NHAI");
                      }}
                      data-ocid="roadwatch.submit_repair_button"
                    >
                      Submit for Repair
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Banner linking to AI Pothole Scanner */}
      <Card className="border-border bg-card overflow-hidden">
        <CardContent className="flex flex-col sm:flex-row items-center gap-4 p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/20 text-2xl">
            📹
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-base font-semibold text-foreground">
              Want live real-time detection?
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try the new AI Pothole Scanner — point your camera at road damage
              and see bounding boxes appear instantly with detailed
              descriptions.
            </p>
          </div>
          <Button
            type="button"
            className="shrink-0"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("navigate", {
                  detail: { page: "aipotholescanner" },
                }),
              );
            }}
            data-ocid="roadwatch.goto_aipotholescanner_button"
          >
            Open AI Pothole Scanner →
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Tab 3: Complaint System ───────────────────────────────────────────────
function ComplaintTab() {
  const [type, setType] = useState("");
  const [desc, setDesc] = useState("");
  const [severity, setSeverity] = useState("");
  const [city, setCity] = useState("Detecting location…");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`,
          );
          const data = (await res.json()) as {
            address?: { city?: string; town?: string; state?: string };
          };
          const a = data.address ?? {};
          setCity(`${a.city ?? a.town ?? "Unknown"}, ${a.state ?? "India"}`);
        } catch {
          setCity("Delhi, Delhi");
        }
      },
      () => setCity("Delhi, Delhi"),
    );
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    toast.success(
      `Complaint submitted! Routed to ${ROUTE_MAP[type] ?? "Municipal Corporation"}`,
    );
  }

  return (
    <div className="space-y-8" data-ocid="roadwatch.complaint_tab">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Submit a Road Complaint</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div
              className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-2"
              data-ocid="roadwatch.success_state"
            >
              <p className="text-3xl">✅</p>
              <p className="font-semibold text-emerald-400">
                Complaint Submitted Successfully
              </p>
              <p className="text-sm text-muted-foreground">
                Routed to:{" "}
                <span className="text-foreground font-medium">
                  {ROUTE_MAP[type] ?? "Municipal Corporation"}
                </span>
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSubmitted(false);
                  setType("");
                  setDesc("");
                  setSeverity("");
                }}
                data-ocid="roadwatch.new_complaint_button"
              >
                Submit Another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Complaint Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger data-ocid="roadwatch.complaint_type_select">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Pothole",
                        "Broken Signal",
                        "Damaged Road",
                        "Missing Sign",
                        "Waterlogging",
                        "Dangerous Intersection",
                        "Other",
                      ].map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select value={severity} onValueChange={setSeverity}>
                    <SelectTrigger data-ocid="roadwatch.severity_select">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Low", "Medium", "High", "Critical"].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location (Auto-detected)</Label>
                <div className="flex items-center gap-2 rounded-md border border-input bg-muted/30 px-3 py-2">
                  <span className="text-sm">📍</span>
                  <span className="text-sm text-foreground">{city}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Describe the issue in detail…"
                  rows={4}
                  required
                  data-ocid="roadwatch.complaint_textarea"
                />
              </div>
              {type && (
                <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
                  <p className="text-xs text-primary font-medium">
                    📡 Smart Routing Preview
                  </p>
                  <p className="text-sm text-foreground mt-0.5">
                    This complaint will be routed to:{" "}
                    <span className="font-semibold">{ROUTE_MAP[type]}</span>
                  </p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                data-ocid="roadwatch.submit_complaint_button"
              >
                Submit Complaint
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <div>
        <h3 className="text-base font-semibold text-foreground mb-4">
          Complaint Tracker
        </h3>
        <div className="space-y-3">
          {MOCK_COMPLAINTS.map((c, i) => (
            <Card
              key={c.id}
              className="border-border bg-card"
              data-ocid={`roadwatch.complaint_item.${i + 1}`}
            >
              <CardContent className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground">
                      {c.id}
                    </span>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="font-medium text-sm text-foreground truncate">
                    {c.type} — {c.location}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {c.description}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {c.date}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 4: Budget Transparency ────────────────────────────────────────────
function BudgetTab() {
  const totals = BUDGET_BY_STATE.reduce(
    (acc, s) => ({
      approved: acc.approved + s.approved,
      released: acc.released + s.released,
      utilized: acc.utilized + s.utilized,
    }),
    { approved: 0, released: 0, utilized: 0 },
  );

  return (
    <div className="space-y-6" data-ocid="roadwatch.budget_tab">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Approved Budget",
            value: totals.approved,
            color: "text-primary",
            icon: "📋",
          },
          {
            label: "Released Funds",
            value: totals.released,
            color: "text-amber-400",
            icon: "💸",
          },
          {
            label: "Utilized Funds",
            value: totals.utilized,
            color: "text-emerald-400",
            icon: "✅",
          },
          {
            label: "Remaining Funds",
            value: totals.released - totals.utilized,
            color: "text-red-400",
            icon: "⏳",
          },
        ].map((m, i) => (
          <Card
            key={m.label}
            className="border-border bg-card"
            data-ocid={`roadwatch.budget_metric.${i + 1}`}
          >
            <CardContent className="flex flex-col gap-1 p-5">
              <div className="flex items-center gap-2">
                <span className="text-xl">{m.icon}</span>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
              <p className={`text-2xl font-bold font-display ${m.color}`}>
                ₹{m.value.toLocaleString()}Cr
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm">
              Budget Utilization by State (₹ Crore)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={BUDGET_BY_STATE}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis
                  dataKey="state"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                    color: "#f1f5f9",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                <Bar
                  dataKey="approved"
                  name="Approved"
                  fill="#6366f1"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="released"
                  name="Released"
                  fill="#f59e0b"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="utilized"
                  name="Utilized"
                  fill="#10b981"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm">
              Budget Breakdown by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={BUDGET_PIE}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {BUDGET_PIE.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                    color: "#f1f5f9",
                  }}
                  formatter={(v: number) => [`${v}%`]}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm">Top 5 Ongoing Road Projects</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {[
                  "Project",
                  "State",
                  "Agency",
                  "Sanctioned",
                  "Released",
                  "Utilized",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ONGOING_PROJECTS.map((p, i) => (
                <tr
                  key={p.name}
                  className="border-b border-border/50 hover:bg-muted/20"
                  data-ocid={`roadwatch.project_row.${i + 1}`}
                >
                  <td className="py-3 pr-4 font-medium text-foreground max-w-[180px] truncate">
                    {p.name}
                  </td>
                  <td className="pr-4 text-muted-foreground">{p.state}</td>
                  <td className="pr-4 text-muted-foreground">{p.agency}</td>
                  <td className="pr-4 font-mono text-foreground">
                    ₹{p.sanctioned}Cr
                  </td>
                  <td className="pr-4 font-mono text-amber-400">
                    ₹{p.released}Cr
                  </td>
                  <td className="pr-4 font-mono text-emerald-400">
                    ₹{p.utilized}Cr
                  </td>
                  <td>
                    <StatusBadge status={p.status as ComplaintItem["status"]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Tab 5: Contractor Scoreboard ─────────────────────────────────────────
function ContractorTab() {
  const [verifyState, setVerifyState] = useState<
    Record<number, "complete" | "issue">
  >({});

  function handleVerify(id: number, outcome: "complete" | "issue") {
    setVerifyState((prev) => ({ ...prev, [id]: outcome }));
    if (outcome === "complete")
      toast.success("Repair verified as complete — thank you!");
    else toast.error("Issue reported — escalated to PWD authority");
  }

  const rankEmoji: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

  return (
    <div className="space-y-8" data-ocid="roadwatch.contractor_tab">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm">
            Contractor Performance Scoreboard
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {[
                  "Rank",
                  "Contractor",
                  "Quality",
                  "On-Time %",
                  "Citizen Rating",
                  "Complaints Resolved",
                  "Overall",
                  "Grade",
                ].map((h) => (
                  <th
                    key={h}
                    className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONTRACTORS.map((c, i) => (
                <tr
                  key={c.name}
                  className={`border-b border-border/50 hover:bg-muted/20 ${c.rank <= 3 ? "bg-primary/5" : ""}`}
                  data-ocid={`roadwatch.contractor_row.${i + 1}`}
                >
                  <td className="py-3 pr-4 text-lg font-bold">
                    {rankEmoji[c.rank] ?? (
                      <span className="text-muted-foreground text-sm">
                        #{c.rank}
                      </span>
                    )}
                  </td>
                  <td className="pr-4 font-medium text-foreground whitespace-nowrap">
                    {c.name}
                  </td>
                  <td className="pr-4 font-mono text-foreground">
                    {c.quality}
                  </td>
                  <td className="pr-4 font-mono text-foreground">
                    {c.ontime}%
                  </td>
                  <td className="pr-4 font-mono text-foreground">
                    {c.citizenRating}
                  </td>
                  <td className="pr-4 font-mono text-foreground">
                    {c.complaintsResolved}%
                  </td>
                  <td className="pr-4">
                    <HealthBadge score={c.overall} />
                  </td>
                  <td className={`font-bold text-base ${GRADE_COLOR[c.grade]}`}>
                    {c.grade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-base font-semibold text-foreground mb-4">
          Citizen Verification — Recently Completed Repairs
        </h3>
        <div className="space-y-3">
          {RECENT_REPAIRS.map((r) => (
            <Card
              key={r.id}
              className="border-border bg-card"
              data-ocid={`roadwatch.repair_item.${r.id}`}
            >
              <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">
                    {r.type} — {r.location}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    By {r.contractor} · Completed {r.completed}
                  </p>
                </div>
                {verifyState[r.id] == null ? (
                  <div className="flex gap-2 shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => handleVerify(r.id, "complete")}
                      data-ocid={`roadwatch.verify_complete_button.${r.id}`}
                    >
                      ✓ Verify Complete
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleVerify(r.id, "issue")}
                      data-ocid={`roadwatch.issue_button.${r.id}`}
                    >
                      ⚠ Issue Found
                    </Button>
                  </div>
                ) : (
                  <Badge
                    className={
                      verifyState[r.id] === "complete"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }
                    data-ocid={`roadwatch.verify_result.${r.id}`}
                  >
                    {verifyState[r.id] === "complete"
                      ? "✓ Verified"
                      : "⚠ Issue Reported"}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export function RoadWatchPage() {
  return (
    <div className="min-h-screen bg-background" data-ocid="roadwatch.page">
      <div className="border-b border-border bg-card px-4 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <span className="text-xl">🛣️</span>
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-foreground">
              RoadWatch
            </h1>
            <p className="text-sm text-muted-foreground">
              Road Monitoring, Transparency &amp; Complaint System
            </p>
          </div>
          <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hidden sm:flex">
            India-wide
          </Badge>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        <Tabs defaultValue="map">
          <TabsList className="mb-6 flex h-auto flex-wrap gap-1 bg-card p-1">
            <TabsTrigger
              value="map"
              className="text-xs sm:text-sm"
              data-ocid="roadwatch.map_tab_trigger"
            >
              🗺 Road Map &amp; Health
            </TabsTrigger>
            <TabsTrigger
              value="damage"
              className="text-xs sm:text-sm"
              data-ocid="roadwatch.damage_tab_trigger"
            >
              🔍 AI Damage Detection
            </TabsTrigger>
            <TabsTrigger
              value="complaint"
              className="text-xs sm:text-sm"
              data-ocid="roadwatch.complaint_tab_trigger"
            >
              📣 Complaints
            </TabsTrigger>
            <TabsTrigger
              value="budget"
              className="text-xs sm:text-sm"
              data-ocid="roadwatch.budget_tab_trigger"
            >
              💰 Budget Transparency
            </TabsTrigger>
            <TabsTrigger
              value="contractor"
              className="text-xs sm:text-sm"
              data-ocid="roadwatch.contractor_tab_trigger"
            >
              🏆 Contractor Scoreboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <RoadMapTab />
          </TabsContent>
          <TabsContent value="damage">
            <DamageDetectionTab />
          </TabsContent>
          <TabsContent value="complaint">
            <ComplaintTab />
          </TabsContent>
          <TabsContent value="budget">
            <BudgetTab />
          </TabsContent>
          <TabsContent value="contractor">
            <ContractorTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
