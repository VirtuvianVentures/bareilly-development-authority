import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Users, Newspaper, FileText, LayoutList, Image, Video, ArrowRight, GalleryHorizontal, Megaphone, LayoutGrid } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/adminApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    officials: 0,
    news: 0,
    tenders: 0,
    whatsNew: 0,
    photos: 0,
    videos: 0,
    banners: 0,
    marquee: 0,
    schemes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [officialsRes, newsRes, whatsNewRes, photosRes, videosRes, bannersRes, marqueeRes, schemesRes] = await Promise.all([
          apiFetch("/officials"),
          apiFetch("/news"),
          apiFetch("/whats-new"),
          apiFetch("/photos"),
          apiFetch("/videos"),
          apiFetch("/banners"),
          apiFetch("/marquee"),
          apiFetch("/schemes"),
        ]);

        const [officials, news, whatsNew, photos, videos, banners, marquee, schemes] = await Promise.all([
          officialsRes.json(),
          newsRes.json(),
          whatsNewRes.json(),
          photosRes.json(),
          videosRes.json(),
          bannersRes.json(),
          marqueeRes.json(),
          schemesRes.json(),
        ]);

        setStats({
          officials: officials.length,
          news: news.filter((n: any) => !n.isTender).length,
          tenders: news.filter((n: any) => n.isTender).length,
          whatsNew: whatsNew.length,
          photos: photos.length,
          videos: videos.length,
          banners: banners.length,
          marquee: marquee.length,
          schemes: schemes.length,
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    { title: "Slider Banners",  count: stats.banners,   icon: GalleryHorizontal, color: "text-sky-500",    bg: "bg-sky-100",    link: "/portal/webmaster/banners" },
    { title: "News Ticker",     count: stats.marquee,   icon: Megaphone,         color: "text-amber-500",  bg: "bg-amber-100",  link: "/portal/webmaster/marquee" },
    { title: "Schemes & Surveys", count: stats.schemes, icon: LayoutGrid,        color: "text-teal-500",   bg: "bg-teal-100",   link: "/portal/webmaster/schemes" },
    { title: "Officials",       count: stats.officials, icon: Users,             color: "text-blue-500",   bg: "bg-blue-100",   link: "/portal/webmaster/officials" },
    { title: "Latest News",     count: stats.news,      icon: Newspaper,         color: "text-green-500",  bg: "bg-green-100",  link: "/portal/webmaster/news" },
    { title: "Tenders",         count: stats.tenders,   icon: FileText,          color: "text-orange-500", bg: "bg-orange-100", link: "/portal/webmaster/tenders" },
    { title: "What's New",      count: stats.whatsNew,  icon: LayoutList,        color: "text-purple-500", bg: "bg-purple-100", link: "/portal/webmaster/whats-new" },
    { title: "Photo Gallery",   count: stats.photos,    icon: Image,             color: "text-pink-500",   bg: "bg-pink-100",   link: "/portal/webmaster/photos" },
    { title: "Video Gallery",   count: stats.videos,    icon: Video,             color: "text-red-500",    bg: "bg-red-100",    link: "/portal/webmaster/videos" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                {loading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <span className="text-3xl font-bold text-gray-800">{stat.count}</span>
                )}
              </div>
              <h3 className="text-gray-600 font-medium mb-4">{stat.title}</h3>
              <Link href={stat.link} className="flex items-center text-sm text-[#1a3a6e] font-semibold hover:text-orange-600 group">
                Manage {stat.title}
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
