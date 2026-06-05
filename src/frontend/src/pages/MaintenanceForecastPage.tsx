import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Calendar, IndianRupee, Wrench } from "lucide-react";
import { toast } from "sonner";

interface ForecastRow {
  id: number;
  road: string;
  city: string;
  healthPct: number;
  predictedFailure: string;
  daysUntilFailure: number;
  urgency: "Critical" | "High" | "Medium" | "Low";
  estimatedCost: number;
  maintenanceType: string;
}

const FORECASTS: ForecastRow[] = [
  {
    id: 1,
    road: "NH-8 Gurgaon Stretch",
    city: "Delhi",
    healthPct: 18,
    predictedFailure: "2025-02-10",
    daysUntilFailure: 41,
    urgency: "Critical",
    estimatedCost: 4200000,
    maintenanceType: "Full Resurfacing",
  },
  {
    id: 2,
    road: "Mumbai-Pune Expressway Km 45-60",
    city: "Mumbai",
    healthPct: 24,
    predictedFailure: "2025-02-25",
    daysUntilFailure: 56,
    urgency: "Critical",
    estimatedCost: 8700000,
    maintenanceType: "Emergency Patching",
  },
  {
    id: 3,
    road: "Hyderabad ORR Sector 7",
    city: "Hyderabad",
    healthPct: 31,
    predictedFailure: "2025-03-15",
    daysUntilFailure: 74,
    urgency: "High",
    estimatedCost: 3500000,
    maintenanceType: "Surface Treatment",
  },
  {
    id: 4,
    road: "Chennai ECR Kovalam-Kelambakkam",
    city: "Chennai",
    healthPct: 37,
    predictedFailure: "2025-03-28",
    daysUntilFailure: 87,
    urgency: "High",
    estimatedCost: 2800000,
    maintenanceType: "Crack Sealing",
  },
  {
    id: 5,
    road: "Kolkata NH-16 Dankuni-Kolaghat",
    city: "Kolkata",
    healthPct: 42,
    predictedFailure: "2025-04-10",
    daysUntilFailure: 100,
    urgency: "High",
    estimatedCost: 5100000,
    maintenanceType: "Base Course Repair",
  },
  {
    id: 6,
    road: "Lucknow Ring Road Segment A",
    city: "Lucknow",
    healthPct: 55,
    predictedFailure: "2025-05-01",
    daysUntilFailure: 121,
    urgency: "Medium",
    estimatedCost: 1900000,
    maintenanceType: "Pothole Filling",
  },
  {
    id: 7,
    road: "Jaipur-Ajmer SH-8",
    city: "Jaipur",
    healthPct: 61,
    predictedFailure: "2025-05-20",
    daysUntilFailure: 140,
    urgency: "Medium",
    estimatedCost: 2200000,
    maintenanceType: "Micro Surfacing",
  },
  {
    id: 8,
    road: "Pune Outer Ring Road",
    city: "Pune",
    healthPct: 67,
    predictedFailure: "2025-06-15",
    daysUntilFailure: 166,
    urgency: "Medium",
    estimatedCost: 1600000,
    maintenanceType: "Preventive Maintenance",
  },
  {
    id: 9,
    road: "Surat Circular Road",
    city: "Surat",
    healthPct: 73,
    predictedFailure: "2025-07-30",
    daysUntilFailure: 211,
    urgency: "Low",
    estimatedCost: 900000,
    maintenanceType: "Routine Inspection",
  },
  {
    id: 10,
    road: "Ahmedabad-Vadodara Expressway",
    city: "Ahmedabad",
    healthPct: 82,
    predictedFailure: "2025-09-01",
    daysUntilFailure: 243,
    urgency: "Low",
    estimatedCost: 700000,
    maintenanceType: "Scheduled Maintenance",
  },
];

const URGENCY_CONFIG = {
  Critical: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
  },
  High: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  Medium: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  Low: {
    bg: "bg-slate-500/20",
    text: "text-slate-400",
    border: "border-slate-500/30",
  },
};

function HealthBar({ pct }: { pct: number }) {
  const color =
    pct < 30
      ? "bg-red-500"
      : pct < 50
        ? "bg-amber-500"
        : pct < 70
          ? "bg-blue-500"
          : "bg-emerald-500";
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden min-w-[40px]">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold text-slate-300 w-8 text-right shrink-0">
        {pct}%
      </span>
    </div>
  );
}

export function MaintenanceForecastPage() {
  const critical = FORECASTS.filter((f) => f.urgency === "Critical").length;
  const high = FORECASTS.filter((f) => f.urgency === "High").length;
  const totalCost = FORECASTS.reduce((s, f) => s + f.estimatedCost, 0);

  const handleSchedule = (row: ForecastRow) => {
    toast.success(`Maintenance scheduled for ${row.road}`, {
      description: `${row.maintenanceType} — Estimated cost: ₹${(row.estimatedCost / 100000).toFixed(1)}L`,
    });
  };

  return (
    <div
      className="p-4 md:p-6 space-y-6"
      style={{ background: "#0a0f1e", minHeight: "100vh" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
            <Wrench className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              AI Road Maintenance Forecast
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Predictive AI identifies roads before they fail
            </p>
          </div>
        </div>
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {critical} Critical
        </Badge>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Urgent Attention",
            value: critical + high,
            color: "text-red-400",
          },
          { label: "Critical Roads", value: critical, color: "text-red-400" },
          { label: "High Priority", value: high, color: "text-amber-400" },
          {
            label: "Total Cost Est.",
            value: `₹${(totalCost / 10000000).toFixed(1)}Cr`,
            color: "text-purple-400",
          },
        ].map((s) => (
          <Card
            key={s.label}
            className="border-white/10"
            style={{ background: "#0f172a" }}
          >
            <CardContent className="p-4">
              <div className="text-xs text-slate-400 mb-1">{s.label}</div>
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="border-white/10" style={{ background: "#0f172a" }}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {[
                    "Road Name",
                    "City",
                    "Health",
                    "Predicted Failure",
                    "Days Left",
                    "Urgency",
                    "Est. Cost (₹)",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs text-slate-400 font-semibold whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FORECASTS.map((row) => {
                  const cfg = URGENCY_CONFIG[row.urgency];
                  return (
                    <tr
                      key={row.id}
                      data-ocid={`forecast.row.${row.id}`}
                      className="border-b border-white/6 hover:bg-white/3 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-white text-xs">
                          {row.road}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {row.maintenanceType}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-300 whitespace-nowrap">
                        {row.city}
                      </td>
                      <td className="px-4 py-3 min-w-[100px]">
                        <HealthBar pct={row.healthPct} />
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-500" />
                          {row.predictedFailure}
                        </div>
                      </td>
                      <td
                        className={`px-4 py-3 text-xs font-bold whitespace-nowrap ${row.daysUntilFailure < 60 ? "text-red-400" : row.daysUntilFailure < 120 ? "text-amber-400" : "text-slate-300"}`}
                      >
                        {row.daysUntilFailure}d
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`${cfg.bg} ${cfg.text} ${cfg.border} border text-[10px]`}
                        >
                          {row.urgency}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-200 whitespace-nowrap">
                        <div className="flex items-center gap-0.5">
                          <IndianRupee className="h-3 w-3" />
                          {(row.estimatedCost / 100000).toFixed(1)}L
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleSchedule(row)}
                          data-ocid={`forecast.schedule_button.${row.id}`}
                          className={`text-[10px] h-6 px-2 ${cfg.bg} ${cfg.text} border ${cfg.border} hover:opacity-80`}
                        >
                          Schedule
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MaintenanceForecastPage;
