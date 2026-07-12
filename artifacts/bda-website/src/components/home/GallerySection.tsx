import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Play } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function GallerySection() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const [photosRes, videosRes] = await Promise.all([
          fetch("/api/photos"),
          fetch("/api/videos")
        ]);
        if (photosRes.ok && videosRes.ok) {
          const photosData = await photosRes.json();
          const videosData = await videosRes.json();
          setPhotos(photosData.filter((n: any) => n.isActive).slice(0, 8));
          setVideos(videosData.filter((n: any) => n.isActive).slice(0, 3));
        }
      } catch (e) {
        console.error("Failed to fetch media", e);
      } finally {
        setLoading(false);
      }
    }
    fetchMedia();
  }, []);

  return (
    <div className="py-12 bg-gray-100">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="flex justify-between items-end mb-8 border-b border-gray-300 pb-4">
          <h2 className="text-3xl font-bold text-[#1a3a6e]">Photo & Video Gallery</h2>
          <Link href="/media" className="text-sm font-semibold text-orange-600 hover:underline">View Complete Gallery</Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Photos */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {loading ? (
                Array.from({length: 8}).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-md" />
                ))
              ) : photos.length > 0 ? (
                photos.map((photo, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-md overflow-hidden relative group cursor-pointer shadow-sm">
                    {photo.imageUrl && <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                      View
                    </div>
                    <div className="absolute bottom-2 left-2 text-xs text-white font-semibold bg-black/50 px-2 py-1 rounded max-w-[calc(100%-16px)] truncate">
                      {photo.title}
                    </div>
                  </div>
                ))
              ) : (
                [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-gray-300 to-gray-400 rounded-md overflow-hidden relative group cursor-pointer shadow-sm">
                    <div className="absolute bottom-2 left-2 text-xs text-white font-semibold bg-black/50 px-2 py-1 rounded">
                      Photo {i}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Videos */}
          <div className="lg:w-1/3">
            <div className="space-y-4">
              {loading ? (
                Array.from({length: 3}).map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded-md" />
                ))
              ) : videos.length > 0 ? (
                videos.map((video, i) => (
                  <a key={i} href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="block h-28 bg-gray-900 rounded-md overflow-hidden relative group shadow-sm">
                    {video.thumbnailUrl && <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />}
                    {!video.thumbnailUrl && <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800" />}
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 group-hover:bg-orange-500/80 transition-colors flex items-center justify-center z-10">
                        <Play className="h-6 w-6 text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 text-xs text-white font-semibold bg-black/50 px-2 py-1 rounded z-10 max-w-[calc(100%-16px)] truncate">
                      {video.title}
                    </div>
                  </a>
                ))
              ) : (
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-28 bg-gradient-to-r from-blue-900 to-blue-800 rounded-md overflow-hidden relative group cursor-pointer flex items-center justify-center shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-white/20 group-hover:bg-orange-500/80 transition-colors flex items-center justify-center z-10">
                      <Play className="h-6 w-6 text-white ml-1" />
                    </div>
                    <div className="absolute bottom-2 left-2 text-xs text-white font-semibold bg-black/50 px-2 py-1 rounded z-10">
                      Video {i}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
