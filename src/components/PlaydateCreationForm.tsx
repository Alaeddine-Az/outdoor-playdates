
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { PlaydateFormFields, playdateFormSchema, PlaydateFormValues } from './playdates/form/PlaydateFormFields';
import { PlaydateFormActions } from './playdates/form/PlaydateFormActions';
import { usePlaydateSubmit } from './playdates/form/usePlaydateSubmit';

const PlaydateCreationForm = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  
  // Get API key from environment variable with correct name
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  
  // Log for debugging
  useEffect(() => {
    console.log('PlaydateCreationForm - Google Maps API Key:', googleMapsApiKey ? 'Available' : 'Not available');
    if (googleMapsApiKey) {
      console.log('API Key length:', googleMapsApiKey.length);
      console.log('API Key starts with:', googleMapsApiKey.substring(0, 5) + '...');
    }
  }, [googleMapsApiKey]);
  
  const form = useForm<PlaydateFormValues>({
    resolver: zodResolver(playdateFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startTime: "14:00",
      endTime: "16:00",
      maxParticipants: 5,
    },
  });
  
  const { isSubmitting, handleSubmit } = usePlaydateSubmit({
    userId: user?.id || '',
    latitude,
    longitude
  });
  
  const onSubmit = (values: PlaydateFormValues) => {
    handleSubmit(values);
  };
  
  const handleLocationCoordinatesChange = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };
  
  return (
    <div className={`${isMobile ? 'w-full' : 'max-w-2xl mx-auto'} bg-white p-4 sm:p-6 rounded-xl shadow-soft`}>
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Create a New Playdate</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <PlaydateFormFields 
            form={form} 
            onLocationCoordinatesChange={handleLocationCoordinatesChange}
            googleMapsApiKey={googleMapsApiKey}
          />
          
          <PlaydateFormActions isSubmitting={isSubmitting} />
        </form>
      </Form>
    </div>
  );
};

export default PlaydateCreationForm;
