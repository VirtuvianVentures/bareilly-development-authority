import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Scale, LogOut,
  MapPin, Map, LayoutList, Tag, Link2, UsersRound, ListTree,
  ClipboardList, Gavel, FolderOpen, FileEdit, Menu, ChevronLeft,
} from "lucide-react";

const masterItems = [
  { href: "/portal/court/masters/division",            label: "Division Master",                icon: MapPin },
  { href: "/portal/court/masters/district",            label: "District Master",               icon: Map },
  { href: "/portal/court/masters/court-type",          label: "Court & Type Master",           icon: LayoutList },
  { href: "/portal/court/masters/court",               label: "Court Master",                  icon: Scale },
  { href: "/portal/court/masters/case-type",           label: "Case Type Master",              icon: Tag },
  { href: "/portal/court/masters/case-related",        label: "Advocate Master",               icon: Link2 },
  { href: "/portal/court/masters/petitioner-category", label: "Petitioner/Opposition Category",icon: UsersRound },
  { href: "/portal/court/masters/sub-category",        label: "Sub Category Master",           icon: ListTree },
];

const formItems = [
  { href: "/portal/court",             label: "Enforcement Cases",        icon: ClipboardList },
  { href: "/portal/court/freshCase", label: "Fresh Case Registration",  icon: Gavel },
];

export function CourtLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) setLocation("/portal/login");
  }, [isAuthenticated]);

  const handleLogout = () => { logout(); setLocation("/portal/login"); };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className={`${collapsed ? "w-14" : "w-64"} bg-[#1a3a6e] text-white flex flex-col shrink-0 overflow-y-auto overflow-x-hidden transition-all duration-200`}>
        {/* Module header */}
        <div className="h-16 flex items-center px-3 border-b border-[#2a4d8a] gap-2 shrink-0">
          <img src="/bda-logo.png" alt="BDA" className="h-9 w-9 object-contain rounded-full bg-white p-0.5 shrink-0" />
          {!collapsed && (
            <div>
              <p className="font-bold text-xs leading-tight">Bareilly Dev. Authority</p>
              <p className="text-[10px] text-blue-300 flex items-center gap-1"><Scale className="h-3 w-3 text-red-400" /> Court Module</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-3">
          {/* Back to Portal */}
          <Link href="/portal"
            title={collapsed ? "Back to Portal" : undefined}
            className={`flex items-center gap-2 px-3 py-2 text-xs text-blue-200 hover:text-white mb-3 transition-colors ${collapsed ? "justify-center" : "px-4"}`}>
            <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
            {!collapsed && "Back to Portal"}
          </Link>

          {/* Master Data section */}
          {!collapsed && (
            <div className="px-4 mb-1">
              <p className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold flex items-center gap-1.5">
                <FolderOpen className="h-3 w-3" /> Master Data
              </p>
            </div>
          )}
          {collapsed && (
            <div className="px-2 mb-1 flex justify-center">
              <FolderOpen className="h-3 w-3 text-blue-400" />
            </div>
          )}
          <ul className="space-y-0.5 mb-4">
            {masterItems.map(item => {
              const isActive = location === item.href;
              return (
                <li key={item.href}>
                  <Link href={item.href} title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 py-2.5 transition-colors text-sm border-l-4
                      ${collapsed ? "justify-center px-2" : "px-4"}
                      ${isActive
                        ? "bg-[#2a4d8a] border-red-500 text-white"
                        : "text-gray-300 hover:bg-[#2a4d8a]/50 hover:text-white border-transparent"
                      }`}>
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="font-medium text-xs leading-tight">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Transactional Forms section */}
          {!collapsed && (
            <div className="px-4 mb-1">
              <p className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold flex items-center gap-1.5">
                <FileEdit className="h-3 w-3" /> Transactional Forms
              </p>
            </div>
          )}
          {collapsed && (
            <div className="px-2 mb-1 flex justify-center">
              <FileEdit className="h-3 w-3 text-blue-400" />
            </div>
          )}
          <ul className="space-y-0.5">
            {formItems.map(item => {
              const isActive = location === item.href;
              return (
                <li key={item.href}>
                  <Link href={item.href} title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 py-2.5 transition-colors text-sm border-l-4
                      ${collapsed ? "justify-center px-2" : "px-4"}
                      ${isActive
                        ? "bg-[#2a4d8a] border-red-500 text-white"
                        : "text-gray-300 hover:bg-[#2a4d8a]/50 hover:text-white border-transparent"
                      }`}>
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="font-medium text-xs leading-tight">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className={`border-t border-[#2a4d8a] py-4 shrink-0 ${collapsed ? "px-2 flex justify-center" : "px-3"}`}>
          <Button variant="ghost" onClick={handleLogout} title="Sign Out"
            className={`text-blue-200 hover:text-white hover:bg-white/10 text-xs
              ${collapsed ? "w-9 h-9 p-0 justify-center" : "w-full justify-start gap-2"}`}>
            <LogOut className="h-4 w-4" />
            {!collapsed && "Sign Out"}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header — same dark bg as sidebar */}
        <header className="h-14 bg-[#1a3a6e] flex items-center px-4 shrink-0 gap-3">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-md p-1.5 transition-colors shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-white font-bold text-base tracking-wide">{title}</h1>
          <div className="ml-auto">
            <Button variant="ghost" onClick={handleLogout}
              className="text-white/70 hover:text-white hover:bg-white/10 text-xs gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
