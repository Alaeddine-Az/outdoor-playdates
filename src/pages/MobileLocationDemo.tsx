
import React, { useState } from 'react';
import { PlaydateLocationPicker } from '@/components/PlaydateLocationPicker';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const MobileLocationDemo = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const handleLocationSelected = (locationName: string, lat: number, lng: number) => {
    setSelectedLocation(locationName);
    setLatitude(lat);
    setLongitude(lng);
    
    console.log('Location selected:', { locationName, lat, lng });
  };

  const handleCreatePlaydate = () => {
    if (!selectedLocation || latitude === null || longitude === null) {
      toast({
        title: "Location required",
        description: "Please select a location for your playdate",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success!",
      description: `Playdate location set to: ${selectedLocation}`,
    });
    
    // Here you would typically save the playdate with the location data
    console.log('Creating playdate with location:', {
      name: selectedLocation,
      latitude,
      longitude
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="sticky top-0 z-10 bg-black border-b border-gray-800 px-4 py-3 flex items-center">
        <h1 className="text-xl font-bold">Create Playdate</h1>
      </div>
      
      <div className="flex-1 px-4 py-6 space-y-6 overflow-auto">
        <h2 className="text-lg font-medium">Location Information</h2>
        
        <PlaydateLocationPicker 
          onLocationSelected={handleLocationSelected}
        />
        
        {selectedLocation && (
          <div className="bg-gray-900 rounded-lg p-4 mt-4">
            <h3 className="font-medium mb-2">Selected Location</h3>
            <p>{selectedLocation}</p>
            {latitude && longitude && (
              <p className="text-sm text-gray-400 mt-1">
                GPS: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
            )}
          </div>
        )}
        
        <div className="pt-6">
          <Button 
            onClick={handleCreatePlaydate}
            className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 rounded-xl"
            disabled={!selectedLocation}
          >
            {selectedLocation ? 'Continue with Selected Location' : 'Select a Location First'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileLocationDemo;
