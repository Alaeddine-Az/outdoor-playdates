
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const CreateAdmin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ message?: string; userId?: string; email?: string; error?: string } | null>(null);

  const handleCreateAdmin = async () => {
    try {
      setLoading(true);
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('create-admin', {
        method: 'POST'
      });

      if (error) throw error;
      
      setResult(data);
      
      // Show success message
      toast({
        title: data.message,
        description: `Admin account for ${data.email} is ready to use.`,
      });
    } catch (error) {
      console.error('Error creating admin:', error);
      setResult({ error: error.message });
      
      toast({
        title: 'Failed to create admin',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create Admin User</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Admin Creation</CardTitle>
          <CardDescription>
            Create a predefined admin user with email: Alaeddine.azaiez@gmail.com
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This will create an admin user account with preset credentials. 
            The password will be: @1234admin
          </p>
          
          {result && (
            <div className={`p-4 rounded-md ${result.error ? 'bg-destructive/20' : 'bg-green-100'} mb-4`}>
              <p className="font-medium">{result.message || result.error}</p>
              {result.email && <p className="text-sm">Email: {result.email}</p>}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleCreateAdmin}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Admin...
              </>
            ) : (
              'Create Admin User'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateAdmin;
