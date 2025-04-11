
export interface Playdate {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  families: number;
  status?: string;
  host?: string;
  host_id?: string;
  attendees?: number;
  start_time?: string;
  end_time?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

export interface UsePlaydatesOptions {
  userLocation?: {
    latitude: number | null;
    longitude: number | null;
  };
  maxDistance?: number;
}

export interface UsePlaydatesResult {
  allPlaydates: Playdate[];
  myPlaydates: Playdate[];
  pastPlaydates: Playdate[];
  nearbyPlaydates: Playdate[];
  loading: boolean;
  error: any;
}
