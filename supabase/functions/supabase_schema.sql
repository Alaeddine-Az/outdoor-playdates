CREATE TABLE child_interests (
  child_id TEXT,
  id TEXT,
  interest_id TEXT
);

CREATE TABLE children (
  age TEXT,
  bio TEXT,
  created_at TEXT,
  id TEXT,
  name TEXT,
  parent_id TEXT,
  updated_at TEXT
);

CREATE TABLE connections (
  created_at TEXT,
  id TEXT,
  recipient_id TEXT,
  requester_id TEXT,
  status TEXT,
  updated_at TEXT
);

CREATE TABLE early_signups (
  children TEXT,
  converted_at TEXT,
  converted_user_id TEXT,
  created_at TEXT,
  element TEXT,
  email TEXT,
  id TEXT,
  interests TEXT,
  invited_at TEXT,
  location TEXT,
  parent_name TEXT,
  phone TEXT,
  status TEXT,
  updated_at TEXT
);

CREATE TABLE interests (
  id TEXT,
  name TEXT
);

CREATE TABLE messages (
  content TEXT,
  created_at TEXT,
  id TEXT,
  read TEXT,
  recipient_id TEXT,
  sender_id TEXT
);

CREATE TABLE old_early_signups (
  children TEXT,
  created_at TEXT,
  element TEXT,
  email TEXT,
  id TEXT,
  interests TEXT,
  location TEXT,
  parent_name TEXT,
  phone TEXT,
  referrer TEXT,
  status TEXT
);

CREATE TABLE playdate_participants (
  child_id TEXT,
  child_ids TEXT,
  created_at TEXT,
  element TEXT,
  id TEXT,
  parent_id TEXT,
  playdate_id TEXT,
  status TEXT,
  updated_at TEXT
);

CREATE TABLE playdates (
  created_at TEXT,
  creator_id TEXT,
  description TEXT,
  end_time TEXT,
  id TEXT,
  location TEXT,
  max_participants TEXT,
  start_time TEXT,
  title TEXT,
  updated_at TEXT
);

CREATE TABLE profiles (
  avatar_url TEXT,
  city TEXT,
  created_at TEXT,
  description TEXT,
  element TEXT,
  email TEXT,
  id TEXT,
  interests TEXT,
  location TEXT,
  parent_name TEXT,
  phone TEXT,
  updated_at TEXT
);

CREATE TABLE user_roles (
  created_at TEXT,
  id TEXT,
  role TEXT,
  user_id TEXT
);