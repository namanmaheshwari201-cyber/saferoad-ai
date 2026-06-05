import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Bell, MapPin, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Blackspot {
  id: number;
  location: string;
  city: string;
  road: string;
  accidentCount: number;
  riskScore: number;
  roadType: string;
  lastAccident: string;
  riskLevel: "High" | "Medium" | "Low";
  coordinates: string;
}

const BLACKSPOTS: Blackspot[] = [
  {
    id: 1,
    location: "NH-8 Mahipalpur Flyover",
    city: "Delhi",
    road: "NH-8",
    accidentCount: 47,
    riskScore: 92,
    roadType: "National Highway",
    lastAccident: "2024-12-28",
    riskLevel: "High",
    coordinates: "28.5355°N, 77.1197°E",
  },
  {
    id: 2,
    location: "Mumbai-Pune Expressway Km 34",
    city: "Mumbai",
    road: "Mumbai-Pune Expressway",
    accidentCount: 38,
    riskScore: 87,
    roadType: "Expressway",
    lastAccident: "2024-12-30",
    riskLevel: "High",
    coordinates: "18.6741°N, 73.3930°E",
  },
  {
    id: 3,
    location: "Bengaluru ORR Silk Board Junction",
    city: "Bengaluru",
    road: "Outer Ring Road",
    accidentCount: 29,
    riskScore: 74,
    roadType: "Ring Road",
    lastAccident: "2024-12-26",
    riskLevel: "High",
    coordinates: "12.9177°N, 77.6233°E",
  },
  {
    id: 4,
    location: "Chennai ECR Kovalam Stretch",
    city: "Chennai",
    road: "East Coast Road",
    accidentCount: 22,
    riskScore: 68,
    roadType: "State Highway",
    lastAccident: "2024-12-25",
    riskLevel: "Medium",
    coordinates: "12.7890°N, 80.2454°E",
  },
  {
    id: 5,
    location: "Hyderabad ORR Patancheru Exit",
    city: "Hyderabad",
    road: "Outer Ring Road",
    accidentCount: 31,
    riskScore: 81,
    roadType: "Ring Road",
    lastAccident: "2024-12-29",
    riskLevel: "High",
    coordinates: "17.5362°N, 78.2673°E",
  },
  {
    id: 6,
    location: "Kolkata NH-16 Dankuni Junction",
    city: "Kolkata",
    road: "NH-16",
    accidentCount: 18,
    riskScore: 55,
    roadType: "National Highway",
    lastAccident: "2024-12-22",
    riskLevel: "Medium",
    coordinates: "22.6816°N, 88.2833°E",
  },
  {
    id: 7,
    location: "Jaipur Ajmer Road Durgapura",
    city: "Jaipur",
    road: "Ajmer Road",
    accidentCount: 14,
    riskScore: 42,
    roadType: "State Highway",
    lastAccident: "2024-12-20",
    riskLevel: "Medium",
    coordinates: "26.8510°N, 75.7740°E",
  },
  {
    id: 8,
    location: "Lucknow Ring Road Aliganj Crossing",
    city: "Lucknow",
    road: "Ring Road",
    accidentCount: 9,
    riskScore: 31,
    roadType: "Ring Road",
    lastAccident: "2024-12-18",
    riskLevel: "Low",
    coordinates: "26.8800°N, 80.9476°E",
  },
];

function getRiskColor(level: string) {
  if (level === "High")
    return {
      bg: "bg-red-500/15",
      border: "border-red-500/40",
      text: "text-red-400",
      badge: "bg-red-500/20 text-red-400",
    };
  if (level === "Medium")
    return {
      bg: "bg-amber-500/15",
      border: "border-amber-500/40",
      text: "text-amber-400",
      badge: "bg-amber-500/20 text-amber-400",
    };
  return {
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-400",
  };
}

function RiskMeter({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-red-500"
      : score >= 50
        ? "bg-amber-500"
        : "bg-emerald-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-bold text-slate-200 w-8 text-right">
        {score}
      </span>
    </div>
  );
}

export function BlackspotPage() {
  const [alertsSent, setAlertsSent] = useState<Set<number>>(new Set());

  const highRisk = BLACKSPOTS.filter((b) => b.riskLevel === "High").length;
  const mediumRisk = BLACKSPOTS.filter((b) => b.riskLevel === "Medium").length;
  const _lowRisk = BLACKSPOTS.filter((b) => b.riskLevel === "Low").length;

  const handleAlert = (spot: Blackspot) => {
    setAlertsSent((prev) => new Set([...prev, spot.id]));
    toast.success(`Alert sent to traffic authorities for ${spot.location}`, {
      description: `Risk Score: ${spot.riskScore}/100 — Authorities notified via NHAI/PWD`,
      duration: 4000,
    });
  };

  return (
    <div
      className="p-4 md:p-6 space-y-6"
      style={{ background: "#0a0f1e", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
            <Zap className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              AI Blackspot Detector
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              High-risk accident zones identified by AI analysis
            </p>
          </div>
        </div>
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {highRisk} Critical Zones
        </Badge>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Total Blackspots",
            value: BLACKSPOTS.length,
            color: "text-slate-200",
            icon: <MapPin className="h-4 w-4" />,
          },
          {
            label: "High Risk",
            value: highRisk,
            color: "text-red-400",
            icon: <AlertTriangle className="h-4 w-4" />,
          },
          {
            label: "Medium Risk",
            value: mediumRisk,
            color: "text-amber-400",
            icon: <Shield className="h-4 w-4" />,
          },
          {
            label: "Alerts Sent",
            value: alertsSent.size,
            color: "text-emerald-400",
            icon: <Bell className="h-4 w-4" />,
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="border-white/10"
            style={{ background: "#0f172a" }}
          >
            <CardContent className="p-4">
              <div className={`flex items-center gap-2 mb-1 ${stat.color}`}>
                {stat.icon}
                <span className="text-xs">{stat.label}</span>
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <span className="text-slate-400 font-medium">Risk Legend:</span>
        {[
          { label: "High Risk (80-100)", color: "bg-red-500" },
          { label: "Medium Risk (50-79)", color: "bg-amber-500" },
          { label: "Low Risk (0-49)", color: "bg-emerald-500" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`h-2.5 w-2.5 rounded-full ${l.color}`} />
            <span className="text-slate-300">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Blackspot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BLACKSPOTS.map((spot) => {
          const colors = getRiskColor(spot.riskLevel);
          const sent = alertsSent.has(spot.id);
          return (
            <div
              key={spot.id}
              data-ocid={`blackspot.item.${spot.id}`}
              className={`rounded-xl border p-4 space-y-3 transition-all ${colors.bg} ${colors.border}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white text-sm">
                      {spot.location}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${colors.badge}`}
                    >
                      {spot.riskLevel} Risk
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-400">
                      {spot.city} · {spot.roadType}
                    </span>
                  </div>
                </div>
                <div className={`text-2xl font-black ${colors.text}`}>
                  {spot.riskScore}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Risk Score</span>
                </div>
                <RiskMeter score={spot.riskScore} />
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div
                  style={{ background: "rgba(255,255,255,0.05)" }}
                  className="rounded-lg p-2"
                >
                  <div className="text-slate-400">Accidents</div>
                  <div className="font-bold text-white">
                    {spot.accidentCount}
                  </div>
                </div>
                <div
                  style={{ background: "rgba(255,255,255,0.05)" }}
                  className="rounded-lg p-2"
                >
                  <div className="text-slate-400">Road</div>
                  <div className="font-bold text-white truncate">
                    {spot.road}
                  </div>
                </div>
                <div
                  style={{ background: "rgba(255,255,255,0.05)" }}
                  className="rounded-lg p-2"
                >
                  <div className="text-slate-400">Last Incident</div>
                  <div className="font-bold text-white">
                    {spot.lastAccident.slice(5)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500">
                  {spot.coordinates}
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleAlert(spot)}
                  disabled={sent}
                  data-ocid={`blackspot.alert_button.${spot.id}`}
                  className={
                    sent
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs h-7"
                      : "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 text-xs h-7"
                  }
                >
                  <Bell className="h-3 w-3 mr-1" />
                  {sent ? "Alert Sent" : "Alert Authorities"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BlackspotPage;
