import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Bell,
  BookOpen,
  Brain,
  FileText,
  FlipHorizontal,
  GraduationCap,
  Home,
  Layers,
  Menu,
  MessageSquare,
  Moon,
  Search,
  Sun,
  Timer,
  Trophy,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

type Page = string;

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  darkMode: boolean;
  onToggleDark: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const navItems: { label: string; page: Page; icon: React.ReactNode }[] = [
  { label: "Home", page: "home", icon: <Home className="w-4 h-4" /> },
  { label: "Q&A", page: "qa", icon: <MessageSquare className="w-4 h-4" /> },
  { label: "Notes", page: "notes", icon: <FileText className="w-4 h-4" /> },
  { label: "Groups", page: "groups", icon: <Users className="w-4 h-4" /> },
  {
    label: "Exam Prep",
    page: "exam-prep",
    icon: <GraduationCap className="w-4 h-4" />,
  },
  { label: "Quiz", page: "quiz", icon: <Brain className="w-4 h-4" /> },
  {
    label: "Flashcards",
    page: "flashcards",
    icon: <Layers className="w-4 h-4" />,
  },
  {
    label: "Leaderboard",
    page: "leaderboard",
    icon: <Trophy className="w-4 h-4" />,
  },
  {
    label: "Formulas",
    page: "formula-sheet",
    icon: <FlipHorizontal className="w-4 h-4" />,
  },
  {
    label: "Revision",
    page: "quick-revision",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    label: "Timer",
    page: "study-timer",
    icon: <Timer className="w-4 h-4" />,
  },
];

const notifications = [
  {
    id: 1,
    message: "Prashant answered your question about quadratic equations",
    read: false,
  },
  { id: 2, message: "New notes uploaded in Science for Class 10", read: false },
  { id: 3, message: "You earned the 'Top Helper' badge!", read: true },
];

export default function Navbar({
  currentPage,
  onNavigate,
  darkMode,
  onToggleDark,
  searchQuery,
  onSearchChange,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 font-display font-bold text-xl text-primary shrink-0"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="hidden sm:block">StudyHub</span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === item.page ||
                (currentPage === "question-detail" && item.page === "qa")
                  ? "nav-active"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              data-ocid="nav.link"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-xs ml-auto lg:ml-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search questions, notes..."
              className="pl-9 h-9 text-sm bg-muted/50"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              data-ocid="nav.search_input"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                data-ocid="nav.button"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground border-0">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80"
              data-ocid="nav.dropdown_menu"
            >
              <div className="p-2 font-display font-semibold text-sm border-b border-border mb-1">
                Notifications
              </div>
              {notifications.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className={`text-xs p-3 gap-2 whitespace-normal leading-relaxed ${!n.read ? "bg-primary/5" : ""}`}
                >
                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-0.5" />
                  )}
                  {n.read && <div className="w-2 h-2 shrink-0" />}
                  {n.message}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dark mode */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDark}
            data-ocid="nav.toggle"
          >
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          {/* Profile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("profile")}
            data-ocid="nav.link"
          >
            <User className="w-4 h-4" />
          </Button>

          {/* Mobile menu */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.button"
          >
            {mobileOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background/98 backdrop-blur-md">
          <nav className="p-3 grid grid-cols-2 gap-1">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  currentPage === item.page
                    ? "nav-active"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                data-ocid="nav.link"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                onNavigate("profile");
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
              data-ocid="nav.link"
            >
              <User className="w-4 h-4" />
              Profile
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
