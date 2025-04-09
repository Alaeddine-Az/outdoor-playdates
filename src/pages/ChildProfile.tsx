
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useChildProfile } from '@/hooks/useChildProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ChildProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { child, loading, error } = useChildProfile(id || '');

  // Improved back navigation
  const handleGoBack = () => {
    // If there's history, go back
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      // If no history, go to dashboard as a safe fallback
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="container py-6 space-y-6">
        <Button variant="ghost" className="flex items-center gap-2 mb-4">
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-80" /></CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center">
              <Skeleton className="h-12 w-12 rounded-full mr-4" />
              <div>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32 mt-2" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-6 space-y-6">
        <Button variant="ghost" className="flex items-center gap-2 mb-4" onClick={handleGoBack}>
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        <div className="text-red-500">Error loading child profile: {error}</div>
      </div>
    );
  }

  if (!child || !child.id) {
    return (
      <div className="container py-6 space-y-6">
        <Button variant="ghost" className="flex items-center gap-2 mb-4" onClick={handleGoBack}>
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        <div>Child profile not found.</div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <Button 
        variant="ghost" 
        className="flex items-center gap-2 mb-4" 
        onClick={handleGoBack}
      >
        <ChevronLeft className="h-4 w-4" /> Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>{child.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mr-4">
              {child.name.charAt(0)}
            </div>
            <div>
              <div>{child.name}, {child.age} years old</div>
              <div className="text-sm text-muted-foreground">
                {child.bio || 'No bio available.'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChildProfile;
