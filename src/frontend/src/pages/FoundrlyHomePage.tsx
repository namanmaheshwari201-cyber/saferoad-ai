import type {
  Competition,
  LeaderboardEntry,
  SkillListing,
  StartupProject,
} from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useCompetitions,
  useLeaderboard,
  useSkillListings,
  useStartupProjects,
} from "@/hooks/useQueries";
import { getInitials, trustScoreColor } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  ArrowRight,
  Bot,
  Brain,
  CheckCircle,
  ChevronRight,
  Globe,
  Lightbulb,
  Rocket,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

type NavPage =
  | "home"
  | "dashboard"
  | "ai-cofounder"
  | "marketplace"
  | "team-builder"
  | "competitions"
  | "messages"
  | "profile"
  | "settings"
  | "onboarding";

interface HomePageProps {
  onNavigate: (page: NavPage) => void;
}

const STATS = [
  { label: "Student Founders", value: "12,000+", icon: "🚀" },
  { label: "Startups Launched", value: "3,400+", icon: "💡" },
  { label: "Skills Listed", value: "8,200+", icon: "⚡" },
  { label: "Competitions Run", value: "150+", icon: "🏆" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create Your Profile",
    desc: "Set up your founder profile with skills, interests, and startup goals in under 2 minutes.",
    icon: <Users className="h-6 w-6" />,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    step: "02",
    title: "Build Your Startup",
    desc: "Use the AI Cofounder to generate business models, pitch decks, and execution roadmaps.",
    icon: <Bot className="h-6 w-6" />,
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
  },
  {
    step: "03",
    title: "Find Your Team",
    desc: "AI matches you with complementary co-founders, developers, and designers from the community.",
    icon: <Target className="h-6 w-6" />,
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/20",
  },
  {
    step: "04",
    title: "Launch & Compete",
    desc: "Submit to startup competitions, get real feedback from mentors, and grow your trust score.",
    icon: <Rocket className="h-6 w-6" />,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
    border: "border-chart-2/20",
  },
];

const FEATURES = [
  {
    icon: <Bot className="h-6 w-6" />,
    title: "AI Cofounder",
    desc: "Get an always-on AI startup partner to brainstorm ideas, generate pitch decks, build business models, and plan your roadmap.",
    color: "text-accent",
    bg: "bg-accent/10",
    page: "ai-cofounder" as NavPage,
    badge: "Most Popular",
  },
  {
    icon: <ShoppingBag className="h-6 w-6" />,
    title: "Skill Marketplace",
    desc: "Hire student talent for your startup or sell your own skills. Real work, real earnings, real experience.",
    color: "text-secondary",
    bg: "bg-secondary/10",
    page: "marketplace" as NavPage,
    badge: null,
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Team Builder",
    desc: "Find the perfect co-founder, developer, or designer. AI matches you with students who complement your skills.",
    color: "text-primary",
    bg: "bg-primary/10",
    page: "team-builder" as NavPage,
    badge: null,
  },
  {
    icon: <Trophy className="h-6 w-6" />,
    title: "Competitions",
    desc: "Compete in startup hackathons, win prizes, and get noticed by real investors and mentors.",
    color: "text-chart-2",
    bg: "bg-chart-2/10",
    page: "competitions" as NavPage,
    badge: null,
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Trust System",
    desc: "Build your reputation with a verified trust score based on completed projects, reviews, and collaboration history.",
    color: "text-chart-4",
    bg: "bg-chart-4/10",
    page: "profile" as NavPage,
    badge: null,
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: "AI Skill Verification",
    desc: "Get AI-verified skill badges that prove your expertise to potential teammates and clients.",
    color: "text-chart-3",
    bg: "bg-chart-3/10",
    page: "profile" as NavPage,
    badge: "New",
  },
];

const TESTIMONIALS = [
  {
    name: "Aditya Sharma",
    role: "Founder, EduTech Startup",
    school: "DPS, Delhi",
    text: "Foundrly AI helped me build my first startup at 16. The AI Cofounder feature gave me a full business plan in 10 minutes. Now I have a team of 5 and we're building something real.",
    avatar: "AS",
    rating: 5,
  },
  {
    name: "Priya Mehta",
    role: "UI/UX Designer & Freelancer",
    school: "Ryan International, Mumbai",
    text: "I started selling my design skills on the marketplace at 17. Within 2 months I had 12 clients and earned enough to buy my own laptop. The trust score system makes clients take me seriously.",
    avatar: "PM",
    rating: 5,
  },
  {
    name: "Rohan Kapoor",
    role: "Competition Winner 2024",
    school: "Kendriya Vidyalaya, Bengaluru",
    text: "Won ₹50,000 in the national startup competition through Foundrly. The platform connected me with a mentor who helped me refine my pitch. Absolutely game-changing for student founders.",
    avatar: "RK",
    rating: 5,
  },
  {
    name: "Ananya Singh",
    role: "Co-Founder, HealthTech App",
    school: "Amity International, Noida",
    text: "Found my technical co-founder through Team Builder. The AI matched us perfectly — she has the coding skills I lack and I have the business vision she needs. We've been building together for 8 months.",
    avatar: "AN",
    rating: 5,
  },
];

// --- Sub-components ---

function StatCard({
  stat,
  index,
}: { stat: (typeof STATS)[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="text-center"
    >
      <span className="text-3xl mb-2 block">{stat.icon}</span>
      <p className="font-display font-bold text-3xl sm:text-4xl gradient-text">
        {stat.value}
      </p>
      <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
    </motion.div>
  );
}

function ProjectCard({
  project,
  index,
}: { project: StartupProject; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      className="glass-card p-5 hover:elevated transition-smooth cursor-pointer group"
      data-ocid={`home.project_card.${index + 1}`}
    >
      <div className="flex items-start justify-between mb-3">
        <Badge
          variant="outline"
          className="text-xs border-primary/30 text-primary"
        >
          {project.category}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {project.stage}
        </Badge>
      </div>
      <h3 className="font-display font-semibold text-base mb-1.5 group-hover:text-primary transition-colors">
        {project.name}
      </h3>
      <p className="text-muted-foreground text-xs line-clamp-2 mb-3">
        {project.description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {Number(project.teamSize)} members
          </span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </motion.div>
  );
}

function FreelancerCard({
  entry,
  index,
}: { entry: LeaderboardEntry; index: number }) {
  const rankColors = [
    "text-chart-2",
    "text-muted-foreground",
    "text-secondary",
  ];
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -16 : 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      className="glass-card flex items-center gap-4 px-5 py-4 hover:elevated transition-smooth"
      data-ocid={`home.freelancer_card.${index + 1}`}
    >
      <span
        className={`font-display font-bold text-lg w-7 flex-shrink-0 ${rankColors[index] ?? "text-muted-foreground/60"}`}
      >
        #{Number(entry.rank)}
      </span>
      <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0 flex-none">
        {getInitials(entry.displayName)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{entry.displayName}</p>
        <p className="text-xs text-muted-foreground truncate">
          @{entry.username}
        </p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <Star className="h-3.5 w-3.5 text-chart-2 fill-chart-2" />
        <span
          className={`font-bold text-sm ${trustScoreColor(entry.trustScore)}`}
        >
          {Number(entry.trustScore)}
        </span>
      </div>
    </motion.div>
  );
}

function SkillCard({
  listing,
  index,
}: { listing: SkillListing; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="glass-card p-4 hover:elevated transition-smooth cursor-pointer group"
      data-ocid={`home.skill_card.${index + 1}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="text-xs">
          {listing.category}
        </Badge>
      </div>
      <h3 className="font-semibold text-sm mb-1 line-clamp-1 group-hover:text-accent transition-colors">
        {listing.title}
      </h3>
      <div className="flex items-center justify-between mt-2">
        <span className="font-display font-bold text-sm text-secondary">
          ${Number(listing.price)}
        </span>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-chart-2 fill-chart-2" />
          <span className="text-xs text-muted-foreground">
            {Number(listing.averageRating).toFixed(1)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function CompetitionCard({
  competition,
  index,
  onNavigate,
}: {
  competition: Competition;
  index: number;
  onNavigate: (page: NavPage) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.45 }}
      className="glass-card p-5 hover:elevated transition-smooth group cursor-pointer"
      onClick={() => onNavigate("competitions")}
      data-ocid={`home.competition_card.${index + 1}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-xl bg-chart-2/15 flex items-center justify-center">
          <Trophy className="h-5 w-5 text-chart-2" />
        </div>
        <Badge
          variant="outline"
          className="text-xs border-green-500/40 text-green-400"
        >
          Active
        </Badge>
      </div>
      <h3 className="font-display font-semibold text-base mb-1.5 group-hover:text-chart-2 transition-colors">
        {competition.title}
      </h3>
      <p className="text-muted-foreground text-xs line-clamp-2 mb-3">
        {competition.description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {Number(competition.submissionCount)} entries
          </span>
        </div>
        <span className="text-xs font-semibold text-chart-2">
          ${Number(competition.prizePool).toLocaleString()} prize
        </span>
      </div>
    </motion.div>
  );
}

// --- Main Component ---

export function FoundrlyHomePage({ onNavigate }: HomePageProps) {
  const { isAuthenticated, login } = useInternetIdentity();
  const { data: leaderboard = [] } = useLeaderboard();
  const { data: projects = [] } = useStartupProjects();
  const { data: listings = [] } = useSkillListings();
  const { data: competitions = [] } = useCompetitions();

  const topProjects = projects.slice(0, 6);
  const topFreelancers = leaderboard.slice(0, 6);
  const topListings = listings.slice(0, 6);
  const activeCompetitions = competitions
    .filter(
      (c) =>
        String(c.status) === "active" ||
        Object.keys(c.status as object)[0] === "active",
    )
    .slice(0, 3);

  return (
    <div className="min-h-full">
      {/* ===== HERO ===== */}
      <section
        className="relative flex flex-col items-center text-center px-4 pt-16 pb-24 overflow-hidden"
        data-ocid="home.hero_section"
      >
        {/* Animated gradient blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-24 right-1/4 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 4,
            }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 h-56 w-[500px] rounded-full bg-secondary/10 blur-3xl"
          />
          {/* Mesh dots */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Badge
              variant="outline"
              className="mb-6 border-primary/40 text-primary bg-primary/10 gap-1.5 py-1.5 px-4 text-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              The #1 AI-powered startup platform for teenagers
            </Badge>
          </motion.div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-7xl leading-[1.1] mb-6 tracking-tight">
            Build Your Startup.
            <br />
            Find Your Team.
            <br />
            <span className="gradient-text">Change the World.</span>
          </h1>

          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            The premium accelerator platform for teenage founders. Launch your
            startup idea with an AI cofounder, find skilled teammates, and
            compete to win real prizes.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
          >
            {isAuthenticated ? (
              <Button
                type="button"
                size="lg"
                className="gradient-primary text-white glow-primary rounded-xl gap-2 text-base px-8 py-6 h-auto"
                onClick={() => onNavigate("dashboard")}
                data-ocid="home.go_to_dashboard_button"
              >
                <Rocket className="h-5 w-5" />
                Go to Dashboard
              </Button>
            ) : (
              <Button
                type="button"
                size="lg"
                className="gradient-primary text-white glow-primary rounded-xl gap-2 text-base px-8 py-6 h-auto"
                onClick={() => login()}
                data-ocid="home.start_building_button"
              >
                <Rocket className="h-5 w-5" />
                Start Building Free
              </Button>
            )}
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="rounded-xl gap-2 border-border/60 text-base px-8 py-6 h-auto hover:bg-card"
              onClick={() => onNavigate("marketplace")}
              data-ocid="home.explore_talent_button"
            >
              <ShoppingBag className="h-5 w-5" />
              Explore Talent
            </Button>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            className="relative rounded-2xl overflow-hidden glow-primary mx-auto max-w-4xl border border-border/30"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10 pointer-events-none" />
            <img
              src="/assets/generated/foundrly-hero.dim_1200x630.jpg"
              alt="Foundrly AI platform dashboard"
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section
        className="bg-card/80 border-y border-border/40 py-10 backdrop-blur-sm"
        data-ocid="home.stats_section"
      >
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 px-4" data-ocid="home.how_it_works_section">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="mb-4 border-accent/30 text-accent bg-accent/10"
            >
              <Lightbulb className="h-3.5 w-3.5 mr-1.5" />
              How It Works
            </Badge>
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              From idea to launch in{" "}
              <span className="gradient-text">4 simple steps</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to go from a spark of an idea to a fully
              functioning startup — all on one platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className={`glass-card p-6 border ${step.border} relative group hover:elevated transition-smooth`}
                data-ocid={`home.step_card.${i + 1}`}
              >
                <span className="absolute top-4 right-4 font-display font-bold text-4xl text-muted/30">
                  {step.step}
                </span>
                <div
                  className={`h-12 w-12 rounded-xl ${step.bg} ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth`}
                >
                  {step.icon}
                </div>
                <h3 className="font-display font-semibold text-base mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.desc}
                </p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-border hidden lg:block z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURE SHOWCASE ===== */}
      <section
        className="bg-muted/20 py-24 px-4"
        data-ocid="home.features_section"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 text-primary bg-primary/10"
            >
              <Zap className="h-3.5 w-3.5 mr-1.5" />
              Platform Features
            </Badge>
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Everything you need to build a startup
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Six powerful tools designed specifically for student founders, all
              in one beautifully designed platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                onClick={() => onNavigate(feature.page)}
                className="glass-card p-6 hover:elevated transition-smooth group cursor-pointer relative"
                data-ocid={`home.feature_card.${i + 1}`}
              >
                {feature.badge && (
                  <span className="absolute top-4 right-4">
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </span>
                )}
                <div
                  className={`h-12 w-12 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-display font-semibold text-base mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {feature.desc}
                </p>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${feature.color} opacity-0 group-hover:opacity-100 transition-smooth`}
                >
                  Explore <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRENDING STARTUPS ===== */}
      {topProjects.length > 0 && (
        <section className="py-20 px-4" data-ocid="home.projects_section">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-10"
            >
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl">
                  Trending Startups
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Real startups being built by students like you
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1.5 text-primary hover:text-primary"
                onClick={() => onNavigate("team-builder")}
                data-ocid="home.view_all_projects_button"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topProjects.map((project, i) => (
                <ProjectCard
                  key={project.id.toString()}
                  project={project}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== TOP FREELANCERS ===== */}
      {topFreelancers.length > 0 && (
        <section
          className="bg-muted/20 py-20 px-4"
          data-ocid="home.freelancers_section"
        >
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-10"
            >
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl">
                  Top Student Founders
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Students with the highest trust scores on the platform
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1.5 text-primary hover:text-primary"
                onClick={() => onNavigate("competitions")}
                data-ocid="home.view_leaderboard_button"
              >
                Full leaderboard <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topFreelancers.map((entry, i) => (
                <FreelancerCard
                  key={entry.userId.toString()}
                  entry={entry}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== TOP SKILL LISTINGS ===== */}
      {topListings.length > 0 && (
        <section className="py-20 px-4" data-ocid="home.skills_section">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-10"
            >
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl">
                  Trending Skills
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Hire student talent or offer your own services
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1.5 text-primary hover:text-primary"
                onClick={() => onNavigate("marketplace")}
                data-ocid="home.view_marketplace_button"
              >
                Browse all <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {topListings.map((listing, i) => (
                <SkillCard
                  key={listing.id.toString()}
                  listing={listing}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== ACTIVE COMPETITIONS ===== */}
      {activeCompetitions.length > 0 && (
        <section
          className="bg-muted/20 py-20 px-4"
          data-ocid="home.competitions_section"
        >
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-10"
            >
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl">
                  Active Competitions
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Compete, win prizes, and get noticed by investors
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1.5 text-chart-2 hover:text-chart-2"
                onClick={() => onNavigate("competitions")}
                data-ocid="home.view_competitions_button"
              >
                All competitions <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeCompetitions.map((competition, i) => (
                <CompetitionCard
                  key={competition.id.toString()}
                  competition={competition}
                  index={i}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 px-4" data-ocid="home.testimonials_section">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="mb-4 border-chart-2/30 text-chart-2 bg-chart-2/10"
            >
              <Star className="h-3.5 w-3.5 mr-1.5 fill-chart-2" />
              Student Stories
            </Badge>
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Real founders, real <span className="gradient-text">results</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Hear from students who've built startups, won competitions, and
              found co-founders through Foundrly AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card p-6 hover:elevated transition-smooth"
                data-ocid={`home.testimonial_card.${i + 1}`}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }, (_, s) =>
                    String(s + 1),
                  ).map((sKey) => (
                    <Star
                      key={sKey}
                      className="h-4 w-4 text-chart-2 fill-chart-2"
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground/90 mb-5">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {testimonial.role} · {testimonial.school}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      {!isAuthenticated && (
        <section
          className="bg-card/60 border-y border-border/30 py-24 px-4 text-center relative overflow-hidden"
          data-ocid="home.cta_section"
        >
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 mesh-bg" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="font-display font-bold text-3xl sm:text-5xl mb-5 leading-tight">
              Your startup journey{" "}
              <span className="gradient-text">starts today.</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">
              Join 12,000+ student founders already building the future on
              Foundrly AI. It&apos;s completely free to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="button"
                size="lg"
                className="gradient-primary text-white glow-primary rounded-xl gap-2 text-base px-10 py-6 h-auto"
                onClick={() => login()}
                data-ocid="home.cta_start_button"
              >
                <Rocket className="h-5 w-5" />
                Start Building Free
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="rounded-xl gap-2 text-base px-10 py-6 h-auto border-border/60"
                onClick={() => onNavigate("ai-cofounder")}
                data-ocid="home.cta_ai_button"
              >
                <Bot className="h-5 w-5" />
                Try AI Cofounder
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8">
              {[
                "No credit card required",
                "Free forever plan",
                "Join in 2 minutes",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <CheckCircle className="h-3.5 w-3.5 text-chart-4" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* ===== FOOTER ===== */}
      <footer
        className="bg-card/80 border-t border-border/40 py-12 px-4"
        data-ocid="home.footer_section"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Rocket className="h-4 w-4 text-white" />
                </div>
                <span className="font-display font-bold text-lg">
                  Foundrly AI
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The AI-powered startup platform for the next generation of
                founders.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Platform</h4>
              <div className="space-y-2">
                {[
                  { label: "AI Cofounder", page: "ai-cofounder" as NavPage },
                  { label: "Marketplace", page: "marketplace" as NavPage },
                  { label: "Team Builder", page: "team-builder" as NavPage },
                  { label: "Competitions", page: "competitions" as NavPage },
                ].map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => onNavigate(link.page)}
                    className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
                    data-ocid={`home.footer_link.${link.label.toLowerCase().replace(" ", "-")}`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Community</h4>
              <div className="space-y-2">
                {[
                  "Student Forum",
                  "Mentors",
                  "Investor Connect",
                  "Startup Blog",
                ].map((item) => (
                  <p key={item} className="text-xs text-muted-foreground">
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <div className="space-y-2">
                {["About", "Careers", "Privacy Policy", "Terms of Service"].map(
                  (item) => (
                    <p key={item} className="text-xs text-muted-foreground">
                      {item}
                    </p>
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Foundrly AI. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default FoundrlyHomePage;
