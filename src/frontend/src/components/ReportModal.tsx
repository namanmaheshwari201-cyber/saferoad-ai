import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Flag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  entityType: "question" | "answer" | "note";
}

const REPORT_REASONS = [
  "Incorrect information",
  "Spam or irrelevant content",
  "Inappropriate language",
  "Duplicate content",
  "Other",
];

export default function ReportModal({
  open,
  onClose,
  entityType,
}: ReportModalProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) return toast.error("Please select a reason");
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    toast.success("Report submitted. Our team will review it.");
    setReason("");
    setDetails("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-ocid="report.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-destructive" />
            Report {entityType}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Reason for report
            </Label>
            <RadioGroup
              value={reason}
              onValueChange={setReason}
              data-ocid="report.radio"
            >
              {REPORT_REASONS.map((r) => (
                <div key={r} className="flex items-center gap-2">
                  <RadioGroupItem value={r} id={r} />
                  <Label htmlFor={r} className="text-sm cursor-pointer">
                    {r}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label className="text-sm font-medium mb-1 block">
              Additional details (optional)
            </Label>
            <Textarea
              placeholder="Describe the issue..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              data-ocid="report.textarea"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="report.cancel_button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={submitting || !reason}
            data-ocid="report.submit_button"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
