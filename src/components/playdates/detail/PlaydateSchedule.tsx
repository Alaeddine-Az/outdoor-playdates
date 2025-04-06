
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlaydateScheduleProps {
  playdate: {
    start_time: string;
    end_time: string;
    max_participants?: number;
  };
  participantsCount: number;
}

export const PlaydateSchedule: React.FC<PlaydateScheduleProps> = ({ playdate, participantsCount }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>When</CardTitle>
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
