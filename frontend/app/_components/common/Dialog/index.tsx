import { Dispatch, ReactNode, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface ActionDialogProps {
  triggerTitle: string;
  dialogTitle: string;
  description?: string;
  disabled: boolean;
  open: boolean;
  onSubmit: (data: any) => void;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

function getDialogSizeClass(size: "sm" | "md" | "lg") {
  switch (size) {
    case "sm":
      return "max-w-[320px]";
    case "md":
      return "max-w-[425px]";
    case "lg":
      return "max-w-[640px]";
    default:
      return "max-w-[425px]";
  }
}

export function ActionDialog({
  triggerTitle,
  dialogTitle,
  open = false,
  onSubmit,
  onOpenChange,
  disabled = false,
  size = "md",
  description = "",
  children,
}: ActionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerTitle}</Button>
      </DialogTrigger>
      <DialogContent className={getDialogSizeClass(size)}>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-4 py-4">{children}</div>
        <DialogFooter>
          <Button disabled={disabled} type="submit" onClick={onSubmit}>
            submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
