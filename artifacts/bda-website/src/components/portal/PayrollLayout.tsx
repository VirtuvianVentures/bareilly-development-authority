import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  IndianRupee, ChevronLeft, LogOut, ChevronDown,
  Users2, Settings, Award, GraduationCap, GitBranch,
  Landmark, Home, CreditCard, TrendingUp, Layers, TrendingDown, CalendarDays, Calculator,
  ArrowRightLeft, Shield, BarChart3, FileText, Building2, HardDrive,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  label: string;
  icon: React.ElementType;
  items: NavItem[];
}

type NavEntry = NavItem | (NavGroup & { type: "group" });

const NAV: (NavItem | (NavGroup & { type: "group" }))[] = [
  { href: "/portal/payroll",                      label: "Employee Register",   icon: Users2 },
  {
    type: "group",
    label: "Salary Generation",
    icon: Calculator,
    items: [
      { href: "/portal/payroll/generate-salary",    label: "Generate Salary",         icon: Calculator },
      { href: "/portal/payroll/dept-pay-bill",      label: "Departmental Pay Bill",   icon: Building2 },
    ],
  },
  {
    type: "group",
    label: "Master Data",
    icon: Settings,
    items: [
      { href: "/portal/payroll/masters/designations",  label: "Designations",         icon: Award },
      { href: "/portal/payroll/masters/qualifications", label: "Qualification Master", icon: GraduationCap },
      { href: "/portal/payroll/masters/branches",       label: "Branch Master",        icon: GitBranch },
      { href: "/portal/payroll/masters/banks",          label: "Bank Master",          icon: Landmark },
      { href: "/portal/payroll/masters/house-type",     label: "House Type",           icon: Home },
      { href: "/portal/payroll/masters/paybill-group",  label: "PayBill Group Master", icon: CreditCard },
      { href: "/portal/payroll/masters/da",             label: "DA Master",            icon: TrendingUp },
      { href: "/portal/payroll/masters/group",           label: "Group Master",         icon: Layers },
    ],
  },
  {
    type: "group",
    label: "Salary Config",
    icon: IndianRupee,
    items: [
      { href: "/portal/payroll/masters/allowances", label: "Allowance Master", icon: TrendingUp },
      { href: "/portal/payroll/masters/deductions", label: "Deduction Master",  icon: TrendingDown },
      { href: "/portal/payroll/masters/leaves",     label: "Leave Master",      icon: CalendarDays },
    ],
  },
  {
    type: "group",
    label: "Transaction",
    icon: ArrowRightLeft,
    items: [
      { href: "/portal/payroll/transaction/lic-entry", label: "LIC Entry", icon: Shield },
    ],
  },
  {
    type: "group",
    label: "Reports",
    icon: BarChart3,
    items: [
      { href: "/portal/payroll/reports/salary-report",    label: "Salary Report",            icon: BarChart3  },
      { href: "/portal/payroll/reports/lic-report",      label: "LIC Report",               icon: FileText   },
      { href: "/portal/payroll/reports/salary-generated",label: "Salary Generated Master",   icon: HardDrive  },
      { href: "/portal/payroll/reports/salary-slip",     label: "Salary Slip",               icon: FileText   },
      { href: "/portal/payroll/reports/employee-details", label: "Employee Details",           icon: Users2     },
    ],
  },
];

function isGroup(entry: typeof NAV[number]): entry is NavGroup & { type: "group" } {
  return "type" in entry && entry.type === "group";
}

export function PayrollLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ "Master Data": true });

  useEffect(() => {
    if (!isAuthenticated) setLocation("/portal/login");
  }, [isAuthenticated]);

  const handleLogout = () => { logout(); setLocation("/portal/login"); };
  const toggle = (label: string) => setOpenGroups(p => ({ ...p, [label]: !p[label] }));

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* ── Sidebar ── */}
      <div className="w-64 bg-[#1a3a6e] text-white flex flex-col shrink-0 overflow-y-auto">

        {/* Header */}
        <div className="h-16 flex items-center px-4 border-b border-[#2a4d8a] gap-2 shrink-0">
          <IndianRupee className="h-5 w-5 text-orange-500 shrink-0" />
          <span className="font-bold text-sm tracking-wide">Payroll Management</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          {/* Back to Portal */}
          <Link href="/portal"
            className="flex items-center gap-2 px-4 py-2 text-xs text-blue-200 hover:text-white mb-2 transition-colors">
            <ChevronLeft className="h-3 w-3" /> Back to Portal
          </Link>

          <ul className="space-y-0.5">
            {NAV.map((entry) => {
              if (isGroup(entry)) {
                const open = openGroups[entry.label] ?? true;
                return (
                  <li key={entry.label}>
                    {/* Group header */}
                    <button
                      onClick={() => toggle(entry.label)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#2a4d8a]/50 hover:text-white border-l-4 border-transparent transition-colors"
                    >
                      <entry.icon className="h-4 w-4 shrink-0" />
                      <span className="font-medium flex-1 text-left">{entry.label}</span>
                      <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                    </button>
                    {/* Sub-items */}
                    {open && (
                      <ul className="ml-5 border-l border-white/10 space-y-0.5 pb-1">
                        {entry.items.map(item => {
                          const active = location === item.href;
                          return (
                            <li key={item.href}>
                              <Link href={item.href}
                                className={`flex items-center gap-3 pl-4 pr-4 py-2 text-xs transition-colors
                                  ${active
                                    ? "bg-[#2a4d8a] border-l-4 border-orange-500 text-white font-semibold -ml-px"
                                    : "text-gray-300 hover:bg-[#2a4d8a]/50 hover:text-white border-l-4 border-transparent -ml-px"
                                  }`}>
                                <item.icon className="h-3.5 w-3.5 shrink-0" />
                                <span>{item.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              // Flat item
              const active = location === entry.href;
              return (
                <li key={entry.href}>
                  <Link href={entry.href}
                    className={`flex items-center gap-3 px-4 py-2.5 transition-colors text-sm
                      ${active
                        ? "bg-[#2a4d8a] border-l-4 border-orange-500 text-white"
                        : "text-gray-300 hover:bg-[#2a4d8a]/50 hover:text-white border-l-4 border-transparent"
                      }`}>
                    <entry.icon className="h-4 w-4 shrink-0" />
                    <span className="font-medium">{entry.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-[#2a4d8a] p-3 shrink-0">
          <Button variant="ghost" onClick={handleLogout}
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#2a4d8a]/50 text-xs gap-2 h-9">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
