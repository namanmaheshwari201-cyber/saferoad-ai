import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  BarChart2,
  BookOpen,
  Coffee,
  Pause,
  Play,
  RefreshCw,
  Settings,
  Timer,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type TimerMode = "study" | "break";

interface DayStats {
  date: string;
  studyMinutes: number;
  sessions: number;
}

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function loadStats(): DayStats[] {
  try {
    return JSON.parse(localStorage.getItem("study_timer_stats") || "[]");
  } catch {
    return [];
  }
}

function saveStats(stats: DayStats[]) {
  localStorage.setItem("study_timer_stats", JSON.stringify(stats));
}

function addStudyTime(minutes: number) {
  const stats = loadStats();
  const key = getTodayKey();
  const idx = stats.findIndex((s) => s.date === key);
  if (idx >= 0) {
    stats[idx].studyMinutes += minutes;
    stats[idx].sessions += 1;
  } else {
    stats.push({ date: key, studyMinutes: minutes, sessions: 1 });
  }
  saveStats(stats);
}

function getWeekStats(): DayStats[] {
  const stats = loadStats();
  const week: DayStats[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const found = stats.find((s) => s.date === key);
    week.push(
      found || {
        date: key,
        studyMinutes: 0,
        sessions: 0,
      },
    );
  }
  return week;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function StudyTimerPage() {
  const [studyDuration, setStudyDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [customStudy, setCustomStudy] = useState("25");
  const [customBreak, setCustomBreak] = useState("5");
  const [showSettings, setShowSettings] = useState(false);

  const [mode, setMode] = useState<TimerMode>("study");
  const [secondsLeft, setSecondsLeft] = useState(studyDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [weekStats, setWeekStats] = useState<DayStats[]>(getWeekStats);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const studiedSecondsRef = useRef(0);

  const totalSeconds =
    mode === "study" ? studyDuration * 60 : breakDuration * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  const reset = useCallback(
    (newMode?: TimerMode) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsRunning(false);
      const m = newMode || mode;
      setMode(m);
      setSecondsLeft(m === "study" ? studyDuration * 60 : breakDuration * 60);
      studiedSecondsRef.current = 0;
    },
    [mode, studyDuration, breakDuration],
  );

  // Recalculate secondsLeft when durations change (only if not running)
  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(
        mode === "study" ? studyDuration * 60 : breakDuration * 60,
      );
    }
  }, [studyDuration, breakDuration, mode, isRunning]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          if (mode === "study") {
            const studiedMins =
              Math.round(studiedSecondsRef.current / 60) + studyDuration;
            addStudyTime(studiedMins);
            setWeekStats(getWeekStats());
            setSessionsCompleted((s) => s + 1);
            studiedSecondsRef.current = 0;
            setMode("break");
            return breakDuration * 60;
          }
          setMode("study");
          return studyDuration * 60;
        }
        if (mode === "study") studiedSecondsRef.current += 1;
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, studyDuration, breakDuration]);

  const today = weekStats.find((s) => s.date === getTodayKey());
  const totalWeekMinutes = weekStats.reduce(
    (sum, d) => sum + d.studyMinutes,
    0,
  );
  const maxWeekMinutes = Math.max(...weekStats.map((d) => d.studyMinutes), 1);

  const handleApplyCustom = () => {
    const s = Math.max(1, Math.min(120, Number.parseInt(customStudy) || 25));
    const b = Math.max(1, Math.min(60, Number.parseInt(customBreak) || 5));
    setStudyDuration(s);
    setBreakDuration(b);
    setCustomStudy(String(s));
    setCustomBreak(String(b));
    setShowSettings(false);
    reset();
  };

  const presets = [
    { label: "25/5", study: 25, brk: 5 },
    { label: "50/10", study: 50, brk: 10 },
    { label: "90/15", study: 90, brk: 15 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Study Timer</h1>
        <p className="text-muted-foreground">
          Pomodoro technique for focused study sessions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="pt-8 pb-8 flex flex-col items-center gap-6">
              {/* Mode badge */}
              <div className="flex gap-3">
                <Badge
                  variant={mode === "study" ? "default" : "secondary"}
                  className="text-sm px-4 py-1"
                >
                  <BookOpen className="w-4 h-4 mr-1" />
                  Study
                </Badge>
                <Badge
                  variant={mode === "break" ? "default" : "secondary"}
                  className="text-sm px-4 py-1"
                >
                  <Coffee className="w-4 h-4 mr-1" />
                  Break
                </Badge>
              </div>

              {/* Timer display */}
              <div className="relative flex items-center justify-center">
                <svg
                  className="w-56 h-56 -rotate-90"
                  viewBox="0 0 200 200"
                  role="img"
                  aria-label="Timer progress circle"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="88"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted/30"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="88"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                    className={
                      mode === "study" ? "text-primary" : "text-green-500"
                    }
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-mono font-bold tabular-nums">
                    {formatTime(secondsLeft)}
                  </span>
                  <span className="text-sm text-muted-foreground mt-1 capitalize">
                    {mode === "study" ? "Focus time" : "Take a break"}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-xs">
                <Progress
                  value={progress}
                  className="h-2"
                  data-ocid="timer.loading_state"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0:00</span>
                  <span>{formatTime(totalSeconds)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => reset()}
                  data-ocid="timer.secondary_button"
                >
                  <RefreshCw className="w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  className="h-14 w-14 rounded-full text-lg"
                  onClick={() => setIsRunning(!isRunning)}
                  data-ocid="timer.primary_button"
                >
                  {isRunning ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => setShowSettings(!showSettings)}
                  data-ocid="timer.button"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>

              {/* Presets */}
              <div className="flex gap-2">
                {presets.map((p) => (
                  <Button
                    key={p.label}
                    variant={
                      studyDuration === p.study && breakDuration === p.brk
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setStudyDuration(p.study);
                      setBreakDuration(p.brk);
                      setCustomStudy(String(p.study));
                      setCustomBreak(String(p.brk));
                      reset();
                    }}
                    data-ocid="timer.toggle"
                  >
                    <Timer className="w-3 h-3 mr-1" />
                    {p.label}
                  </Button>
                ))}
              </div>

              {sessionsCompleted > 0 && (
                <div className="text-sm text-muted-foreground">
                  Sessions completed today:{" "}
                  <span className="font-semibold text-foreground">
                    {sessionsCompleted}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Custom settings */}
          {showSettings && (
            <Card data-ocid="timer.panel">
              <CardHeader>
                <CardTitle className="text-base">
                  Custom Timer Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm">Study Duration (min)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="120"
                      value={customStudy}
                      onChange={(e) => setCustomStudy(e.target.value)}
                      className="h-9"
                      data-ocid="timer.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Break Duration (min)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="60"
                      value={customBreak}
                      onChange={(e) => setCustomBreak(e.target.value)}
                      className="h-9"
                      data-ocid="timer.input"
                    />
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={handleApplyCustom}
                  data-ocid="timer.primary_button"
                >
                  Apply Settings
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stats panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart2 className="w-4 h-4" />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Study time</span>
                  <span className="font-semibold">
                    {today ? `${today.studyMinutes} min` : "0 min"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sessions</span>
                  <span className="font-semibold">
                    {today ? today.sessions : 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Goal (4 sessions)
                  </span>
                  <span className="font-semibold">
                    {today ? Math.min(today.sessions, 4) : 0}/4
                  </span>
                </div>
                <Progress
                  value={today ? Math.min((today.sessions / 4) * 100, 100) : 0}
                  className="h-2"
                  data-ocid="timer.loading_state"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart2 className="w-4 h-4" />
                Weekly Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Total this week</span>
                  <span className="font-semibold">{totalWeekMinutes} min</span>
                </div>
                <div className="flex items-end gap-1.5 h-20">
                  {weekStats.map((day) => {
                    const dayOfWeek = new Date(`${day.date}T12:00:00`).getDay();
                    const isToday = day.date === getTodayKey();
                    const heightPct = (day.studyMinutes / maxWeekMinutes) * 100;
                    return (
                      <div
                        key={day.date}
                        className="flex-1 flex flex-col items-center gap-1"
                        title={`${day.studyMinutes} min`}
                      >
                        <div
                          className="w-full relative"
                          style={{ height: "64px" }}
                        >
                          <div
                            className={`absolute bottom-0 w-full rounded-t transition-all ${
                              isToday ? "bg-primary" : "bg-primary/30"
                            }`}
                            style={{
                              height: `${Math.max(heightPct, day.studyMinutes > 0 ? 5 : 0)}%`,
                            }}
                          />
                        </div>
                        <span
                          className={`text-[10px] ${isToday ? "font-bold text-primary" : "text-muted-foreground"}`}
                        >
                          {dayLabels[dayOfWeek]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Focus on one subject per Pomodoro session
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Take short walks during breaks
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Every 4 sessions, take a longer 15-30 min break
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Review notes during breaks to reinforce memory
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
