
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { useAdminFunctions } from '@/hooks/useAdminFunctions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Json } from '@/integrations/supabase/types';

interface EarlySignup {
  id: string;
  email: string;
  parent_name: string;
  location: string | null;
  children: Json[] | null;
  interests: string[] | null;
  status: 'pending' | 'approved' | 'rejected' | 'converted';
  created_at: string | null;
  invited_at: string | null;
  child_age?: string | null;
  child_name?: string | null;
  converted_at?: string | null;
  converted_user_id?: string | null;
  referrer?: string | null;
  updated_at?: string | null;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { approvePendingSignup, rejectPendingSignup } = useAdminFunctions();
  const [loading, setLoading] = useState(true);
  const [pendingSignups, setPendingSignups] = useState<EarlySignup[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;

      try {
        // Check if user is admin
        if (user.email === 'admin') {
          setIsAdmin(true);
        } else {
          const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });
          if (error) throw error;
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdmin();
  }, [user]);

  useEffect(() => {
    const fetchPendingSignups = async () => {
      if (!isAdmin) return;

      setLoading(true);
      try {
        // Fetch pending signups
        const { data, error } = await supabase.rpc('get_pending_early_signups');

        if (error) throw error;
        
        // Cast the data to ensure type compatibility
        const typedData = (data || []).map(signup => ({
          ...signup,
          status: signup.status as 'pending' | 'approved' | 'rejected' | 'converted'
        }));
        
        setPendingSignups(typedData);
      } catch (error) {
        console.error('Error fetching pending signups:', error);
        toast({
          title: 'Error loading signups',
          description: 'Failed to load pending approval requests.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchPendingSignups();
    }
  }, [isAdmin]);

  const handleApprove = async (signupId: string) => {
    const result = await approvePendingSignup(signupId);
    if (result.success) {
      setPendingSignups(prevSignups => 
        prevSignups.filter(signup => signup.id !== signupId)
      );
    }
  };

  const handleReject = async (signupId: string) => {
    const result = await rejectPendingSignup(signupId);
    if (result.success) {
      setPendingSignups(prevSignups => 
        prevSignups.filter(signup => signup.id !== signupId)
      );
    }
  };

  // Redirect if not admin
  if (user && !isAdmin && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect if not logged in
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <Header />
      <main className="container max-w-6xl py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pending Approval Requests</h2>
          
          {loading ? (
            <p>Loading requests...</p>
          ) : pendingSignups.length === 0 ? (
            <p className="text-muted-foreground">No pending approval requests.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingSignups.map((signup) => (
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
                      onClick={() => handleReject(signup.id)}
                    >
                      Reject
                    </Button>
                    <Button 
                      onClick={() => handleApprove(signup.id)}
                    >
                      Approve
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default AdminDashboard;
