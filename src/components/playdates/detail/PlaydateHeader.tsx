
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { PlaydateHost } from './PlaydateHost';
import { PlaydateInfo } from './PlaydateInfo';
import { PlaydateEdit } from './PlaydateEdit';
import { PlaydateCancel } from './PlaydateCancel';

interface PlaydateHeaderProps {
  playdate: any;
  creator: any;
  isCreator: boolean;
  isCanceled: boolean;
  isCompleted: boolean;
  isUpdating: boolean;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  onUpdate: (values: any) => void;
  onCanceled: () => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  form: any;
  playdateId: string;
}

export const PlaydateHeader: React.FC<PlaydateHeaderProps> = ({
  playdate,
  creator,
  isCreator,
  isCanceled,
  isCompleted,
  isUpdating,
  isEditDialogOpen,
  setIsEditDialogOpen,
  onUpdate,
  onCanceled,
  isProcessing,
  setIsProcessing,
  form,
  playdateId
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Button variant="ghost" onClick={() => navigate('/playdates')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Playdates
      </Button>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{playdate?.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PlaydateHost creator={creator} />
          <PlaydateInfo playdate={playdate} />
          {isCreator && !isCanceled && !isCompleted && (
            <div className="flex gap-2">
              <PlaydateEdit
                playdate={playdate}
                isUpdating={isUpdating}
                isEditDialogOpen={isEditDialogOpen}
                setIsEditDialogOpen={setIsEditDialogOpen}
                onUpdate={onUpdate}
                form={form}
              />
              <PlaydateCancel
                playdateId={playdateId}
                onCanceled={onCanceled}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
