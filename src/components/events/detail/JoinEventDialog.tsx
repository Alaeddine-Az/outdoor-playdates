
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

interface JoinEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userChildren: any[];
  selectedChildren: Record<string, boolean>;
  onSelectionChange: (childId: string, checked: boolean) => void;
  onSubmit: () => void;
  joining: boolean;
  eventTitle: string;
}

export const JoinEventDialog = ({
  open,
  onOpenChange,
  userChildren,
  selectedChildren,
  onSelectionChange,
  onSubmit,
  joining,
  eventTitle
}: JoinEventDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join {eventTitle}</DialogTitle>
          <DialogDescription>
            Select which of your children will attend this event.
          </DialogDescription>
        </DialogHeader>
        
        {userChildren.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-muted-foreground mb-2">
              You need to add children to your profile first.
            </p>
            <Button asChild className="mt-2">
              <Link to="/add-child">Add Child</Link>
            </Button>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            {userChildren.map((child) => (
              <div key={child.id} className="flex items-start space-x-3">
                <Checkbox
                  id={child.id}
                  checked={!!selectedChildren[child.id]}
                  onCheckedChange={(checked) => {
                    onSelectionChange(child.id, !!checked);
                  }}
                />
                <div className="space-y-1">
                  <Label
                    htmlFor={child.id}
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {child.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {child.age} years old
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={joining || userChildren.length === 0 || Object.values(selectedChildren).every(selected => !selected)}
            className="button-glow bg-primary hover:bg-primary/90 text-white"
          >
            {joining ? 'Joining...' : 'Join Event'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
