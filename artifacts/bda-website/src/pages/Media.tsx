import { useState, useEffect } from "react";
import { Play, Images, Video } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function Media() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "photos" | "videos">("all");
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const [photosRes, videosRes] = await Promise.all([
          fetch("/api/photos"),
          fetch("/api/videos"),
        ]);
        if (photosRes.ok) setPhotos((await photosRes.json()).filter((n: any) => n.isActive));
        if (videosRes.ok) setVideos((await videosRes.json()).filter((n: any) => n.isActive));
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchMedia();
  }, []);

  const showPhotos = tab === "all" || tab === "photos";
  const showVideos = tab === "all" || tab === "videos";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex text-sm text-gray-500">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li className="mx-2">/</li>
            <li className="text-gray-900 font-medium">Media</li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold text-[#1a3a6e] mb-8 border-b-2 border-orange-500 pb-2 inline-block">
          Photo & Video Gallery
        </h1>
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { key: "all", label: "All Media" },
            { key: "photos", label: `Photos (${photos.length})` },
            { key: "videos", label: `Videos (${videos.length})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key as any)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${
                tab === key
                  ? "bg-[#1a3a6e] text-white border-[#1a3a6e]"
                  : "bg-white text-gray-600 border-gray-300 hover:border-[#1a3a6e] hover:text-[#1a3a6e]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Photos Grid */}
          {showPhotos && (
            <div className={showVideos ? "lg:w-2/3" : "w-full"}>
              {showVideos && (
                <div className="flex items-center gap-2 mb-4">
                  <Images className="h-5 w-5 text-[#1a3a6e]" />
                  <h2 className="text-xl font-bold text-[#1a3a6e]">Photographs</h2>
                  {!loading && <span className="text-sm text-gray-500">({photos.length} photos)</span>}
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {loading
                  ? Array.from({ length: 12 }).map((_, i) => (
                      <Skeleton key={i} className="aspect-square rounded-md" />
                    ))
                  : photos.length > 0
                  ? photos.map((photo, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gray-200 rounded-md overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                        onClick={() => photo.imageUrl && setLightbox(photo.imageUrl)}
                      >
                        {photo.imageUrl ? (
                          <img
                            src={photo.imageUrl}
                            alt={photo.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#1a3a6e] to-[#2a5298] flex items-center justify-center">
                            <Images className="h-8 w-8 text-white/40" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                          <div className="w-full px-2 py-2">
                            <p className="text-xs text-white font-semibold truncate">{photo.title}</p>
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 text-xs text-white font-semibold bg-black/50 px-2 py-1 rounded max-w-[calc(100%-16px)] truncate group-hover:opacity-0 transition-opacity">
                          {photo.title}
                        </div>
                      </div>
                    ))
                  : Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gradient-to-br from-[#1a3a6e] to-[#2a5298] rounded-md overflow-hidden relative group cursor-pointer shadow-sm"
                      >
                        <div className="absolute bottom-2 left-2 text-xs text-white font-semibold bg-black/50 px-2 py-1 rounded">
                          BDA Photo {i + 1}
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          )}

          {/* Videos List */}
          {showVideos && (
            <div className={showPhotos ? "lg:w-1/3" : "w-full"}>
              {showPhotos && (
                <div className="flex items-center gap-2 mb-4">
                  <Video className="h-5 w-5 text-[#1a3a6e]" />
                  <h2 className="text-xl font-bold text-[#1a3a6e]">Videos</h2>
                  {!loading && <span className="text-sm text-gray-500">({videos.length} videos)</span>}
                </div>
              )}
              <div className={showPhotos ? "space-y-3" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"}>
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-28 rounded-md" />
                    ))
                  : videos.length > 0
                  ? videos.map((video, i) => (
                      <a
                        key={i}
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-28 bg-gray-900 rounded-md overflow-hidden relative group shadow-sm hover:shadow-md transition-shadow"
                      >
                        {video.thumbnailUrl ? (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-r from-[#1a3a6e] to-[#2a5298]" />
                        )}
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
                  : Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-28 bg-gradient-to-r from-[#1a3a6e] to-[#2a5298] rounded-md overflow-hidden relative flex items-center justify-center shadow-sm"
                      >
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center z-10">
                          <Play className="h-6 w-6 text-white ml-1" />
                        </div>
                        <div className="absolute bottom-2 left-2 text-xs text-white font-semibold bg-black/50 px-2 py-1 rounded z-10">
                          BDA Video {i + 1}
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Full view"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-6 text-white text-3xl font-bold hover:text-orange-400"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
