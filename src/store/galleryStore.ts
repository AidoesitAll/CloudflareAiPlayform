import { create } from 'zustand';
import { getGallery, deleteImage } from '@/lib/galleryService';
import type { GalleryItem } from '../../worker/types';
interface GalleryState {
  items: GalleryItem[];
  isLoading: boolean;
  error: string | null;
  fetchGallery: () => Promise<void>;
  addItem: (item: GalleryItem) => void;
  removeItem: (id: string) => Promise<void>;
}
export const useGalleryStore = create<GalleryState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  fetchGallery: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await getGallery();
      set({ items, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load gallery.', isLoading: false });
      console.error(error);
    }
  },
  addItem: (item) => {
    set((state) => ({
      items: [item, ...state.items],
    }));
  },
  removeItem: async (id) => {
    const originalItems = get().items;
    // Optimistic update
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
    try {
      await deleteImage(id);
    } catch (error) {
      // Revert on error
      set({ items: originalItems, error: 'Failed to delete item.' });
      console.error(error);
    }
  },
}));