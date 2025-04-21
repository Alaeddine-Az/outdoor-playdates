
import React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface RemoveParticipantDialogProps {
  open: boolean;
  childName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const RemoveParticipantDialog: React.FC<RemoveParticipantDialogProps> = ({
  open,
  childName,
  onConfirm,
  onCancel,
  loading,
}) => (
  <AlertDialog open={open} onOpenChange={open => { if (!open) onCancel(); }}>
    {/* We don't want to trigger via a button here, but open imperatively */}
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Remove {childName} from playdate?
        </AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to remove <span className="font-semibold">{childName}</span> from this playdate? This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Removing..." : "Remove"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
