
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

interface PlaydateScheduleProps {
  playdate: {
    start_time: string;
    end_time: string;
    max_participants?: number;
  };
  participantsCount: number;
  isCompleted?: boolean;
}

export const PlaydateSchedule: React.FC<PlaydateScheduleProps> = ({ 
  playdate, 
  participantsCount,
  isCompleted = false
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          When
        </CardTitle>
        {isCompleted && (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            Completed
          </Badge>
        )}
      </CardHeader>
      <CardContent className="text-sm">
        <p><b>Date:</b> {format(new Date(playdate.start_time), 'PPP')}</p>
        <p><b>Time:</b> {format(new Date(playdate.start_time), 'p')} – {format(new Date(playdate.end_time), 'p')}</p>
        {playdate.max_participants && (
          <p><b>Capacity:</b> {participantsCount} / {playdate.max_participants}</p>
        )}
      </CardContent>
    </Card>
  );
};
