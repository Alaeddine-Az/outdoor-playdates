
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';

interface PlaydateJoinProps {
  userChildren: any[];
  isJoining: boolean;
  onJoin: (selectedChildIds: string[]) => Promise<void>;
  isCompleted?: boolean;
  isCanceled?: boolean;
  alreadyJoined?: string[]; // IDs of children already joined
}

export const PlaydateJoin: React.FC<PlaydateJoinProps> = ({ 
  userChildren, 
  isJoining, 
  onJoin, 
  isCompleted = false,
  isCanceled = false,
  alreadyJoined = []
}) => {
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);

  const handleChildSelection = (childId: string) => {
    setSelectedChildIds(prev =>
      prev.includes(childId)
        ? prev.filter(id => id !== childId)
        : [...prev, childId]
    );
  };

  const handleJoin = async () => {
    if (selectedChildIds.length === 0) {
      toast({
        title: 'Selection required',
        description: 'Please select at least one child to join the playdate',
        variant: 'destructive'
      });
      return;
    }
    
    await onJoin(selectedChildIds);
    // Clear selection after joining
    setSelectedChildIds([]);
  };

  const isDisabled = isJoining || selectedChildIds.length === 0 || isCompleted || isCanceled;
  
  let buttonText = isJoining ? 'Joining...' : 'Join';
  let helperText = '';
  
  if (isCompleted) {
    buttonText = 'Playdate Completed';
    helperText = 'This playdate has already ended.';
  } else if (isCanceled) {
    buttonText = 'Playdate Canceled';
    helperText = 'This playdate has been canceled.';
  }

  // Filter out children that are already participating
  const availableChildren = userChildren.filter(child => !alreadyJoined.includes(child.id));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join this Playdate</CardTitle>
      </CardHeader>
      <CardContent>
        {availableChildren.length > 0 ? (
          <>
            <div className="mb-4 space-y-2">
              {availableChildren.map(child => (
                <div key={child.id} className="flex items-center space-x-2">
                  <Checkbox
                    disabled={isCompleted || isCanceled}
                    checked={selectedChildIds.includes(child.id)}
                    onCheckedChange={() => handleChildSelection(child.id)}
                  />
                  <span>{child.name} ({child.age})</span>
                </div>
              ))}
            </div>
            {helperText && (
              <p className="text-sm text-muted-foreground mb-2">{helperText}</p>
            )}
            <Button
              className="w-full"
              disabled={isDisabled}
              onClick={handleJoin}
            >
              {buttonText}
            </Button>
          </>
        ) : userChildren.length > 0 && alreadyJoined.length === userChildren.length ? (
          <p className="text-sm text-muted-foreground">All your children are already participating in this playdate.</p>
        ) : (
          <p className="text-sm text-muted-foreground">You need to add children first.</p>
        )}
      </CardContent>
    </Card>
  );
};
