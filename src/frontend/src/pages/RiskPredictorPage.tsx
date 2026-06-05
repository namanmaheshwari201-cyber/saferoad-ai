import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  BrainCircuit,
  CloudRain,
  Moon,
  Sun,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
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
];
const ROAD_TYPES = [
  "National Highway",
  "State Highway",
  "City Road",
  "Expressway",
  "Ring Road",
];
const WEATHER = ["Clear", "Rainy", "Foggy", "Drizzle", "Overcast"];
const TIMES = [
  "Morning (6-10am)",
  "Afternoon (10am-4pm)",
  "Evening (4-8pm)",
  "Night (8pm-12am)",
  "Late Night (12-6am)",
];

interface RiskResult {
  score: number;
  level: "High" | "Medium" | "Low";
  factors: string[];
  actions: string[];
}

const CURRENT_RISKS = [
  {
    road: "NH-8 Delhi-Gurgaon",
    city: "Delhi",
    score: 82,
    factors: ["Heavy Traffic", "Poor Lighting", "High Accident History"],
  },
  {
    road: "Mumbai-Pune Expressway",
    city: "Mumbai",
    score: 74,
    factors: ["Fog", "High Speed", "Curve Sections"],
  },
  {
    road: "Bengaluru ORR",
    city: "Bengaluru",
    score: 61,
    factors: ["Traffic Density", "Pothole Zones"],
  },
  {
    road: "Chennai ECR",
    city: "Chennai",
    score: 55,
    factors: ["Night Traffic", "Speed Violations"],
  },
  {
    road: "Hyderabad ORR",
    city: "Hyderabad",
    score: 48,
    factors: ["Weather", "Construction Zone"],
  },
  {
    road: "Kolkata NH-16",
    city: "Kolkata",
    score: 71,
    factors: ["Waterlogging", "Heavy Trucks"],
  },
  {
    road: "Jaipur Ajmer Road",
    city: "Jaipur",
    score: 39,
    factors: ["Rural Stretch"],
  },
  {
    road: "Lucknow Ring Road",
    city: "Lucknow",
    score: 28,
    factors: ["Low Traffic"],
  },
];

function getRisk(score: number): "High" | "Medium" | "Low" {
  return score >= 70 ? "High" : score >= 40 ? "Medium" : "Low";
}

function getRiskColors(level: string) {
  if (level === "High")
    return {
      bg: "bg-red-500/20",
      text: "text-red-400",
      border: "border-red-500/30",
      bar: "#ef4444",
    };
  if (level === "Medium")
    return {
      bg: "bg-amber-500/20",
      text: "text-amber-400",
      border: "border-amber-500/30",
      bar: "#f59e0b",
    };
  return {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    bar: "#10b981",
  };
}

function computeResult(
  city: string,
  roadType: string,
  weather: string,
  time: string,
): RiskResult {
  let base = 30;
  if (weather === "Rainy") base += 20;
  if (weather === "Foggy") base += 25;
  if (time === "Late Night (12-6am)") base += 20;
  if (time === "Night (8pm-12am)") base += 12;
  if (roadType === "National Highway") base += 10;
  if (roadType === "City Road") base += 8;
  const highCities = ["Delhi", "Mumbai", "Kolkata"];
  if (highCities.includes(city)) base += 10;
  base = Math.min(base, 98);
  const level = getRisk(base);
  const factors: string[] = [];
  if (weather !== "Clear") factors.push(`${weather} weather conditions`);
  if (time.includes("Night") || time.includes("Late"))
    factors.push("Reduced visibility at night");
  if (base > 60) factors.push("High historical accident rate");
  if (roadType === "National Highway")
    factors.push("High-speed national corridor");
  factors.push(`${city} urban traffic density`);
  const actions: string[] = [
    "Reduce speed by 20%",
    "Maintain safe following distance",
  ];
  if (weather === "Rainy" || weather === "Drizzle")
    actions.push("Enable fog lights", "Avoid sudden braking");
  if (level === "High")
    actions.push("Avoid travel if possible", "Alert emergency contacts");
  return { score: base, level, factors, actions };
}

export function RiskPredictorPage() {
  const [city, setCity] = useState("");
  const [roadType, setRoadType] = useState("");
  const [weather, setWeather] = useState("");
  const [time, setTime] = useState("");
  const [result, setResult] = useState<RiskResult | null>(null);

  const handlePredict = () => {
    if (!city || !roadType || !weather || !time) return;
    setResult(computeResult(city, roadType, weather, time));
  };

  const riskColors = result ? getRiskColors(result.level) : null;

  return (
    <div
      className="p-4 md:p-6 space-y-6"
      style={{ background: "#0a0f1e", minHeight: "100vh" }}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
          <BrainCircuit className="h-5 w-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">
            AI Accident Risk Predictor
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            AI-powered real-time accident risk assessment
          </p>
        </div>
      </div>

      {/* Input Form */}
      <Card className="border-indigo-500/20" style={{ background: "#0f172a" }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-indigo-400 flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" /> Risk Assessment Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "City / Area",
                value: city,
                setter: setCity,
                options: CITIES,
                ocid: "riskpredictor.city_select",
              },
              {
                label: "Road Type",
                value: roadType,
                setter: setRoadType,
                options: ROAD_TYPES,
                ocid: "riskpredictor.roadtype_select",
              },
              {
                label: "Weather",
                value: weather,
                setter: setWeather,
                options: WEATHER,
                ocid: "riskpredictor.weather_select",
              },
              {
                label: "Time of Day",
                value: time,
                setter: setTime,
                options: TIMES,
                ocid: "riskpredictor.time_select",
              },
            ].map((f) => (
              <div key={f.label}>
                <label
                  htmlFor={`risk-field-${f.label.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-xs text-slate-400 mb-1.5 block"
                >
                  {f.label}
                </label>
                <select
                  id={`risk-field-${f.label.toLowerCase().replace(/\s/g, "-")}`}
                  value={f.value}
                  onChange={(e) => f.setter(e.target.value)}
                  data-ocid={f.ocid}
                  className="w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-400/50"
                  style={{ background: "#0a0f1e" }}
                >
                  <option value="">-- Select --</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <Button
            type="button"
            onClick={handlePredict}
            disabled={!city || !roadType || !weather || !time}
            data-ocid="riskpredictor.predict_button"
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold"
          >
            <BrainCircuit className="h-4 w-4 mr-2" /> Predict Risk
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      {result && riskColors && (
        <Card
          className={`border ${riskColors.border}`}
          style={{ background: "#0f172a" }}
        >
          <CardContent className="p-5">
            <div className="flex items-start gap-4 flex-wrap">
              <div
                className={`h-20 w-20 rounded-2xl ${riskColors.bg} border ${riskColors.border} flex flex-col items-center justify-center shrink-0`}
              >
                <span className={`text-3xl font-black ${riskColors.text}`}>
                  {result.score}
                </span>
                <span className="text-[10px] text-slate-400">/100</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    className={`${riskColors.bg} ${riskColors.text} ${riskColors.border} border text-sm px-3 py-1`}
                  >
                    {result.level} Risk
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {city} · {roadType}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-slate-400 font-semibold mb-1">
                      Contributing Factors
                    </div>
                    <div className="space-y-1">
                      {result.factors.map((f) => (
                        <div
                          key={f}
                          className="flex items-center gap-2 text-xs"
                        >
                          <AlertTriangle
                            className={`h-3 w-3 ${riskColors.text} shrink-0`}
                          />
                          <span className="text-slate-300">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold mb-1">
                      Recommended Actions
                    </div>
                    <div className="space-y-1">
                      {result.actions.map((a) => (
                        <div
                          key={a}
                          className="flex items-center gap-2 text-xs"
                        >
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${riskColors.text.replace("text", "bg")} shrink-0`}
                          />
                          <span className="text-slate-300">{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Risk Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-300 mb-3">
            Current Risk Map
          </h2>
          <div className="space-y-2">
            {CURRENT_RISKS.map((r, i) => {
              const level = getRisk(r.score);
              const c = getRiskColors(level);
              return (
                <div
                  key={r.road}
                  data-ocid={`riskpredictor.road.${i + 1}`}
                  className={`rounded-lg border p-3 ${c.bg} ${c.border}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {r.road}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {r.factors.join(" · ")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="h-1.5 bg-white/10 rounded-full w-16 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${r.score}%`, background: c.bar }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${c.text} w-6`}>
                        {r.score}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-300 mb-3">
            Risk Score by City
          </h2>
          <Card className="border-white/10" style={{ background: "#0f172a" }}>
            <CardContent className="p-4">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={CURRENT_RISKS}
                  margin={{ top: 5, right: 10, left: -20, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <XAxis
                    dataKey="city"
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    angle={-30}
                    textAnchor="end"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                    }}
                    labelStyle={{ color: "#f1f5f9" }}
                    itemStyle={{ color: "#a78bfa" }}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {CURRENT_RISKS.map((r, _i) => (
                      <Cell
                        key={`cell-${r.road}`}
                        fill={getRiskColors(getRisk(r.score)).bar}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default RiskPredictorPage;
