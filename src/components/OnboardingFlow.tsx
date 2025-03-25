
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Import components
import ProgressIndicator from './onboarding/ProgressIndicator';
import AccountCreationStep from './onboarding/AccountCreationStep';
import ParentProfileStep from './onboarding/ParentProfileStep';
import ChildProfileStep, { ChildInfo } from './onboarding/ChildProfileStep';
import InterestsStep from './onboarding/InterestsStep';

const OnboardingFlow = ({ id }: { id?: string }) => {
  const navigate = useNavigate();
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [parentName, setParentName] = useState('');
  const [location, setLocation] = useState('');
  const [referrer, setReferrer] = useState('');
  const [children, setChildren] = useState<ChildInfo[]>([{ name: '', age: '' }]);
  const [interests, setInterests] = useState<string[]>([]);
  
  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteSetup = async () => {
    if (!email || !parentName || children.length === 0 || interests.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please complete all required fields before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First attempt to sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      // Prepare the data for early_signups table
      const signupData = {
        email,
        parent_name: parentName,
        location,
        referrer: referrer || null,
        interests,
        children: children,
      };

      // Save to early_signups
      const { error: signupError } = await supabase
        .from('early_signups')
        .upsert({
          ...signupData
        }, {
          onConflict: 'email'
        });

      if (signupError) {
        console.error('Error saving early signup data:', signupError);
        toast({
          title: 'Signup Error',
          description: 'There was an error saving your information. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Always redirect to thank you page
      navigate('/thank-you', { state: { email } });

    } catch (err: any) {
      console.error('Signup error:', err);
      toast({
        title: 'Signup Error',
        description: err.message || 'There was an error creating your account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section 
      id={id}
      ref={ref as React.RefObject<HTMLDivElement>}
      className="py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden bg-muted/30"
    >
      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 mb-4">
            <span className="text-sm font-medium text-primary">
              Quick & Easy Setup
            </span>
          </div>
          <h2 className="font-bold tracking-tight mb-4 text-2xl sm:text-3xl">
            Join GoPlayNow in <span className="text-primary">Under 2 Minutes</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Create your profile, connect with trusted families, and start scheduling safe, fun playdates for your kids.
          </p>
        </div>
        
        <div className={cn(
          "max-w-4xl mx-auto bg-white rounded-2xl shadow-soft border border-muted overflow-hidden",
          isIntersecting ? "animate-scale-up" : "opacity-0"
        )}>
          <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h3 className="text-xl md:text-2xl font-medium">Create Your Account</h3>
              <div className="w-full md:w-auto">
                <ProgressIndicator currentStep={step} totalSteps={4} />
              </div>
            </div>
            
            <div className="relative overflow-hidden">
              {/* Step 1: Account Creation */}
              <div className={cn(
                "transition-all duration-500 ease-in-out",
                step === 1 ? "opacity-100 translate-x-0" : "opacity-0 absolute top-0 left-0 right-0 translate-x-[-100%]"
              )}>
                <AccountCreationStep 
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  nextStep={nextStep}
                  isSubmitting={isSubmitting}
                />
              </div>
              
              {/* Step 2: Parent Profile */}
              <div className={cn(
                "transition-all duration-500 ease-in-out",
                step === 2 ? "opacity-100 translate-x-0" : "opacity-0 absolute top-0 left-0 right-0 translate-x-[100%]"
              )}>
                <ParentProfileStep 
                  parentName={parentName}
                  setParentName={setParentName}
                  location={location}
                  setLocation={setLocation}
                  referrer={referrer}
                  setReferrer={setReferrer}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  isSubmitting={isSubmitting}
                />
              </div>
              
              {/* Step 3: Child Profile */}
              <div className={cn(
                "transition-all duration-500 ease-in-out",
                step === 3 ? "opacity-100 translate-x-0" : "opacity-0 absolute top-0 left-0 right-0 translate-x-[100%]"
              )}>
                <ChildProfileStep 
                  children={children}
                  onChange={setChildren}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  isSubmitting={isSubmitting}
                />
              </div>
              
              {/* Step 4: Interests */}
              <div className={cn(
                "transition-all duration-500 ease-in-out",
                step === 4 ? "opacity-100 translate-x-0" : "opacity-0 absolute top-0 left-0 right-0 translate-x-[100%]"
              )}>
                <InterestsStep 
                  interests={interests}
                  setInterests={setInterests}
                  handleCompleteSetup={handleCompleteSetup}
                  prevStep={prevStep}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-muted/30 border-t border-muted flex items-center justify-center">
            <Users className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm text-muted-foreground">
              Join other parents using GoPlayNow for safe outdoor activities
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnboardingFlow;
