import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface LocationState {
  email?: string;
  pendingApproval?: boolean;
}

const ThankYou = () => {
  const location = useLocation();
  const state = location.state as LocationState || {};
  const { email, pendingApproval } = state;

  return (
    <>
      <Header />
      <main className="container max-w-5xl py-12 px-4">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="flex justify-center">
            <CheckCircle2 className="w-20 h-20 text-primary" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold">Thank You!</h1>

          {pendingApproval ? (
            <>
              <p className="text-xl">
                Your registration request has been submitted and is now pending admin approval.
              </p>
              <div className="bg-muted p-6 rounded-lg text-left">
                <h2 className="font-semibold text-lg mb-2">What happens next?</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Our admin team will review your profile.</li>
                  <li>You'll receive an email when your account is approved.</li>
                  <li>Once approved, you can sign in with the email and password you provided.</li>
                </ul>
              </div>
              {email && (
                <p className="text-muted-foreground">
                  We'll send a confirmation to: <span className="font-medium">{email}</span>
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-xl">
                Your registration is complete. We’re thrilled you’re interested in joining our community!
              </p>
              <div className="bg-muted p-6 rounded-lg text-left space-y-4">
                <h2 className="font-semibold text-lg">What happens next?</h2>
                <p>
                  GoPlayNow is currently invitation-only as we launch city by city.
                  We’ll send your invitation as soon as the service becomes available in your area.
                </p>
              </div>
              {email && (
                <p className="text-muted-foreground">
                  We’ll send the invitation to: <span className="font-medium">{email}</span>
                </p>
              )}
              <p className="text-muted-foreground pt-2">
                In the meantime, stay tuned—we’re working hard to bring GoPlayNow to more families like yours!
              </p>
            </>
          )}

          <div className="pt-4">
            <Link to="/">
              <Button size="lg">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default ThankYou;
