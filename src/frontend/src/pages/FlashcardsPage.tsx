import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
  RefreshCw,
  RotateCcw,
  Search,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  type Flashcard,
  type FlashcardChapter,
  flashcardData,
} from "../data/flashcardData";

// Persisted learned/difficult state keyed by card id
type CardState = { learned: boolean; difficult: boolean };
type CardStateMap = Record<number, CardState>;

function getInitialCardState(): CardStateMap {
  try {
    const stored = localStorage.getItem("flashcard_state");
    if (stored) return JSON.parse(stored) as CardStateMap;
  } catch {
    /* ignore */
  }
  return {};
}

function saveCardState(state: CardStateMap) {
  try {
    localStorage.setItem("flashcard_state", JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export default function FlashcardsPage() {
  const [cardState, setCardState] = useState<CardStateMap>(getInitialCardState);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [reviewDifficult, setReviewDifficult] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipKey, setFlipKey] = useState(0);

  // Persist card state
  useEffect(() => {
    saveCardState(cardState);
  }, [cardState]);

  // Available subjects for selected class
  const availableSubjects = useMemo(() => {
    if (selectedClass === "all") {
      const all = new Map<string, string>();
      for (const cls of flashcardData) {
        for (const s of cls.subjects) {
          all.set(s.id, s.name);
        }
      }
      return Array.from(all.values());
    }
    const cls = flashcardData.find((c) => c.id === selectedClass);
    return cls ? cls.subjects.map((s) => s.name) : [];
  }, [selectedClass]);

  // Available chapters for selected class+subject
  const availableChapters = useMemo(() => {
    const chapters: FlashcardChapter[] = [];
    for (const cls of flashcardData) {
      if (selectedClass !== "all" && cls.id !== selectedClass) continue;
      for (const subj of cls.subjects) {
        if (selectedSubject !== "all" && subj.name !== selectedSubject)
          continue;
        for (const ch of subj.chapters) {
          chapters.push(ch);
        }
      }
    }
    return chapters;
  }, [selectedClass, selectedSubject]);

  // All cards matching current filter
  const allFilteredCards = useMemo(() => {
    const cards: (Flashcard & { chapterName: string; subjectName: string })[] =
      [];
    for (const cls of flashcardData) {
      if (selectedClass !== "all" && cls.id !== selectedClass) continue;
      for (const subj of cls.subjects) {
        if (selectedSubject !== "all" && subj.name !== selectedSubject)
          continue;
        for (const ch of subj.chapters) {
          if (selectedChapter !== "all" && ch.id !== selectedChapter) continue;
          for (const card of ch.cards) {
            cards.push({
              ...card,
              chapterName: ch.name,
              subjectName: subj.name,
            });
          }
        }
      }
    }
    return cards;
  }, [selectedClass, selectedSubject, selectedChapter]);

  // Apply search + difficult filter
  const displayCards = useMemo(() => {
    let result = allFilteredCards;
    if (reviewDifficult) {
      result = result.filter((c) => cardState[c.id]?.difficult);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q),
      );
    }
    return result;
  }, [allFilteredCards, reviewDifficult, search, cardState]);

  // Reset index + flip when displayCards changes (i.e. filters change)
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset on display card set change
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setFlipKey((k) => k + 1);
  }, [displayCards]);

  const currentCard = displayCards[currentIndex] ?? null;

  const goNext = () => {
    if (currentIndex < displayCards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
      setFlipKey((k) => k + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setIsFlipped(false);
      setFlipKey((k) => k + 1);
    }
  };

  const toggleFlip = () => setIsFlipped((f) => !f);

  const toggleLearned = (id: number) => {
    setCardState((prev) => {
      const cur = prev[id] ?? { learned: false, difficult: false };
      const next = { ...cur, learned: !cur.learned };
      if (next.learned && next.difficult) next.difficult = false;
      return { ...prev, [id]: next };
    });
    toast.success(
      cardState[id]?.learned
        ? "Marked as not learned"
        : "Marked as learned! 🎉",
    );
  };

  const toggleDifficult = (id: number) => {
    setCardState((prev) => {
      const cur = prev[id] ?? { learned: false, difficult: false };
      const next = { ...cur, difficult: !cur.difficult };
      if (next.difficult && next.learned) next.learned = false;
      return { ...prev, [id]: next };
    });
    toast.warning(
      cardState[id]?.difficult
        ? "Removed from difficult cards"
        : "Marked as difficult — review it later",
    );
  };

  const resetProgress = () => {
    const idsToReset = new Set(allFilteredCards.map((c) => c.id));
    setCardState((prev) => {
      const next = { ...prev };
      for (const id of idsToReset) {
        delete next[id];
      }
      return next;
    });
    setCurrentIndex(0);
    setIsFlipped(false);
    setFlipKey((k) => k + 1);
    toast.success("Progress reset for current selection");
  };

  // Stats for current filtered set (allFilteredCards, not display)
  const stats = useMemo(() => {
    const total = allFilteredCards.length;
    const learned = allFilteredCards.filter(
      (c) => cardState[c.id]?.learned,
    ).length;
    const difficult = allFilteredCards.filter(
      (c) => cardState[c.id]?.difficult,
    ).length;
    const remaining = total - learned;
    return { total, learned, difficult, remaining };
  }, [allFilteredCards, cardState]);

  const progressPct = stats.total > 0 ? (stats.learned / stats.total) * 100 : 0;

  // Chapter list for sidebar
  const chapterList = useMemo(() => {
    return availableChapters.map((ch) => {
      const total = ch.cards.length;
      const learned = ch.cards.filter((c) => cardState[c.id]?.learned).length;
      return { ...ch, total, learned };
    });
  }, [availableChapters, cardState]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-display font-bold text-2xl">Flashcards</h1>
        </div>
        <p className="text-muted-foreground text-sm ml-12">
          Quick revision mode — flip cards, mark learned, track progress
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-muted/40 rounded-2xl border border-border/50">
        {/* Class */}
        <Select
          value={selectedClass}
          onValueChange={(v) => {
            setSelectedClass(v);
            setSelectedSubject("all");
            setSelectedChapter("all");
          }}
        >
          <SelectTrigger
            className="w-[140px] h-9 bg-background"
            data-ocid="flashcards.select"
          >
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {flashcardData.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Subject */}
        <Select
          value={selectedSubject}
          onValueChange={(v) => {
            setSelectedSubject(v);
            setSelectedChapter("all");
          }}
        >
          <SelectTrigger
            className="w-[150px] h-9 bg-background"
            data-ocid="flashcards.select"
          >
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {availableSubjects.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Chapter */}
        <Select value={selectedChapter} onValueChange={setSelectedChapter}>
          <SelectTrigger
            className="w-[190px] h-9 bg-background"
            data-ocid="flashcards.select"
          >
            <SelectValue placeholder="Chapter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Chapters</SelectItem>
            {availableChapters.map((ch) => (
              <SelectItem key={ch.id} value={ch.id}>
                {ch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            className="pl-9 h-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="flashcards.search_input"
          />
        </div>

        {/* Difficult toggle */}
        <Button
          variant={reviewDifficult ? "default" : "outline"}
          size="sm"
          className={`h-9 gap-1.5 ${reviewDifficult ? "bg-amber-500 hover:bg-amber-600 border-amber-500 text-white" : "border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"}`}
          onClick={() => setReviewDifficult((r) => !r)}
          data-ocid="flashcards.toggle"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          {reviewDifficult ? "Reviewing Difficult" : "Review Difficult"}
          {stats.difficult > 0 && (
            <Badge
              className={`ml-1 text-[10px] px-1.5 py-0 h-4 ${reviewDifficult ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"}`}
            >
              {stats.difficult}
            </Badge>
          )}
        </Button>
      </div>

      {displayCards.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="flashcards.empty_state"
        >
          <Layers className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">
            {reviewDifficult
              ? "No difficult cards in this selection"
              : search
                ? "No cards match your search"
                : "No flashcards available for this selection"}
          </p>
          {reviewDifficult && (
            <p className="text-sm mt-1">
              Mark cards as difficult while studying to review them here.
            </p>
          )}
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          {/* Main card area */}
          <div className="flex flex-col gap-5">
            {/* Card counter + tags */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                {currentCard && (
                  <>
                    <Badge variant="secondary" className="text-xs font-medium">
                      {currentCard.subjectName}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {currentCard.chapterName}
                    </Badge>
                  </>
                )}
              </div>
              <span className="text-sm text-muted-foreground font-medium tabular-nums">
                Card {currentIndex + 1} of {displayCards.length}
              </span>
            </div>

            {/* Flip card */}
            {currentCard && (
              <button
                type="button"
                className="relative cursor-pointer select-none w-full text-left bg-transparent border-0 p-0"
                style={{ perspective: "1200px", minHeight: "320px" }}
                onClick={toggleFlip}
                data-ocid="flashcards.card"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${flipKey}-${isFlipped ? "back" : "front"}`}
                    initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="w-full"
                  >
                    {!isFlipped ? (
                      /* Front */
                      <div
                        className={`rounded-2xl border-2 p-8 min-h-[320px] flex flex-col items-center justify-center text-center gap-4 transition-colors ${
                          cardState[currentCard.id]?.learned
                            ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20"
                            : cardState[currentCard.id]?.difficult
                              ? "border-amber-300 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20"
                              : "border-border bg-card"
                        }`}
                      >
                        {cardState[currentCard.id]?.learned && (
                          <div className="absolute top-4 right-4">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          </div>
                        )}
                        {cardState[currentCard.id]?.difficult && (
                          <div className="absolute top-4 right-4">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                          </div>
                        )}
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                          <span className="text-xs font-bold text-primary">
                            Q
                          </span>
                        </div>
                        <p className="font-display font-semibold text-xl leading-snug max-w-lg">
                          {currentCard.front}
                        </p>
                        <p className="text-xs text-muted-foreground mt-4">
                          Tap to reveal answer
                        </p>
                      </div>
                    ) : (
                      /* Back */
                      <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-8 min-h-[320px] flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                          <span className="text-xs font-bold text-primary">
                            A
                          </span>
                        </div>
                        <p className="text-base leading-relaxed max-w-lg whitespace-pre-line">
                          {currentCard.back}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </button>
            )}

            {/* Action buttons */}
            {currentCard && (
              <div className="flex flex-wrap items-center gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="gap-1.5"
                  data-ocid="flashcards.button"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFlip}
                  className="gap-1.5"
                  data-ocid="flashcards.button"
                >
                  <RotateCcw className="w-4 h-4" />
                  {isFlipped ? "See Question" : "Reveal Answer"}
                </Button>

                <Button
                  size="sm"
                  className={`gap-1.5 ${
                    cardState[currentCard.id]?.learned
                      ? "bg-emerald-500 hover:bg-emerald-600 border-emerald-500 text-white"
                      : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-500 hover:text-white"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLearned(currentCard.id);
                  }}
                  data-ocid="flashcards.primary_button"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {cardState[currentCard.id]?.learned
                    ? "Learned ✓"
                    : "Mark Learned"}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className={`gap-1.5 ${
                    cardState[currentCard.id]?.difficult
                      ? "bg-amber-500 hover:bg-amber-600 border-amber-500 text-white"
                      : "border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400 hover:bg-amber-500 hover:text-white"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDifficult(currentCard.id);
                  }}
                  data-ocid="flashcards.secondary_button"
                >
                  <AlertTriangle className="w-4 h-4" />
                  {cardState[currentCard.id]?.difficult
                    ? "Difficult !"
                    : "Mark Difficult"}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goNext}
                  disabled={currentIndex === displayCards.length - 1}
                  className="gap-1.5"
                  data-ocid="flashcards.button"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Progress section */}
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold font-display">
                  Progress
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 text-muted-foreground hover:text-destructive gap-1"
                  onClick={resetProgress}
                  data-ocid="flashcards.delete_button"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset
                </Button>
              </div>
              <Progress value={progressPct} className="h-2 mb-3" />
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="rounded-xl bg-emerald-500/10 p-3">
                  <div className="font-bold text-lg text-emerald-600 dark:text-emerald-400 leading-none">
                    {stats.learned}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Learned
                  </div>
                </div>
                <div className="rounded-xl bg-amber-500/10 p-3">
                  <div className="font-bold text-lg text-amber-600 dark:text-amber-400 leading-none">
                    {stats.difficult}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Difficult
                  </div>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <div className="font-bold text-lg leading-none">
                    {stats.remaining}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Remaining
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chapter sidebar */}
          <aside>
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 sticky top-20">
              <h3 className="font-display font-semibold text-sm mb-3">
                Chapters
              </h3>
              {chapterList.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Select a class or subject to see chapters
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {chapterList.map((ch, idx) => {
                    const isActive =
                      selectedChapter === ch.id ||
                      (selectedChapter === "all" && idx === 0 && false);
                    const pct =
                      ch.total > 0 ? (ch.learned / ch.total) * 100 : 0;
                    return (
                      <li key={ch.id} data-ocid={`flashcards.item.${idx + 1}`}>
                        <button
                          type="button"
                          className={`w-full text-left rounded-xl px-3 py-2.5 text-xs transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                          onClick={() => setSelectedChapter(ch.id)}
                        >
                          <div className="font-medium leading-snug mb-1.5 truncate">
                            {ch.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={pct}
                              className={`h-1 flex-1 ${
                                ch.learned === ch.total && ch.total > 0
                                  ? "[&>div]:bg-emerald-500"
                                  : ""
                              }`}
                            />
                            <span
                              className={`shrink-0 tabular-nums ${
                                ch.learned === ch.total && ch.total > 0
                                  ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                                  : ""
                              }`}
                            >
                              {ch.learned}/{ch.total}
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
