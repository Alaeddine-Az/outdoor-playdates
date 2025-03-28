
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Calendar } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-yellow-100 p-5">
            <div className="text-4xl">😕</div>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={goBack}
            className="flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> 
            Go Back
          </Button>
          
          {user ? (
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          )}
          
          {user && (
            <Button 
              variant="outline" 
              onClick={() => navigate('/events')}
              className="flex items-center justify-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Browse Events
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
