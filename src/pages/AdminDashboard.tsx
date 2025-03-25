
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

interface EarlySignup {
  id: string;
  email: string;
  parent_name: string;
  location: string;
  children: any[];
  interests: string[];
  status: 'pending' | 'approved' | 'rejected' | 'converted';
  created_at: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
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
        const { data, error } = await supabase
          .from('early_signups')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPendingSignups(data || []);
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
    try {
      const { error } = await supabase
        .from('early_signups')
        .update({ status: 'approved' })
        .eq('id', signupId);

      if (error) throw error;

      setPendingSignups(prevSignups => 
        prevSignups.filter(signup => signup.id !== signupId)
      );

      toast({
        title: 'Signup approved',
        description: 'The user can now register with their email.',
      });
    } catch (error) {
      console.error('Error approving signup:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve signup.',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (signupId: string) => {
    try {
      const { error } = await supabase
        .from('early_signups')
        .update({ status: 'rejected' })
        .eq('id', signupId);

      if (error) throw error;

      setPendingSignups(prevSignups => 
        prevSignups.filter(signup => signup.id !== signupId)
      );

      toast({
        title: 'Signup rejected',
        description: 'The signup request has been rejected.',
      });
    } catch (error) {
      console.error('Error rejecting signup:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject signup.',
        variant: 'destructive',
      });
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
                      <p><span className="font-medium">Location:</span> {signup.location}</p>
                      <p><span className="font-medium">Children:</span> {signup.children?.length || 0}</p>
                      <p><span className="font-medium">Interests:</span> {signup.interests?.join(', ')}</p>
                      <p><span className="font-medium">Signed up:</span> {new Date(signup.created_at).toLocaleDateString()}</p>
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
