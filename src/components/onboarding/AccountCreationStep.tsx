
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface AccountCreationStepProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  nextStep: () => void;
  isSubmitting: boolean;
}

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(
    /^(?=.*[0-9!@#$%^&*])/,
    "Password must contain at least one number or special character"
  )
});

const AccountCreationStep: React.FC<AccountCreationStepProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  nextStep,
  isSubmitting
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
      password
    },
    mode: 'onChange'
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const checkEmailExists = async (email: string) => {
    if (!email || !form.formState.dirtyFields.email) return;
    
    try {
      setCheckingEmail(true);
      
      const { data, error } = await supabase
        .from('early_signups')
        .select('email')
        .eq('email', email)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        form.setError('email', {
          type: 'manual',
          message: 'This email is already registered. Please use a different email.'
        });
      }
      
    } catch (error) {
      console.error('Error checking email:', error);
    } finally {
      setCheckingEmail(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const { data: existingUser, error } = await supabase
        .from('early_signups')
        .select('email')
        .eq('email', data.email)
        .maybeSingle();
        
      if (existingUser) {
        form.setError('email', {
          type: 'manual',
          message: 'This email is already registered. Please use a different email.'
        });
        return;
      }
    
      setEmail(data.email);
      setPassword(data.password);
      nextStep();
    } catch (error) {
      console.error('Error during email check:', error);
      toast({
        title: 'Error',
        description: 'There was an error checking your email. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <h4 className="text-xl font-medium mb-4">Create your account</h4>
      <p className="text-muted-foreground mb-6">
        Your email will be verified to ensure the safety of our community.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input 
                      type="email" 
                      className="pl-10" 
                      placeholder="your@email.com"
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();
                        checkEmailExists(e.target.value);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input 
                      type={passwordVisible ? "text" : "password"} 
                      className="pl-10 pr-10"
                      placeholder="Create a secure password"
                      {...field}
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      onClick={togglePasswordVisibility}
                      tabIndex={-1}
                    >
                      {passwordVisible ? 
                        <EyeOff className="h-5 w-5" /> : 
                        <Eye className="h-5 w-5" />
                      }
                    </button>
                  </div>
                </FormControl>
                <FormDescription>
                  Must be at least 8 characters with a number or special character.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-4">
            <Button 
              type="submit"
              className="w-full button-glow bg-primary hover:bg-primary/90 text-white rounded-xl h-12"
              disabled={isSubmitting || checkingEmail || !form.formState.isValid}
            >
              {checkingEmail ? 'Checking...' : 'Continue'} <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AccountCreationStep;
