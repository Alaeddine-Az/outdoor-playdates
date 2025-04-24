import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/playdates');
    }
  };

  return (
    <>
      <Button variant="ghost" onClick={handleBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
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
