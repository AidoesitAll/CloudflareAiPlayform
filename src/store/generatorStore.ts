import { create } from 'zustand';
interface GeneratorState {
  prompt: string;
  negativePrompt: string;
  style: string;
  isLoading: boolean;
  imageUrl: string | null;
  setPrompt: (prompt: string) => void;
  setNegativePrompt: (negativePrompt: string) => void;
  setStyle: (style: string) => void;
  startLoading: () => void;
  setResult: (url: string | null) => void;
  reset: () => void;
}
export const useGeneratorStore = create<GeneratorState>((set) => ({
  prompt: '',
  negativePrompt: '',
  style: 'Illustrative',
  isLoading: false,
  imageUrl: null,
  setPrompt: (prompt) => set({ prompt }),
  setNegativePrompt: (negativePrompt) => set({ negativePrompt }),
  setStyle: (style) => set({ style }),
  startLoading: () => set({ isLoading: true, imageUrl: null }),
  setResult: (url) => set({ isLoading: false, imageUrl: url }),
  reset: () => set({ prompt: '', negativePrompt: '', isLoading: false, imageUrl: null }),
}));