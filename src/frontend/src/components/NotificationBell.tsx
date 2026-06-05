import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell } from "lucide-react";
import { useState } from "react";

export function NotificationBell() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-xl"
          aria-label="Open notifications"
          data-ocid="notifications.open_modal_button"
        >
          <Bell className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-4"
        align="end"
        data-ocid="notifications.popover"
      >
        <p className="text-sm text-muted-foreground">No notifications.</p>
      </PopoverContent>
    </Popover>
  );
}
