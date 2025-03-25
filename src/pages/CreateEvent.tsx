
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [maxFamilies, setMaxFamilies] = useState<number>(10);
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!date) newErrors.date = 'Date is required';
    
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!startTime || !timeRegex.test(startTime)) newErrors.startTime = 'Valid start time is required (HH:MM)';
    if (!endTime || !timeRegex.test(endTime)) newErrors.endTime = 'Valid end time is required (HH:MM)';
    
    if (startTime && endTime) {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;
      
      if (endTotalMinutes <= startTotalMinutes) {
        newErrors.endTime = 'End time must be after start time';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create an event',
        variant: 'destructive',
      });
      return;
    }
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const selectedDate = date as Date;
      
      // Parse times
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      // Create date objects with the correct times
      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(startHour, startMinute, 0, 0);
      
      const endDateTime = new Date(selectedDate);
      endDateTime.setHours(endHour, endMinute, 0, 0);
      
      // Create event using RPC
      const { data, error } = await supabase
        .rpc('create_event', {
          event_title: title,
          event_description: description,
          event_location: location,
          event_city: city,
          event_address: address,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          user_id: user.id,
          max_families: maxFamilies
        });
      
      if (error) throw error;
      
      toast({
        title: 'Event created!',
        description: 'Your event has been successfully created.',
      });
      
      // Navigate to the event page or events list
      navigate(`/event/${data.id}`);
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error creating event',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Create an Event</h1>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Park Playdate"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell other parents what this event is about..."
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location Name <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Central Park"
                      className={cn("pl-10", errors.location ? 'border-red-500' : '')}
                    />
                  </div>
                  {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. New York"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Full Address <span className="text-red-500">*</span></Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 59th St & 5th Ave, New York, NY 10022"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>
              
              <div className="space-y-2">
                <Label>Date <span className="text-red-500">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        errors.date && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="startTime"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      placeholder="HH:MM (e.g. 14:00)"
                      className={cn("pl-10", errors.startTime ? 'border-red-500' : '')}
                    />
                  </div>
                  {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="endTime"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      placeholder="HH:MM (e.g. 16:00)"
                      className={cn("pl-10", errors.endTime ? 'border-red-500' : '')}
                    />
                  </div>
                  {errors.endTime && <p className="text-red-500 text-sm">{errors.endTime}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxFamilies">Maximum Number of Families</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="maxFamilies"
                    type="number"
                    min={1}
                    value={maxFamilies}
                    onChange={(e) => setMaxFamilies(parseInt(e.target.value) || 10)}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-muted-foreground">Leave at default for no limit</p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/events')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white button-glow"
              >
                {loading ? 'Creating...' : 'Create Event'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CreateEvent;
