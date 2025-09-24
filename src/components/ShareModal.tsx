import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { socialPlatforms } from "@/lib/socials";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  prompt: string;
}
export function ShareModal({ isOpen, onClose, imageUrl, prompt }: ShareModalProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const fullImageUrl = new URL(imageUrl, window.location.origin).href;
  const handleCopy = () => {
    navigator.clipboard.writeText(fullImageUrl);
    setHasCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setHasCopied(false), 2000);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cream text-navy border-navy/20 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Share your Creation</DialogTitle>
          <DialogDescription className="text-navy/70">
            Share your masterpiece with the world or copy the link.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Input
              id="link"
              defaultValue={fullImageUrl}
              readOnly
              className="bg-white/50 border-navy/20"
            />
          </div>
          <Button type="submit" size="icon" className="px-3 bg-navy text-cream hover:bg-navy/90" onClick={handleCopy}>
            <span className="sr-only">Copy</span>
            {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="pt-4">
          <p className="text-sm font-medium text-navy/80 mb-3 text-center">Share on social media</p>
          <div className="flex justify-center gap-4">
            {socialPlatforms.map(({ name, Icon, getUrl }) => (
              <a
                key={name}
                href={getUrl(fullImageUrl, `Check out this artwork I created with CanvasSpark AI: "${prompt}"`)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/50 rounded-full text-navy/70 border border-navy/10 hover:bg-magenta hover:text-white hover:border-magenta transition-all duration-300 ease-in-out"
                aria-label={`Share on ${name}`}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}