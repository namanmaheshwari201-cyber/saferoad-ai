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
import { Plus, Search, UserMinus, UserPlus, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  CLASSES,
  SUBJECTS,
  type SampleGroup,
  sampleGroups,
} from "../data/sampleData";

export default function StudyGroupsPage() {
  const [groups, setGroups] = useState<SampleGroup[]>(sampleGroups);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    subject: "",
    className: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const filtered = groups.filter((g) => {
    const q = search.toLowerCase();
    return (
      !q ||
      g.name.toLowerCase().includes(q) ||
      g.subject.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q)
    );
  });

  const toggleJoin = (id: number) => {
    setGroups((gs) =>
      gs.map((g) => {
        if (g.id !== id) return g;
        const joined = !g.joined;
        toast.success(joined ? `Joined "${g.name}"!` : `Left "${g.name}"`);
        return { ...g, joined, members: g.members + (joined ? 1 : -1) };
      }),
    );
  };

  const createGroup = async () => {
    if (!newGroup.name || !newGroup.subject || !newGroup.className) {
      return toast.error("Please fill in required fields");
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    const group: SampleGroup = {
      id: Date.now(),
      name: newGroup.name,
      subject: newGroup.subject,
      className: newGroup.className,
      description: newGroup.description,
      members: 1,
      joined: true,
      creator: "You",
    };
    setGroups((gs) => [group, ...gs]);
    setSubmitting(false);
    setShowCreate(false);
    setNewGroup({ name: "", subject: "", className: "", description: "" });
    toast.success("Study group created!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl">Study Groups</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Join or create groups to study together
          </p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          data-ocid="groups.open_modal_button"
        >
          <Plus className="w-4 h-4 mr-1" />
          Create Group
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search groups..."
          className="pl-9 h-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-ocid="groups.search_input"
        />
      </div>

      {/* Joined groups */}
      {groups.filter((g) => g.joined).length > 0 && !search && (
        <div className="mb-8">
          <h2 className="font-display font-semibold text-base mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            My Groups
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups
              .filter((g) => g.joined)
              .map((g, idx) => (
                <GroupCard
                  key={g.id}
                  group={g}
                  idx={idx}
                  onToggle={toggleJoin}
                />
              ))}
          </div>
        </div>
      )}

      {/* All groups */}
      <div>
        {!search && (
          <h2 className="font-display font-semibold text-base mb-3">
            All Groups
          </h2>
        )}
        {filtered.length === 0 ? (
          <div className="text-center py-16" data-ocid="groups.empty_state">
            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No groups found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((g, idx) => (
              <GroupCard key={g.id} group={g} idx={idx} onToggle={toggleJoin} />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md" data-ocid="groups.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              Create Study Group
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium">Group Name *</Label>
              <Input
                placeholder="e.g. Maths Masters"
                value={newGroup.name}
                onChange={(e) =>
                  setNewGroup((g) => ({ ...g, name: e.target.value }))
                }
                className="mt-1"
                data-ocid="groups.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium">Subject *</Label>
                <Select
                  value={newGroup.subject}
                  onValueChange={(v) =>
                    setNewGroup((g) => ({ ...g, subject: v }))
                  }
                >
                  <SelectTrigger className="mt-1" data-ocid="groups.select">
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
                  value={newGroup.className}
                  onValueChange={(v) =>
                    setNewGroup((g) => ({ ...g, className: v }))
                  }
                >
                  <SelectTrigger className="mt-1" data-ocid="groups.select">
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
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                placeholder="What will you study together?"
                value={newGroup.description}
                onChange={(e) =>
                  setNewGroup((g) => ({ ...g, description: e.target.value }))
                }
                rows={3}
                className="mt-1"
                data-ocid="groups.textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreate(false)}
              data-ocid="groups.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={createGroup}
              disabled={submitting}
              data-ocid="groups.submit_button"
            >
              {submitting ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function GroupCard({
  group,
  idx,
  onToggle,
}: {
  group: SampleGroup;
  idx: number;
  onToggle: (id: number) => void;
}) {
  const subjectColors: Record<string, string> = {
    Maths: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    Science: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    Physics: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    Chemistry: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    English: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    default: "bg-muted text-muted-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07 }}
      data-ocid={`groups.item.${idx + 1}`}
    >
      <Card className="card-hover h-full border-border/60 flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            {group.joined && (
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                Joined
              </Badge>
            )}
          </div>
          <CardTitle className="font-display text-base mt-2">
            {group.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex flex-col flex-1">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${subjectColors[group.subject] || subjectColors.default}`}
            >
              {group.subject}
            </span>
            <Badge variant="outline" className="text-xs">
              {group.className}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
            {group.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              {group.members} members
            </div>
            <Button
              size="sm"
              variant={group.joined ? "outline" : "default"}
              className="text-xs h-7"
              onClick={() => onToggle(group.id)}
              data-ocid={
                group.joined ? "groups.delete_button" : "groups.primary_button"
              }
            >
              {group.joined ? (
                <>
                  <UserMinus className="w-3 h-3 mr-1" />
                  Leave
                </>
              ) : (
                <>
                  <UserPlus className="w-3 h-3 mr-1" />
                  Join
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
