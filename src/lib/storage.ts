import { supabase } from '@/integrations/supabase/client';

export const uploadFile = async (
  file: File,
  folder: string,
  userId?: string
): Promise<string | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = userId ? `${userId}/${folder}/${fileName}` : `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file);

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
  return data.publicUrl;
};
