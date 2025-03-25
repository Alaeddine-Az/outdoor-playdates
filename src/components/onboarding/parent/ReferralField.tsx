
import React from 'react';
import { Gift } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface ReferralFieldProps {
  form: UseFormReturn<any>;
}

export const ReferralField: React.FC<ReferralFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="referrer"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Referral Code (Optional)</FormLabel>
          <FormControl>
            <div className="relative">
              <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                className="pl-10"
                placeholder="Enter referral code if you have one"
                {...field}
              />
            </div>
          </FormControl>
          <FormDescription>
            If someone invited you, enter their code.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
