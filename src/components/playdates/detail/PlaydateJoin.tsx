
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface PlaydateJoinProps {
  userChildren: any[];
  isJoining: boolean;
  onJoin: (selectedChildIds: string[]) => void;
}

export const PlaydateJoin: React.FC<PlaydateJoinProps> = ({ userChildren, isJoining, onJoin }) => {
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
                    checked={selectedChildIds.includes(child.id)}
                    onCheckedChange={() => handleChildSelection(child.id)}
                  />
                  <span>{child.name} ({child.age})</span>
                </div>
              ))}
            </div>
            <Button
              className="w-full"
              disabled={isJoining || selectedChildIds.length === 0}
              onClick={handleJoin}
            >
              {isJoining ? 'Joining...' : 'Join'}
            </Button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">You need to add children first.</p>
        )}
      </CardContent>
    </Card>
  );
};
