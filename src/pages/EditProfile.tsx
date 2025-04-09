import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Save, ArrowLeft } from 'lucide-react';
import { useProfileUpdate } from '@/hooks/useProfileUpdate';
import ProfilePictureUploader from '@/components/profile/ProfilePictureUploader';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import InterestsSelector from '@/components/profile/InterestsSelector';
import ChildrenSection from '@/components/profile/ChildrenSection';

// Common parent interests for selection
const COMMON_INTERESTS = [
  'Arts & Crafts', 'Sports', 'Nature', 'Music', 'Reading',
  'STEM', 'Cooking', 'Games', 'Animals', 'Travel',
  'Swimming', 'Biking', 'Hiking', 'Playgrounds', 'Museums'
];

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, children, loading, error } = useProfile();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const { updateProfile, isSaving, isUploading } = useProfileUpdate(user?.id, profile);

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

  const handleAvatarChange = (file: File) => {
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

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
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="h-10 w-40 bg-muted rounded animate-pulse mb-4"></div>
        <div className="h-32 bg-muted rounded animate-pulse"></div>
        <div className="h-32 bg-muted rounded animate-pulse"></div>
        <div className="h-32 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground mb-6">
          {error || "There was an error loading your profile."}
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/parent-profile')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Profile
      </Button>

      <div className="space-y-8">
        {/* Parent Information Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Parent Information</h2>

          <Card className="bg-white border">
            <CardContent className="p-6 space-y-8">
              <ProfilePictureUploader 
                name={name}
                avatarUrl={avatarUrl}
                onFileChange={handleAvatarChange}
                isUploading={isUploading}
              />

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

              <InterestsSelector 
                selectedInterests={selectedInterests}
                setSelectedInterests={setSelectedInterests}
                commonInterests={COMMON_INTERESTS}
              />
            </CardContent>
          </Card>
        </section>

        {/* Children Section */}
        <section>
          <ChildrenSection children={children} />
        </section>

        {/* Save Button */}
        <div className="flex justify-end sticky bottom-4 bg-background pt-4 pb-2 px-4 rounded-lg shadow-lg border z-10">
          <Button 
            variant="outline" 
            onClick={() => navigate('/parent-profile')}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isUploading || isSaving || !name}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
