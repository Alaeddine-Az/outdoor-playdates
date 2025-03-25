
import React from 'react';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface NameFieldProps {
  form: UseFormReturn<any>;
}

export const NameField: React.FC<NameFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="parentName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Your Name</FormLabel>
          <FormControl>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                className="pl-10" 
                placeholder="Your full name"
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
