
import React from 'react';
import { Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface PhoneFieldProps {
  form: UseFormReturn<any>;
}

export const PhoneField: React.FC<PhoneFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Phone Number</FormLabel>
          <FormControl>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                type="tel" 
                className="pl-10"
                placeholder="(123) 456-7890"
                {...field}
              />
            </div>
          </FormControl>
          <FormDescription>
            We'll send you an invitation when your account is ready
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
