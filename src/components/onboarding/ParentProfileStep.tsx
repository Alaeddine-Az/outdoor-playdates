
import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { NameField } from './parent/NameField';
import { ZipCodeField } from './parent/ZipCodeField';
import { ReferralField } from './parent/ReferralField';
import { FormButtons } from './FormButtons';

interface ParentProfileStepProps {
  parentName: string;
  setParentName: (name: string) => void;
  zipCode: string;
  setZipCode: (zipCode: string) => void;
  isValidZipCode: boolean;
  validateZipCode: (zipCode: string) => Promise<boolean>;
  referrer: string;
  setReferrer: (referrer: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  isSubmitting: boolean;
}

const formSchema = z.object({
  parentName: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters")
    .regex(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed"),
  zipCode: z.string().min(6, "Please enter a valid Canadian postal code").max(7, "Postal code is too long")
    .refine(value => /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/.test(value.toUpperCase()), {
      message: "Please enter a valid Canadian postal code (e.g., T2A 3K1)"
    }),
  referrer: z.string().optional()
});

const ParentProfileStep: React.FC<ParentProfileStepProps> = ({
  parentName,
  setParentName,
  zipCode,
  setZipCode,
  isValidZipCode,
  validateZipCode,
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
      zipCode,
      referrer: referrer || ''
    },
    mode: 'onChange'
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Validate ZIP code before proceeding
    const isValid = await validateZipCode(data.zipCode);
    
    if (!isValid) {
      form.setError('zipCode', { 
        type: 'manual', 
        message: 'This postal code could not be verified. Please enter a valid Canadian postal code.' 
      });
      return;
    }
    
    setParentName(data.parentName);
    setZipCode(data.zipCode);
    setReferrer(data.referrer || '');
    nextStep();
  };

  // Validate ZIP code when it changes
  useEffect(() => {
    const zipCodeValue = form.watch('zipCode');
    if (zipCodeValue && zipCodeValue.length >= 6) {
      // Debounce the validation to avoid too many API calls
      const timer = setTimeout(() => {
        validateZipCode(zipCodeValue);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [form.watch('zipCode'), validateZipCode]);

  return (
    <div className="md:min-h-[400px]">
      <h4 className="text-xl font-medium mb-4">Parent Profile</h4>
      <p className="text-muted-foreground mb-6">
        Tell us a bit about yourself. This helps other parents connect with you.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
          <NameField form={form} />
          <ZipCodeField form={form} isValidZipCode={isValidZipCode} />
          <ReferralField form={form} />
          
          <FormButtons 
            showBackButton
            onBack={prevStep}
            isValid={form.formState.isValid}
            loading={isSubmitting}
          />
        </form>
      </Form>
    </div>
  );
};

export default ParentProfileStep;
