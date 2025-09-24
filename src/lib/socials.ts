import { Twitter, Facebook, Reddit, Pin, LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
interface SocialPlatform {
  name: string;
  Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  getUrl: (url: string, text: string) => string;
}
export const socialPlatforms: SocialPlatform[] = [
  {
    name: 'Twitter',
    Icon: Twitter,
    getUrl: (url, text) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: 'Facebook',
    Icon: Facebook,
    getUrl: (url, text) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
  },
  {
    name: 'Reddit',
    Icon: Reddit,
    getUrl: (url, text) => `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
  },
  {
    name: 'Pinterest',
    Icon: Pin,
    getUrl: (url, text) => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`,
  },
];