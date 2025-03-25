
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
}

const formSchema = z.object({
  interests: z.array(z.string())
    .min(1, "Please select at least one interest")
    .max(5, "Please select no more than 5 interests")
});

const InterestsStep: React.FC<InterestsStepProps> = ({
  interests,
  setInterests,
  handleCompleteSetup,
  prevStep,
  isSubmitting
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
    mode: 'onChange'
  });

  const selectedInterests = form.watch('interests');

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setInterests(data.interests);
    handleCompleteSetup();
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = form.getValues().interests;
    if (currentInterests.includes(interest)) {
      form.setValue('interests', currentInterests.filter(i => i !== interest));
    } else {
      if (currentInterests.length < 5) {
        form.setValue('interests', [...currentInterests, interest]);
      }
    }
    form.trigger('interests');
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
                          "px-4 py-3 rounded-xl border transition-colors text-sm font-medium flex items-center justify-center text-center h-16",
                          selectedInterests.includes(interest) 
                            ? "border-primary bg-primary/10 text-primary" 
                            : "border-muted bg-white hover:bg-muted/5 text-foreground",
                          selectedInterests.length >= 5 && !selectedInterests.includes(interest) && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => toggleInterest(interest)}
                        disabled={selectedInterests.length >= 5 && !selectedInterests.includes(interest) || isSubmitting}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </FormControl>
                <div className="text-sm text-muted-foreground mt-2">
                  Select 1-5 interests ({selectedInterests.length}/5 selected)
                </div>
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
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⧗</span> Submitting...
                </>
              ) : (
                <>
                  Complete Setup <CheckCircle className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InterestsStep;
