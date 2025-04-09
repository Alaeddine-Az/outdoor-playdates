
export interface ParentProfile {
  id: string;
  parent_name: string;
  email: string;
  description?: string;
  location?: string; // ZIP code (private)
  city?: string; // Derived from ZIP (public)
  avatar_url?: string;
  interests?: string[];
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: string;
  bio?: string;
  parent_id: string;
  created_at: string;
  updated_at: string;
}

export interface Connection {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  location: string;
  city: string;
  address: string;
  start_time: string;
  end_time: string;
  host_id: string;
  max_families?: number;
  created_at: string;
  updated_at: string;
}

export interface EventParticipant {
  id: string;
  event_id: string;
  parent_id: string;
  children_ids: string[];
  joined_at: string;
}

// Update the PlaydateParticipant interface to match the database structure
export interface PlaydateParticipant {
  id: string;
  playdate_id: string;
  child_id: string; // Keep this for backward compatibility
  child_ids?: string[]; // Optional array of child IDs
  parent_id?: string; // Optional parent ID
  created_at: string;
  updated_at: string;
}

// Add Playdate interface to represent the playdate structure
export interface Playdate {
  id: string;
  title: string;
  description?: string;
  location: string;
  start_time: string;
  end_time: string;
  creator_id: string;
  max_participants?: number;
  status?: string; // Add status field to match the database
  created_at: string;
  updated_at: string;
}
