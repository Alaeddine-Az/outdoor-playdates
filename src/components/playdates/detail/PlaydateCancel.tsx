
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PlaydateCancelProps {
  playdateId: string;
  onCanceled: () => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

export const PlaydateCancel: React.FC<PlaydateCancelProps> = ({ 
  playdateId,
  onCanceled,
  isProcessing,
  setIsProcessing
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCancel = async () => {
    if (isProcessing || !playdateId) return;
    
    setIsProcessing(true);
    try {
      // Update the playdate status to 'cancelled' (with British spelling)
      // This is one of the allowed values in the playdates_status_check constraint
      const { error: playdateError } = await supabase
        .from('playdates')
        .update({ status: 'cancelled' })
        .eq('id', playdateId);
      
      if (playdateError) throw playdateError;
      
      // Also update all participants' status to 'canceled'
      const { error: participantsError } = await supabase
        .from('playdate_participants')
        .update({ status: 'canceled' })
        .eq('playdate_id', playdateId);
      
      if (participantsError) throw participantsError;
      
      toast({
        title: 'Playdate canceled',
        description: 'The playdate has been canceled successfully.',
      });
      
      onCanceled();
      setIsOpen(false);
    } catch (err: any) {
      console.error('Failed to cancel playdate:', err);
      toast({
        title: 'Error',
        description: err.message || 'Could not cancel the playdate.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isProcessing}>
          <Trash2 className="h-4 w-4 mr-2" />
          {isProcessing ? 'Processing...' : 'Cancel Playdate'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Playdate</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel this playdate? This action will notify all participants and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Go Back</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Yes, Cancel Playdate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
