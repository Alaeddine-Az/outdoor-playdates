
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Form } from '@/components/ui/form';
import { EmailField } from './account/EmailField';
import { PhoneField } from './account/PhoneField';
import { FormButtons } from './FormButtons';

interface AccountCreationStepProps {
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  nextStep: () => void;
  isSubmitting: boolean;
}

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number").optional()
});

const AccountCreationStep: React.FC<AccountCreationStepProps> = ({
  email,
  setEmail,
  phone,
  setPhone,
  nextStep,
  isSubmitting
}) => {
  const [checkingEmail, setCheckingEmail] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
      phone
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
      setPhone(data.phone || '');
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
      <h4 className="text-xl font-medium mb-4">Request an invitation</h4>
      <p className="text-muted-foreground mb-6">
        Fill out the form to join our community of parents. We'll send you an invitation when your account is ready.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
          <EmailField form={form} onBlur={checkEmailExists} />
          <PhoneField form={form} />
          
          <FormButtons 
            isValid={form.formState.isValid}
            loading={isSubmitting || checkingEmail}
            submitLabel={checkingEmail ? 'Checking...' : 'Get an invitation now. It\'s free!'}
          />
        </form>
      </Form>
    </div>
  );
};

export default AccountCreationStep;
