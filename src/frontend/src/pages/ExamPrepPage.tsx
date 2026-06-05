import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { CLASSES, SUBJECTS, examPapers } from "../data/sampleData";

const typeLabels: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  sample: {
    label: "Sample Paper",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    icon: <FileText className="w-3 h-3" />,
  },
  previous: {
    label: "Previous Year",
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    icon: <Clock className="w-3 h-3" />,
  },
  revision: {
    label: "Quick Revision",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    icon: <Zap className="w-3 h-3" />,
  },
};

const subjectColors: Record<string, string> = {
  Maths: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Science: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Physics: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  Chemistry: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  English: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
};

const tips = [
  {
    subject: "Maths",
    tip: "Solve at least 5 problems daily. Time yourself for exam conditions.",
    icon: "📐",
  },
  {
    subject: "Science",
    tip: "Draw and label diagrams. Learn equations by writing, not reading.",
    icon: "🔬",
  },
  {
    subject: "Physics",
    tip: "Practice numericals. Check units in every calculation.",
    icon: "⚡",
  },
  {
    subject: "English",
    tip: "Read sample answers. Note how marks are distributed in board papers.",
    icon: "📝",
  },
  {
    subject: "Chemistry",
    tip: "Make a formula chart. Practice balancing equations daily.",
    icon: "⚗️",
  },
];

export default function ExamPrepPage() {
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterClass, setFilterClass] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const filtered = examPapers.filter((p) => {
    const matchesSub = filterSubject === "all" || p.subject === filterSubject;
    const matchesClass = filterClass === "all" || p.className === filterClass;
    const matchesType = activeTab === "all" || p.type === activeTab;
    return matchesSub && matchesClass && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          Exam Preparation
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Sample papers, previous year questions, and quick revision notes
        </p>
      </div>

      {/* Quick Tips */}
      <div className="mb-8">
        <h2 className="font-display font-semibold text-base mb-3">
          Quick Study Tips
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tips.map((t, i) => (
            <motion.div
              key={t.subject}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="border-border/60 bg-gradient-to-br from-muted/30 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{t.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{t.subject}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {t.tip}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-36 h-9" data-ocid="exam.select">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {SUBJECTS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterClass} onValueChange={setFilterClass}>
          <SelectTrigger className="w-32 h-9" data-ocid="exam.select">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {CLASSES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all" data-ocid="exam.tab">
            All
          </TabsTrigger>
          <TabsTrigger value="sample" data-ocid="exam.tab">
            Sample Papers
          </TabsTrigger>
          <TabsTrigger value="previous" data-ocid="exam.tab">
            Previous Year
          </TabsTrigger>
          <TabsTrigger value="revision" data-ocid="exam.tab">
            Quick Revision
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filtered.length === 0 ? (
            <div className="text-center py-12" data-ocid="exam.empty_state">
              <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">
                No papers found for this filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p, idx) => {
                const typeInfo = typeLabels[p.type];
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    data-ocid={`exam.item.${idx + 1}`}
                  >
                    <Card className="card-hover border-border/60 h-full flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${typeInfo.color}`}
                          >
                            {typeInfo.icon}
                            {typeInfo.label}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${subjectColors[p.subject] || "bg-muted text-muted-foreground"}`}
                          >
                            {p.subject}
                          </span>
                        </div>
                        <CardTitle className="font-display text-sm leading-snug">
                          {p.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {p.className}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {p.year}
                          </span>
                        </div>
                        <div className="mt-auto">
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="w-full text-xs"
                            data-ocid="exam.button"
                          >
                            <a href={p.downloadLink}>
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
