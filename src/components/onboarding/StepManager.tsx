
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { cn } from '@/lib/utils';
import ProgressIndicator from './ProgressIndicator';
import AccountCreationStep from './AccountCreationStep';
import ParentProfileStep from './ParentProfileStep';
import ChildProfileStep from './ChildProfileStep';
import InterestsStep from './InterestsStep';

const StepManager: React.FC = () => {
  const { 
    step,
    email, setEmail,
    password, setPassword,
    parentName, setParentName,
    location, setLocation,
    referrer, setReferrer,
    children, setChildren,
    interests, setInterests,
    nextStep, prevStep,
    isSubmitting,
    handleCompleteSetup
  } = useOnboarding();
  
  return (
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
  );
};

export default StepManager;
