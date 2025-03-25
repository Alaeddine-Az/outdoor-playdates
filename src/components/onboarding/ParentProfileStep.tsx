
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, User, MapPin, Gift } from 'lucide-react';
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

interface ParentProfileStepProps {
  parentName: string;
  setParentName: (name: string) => void;
  location: string;
  setLocation: (location: string) => void;
  referrer: string;
  setReferrer: (referrer: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  isSubmitting: boolean;
}

const formSchema = z.object({
  parentName: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters")
    .regex(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed"),
  location: z.string().min(3, "Please enter a valid location"),
  referrer: z.string().optional()
});

const ParentProfileStep: React.FC<ParentProfileStepProps> = ({
  parentName,
  setParentName,
  location,
  setLocation,
  referrer,
  setReferrer,
  nextStep,
  prevStep,
  isSubmitting
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentName,
      location,
      referrer: referrer || ''
    },
    mode: 'onChange'
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setParentName(data.parentName);
    setLocation(data.location);
    setReferrer(data.referrer || '');
    nextStep();
  };

  return (
    <div>
      <h4 className="text-xl font-medium mb-4">Parent Profile</h4>
      <p className="text-muted-foreground mb-6">
        Tell us a bit about yourself. This helps other parents connect with you.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
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
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input 
                      className="pl-10"
                      placeholder="Your neighborhood or city"
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
          
          <div className="pt-4 flex space-x-3">
            <Button 
              type="button"
              variant="outline"
              className="flex-1 rounded-xl h-12"
              onClick={prevStep}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button 
              type="submit"
              className="flex-1 button-glow bg-primary hover:bg-primary/90 text-white rounded-xl h-12"
              disabled={isSubmitting || !form.formState.isValid}
            >
              Continue <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ParentProfileStep;
