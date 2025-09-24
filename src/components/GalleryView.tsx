import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Trash2, ImageOff, Flag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGalleryStore } from "@/store/galleryStore";
import { reportImage } from "@/lib/reportingService";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ShareModal } from "./ShareModal";
import type { GalleryItem } from "../../worker/types";
export function GalleryView() {
  const { items, isLoading, error, fetchGallery, removeItem } = useGalleryStore();
  const [sharingItem, setSharingItem] = useState<GalleryItem | null>(null);
  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);
  const handleDownload = (url: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = url;
    // Sanitize prompt for filename
    const filename = prompt.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 50);
    link.download = `${filename || 'canvas-spark-art'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Artwork download started!");
  };
  const handleDelete = (id: string) => {
    toast.promise(removeItem(id), {
      loading: 'Deleting artwork...',
      success: 'Artwork deleted!',
      error: 'Failed to delete artwork.',
    });
  };
  const handleReport = (id: string, prompt: string) => {
    toast.promise(reportImage(id, prompt), {
      loading: 'Submitting report...',
      success: 'Content reported for review. Thank you.',
      error: 'Failed to submit report.',
    });
  };
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="aspect-square rounded-lg bg-navy/10" />
          ))}
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center py-16">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }
    if (items.length === 0) {
      return (
        <div className="text-center py-16 col-span-full">
          <ImageOff className="w-16 h-16 mx-auto text-navy/30 mb-4" />
          <h3 className="font-display text-2xl font-bold text-navy">Your Gallery is Empty</h3>
          <p className="mt-2 text-navy/70">
            Go to the Generator to spark your first creation!
          </p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            layout
          >
            <Card className="bg-white/50 border-navy/10 rounded-lg overflow-hidden group relative transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2">
              <CardHeader className="p-0">
                <div className="aspect-square overflow-hidden bg-navy/5">
                  <img
                    src={item.url}
                    alt={item.prompt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </CardHeader>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                <CardContent className="p-0">
                  <p className="text-sm font-medium line-clamp-2">
                    {item.prompt}
                  </p>
                </CardContent>
                <CardFooter className="p-0 mt-4 flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setSharingItem(item)}
                    className="bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleReport(item.id, item.prompt)}
                    className="bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30"
                  >
                    <Flag className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleDownload(item.url, item.prompt)}
                    className="bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className="bg-red-500/20 text-white border-red-500/30 backdrop-blur-sm hover:bg-red-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-cream text-navy border-navy/20">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your artwork.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-navy/50 hover:bg-navy/10">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };
  return (
    <>
      {sharingItem && (
        <ShareModal
          isOpen={!!sharingItem}
          onClose={() => setSharingItem(null)}
          imageUrl={sharingItem.url}
          prompt={sharingItem.prompt}
        />
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        <div className="text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-navy">
            Your Creations
          </h1>
          <p className="mt-4 text-lg text-navy/70 max-w-2xl mx-auto">
            A collection of the beautiful artwork you've sparked into existence.
          </p>
        </div>
        {renderContent()}
      </motion.div>
    </>
  );
}