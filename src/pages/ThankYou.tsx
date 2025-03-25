
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { CheckCircle, Home, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const ThankYou = () => {
  const location = useLocation();
  const email = location.state?.email;
  
  // If no email in state, redirect to home
  if (!email) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center pb-2">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Thank You for Joining!</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Your GoPlayNow account has been created successfully.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p>
            We're excited to have you on board. We'll reach out to <span className="font-medium text-foreground">{email}</span> as 
            soon as GoPlayNow is fully launched in your area.
          </p>
          
          <div className="bg-muted/50 rounded-lg p-4 mt-4 text-sm">
            <p className="font-medium mb-2">What happens next?</p>
            <ol className="text-left space-y-2 list-decimal pl-5">
              <li>We'll send you an email confirmation</li>
              <li>You'll be among the first to know when we launch</li>
              <li>You'll receive exclusive early access to premium features</li>
            </ol>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-3 pt-2">
          <Button asChild className="w-full">
            <Link to="/" className="flex items-center justify-center">
              <Home className="mr-2 h-4 w-4" /> Return to Homepage
            </Link>
          </Button>
          
          <div className="text-xs text-center text-muted-foreground">
            Have questions? <a href="mailto:support@goplaynow.com" className="text-primary underline">Contact our support team</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ThankYou;
