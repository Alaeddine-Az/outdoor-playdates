import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Check, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ParentProfile, ChildProfile, PlaydateParticipant } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Playdate {
  id: string;
  title: string;
  description: string | null;
  location: string;
  start_time: string;
  end_time: string;
  max_participants: number | null;
  creator_id: string;
  created_at: string;
  updated_at: string;
}

interface EnrichedParticipant extends PlaydateParticipant {
  parent_id: string;
}

const PlaydateDetailPage = () => {
  // ... your existing logic remains unchanged

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="h-8 w-32 bg-muted animate-pulse rounded mb-4"></div>
        <div className="h-64 w-full bg-muted animate-pulse rounded mb-6"></div>
        <div className="h-32 w-full bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  if (!playdate || !creator) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Playdate Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The playdate you're looking for could not be found or has been cancelled.
        </p>
        <Button onClick={() => navigate('/playdates')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Playdates
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      {/* Full playdate content goes here. Keep your JSX as-is from the previous structure. */}
    </div>
  );
};

export default PlaydateDetailPage;
