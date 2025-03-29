
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Edit, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileSummaryProps {
  name: string;
  children: Array<{ name: string; age: string }>;
  interests: string[];
}

const ProfileSummary = ({ name, children, interests }: ProfileSummaryProps) => {
  const navigate = useNavigate();
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  return (
    <Card className="overflow-hidden rounded-2xl shadow-md border border-muted/30 hover:shadow-lg transition-all duration-300">
      <div className="bg-gradient-to-r from-primary to-accent h-24 relative">
        <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-2xl bg-white border-4 border-white flex items-center justify-center text-primary font-bold text-xl shadow-md">
          {initials}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-3 right-3 text-white/70">
          <Sparkles className="h-5 w-5" />
        </div>
      </div>
      <CardContent className="pt-12 px-6 pb-6">
        <h3 className="font-medium text-xl">{name}</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Parent of {children.map((child, index) => (
            <span key={index}>
              {child.name} ({child.age})
              {index < children.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-5">
          {interests.map((interest, index) => (
            <motion.span 
              key={index} 
              className="inline-block px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {interest}
            </motion.span>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full rounded-xl border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
          onClick={() => navigate('/edit-profile')}
        >
          <Edit className="h-4 w-4 mr-2 text-primary group-hover:rotate-12 transition-transform duration-300" />
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileSummary;
