import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  Lock,
  Medal,
  Share2,
  Star,
  Target,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Question {
  id: number;
  category: "Traffic Laws" | "Road Signs" | "Emergency Procedures";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  condition: (stats: UserStats) => boolean;
}

interface MissionDef {
  id: string;
  title: string;
  description: string;
  target: number;
  xpReward: number;
  progressFn: (stats: UserStats) => number;
}

interface UserStats {
  totalXP: number;
  quizzesCompleted: number;
  questionsAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  bestStreak: number;
  lastQuizDate: string | null;
  streakDates: string[];
  categoryCorrect: Record<string, number>;
  categoryTotal: Record<string, number>;
  fastestAnswerMs: number;
  missionsProgress: Record<string, number>;
}

/* ------------------------------------------------------------------ */
/*  Question Bank (20 real Indian traffic law questions)               */
/* ------------------------------------------------------------------ */

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: "Traffic Laws",
    question:
      "What is the fine for driving without a valid licence in India under the Motor Vehicles Act 2019?",
    options: ["₹500", "₹5,000", "₹10,000", "₹1,000"],
    correctIndex: 1,
    explanation:
      "Under Section 181 of the MV Act 2019, driving without a valid licence attracts a fine of ₹5,000.",
  },
  {
    id: 2,
    category: "Road Signs",
    question: "What does a red octagonal sign with white text indicate?",
    options: ["Give Way", "Stop", "No Entry", "Speed Limit"],
    correctIndex: 1,
    explanation:
      "A red octagonal sign is the universal STOP sign. You must come to a complete halt before proceeding.",
  },
  {
    id: 3,
    category: "Emergency Procedures",
    question: "In a road accident, what is the FIRST thing you should do?",
    options: [
      "Move the injured person",
      "Call 108 for ambulance",
      "Check for danger and secure the scene",
      "Take photos for insurance",
    ],
    correctIndex: 2,
    explanation:
      "Always ensure the scene is safe before approaching. Turn on hazard lights, use warning triangles, and prevent further collisions.",
  },
  {
    id: 4,
    category: "Traffic Laws",
    question:
      "What is the maximum speed limit for cars on national highways in India (unless posted otherwise)?",
    options: ["80 km/h", "100 km/h", "120 km/h", "140 km/h"],
    correctIndex: 1,
    explanation:
      "The default maximum speed limit for cars on national highways in India is 100 km/h unless a different limit is posted.",
  },
  {
    id: 5,
    category: "Road Signs",
    question: "A triangular sign with a red border and black symbol indicates:",
    options: [
      "Mandatory instruction",
      "Warning / Caution",
      "Information",
      "Prohibition",
    ],
    correctIndex: 1,
    explanation:
      "Triangular signs with red borders are WARNING signs alerting drivers to potential hazards ahead.",
  },
  {
    id: 6,
    category: "Emergency Procedures",
    question: "For CPR on an adult, how deep should chest compressions be?",
    options: ["1-2 cm", "2-3 cm", "5-6 cm", "8-10 cm"],
    correctIndex: 2,
    explanation:
      "Adult chest compressions should be 5-6 cm deep at a rate of 100-120 compressions per minute.",
  },
  {
    id: 7,
    category: "Traffic Laws",
    question:
      "What is the penalty for triple riding on a two-wheeler in Delhi?",
    options: ["₹100", "₹500", "₹1,000", "₹2,000"],
    correctIndex: 2,
    explanation:
      "Triple riding on a two-wheeler in Delhi attracts a fine of ₹1,000 under the MV Act.",
  },
  {
    id: 8,
    category: "Road Signs",
    question: "A blue circular sign with a white arrow indicates:",
    options: ["Warning", "Mandatory direction", "Information", "Prohibition"],
    correctIndex: 1,
    explanation:
      "Blue circular signs with white symbols are MANDATORY signs — you must follow the direction shown.",
  },
  {
    id: 9,
    category: "Emergency Procedures",
    question:
      "If a person is bleeding heavily from a wound, what should you do first?",
    options: [
      "Apply a tourniquet immediately",
      "Elevate the wound and apply direct pressure",
      "Give them water",
      "Remove the object causing bleeding",
    ],
    correctIndex: 1,
    explanation:
      "Elevate the wound above heart level and apply firm direct pressure with a clean cloth or bandage.",
  },
  {
    id: 10,
    category: "Traffic Laws",
    question:
      "What is the fine for using a mobile phone while driving in India?",
    options: ["₹500", "₹1,000", "₹5,000", "₹10,000"],
    correctIndex: 2,
    explanation:
      "Using a mobile phone while driving attracts a fine of ₹5,000 for the first offence under the MV Act 2019.",
  },
  {
    id: 11,
    category: "Road Signs",
    question: "A white rectangular sign with black text is a:",
    options: [
      "Warning sign",
      "Mandatory sign",
      "Informatory sign",
      "Prohibitory sign",
    ],
    correctIndex: 2,
    explanation:
      "Rectangular white signs with black text are INFORMATORY signs providing useful information like directions or distances.",
  },
  {
    id: 12,
    category: "Emergency Procedures",
    question: "In case of a vehicle fire, what should you NEVER do?",
    options: [
      "Turn off the engine",
      "Use a fire extinguisher",
      "Open the bonnet fully",
      "Move away from the vehicle",
    ],
    correctIndex: 2,
    explanation:
      "Never open the bonnet fully — it feeds oxygen to the fire. Open it slightly and aim the extinguisher at the base of the flames.",
  },
  {
    id: 13,
    category: "Traffic Laws",
    question: "What is the legal blood alcohol limit for driving in India?",
    options: ["0.00%", "0.03%", "0.05%", "0.08%"],
    correctIndex: 1,
    explanation:
      "The legal blood alcohol limit in India is 30 mg per 100 ml of blood (approximately 0.03%).",
  },
  {
    id: 14,
    category: "Road Signs",
    question: "A red circle with a white horizontal bar means:",
    options: ["Stop", "No Entry", "Give Way", "One Way"],
    correctIndex: 1,
    explanation:
      "A red circle with a white horizontal bar is the NO ENTRY sign — vehicles are prohibited from entering.",
  },
  {
    id: 15,
    category: "Emergency Procedures",
    question: "What is the golden hour in accident response?",
    options: [
      "1 hour after sunrise",
      "First 60 minutes after injury",
      "Time to reach hospital",
      "Time to file FIR",
    ],
    correctIndex: 1,
    explanation:
      "The 'Golden Hour' is the first 60 minutes after a traumatic injury — prompt medical care during this window dramatically improves survival chances.",
  },
  {
    id: 16,
    category: "Traffic Laws",
    question:
      "What is the penalty for not wearing a seatbelt in a car in India?",
    options: ["₹100", "₹500", "₹1,000", "₹2,000"],
    correctIndex: 2,
    explanation:
      "Not wearing a seatbelt attracts a fine of ₹1,000 under Section 194B of the MV Act 2019.",
  },
  {
    id: 17,
    category: "Road Signs",
    question: "A yellow diamond sign with a black curve symbol warns of:",
    options: ["Sharp curve ahead", "Road closed", "School zone", "Speed bump"],
    correctIndex: 0,
    explanation:
      "Yellow diamond signs with black symbols are warning signs. A curve symbol indicates a sharp bend or curve in the road ahead.",
  },
  {
    id: 18,
    category: "Emergency Procedures",
    question: "If someone has a suspected spinal injury, you should:",
    options: [
      "Move them to a comfortable position",
      "Keep them still and call for help",
      "Give them painkillers",
      "Massage the affected area",
    ],
    correctIndex: 1,
    explanation:
      "Never move someone with a suspected spinal injury. Keep them completely still, support their head and neck, and call for emergency help immediately.",
  },
  {
    id: 19,
    category: "Traffic Laws",
    question: "What is the fine for jumping a red light in India?",
    options: ["₹500", "₹1,000", "₹5,000", "₹10,000"],
    correctIndex: 1,
    explanation:
      "Jumping a red light attracts a fine of ₹1,000 and may also lead to licence suspension for repeat offences.",
  },
  {
    id: 20,
    category: "Road Signs",
    question: "A sign showing a pedestrian on a zebra crossing indicates:",
    options: [
      "Pedestrian crossing ahead",
      "No walking",
      "School zone",
      "Hospital nearby",
    ],
    correctIndex: 0,
    explanation:
      "This warning sign alerts drivers to a pedestrian crossing ahead. Slow down and be prepared to stop for pedestrians.",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getLevelInfo(xp: number) {
  if (xp < 500)
    return {
      name: "Road Novice",
      min: 0,
      max: 499,
      color: "text-slate-400",
      bg: "bg-slate-500",
    };
  if (xp < 1500)
    return {
      name: "Road Aware",
      min: 500,
      max: 1499,
      color: "text-emerald-400",
      bg: "bg-emerald-500",
    };
  if (xp < 3000)
    return {
      name: "Road Expert",
      min: 1500,
      max: 2999,
      color: "text-blue-400",
      bg: "bg-blue-500",
    };
  if (xp < 5000)
    return {
      name: "Road Guardian",
      min: 3000,
      max: 4999,
      color: "text-purple-400",
      bg: "bg-purple-500",
    };
  return {
    name: "Road Master",
    min: 5000,
    max: 99999,
    color: "text-amber-400",
    bg: "bg-amber-500",
  };
}

function xpToNextLevel(xp: number): number {
  const info = getLevelInfo(xp);
  return info.max - xp + 1;
}

function levelProgress(xp: number): number {
  const info = getLevelInfo(xp);
  const range = info.max - info.min + 1;
  const current = xp - info.min;
  return Math.min(100, Math.max(0, (current / range) * 100));
}

/* ------------------------------------------------------------------ */
/*  Mock Leaderboard                                                   */
/* ------------------------------------------------------------------ */

const MOCK_LEADERBOARD = [
  { name: "Arjun Patel", xp: 4850, level: "Road Guardian" },
  { name: "Priya Sharma", xp: 4320, level: "Road Guardian" },
  { name: "Rahul Verma", xp: 3890, level: "Road Expert" },
  { name: "Sneha Gupta", xp: 3650, level: "Road Expert" },
  { name: "Vikram Rao", xp: 3120, level: "Road Expert" },
  { name: "Naman Maheshwari", xp: 0, level: "Road Novice" },
  { name: "Ananya Iyer", xp: 2780, level: "Road Expert" },
  { name: "Karan Malhotra", xp: 2450, level: "Road Aware" },
  { name: "Divya Nair", xp: 2100, level: "Road Aware" },
  { name: "Rohit Khanna", xp: 1890, level: "Road Aware" },
];

/* ------------------------------------------------------------------ */
/*  Badges                                                             */
/* ------------------------------------------------------------------ */

const BADGES: BadgeDef[] = [
  {
    id: "first_steps",
    name: "First Steps",
    description: "Complete your first quiz",
    icon: <Star className="h-5 w-5" />,
    condition: (s) => s.quizzesCompleted >= 1,
  },
  {
    id: "perfect_score",
    name: "Perfect Score",
    description: "Get all 5 questions correct in a quiz",
    icon: <Trophy className="h-5 w-5" />,
    condition: (s) => s.correctAnswers >= 5 && s.questionsAnswered >= 5,
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Answer a question in under 5 seconds",
    icon: <Zap className="h-5 w-5" />,
    condition: (s) => s.fastestAnswerMs > 0 && s.fastestAnswerMs < 5000,
  },
  {
    id: "week_warrior",
    name: "Week Warrior",
    description: "Maintain a 7-day quiz streak",
    icon: <Flame className="h-5 w-5" />,
    condition: (s) => s.bestStreak >= 7,
  },
  {
    id: "road_expert",
    name: "Road Expert",
    description: "Reach Road Expert level",
    icon: <Medal className="h-5 w-5" />,
    condition: (s) =>
      getLevelInfo(s.totalXP).name === "Road Expert" || s.totalXP >= 1500,
  },
  {
    id: "safety_champion",
    name: "Safety Champion",
    description: "Answer 500 total questions",
    icon: <Award className="h-5 w-5" />,
    condition: (s) => s.questionsAnswered >= 500,
  },
  {
    id: "law_guru",
    name: "Law Guru",
    description: "100% accuracy on Traffic Laws category",
    icon: <CheckCircle2 className="h-5 w-5" />,
    condition: (s) =>
      s.categoryTotal["Traffic Laws"] >= 5 &&
      s.categoryCorrect["Traffic Laws"] === s.categoryTotal["Traffic Laws"],
  },
  {
    id: "emergency_hero",
    name: "Emergency Hero",
    description: "100% accuracy on Emergency Procedures category",
    icon: <Target className="h-5 w-5" />,
    condition: (s) =>
      s.categoryTotal["Emergency Procedures"] >= 5 &&
      s.categoryCorrect["Emergency Procedures"] ===
        s.categoryTotal["Emergency Procedures"],
  },
];

/* ------------------------------------------------------------------ */
/*  Missions                                                           */
/* ------------------------------------------------------------------ */

const MISSIONS: MissionDef[] = [
  {
    id: "m1",
    title: "Answer 10 Questions Correctly",
    description: "Get 10 answers right across all quizzes",
    target: 10,
    xpReward: 200,
    progressFn: (s) => s.correctAnswers,
  },
  {
    id: "m2",
    title: "Achieve a 5-Question Streak",
    description: "Answer 5 questions correctly in a row",
    target: 5,
    xpReward: 300,
    progressFn: (s) => s.currentStreak,
  },
  {
    id: "m3",
    title: "Score 500 XP This Week",
    description: "Earn 500 XP from quizzes",
    target: 500,
    xpReward: 150,
    progressFn: (s) => s.totalXP,
  },
  {
    id: "m4",
    title: "Complete the Quiz 3 Days in a Row",
    description: "Take the daily quiz for 3 consecutive days",
    target: 3,
    xpReward: 250,
    progressFn: (s) => s.currentStreak,
  },
];

/* ------------------------------------------------------------------ */
/*  Default Stats                                                      */
/* ------------------------------------------------------------------ */

function defaultStats(): UserStats {
  return {
    totalXP: 0,
    quizzesCompleted: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastQuizDate: null,
    streakDates: [],
    categoryCorrect: {},
    categoryTotal: {},
    fastestAnswerMs: 0,
    missionsProgress: {},
  };
}

function loadStats(): UserStats {
  try {
    const raw = localStorage.getItem("saferoad_challenge_stats");
    if (raw) return { ...defaultStats(), ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return defaultStats();
}

function saveStats(stats: UserStats) {
  localStorage.setItem("saferoad_challenge_stats", JSON.stringify(stats));
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function LevelBadge({ xp }: { xp: number }) {
  const info = getLevelInfo(xp);
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-8 w-8 rounded-full ${info.bg} flex items-center justify-center`}
      >
        <Star className="h-4 w-4 text-white" />
      </div>
      <div>
        <div className={`text-sm font-bold ${info.color}`}>{info.name}</div>
        <div className="text-[10px] text-slate-400">{xp} XP</div>
      </div>
    </div>
  );
}

function XPBar({ xp }: { xp: number }) {
  const progress = levelProgress(xp);
  const remaining = xpToNextLevel(xp);
  const _info = getLevelInfo(xp);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>Level Progress</span>
        <span>{remaining} XP to next level</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function StreakTracker({ stats }: { stats: UserStats }) {
  const last7 = useMemo(() => {
    const days: { date: string; active: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      days.push({ date: ds, active: stats.streakDates.includes(ds) });
    }
    return days;
  }, [stats.streakDates]);

  return (
    <Card className="border-white/10" style={{ background: "#0f172a" }}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-400" />
            <span className="text-sm font-bold text-white">Daily Streak</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-orange-400">
              {stats.currentStreak} days
            </div>
            <div className="text-[10px] text-slate-400">
              Best: {stats.bestStreak} days
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {last7.map((d, _idx) => (
            <div
              key={d.date}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div
                className={`h-2.5 w-2.5 rounded-full ${d.active ? "bg-orange-400" : "bg-white/10"}`}
              />
              <span className="text-[8px] text-slate-500">
                {new Date(d.date).toLocaleDateString("en-IN", {
                  weekday: "narrow",
                })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuizOverlay({
  onClose,
  onComplete,
  stats: _stats,
}: {
  onClose: () => void;
  onComplete: (score: number, xpEarned: number, newStreak: number) => void;
  stats: UserStats;
}) {
  const [questions] = useState<Question[]>(() => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  });
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizFinished, setQuizFinished] = useState(false);
  const [, setAnswerTimes] = useState<number[]>([]);
  const questionStart = useRef<number>(Date.now());

  useEffect(() => {
    if (answered || quizFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleAnswer(-1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [answered, quizFinished]);

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (answered) return;
      const elapsed = Date.now() - questionStart.current;
      setAnswerTimes((prev: number[]) => [...prev, elapsed]);
      setSelected(optionIndex);
      setAnswered(true);

      const q = questions[qIndex];
      const isCorrect = optionIndex === q.correctIndex;
      if (isCorrect) {
        setScore((s) => s + 1);
        setStreak((s) => s + 1);
      } else {
        setStreak(0);
      }
    },
    [answered, qIndex, questions],
  );

  const nextQuestion = useCallback(() => {
    if (qIndex < questions.length - 1) {
      setQIndex((i) => i + 1);
      setSelected(null);
      setAnswered(false);
      setTimeLeft(30);
      questionStart.current = Date.now();
    } else {
      setQuizFinished(true);
    }
  }, [qIndex, questions.length]);

  const finishQuiz = useCallback(() => {
    const baseXP = score * 100;
    const streakBonus = streak >= 2 ? (streak - 1) * 50 : 0;
    const totalXP = baseXP + streakBonus;
    onComplete(score, totalXP, streak);
  }, [score, streak, onComplete]);

  if (quizFinished) {
    const baseXP = score * 100;
    const streakBonus = streak >= 2 ? (streak - 1) * 50 : 0;
    const totalXP = baseXP + streakBonus;
    const isPerfect = score === 5;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(10,15,30,0.95)" }}
      >
        <Card
          className="w-full max-w-md border-white/10"
          style={{ background: "#0f172a" }}
        >
          <CardContent className="p-6 space-y-5 text-center">
            <div
              className={`h-16 w-16 rounded-full mx-auto flex items-center justify-center ${isPerfect ? "bg-amber-400/20" : "bg-emerald-500/20"}`}
            >
              {isPerfect ? (
                <Trophy className="h-8 w-8 text-amber-400" />
              ) : (
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Quiz Complete!</h2>
              <p className="text-sm text-slate-400 mt-1">
                You scored {score}/5
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-lg font-bold text-amber-400">
                  +{baseXP}
                </div>
                <div className="text-[10px] text-slate-400">Base XP</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-lg font-bold text-purple-400">
                  +{streakBonus}
                </div>
                <div className="text-[10px] text-slate-400">Streak Bonus</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-lg font-bold text-emerald-400">
                  {totalXP}
                </div>
                <div className="text-[10px] text-slate-400">Total XP</div>
              </div>
            </div>
            {streak >= 2 && (
              <div className="flex items-center justify-center gap-2 text-sm text-orange-400">
                <Flame className="h-4 w-4" />
                <span>{streak} question streak!</span>
              </div>
            )}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-white/10 text-slate-300 hover:bg-white/5"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `I scored ${score}/5 in the Road Safety Challenge on SafeRoad AI! Can you beat me?`,
                  );
                  toast.success("Score copied to clipboard!");
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Score
              </Button>
              <Button
                type="button"
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold"
                onClick={finishQuiz}
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const q = questions[qIndex];
  const isCorrect = selected === q.correctIndex;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "#0a0f1e" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Quit</span>
        </button>
        <div className="text-sm font-bold text-white">
          Question {qIndex + 1} / {questions.length}
        </div>
        <div className="flex items-center gap-1 text-amber-400">
          <Clock className="h-4 w-4" />
          <span
            className={`text-sm font-bold ${timeLeft <= 5 ? "text-red-400" : ""}`}
          >
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1 bg-white/10">
        <div
          className="h-full bg-amber-400 transition-all duration-300"
          style={{
            width: `${((qIndex + (answered ? 1 : 0)) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col p-4 md:p-6 max-w-2xl mx-auto w-full">
        <div className="mb-4">
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            {q.category}
          </span>
        </div>
        <h2 className="text-lg md:text-xl font-bold text-white mb-6">
          {q.question}
        </h2>

        <div className="space-y-3 flex-1">
          {q.options.map((opt, optIdx) => {
            let btnClass =
              "w-full text-left p-4 rounded-xl border transition-all duration-200 ";
            if (!answered) {
              btnClass +=
                "border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-400/30 text-slate-200";
            } else if (optIdx === q.correctIndex) {
              btnClass +=
                "border-emerald-500/50 bg-emerald-500/15 text-emerald-300";
            } else if (optIdx === selected && optIdx !== q.correctIndex) {
              btnClass += "border-red-500/50 bg-red-500/15 text-red-300";
            } else {
              btnClass += "border-white/5 bg-white/3 text-slate-500";
            }

            return (
              <button
                key={opt}
                type="button"
                disabled={answered}
                onClick={() => handleAnswer(optIdx)}
                className={btnClass}
              >
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold shrink-0">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="text-sm">{opt}</span>
                  {answered && optIdx === q.correctIndex && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 ml-auto shrink-0" />
                  )}
                  {answered &&
                    optIdx === selected &&
                    optIdx !== q.correctIndex && (
                      <XCircle className="h-5 w-5 text-red-400 ml-auto shrink-0" />
                    )}
                </div>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-3 rounded-lg border ${isCorrect ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"}`}
            >
              <div
                className={`text-sm font-bold ${isCorrect ? "text-emerald-400" : "text-red-400"}`}
              >
                {isCorrect ? "Correct! +100 XP" : "Incorrect"}
              </div>
              <div className="text-xs text-slate-400 mt-1">{q.explanation}</div>
            </div>
            <Button
              type="button"
              className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold"
              onClick={nextQuestion}
            >
              {qIndex < questions.length - 1 ? (
                <>
                  Next Question <ChevronRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                "See Results"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export function RoadSafetyChallengePage({
  onNavigate,
}: { onNavigate: (page: "home") => void }) {
  const [stats, setStats] = useState<UserStats>(loadStats);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [quizOpen, setQuizOpen] = useState(false);

  const levelInfo = getLevelInfo(stats.totalXP);

  const startQuiz = useCallback(() => {
    setQuizOpen(true);
  }, []);

  const handleQuizComplete = useCallback(
    (score: number, xpEarned: number, _newStreak: number) => {
      setStats((prev) => {
        const today = getToday();
        const newStreakDates = prev.streakDates.includes(today)
          ? prev.streakDates
          : [...prev.streakDates, today];
        const newCurrentStreak = newStreakDates.length;
        const newBestStreak = Math.max(prev.bestStreak, newCurrentStreak);

        const updated: UserStats = {
          ...prev,
          totalXP: prev.totalXP + xpEarned,
          quizzesCompleted: prev.quizzesCompleted + 1,
          questionsAnswered: prev.questionsAnswered + 5,
          correctAnswers: prev.correctAnswers + score,
          currentStreak: newCurrentStreak,
          bestStreak: newBestStreak,
          lastQuizDate: today,
          streakDates: newStreakDates.slice(-14),
        };
        saveStats(updated);
        return updated;
      });
      setQuizOpen(false);
      toast.success(`Quiz complete! You earned ${xpEarned} XP`);
    },
    [],
  );

  const leaderboardWithUser = useMemo(() => {
    const list = MOCK_LEADERBOARD.map((p) => ({
      ...p,
      xp: p.name === "Naman Maheshwari" ? stats.totalXP : p.xp,
      level: p.name === "Naman Maheshwari" ? levelInfo.name : p.level,
      isUser: p.name === "Naman Maheshwari",
    }));
    return list.sort((a, b) => b.xp - a.xp);
  }, [stats.totalXP, levelInfo.name]);

  return (
    <div
      className="p-4 md:p-6 space-y-6"
      style={{ background: "#0a0f1e", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            data-ocid="challenge.back_button"
          >
            <ArrowLeft className="h-5 w-5 text-slate-300" />
          </button>
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              Road Safety Challenge
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Test your road safety knowledge and earn rewards
            </p>
          </div>
        </div>
        <LevelBadge xp={stats.totalXP} />
      </div>

      {/* XP Bar */}
      <XPBar xp={stats.totalXP} />

      {/* Daily Quiz CTA */}
      <Card
        className="border-amber-500/30 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1a1f2e 100%)",
        }}
      >
        <CardContent className="p-5 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-amber-400" />
              <span className="text-sm font-bold text-amber-400">
                Daily Quiz Challenge
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              5 timed questions · 30 seconds each · Earn up to 500 XP per day
            </p>
            <div className="flex items-center gap-4 text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                {stats.quizzesCompleted} quizzes completed
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-400" />
                {stats.totalXP} total XP
              </span>
            </div>
          </div>
          <Button
            type="button"
            className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-6"
            onClick={startQuiz}
            data-ocid="challenge.start_quiz_button"
          >
            <Zap className="h-4 w-4 mr-2" />
            Start Quiz
          </Button>
        </CardContent>
      </Card>

      {/* Streak */}
      <StreakTracker stats={stats} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5 border border-white/10 w-full justify-start">
          <TabsTrigger
            value="dashboard"
            className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 text-xs"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="missions"
            className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 text-xs"
          >
            Missions
          </TabsTrigger>
          <TabsTrigger
            value="badges"
            className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 text-xs"
          >
            Badges
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 text-xs"
          >
            Leaderboard
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Total XP",
                value: stats.totalXP,
                color: "text-amber-400",
              },
              {
                label: "Quizzes Done",
                value: stats.quizzesCompleted,
                color: "text-emerald-400",
              },
              {
                label: "Correct Answers",
                value: stats.correctAnswers,
                color: "text-blue-400",
              },
              {
                label: "Current Streak",
                value: `${stats.currentStreak} days`,
                color: "text-orange-400",
              },
            ].map((s) => (
              <Card
                key={s.label}
                className="border-white/10"
                style={{ background: "#0f172a" }}
              >
                <CardContent className="p-4">
                  <div className="text-xs text-slate-400 mb-1">{s.label}</div>
                  <div className={`text-xl font-bold ${s.color}`}>
                    {s.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-white/10" style={{ background: "#0f172a" }}>
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-bold text-white">How It Works</h3>
              <div className="space-y-2">
                {[
                  "Answer 5 daily questions about Indian traffic laws, road signs, and emergency procedures",
                  "Earn 100 XP for each correct answer + streak bonuses for consecutive correct answers",
                  "Complete weekly missions for bonus XP rewards",
                  "Unlock badges and climb the leaderboard from Road Novice to Road Master",
                ].map((tip) => (
                  <div
                    key={tip}
                    className="flex items-start gap-2 text-xs text-slate-400"
                  >
                    <ChevronRight className="h-3 w-3 text-amber-400 mt-0.5 shrink-0" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Missions Tab */}
        <TabsContent value="missions" className="space-y-3 mt-4">
          {MISSIONS.map((m) => {
            const progress = Math.min(m.target, m.progressFn(stats));
            const pct = (progress / m.target) * 100;
            const completed = progress >= m.target;
            return (
              <Card
                key={m.id}
                className="border-white/10"
                style={{ background: "#0f172a" }}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">
                        {m.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        {m.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-amber-400">
                        +{m.xpReward} XP
                      </div>
                      {completed && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 ml-auto mt-1" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>
                        {progress} / {m.target}
                      </span>
                      <span>{Math.round(pct)}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5 bg-white/10" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-3 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BADGES.map((badge) => {
              const unlocked = badge.condition(stats);
              return (
                <Card
                  key={badge.id}
                  className={`border-white/10 ${unlocked ? "" : "opacity-50"}`}
                  style={{ background: "#0f172a" }}
                >
                  <CardContent className="p-4 text-center space-y-2">
                    <div
                      className={`h-10 w-10 rounded-full mx-auto flex items-center justify-center ${unlocked ? "bg-amber-500/20" : "bg-white/5"}`}
                    >
                      {unlocked ? (
                        badge.icon
                      ) : (
                        <Lock className="h-5 w-5 text-slate-500" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-white">
                      {badge.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {badge.description}
                    </div>
                    {unlocked && (
                      <div className="text-[10px] text-emerald-400 font-bold">
                        Unlocked!
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-3 mt-4">
          <Card className="border-white/10" style={{ background: "#0f172a" }}>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-4 py-3 text-xs text-slate-400 font-semibold">
                        Rank
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-slate-400 font-semibold">
                        Player
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-slate-400 font-semibold">
                        Level
                      </th>
                      <th className="text-right px-4 py-3 text-xs text-slate-400 font-semibold">
                        XP
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardWithUser.map((p, i) => (
                      <tr
                        key={p.name}
                        className={`border-b border-white/6 ${p.isUser ? "bg-amber-500/5" : "hover:bg-white/3"} transition-colors`}
                      >
                        <td className="px-4 py-3">
                          {i === 0 ? (
                            <Trophy className="h-4 w-4 text-amber-400" />
                          ) : i === 1 ? (
                            <Medal className="h-4 w-4 text-slate-300" />
                          ) : i === 2 ? (
                            <Medal className="h-4 w-4 text-amber-600" />
                          ) : (
                            <span className="text-xs text-slate-500">
                              #{i + 1}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div
                            className={`text-xs font-bold ${p.isUser ? "text-amber-400" : "text-white"}`}
                          >
                            {p.name} {p.isUser && "(You)"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                            {p.level}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-xs font-bold text-amber-400">
                          {p.xp.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quiz Overlay */}
      {quizOpen && (
        <QuizOverlay
          onClose={() => setQuizOpen(false)}
          onComplete={handleQuizComplete}
          stats={stats}
        />
      )}
    </div>
  );
}

export default RoadSafetyChallengePage;
