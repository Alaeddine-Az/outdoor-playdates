
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PlaydateCard from './PlaydateCard';
import { motion } from 'framer-motion';

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
    <Card className="rounded-2xl overflow-hidden border border-muted/30 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-muted/30 bg-gradient-to-r from-white to-muted/20">
        <CardTitle className="text-xl font-semibold flex items-center">
          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <Calendar className="h-4 w-4 text-primary" />
          </span>
          {title}
        </CardTitle>
        {showNewButton && (
          <Button 
            className="button-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-xl shadow-md"
            onClick={() => navigate('/create-playdate')}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Playdate
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-5">
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
              className="text-center py-12 px-4 bg-muted/20 rounded-xl border border-muted/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="text-lg font-medium mb-2">No playdates found</h4>
              <p className="text-muted-foreground mb-6">
                Time to create some outdoor adventures for the kids!
              </p>
              {showNewButton && (
                <Button 
                  className="button-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-xl shadow-md"
                  onClick={() => navigate('/create-playdate')}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
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
              className="text-primary font-medium hover:bg-primary/5 rounded-xl group"
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

// Adding the Calendar icon inside the component file to avoid creating a circular import
const Calendar = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
};

export default PlaydatesList;
