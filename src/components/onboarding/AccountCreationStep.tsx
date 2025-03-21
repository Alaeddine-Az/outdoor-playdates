
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Mail, Lock } from 'lucide-react';

interface AccountCreationStepProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  nextStep: () => void;
}

const AccountCreationStep: React.FC<AccountCreationStepProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  nextStep
}) => {
  return (
    <div>
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
              required
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
            disabled={!email}
          >
            Continue <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountCreationStep;
