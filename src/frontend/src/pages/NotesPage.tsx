import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Bookmark,
  BookmarkCheck,
  Download,
  FileText,
  Filter,
  Flag,
  Plus,
  Search,
  Star,
  Upload,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import ReportModal from "../components/ReportModal";
import VoteButtons from "../components/VoteButtons";
import {
  CLASSES,
  SUBJECTS,
  type SampleNote,
  sampleNotes,
} from "../data/sampleData";

interface NotesPageProps {
  searchQuery: string;
}

const subjectColors: Record<string, string> = {
  Maths: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Mathematics: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Science: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Physics: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  Chemistry: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  English: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  History: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Geography: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  "Computer Science": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  Biology: "bg-lime-500/10 text-lime-600 dark:text-lime-400",
  "Social Science (SST)": "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  "Information Technology & Artificial Intelligence":
    "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
};

export default function NotesPage({ searchQuery }: NotesPageProps) {
  const [notes, setNotes] = useState<SampleNote[]>(sampleNotes);
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterClass, setFilterClass] = useState("all");
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showUpload, setShowUpload] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    description: "",
    subject: "",
    className: "",
    downloadLink: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const filtered = notes.filter((n) => {
    const search = (localSearch || searchQuery).toLowerCase();
    const matchesSearch =
      !search ||
      n.title.toLowerCase().includes(search) ||
      n.description.toLowerCase().includes(search) ||
      n.uploaderName.toLowerCase().includes(search);
    const matchesSub = filterSubject === "all" || n.subject === filterSubject;
    const matchesClass = filterClass === "all" || n.className === filterClass;
    return matchesSearch && matchesSub && matchesClass;
  });

  const toggleBookmark = (id: number) => {
    setNotes((ns) =>
      ns.map((n) => (n.id === id ? { ...n, bookmarked: !n.bookmarked } : n)),
    );
    toast.success("Bookmark updated");
  };

  const submitNote = async () => {
    if (!newNote.title || !newNote.subject || !newNote.className) {
      return toast.error("Please fill in required fields");
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    const note: SampleNote = {
      id: Date.now(),
      title: newNote.title,
      uploaderName: "You",
      subject: newNote.subject,
      className: newNote.className,
      description: newNote.description,
      downloadLink: newNote.downloadLink || "#",
      votes: 0,
      bookmarked: false,
      userVote: null,
    };
    setNotes((ns) => [note, ...ns]);
    setSubmitting(false);
    setShowUpload(false);
    setNewNote({
      title: "",
      description: "",
      subject: "",
      className: "",
      downloadLink: "",
    });
    toast.success("Note uploaded successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl">Notes Library</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {filtered.length} notes available
          </p>
        </div>
        <Button
          onClick={() => setShowUpload(true)}
          data-ocid="notes.open_modal_button"
        >
          <Upload className="w-4 h-4 mr-1" />
          Upload Notes
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            className="pl-9 h-9"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            data-ocid="notes.search_input"
          />
        </div>
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-36 h-9" data-ocid="notes.select">
            <Filter className="w-3 h-3 mr-1" />
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
          <SelectTrigger className="w-32 h-9" data-ocid="notes.select">
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

      {/* Featured note */}
      {!localSearch && filterSubject === "all" && filterClass === "all" && (
        <div className="mb-6">
          {notes
            .filter((n) => n.featured)
            .map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-primary/40 bg-gradient-to-r from-primary/8 to-accent/8 overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured Note
                      </Badge>
                    </div>
                    <CardTitle className="font-display text-lg">
                      {n.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {n.description}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Uploaded by
                        </span>
                        <span className="font-medium">{n.uploaderName}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Class
                        </span>
                        <span className="font-medium">{n.className}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Subject
                        </span>
                        <span className="font-medium">{n.subject}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Votes
                        </span>
                        <span className="font-medium points-text">
                          {n.votes}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        asChild
                        size="sm"
                        data-ocid="notes.primary_button"
                      >
                        <a
                          href={n.downloadLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download Notes
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleBookmark(n.id)}
                        data-ocid="notes.toggle"
                      >
                        {n.bookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-primary" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>
      )}

      {/* Notes grid */}
      {filtered.filter(
        (n) =>
          !n.featured ||
          localSearch ||
          filterSubject !== "all" ||
          filterClass !== "all",
      ).length === 0 && filtered.filter((n) => n.featured).length > 0 ? null : (
        <>
          {filtered.filter(
            (n) =>
              !n.featured ||
              localSearch ||
              filterSubject !== "all" ||
              filterClass !== "all",
          ).length === 0 ? (
            <div className="text-center py-16" data-ocid="notes.empty_state">
              <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">
                No notes found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered
                .filter(
                  (n) =>
                    !n.featured ||
                    localSearch ||
                    filterSubject !== "all" ||
                    filterClass !== "all",
                )
                .map((n, idx) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    data-ocid={`notes.item.${idx + 1}`}
                  >
                    <Card className="card-hover h-full border-border/60 flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  subjectColors[n.subject] ||
                                  "bg-muted text-muted-foreground"
                                }`}
                              >
                                {n.subject}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {n.className}
                              </Badge>
                            </div>
                            <CardTitle className="font-display text-sm leading-snug line-clamp-2">
                              {n.title}
                            </CardTitle>
                          </div>
                          <VoteButtons
                            votes={n.votes}
                            userVote={n.userVote}
                            onVote={() => {}}
                            layout="vertical"
                            ocidPrefix="notes.vote"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 flex flex-col flex-1">
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
                          {n.description}
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          by{" "}
                          <span className="font-medium text-foreground">
                            {n.uploaderName}
                          </span>
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            data-ocid="notes.button"
                          >
                            <a
                              href={n.downloadLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </a>
                          </Button>
                          <button
                            type="button"
                            onClick={() => toggleBookmark(n.id)}
                            className="text-muted-foreground hover:text-primary transition-colors p-1.5"
                            data-ocid="notes.toggle"
                          >
                            {n.bookmarked ? (
                              <BookmarkCheck className="w-4 h-4 text-primary" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setReportOpen(true)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1.5"
                            data-ocid="notes.button"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          )}
        </>
      )}

      {/* Upload Modal */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="sm:max-w-md" data-ocid="notes.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">Upload Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium">Title *</Label>
              <Input
                placeholder="e.g. Class 10 Science Complete Notes"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote((n) => ({ ...n, title: e.target.value }))
                }
                className="mt-1"
                data-ocid="notes.input"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                placeholder="Describe what's in the notes..."
                value={newNote.description}
                onChange={(e) =>
                  setNewNote((n) => ({ ...n, description: e.target.value }))
                }
                rows={3}
                className="mt-1"
                data-ocid="notes.textarea"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium">Subject *</Label>
                <Select
                  value={newNote.subject}
                  onValueChange={(v) =>
                    setNewNote((n) => ({ ...n, subject: v }))
                  }
                >
                  <SelectTrigger className="mt-1" data-ocid="notes.select">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Class *</Label>
                <Select
                  value={newNote.className}
                  onValueChange={(v) =>
                    setNewNote((n) => ({ ...n, className: v }))
                  }
                >
                  <SelectTrigger className="mt-1" data-ocid="notes.select">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Download Link</Label>
              <Input
                placeholder="https://drive.google.com/..."
                value={newNote.downloadLink}
                onChange={(e) =>
                  setNewNote((n) => ({ ...n, downloadLink: e.target.value }))
                }
                className="mt-1"
                data-ocid="notes.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpload(false)}
              data-ocid="notes.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={submitNote}
              disabled={submitting}
              data-ocid="notes.submit_button"
            >
              {submitting ? "Uploading..." : "Upload Notes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        entityType="note"
      />
    </div>
  );
}
