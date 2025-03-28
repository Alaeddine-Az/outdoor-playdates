
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ChildProfile } from '@/types';

interface ChildBasicInfoFormProps {
  child: Partial<ChildProfile>;
  setChild: React.Dispatch<React.SetStateAction<Partial<ChildProfile>>>;
}

const AGE_OPTIONS = Array.from({ length: 18 }, (_, i) => `${i + 1}`);

const ChildBasicInfoForm = ({ child, setChild }: ChildBasicInfoFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Child's Name</Label>
          <Input 
            id="name" 
            value={child.name} 
            onChange={(e) => setChild({ ...child, name: e.target.value })} 
            placeholder="Your child's name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <select
            id="age"
            value={child.age}
            onChange={(e) => setChild({ ...child, age: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select age</option>
            {AGE_OPTIONS.map(age => (
              <option key={age} value={age}>{age}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">About Your Child</Label>
          <Textarea 
            id="bio" 
            value={child.bio || ''} 
            onChange={(e) => setChild({ ...child, bio: e.target.value })} 
            placeholder="Tell us about your child's personality, likes, and what they enjoy doing"
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChildBasicInfoForm;
