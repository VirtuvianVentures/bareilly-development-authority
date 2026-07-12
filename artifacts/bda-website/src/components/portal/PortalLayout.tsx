import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LogOut, LayoutDashboard, Building2, Wrench, Scale, Users2,
  IndianRupee, MessageSquare, Globe, UserCog, ChevronRight,
  Layers, BookOpen, Settings, ChevronDown, Menu, X, ShieldCheck, Sparkles,
} from "lucide-react";

export interface ModuleItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  color: string;
  roles: UserRole[];
}

export const ALL_MODULES: ModuleItem[] = [
  { id: "webmaster",    label: "Web Master",              href: "/portal/webmaster",    icon: Globe,         color: "bg-blue-600",    roles: ["superadmin", "admin", "officer"] },
  { id: "property",     label: "Property Management",     href: "/portal/property",     icon: Building2,     color: "bg-emerald-600", roles: ["superadmin", "admin", "officer"] },
  { id: "maintenance",  label: "Maintenance Charges",     href: "/portal/maintenance",  icon: Wrench,        color: "bg-orange-600",  roles: ["superadmin", "admin", "officer"] },
  { id: "court",        label: "Court Case Monitoring",   href: "/portal/court",        icon: Scale,         color: "bg-red-600",     roles: ["superadmin", "admin", "officer"] },
  { id: "payroll",      label: "Payroll Management",      href: "/portal/payroll",      icon: Users2,        color: "bg-violet-600",  roles: ["superadmin", "admin"] },
  { id: "finance",      label: "Integrated Finance",      href: "/portal/finance",      icon: IndianRupee,   color: "bg-teal-600",    roles: ["superadmin", "admin"] },
  { id: "grievance",    label: "Grievance Management",    href: "/portal/grievance",    icon: MessageSquare, color: "bg-pink-600",    roles: ["superadmin", "admin", "officer", "user"] },
  { id: "ai-tools",    label: "AI Tools",                href: "/portal/ai-tools",     icon: Sparkles,      color: "bg-gradient-to-br from-violet-600 to-blue-600", roles: ["superadmin", "admin", "officer"] },
];

export const ADMIN_MODULES: ModuleItem[] = [
  { id: "users", label: "User Management", href: "/portal/users", icon: UserCog, color: "bg-slate-700", roles: ["superadmin"] },
];

function GrievanceAdminMenu({ moduleId, collapsed }: { moduleId?: string; collapsed: boolean }) {
  const isActive = moduleId === "grievance-admin";
  const [open, setOpen] = useState(isActive);
  const subItems = [
    { href: "/portal/grievance-admin/sections", label: "Section Master", icon: Layers },
    { href: "/portal/grievance-admin/roles", label: "Role Master", icon: UserCog },
    { href: "/portal/grievance-admin/subjects", label: "Subject Master", icon: BookOpen },
    { href: "/portal/users", label: "User Master", icon: ShieldCheck },
  ];

  if (collapsed) {
    return (
      <div className="px-2 pt-2 pb-1 space-y-0.5">
        {subItems.map(s => (
          <Link key={s.href} href={s.href} title={s.label}
            className="flex items-center justify-center px-2 py-2 rounded-md text-blue-300 hover:text-white hover:bg-white/10 transition-colors">
            <s.icon className="h-4 w-4 shrink-0" />
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="px-3 pt-2 pb-1">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-blue-200 hover:bg-white/10 hover:text-white transition-colors">
        <Settings className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">Master Data</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="mt-0.5 space-y-0.5 pl-3 border-l border-white/10 ml-5">
          {subItems.map(s => (
            <li key={s.href}>
              <Link href={s.href}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-blue-300 hover:text-white hover:bg-white/10 transition-colors">
                <s.icon className="h-3.5 w-3.5 shrink-0" />
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function PortalLayout({ children, title, moduleId }: { children: React.ReactNode; title: string; moduleId?: string }) {
  const [currentPath, setLocation] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) setLocation("/portal/login");
  }, [isAuthenticated]);

  const visibleModules = ALL_MODULES.filter(m => user && m.roles.includes(user.role));

  const handleLogout = () => { logout(); setLocation("/portal/login"); };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className={`${collapsed ? "w-14" : "w-60"} bg-[#0d2447] text-white flex flex-col shrink-0 overflow-y-auto overflow-x-hidden transition-all duration-200`}>

        {/* Logo / Brand */}
        {!collapsed && (
          <div className="px-3 py-3 border-b border-white/10 flex items-center gap-2">
            <img src="/bda-logo.png" alt="BDA Logo" className="h-9 w-9 object-contain shrink-0 rounded-full bg-white p-0.5" />
            <div>
              <p className="text-[10px] text-blue-300 uppercase tracking-widest font-semibold leading-none mb-0.5">BDA Portal</p>
              <p className="font-bold text-xs leading-tight">Bareilly Dev. Authority</p>
            </div>
          </div>
        )}
        {collapsed && <div className="h-[61px] border-b border-white/10 flex items-center justify-center shrink-0">
          <img src="/bda-logo.png" alt="BDA" className="h-8 w-8 object-contain rounded-full bg-white p-0.5" />
        </div>}

        {/* User badge */}
        {!collapsed ? (
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">{user?.name}</p>
                <p className="text-[10px] text-blue-300 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-2 py-3 border-b border-white/10 flex justify-center">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs shrink-0" title={user?.name}>
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          </div>
        )}

        {/* Dashboard link */}
        <Link href="/portal"
          className={`flex items-center gap-2.5 px-4 py-2.5 text-sm text-blue-200 hover:text-white hover:bg-white/5 border-l-4 border-transparent mt-1 ${collapsed ? "justify-center px-2" : ""}`}
          title={collapsed ? "Dashboard" : undefined}>
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {!collapsed && "Dashboard"}
        </Link>

        {/* Modules */}
        <div className={`pt-2 pb-1 ${collapsed ? "px-2" : "px-3"}`}>
          {!collapsed && <p className="text-[9px] uppercase tracking-widest text-blue-400 font-semibold px-1 mb-1">Modules</p>}
          <ul className="space-y-0.5">
            {visibleModules.map(m => {
              const isActive = moduleId === m.id;
              return (
                <li key={m.id}>
                  <Link href={m.href} title={collapsed ? m.label : undefined}
                    className={`flex items-center gap-2.5 rounded-md text-sm transition-colors
                      ${collapsed ? "justify-center px-2 py-2" : "px-3 py-2"}
                      ${isActive ? "bg-white/15 text-white" : "text-blue-200 hover:bg-white/10 hover:text-white"}`}>
                    <m.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="text-xs font-medium leading-tight">{m.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Grievance Admin submenu */}
        {(user?.role === "superadmin" || user?.role === "admin") && (
          <GrievanceAdminMenu moduleId={moduleId} collapsed={collapsed} />
        )}

        {/* Admin links */}
        {user?.role === "superadmin" && (
          <div className={`pt-3 pb-1 ${collapsed ? "px-2" : "px-3"}`}>
            {!collapsed && <p className="text-[9px] uppercase tracking-widest text-blue-400 font-semibold px-1 mb-1">Administration</p>}
            {ADMIN_MODULES.map(m => (
              <Link key={m.id} href={m.href} title={collapsed ? m.label : undefined}
                className={`flex items-center gap-2.5 rounded-md text-sm text-blue-200 hover:bg-white/10 hover:text-white
                  ${collapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}>
                <m.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="text-xs font-medium">{m.label}</span>}
              </Link>
            ))}
          </div>
        )}

        <div className={`mt-auto border-t border-white/10 ${collapsed ? "px-2 py-4 flex justify-center" : "px-3 py-4"}`}>
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
        {/* Header — same color as sidebar */}
        <header className="h-14 bg-[#0d2447] flex items-center px-4 shrink-0 gap-3">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-md p-1.5 transition-colors shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            {collapsed ? <Menu className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="text-white font-bold text-base tracking-wide">{title}</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
