import type { GalleryItem } from '../../worker/types';
export const getGallery = async (): Promise<GalleryItem[]> => {
  const response = await fetch('/api/gallery');
  if (!response.ok) {
    throw new Error('Failed to fetch gallery');
  }
  const { data } = await response.json();
  return data;
};
export const saveImage = async (prompt: string, imageBlob: Blob): Promise<GalleryItem> => {
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('image', imageBlob, 'artwork.png');
  const response = await fetch('/api/gallery', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to save image');
  }
  const { data } = await response.json();
  return data;
};
export const deleteImage = async (id: string): Promise<void> => {
  const response = await fetch(`/api/gallery/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete image');
  }
};