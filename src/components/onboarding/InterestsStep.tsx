
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage 
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface InterestsStepProps {
  interests: string[];
  setInterests: React.Dispatch<React.SetStateAction<string[]>>;
  handleCompleteSetup: () => void;
  prevStep: () => void;
  isSubmitting: boolean;
  email: string;
  parentName: string;
}

const formSchema = z.object({
  interests: z.array(z.string()).min(1, "Please select at least one interest")
});

const InterestsStep: React.FC<InterestsStepProps> = ({
  interests,
  setInterests,
  handleCompleteSetup,
  prevStep,
  isSubmitting,
  email,
  parentName
}) => {
  const interestOptions = [
    'Arts & Crafts', 
    'Sports', 
    'Nature Exploration', 
    'STEM Activities', 
    'Music & Dance', 
    'Reading & Books', 
    'Building & Construction', 
    'Imaginative Play', 
    'Outdoor Adventures'
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setInterests(data.interests);
    handleCompleteSetup();
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = form.getValues().interests;
    if (currentInterests.includes(interest)) {
      form.setValue('interests', currentInterests.filter(i => i !== interest));
    } else {
      form.setValue('interests', [...currentInterests, interest]);
    }
  };

  return (
    <div>
      <h4 className="text-xl font-medium mb-4">Select Interests</h4>
      <p className="text-muted-foreground mb-6">
        Choose activities your child enjoys. This helps us match with compatible playmates.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="interests"
            render={() => (
              <FormItem>
                <FormControl>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        className={cn(
                          "px-4 py-3 rounded-xl border transition-colors text-sm font-medium flex items-center justify-center text-center",
                          form.watch('interests').includes(interest) 
                            ? "border-primary bg-primary/10 text-primary" 
                            : "border-muted bg-white hover:bg-muted/5 text-foreground"
                        )}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </FormControl>
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
              disabled={isSubmitting || !email || !parentName}
            >
              {isSubmitting ? 'Submitting...' : 'Complete Setup'} <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InterestsStep;
