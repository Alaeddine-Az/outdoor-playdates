
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Form } from '@/components/ui/form';
import { EmailField } from './account/EmailField';
import { PasswordField } from './account/PasswordField';
import { FormButtons } from './FormButtons';

interface AccountCreationStepProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword?: (password: string) => void;
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
  setPassword = () => {},
  nextStep,
  isSubmitting
}) => {
  const [checkingEmail, setCheckingEmail] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
      password
    },
    mode: 'onChange'
  });

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
          <EmailField form={form} onBlur={checkEmailExists} />
          <PasswordField form={form} />
          
          <FormButtons 
            isValid={form.formState.isValid}
            loading={isSubmitting || checkingEmail}
            submitLabel={checkingEmail ? 'Checking...' : 'Continue'}
          />
        </form>
      </Form>
    </div>
  );
};

export default AccountCreationStep;
