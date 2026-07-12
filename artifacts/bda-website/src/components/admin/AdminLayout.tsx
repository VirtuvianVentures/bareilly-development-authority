import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Shield, LayoutDashboard, Users, Newspaper, FileText, Image, Video, LogOut, GalleryHorizontal, Megaphone, ChevronLeft, LayoutGrid, UserSquare2, Link2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/portal/webmaster", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/webmaster/banners", label: "Slider Banners", icon: GalleryHorizontal },
  { href: "/portal/webmaster/marquee", label: "News Ticker", icon: Megaphone },
  { href: "/portal/webmaster/officials", label: "Officials", icon: Users },
  { href: "/portal/webmaster/news", label: "Latest News", icon: Newspaper },
  { href: "/portal/webmaster/tenders", label: "Tenders", icon: FileText },
  { href: "/portal/webmaster/whats-new", label: "What's New", icon: FileText },
  { href: "/portal/webmaster/photos", label: "Photo Gallery", icon: Image },
  { href: "/portal/webmaster/videos", label: "Video Gallery", icon: Video },
  { href: "/portal/webmaster/schemes", label: "Schemes & Surveys", icon: LayoutGrid },
  { href: "/portal/webmaster/bda-officers", label: "BDA Officers", icon: UserSquare2 },
  { href: "/portal/webmaster/board-members", label: "Board Members", icon: Users },
  { href: "/portal/webmaster/housing-schemes", label: "Housing Schemes", icon: LayoutGrid },
  { href: "/portal/webmaster/investors-list", label: "Investors List", icon: FileText },
  { href: "/portal/webmaster/important-links", label: "Important Links", icon: Link2 },
];

export function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) setLocation("/portal/login");
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    setLocation("/portal/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <div className="w-64 bg-[#1a3a6e] text-white flex flex-col shrink-0 overflow-y-auto">
        <div className="h-16 flex items-center px-4 border-b border-[#2a4d8a] gap-2">
          <Shield className="h-5 w-5 text-orange-500 shrink-0" />
          <span className="font-bold text-sm tracking-wide">Web Master</span>
        </div>
        <nav className="flex-1 py-4">
          <Link href="/portal" className="flex items-center gap-2 px-4 py-2 text-xs text-blue-200 hover:text-white mb-2">
            <ChevronLeft className="h-3 w-3" /> Back to Portal
          </Link>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <li key={item.href}>
                  <Link href={item.href} className={`flex items-center gap-3 px-4 py-2.5 transition-colors text-sm ${isActive ? "bg-[#2a4d8a] border-l-4 border-orange-500 text-white" : "text-gray-300 hover:bg-[#2a4d8a]/50 hover:text-white border-l-4 border-transparent"}`}>
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          <Button variant="ghost" onClick={handleLogout} className="text-gray-600 hover:text-red-600 hover:bg-red-50" data-testid="button-logout">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
