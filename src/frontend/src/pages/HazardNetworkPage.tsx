import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  ThumbsUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const HAZARD_TYPES = [
  "Pothole",
  "Fallen Tree",
  "Waterlogging",
  "Animals on Road",
  "Debris",
  "Accident",
  "Roadblock",
  "Flood",
  "Landslide",
];
const SEVERITIES = ["Low", "Medium", "High", "Critical"] as const;
const CITIES = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Jaipur",
  "Lucknow",
  "Ahmedabad",
  "Surat",
  "Nagpur",
];

type Severity = (typeof SEVERITIES)[number];

interface HazardReport {
  id: number;
  type: string;
  location: string;
  city: string;
  severity: Severity;
  reporter: string;
  timeAgo: string;
  upvotes: number;
  verified: boolean;
  description: string;
}

const LIVE_HAZARDS: HazardReport[] = [
  {
    id: 1,
    type: "Pothole",
    location: "NH-8 near Mahipalpur",
    city: "Delhi",
    severity: "High",
    reporter: "Rahul M.",
    timeAgo: "12 min ago",
    upvotes: 24,
    verified: false,
    description: "Large pothole ~30cm deep, dangerous at night",
  },
  {
    id: 2,
    type: "Waterlogging",
    location: "Andheri East, LBS Road",
    city: "Mumbai",
    severity: "Critical",
    reporter: "Priya S.",
    timeAgo: "8 min ago",
    upvotes: 47,
    verified: true,
    description: "Road flooded knee-deep, traffic halted",
  },
  {
    id: 3,
    type: "Accident",
    location: "ORR near Silk Board",
    city: "Bengaluru",
    severity: "Critical",
    reporter: "Kiran R.",
    timeAgo: "5 min ago",
    upvotes: 62,
    verified: true,
    description: "Two vehicles collision, right lane blocked",
  },
  {
    id: 4,
    type: "Animals on Road",
    location: "Hyderabad ORR Km 42",
    city: "Hyderabad",
    severity: "Medium",
    reporter: "Suresh K.",
    timeAgo: "23 min ago",
    upvotes: 15,
    verified: false,
    description: "Stray cattle on highway, drive carefully",
  },
  {
    id: 5,
    type: "Roadblock",
    location: "NH-16 Dankuni",
    city: "Kolkata",
    severity: "High",
    reporter: "Amit D.",
    timeAgo: "31 min ago",
    upvotes: 19,
    verified: false,
    description: "VIP movement, alternate route required",
  },
  {
    id: 6,
    type: "Debris",
    location: "ECR Kovalam Stretch",
    city: "Chennai",
    severity: "Medium",
    reporter: "Anitha V.",
    timeAgo: "44 min ago",
    upvotes: 11,
    verified: false,
    description: "Sand and rocks on road after construction",
  },
  {
    id: 7,
    type: "Fallen Tree",
    location: "Jaipur Ajmer Road Km 18",
    city: "Jaipur",
    severity: "High",
    reporter: "Vishal J.",
    timeAgo: "1 hr ago",
    upvotes: 28,
    verified: true,
    description: "Large tree blocking left lane, use right",
  },
  {
    id: 8,
    type: "Flood",
    location: "Lucknow Ring Road",
    city: "Lucknow",
    severity: "Medium",
    reporter: "Neha G.",
    timeAgo: "1.5 hr ago",
    upvotes: 9,
    verified: false,
    description: "Waterlogging after heavy rain, slow movement",
  },
  {
    id: 9,
    type: "Pothole",
    location: "Pune-Nashik Highway Km 28",
    city: "Pune",
    severity: "Low",
    reporter: "Rohan P.",
    timeAgo: "2 hr ago",
    upvotes: 6,
    verified: false,
    description: "Multiple small potholes in left lane",
  },
  {
    id: 10,
    type: "Accident",
    location: "Ahmedabad-Vadodara Expressway",
    city: "Ahmedabad",
    severity: "High",
    reporter: "Manish B.",
    timeAgo: "2.5 hr ago",
    upvotes: 33,
    verified: true,
    description: "Truck overturned, right lane closed",
  },
];

const SEV_CONFIG: Record<
  Severity,
  { bg: string; text: string; border: string }
> = {
  Low: {
    bg: "bg-slate-500/20",
    text: "text-slate-300",
    border: "border-slate-500/30",
  },
  Medium: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  High: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
  },
  Critical: {
    bg: "bg-red-600/30",
    text: "text-red-300",
    border: "border-red-600/50",
  },
};

export function HazardNetworkPage() {
  const [hazardType, setHazardType] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<Severity | "">("");
  const [upvotes, setUpvotes] = useState<Record<number, boolean>>({});
  const [verifiedLocal, setVerifiedLocal] = useState<Record<number, boolean>>(
    {},
  );

  const stats = {
    active: LIVE_HAZARDS.filter((h) =>
      ["High", "Critical"].includes(h.severity),
    ).length,
    lastHour: LIVE_HAZARDS.filter((h) => !h.timeAgo.includes("hr")).length,
    cleared: 8,
    contributors: 342,
  };

  const handleSubmit = () => {
    if (!hazardType || !location || !city || !severity) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Hazard reported successfully!", {
      description: `${hazardType} at ${location}, ${city} — Severity: ${severity}. Alert sent to nearby drivers.`,
    });
    setHazardType("");
    setLocation("");
    setCity("");
    setDescription("");
    setSeverity("");
  };

  const handleUpvote = (id: number) => {
    if (upvotes[id]) return;
    setUpvotes((p) => ({ ...p, [id]: true }));
    toast.success("Upvoted! Hazard confirmed.", { duration: 2000 });
  };

  const handleVerify = (id: number, type: string) => {
    setVerifiedLocal((p) => ({ ...p, [id]: true }));
    toast.success(`${type} hazard verified`, {
      description: "Status updated. Authorities notified.",
      duration: 3000,
    });
  };

  return (
    <div
      className="p-4 md:p-6 space-y-6"
      style={{ background: "#0a0f1e", minHeight: "100vh" }}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
          <Users className="h-5 w-5 text-rose-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">
            Community Hazard Network
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Crowd-powered hazard alerts — warn other drivers in real time
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Active Hazards",
            value: stats.active,
            color: "text-red-400",
          },
          {
            label: "Reports Last Hour",
            value: stats.lastHour,
            color: "text-amber-400",
          },
          {
            label: "Cleared Today",
            value: stats.cleared,
            color: "text-emerald-400",
          },
          {
            label: "Contributors",
            value: stats.contributors,
            color: "text-blue-400",
          },
        ].map((s) => (
          <Card
            key={s.label}
            className="border-white/10"
            style={{ background: "#0f172a" }}
          >
            <CardContent className="p-4">
              <div className="text-xs text-slate-400 mb-1">{s.label}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Form */}
      <Card className="border-rose-500/20" style={{ background: "#0f172a" }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-rose-400 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Report a Hazard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label
                htmlFor="hazard-type"
                className="text-xs text-slate-400 mb-1.5 block"
              >
                Hazard Type *
              </label>
              <select
                id="hazard-type"
                value={hazardType}
                onChange={(e) => setHazardType(e.target.value)}
                data-ocid="hazard.type_select"
                className="w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-rose-400/50"
                style={{ background: "#0a0f1e" }}
              >
                <option value="">-- Select Type --</option>
                {HAZARD_TYPES.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="hazard-city"
                className="text-xs text-slate-400 mb-1.5 block"
              >
                City *
              </label>
              <select
                id="hazard-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                data-ocid="hazard.city_select"
                className="w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-rose-400/50"
                style={{ background: "#0a0f1e" }}
              >
                <option value="">-- Select City --</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="hazard-location"
                className="text-xs text-slate-400 mb-1.5 block"
              >
                Location *
              </label>
              <input
                id="hazard-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Street, Landmark..."
                data-ocid="hazard.location_input"
                className="w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-rose-400/50"
                style={{ background: "#0a0f1e" }}
              />
            </div>
            <div>
              <label
                htmlFor="hazard-severity"
                className="text-xs text-slate-400 mb-1.5 block"
              >
                Severity *
              </label>
              <select
                id="hazard-severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
                data-ocid="hazard.severity_select"
                className="w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-rose-400/50"
                style={{ background: "#0a0f1e" }}
              >
                <option value="">-- Severity --</option>
                {SEVERITIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the hazard in detail..."
            rows={2}
            data-ocid="hazard.description_textarea"
            className="w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-white placeholder-slate-600 resize-none focus:outline-none focus:ring-1 focus:ring-rose-400/50"
            style={{ background: "#0a0f1e" }}
          />
          <Button
            type="button"
            onClick={handleSubmit}
            data-ocid="hazard.submit_button"
            className="bg-rose-500 hover:bg-rose-600 text-white font-semibold"
          >
            <AlertTriangle className="h-4 w-4 mr-2" /> Submit Report
          </Button>
        </CardContent>
      </Card>

      {/* Live Feed */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </div>
          Live Hazard Feed
        </h2>
        <div className="space-y-3">
          {LIVE_HAZARDS.map((h) => {
            const cfg = SEV_CONFIG[h.severity];
            const isVerified = h.verified || verifiedLocal[h.id];
            const votedUp = upvotes[h.id];
            return (
              <div
                key={h.id}
                data-ocid={`hazard.report.${h.id}`}
                className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`h-8 w-8 rounded-lg ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0 mt-0.5`}
                    >
                      <AlertTriangle className={`h-4 w-4 ${cfg.text}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white text-sm">
                          {h.type}
                        </span>
                        <Badge
                          className={`${cfg.bg} ${cfg.text} ${cfg.border} border text-[10px]`}
                        >
                          {h.severity}
                        </Badge>
                        {isVerified && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 border text-[10px]">
                            <CheckCircle className="h-3 w-3 mr-0.5" /> Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        <span className="text-xs text-slate-400">
                          {h.location}, {h.city}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        {h.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
                        <span>Reported by {h.reporter}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {h.timeAgo}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleUpvote(h.id)}
                      data-ocid={`hazard.upvote_button.${h.id}`}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
                        votedUp
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          : "border-white/15 text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      <ThumbsUp className="h-3 w-3" />
                      {h.upvotes + (votedUp ? 1 : 0)}
                    </button>
                    {!isVerified && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleVerify(h.id, h.type)}
                        data-ocid={`hazard.verify_button.${h.id}`}
                        className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs h-7"
                      >
                        Verify
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HazardNetworkPage;
