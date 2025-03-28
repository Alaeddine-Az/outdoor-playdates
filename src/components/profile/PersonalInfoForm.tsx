
import React, { useState, useEffect } from 'react';
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

const MAX_DESCRIPTION_LENGTH = 500;

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
  const [charCount, setCharCount] = useState(0);
  
  useEffect(() => {
    setCharCount(description.length);
  }, [description]);
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(newText);
      setCharCount(newText.length);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="name" className="text-base font-medium">Full Name</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Your full name"
          className="max-w-md"
        />
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="description" className="text-base font-medium">Description</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={handleDescriptionChange} 
          placeholder="Tell other parents about yourself and your family"
          className="min-h-[120px] max-w-2xl"
        />
        <p className="text-xs text-muted-foreground">
          {charCount}/{MAX_DESCRIPTION_LENGTH} characters
        </p>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-base font-medium">Location</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
          <div>
            <Label htmlFor="location" className="text-sm text-muted-foreground">ZIP Code</Label>
            <Input 
              id="location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="e.g., 10001"
            />
          </div>
          
          <div>
            <Label htmlFor="city" className="text-sm text-muted-foreground">City</Label>
            <Input 
              id="city" 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              placeholder="e.g., New York City"
              readOnly
              className="bg-muted"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
