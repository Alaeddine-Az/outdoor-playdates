
import React, { useState } from 'react';
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

  return (
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
          disabled={isUploading}
        >
          <Camera className="h-4 w-4 mr-2" /> Change Photo
        </Button>
      </div>
    </div>
  );
};

export default ProfilePictureUploader;
