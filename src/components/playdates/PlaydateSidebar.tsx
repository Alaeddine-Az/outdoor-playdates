
import React from 'react';
import SuggestedPlaydateCard from './SuggestedPlaydateCard';
import PlaydateGroupCard from './PlaydateGroupCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PlaydateSidebar = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
        <h2 className="text-lg font-medium mb-4">Suggested Playdates</h2>
        
        <div className="space-y-3">
          <SuggestedPlaydateCard 
            title="Family Board Game Day"
            date="June 22, 2025"
            location="Calgary Central Library"
            numFamilies={6}
          />
          
          <SuggestedPlaydateCard 
            title="Community Playground Meet"
            date="June 25, 2025"
            location="North Glenmore Park"
            numFamilies={8}
          />
          
          <SuggestedPlaydateCard 
            title="Arts & Crafts Session"
            date="June 29, 2025"
            location="Wildflower Arts Centre"
            numFamilies={4}
          />
        </div>
      </section>
      
      <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
        <h2 className="text-lg font-medium mb-4">Playdate Groups</h2>
        
        <div className="space-y-3">
          <PlaydateGroupCard 
            id="1"
            name="Calgary STEM Parents"
            members={12}
            lastActive="2 days ago"
          />
          
          <PlaydateGroupCard 
            id="2"
            name="NW Calgary Outdoor Play"
            members={23}
            lastActive="5 hours ago"
          />
          
          <PlaydateGroupCard 
            id="3"
            name="Indoor Winter Activities"
            members={18}
            lastActive="1 day ago"
          />
        </div>
        
        <div className="mt-4">
          <Button variant="outline" className="w-full" onClick={() => navigate('/groups')}>
            Explore All Groups
          </Button>
        </div>
      </section>
    </div>
  );
};

export default PlaydateSidebar;
