import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { CalendarIcon, MapPin } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  startTime: z.string().min(2, {
    message: "Start time must be selected.",
  }),
  endTime: z.string().min(2, {
    message: "End time must be selected.",
  }),
  maxFamilies: z.number().optional(),
});

interface FormValues extends z.infer<typeof formSchema> {}

const CreateEventPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      city: "",
      address: "",
      startTime: "",
      endTime: "",
      maxFamilies: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to create an event."
      });
      return;
    }

    setSubmitting(true);

    try {
      // Create the event
      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: values.title,
          description: values.description,
          location: values.location,
          city: values.city,
          address: values.address,
          start_time: values.startTime,
          end_time: values.endTime,
          host_id: user.id,
          max_families: values.maxFamilies || null
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Event created successfully",
        description: "Your event has been created."
      });

      // Navigate to the new event page
      navigate(`/event/${data.id}`);
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast({
        variant: "destructive",
        title: "Failed to create event",
        description: error.message
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Event title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell people more about the event"
                          className="resize-none"
                          {...field}
                        />
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
                        <Input placeholder="Location name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input placeholder="Start Time" type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input placeholder="End Time" type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="maxFamilies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Families (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Maximum number of families"
                          type="number"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                            form.setValue('maxFamilies', value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={submitting} type="submit">
                  {submitting ? "Creating..." : "Create Event"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CreateEventPage;
