
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Edit, Star, Users } from 'lucide-react';
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
    <Card className="overflow-hidden rounded-3xl shadow-md border-none bg-white hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-play-yellow rounded-full flex items-center justify-center mb-4 shadow-md">
            <span className="text-2xl font-bold text-play-orange">{initials}</span>
          </div>
          
          <h3 className="font-bold text-xl">{name}</h3>
          
          <div className="mt-2 mb-4">
            {children.map((child, index) => (
              <motion.span 
                key={index}
                className="inline-block bg-play-beige text-play-orange rounded-full px-3 py-1 text-sm font-medium m-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="inline h-3 w-3 mr-1" />
                {child.name} ({child.age})
              </motion.span>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-5 w-full">
            {interests.map((interest, index) => (
              <motion.span 
                key={index} 
                className="inline-block px-3 py-1.5 bg-play-lime text-green-800 text-xs font-medium rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {interest}
              </motion.span>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full rounded-full border-2 border-play-orange/20 hover:border-play-orange/50 hover:bg-play-orange/5 text-play-orange transition-all duration-300 group"
            onClick={() => navigate('/edit-profile')}
          >
            <Edit className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            Edit Profile
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileSummary;
