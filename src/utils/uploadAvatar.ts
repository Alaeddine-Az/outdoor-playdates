import { supabase } from '@/integrations/supabase/client';

export const uploadAvatar = async (file: File, userId: string) => {
  if (!file || !userId) return { error: 'Missing file or user ID' };

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { data, error } = await supabase.storage
    .from('profiles')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error('Upload error:', error.message);
    return { error: error.message };
  }

  const { data: publicUrlData } = supabase.storage
    .from('profiles')
    .getPublicUrl(filePath);

  return {
    url: publicUrlData?.publicUrl ?? '',
    path: filePath,
    error: null,
  };
};
