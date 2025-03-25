
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface ProfileSummaryProps {
  name: string;
  children: Array<{ name: string; age: string }>;
  interests: string[];
}

const ProfileSummary = ({ name, children, interests }: ProfileSummaryProps) => {
  const navigate = useNavigate();
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  return (
    <Card className="overflow-hidden">
      <div className="bg-primary h-20 relative">
        <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-full bg-white border-4 border-white flex items-center justify-center text-primary font-bold text-xl">
          {initials}
        </div>
      </div>
      <CardContent className="pt-10 px-6 pb-6">
        <h3 className="font-medium text-lg">{name}</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Parent of {children.map((child, index) => (
            <span key={index}>
              {child.name} ({child.age})
              {index < children.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {interests.map((interest, index) => (
            <span key={index} className="inline-block px-2 py-1 bg-muted text-xs rounded-full">
              {interest}
            </span>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/settings')}
        >
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileSummary;
