import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  Award,
  Calendar,
  FileText,
  Flame,
  Heart,
  MapPin,
  Phone,
  Shield,
  Star,
  ThumbsUp,
  User,
} from "lucide-react";

const PROFILE = {
  name: "Naman Maheshwari",
  initials: "NM",
  role: "Road Safety Guardian",
  memberSince: "January 2024",
  location: "New Delhi, India",
  stats: [
    {
      label: "Complaints Filed",
      value: 12,
      icon: FileText,
      color: "text-blue-400",
      bg: "bg-blue-400/10 border-blue-400/20",
    },
    {
      label: "Roads Rated",
      value: 28,
      icon: Star,
      color: "text-amber-400",
      bg: "bg-amber-400/10 border-amber-400/20",
    },
    {
      label: "Hazards Reported",
      value: 7,
      icon: AlertTriangle,
      color: "text-orange-400",
      bg: "bg-orange-400/10 border-orange-400/20",
    },
    {
      label: "SOS Activations",
      value: 0,
      icon: Flame,
      color: "text-red-400",
      bg: "bg-red-400/10 border-red-400/20",
    },
  ],
};

const EMERGENCY = {
  bloodGroup: "B+",
  allergies: "Penicillin",
  medicalConditions: "None",
  contacts: [
    { name: "Rajesh Maheshwari", relation: "Father", phone: "+91 98765 43210" },
    { name: "Priya Maheshwari", relation: "Mother", phone: "+91 87654 32109" },
  ],
  insuranceProvider: "National Insurance Co. Ltd.",
  policyNumber: "NIC-DL-2024-78432",
  vehicleNumber: "DL 5S AB 1234",
};

const ACTIVITY = [
  {
    id: 1,
    icon: FileText,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    action: "Complaint Filed",
    detail: "Pothole on NH-48 near Gurugram Toll",
    time: "2 days ago",
    status: "Under Review",
    sc: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  {
    id: 2,
    icon: Star,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    action: "Road Rated",
    detail: "Rated Noida Expressway — 4 stars",
    time: "4 days ago",
    status: "Completed",
    sc: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: 3,
    icon: AlertTriangle,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    action: "Hazard Reported",
    detail: "Missing road sign on Ring Road, Delhi",
    time: "1 week ago",
    status: "Assigned",
    sc: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: 4,
    icon: ThumbsUp,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    action: "Repair Verified",
    detail: "Confirmed pothole repair on DND Flyway",
    time: "2 weeks ago",
    status: "Completed",
    sc: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: 5,
    icon: FileText,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    action: "Complaint Filed",
    detail: "Broken signal at Connaught Place",
    time: "3 weeks ago",
    status: "Resolved",
    sc: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
];

const ACHIEVEMENTS = [
  {
    name: "Safe Driver",
    desc: "30 days incident-free",
    icon: Shield,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
  },
  {
    name: "Night Owl",
    desc: "10 safe night journeys",
    icon: Star,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30",
  },
  {
    name: "City Expert",
    desc: "Drove safely in 5 cities",
    icon: MapPin,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
  },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
      {children}
    </p>
  );
}

export function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground font-display">
              My Profile
            </h1>
            <p className="text-xs text-muted-foreground">
              Road Safety Guardian — Naman Maheshwari
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <Card className="bg-card border-border overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/20" />
          <CardContent className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10">
              <div className="w-20 h-20 rounded-2xl bg-amber-500 border-4 border-card flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-black font-display">
                  {PROFILE.initials}
                </span>
              </div>
              <div className="flex-1 pb-1">
                <h2 className="text-2xl font-bold text-foreground font-display">
                  {PROFILE.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30">
                    <Shield className="w-3 h-3 mr-1" />
                    {PROFILE.role}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    Member since {PROFILE.memberSince}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {PROFILE.location}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div>
          <SectionTitle>Activity Statistics</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PROFILE.stats.map((s) => (
              <div
                key={s.label}
                data-ocid={`profile.stat.${s.label.toLowerCase().replace(/ /g, "_")}`}
                className="bg-card border border-border rounded-xl p-4 flex flex-col items-center text-center"
              >
                <div
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-2 ${s.bg}`}
                >
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <p className={`text-2xl font-bold font-display ${s.color}`}>
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <SectionTitle>Achievements</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((a) => (
              <div
                key={a.name}
                className={`flex items-center gap-3 rounded-xl border p-3.5 ${a.bg}`}
              >
                <a.icon className={`w-6 h-6 ${a.color} shrink-0`} />
                <div>
                  <p className={`font-semibold text-sm ${a.color}`}>{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Profile */}
        <div>
          <SectionTitle>Emergency Profile</SectionTitle>
          <Card className="bg-card border-border">
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Blood Group
                  </p>
                  <p className="text-xl font-bold text-red-400 font-display">
                    {EMERGENCY.bloodGroup}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Allergies
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {EMERGENCY.allergies}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Conditions
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {EMERGENCY.medicalConditions}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Vehicle No.
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {EMERGENCY.vehicleNumber}
                  </p>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-red-400" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Emergency Contacts
                  </p>
                </div>
                <div className="space-y-2">
                  {EMERGENCY.contacts.map((c) => (
                    <div
                      key={c.phone}
                      className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {c.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {c.relation}
                        </p>
                      </div>
                      <a
                        href={`tel:${c.phone}`}
                        className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-mono"
                      >
                        <Phone className="w-3 h-3" />
                        {c.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg bg-secondary/50 px-3 py-2">
                    <p className="text-xs text-muted-foreground">
                      Insurance Provider
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {EMERGENCY.insuranceProvider}
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 px-3 py-2">
                    <p className="text-xs text-muted-foreground">
                      Policy Number
                    </p>
                    <p className="text-sm font-mono font-semibold text-foreground">
                      {EMERGENCY.policyNumber}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <SectionTitle>Recent Activity</SectionTitle>
          <div className="space-y-2">
            {ACTIVITY.map((a) => (
              <div
                key={a.id}
                data-ocid={`profile.activity.${a.id}`}
                className="bg-card border border-border rounded-xl px-4 py-3 flex items-start gap-3 hover:bg-secondary/30 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-lg ${a.bg} flex items-center justify-center shrink-0 mt-0.5`}
                >
                  <a.icon className={`w-4 h-4 ${a.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">
                      {a.action}
                    </p>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {a.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {a.detail}
                  </p>
                </div>
                <span
                  className={`shrink-0 self-center px-2 py-0.5 rounded text-xs font-semibold border ${a.sc}`}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Impact */}
        <div className="bg-gradient-to-r from-emerald-900/20 to-blue-900/20 border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <p className="text-sm font-semibold text-emerald-400">
              Your Community Impact
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Since joining in January 2024, you have helped make Indian roads
            safer by filing{" "}
            <span className="text-foreground font-semibold">12 complaints</span>
            , rating{" "}
            <span className="text-foreground font-semibold">28 roads</span>, and
            alerting other drivers to{" "}
            <span className="text-foreground font-semibold">7 hazards</span>.
            Keep contributing — every report counts!
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
