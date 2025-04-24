
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
}

export interface UsePlaydatesOptions {
  userLocation?: {
    latitude: number | null;
    longitude: number | null;
    loading?: boolean;
    error?: string | null;
    refreshLocation?: () => Promise<void>;
  };
  maxDistance?: number;
}
