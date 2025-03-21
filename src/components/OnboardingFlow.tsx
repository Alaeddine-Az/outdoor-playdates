
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
  const [children, setChildren] = useState<ChildInfo[]>([{ name: '', age: '' }]);
  const [interests, setInterests] = useState<string[]>([]);
  
  const nextStep = () => {
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };

  const handleCompleteSetup = async () => {
    setIsSubmitting(true);
    
    try {
      // Process each child and save to Supabase
      for (const child of children) {
        const { error } = await supabase
          .from('early_signups')
          .insert({
            email,
            parent_name: parentName,
            location,
            child_name: child.name,
            child_age: child.age,
            interests,
          });
        
        if (error) {
          console.error('Error saving signup data:', error);
          if (error.code === '23505') { // Unique constraint violation
            toast({
              title: 'Email already registered',
              description: 'This email is already in our waiting list.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Signup Error',
              description: 'There was an error saving your information. Please try again.',
              variant: 'destructive',
            });
          }
          setIsSubmitting(false);
          return;
        }
      }
      
      // Redirect to thank you page with email in state
      navigate('/thank-you', { state: { email } });
      
    } catch (err) {
      console.error('Error in signup process:', err);
      toast({
        title: 'Something went wrong',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id={id}
      ref={ref as React.RefObject<HTMLDivElement>}
      className="py-24 px-6 relative overflow-hidden bg-muted/30"
    >
      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 mb-4">
            <span className="text-sm font-medium text-primary">
              Quick & Easy Setup
            </span>
          </div>
          <h2 className="font-bold tracking-tight mb-4">
            Join GoPlayNow in <span className="text-primary">Under 2 Minutes</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Create your profile, connect with trusted families, and start scheduling safe, fun playdates for your kids.
          </p>
        </div>
        
        <div className={cn(
          "max-w-4xl mx-auto bg-white rounded-2xl shadow-soft border border-muted overflow-hidden",
          isIntersecting ? "animate-scale-up" : "opacity-0"
        )}>
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-medium">Create Your Account</h3>
              <ProgressIndicator currentStep={step} totalSteps={4} />
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
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              </div>
              
              {/* Step 3: Child Profile */}
              <div className={cn(
                "transition-all duration-500 ease-in-out",
                step === 3 ? "opacity-100 translate-x-0" : "opacity-0 absolute top-0 left-0 right-0 translate-x-[100%]"
              )}>
                <ChildProfileStep 
                  children={children}
                  setChildren={setChildren}
                  nextStep={nextStep}
                  prevStep={prevStep}
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
                  email={email}
                  parentName={parentName}
                />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-muted/30 border-t border-muted flex items-center justify-center">
            <Users className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm text-muted-foreground">
              Join <span className="font-medium text-foreground">1,000+</span> verified parents using GoPlayNow
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnboardingFlow;
