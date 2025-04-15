import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Clock, Users } from "lucide-react";
import { LocationInput } from '@/components/location/LocationInput';
import { useIsMobile } from '@/hooks/use-mobile';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export const playdateFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(3, "Location is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  maxParticipants: z.coerce.number().int().positive().default(5),
});

export type PlaydateFormValues = z.infer<typeof playdateFormSchema>;

interface PlaydateFormFieldsProps {
  form: UseFormReturn<PlaydateFormValues>;
  onLocationCoordinatesChange: (lat: number, lng: number) => void;
  googleMapsApiKey?: string;
}

export const PlaydateFormFields: React.FC<PlaydateFormFieldsProps> = ({ 
  form, 
  onLocationCoordinatesChange,
  googleMapsApiKey = ''
}) => {
  const isMobile = useIsMobile();
  
  React.useEffect(() => {
    console.log('PlaydateFormFields - Using Google Maps API Key:', googleMapsApiKey ? 'Available' : 'Not available');
    if (googleMapsApiKey) {
      console.log('API Key length in PlaydateFormFields:', googleMapsApiKey.length);
      console.log('API Key starts with:', googleMapsApiKey.substring(0, 5) + '...');
    }
  }, [googleMapsApiKey]);
  
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Playdate Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Park Adventure" {...field} />
            </FormControl>
            <FormDescription className="text-xs sm:text-sm">
              Choose a title that describes the activity.
            </FormDescription>
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
                placeholder="Tell other parents what this playdate is about..." 
                className={`${isMobile ? 'min-h-24' : 'min-h-32'}`}
                {...field} 
              />
            </FormControl>
            <FormDescription className="text-xs sm:text-sm">
              Include activity details, what to bring, and age recommendations.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <LocationInput 
                  value={field.value}
                  onChange={field.onChange}
                  onCoordinatesChange={onLocationCoordinatesChange}
                  placeholder="Enter a location..."
                  apiKey={googleMapsApiKey}
                />
              </FormControl>
              <FormDescription className="text-xs sm:text-sm">
                {googleMapsApiKey 
                  ? "Enter a location or use the Google Places autocomplete." 
                  : "Enter the location (API key not available for automatic search)."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal w-full",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align={isMobile ? "center" : "start"}>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="14:00" 
                    className="pl-10"
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormDescription className="text-xs sm:text-sm">
                24-hour format (e.g. 14:00)
              </FormDescription>
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
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="16:00" 
                    className="pl-10"
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormDescription className="text-xs sm:text-sm">
                24-hour format (e.g. 16:00)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="maxParticipants"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Participants</FormLabel>
            <FormControl>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  type="number" 
                  min={1} 
                  max={20} 
                  className="pl-10"
                  {...field} 
                />
              </div>
            </FormControl>
            <FormDescription className="text-xs sm:text-sm">
              How many families can attend this playdate?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
