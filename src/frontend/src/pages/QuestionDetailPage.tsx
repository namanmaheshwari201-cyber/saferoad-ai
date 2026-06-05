import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Bot,
  CheckCheck,
  CheckCircle2,
  Clock,
  Flag,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import ReportModal from "../components/ReportModal";
import VoteButtons from "../components/VoteButtons";
import {
  AI_SUGGESTIONS,
  type SampleAnswer,
  sampleQuestions,
} from "../data/sampleData";

interface QuestionDetailPageProps {
  questionId: number;
  onBack: () => void;
}

const subjectColors: Record<string, string> = {
  Maths: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Science: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Physics: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  Chemistry: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  English: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  History: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Geography: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  "Computer Science": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  Biology: "bg-lime-500/10 text-lime-600 dark:text-lime-400",
};

export default function QuestionDetailPage({
  questionId,
  onBack,
}: QuestionDetailPageProps) {
  const [question, setQuestion] = useState(() => {
    const q = sampleQuestions.find((q) => q.id === questionId);
    return q ? { ...q } : null;
  });
  const [answers, setAnswers] = useState<SampleAnswer[]>(
    question?.answers || [],
  );
  const [newAnswer, setNewAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportEntityType, setReportEntityType] = useState<
    "question" | "answer"
  >("question");

  if (!question) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <p className="text-muted-foreground mt-8 text-center">
          Question not found
        </p>
      </div>
    );
  }

  const aiSuggestion =
    AI_SUGGESTIONS[question.subject] || AI_SUGGESTIONS.default;

  const submitAnswer = async () => {
    if (!newAnswer.trim()) return toast.error("Please write an answer");
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    const ans: SampleAnswer = {
      id: Date.now(),
      content: newAnswer,
      authorName: "You",
      votes: 0,
      isAccepted: false,
      createdAt: "just now",
      userVote: null,
    };
    setAnswers((a) => [...a, ans]);
    setQuestion((q) => (q ? { ...q, isAnswered: true } : q));
    setNewAnswer("");
    setSubmitting(false);
    toast.success("Answer posted!");
  };

  const openReport = (type: "question" | "answer") => {
    setReportEntityType(type);
    setReportOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4"
        data-ocid="question.button"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Q&A
      </Button>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-border/60 mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-4">
              <VoteButtons
                votes={question.votes}
                userVote={question.userVote}
                onVote={() => {}}
                layout="vertical"
                ocidPrefix="question.vote"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {question.isAnswered && (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Answered
                    </Badge>
                  )}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      subjectColors[question.subject] ||
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {question.subject}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {question.className}
                  </Badge>
                </div>
                <h1 className="font-display font-bold text-xl mb-2">
                  {question.title}
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {question.description}
                </p>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                        {question.authorName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">
                      {question.authorName}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {question.createdAt}
                  </span>
                  <div className="flex gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setQuestion((q) =>
                          q ? { ...q, bookmarked: !q.bookmarked } : q,
                        );
                        toast.success(
                          question.bookmarked
                            ? "Removed from bookmarks"
                            : "Bookmarked!",
                        );
                      }}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      data-ocid="question.toggle"
                    >
                      {question.bookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-primary" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => openReport("question")}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      data-ocid="question.button"
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* AI Doubt Solver - shown when no answers */}
        {answers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 mb-6">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm mb-1 text-primary">
                      AI Doubt Solver
                    </p>
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {aiSuggestion}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      ℹ️ This is an AI suggestion. Be the first to post a human
                      answer!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Answers */}
        <div className="mb-6">
          <h2 className="font-display font-bold text-lg mb-4">
            {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
          </h2>
          {answers.length === 0 ? (
            <div
              className="text-center py-6 text-muted-foreground"
              data-ocid="question.empty_state"
            >
              <p className="text-sm">No answers yet. Be the first to help!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {answers.map((ans, idx) => (
                <motion.div
                  key={ans.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  data-ocid={`question.answer.item.${idx + 1}`}
                >
                  <Card
                    className={`border-border/60 ${ans.isAccepted ? "border-emerald-500/30 bg-emerald-500/5" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <VoteButtons
                          votes={ans.votes}
                          userVote={ans.userVote}
                          onVote={() => {}}
                          layout="vertical"
                          ocidPrefix="answer.vote"
                        />
                        <div className="flex-1 min-w-0">
                          {ans.isAccepted && (
                            <div className="flex items-center gap-1.5 mb-2">
                              <CheckCheck className="w-4 h-4 text-emerald-500" />
                              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                Accepted Answer
                              </span>
                            </div>
                          )}
                          <p className="text-sm leading-relaxed">
                            {ans.content}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                  {ans.authorName.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium">
                                {ans.authorName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {ans.createdAt}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => openReport("answer")}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              data-ocid="answer.button"
                            >
                              <Flag className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Post Answer */}
        <Separator className="mb-6" />
        <div>
          <h3 className="font-display font-semibold text-base mb-3">
            Your Answer
          </h3>
          <Textarea
            placeholder="Share your knowledge or explain the concept..."
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            rows={5}
            className="mb-3"
            data-ocid="question.textarea"
          />
          <Button
            onClick={submitAnswer}
            disabled={submitting || !newAnswer.trim()}
            data-ocid="question.submit_button"
          >
            <Send className="w-4 h-4 mr-2" />
            {submitting ? "Posting..." : "Post Answer"}
          </Button>
        </div>
      </motion.div>

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        entityType={reportEntityType}
      />
    </div>
  );
}
