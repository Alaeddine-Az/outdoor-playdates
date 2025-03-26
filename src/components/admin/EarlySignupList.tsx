
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { EarlySignup } from '@/types/admin';
import { Calendar, Mail, Phone, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface EarlySignupListProps {
  signups: EarlySignup[];
  onApprove: (signupId: string) => void;
  onReject: (signupId: string) => void;
  onCreateAccount: (signup: EarlySignup) => void;
  loading: boolean;
}

const EarlySignupList: React.FC<EarlySignupListProps> = ({ 
  signups, 
  onApprove, 
  onReject,
  onCreateAccount,
  loading 
}) => {
  const { toast } = useToast();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (signups.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No pending signups</h3>
            <p className="text-muted-foreground">
              When users sign up through the onboarding form, they'll appear here for review.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Early Access Signups</CardTitle>
        <CardDescription>
          Review and manage users who have requested early access
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parent</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Children</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {signups.map((signup) => {
              const childrenInfo = Array.isArray(signup.children) 
                ? signup.children.map((child: any) => `${child.name} (${child.age})`).join(", ")
                : "";
              
              const contactInfo = (
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4" />
                    <span>{signup.email}</span>
                  </div>
                  {signup.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="mr-2 h-4 w-4" />
                      <span>{signup.phone}</span>
                    </div>
                  )}
                </div>
              );
              
              const submittedDate = signup.created_at 
                ? formatDistanceToNow(new Date(signup.created_at), { addSuffix: true })
                : "Unknown";
                
              return (
                <TableRow key={signup.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{signup.parent_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{contactInfo}</TableCell>
                  <TableCell>{childrenInfo}</TableCell>
                  <TableCell>{signup.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>{submittedDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      signup.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : signup.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : signup.status === 'converted'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {signup.status.charAt(0).toUpperCase() + signup.status.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {signup.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => onApprove(signup.id)}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => onReject(signup.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {signup.status === 'approved' && (
                        <Button 
                          size="sm"
                          onClick={() => onCreateAccount(signup)}
                        >
                          Create Account
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EarlySignupList;
