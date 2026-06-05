import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  BrainCircuit,
  ChevronDown,
  ChevronRight,
  Cpu,
  Home,
  Map as MapIcon,
  MapPin,
  Menu,
  Moon,
  Navigation,
  Route,
  ScanLine,
  School,
  Shield,
  Star,
  Trophy,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import type { NavPage } from "../types";

interface NavItemDef {
  id: NavPage;
  label: string;
  icon: React.ReactNode;
}

const CORE_MODULES: NavItemDef[] = [
  { id: "home", label: "Home", icon: <Home className="h-4 w-4" /> },
  {
    id: "drivelegal",
    label: "DriveLegal",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    id: "roadwatch",
    label: "RoadWatch",
    icon: <MapIcon className="h-4 w-4" />,
  },
  {
    id: "roadsos",
    label: "RoadSOS",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  {
    id: "safety",
    label: "Safety Analytics",
    icon: <BarChart3 className="h-4 w-4" />,
  },
];

const ADVANCED_FEATURES: NavItemDef[] = [
  {
    id: "blackspot",
    label: "Blackspot Detector",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: "digitaltwin",
    label: "Digital Twin",
    icon: <Cpu className="h-4 w-4" />,
  },
  {
    id: "nightsafety",
    label: "Night Safety Score",
    icon: <Moon className="h-4 w-4" />,
  },
  {
    id: "crowdsourcing",
    label: "Road Crowdsourcing",
    icon: <Star className="h-4 w-4" />,
  },
  {
    id: "road-safety-challenge",
    label: "Road Safety Challenge",
    icon: <Trophy className="h-4 w-4" />,
  },
  {
    id: "schoolzone",
    label: "School Zone",
    icon: <School className="h-4 w-4" />,
  },
  {
    id: "riskpredictor",
    label: "Risk Predictor",
    icon: <BrainCircuit className="h-4 w-4" />,
  },
  { id: "saferoute", label: "Safe Route", icon: <Route className="h-4 w-4" /> },
  {
    id: "hazardnetwork",
    label: "Hazard Network",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "aipotholescanner",
    label: "AI Pothole Scanner",
    icon: <ScanLine className="h-4 w-4" />,
  },
  {
    id: "cityleaderboard",
    label: "City Leaderboard",
    icon: <Trophy className="h-4 w-4" />,
  },
];

const PROFILE_ITEMS: NavItemDef[] = [
  { id: "profile", label: "Profile", icon: <Activity className="h-4 w-4" /> },
];

interface LayoutProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  children: React.ReactNode;
}

function NavSection({
  title,
  items,
  currentPage,
  onNavigate,
  closeMobile,
}: {
  title: string;
  items: NavItemDef[];
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  closeMobile?: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="flex items-center justify-between w-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400/70 hover:text-amber-400 transition-colors"
      >
        {title}
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </button>
      {!collapsed && (
        <div className="flex flex-col gap-0.5">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigate(item.id);
                closeMobile?.();
              }}
              data-ocid={`nav.${item.id}.link`}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 text-left w-full",
                currentPage === item.id
                  ? "bg-amber-400/15 text-amber-400 border-l-2 border-amber-400"
                  : "text-slate-300/80 hover:text-slate-100 hover:bg-white/5",
              )}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const allItems = [...CORE_MODULES, ...ADVANCED_FEATURES, ...PROFILE_ITEMS];
  const activeItem = allItems.find((i) => i.id === currentPage);

  const SidebarContent = ({ closeMobile }: { closeMobile?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/8">
        <button
          type="button"
          onClick={() => {
            onNavigate("home");
            closeMobile?.();
          }}
          className="flex items-center gap-2.5"
          data-ocid="header.logo_button"
        >
          <div className="h-8 w-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
            <Shield className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-left">
            <div className="font-bold text-white text-sm leading-tight">
              SafeRoad AI
            </div>
            <div className="text-[10px] text-amber-400/70 font-medium tracking-wide">
              AI Platform
            </div>
          </div>
        </button>
      </div>

      {/* Nav sections */}
      <nav
        className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin"
        aria-label="Main navigation"
      >
        <NavSection
          title="Core Modules"
          items={CORE_MODULES}
          currentPage={currentPage}
          onNavigate={onNavigate}
          closeMobile={closeMobile}
        />
        <NavSection
          title="Advanced Features"
          items={ADVANCED_FEATURES}
          currentPage={currentPage}
          onNavigate={onNavigate}
          closeMobile={closeMobile}
        />
        <NavSection
          title="Account"
          items={PROFILE_ITEMS}
          currentPage={currentPage}
          onNavigate={onNavigate}
          closeMobile={closeMobile}
        />
      </nav>

      {/* User badge */}
      <div className="px-3 py-3 border-t border-white/8">
        <button
          type="button"
          onClick={() => {
            onNavigate("profile");
            closeMobile?.();
          }}
          className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg hover:bg-white/5 transition-colors"
          data-ocid="header.profile_button"
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-gray-900 flex-shrink-0">
            NM
          </div>
          <div className="text-left min-w-0">
            <div className="text-sm font-semibold text-white truncate">
              Naman Maheshwari
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Active
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: "#0a0f1e" }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col w-56 min-h-screen sticky top-0 h-screen flex-shrink-0 border-r border-white/8"
        style={{ background: "#0f172a" }}
        data-ocid="sidebar.nav"
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 flex"
          data-ocid="header.mobile_nav"
        >
          <div
            className="w-64 h-full flex flex-col border-r border-white/8"
            style={{ background: "#0f172a" }}
          >
            <SidebarContent closeMobile={() => setMobileOpen(false)} />
          </div>
          <button
            type="button"
            className="flex-1 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
        <header
          className="md:hidden sticky top-0 z-30 h-14 flex items-center justify-between px-4 border-b border-white/8"
          style={{ background: "#0f172a" }}
          data-ocid="header.nav"
        >
          <div className="flex items-center gap-1">
            {currentPage !== "home" && (
              <button
                type="button"
                onClick={() => onNavigate("home")}
                className="flex items-center justify-center h-9 w-9 rounded-md text-slate-300 hover:bg-white/10 hover:text-amber-400 transition-colors"
                aria-label="Back to home"
                data-ocid="header.back_button"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex items-center justify-center h-9 w-9 rounded-md text-slate-300 hover:bg-white/10 transition-colors"
              aria-label="Open menu"
              data-ocid="header.mobile_menu_toggle"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2"
          >
            <Shield className="h-5 w-5 text-amber-400" />
            <span className="font-bold text-white text-sm">SafeRoad AI</span>
          </button>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[10px] text-slate-400">India</span>
          </div>
        </header>

        {/* Page breadcrumb bar (desktop) */}
        <div
          className="hidden md:flex items-center gap-2 px-6 py-2.5 border-b border-white/6 text-xs text-slate-500"
          style={{ background: "#0a0f1e" }}
        >
          <Shield className="h-3 w-3 text-amber-400/60" />
          {currentPage !== "home" ? (
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors"
              data-ocid="breadcrumb.home_link"
            >
              <Home className="h-3 w-3" />
              <span>Home</span>
            </button>
          ) : (
            <span>SafeRoad AI</span>
          )}
          {activeItem && currentPage !== "home" && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-300">{activeItem.label}</span>
            </>
          )}
          <div className="ml-auto flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-emerald-400" />
            <span className="text-emerald-400/80 text-[10px]">India</span>
          </div>
        </div>

        <main className="flex-1" data-ocid="main.content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
