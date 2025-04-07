
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface PlaydateJoinProps {
  userChildren: any[];
  isJoining: boolean;
  onJoin: (selectedChildIds: string[]) => void;
  isCompleted?: boolean;
  isCanceled?: boolean;
}

export const PlaydateJoin: React.FC<PlaydateJoinProps> = ({ 
  userChildren, 
  isJoining, 
  onJoin, 
  isCompleted = false,
  isCanceled = false 
}) => {
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);

  const handleChildSelection = (childId: string) => {
    setSelectedChildIds(prev =>
      prev.includes(childId)
        ? prev.filter(id => id !== childId)
        : [...prev, childId]
    );
  };

  const handleJoin = () => {
    onJoin(selectedChildIds);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join this Playdate</CardTitle>
      </CardHeader>
      <CardContent>
        {userChildren.length > 0 ? (
          <>
            <div className="mb-4 space-y-2">
              {userChildren.map(child => (
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
        ) : (
          <p className="text-sm text-muted-foreground">You need to add children first.</p>
        )}
      </CardContent>
    </Card>
  );
};
