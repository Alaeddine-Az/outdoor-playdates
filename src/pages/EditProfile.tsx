
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, XCircle, Camera, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ParentProfile } from '@/types';

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
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null;
    
    try {
      setIsUploading(true);
      
      // Create a unique filename
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('profiles')
        .upload(filePath, avatarFile);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase
        .storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Upload avatar if changed
      let finalAvatarUrl = profile?.avatar_url || null;
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) finalAvatarUrl = uploadedUrl;
      }
      
      // Validate postal code and derive city
      let derivedCity = city;
      if (location !== profile?.location) {
        // In a real app, you would validate postal code with an API
        // and get the city name. Here we'll just use the one entered.
        derivedCity = city || 'Unknown City';
      }
      
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          parent_name: name,
          description,
          location,
          city: derivedCity,
          interests: selectedInterests,
          avatar_url: finalAvatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      // Redirect to profile page
      navigate('/parent-profile');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addInterest = (interest: string) => {
    if (interest && !selectedInterests.includes(interest)) {
      setSelectedInterests([...selectedInterests, interest]);
    }
    setCustomInterest('');
  };

  const removeInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter(i => i !== interest));
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      removeInterest(interest);
    } else {
      addInterest(interest);
    }
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
        <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="relative group">
                  <Avatar className="w-28 h-28 border-2 border-muted">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-4xl">
                      {name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera className="h-6 w-6" />
                  </label>
                  
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                  />
                </div>
                
                <div className="text-center sm:text-left">
                  <h3 className="font-medium text-lg mb-2">Profile Photo</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload a clear photo to help other parents recognize you.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    <Camera className="h-4 w-4 mr-2" /> Change Photo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">About You</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Tell other parents about yourself and your family"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Postal Code (Private)</Label>
                  <Input 
                    id="location" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    placeholder="e.g., T2A 3K1"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your postal code is private and used for finding nearby playdates
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City (Public)</Label>
                  <Input 
                    id="city" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    placeholder="e.g., Calgary"
                  />
                  <p className="text-xs text-muted-foreground">
                    This city name will be shown on your public profile
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Interests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Select interests that help other parents connect with you. These will be visible on your profile.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedInterests.map((interest) => (
                  <Badge 
                    key={interest}
                    variant="secondary"
                    className="rounded-full py-1.5 px-3 flex items-center gap-1 text-sm"
                  >
                    {interest}
                    <XCircle 
                      className="h-4 w-4 ml-1 cursor-pointer" 
                      onClick={() => removeInterest(interest)}
                    />
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add a custom interest..."
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customInterest) {
                      e.preventDefault();
                      addInterest(customInterest);
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  onClick={() => addInterest(customInterest)}
                  disabled={!customInterest}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Add
                </Button>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Common Interests</p>
                <div className="flex flex-wrap gap-2">
                  {COMMON_INTERESTS.map((interest) => (
                    <Badge 
                      key={interest}
                      variant={selectedInterests.includes(interest) ? "default" : "outline"}
                      className="rounded-full py-1.5 px-3 cursor-pointer"
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
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
