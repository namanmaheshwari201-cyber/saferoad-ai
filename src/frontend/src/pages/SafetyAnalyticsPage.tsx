import { Badge } from "@/components/ui/badge";
import {
  Activity,
  AlertTriangle,
  Brain,
  Calendar,
  MessageSquare,
  Shield,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TimeRange = "7d" | "30d" | "6m" | "1y";

const MONTHLY_ACCIDENTS = [
  { month: "Jan", total: 38420, fatal: 4210 },
  { month: "Feb", total: 36800, fatal: 3980 },
  { month: "Mar", total: 40120, fatal: 4380 },
  { month: "Apr", total: 37900, fatal: 4100 },
  { month: "May", total: 41200, fatal: 4520 },
  { month: "Jun", total: 43800, fatal: 4890 },
  { month: "Jul", total: 45200, fatal: 5100 },
  { month: "Aug", total: 42600, fatal: 4780 },
  { month: "Sep", total: 39400, fatal: 4320 },
  { month: "Oct", total: 36200, fatal: 3960 },
  { month: "Nov", total: 34800, fatal: 3720 },
  { month: "Dec", total: 25080, fatal: 2710 },
];

const CITY_QUALITY_TRENDS = [
  {
    month: "Jan",
    Delhi: 54,
    Mumbai: 62,
    Bangalore: 71,
    Chennai: 66,
    Kolkata: 48,
  },
  {
    month: "Feb",
    Delhi: 56,
    Mumbai: 63,
    Bangalore: 72,
    Chennai: 67,
    Kolkata: 50,
  },
  {
    month: "Mar",
    Delhi: 53,
    Mumbai: 61,
    Bangalore: 70,
    Chennai: 65,
    Kolkata: 47,
  },
  {
    month: "Apr",
    Delhi: 55,
    Mumbai: 64,
    Bangalore: 73,
    Chennai: 68,
    Kolkata: 51,
  },
  {
    month: "May",
    Delhi: 52,
    Mumbai: 62,
    Bangalore: 72,
    Chennai: 66,
    Kolkata: 49,
  },
  {
    month: "Jun",
    Delhi: 49,
    Mumbai: 59,
    Bangalore: 69,
    Chennai: 63,
    Kolkata: 45,
  },
  {
    month: "Jul",
    Delhi: 46,
    Mumbai: 57,
    Bangalore: 67,
    Chennai: 61,
    Kolkata: 43,
  },
  {
    month: "Aug",
    Delhi: 48,
    Mumbai: 58,
    Bangalore: 68,
    Chennai: 62,
    Kolkata: 44,
  },
  {
    month: "Sep",
    Delhi: 51,
    Mumbai: 61,
    Bangalore: 70,
    Chennai: 65,
    Kolkata: 47,
  },
  {
    month: "Oct",
    Delhi: 55,
    Mumbai: 64,
    Bangalore: 73,
    Chennai: 68,
    Kolkata: 51,
  },
  {
    month: "Nov",
    Delhi: 58,
    Mumbai: 66,
    Bangalore: 75,
    Chennai: 70,
    Kolkata: 53,
  },
  {
    month: "Dec",
    Delhi: 61,
    Mumbai: 68,
    Bangalore: 77,
    Chennai: 72,
    Kolkata: 55,
  },
];

const VIOLATION_PIE = [
  { name: "Speeding", value: 34, color: "#ef4444" },
  { name: "No Helmet", value: 28, color: "#f97316" },
  { name: "Red Light", value: 18, color: "#eab308" },
  { name: "Drunk Driving", value: 12, color: "#8b5cf6" },
  { name: "Other", value: 8, color: "#6b7280" },
];

const VIOLATIONS_BY_DAY = [
  { day: "Mon", Speeding: 1240, Helmet: 980, RedLight: 670, Drunk: 320 },
  { day: "Tue", Speeding: 1180, Helmet: 920, RedLight: 640, Drunk: 290 },
  { day: "Wed", Speeding: 1320, Helmet: 1050, RedLight: 710, Drunk: 340 },
  { day: "Thu", Speeding: 1290, Helmet: 1010, RedLight: 690, Drunk: 360 },
  { day: "Fri", Speeding: 1580, Helmet: 1240, RedLight: 840, Drunk: 580 },
  { day: "Sat", Speeding: 1820, Helmet: 1420, RedLight: 960, Drunk: 890 },
  { day: "Sun", Speeding: 1640, Helmet: 1280, RedLight: 870, Drunk: 720 },
];

const DANGEROUS_SEGMENTS = [
  { segment: "NH-48 Gurgaon-Jaipur (KM 42-56)", score: 94 },
  { segment: "NH-8 Mumbai-Pune Expressway (KM 18-24)", score: 91 },
  { segment: "NH-44 Delhi-Ambala (KM 61-78)", score: 88 },
  { segment: "NH-16 Visakhapatnam Bypass", score: 86 },
  { segment: "NH-27 Indore Ring Road", score: 83 },
  { segment: "SH-1 Bengaluru-Hosur Corridor", score: 81 },
  { segment: "NH-19 Kanpur-Lucknow (KM 32-41)", score: 79 },
  { segment: "NH-58 Haridwar-Rishikesh Stretch", score: 77 },
  { segment: "NH-30 Raipur-Bilaspur", score: 74 },
  { segment: "SH-9 Jaipur-Ajmer Highway", score: 71 },
];

const COMPLAINT_AREA = [
  { month: "Jan", filed: 18200, resolved: 14800 },
  { month: "Feb", filed: 17400, resolved: 15200 },
  { month: "Mar", filed: 19800, resolved: 16400 },
  { month: "Apr", filed: 21200, resolved: 17800 },
  { month: "May", filed: 22400, resolved: 19200 },
  { month: "Jun", filed: 24800, resolved: 21400 },
  { month: "Jul", filed: 26200, resolved: 23800 },
  { month: "Aug", filed: 24600, resolved: 23200 },
  { month: "Sep", filed: 22800, resolved: 21900 },
  { month: "Oct", filed: 20400, resolved: 19800 },
  { month: "Nov", filed: 18800, resolved: 18400 },
  { month: "Dec", filed: 16200, resolved: 15800 },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const HEAT_CAL_DATA: Record<string, number> = {};
(() => {
  MONTHS.forEach((m, mi) => {
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mi];
    for (let d = 1; d <= days; d++) {
      const base = [38, 37, 40, 38, 41, 44, 45, 43, 39, 36, 35, 25][mi];
      HEAT_CAL_DATA[`${m}-${d}`] = Math.max(
        0,
        Math.round(
          base * 30 + Math.sin(d * 0.9 + mi) * 400 + (d % 7 >= 5 ? 800 : 0),
        ),
      );
    }
  });
})();

const KPI_CARDS = [
  {
    label: "Total Accidents",
    value: "4,61,312",
    sub: "This year",
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "from-red-900/30 to-red-950/10",
    border: "border-red-800/30",
    trend: "-8.2%",
    up: false,
  },
  {
    label: "Roads Inspected",
    value: "87,432",
    sub: "Nationwide",
    icon: Activity,
    color: "text-blue-400",
    bg: "from-blue-900/30 to-blue-950/10",
    border: "border-blue-800/30",
    trend: "+14.7%",
    up: true,
  },
  {
    label: "Complaints Resolved",
    value: "1,23,456",
    sub: "This year",
    icon: MessageSquare,
    color: "text-emerald-400",
    bg: "from-emerald-900/30 to-emerald-950/10",
    border: "border-emerald-800/30",
    trend: "+23.1%",
    up: true,
  },
  {
    label: "Safety Score",
    value: "+12.3%",
    sub: "Improvement",
    icon: Shield,
    color: "text-amber-400",
    bg: "from-amber-900/30 to-amber-950/10",
    border: "border-amber-800/30",
    trend: "vs last year",
    up: true,
  },
];

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 6 Months", value: "6m" },
  { label: "Last Year", value: "1y" },
];

const CITY_COLORS: Record<string, string> = {
  Delhi: "#ef4444",
  Mumbai: "#3b82f6",
  Bangalore: "#22c55e",
  Chennai: "#f97316",
  Kolkata: "#a855f7",
};

function getHeatColor(val: number): string {
  if (val < 800) return "bg-green-900/30";
  if (val < 1200) return "bg-yellow-800/40";
  if (val < 1600) return "bg-orange-700/50";
  if (val < 2200) return "bg-red-700/60";
  return "bg-red-500/80";
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-xl text-xs">
      <p className="text-muted-foreground mb-1 font-medium">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: p.color }}
          />
          <span className="text-foreground">{p.name}:</span>
          <span className="font-bold text-foreground">
            {p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function SafetyAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("1y");
  const [visibleCities, setVisibleCities] = useState<Record<string, boolean>>({
    Delhi: true,
    Mumbai: true,
    Bangalore: true,
    Chennai: true,
    Kolkata: true,
  });
  const [showYoY, setShowYoY] = useState(false);

  const toggleCity = (city: string) =>
    setVisibleCities((prev) => ({ ...prev, [city]: !prev[city] }));

  return (
    <div className="min-h-screen bg-background" data-ocid="analytics.page">
      {/* Page Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground leading-tight">
                Safety Analytics Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                National road safety data intelligence
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-1 bg-muted/40 border border-border rounded-lg p-1"
            data-ocid="analytics.timerange_selector"
          >
            {TIME_RANGES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setTimeRange(r.value)}
                data-ocid={`analytics.timerange.${r.value}`}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  timeRange === r.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* KPI Row */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="analytics.kpi_section"
        >
          {KPI_CARDS.map((kpi) => (
            <div
              key={kpi.label}
              className={`relative overflow-hidden rounded-xl border ${kpi.border} bg-gradient-to-br ${kpi.bg} p-4`}
            >
              <div className="flex items-start justify-between mb-2">
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                <span
                  className={`flex items-center gap-0.5 text-xs font-semibold ${kpi.up ? "text-emerald-400" : "text-red-400"}`}
                >
                  {kpi.up ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {kpi.trend}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-foreground leading-none mb-1">
                {kpi.value}
              </div>
              <div className="text-xs text-muted-foreground">{kpi.label}</div>
              <div className="text-xs text-muted-foreground/60">{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Section 1: Accident Trends */}
        <section data-ocid="analytics.accident_trends_section">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-red-500 rounded-full" />
              <h2 className="font-display text-base font-semibold text-foreground">
                Accident Trends
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowYoY(!showYoY)}
              data-ocid="analytics.yoy_toggle"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                showYoY
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              YoY Comparison
            </button>
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-xl bg-card border border-border p-4">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={MONTHLY_ACCIDENTS}>
                  <defs>
                    <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fatalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                  <Area
                    type="monotone"
                    dataKey="total"
                    name="Total Accidents"
                    stroke="#3b82f6"
                    fill="url(#totalGrad)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="fatal"
                    name="Fatal Accidents"
                    stroke="#ef4444"
                    fill="url(#fatalGrad)"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl bg-card border border-border p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  AI Insight
                </span>
              </div>
              <div className="rounded-lg bg-blue-950/40 border border-blue-800/30 p-3">
                <TrendingDown className="w-4 h-4 text-emerald-400 mb-1" />
                <p className="text-sm font-semibold text-foreground">
                  Accidents down 8.2%
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  vs same period last year
                </p>
              </div>
              <div className="rounded-lg bg-amber-950/30 border border-amber-800/30 p-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 mb-1" />
                <p className="text-sm font-semibold text-foreground">
                  July Peak Risk
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  45,200 accidents — highest month. Monsoon season driver.
                </p>
              </div>
              <div className="rounded-lg bg-purple-950/30 border border-purple-800/30 p-3">
                <Zap className="w-4 h-4 text-purple-400 mb-1" />
                <p className="text-sm font-semibold text-foreground">
                  Fatal Rate: 10.9%
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Down from 11.8% — improving hospital response times.
                </p>
              </div>
              <div className="rounded-lg bg-emerald-950/30 border border-emerald-800/30 p-3 mt-auto">
                <Shield className="w-4 h-4 text-emerald-400 mb-1" />
                <p className="text-sm font-semibold text-foreground">
                  Safest Month: Dec
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  25,080 accidents — 44% lower than July.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Road Quality Trends */}
        <section data-ocid="analytics.road_quality_section">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full" />
              <h2 className="font-display text-base font-semibold text-foreground">
                Road Quality Trends — Top 5 Cities
              </h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {Object.entries(CITY_COLORS).map(([city, color]) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => toggleCity(city)}
                  data-ocid={`analytics.city_toggle.${city.toLowerCase()}`}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs transition-all ${
                    visibleCities[city]
                      ? "border-border text-foreground"
                      : "border-border/40 text-muted-foreground/40"
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{
                      background: visibleCities[city] ? color : "#374151",
                    }}
                  />
                  {city}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-card border border-border p-4">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={CITY_QUALITY_TRENDS}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[40, 85]}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                {Object.entries(CITY_COLORS).map(([city, color]) =>
                  visibleCities[city] ? (
                    <Line
                      key={city}
                      type="monotone"
                      dataKey={city}
                      stroke={color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: color }}
                    />
                  ) : null,
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Section 3: Driver Behavior */}
        <section data-ocid="analytics.driver_behavior_section">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-amber-500 rounded-full" />
            <h2 className="font-display text-base font-semibold text-foreground">
              Driver Behavior Analytics
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="rounded-xl bg-card border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Violation Breakdown
              </p>
              <div className="relative">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={VIOLATION_PIE}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {VIOLATION_PIE.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [`${val}%`, "Share"]}
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-lg font-bold font-display text-foreground">
                      5
                    </div>
                    <div className="text-xs text-muted-foreground">Types</div>
                  </div>
                </div>
              </div>
              <div className="mt-2 space-y-1.5">
                {VIOLATION_PIE.map((v) => (
                  <div
                    key={v.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ background: v.color }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {v.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      {v.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 rounded-xl bg-card border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Violations by Day of Week
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={VIOLATIONS_BY_DAY} barSize={10}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                  <Bar
                    dataKey="Speeding"
                    fill="#ef4444"
                    radius={[2, 2, 0, 0]}
                    stackId="a"
                  />
                  <Bar
                    dataKey="Helmet"
                    fill="#f97316"
                    radius={[2, 2, 0, 0]}
                    stackId="a"
                  />
                  <Bar
                    dataKey="RedLight"
                    fill="#eab308"
                    radius={[2, 2, 0, 0]}
                    stackId="a"
                  />
                  <Bar
                    dataKey="Drunk"
                    fill="#8b5cf6"
                    radius={[2, 2, 0, 0]}
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Heat Calendar */}
          <div className="mt-4 rounded-xl bg-card border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Accident Density Calendar 2024
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Low</span>
                {[
                  "bg-green-900/40",
                  "bg-yellow-800/40",
                  "bg-orange-700/50",
                  "bg-red-700/60",
                  "bg-red-500/80",
                ].map((cls) => (
                  <span
                    key={cls}
                    className={`w-3 h-3 rounded-sm inline-block ${cls}`}
                  />
                ))}
                <span>High</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {MONTHS.map((month, mi) => {
                  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
                    mi
                  ];
                  return (
                    <div key={month}>
                      <div className="text-xs text-muted-foreground/60 mb-1 text-center">
                        {month}
                      </div>
                      <div
                        className="grid grid-rows-7 gap-0.5"
                        style={{ gridAutoFlow: "column" }}
                      >
                        {Array.from({ length: days }, (_, d) => {
                          const key = `${month}-${d + 1}`;
                          const val = HEAT_CAL_DATA[key] ?? 0;
                          return (
                            <div
                              key={key}
                              title={`${key}: ${val.toLocaleString()} accidents`}
                              className={`w-3 h-3 rounded-sm ${getHeatColor(val)}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Predictive Insights */}
        <section data-ocid="analytics.predictive_section">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-purple-500 rounded-full" />
            <h2 className="font-display text-base font-semibold text-foreground">
              AI Predictive Insights
            </h2>
            <Badge className="bg-purple-900/40 text-purple-300 border-purple-700/40 text-xs">
              Live Model
            </Badge>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              {[
                {
                  icon: AlertTriangle,
                  color: "text-red-400",
                  bg: "bg-red-950/30 border-red-800/30",
                  title: "Roads likely to fail in next 30 days",
                  value: "847 roads",
                  sub: "Concentrated in UP, MP, and Rajasthan",
                },
                {
                  icon: Calendar,
                  color: "text-amber-400",
                  bg: "bg-amber-950/30 border-amber-800/30",
                  title: "Predicted peak accident times",
                  value: "Fri 8–10 PM · Sat 10 PM–2 AM",
                  sub: "Weekend late-night — 3.2× baseline risk",
                },
                {
                  icon: Shield,
                  color: "text-blue-400",
                  bg: "bg-blue-950/30 border-blue-800/30",
                  title: "Monsoon preparedness score",
                  value: "68 / 100",
                  sub: "6 cities need urgent drainage attention",
                },
                {
                  icon: TrendingUp,
                  color: "text-emerald-400",
                  bg: "bg-emerald-950/30 border-emerald-800/30",
                  title: "Predicted safety score Q1 2025",
                  value: "76.4 / 100",
                  sub: "+3.8 points if current projects complete on schedule",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`rounded-xl border ${item.bg} p-4 flex items-start gap-3`}
                >
                  <div className="p-2 rounded-lg bg-background/50 flex-shrink-0">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {item.title}
                    </p>
                    <p className="text-sm font-bold text-foreground mt-0.5">
                      {item.value}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                      {item.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-card border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Top 10 Most Dangerous Road Segments
              </p>
              <div className="space-y-2.5">
                {DANGEROUS_SEGMENTS.map((seg, i) => (
                  <div key={seg.segment} className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold w-4 flex-shrink-0 ${
                        i < 3
                          ? "text-red-400"
                          : i < 6
                            ? "text-amber-400"
                            : "text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs text-foreground truncate mb-0.5"
                        title={seg.segment}
                      >
                        {seg.segment}
                      </p>
                      <div className="relative h-1.5 rounded-full bg-muted/40 overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full rounded-full"
                          style={{
                            width: `${seg.score}%`,
                            background:
                              i < 3 ? "#ef4444" : i < 6 ? "#f97316" : "#eab308",
                          }}
                        />
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold flex-shrink-0 ${
                        i < 3
                          ? "text-red-400"
                          : i < 6
                            ? "text-amber-400"
                            : "text-yellow-500"
                      }`}
                    >
                      {seg.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Complaint Analytics */}
        <section
          data-ocid="analytics.complaint_analytics_section"
          className="pb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
            <h2 className="font-display text-base font-semibold text-foreground">
              Complaint Analytics
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-xl bg-card border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Complaints Filed vs Resolved
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={COMPLAINT_AREA}>
                  <defs>
                    <linearGradient id="filedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="resolvedGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                  <Area
                    type="monotone"
                    dataKey="filed"
                    name="Complaints Filed"
                    stroke="#ef4444"
                    fill="url(#filedGrad)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    name="Resolved"
                    stroke="#22c55e"
                    fill="url(#resolvedGrad)"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl bg-card border border-border p-4 flex flex-col gap-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Category Breakdown
              </p>
              {[
                { name: "Potholes", pct: 38, color: "#ef4444" },
                { name: "Broken Signals", pct: 22, color: "#f97316" },
                { name: "Road Damage", pct: 19, color: "#eab308" },
                { name: "Waterlogging", pct: 14, color: "#3b82f6" },
                { name: "Missing Signs", pct: 7, color: "#8b5cf6" },
              ].map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{cat.name}</span>
                    <span className="font-bold text-foreground">
                      {cat.pct}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${cat.pct}%`, background: cat.color }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-auto pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Overall resolution rate
                </p>
                <p className="text-2xl font-bold font-display text-emerald-400">
                  91.4%
                </p>
                <p className="text-xs text-muted-foreground">
                  ↑ 4.2% vs last quarter
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
