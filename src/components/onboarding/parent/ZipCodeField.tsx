
import React from 'react';
import { MapPin } from 'lucide-react';
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

interface ZipCodeFieldProps {
  form: UseFormReturn<any>;
  isValidZipCode: boolean;
}

export const ZipCodeField: React.FC<ZipCodeFieldProps> = ({ form, isValidZipCode }) => {
  const fieldValue = form.watch('zipCode');
  
  return (
    <FormField
      control={form.control}
      name="zipCode"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Postal Code</FormLabel>
          <FormControl>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                className={`pl-10 ${
                  fieldValue && fieldValue.length >= 6
                    ? isValidZipCode
                      ? "border-green-500 focus-visible:ring-green-500"
                      : "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
                placeholder="Your postal code (e.g., T2A 3K1)"
                {...field}
              />
            </div>
          </FormControl>
          <FormDescription>
            We use this to match you with nearby families.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
