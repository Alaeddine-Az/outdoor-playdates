
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ArrowRight, PartyPopper, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PlaydateCard from './PlaydateCard';
import { motion } from 'framer-motion';
import BearCharacter from '../characters/BearCharacter';

interface Playdate {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  status: 'upcoming' | 'pending' | 'completed';
}

interface PlaydatesListProps {
  title: string;
  playdates: Playdate[];
  showNewButton?: boolean;
  viewAllLink?: string;
}

const PlaydatesList = ({ title, playdates, showNewButton = false, viewAllLink = '/playdates' }: PlaydatesListProps) => {
  const navigate = useNavigate();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <Card className="rounded-3xl overflow-hidden border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-muted/30 bg-gradient-to-r from-play-yellow/20 to-play-beige">
        <CardTitle className="text-xl font-semibold flex items-center">
          <span className="w-10 h-10 rounded-full bg-play-yellow flex items-center justify-center mr-3 shadow-sm">
            <CalendarDays className="h-5 w-5 text-play-orange" />
          </span>
          {title}
        </CardTitle>
        {showNewButton && (
          <Button 
            className="button-glow bg-play-orange hover:bg-play-orange/90 text-white rounded-full shadow-sm"
            onClick={() => navigate('/create-playdate')}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Playdate
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-5 bg-white">
        <motion.div 
          className="space-y-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {playdates.length > 0 ? (
            playdates.map((playdate) => (
              <motion.div key={playdate.id} variants={item}>
                <PlaydateCard 
                  id={playdate.id}
                  title={playdate.title}
                  date={playdate.date}
                  time={playdate.time}
                  location={playdate.location}
                  attendees={playdate.attendees}
                  status={playdate.status}
                />
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="text-center py-12 px-4 bg-play-beige/40 rounded-xl border border-play-beige"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mx-auto mb-6">
                <BearCharacter animation="bounce" size="md" />
              </div>
              <h4 className="text-lg font-bold mb-2">No playdates found</h4>
              <p className="text-muted-foreground mb-6">
                Time to create some outdoor adventures for the kids!
              </p>
              {showNewButton && (
                <Button 
                  className="button-glow bg-play-orange hover:bg-play-orange/90 text-white rounded-full shadow-md"
                  onClick={() => navigate('/create-playdate')}
                >
                  <PartyPopper className="h-4 w-4 mr-2" />
                  Create Your First Playdate
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
        
        {playdates.length > 0 && (
          <div className="mt-5 text-center">
            <Button 
              variant="ghost" 
              className="text-play-orange font-medium hover:bg-play-orange/5 rounded-full group"
              onClick={() => navigate(viewAllLink)}
            >
              View All Playdates
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlaydatesList;
