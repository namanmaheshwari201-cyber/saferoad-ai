import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  GraduationCap,
  MapPin,
  Shield,
  ShieldAlert,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface SchoolZone {
  id: number;
  name: string;
  city: string;
  address: string;
  speedLimit: number;
  radiusM: number;
  active: boolean;
  type: "School" | "Hospital" | "College";
}

const ZONES: SchoolZone[] = [
  {
    id: 1,
    name: "Kendriya Vidyalaya No. 1",
    city: "Delhi",
    address: "Chankyapuri, New Delhi",
    speedLimit: 20,
    radiusM: 300,
    active: true,
    type: "School",
  },
  {
    id: 2,
    name: "AIIMS Delhi",
    city: "Delhi",
    address: "Ansari Nagar, New Delhi",
    speedLimit: 15,
    radiusM: 500,
    active: true,
    type: "Hospital",
  },
  {
    id: 3,
    name: "IIT Bombay",
    city: "Mumbai",
    address: "Powai, Mumbai",
    speedLimit: 25,
    radiusM: 400,
    active: false,
    type: "College",
  },
  {
    id: 4,
    name: "St. Xavier's High School",
    city: "Mumbai",
    address: "Fort, Mumbai",
    speedLimit: 20,
    radiusM: 250,
    active: true,
    type: "School",
  },
  {
    id: 5,
    name: "Nimhans Hospital",
    city: "Bengaluru",
    address: "Hosur Road, Bengaluru",
    speedLimit: 15,
    radiusM: 500,
    active: true,
    type: "Hospital",
  },
  {
    id: 6,
    name: "Jawahar Navodaya Vidyalaya",
    city: "Jaipur",
    address: "Kalwad Road, Jaipur",
    speedLimit: 20,
    radiusM: 300,
    active: false,
    type: "School",
  },
  {
    id: 7,
    name: "Birla School",
    city: "Kolkata",
    address: "Morabadi, Kolkata",
    speedLimit: 20,
    radiusM: 250,
    active: true,
    type: "School",
  },
  {
    id: 8,
    name: "PGIMER",
    city: "Chandigarh",
    address: "Sector 12, Chandigarh",
    speedLimit: 15,
    radiusM: 600,
    active: true,
    type: "Hospital",
  },
];

const TYPE_CONFIG = {
  School: {
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
  },
  Hospital: {
    color: "text-red-400",
    bg: "bg-red-500/15",
    border: "border-red-500/30",
  },
  College: {
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
  },
};

export function SchoolZonePage() {
  const [armed, setArmed] = useState(false);
  const [childSafetyMode, setChildSafetyMode] = useState(false);
  const [inZone, setInZone] = useState(false);
  const [currentZone, setCurrentZone] = useState<SchoolZone | null>(null);
  const [statusMsg, setStatusMsg] = useState("Zone detection is disarmed");

  const zoneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const zoneIndexRef = useRef<number>(0);

  const activeZones = ZONES.filter((z) => z.active).length;

  const playBeep = () => {
    const ctx = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();
    const playTone = (startTime: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.value = 0.8;
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + 0.3);
    };
    playTone(0);
    playTone(0.4);
    playTone(0.8);
  };

  const clearTimers = () => {
    if (zoneTimerRef.current) {
      clearTimeout(zoneTimerRef.current);
      zoneTimerRef.current = null;
    }
    if (cycleTimerRef.current) {
      clearTimeout(cycleTimerRef.current);
      cycleTimerRef.current = null;
    }
  };

  const enterZone = (zoneIdx: number) => {
    const zone = ZONES[zoneIdx % ZONES.length];
    zoneIndexRef.current = zoneIdx;
    setInZone(true);
    setCurrentZone(zone);
    setStatusMsg(`Entering zone: ${zone.name}`);
    playBeep();
    toast.warning("⚠️ Entering Zone!", {
      description: `${zone.name} — Speed limit: ${zone.speedLimit} km/h`,
      duration: 5000,
    });

    // After 10s in zone → exit, scan for 5s, then enter next zone
    zoneTimerRef.current = setTimeout(() => {
      setInZone(false);
      setCurrentZone(null);
      setStatusMsg("Scanning for zones...");

      // After 5s scanning → next zone
      cycleTimerRef.current = setTimeout(() => {
        enterZone(zoneIdx + 1);
      }, 5000);
    }, 10000);
  };

  const handleArm = () => {
    const next = !armed;
    setArmed(next);
    if (next) {
      zoneIndexRef.current = 0;
      setStatusMsg("Monitoring — No active zone detected");
      toast.info("Zone detection activated", {
        description: "AI monitoring for school and hospital zones",
      });
      // Simulate entering first zone after 2s
      zoneTimerRef.current = setTimeout(() => {
        enterZone(0);
      }, 2000);
    } else {
      clearTimers();
      setInZone(false);
      setCurrentZone(null);
      setStatusMsg("Zone detection is disarmed");
      toast.success("Zone detection deactivated");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (zoneTimerRef.current) clearTimeout(zoneTimerRef.current);
      if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
    };
  }, []);

  const handleChildSafety = () => {
    const next = !childSafetyMode;
    setChildSafetyMode(next);
    toast[next ? "warning" : "success"](
      next ? "👶 Child Safety Mode Activated" : "Child Safety Mode Deactivated",
      {
        description: next
          ? "Speed warnings and zone alerts maximised"
          : "Normal alert mode restored",
      },
    );
  };

  return (
    <div
      className="relative"
      style={{ background: "#0a0f1e", minHeight: "100vh" }}
    >
      {/* Child Safety Mode Banner */}
      {childSafetyMode && (
        <div className="sticky top-0 z-20 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-black font-bold text-sm animate-pulse">
          <ShieldAlert className="h-4 w-4" />
          CHILD SAFETY MODE ACTIVE — Reduce Speed — School Zones Ahead
          <ShieldAlert className="h-4 w-4" />
        </div>
      )}

      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              School Zone Protection
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Auto-detect school and hospital zones — activate child safety
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Zones Monitored",
              value: ZONES.length,
              color: "text-amber-400",
            },
            {
              label: "Active Today",
              value: activeZones,
              color: "text-emerald-400",
            },
            {
              label: "Violations Prevented",
              value: 142,
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

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Zone Detection */}
          <Card
            className={`border ${armed && inZone ? "border-amber-500/60" : armed ? "border-emerald-500/30" : "border-white/10"}`}
            style={{ background: "#0f172a" }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-200">
                Active Zone Detection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {armed && inZone && currentZone ? (
                <div className="rounded-xl p-4 border border-amber-500/40 bg-amber-500/10 space-y-2 animate-pulse">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                    <span className="font-bold text-amber-300">
                      Zone Detected!
                    </span>
                  </div>
                  <div className="text-sm text-white font-semibold">
                    {currentZone.name}
                  </div>
                  <div className="text-xs text-slate-300">
                    {currentZone.address}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="rounded-full h-14 w-14 bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                      <span className="text-lg font-black text-red-400">
                        {currentZone.speedLimit}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Speed Limit</div>
                      <div className="text-white font-bold">
                        {currentZone.speedLimit} km/h
                      </div>
                      <div className="text-xs text-slate-400">
                        Radius: {currentZone.radiusM}m
                      </div>
                    </div>
                  </div>
                </div>
              ) : armed ? (
                <div className="rounded-xl p-4 border border-emerald-500/30 bg-emerald-500/8 flex items-center gap-3">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </div>
                  <span className="text-sm text-emerald-300">{statusMsg}</span>
                </div>
              ) : (
                <div className="rounded-xl p-4 border border-white/10 bg-white/3 flex items-center gap-3">
                  <Shield className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-500">{statusMsg}</span>
                </div>
              )}
              <Button
                type="button"
                onClick={handleArm}
                data-ocid="schoolzone.arm_toggle"
                className={
                  armed
                    ? "w-full bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                    : "w-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                }
              >
                {armed ? (
                  <ToggleRight className="h-4 w-4 mr-2" />
                ) : (
                  <ToggleLeft className="h-4 w-4 mr-2" />
                )}
                {armed
                  ? "Deactivate Detection Zone"
                  : "Activate Detection Zone"}
              </Button>
            </CardContent>
          </Card>

          {/* Child Safety Mode */}
          <Card
            className={`border ${childSafetyMode ? "border-amber-500/60" : "border-white/10"}`}
            style={{ background: "#0f172a" }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-200">
                Child Safety Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-400">
                When enabled, maximum alerts and warnings are activated for all
                school and hospital zones. A prominent banner appears at the top
                of the screen.
              </p>
              <div
                className={`rounded-xl p-4 border ${childSafetyMode ? "border-amber-500/40 bg-amber-500/10" : "border-white/10 bg-white/3"} flex items-center gap-3`}
              >
                <ShieldAlert
                  className={`h-5 w-5 ${childSafetyMode ? "text-amber-400" : "text-slate-500"}`}
                />
                <span
                  className={`text-sm font-medium ${childSafetyMode ? "text-amber-300" : "text-slate-500"}`}
                >
                  {childSafetyMode
                    ? "Active — Maximum protection enabled"
                    : "Inactive"}
                </span>
              </div>
              <Button
                type="button"
                onClick={handleChildSafety}
                data-ocid="schoolzone.child_safety_toggle"
                className={
                  childSafetyMode
                    ? "w-full bg-amber-500 text-black font-bold hover:bg-amber-600"
                    : "w-full bg-white/10 text-slate-300 border border-white/20 hover:bg-white/15"
                }
              >
                {childSafetyMode
                  ? "Deactivate Child Safety Mode"
                  : "Activate Child Safety Mode"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Zone Map Grid */}
        <div>
          <h2 className="text-sm font-semibold text-slate-300 mb-3">
            Protected Zones Map
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {ZONES.map((zone) => {
              const cfg = TYPE_CONFIG[zone.type];
              return (
                <div
                  key={zone.id}
                  data-ocid={`schoolzone.zone.${zone.id}`}
                  className={`rounded-xl border p-3 space-y-2 ${cfg.bg} ${cfg.border}`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {zone.name}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        <span className="text-[10px] text-slate-400">
                          {zone.city}
                        </span>
                      </div>
                    </div>
                    <Badge
                      className={`${cfg.bg} ${cfg.color} border ${cfg.border} text-[10px] shrink-0`}
                    >
                      {zone.type}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div
                      className="rounded p-1.5"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      <div className="text-slate-500">Speed Limit</div>
                      <div className={`font-bold ${cfg.color}`}>
                        {zone.speedLimit} km/h
                      </div>
                    </div>
                    <div
                      className="rounded p-1.5"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      <div className="text-slate-500">Radius</div>
                      <div className="font-bold text-white">
                        {zone.radiusM}m
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${zone.active ? "bg-emerald-400" : "bg-slate-600"}`}
                    />
                    <span
                      className={`text-[10px] ${zone.active ? "text-emerald-400" : "text-slate-500"}`}
                    >
                      {zone.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchoolZonePage;
