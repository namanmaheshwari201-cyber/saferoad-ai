import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NavPage } from "@/types";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileWarning,
  Flame,
  Globe,
  Layers,
  MapPin,
  Moon,
  Navigation,
  Phone,
  Route,
  Scale,
  ScanLine,
  School,
  Shield,
  Star,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface HomePageProps {
  onNavigate: (page: NavPage) => void;
}

function useDateTime() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const STAT_CARDS = [
  {
    label: "Active Complaints",
    value: "12",
    icon: FileWarning,
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  {
    label: "Roads Monitored",
    value: "2,847",
    icon: MapPin,
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
  {
    label: "Emergency Alerts Today",
    value: "3",
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/20",
  },
  {
    label: "Cities Ranked",
    value: "142",
    icon: Globe,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
];

const MODULE_CARDS = [
  {
    page: "drivelegal" as NavPage,
    icon: Scale,
    title: "DriveLegal AI",
    subtitle: "AI Traffic Law Assistant",
    description:
      "Instant answers on traffic laws, challan fines, and legal guidance for every Indian state.",
    accent: "border-blue-500/30 hover:border-blue-500/60",
    iconBg: "bg-blue-500/15 text-blue-400",
    badge: "Law & Fines",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  {
    page: "roadwatch" as NavPage,
    icon: Activity,
    title: "RoadWatch",
    subtitle: "Road Monitoring & Transparency",
    description:
      "Report potholes, track repairs, monitor contractor performance, and view budget transparency.",
    accent: "border-emerald-500/30 hover:border-emerald-500/60",
    iconBg: "bg-emerald-500/15 text-emerald-400",
    badge: "Infrastructure",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  {
    page: "roadsos" as NavPage,
    icon: Phone,
    title: "RoadSOS",
    subtitle: "Emergency Assistance",
    description:
      "One-tap SOS, accident detection, Golden Hour Mode, first aid AI, and nearby rescue services.",
    accent: "border-red-500/30 hover:border-red-500/60",
    iconBg: "bg-red-500/15 text-red-400",
    badge: "Emergency",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
  },
  {
    page: "safety" as NavPage,
    icon: BarChart3,
    title: "Safety Analytics",
    subtitle: "Safety Scores & Analytics",
    description:
      "Driver safety scores, accident heatmaps, road maintenance predictor, and city rankings.",
    accent: "border-purple-500/30 hover:border-purple-500/60",
    iconBg: "bg-purple-500/15 text-purple-400",
    badge: "Analytics",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
];

const ADVANCED_FEATURES = [
  {
    page: "blackspot" as NavPage,
    icon: Flame,
    name: "AI Blackspot Detector",
    desc: "Identify high-risk accident zones with AI heatmaps",
    color: "text-red-400",
    bg: "bg-red-400/10",
  },
  {
    page: "digitaltwin" as NavPage,
    icon: Layers,
    name: "Road Safety Digital Twin",
    desc: "3D virtual road inspection with live traffic data",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    page: "nightsafety" as NavPage,
    icon: Moon,
    name: "Night Safety Score",
    desc: "AI-rated night travel safety with route guidance",
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
  },
  {
    page: "crowdsourcing" as NavPage,
    icon: Star,
    name: "Road Quality Crowdsourcing",
    desc: "Rate roads and view community quality scores",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    page: "maintenance-forecast" as NavPage,
    icon: Wrench,
    name: "AI Maintenance Forecast",
    desc: "Predict road failures before they happen",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    page: "schoolzone" as NavPage,
    icon: School,
    name: "School Zone Protection",
    desc: "Auto-detect school zones with Child Safety Mode",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    page: "riskpredictor" as NavPage,
    icon: Brain,
    name: "AI Accident Risk Predictor",
    desc: "Predict accident-prone zones using AI analysis",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
  {
    page: "saferoute" as NavPage,
    icon: Route,
    name: "Safe Route Navigator",
    desc: "AI recommends safest, not just shortest, routes",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    page: "hazardnetwork" as NavPage,
    icon: Users,
    name: "Community Hazard Network",
    desc: "Citizen-reported road hazards and alerts",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    page: "aipotholescanner" as NavPage,
    icon: ScanLine,
    name: "AI Pothole Scanner",
    desc: "Real-time AI pothole detection using your camera with smart road-surface recognition",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    page: "cityleaderboard" as NavPage,
    icon: Building2,
    name: "National City Safety Leaderboard",
    desc: "Safety scores for 142+ Indian cities",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
];

const RECENT_ACTIVITY = [
  {
    icon: FileWarning,
    iconColor: "text-amber-400",
    bgColor: "bg-amber-400/10",
    title: "Pothole complaint filed",
    detail: "MG Road, Bengaluru — routed to BBMP",
    time: "4 min ago",
    status: "Under Review",
    statusColor: "bg-amber-500/20 text-amber-300",
  },
  {
    icon: Star,
    iconColor: "text-blue-400",
    bgColor: "bg-blue-400/10",
    title: "Road rated by citizen",
    detail: "NH-48, Gurugram — 2 stars (Poor surface)",
    time: "12 min ago",
    status: "Recorded",
    statusColor: "bg-blue-500/20 text-blue-300",
  },
  {
    icon: BookOpen,
    iconColor: "text-green-400",
    bgColor: "bg-green-400/10",
    title: "New traffic law update",
    detail: "Maharashtra: Revised helmet fine — ₹1,000 for first offense",
    time: "1 hr ago",
    status: "Published",
    statusColor: "bg-green-500/20 text-green-300",
  },
  {
    icon: CheckCircle2,
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    title: "SOS alert resolved",
    detail: "Accident on Outer Ring Road, Hyderabad — Emergency responded",
    time: "2 hr ago",
    status: "Resolved",
    statusColor: "bg-emerald-500/20 text-emerald-300",
  },
  {
    icon: Flame,
    iconColor: "text-red-400",
    bgColor: "bg-red-400/10",
    title: "AI blackspot detected",
    detail: "Sion-Panvel Highway, Mumbai — High-risk zone flagged",
    time: "3 hr ago",
    status: "Alert Sent",
    statusColor: "bg-red-500/20 text-red-300",
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  const now = useDateTime();

  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="min-h-screen bg-background pb-12" data-ocid="home.page">
      {/* Welcome Header */}
      <section className="bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-primary shrink-0" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Command Dashboard
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground font-display leading-tight">
                Welcome, <span className="text-primary">Naman Maheshwari</span>
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-muted-foreground max-w-xl">
                One Platform for Road Laws, Road Quality, and Emergency
                Assistance
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 bg-muted/40 border border-border rounded-lg px-3 py-2 self-start">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {timeStr}
                </p>
                <p className="text-xs text-muted-foreground">{dateStr}</p>
              </div>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div
            className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3"
            data-ocid="home.quick_actions"
          >
            {[
              {
                page: "drivelegal" as NavPage,
                label: "DriveLegal",
                icon: Scale,
                cls: "from-blue-600/80 to-blue-700/80 border-blue-500/40",
                ocid: "home.quick_drivelegal_button",
              },
              {
                page: "roadwatch" as NavPage,
                label: "RoadWatch",
                icon: Activity,
                cls: "from-emerald-600/80 to-emerald-700/80 border-emerald-500/40",
                ocid: "home.quick_roadwatch_button",
              },
              {
                page: "roadsos" as NavPage,
                label: "RoadSOS",
                icon: Phone,
                cls: "from-red-600/80 to-red-700/80 border-red-500/40",
                ocid: "home.quick_roadsos_button",
              },
              {
                page: "safety" as NavPage,
                label: "Safety Analytics",
                icon: BarChart3,
                cls: "from-purple-600/80 to-purple-700/80 border-purple-500/40",
                ocid: "home.quick_safety_button",
              },
            ].map(({ page, label, icon: Icon, cls, ocid }) => (
              <button
                key={page}
                type="button"
                onClick={() => onNavigate(page)}
                data-ocid={ocid}
                className={`flex items-center justify-center gap-2.5 px-3 py-3 sm:py-3.5 rounded-xl border bg-gradient-to-br ${cls} text-white font-semibold text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] min-w-0`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Overview Row */}
      <section className="bg-muted/20 border-b border-border px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            data-ocid="home.stats_section"
          >
            {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }, i) => (
              <div
                key={label}
                className={`rounded-xl border p-4 sm:p-5 ${bg} flex items-center gap-3`}
                data-ocid={`home.stat.${i + 1}`}
              >
                <div
                  className={`rounded-lg p-2 shrink-0 ${bg.split(" ")[0].replace("/10", "/20")}`}
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-xl sm:text-2xl font-bold font-display ${color}`}
                  >
                    {value}
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Module Cards Grid */}
        <section data-ocid="home.modules_section">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <h2 className="text-base font-semibold text-foreground uppercase tracking-wider">
              Core Modules
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODULE_CARDS.map(
              (
                {
                  page,
                  icon: Icon,
                  title,
                  subtitle,
                  description,
                  accent,
                  iconBg,
                  badge,
                  badgeColor,
                },
                i,
              ) => (
                <Card
                  key={page}
                  className={`border-2 ${accent} bg-card transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group`}
                  onClick={() => onNavigate(page)}
                  data-ocid={`home.module.${i + 1}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-xl p-2.5 ${iconBg}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-base font-bold text-foreground">
                            {title}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {subtitle}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border ${badgeColor} shrink-0`}
                      >
                        {badge}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {description}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(page);
                      }}
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-200"
                      data-ocid={`home.module_open.${i + 1}`}
                    >
                      Open {title}
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        </section>

        {/* Advanced Features Grid */}
        <section data-ocid="home.advanced_features_section">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-primary" />
            <h2 className="text-base font-semibold text-foreground uppercase tracking-wider">
              Advanced AI Features
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {ADVANCED_FEATURES.map(
              ({ page, icon: Icon, name, desc, color, bg }, i) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => onNavigate(page)}
                  data-ocid={`home.feature.${i + 1}`}
                  className="group flex flex-col items-start gap-2 p-3.5 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-muted/40 transition-all duration-200 hover:-translate-y-0.5 text-left min-w-0"
                >
                  <div className={`rounded-lg p-2 ${bg}`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="min-w-0 w-full">
                    <p className="text-xs font-semibold text-foreground leading-tight">
                      {name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-tight line-clamp-2">
                      {desc}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${color} opacity-0 group-hover:opacity-100 transition-opacity self-end shrink-0`}
                  />
                </button>
              ),
            )}
          </div>
        </section>

        {/* Recent Activity Feed */}
        <section data-ocid="home.activity_section">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground uppercase tracking-wider">
                Recent Activity
              </h2>
            </div>
            <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted/40 border border-border">
              Live Feed
            </span>
          </div>
          <Card className="border border-border bg-card">
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {RECENT_ACTIVITY.map(
                  (
                    {
                      icon: Icon,
                      iconColor,
                      bgColor,
                      title,
                      detail,
                      time,
                      status,
                      statusColor,
                    },
                    i,
                  ) => (
                    <li
                      key={title}
                      className="flex items-start gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors"
                      data-ocid={`home.activity.${i + 1}`}
                    >
                      <div
                        className={`rounded-lg p-2 shrink-0 mt-0.5 ${bgColor}`}
                      >
                        <Icon className={`w-4 h-4 ${iconColor}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <p className="text-sm font-medium text-foreground">
                            {title}
                          </p>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${statusColor}`}
                          >
                            {status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {detail}
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          {time}
                        </p>
                      </div>
                    </li>
                  ),
                )}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* System status bar */}
        <section
          className="rounded-xl border border-border bg-card/50 px-4 py-3 flex flex-wrap items-center justify-between gap-3"
          data-ocid="home.system_status"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-muted-foreground">
              All systems operational
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {[
              {
                label: "DriveLegal",
                status: "Online",
                color: "text-emerald-400",
              },
              {
                label: "RoadWatch",
                status: "Online",
                color: "text-emerald-400",
              },
              { label: "RoadSOS", status: "Online", color: "text-emerald-400" },
              { label: "AI Engine", status: "Active", color: "text-blue-400" },
            ].map(({ label, status, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">{label}:</span>
                <span className={`text-xs font-medium ${color}`}>{status}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
