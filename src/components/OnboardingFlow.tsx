
import React, { useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { CheckCircle, ChevronRight, Mail, Lock, User, MapPin, CalendarDays, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OnboardingFlow = ({ id }: { id?: string }) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  
  const handleInterestToggle = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };
  
  const nextStep = () => {
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
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
              <div className="flex items-center">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex items-center",
                      i < 4 && "mr-2"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                      step === i ? "bg-primary text-white" : 
                        step > i ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      {step > i ? <CheckCircle className="h-5 w-5" /> : i}
                    </div>
                    {i < 4 && (
                      <div className={cn(
                        "w-6 h-0.5 mx-1",
                        step > i ? "bg-primary" : "bg-muted"
                      )}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative overflow-hidden">
              {/* Step 1: Account Creation */}
              <div className={cn(
                "transition-all duration-500 ease-in-out",
                step === 1 ? "opacity-100 translate-x-0" : "opacity-0 absolute top-0 left-0 right-0 translate-x-[-100%]"
              )}>
                <h4 className="text-xl font-medium mb-4">Create your account</h4>
                <p className="text-muted-foreground mb-6">
                  Your email will be verified to ensure the safety of our community.
                </p>
                
                <div className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <input 
                        type="email" 
                        className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <input 
                        type="password" 
                        className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Create a secure password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Must be at least 8 characters with a number and special character.
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      className="w-full button-glow bg-primary hover:bg-primary/90 text-white rounded-xl"
                      onClick={nextStep}
                    >
                      Continue <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Step 2: Parent Profile */}
              <div className={cn(
                "transition-all duration-500 ease-in-out",
                step === 2 ? "opacity-100 translate-x-0" : "opacity-0 absolute top-0 left-0 right-0 translate-x-[100%]"
              )}>
                <h4 className="text-xl font-medium mb-4">Parent Profile</h4>
                <p className="text-muted-foreground mb-6">
                  Tell us a bit about yourself. This helps other parents connect with you.
                </p>
                
                <div className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium mb-1">Your Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <input 
                        type="text" 
                        className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Your full name"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <input 
                        type="text" 
                        className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Your neighborhood or city"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      We use this to match you with nearby families.
                    </p>
                  </div>
                  
                  <div className="pt-4 flex space-x-3">
                    <Button 
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={prevStep}
                    >
                      Back
                    </Button>
                    <Button 
                      className="flex-1 button-glow bg-primary hover:bg-primary/90 text-white rounded-xl"
                      onClick={nextStep}
                    >
                      Continue <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Step 3: Child Profile */}
              <div className={cn(
                "transition-all duration-500 ease-in-out",
                step === 3 ? "opacity-100 translate-x-0" : "opacity-0 absolute top-0 left-0 right-0 translate-x-[100%]"
              )}>
                <h4 className="text-xl font-medium mb-4">Child Information</h4>
                <p className="text-muted-foreground mb-6">
                  Tell us about your child to help find compatible playmates.
                </p>
                
                <div className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium mb-1">Child's First Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="First name only"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      For privacy, we only use first names for children.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Child's Age</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <input 
                        type="number" 
                        className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Age in years"
                        min="1"
                        max="12"
                        value={childAge}
                        onChange={(e) => setChildAge(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex space-x-3">
                    <Button 
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={prevStep}
                    >
                      Back
                    </Button>
                    <Button 
                      className="flex-1 button-glow bg-primary hover:bg-primary/90 text-white rounded-xl"
                      onClick={nextStep}
                    >
                      Continue <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Step 4: Interests */}
              <div className={cn(
                "transition-all duration-500 ease-in-out",
                step === 4 ? "opacity-100 translate-x-0" : "opacity-0 absolute top-0 left-0 right-0 translate-x-[100%]"
              )}>
                <h4 className="text-xl font-medium mb-4">Select Interests</h4>
                <p className="text-muted-foreground mb-6">
                  Choose activities your child enjoys. This helps us match with compatible playmates.
                </p>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['Arts & Crafts', 'Sports', 'Nature Exploration', 'STEM Activities', 'Music & Dance', 'Reading & Books', 'Building & Construction', 'Imaginative Play', 'Outdoor Adventures'].map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        className={cn(
                          "px-4 py-3 rounded-xl border transition-colors text-sm font-medium flex items-center justify-center text-center",
                          interests.includes(interest) 
                            ? "border-primary bg-primary/10 text-primary" 
                            : "border-muted bg-white hover:bg-muted/5 text-foreground"
                        )}
                        onClick={() => handleInterestToggle(interest)}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  
                  <div className="pt-4 flex space-x-3">
                    <Button 
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={prevStep}
                    >
                      Back
                    </Button>
                    <Button 
                      className="flex-1 button-glow bg-primary hover:bg-primary/90 text-white rounded-xl"
                      onClick={() => window.location.href = '/dashboard'}
                    >
                      Complete Setup <CheckCircle className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
