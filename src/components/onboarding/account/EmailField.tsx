
import React from 'react';
import { Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface EmailFieldProps {
  form: UseFormReturn<any>;
  onBlur: (email: string) => void;
}

export const EmailField: React.FC<EmailFieldProps> = ({ form, onBlur }) => {
  return (
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
                  onBlur(e.target.value);
                }}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
