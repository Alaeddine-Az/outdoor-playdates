
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, MinusCircle, ChevronRight } from 'lucide-react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export interface ChildInfo {
  name: string;
  age: string;
}

interface ChildProfileStepProps {
  children: ChildInfo[];
  onChange: (children: ChildInfo[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  isSubmitting: boolean;
}

const childSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name cannot exceed 30 characters")
    .regex(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed"),
  age: z.string()
    .refine((val) => !isNaN(Number(val)), "Age must be a number")
    .refine((val) => Number(val) >= 1 && Number(val) <= 17, "Age must be between 1 and 17")
});

const formSchema = z.object({
  children: z.array(childSchema).min(1, "Please add at least one child")
});

const ChildProfileStep: React.FC<ChildProfileStepProps> = ({
  children,
  onChange,
  nextStep,
  prevStep,
  isSubmitting
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      children: children.length > 0 ? children : [{ name: "", age: "" }]
    },
    mode: 'onChange'
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "children"
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // Ensure all children have required properties
    const validChildren: ChildInfo[] = data.children.map(child => ({
      name: child.name,
      age: child.age
    }));
    
    onChange(validChildren);
    nextStep();
  };

  return (
    <div>
      <h4 className="text-xl font-medium mb-4">Child Profiles</h4>
      <p className="text-muted-foreground mb-6">
        Tell us about your children so we can find appropriate playdates.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="overflow-hidden">
              <CardContent className="p-6 bg-muted/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Child {index + 1}</h3>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={isSubmitting}
                    >
                      <MinusCircle className="h-5 w-5 text-destructive" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`children.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Child's name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`children.${index}.age`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Age"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ name: "", age: "" })}
            className="w-full flex items-center justify-center gap-2 h-12"
            disabled={isSubmitting}
          >
            <PlusCircle className="h-4 w-4" />
            Add another child
          </Button>

          <div className="pt-4 flex space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
              className="flex-1 h-12"
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button 
              type="submit" 
              className="flex-1 button-glow bg-primary hover:bg-primary/90 text-white h-12"
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

export default ChildProfileStep;
