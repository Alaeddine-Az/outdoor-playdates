
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, ArrowLeft } from 'lucide-react';
import { useProfileUpdate } from '@/hooks/useProfileUpdate';
import ProfilePictureUploader from '@/components/profile/ProfilePictureUploader';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import InterestsSelector from '@/components/profile/InterestsSelector';

// Common parent interests for selection
const COMMON_INTERESTS = [
  'Arts & Crafts', 'Sports', 'Nature', 'Music', 'Reading',
  'STEM', 'Cooking', 'Games', 'Animals', 'Travel',
  'Swimming', 'Biking', 'Hiking', 'Playgrounds', 'Museums'
];

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading, error } = useProfile();
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  // Hook for profile updates
  const { updateProfile, isSaving, isUploading } = useProfileUpdate(user?.id, profile);

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setName(profile.parent_name || '');
      setDescription(profile.description || '');
      setLocation(profile.location || '');
      setCity(profile.city || '');
      setSelectedInterests(profile.interests || []);
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  // Handle avatar file selection
  const handleAvatarChange = (file: File) => {
    setAvatarFile(file);
    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSave = async () => {
    await updateProfile(
      name,
      description,
      location,
      city,
      selectedInterests,
      avatarFile
    );
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-3xl mx-auto space-y-6">
          <div className="h-10 w-40 bg-muted rounded animate-pulse mb-4"></div>
          <div className="h-32 bg-muted rounded animate-pulse"></div>
          <div className="h-32 bg-muted rounded animate-pulse"></div>
          <div className="h-32 bg-muted rounded animate-pulse"></div>
        </div>
      </AppLayout>
    );
  }

  if (error || !profile) {
    return (
      <AppLayout>
        <div className="p-6 max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "There was an error loading your profile."}
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto animate-fade-in">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/parent-profile')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Profile
        </Button>
        
        <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfilePictureUploader 
                name={name}
                avatarUrl={avatarUrl}
                onFileChange={handleAvatarChange}
                isUploading={isUploading}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <PersonalInfoForm 
                name={name}
                setName={setName}
                description={description}
                setDescription={setDescription}
                location={location}
                setLocation={setLocation}
                city={city}
                setCity={setCity}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <InterestsSelector 
                selectedInterests={selectedInterests}
                setSelectedInterests={setSelectedInterests}
                commonInterests={COMMON_INTERESTS}
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/parent-profile')}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isUploading || isSaving || !name}
              className="button-glow bg-primary hover:bg-primary/90 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EditProfile;
