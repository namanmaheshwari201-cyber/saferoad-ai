import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { type SampleQuiz, sampleQuizzes } from "../data/sampleData";

type QuizState = "select" | "playing" | "result";

const subjectColors: Record<string, string> = {
  Maths: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Science: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Physics: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

export default function WeeklyQuizPage() {
  const [state, setState] = useState<QuizState>("select");
  const [quiz, setQuiz] = useState<SampleQuiz | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const startQuiz = (q: SampleQuiz) => {
    setQuiz(q);
    setCurrentQ(0);
    setAnswers(new Array(q.questions.length).fill(null));
    setSelectedOption(null);
    setState("playing");
  };

  const submitAnswer = () => {
    if (selectedOption === null || !quiz) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = selectedOption;
    setAnswers(newAnswers);

    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ((i) => i + 1);
      setSelectedOption(null);
    } else {
      // calculate score
      const correct = quiz.questions.reduce((acc, q, i) => {
        return acc + (newAnswers[i] === q.correctOption ? 1 : 0);
      }, 0);
      setScore(correct);
      setState("result");
    }
  };

  const restart = () => {
    setState("select");
    setQuiz(null);
    setCurrentQ(0);
    setAnswers([]);
    setSelectedOption(null);
    setScore(0);
  };

  if (state === "select") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Weekly Quiz
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Test your knowledge and earn points
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sampleQuizzes.map((q, idx) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              data-ocid={`quiz.item.${idx + 1}`}
            >
              <Card className="card-hover border-border/60 cursor-pointer h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${subjectColors[q.subject] || "bg-muted text-muted-foreground"}`}
                    >
                      {q.subject}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {q.className}
                    </Badge>
                  </div>
                  <CardTitle className="font-display text-base">
                    {q.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 flex flex-col flex-1">
                  <p className="text-sm text-muted-foreground mb-4 flex-1">
                    {q.questions.length} questions • Multiple choice
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => startQuiz(q)}
                    data-ocid="quiz.primary_button"
                  >
                    Start Quiz
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (state === "playing" && quiz) {
    const q = quiz.questions[currentQ];
    const progress = (currentQ / quiz.questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={restart}
            data-ocid="quiz.button"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Exit
          </Button>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{quiz.title}</span>
              <span>
                {currentQ + 1} / {quiz.questions.length}
              </span>
            </div>
            <Progress
              value={progress}
              className="h-2"
              data-ocid="quiz.loading_state"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="border-border/60">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    Question {currentQ + 1}
                  </Badge>
                </div>
                <CardTitle className="font-display text-lg leading-snug">
                  {q.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedOption?.toString() ?? ""}
                  onValueChange={(v) => setSelectedOption(Number(v))}
                  className="space-y-3"
                  data-ocid="quiz.radio"
                >
                  {q.options.map((opt, i) => (
                    <Label
                      key={`q${q.id}-opt-${i}`}
                      htmlFor={`opt-${currentQ}-${i}`}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                        selectedOption === i
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40 hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem
                        value={i.toString()}
                        id={`opt-${currentQ}-${i}`}
                        className="shrink-0"
                      />
                      <span className="text-sm">
                        <span className="font-semibold mr-2 text-muted-foreground">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        {opt}
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
                <Button
                  className="w-full mt-5"
                  onClick={submitAnswer}
                  disabled={selectedOption === null}
                  data-ocid="quiz.submit_button"
                >
                  {currentQ < quiz.questions.length - 1
                    ? "Next Question"
                    : "Submit Quiz"}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (state === "result" && quiz) {
    const percent = Math.round((score / quiz.questions.length) * 100);
    const getMessage = () => {
      if (percent === 100)
        return {
          msg: "Perfect score! 🎉 Outstanding!",
          color: "text-emerald-500",
        };
      if (percent >= 75)
        return { msg: "Great job! 🌟 Keep it up!", color: "text-blue-500" };
      if (percent >= 50)
        return {
          msg: "Good effort! 📚 Study a bit more!",
          color: "text-amber-500",
        };
      return {
        msg: "Keep practicing! 💪 You'll improve!",
        color: "text-orange-500",
      };
    };
    const { msg, color } = getMessage();

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-border/60 overflow-hidden">
            <div className="gradient-hero p-8 text-center text-white">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
              <h2 className="font-display font-bold text-2xl mb-1">
                Quiz Complete!
              </h2>
              <p className="text-white/70 text-sm">{quiz.title}</p>
            </div>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-display font-bold text-primary mb-1">
                  {score}/{quiz.questions.length}
                </div>
                <div className={`text-sm font-semibold ${color}`}>
                  {percent}%
                </div>
                <p className={`mt-2 font-medium ${color}`}>{msg}</p>
              </div>

              <Progress value={percent} className="h-3 mb-6" />

              {/* Answer Review */}
              <div className="space-y-3 mb-6">
                <h3 className="font-display font-semibold text-sm">
                  Answer Review
                </h3>
                {quiz.questions.map((q, i) => {
                  const isCorrect = answers[i] === q.correctOption;
                  return (
                    <div
                      key={`review-${q.id}`}
                      className={`p-3 rounded-xl border text-sm ${
                        isCorrect
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : "border-destructive/30 bg-destructive/5"
                      }`}
                      data-ocid={`quiz.item.${i + 1}`}
                    >
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium text-xs">{q.question}</p>
                          {!isCorrect && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Correct:{" "}
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                {q.options[q.correctOption]}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => startQuiz(quiz)}
                  data-ocid="quiz.secondary_button"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Retry
                </Button>
                <Button
                  className="flex-1"
                  onClick={restart}
                  data-ocid="quiz.primary_button"
                >
                  More Quizzes
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return null;
}
