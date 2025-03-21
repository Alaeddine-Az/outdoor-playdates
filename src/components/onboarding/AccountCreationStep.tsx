
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Mail, Lock } from 'lucide-react';
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

interface AccountCreationStepProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  nextStep: () => void;
}

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(
    /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
    "Password must contain at least one number and one special character"
  )
});

const AccountCreationStep: React.FC<AccountCreationStepProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  nextStep
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
      password
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setEmail(data.email);
    setPassword(data.password);
    nextStep();
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
                      type="password" 
                      className="pl-10"
                      placeholder="Create a secure password"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Must be at least 8 characters with a number and special character.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-4">
            <Button 
              type="submit"
              className="w-full button-glow bg-primary hover:bg-primary/90 text-white rounded-xl"
            >
              Continue <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AccountCreationStep;
