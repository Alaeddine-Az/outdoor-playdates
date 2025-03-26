
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check } from 'lucide-react';
import { EarlySignup } from '@/types/admin';

interface AccountCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  signup: EarlySignup | null;
  onConfirm: (signup: EarlySignup, password: string) => Promise<void>;
  isLoading: boolean;
}

const AccountCreationModal: React.FC<AccountCreationModalProps> = ({
  isOpen,
  onClose,
  signup,
  onConfirm,
  isLoading
}) => {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    setCopied(false);
  };
  
  React.useEffect(() => {
    if (isOpen) {
      generatePassword();
    }
  }, [isOpen]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleConfirm = async () => {
    if (signup) {
      await onConfirm(signup, password);
    }
  };
  
  if (!signup) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Account for {signup.parent_name}</DialogTitle>
          <DialogDescription>
            This will create a user account for {signup.email} with the generated password.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Parent Name
            </Label>
            <Input
              id="name"
              value={signup.parent_name}
              readOnly
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={signup.email}
              readOnly
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <div className="col-span-3 flex gap-2">
              <Input
                id="password"
                value={password}
                className="flex-1"
                readOnly
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={copyToClipboard}
                type="button"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <div></div>
            <Button 
              variant="outline" 
              onClick={generatePassword}
              className="col-span-3"
              type="button"
            >
              Generate New Password
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountCreationModal;
