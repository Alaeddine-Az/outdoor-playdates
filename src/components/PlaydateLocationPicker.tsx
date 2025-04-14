
import React, { useState } from 'react';
import { MobileLocationSearch } from './MobileLocationSearch';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FormDescription } from '@/components/ui/form';

interface PlaydateLocationPickerProps {
  defaultLocation?: string;
  onLocationSelected: (locationName: string, latitude: number, longitude: number) => void;
}

export const PlaydateLocationPicker: React.FC<PlaydateLocationPickerProps> = ({ 
  defaultLocation = '', 
  onLocationSelected 
}) => {
  const [location, setLocation] = useState(defaultLocation);
  const [coordinates, setCoordinates] = useState<{lat: number | null, lng: number | null}>({
    lat: null,
    lng: null
  });

  const handleLocationChange = (value: string) => {
    setLocation(value);
  };

  const handleCoordinatesChange = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    onLocationSelected(location, lat, lng);
  };

  return (
    <Card className="p-4 bg-black border-gray-700">
      <div className="space-y-3">
        <div>
          <Label htmlFor="location" className="text-white text-lg font-medium">
            Where is your playdate happening?
          </Label>
          <FormDescription className="text-gray-400 mt-1">
            Search for a location or use your current location
          </FormDescription>
        </div>
        
        <MobileLocationSearch
          value={location}
          onChange={handleLocationChange}
          onCoordinatesChange={handleCoordinatesChange}
          placeholder="Search for a location..."
        />
        
        {location && coordinates.lat && coordinates.lng && (
          <div className="mt-2 text-sm text-gray-400">
            <p>Selected: {location}</p>
            <p className="text-xs opacity-70">
              Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
