import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import {
  AlertTriangle,
  Ambulance,
  CheckCircle,
  ChevronRight,
  Clock,
  Flame,
  Heart,
  Hospital,
  MapPin,
  Phone,
  Route,
  Shield,
  ShieldAlert,
  Star,
  Truck,
  Wifi,
  WifiOff,
  Wrench,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type EmergencyCategory =
  | "hospitals"
  | "trauma"
  | "police"
  | "fire"
  | "ambulances";

interface Facility {
  name: string;
  distance: string;
  eta: string;
  phone: string;
}

const FACILITIES: Record<EmergencyCategory, Facility[]> = {
  hospitals: [
    {
      name: "AIIMS Delhi",
      distance: "1.2 km",
      eta: "4 min",
      phone: "011-26588500",
    },
    {
      name: "Apollo Hospital, Saket",
      distance: "2.8 km",
      eta: "9 min",
      phone: "011-71791090",
    },
    {
      name: "Safdarjung Hospital",
      distance: "3.5 km",
      eta: "12 min",
      phone: "011-26707444",
    },
  ],
  trauma: [
    {
      name: "PGI Chandigarh Trauma Centre",
      distance: "0.9 km",
      eta: "3 min",
      phone: "0172-2755000",
    },
    {
      name: "AIIMS Trauma Centre",
      distance: "1.4 km",
      eta: "5 min",
      phone: "011-26593263",
    },
    {
      name: "Max Super Speciality Hospital",
      distance: "4.1 km",
      eta: "14 min",
      phone: "011-26515050",
    },
  ],
  police: [
    {
      name: "Connaught Place Police Station",
      distance: "0.7 km",
      eta: "3 min",
      phone: "100",
    },
    {
      name: "Karol Bagh PCR Van",
      distance: "1.1 km",
      eta: "4 min",
      phone: "011-23414100",
    },
    {
      name: "Patel Nagar Police Post",
      distance: "2.3 km",
      eta: "8 min",
      phone: "011-25883000",
    },
  ],
  fire: [
    {
      name: "Delhi Fire Service HQ",
      distance: "1.8 km",
      eta: "6 min",
      phone: "101",
    },
    {
      name: "Rajouri Garden Fire Station",
      distance: "2.5 km",
      eta: "8 min",
      phone: "011-25444444",
    },
    {
      name: "Dwarka Fire Station",
      distance: "3.9 km",
      eta: "13 min",
      phone: "011-25086444",
    },
  ],
  ambulances: [
    {
      name: "CATS Ambulance Unit-7",
      distance: "0.5 km",
      eta: "2 min",
      phone: "102",
    },
    {
      name: "AIIMS Mobile ICU",
      distance: "1.3 km",
      eta: "5 min",
      phone: "011-26593474",
    },
    {
      name: "Ziqitza Ambulance Delhi",
      distance: "2.0 km",
      eta: "7 min",
      phone: "1066",
    },
  ],
};

type ServiceCategory = "tow" | "mechanic" | "puncture" | "service";

interface RescueProvider {
  name: string;
  distance: string;
  rating: number;
  phone: string;
}

const RESCUE_PROVIDERS: Record<ServiceCategory, RescueProvider[]> = {
  tow: [
    {
      name: "Sharma Tow Service",
      distance: "0.8 km",
      rating: 4.5,
      phone: "98101-23456",
    },
    {
      name: "Delhi 24x7 Towing",
      distance: "1.6 km",
      rating: 4.2,
      phone: "98991-87654",
    },
    {
      name: "National Highway Recovery",
      distance: "2.3 km",
      rating: 4.7,
      phone: "97111-54321",
    },
  ],
  mechanic: [
    {
      name: "Raju Auto Works",
      distance: "0.4 km",
      rating: 4.6,
      phone: "99101-11223",
    },
    {
      name: "Singh Motors & Repair",
      distance: "1.1 km",
      rating: 4.3,
      phone: "98765-44556",
    },
    {
      name: "Om Car Care Centre",
      distance: "2.1 km",
      rating: 4.8,
      phone: "97888-77890",
    },
  ],
  puncture: [
    {
      name: "Ramesh Tyre Shop",
      distance: "0.2 km",
      rating: 4.4,
      phone: "95554-11223",
    },
    {
      name: "Quick Fix Puncture",
      distance: "0.9 km",
      rating: 4.1,
      phone: "98100-33445",
    },
    {
      name: "Highway Tyre Service",
      distance: "1.5 km",
      rating: 4.5,
      phone: "99554-66778",
    },
  ],
  service: [
    {
      name: "Maruti Service Centre, Dwarka",
      distance: "1.3 km",
      rating: 4.7,
      phone: "011-45678901",
    },
    {
      name: "Hyundai Authorised Service",
      distance: "2.0 km",
      rating: 4.5,
      phone: "011-45111234",
    },
    {
      name: "Tata Motors Service Hub",
      distance: "2.8 km",
      rating: 4.6,
      phone: "011-46789012",
    },
  ],
};

type FirstAidTopic =
  | "CPR"
  | "Burns"
  | "Bleeding"
  | "Fractures"
  | "Choking"
  | "Drowning";

const FIRST_AID: Record<FirstAidTopic, { warning: string; steps: string[] }> = {
  CPR: {
    warning: "Call 112 immediately before starting CPR.",
    steps: [
      "Lay the person flat on their back on a firm surface.",
      "Tilt head back, lift chin to open the airway.",
      "Check for normal breathing for no more than 10 seconds.",
      "Place heel of hand on centre of chest, interlock fingers.",
      "Push down firmly 5–6 cm at 100–120 compressions per minute.",
      "Give 2 rescue breaths: pinch nose, cover mouth, blow until chest rises.",
      "Continue 30:2 cycles until emergency services arrive.",
    ],
  },
  Burns: {
    warning: "Do NOT apply butter, toothpaste, or ice to a burn.",
    steps: [
      "Cool the burn under cool (not cold) running water for 20 minutes.",
      "Remove clothing/jewellery near the burn unless stuck to skin.",
      "Cover loosely with a clean non-fluffy material or cling film.",
      "Do not burst any blisters — risk of infection.",
      "Take over-the-counter painkillers as needed for pain relief.",
      "Seek medical attention for burns larger than 3 cm or on face/hands.",
    ],
  },
  Bleeding: {
    warning: "Severe bleeding is life-threatening — call 112 immediately.",
    steps: [
      "Apply firm, direct pressure on the wound with a clean cloth.",
      "Maintain continuous pressure for at least 10 minutes without lifting.",
      "Elevate the injured limb above the level of the heart if possible.",
      "Do NOT remove embedded objects — apply pressure around them.",
      "If cloth becomes saturated, add more on top without removing first.",
      "Monitor for signs of shock: pale skin, rapid breathing, confusion.",
      "Keep the person warm and calm until ambulance arrives.",
    ],
  },
  Fractures: {
    warning: "Do NOT attempt to straighten a broken bone.",
    steps: [
      "Keep the injured area still — immobilize it in the position found.",
      "Apply ice wrapped in cloth to reduce swelling (not directly on skin).",
      "Improvise a splint using stiff material and bandages/cloth strips.",
      "Secure splint above and below the break, not over the fracture site.",
      "Check circulation below fracture: pulse, sensation, warmth.",
      "For suspected spine injuries, do NOT move the person at all.",
      "Call 112 and wait for professional medical assistance.",
    ],
  },
  Choking: {
    warning: "If the person cannot cough, speak, or breathe — act immediately.",
    steps: [
      "Encourage the person to cough firmly if they can.",
      "Lean them forward and give up to 5 sharp back blows between shoulder blades.",
      "If back blows fail, stand behind them and perform 5 abdominal thrusts.",
      "Make a fist, place above navel, grasp with other hand, thrust inward-upward.",
      "Alternate 5 back blows with 5 abdominal thrusts.",
      "If they become unconscious, lower to floor and begin CPR.",
      "Call 112 even if the obstruction clears — internal injury is possible.",
    ],
  },
  Drowning: {
    warning: "Do NOT enter water unless trained — use rope or reaching aid.",
    steps: [
      "Call 112 immediately and get the person out of the water safely.",
      "Check for responsiveness — tap shoulders, shout.",
      "If unresponsive and not breathing normally, begin CPR immediately.",
      "Give 5 initial rescue breaths before starting chest compressions.",
      "Continue 30:2 compressions-to-breaths until help arrives.",
      "Keep the person warm — remove wet clothes, cover with blanket.",
      "Place in recovery position if breathing but unconscious.",
    ],
  },
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const DEFAULT_PROFILE = {
  bloodGroup: "O+",
  allergies: "Penicillin, Sulfa drugs",
  conditions: "None",
  contact1Name: "Priya Maheshwari",
  contact1Phone: "98765-43210",
  contact2Name: "Rahul Maheshwari",
  contact2Phone: "97654-32109",
  insuranceProvider: "Star Health Insurance",
  policyNumber: "P/191232/01/2024/012345",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3 w-3 ${
            s <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

function FacilityCard({ facility }: { facility: Facility }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-secondary/20 p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{facility.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {facility.distance}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> ETA {facility.eta}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3" /> {facility.phone}
          </span>
        </div>
      </div>
      <div className="flex flex-shrink-0 flex-col gap-1.5">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 gap-1 border-emerald-500/40 text-xs text-emerald-400 hover:bg-emerald-500/10"
          onClick={() => toast.success(`Calling ${facility.phone}`)}
        >
          <Phone className="h-3 w-3" /> Call
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 gap-1 text-xs"
          onClick={() => toast.info(`Routing to ${facility.name}`)}
        >
          <Route className="h-3 w-3" /> Route
        </Button>
      </div>
    </div>
  );
}

const CATEGORY_META: Record<
  EmergencyCategory,
  { label: string; icon: React.ReactNode; color: string }
> = {
  hospitals: {
    label: "Hospitals",
    icon: <Hospital className="h-5 w-5" />,
    color: "text-blue-400",
  },
  trauma: {
    label: "Trauma Centers",
    icon: <Heart className="h-5 w-5" />,
    color: "text-red-400",
  },
  police: {
    label: "Police Stations",
    icon: <Shield className="h-5 w-5" />,
    color: "text-indigo-400",
  },
  fire: {
    label: "Fire Stations",
    icon: <Flame className="h-5 w-5" />,
    color: "text-orange-400",
  },
  ambulances: {
    label: "Ambulances",
    icon: <Ambulance className="h-5 w-5" />,
    color: "text-emerald-400",
  },
};

const SERVICE_META: Record<
  ServiceCategory,
  { label: string; icon: React.ReactNode }
> = {
  tow: { label: "Tow Trucks", icon: <Truck className="h-5 w-5" /> },
  mechanic: { label: "Mechanics", icon: <Wrench className="h-5 w-5" /> },
  puncture: { label: "Puncture Shops", icon: <Zap className="h-5 w-5" /> },
  service: {
    label: "Service Centers",
    icon: <ShieldAlert className="h-5 w-5" />,
  },
};

export function RoadSOSPage() {
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(10);
  const sosIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [accelArmed, setAccelArmed] = useState(false);
  const [motionAvailable, setMotionAvailable] = useState(false);
  const [lastCheck, setLastCheck] = useState<string>("Not started");

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locationLabel, setLocationLabel] = useState("Detecting...");

  const [activeCategory, setActiveCategory] =
    useState<EmergencyCategory>("hospitals");

  const [goldenActive, setGoldenActive] = useState(false);
  const [goldenTimer, setGoldenTimer] = useState(600);
  const goldenRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [firstAidTopic, setFirstAidTopic] = useState<FirstAidTopic | "">("CPR");

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("rg_emergency_profile");
    return saved
      ? (JSON.parse(saved) as typeof DEFAULT_PROFILE)
      : DEFAULT_PROFILE;
  });

  const [activeService, setActiveService] = useState<ServiceCategory>("tow");
  const [requestModal, setRequestModal] = useState<{
    open: boolean;
    provider: RescueProvider | null;
  }>({
    open: false,
    provider: null,
  });

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLabel(
          `${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`,
        );
      },
      () => setLocationLabel("New Delhi, India (default)"),
    );
  }, []);

  useEffect(() => {
    setMotionAvailable(typeof DeviceMotionEvent !== "undefined");
  }, []);

  useEffect(() => {
    if (sosModalOpen) {
      setSosCountdown(10);
      sosIntervalRef.current = setInterval(() => {
        setSosCountdown((c) => {
          if (c <= 1) {
            clearInterval(sosIntervalRef.current!);
            toast.error(
              "SOS Activated! Emergency services notified. Calling 112...",
              { duration: 6000 },
            );
            setSosModalOpen(false);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } else {
      if (sosIntervalRef.current) clearInterval(sosIntervalRef.current);
    }
    return () => {
      if (sosIntervalRef.current) clearInterval(sosIntervalRef.current);
    };
  }, [sosModalOpen]);

  useEffect(() => {
    if (goldenActive) {
      setGoldenTimer(600);
      goldenRef.current = setInterval(() => {
        setGoldenTimer((t) => {
          if (t <= 1) {
            clearInterval(goldenRef.current!);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (goldenRef.current) clearInterval(goldenRef.current);
    }
    return () => {
      if (goldenRef.current) clearInterval(goldenRef.current);
    };
  }, [goldenActive]);

  const handleAccelToggle = useCallback(() => {
    if (accelArmed) {
      setAccelArmed(false);
      setLastCheck("Disarmed");
      toast.info("Accident detection disarmed.");
      return;
    }
    setAccelArmed(true);
    setLastCheck(new Date().toLocaleTimeString());
    toast.success("Accident detection armed and monitoring.");
    if (motionAvailable) {
      const handler = (e: DeviceMotionEvent) => {
        const acc = e.accelerationIncludingGravity;
        if (!acc) return;
        const mag = Math.sqrt(
          (acc.x ?? 0) ** 2 + (acc.y ?? 0) ** 2 + (acc.z ?? 0) ** 2,
        );
        setLastCheck(new Date().toLocaleTimeString());
        if (mag > 30) {
          toast.error("⚠️ Sudden impact detected! Opening SOS...", {
            duration: 5000,
          });
          setSosModalOpen(true);
          window.removeEventListener("devicemotion", handler);
        }
      };
      window.addEventListener("devicemotion", handler);
    }
  }, [accelArmed, motionAvailable]);

  const simulateAccident = () => {
    setLastCheck(new Date().toLocaleTimeString());
    toast.error("⚠️ Simulated impact detected! SOS activated.", {
      duration: 5000,
    });
    setSosModalOpen(true);
  };

  const saveProfile = () => {
    localStorage.setItem("rg_emergency_profile", JSON.stringify(profile));
    toast.success("Emergency profile saved successfully.");
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const firstAidData =
    firstAidTopic && firstAidTopic in FIRST_AID
      ? FIRST_AID[firstAidTopic as FirstAidTopic]
      : null;

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="border-b border-border bg-card px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                RoadSOS
              </h1>
              <p className="text-sm text-muted-foreground">
                Emergency Assistance · India Emergency: 112
              </p>
            </div>
            <Badge
              className="ml-auto border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
              variant="outline"
            >
              <Wifi className="mr-1 h-3 w-3" /> Online
            </Badge>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
        {/* SECTION 1: Emergency Dashboard */}
        <section data-ocid="sos.section">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-destructive/40 bg-destructive/5">
              <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
                <button
                  type="button"
                  data-ocid="sos.primary_button"
                  onClick={() => setSosModalOpen(true)}
                  className="group flex h-32 w-32 flex-col items-center justify-center rounded-full border-4 border-destructive bg-destructive/20 text-destructive shadow-lg shadow-destructive/30 transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground active:scale-95"
                  aria-label="Activate SOS Emergency"
                >
                  <AlertTriangle className="h-10 w-10" />
                  <span className="mt-1 text-sm font-bold tracking-widest">
                    SOS
                  </span>
                </button>
                <div className="text-center">
                  <p className="font-semibold text-foreground">SOS EMERGENCY</p>
                  <p className="text-xs text-muted-foreground">
                    Tap to activate · Calls 112
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldAlert className="h-4 w-4 text-amber-400" /> Accident
                  Detection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  type="button"
                  data-ocid="sos.detection_toggle"
                  variant={accelArmed ? "destructive" : "outline"}
                  className="w-full"
                  onClick={handleAccelToggle}
                >
                  {accelArmed ? (
                    <>
                      <ShieldAlert className="mr-2 h-4 w-4" /> Armed —
                      Monitoring
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" /> Arm Detection
                    </>
                  )}
                </Button>
                {accelArmed && !motionAvailable && (
                  <Button
                    type="button"
                    data-ocid="sos.simulate_button"
                    variant="outline"
                    size="sm"
                    className="w-full border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
                    onClick={simulateAccident}
                  >
                    Simulate Accident (Demo)
                  </Button>
                )}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Motion sensor</span>
                    <span
                      className={
                        motionAvailable ? "text-emerald-400" : "text-amber-400"
                      }
                    >
                      {motionAvailable ? "Available" : "Unavailable (desktop)"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span
                      className={
                        accelArmed
                          ? "text-emerald-400"
                          : "text-muted-foreground"
                      }
                    >
                      {accelArmed ? "Monitoring" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last check</span>
                    <span className="text-foreground">{lastCheck}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4 border-border bg-card">
            <CardContent className="grid grid-cols-3 divide-x divide-border p-0">
              <div className="px-4 py-3">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                  {locationLabel}
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs text-muted-foreground">Detection</p>
                <p
                  className={`mt-0.5 text-sm font-medium ${accelArmed ? "text-emerald-400" : "text-muted-foreground"}`}
                >
                  {accelArmed ? "Armed" : "Inactive"}
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs text-muted-foreground">GPS Fix</p>
                <p
                  className={`mt-0.5 text-sm font-medium ${location ? "text-emerald-400" : "text-amber-400"}`}
                >
                  {location ? "Active" : "Searching"}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SECTIONS 2–5: Tabbed Interface */}
        <Tabs defaultValue="locator" className="w-full">
          <TabsList
            className="grid w-full grid-cols-4 bg-card"
            data-ocid="sos.tab"
          >
            <TabsTrigger value="locator" data-ocid="sos.locator_tab">
              Locator
            </TabsTrigger>
            <TabsTrigger value="golden" data-ocid="sos.golden_tab">
              Golden Hour
            </TabsTrigger>
            <TabsTrigger value="profile" data-ocid="sos.profile_tab">
              Profile
            </TabsTrigger>
            <TabsTrigger value="rescue" data-ocid="sos.rescue_tab">
              Rescue
            </TabsTrigger>
          </TabsList>

          {/* SECTION 2: Emergency Locator */}
          <TabsContent value="locator" className="mt-4 space-y-4">
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" /> Detected Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 rounded-lg bg-secondary/30 px-3 py-2">
                  {location ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-amber-400" />
                  )}
                  <span className="text-sm text-foreground">
                    {locationLabel}
                  </span>
                  {location && (
                    <Badge
                      variant="outline"
                      className="ml-auto border-emerald-500/30 text-xs text-emerald-400"
                    >
                      GPS Active
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <div
              className="grid grid-cols-5 gap-2"
              data-ocid="sos.category_list"
            >
              {(Object.keys(CATEGORY_META) as EmergencyCategory[]).map(
                (cat) => {
                  const meta = CATEGORY_META[cat];
                  return (
                    <button
                      type="button"
                      key={cat}
                      data-ocid={`sos.category.${cat}`}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                        activeCategory === cat
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:bg-secondary/30"
                      }`}
                    >
                      <span className={meta.color}>{meta.icon}</span>
                      <span className="text-xs leading-tight text-foreground">
                        {meta.label}
                      </span>
                    </button>
                  );
                },
              )}
            </div>

            <div className="space-y-2" data-ocid="sos.facility_list">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Nearby {CATEGORY_META[activeCategory].label}
              </h3>
              {FACILITIES[activeCategory].map((f, i) => (
                <div key={f.name} data-ocid={`sos.facility.item.${i + 1}`}>
                  <FacilityCard facility={f} />
                </div>
              ))}
            </div>
          </TabsContent>

          {/* SECTION 3: Golden Hour Mode */}
          <TabsContent value="golden" className="mt-4 space-y-4">
            <Card
              className={`border-2 ${goldenActive ? "border-destructive bg-destructive/10" : "border-border bg-card"}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
                      goldenActive
                        ? "animate-pulse bg-destructive/20"
                        : "bg-amber-500/10"
                    }`}
                  >
                    <Heart
                      className={`h-6 w-6 ${goldenActive ? "text-destructive" : "text-amber-400"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-lg font-bold text-foreground">
                      Golden Hour Mode
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Activates a critical-response overlay with the nearest
                      trauma centre, ambulance number, and guided emergency
                      steps. The first 60 minutes after a trauma incident are
                      critical for survival.
                    </p>
                    {goldenActive && (
                      <div className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-bold text-destructive">
                            GOLDEN HOUR ACTIVE
                          </span>
                          <span className="font-mono text-xl font-bold text-destructive">
                            {formatTimer(goldenTimer)}
                          </span>
                        </div>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex items-center gap-2">
                            <Hospital className="h-4 w-4 text-blue-400" />
                            <span className="font-medium text-foreground">
                              AIIMS Delhi Trauma Centre
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-emerald-400" />
                            <span className="text-foreground">
                              Ambulance: 102 | Emergency: 112
                            </span>
                          </div>
                          <div className="mt-2 rounded bg-card p-2 text-xs text-muted-foreground">
                            1. Keep patient still and conscious. 2. Control
                            bleeding with direct pressure. 3. Do not give food
                            or water. 4. Stay on the line with emergency
                            services.
                          </div>
                        </div>
                        <Button
                          type="button"
                          data-ocid="sos.golden_deactivate_button"
                          variant="outline"
                          size="sm"
                          className="mt-3 w-full border-destructive/40 text-destructive hover:bg-destructive/10"
                          onClick={() => setGoldenActive(false)}
                        >
                          Deactivate Golden Hour Mode
                        </Button>
                      </div>
                    )}
                    {!goldenActive && (
                      <Button
                        type="button"
                        data-ocid="sos.golden_activate_button"
                        className="mt-4 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => {
                          setGoldenActive(true);
                          toast.error(
                            "Golden Hour Mode Activated — emergency protocol engaged",
                            { duration: 5000 },
                          );
                        }}
                      >
                        <Heart className="mr-2 h-4 w-4" /> Activate Golden Hour
                        Mode
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Heart className="h-4 w-4 text-red-400" /> First Aid AI Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Select Emergency Type
                  </Label>
                  <Select
                    value={firstAidTopic}
                    onValueChange={(v) => setFirstAidTopic(v as FirstAidTopic)}
                  >
                    <SelectTrigger
                      className="border-input bg-secondary/30"
                      data-ocid="sos.firstaid_select"
                    >
                      <SelectValue placeholder="Choose emergency..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(FIRST_AID) as FirstAidTopic[]).map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {firstAidData && (
                  <div className="space-y-3" data-ocid="sos.firstaid_guide">
                    <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                      <p className="text-sm font-medium text-amber-300">
                        {firstAidData.warning}
                      </p>
                    </div>
                    <ol className="space-y-2">
                      {firstAidData.steps.map((step) => (
                        <li key={step} className="flex gap-3">
                          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                            {firstAidData.steps.indexOf(step) + 1}
                          </span>
                          <span className="text-sm text-foreground">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECTION 4: Emergency Profile */}
          <TabsContent value="profile" className="mt-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-4 w-4 text-primary" /> Emergency Medical
                  Profile — Naman Maheshwari
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="blood-group"
                      className="text-xs text-muted-foreground"
                    >
                      Blood Group
                    </Label>
                    <Select
                      value={profile.bloodGroup}
                      onValueChange={(v) =>
                        setProfile((p) => ({ ...p, bloodGroup: v }))
                      }
                    >
                      <SelectTrigger
                        id="blood-group"
                        className="border-input bg-secondary/30"
                        data-ocid="sos.bloodgroup_select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_GROUPS.map((bg) => (
                          <SelectItem key={bg} value={bg}>
                            {bg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="insurance"
                      className="text-xs text-muted-foreground"
                    >
                      Insurance Provider
                    </Label>
                    <Input
                      id="insurance"
                      data-ocid="sos.insurance_input"
                      className="border-input bg-secondary/30"
                      value={profile.insuranceProvider}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          insuranceProvider: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="policy"
                      className="text-xs text-muted-foreground"
                    >
                      Policy Number
                    </Label>
                    <Input
                      id="policy"
                      data-ocid="sos.policy_input"
                      className="border-input bg-secondary/30"
                      value={profile.policyNumber}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          policyNumber: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="allergies"
                    className="text-xs text-muted-foreground"
                  >
                    Known Allergies
                  </Label>
                  <Textarea
                    id="allergies"
                    data-ocid="sos.allergies_textarea"
                    className="border-input bg-secondary/30"
                    rows={2}
                    value={profile.allergies}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, allergies: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="conditions"
                    className="text-xs text-muted-foreground"
                  >
                    Medical Conditions
                  </Label>
                  <Textarea
                    id="conditions"
                    data-ocid="sos.conditions_textarea"
                    className="border-input bg-secondary/30"
                    rows={2}
                    value={profile.conditions}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, conditions: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold text-muted-foreground">
                      Emergency Contact 1
                    </p>
                    <div className="space-y-2">
                      <Input
                        data-ocid="sos.contact1_name_input"
                        placeholder="Full name"
                        className="border-input bg-secondary/30"
                        value={profile.contact1Name}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            contact1Name: e.target.value,
                          }))
                        }
                      />
                      <Input
                        data-ocid="sos.contact1_phone_input"
                        placeholder="Phone number"
                        className="border-input bg-secondary/30"
                        value={profile.contact1Phone}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            contact1Phone: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold text-muted-foreground">
                      Emergency Contact 2
                    </p>
                    <div className="space-y-2">
                      <Input
                        data-ocid="sos.contact2_name_input"
                        placeholder="Full name"
                        className="border-input bg-secondary/30"
                        value={profile.contact2Name}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            contact2Name: e.target.value,
                          }))
                        }
                      />
                      <Input
                        data-ocid="sos.contact2_phone_input"
                        placeholder="Phone number"
                        className="border-input bg-secondary/30"
                        value={profile.contact2Phone}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            contact2Phone: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  data-ocid="sos.save_profile_button"
                  className="w-full"
                  onClick={saveProfile}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Save Emergency
                  Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECTION 5: Vehicle Rescue Network */}
          <TabsContent value="rescue" className="mt-4 space-y-4">
            <div
              className="grid grid-cols-4 gap-2"
              data-ocid="sos.service_list"
            >
              {(Object.keys(SERVICE_META) as ServiceCategory[]).map((cat) => {
                const meta = SERVICE_META[cat];
                return (
                  <button
                    type="button"
                    key={cat}
                    data-ocid={`sos.service.${cat}`}
                    onClick={() => setActiveService(cat)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                      activeService === cat
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:bg-secondary/30"
                    }`}
                  >
                    <span className="text-muted-foreground">{meta.icon}</span>
                    <span className="text-xs leading-tight text-foreground">
                      {meta.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2" data-ocid="sos.provider_list">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Nearby {SERVICE_META[activeService].label}
              </h3>
              {RESCUE_PROVIDERS[activeService].map((provider, i) => (
                <div
                  key={provider.name}
                  data-ocid={`sos.provider.item.${i + 1}`}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border bg-secondary/20 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {provider.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {provider.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {provider.phone}
                      </span>
                    </div>
                    <div className="mt-1">
                      <StarRating rating={provider.rating} />
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 flex-col gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 border-emerald-500/40 text-xs text-emerald-400 hover:bg-emerald-500/10"
                      onClick={() => toast.success(`Calling ${provider.phone}`)}
                    >
                      <Phone className="h-3 w-3" /> Call
                    </Button>
                    <Button
                      type="button"
                      data-ocid={`sos.request_button.${i + 1}`}
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 text-xs"
                      onClick={() => setRequestModal({ open: true, provider })}
                    >
                      <ChevronRight className="h-3 w-3" /> Request
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* SOS Modal */}
      <Dialog
        open={sosModalOpen}
        onOpenChange={(o) => {
          if (!o) setSosModalOpen(false);
        }}
      >
        <DialogContent
          data-ocid="sos.dialog"
          className="border-destructive/50 bg-background sm:max-w-sm"
        >
          <DialogHeader>
            <DialogTitle className="text-center text-destructive">
              ⚠️ SOS Activated
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 text-center">
            <p className="text-muted-foreground">
              Emergency services will be notified in
            </p>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-destructive">
              <span className="font-mono text-3xl font-bold text-destructive">
                {sosCountdown}
              </span>
            </div>
            <p className="font-semibold text-foreground">
              Calling{" "}
              <span className="text-destructive">112 — National Emergency</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Location: {locationLabel}
            </p>
            <Button
              type="button"
              data-ocid="sos.cancel_button"
              variant="outline"
              className="w-full"
              onClick={() => setSosModalOpen(false)}
            >
              Cancel SOS
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Assistance Modal */}
      <Dialog
        open={requestModal.open}
        onOpenChange={(o) => setRequestModal((m) => ({ ...m, open: o }))}
      >
        <DialogContent
          data-ocid="sos.request_dialog"
          className="border-border bg-background sm:max-w-sm"
        >
          <DialogHeader>
            <DialogTitle>Request Assistance</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {requestModal.provider && (
              <>
                <p className="text-sm text-muted-foreground">
                  Requesting{" "}
                  <span className="font-semibold text-foreground">
                    {requestModal.provider.name}
                  </span>{" "}
                  to your current location.
                </p>
                <div className="space-y-1 rounded-lg bg-secondary/30 p-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="text-foreground">{locationLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Distance</span>
                    <span className="text-foreground">
                      {requestModal.provider.distance}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact</span>
                    <span className="text-foreground">
                      {requestModal.provider.phone}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    type="button"
                    data-ocid="sos.confirm_button"
                    className="flex-1"
                    onClick={() => {
                      toast.success(
                        `${requestModal.provider!.name} notified! They will arrive soon.`,
                      );
                      setRequestModal({ open: false, provider: null });
                    }}
                  >
                    Confirm Request
                  </Button>
                  <Button
                    type="button"
                    data-ocid="sos.request_cancel_button"
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      setRequestModal({ open: false, provider: null })
                    }
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
