
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, User, MapPin } from 'lucide-react';
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
  nextStep: () => void;
  prevStep: () => void;
}

const formSchema = z.object({
  parentName: z.string().min(1, "Your name is required"),
  location: z.string().min(5, "Please enter a valid address")
});

const ParentProfileStep: React.FC<ParentProfileStepProps> = ({
  parentName,
  setParentName,
  location,
  setLocation,
  nextStep,
  prevStep
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentName,
      location
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setParentName(data.parentName);
    setLocation(data.location);
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
          
          <div className="pt-4 flex space-x-3">
            <Button 
              type="button"
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={prevStep}
            >
              Back
            </Button>
            <Button 
              type="submit"
              className="flex-1 button-glow bg-primary hover:bg-primary/90 text-white rounded-xl"
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
