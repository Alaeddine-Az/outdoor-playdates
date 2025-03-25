
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EarlySignup } from '@/types/admin';

interface SignupCardGridProps {
  signups: EarlySignup[];
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

const SignupCardGrid: React.FC<SignupCardGridProps> = ({ 
  signups,
  onApprove,
  onReject
}) => {
  if (signups.length === 0) {
    return <p className="text-muted-foreground">No pending approval requests.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {signups.map((signup) => (
        <Card key={signup.id}>
          <CardHeader>
            <CardTitle>{signup.parent_name}</CardTitle>
            <CardDescription>{signup.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-medium">Location:</span> {signup.location || 'Not specified'}</p>
              <p><span className="font-medium">Children:</span> {signup.children?.length || 0}</p>
              <p><span className="font-medium">Interests:</span> {signup.interests?.join(', ') || 'Not specified'}</p>
              <p><span className="font-medium">Signed up:</span> {signup.created_at ? new Date(signup.created_at).toLocaleDateString() : 'Unknown'}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => onReject(signup.id)}
            >
              Reject
            </Button>
            <Button 
              onClick={() => onApprove(signup.id)}
            >
              Approve
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SignupCardGrid;
