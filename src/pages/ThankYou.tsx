
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ThankYou = () => {
  const location = useLocation();
  const email = location.state?.email;
  
  // If no email in state, redirect to home
  if (!email) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-soft border border-muted p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Thank You for Your Interest!</h1>
        
        <p className="text-muted-foreground mb-6">
          We're thrilled to have you on board.
          We'll reach out to <span className="font-medium text-foreground">{email}</span> as 
          soon as GoPlayNow is available in your area.
        </p>
        
        <Button asChild className="w-full">
          <Link to="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  );
};

export default ThankYou;
