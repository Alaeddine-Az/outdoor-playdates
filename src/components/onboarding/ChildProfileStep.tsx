
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, CalendarDays, Plus, Trash2 } from 'lucide-react';
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

export interface ChildInfo {
  name: string;
  age: string;
}

interface ChildProfileStepProps {
  children: ChildInfo[];
  setChildren: (children: ChildInfo[]) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const childSchema = z.object({
  name: z.string().min(1, "Child's name is required"),
  age: z.string()
    .refine(val => !isNaN(Number(val)), "Age must be a number")
    .refine(val => Number(val) > 0 && Number(val) < 20, "Age must be between 1 and 19")
});

const formSchema = z.object({
  children: z.array(childSchema).min(1, "At least one child is required")
});

const ChildProfileStep: React.FC<ChildProfileStepProps> = ({
  children,
  setChildren,
  nextStep,
  prevStep
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      children: children.length > 0 ? children : [{ name: '', age: '' }]
    },
  });

  const { control, handleSubmit, formState: { errors } } = form;

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setChildren(data.children);
    nextStep();
  };

  const addChild = () => {
    const currentChildren = form.getValues().children;
    // Fix: Ensure we're creating a valid ChildInfo object with required properties
    form.setValue('children', [...currentChildren, { name: '', age: '' }]);
  };

  const removeChild = (index: number) => {
    const currentChildren = form.getValues().children;
    if (currentChildren.length > 1) {
      form.setValue('children', currentChildren.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      <h4 className="text-xl font-medium mb-4">Child Information</h4>
      <p className="text-muted-foreground mb-6">
        Tell us about your child(ren) to help find compatible playmates.
      </p>
      
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {form.watch('children').map((child, index) => (
            <div key={index} className="p-4 border border-input rounded-lg bg-background">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-medium">Child {index + 1}</h5>
                {form.watch('children').length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeChild(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={control}
                  name={`children.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Child's First Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="First name only" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        For privacy, we only use first names for children.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={control}
                  name={`children.${index}.age`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Child's Age</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                          <Input 
                            type="number" 
                            className="pl-10"
                            placeholder="Age in years"
                            min="1"
                            max="19"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full" 
            onClick={addChild}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Another Child
          </Button>
          
          {errors.children && (
            <p className="text-sm font-medium text-destructive">{errors.children.message}</p>
          )}
          
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

export default ChildProfileStep;
