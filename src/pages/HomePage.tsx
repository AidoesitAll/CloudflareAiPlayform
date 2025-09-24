import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { generateImage } from "@/lib/imageService";
import { saveImage } from "@/lib/galleryService";
import { reportImage } from "@/lib/reportingService";
import { enhancePrompt } from "@/lib/promptService";
import { useGeneratorStore } from "@/store/generatorStore";
import { useGalleryStore } from "@/store/galleryStore";
import { Sparkles, Wand2, Check, Save, Flag, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ShareModal } from "@/components/ShareModal";
const artStyles = ["Illustrative", "Cinematic", "Photorealistic", "Anime", "Fantasy", "Sci-Fi"];
export function HomePage() {
  const {
    prompt,
    negativePrompt,
    style,
    isLoading,
    imageUrl,
    setPrompt,
    setNegativePrompt,
    setStyle,
    startLoading,
    setResult,
  } = useGeneratorStore();
  const { addItem } = useGalleryStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    setIsSaved(false);
    startLoading();
    try {
      const url = await generateImage(prompt, negativePrompt, style);
      setResult(url);
      toast.success("Artwork sparked into existence!");
    } catch (error: any) {
      console.error("Image generation failed:", error);
      toast.error(error.message || "Failed to spark artwork. Please try again.");
      setResult(null);
    }
  };
  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);
    toast.promise(enhancePrompt(prompt), {
      loading: 'Enhancing your prompt with AI...',
      success: (enhanced) => {
        setPrompt(enhanced);
        return 'Prompt enhanced successfully!';
      },
      error: (err) => err.message || 'Failed to enhance prompt.',
      finally: () => setIsEnhancing(false),
    });
  };
  const handleSaveToGallery = async () => {
    if (!imageUrl || !prompt || isSaving || isSaved) return;
    setIsSaving(true);
    try {
      const response = await fetch(imageUrl);
      const imageBlob = await response.blob();
      const savedItem = await saveImage(prompt, imageBlob);
      addItem(savedItem);
      setIsSaved(true);
      toast.success("Artwork saved to your gallery!");
    } catch (error) {
      console.error("Failed to save image:", error);
      toast.error("Could not save to gallery. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  const handleReport = () => {
    if (!imageUrl) return;
    toast.promise(reportImage(imageUrl, prompt), {
      loading: 'Submitting report...',
      success: 'Content reported for review. Thank you for your feedback.',
      error: 'Failed to submit report.',
    });
  };
  return (
    <div className="space-y-16">
      {imageUrl && prompt && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          imageUrl={imageUrl}
          prompt={prompt}
        />
      )}
      <Card className="bg-white/30 border-navy/10 shadow-lg p-8 md:p-12">
        <CardContent className="p-0">
          <div className="text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-navy">
              Transform Words into Art
            </h1>
            <p className="mt-4 text-lg text-navy/70 max-w-2xl mx-auto">
              Describe your vision, and let our AI bring it to life. What will you create today?
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-10 max-w-2xl mx-auto space-y-6">
            <div className="relative">
              <Wand2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/40" />
              <Input
                type="text"
                placeholder="A majestic lion wearing a crown, sitting on a throne..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-32 py-6 text-base bg-white/50 border-navy/20 focus:ring-magenta focus:border-magenta"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleEnhancePrompt}
                disabled={isLoading || isEnhancing || !prompt.trim()}
                className="absolute right-[110px] top-1/2 -translate-y-1/2 text-magenta hover:bg-magenta/10"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Enhance
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                placeholder="Negative prompt (e.g., blurry, ugly, text, watermark)"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                disabled={isLoading}
                className="bg-white/50 border-navy/20 focus:ring-magenta focus:border-magenta resize-none"
                rows={2}
              />
              <Select value={style} onValueChange={setStyle} disabled={isLoading}>
                <SelectTrigger className="h-full bg-white/50 border-navy/20 focus:ring-magenta focus:border-magenta">
                  <SelectValue placeholder="Select a style" />
                </SelectTrigger>
                <SelectContent className="bg-cream border-navy/20 text-navy">
                  {artStyles.map((s) => (
                    <SelectItem key={s} value={s} className="focus:bg-magenta/20">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-center">
              <Button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="bg-magenta text-white font-semibold py-6 px-10 hover:bg-magenta/90 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 disabled:bg-navy/30 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Spark
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="flex justify-center">
              <Skeleton className="w-full max-w-2xl aspect-square rounded-lg bg-navy/10" />
            </div>
            <p className="mt-4 text-navy/70 animate-pulse">
              Sparking your vision... please wait.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6 animate-fade-in"
          >
            <h2 className="text-center font-display text-3xl font-bold text-navy">
              Your Creation!
            </h2>
            <Card className="max-w-2xl mx-auto overflow-hidden bg-white/30 border-navy/10 shadow-xl">
              <CardContent className="p-0">
                <img
                  src={imageUrl}
                  alt={prompt}
                  className="w-full h-full object-cover aspect-square"
                />
              </CardContent>
            </Card>
            <div className="text-center flex items-center justify-center gap-4">
              <Button
                onClick={handleSaveToGallery}
                disabled={isSaving || isSaved}
                className="bg-navy text-cream font-semibold py-6 px-8 hover:bg-navy/90 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 disabled:bg-navy/50 disabled:cursor-not-allowed"
              >
                {isSaved ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Saved!
                  </>
                ) : isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 mr-2"
                    >
                      <Save />
                    </motion.div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save to Gallery
                  </>
                )}
              </Button>
              <Button
                onClick={() => setIsShareModalOpen(true)}
                variant="outline"
                className="text-navy bg-white/30 border-navy/20 hover:bg-white/50 font-semibold py-6 px-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
              <Button
                onClick={handleReport}
                variant="outline"
                className="text-navy/70 border-navy/20 bg-white/30 hover:bg-white/50 hover:text-navy font-semibold py-6 px-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
              >
                <Flag className="w-5 h-5 mr-2" />
                Report
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}