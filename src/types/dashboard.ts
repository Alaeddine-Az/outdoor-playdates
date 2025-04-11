
import { DashboardEvent } from '@/types';

export interface PlaydateData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  families: number;
  status: 'upcoming' | 'pending' | 'completed';
  host?: string;
  host_id?: string;
  start_time?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

export interface ConnectionData {
  id: string;
  name: string;
  childName: string;
  interests: string[];
  distance: string;
}

export interface LocationData {
  latitude: number | null;
  longitude: number | null;
  loading?: boolean;
  error?: string | null;
}

export interface DashboardData {
  upcomingPlaydates: PlaydateData[];
  nearbyPlaydates: PlaydateData[];
  suggestedConnections: ConnectionData[];
  nearbyEvents: DashboardEvent[];
}
