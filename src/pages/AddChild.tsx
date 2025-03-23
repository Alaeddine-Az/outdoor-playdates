
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Plus, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Checkbox } from '@/components/ui/checkbox';

const interestOptions = [
  { id: "arts", label: "Arts & Crafts" },
  { id: "sports", label: "Sports" },
  { id: "nature", label: "Nature Exploration" },
  { id: "stem", label: "STEM Activities" },
  { id: "music", label: "Music & Dance" },
  { id: "reading", label: "Reading & Books" },
  { id: "building", label: "Building & Construction" },
  { id: "imagination", label: "Imaginative Play" },
  { id: "outdoor", label: "Outdoor Adventures" }
];

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.string().min(1, "Age is required"),
  bio: z.string().optional(),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
});

const AddChild = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      bio: "",
      interests: [],
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add a child.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Step 1: Insert the child and get the ID
      const { data: childData, error: childError } = await supabase
        .from('children')
        .insert({
          name: values.name,
          age: values.age,
          bio: values.bio || null,
          parent_id: user.id,
        })
        .select();
      
      if (childError) throw childError;
      
      const childId = childData[0].id;
      
      // Step 2: Add interests by creating entries in the interests table
      // For simplicity, we'll create new interest records for each selection
      for (const interestId of values.interests) {
        const interestLabel = interestOptions.find(opt => opt.id === interestId)?.label || interestId;
        
        // First check if the interest already exists
        const { data: existingInterests } = await supabase
          .from('interests')
          .select('id')
          .eq('name', interestLabel)
          .limit(1);
        
        let interestDbId;
        
        if (existingInterests && existingInterests.length > 0) {
          interestDbId = existingInterests[0].id;
        } else {
          // Create new interest
          const { data: newInterest, error: interestError } = await supabase
            .from('interests')
            .insert({ name: interestLabel })
            .select();
          
          if (interestError) throw interestError;
          interestDbId = newInterest[0].id;
        }
        
        // Create child-interest relationship
        const { error: relationError } = await supabase
          .from('child_interests')
          .insert({
            child_id: childId,
            interest_id: interestDbId,
          });
        
        if (relationError) throw relationError;
      }
      
      toast({
        title: "Child added!",
        description: `${values.name} has been added to your profile.`,
      });
      
      navigate('/parent-profile');
    } catch (error: any) {
      console.error('Error adding child:', error);
      toast({
        title: "Failed to add child",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AppLayout>
      <div className="container max-w-4xl py-8">
        <div className="bg-white p-6 rounded-xl shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-2 rounded-full">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Add Your Child</h1>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Child's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your child's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 5" {...field} />
                      </FormControl>
                      <FormDescription>
                        You can enter an age like "5" or a range like "4-5"
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About your child (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Share a bit about your child's personality, likes, dislikes..." 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This helps find compatible playmates for your child.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="interests"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Interests</FormLabel>
                      <FormDescription>
                        Select activities your child enjoys
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {interestOptions.map((interest) => (
                        <FormField
                          key={interest.id}
                          control={form.control}
                          name="interests"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={interest.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(interest.id)}
                                    onCheckedChange={(checked) => {
                                      const currentInterests = field.value || [];
                                      const newInterests = checked
                                        ? [...currentInterests, interest.id]
                                        : currentInterests.filter((value) => value !== interest.id);
                                      field.onChange(newInterests);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {interest.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-2 space-x-3 flex">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/parent-profile')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 button-glow bg-primary hover:bg-primary/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Child"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AppLayout>
  );
};

export default AddChild;
