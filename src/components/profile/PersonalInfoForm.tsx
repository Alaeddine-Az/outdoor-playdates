
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PersonalInfoFormProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  location: string;
  setLocation: (location: string) => void;
  city: string;
  setCity: (city: string) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  name,
  setName,
  description,
  setDescription,
  location,
  setLocation,
  city,
  setCity
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Your full name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">About You</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Tell other parents about yourself and your family"
          className="min-h-[100px]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Postal Code (Private)</Label>
          <Input 
            id="location" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            placeholder="e.g., T2A 3K1"
          />
          <p className="text-xs text-muted-foreground">
            Your postal code is private and used for finding nearby playdates
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">City (Public)</Label>
          <Input 
            id="city" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            placeholder="e.g., Calgary"
          />
          <p className="text-xs text-muted-foreground">
            This city name will be shown on your public profile
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
