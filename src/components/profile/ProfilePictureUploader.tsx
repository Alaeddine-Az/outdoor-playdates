
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface ProfilePictureUploaderProps {
  name: string;
  avatarUrl: string;
  onFileChange: (file: File) => void;
  isUploading?: boolean;
}

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({
  name,
  avatarUrl,
  onFileChange,
  isUploading = false
}) => {
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-3">
      <h3 className="text-base font-medium">Profile Picture</h3>
      <p className="text-sm text-muted-foreground">
        Upload a new profile picture or avatar
      </p>
      
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20 border border-muted">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
            {getInitials(name || 'U')}
          </AvatarFallback>
        </Avatar>
        
        <Button 
          variant="outline" 
          className="h-9"
          onClick={() => document.getElementById('avatar-upload')?.click()}
          disabled={isUploading}
        >
          Choose File
        </Button>
        
        <input 
          id="avatar-upload" 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleAvatarChange}
        />
      </div>
    </div>
  );
};

export default ProfilePictureUploader;
