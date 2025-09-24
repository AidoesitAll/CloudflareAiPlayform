import { create } from 'zustand';
interface SessionState {
  isVerified: boolean;
  verify: () => void;
}
const checkVerification = (): boolean => {
  try {
    const storedValue = localStorage.getItem('canvas-spark-age-verified');
    return storedValue === 'true';
  } catch (error) {
    // localStorage may not be available (e.g., SSR, private browsing)
    console.warn('Could not access localStorage for age verification.');
    return false;
  }
};
export const useSessionStore = create<SessionState>((set) => ({
  isVerified: checkVerification(),
  verify: () => {
    try {
      localStorage.setItem('canvas-spark-age-verified', 'true');
    } catch (error) {
      // Handle potential storage errors
      console.error('Failed to save verification status to localStorage', error);
    }
    set({ isVerified: true });
  },
}));