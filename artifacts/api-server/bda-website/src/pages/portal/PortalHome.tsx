import { useAuth } from "@/contexts/AuthContext";
import { PortalLayout, ALL_MODULES, ADMIN_MODULES } from "@/components/portal/PortalLayout";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

export default function PortalHome() {
  const { user } = useAuth();
  const visibleModules = ALL_MODULES.filter(m => user && m.roles.includes(user.role));
  const showAdmin = user?.role === "superadmin";

  return (
    <PortalLayout title="BDA — Enterprise Resource Planning (ERP)">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Welcome, {user?.name}</h2>
          <p className="text-sm text-gray-500 mt-0.5 capitalize">Role: {user?.role} {user?.department ? `| ${user.department}` : ""}</p>
        </div>

        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Available Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {visibleModules.map(m => (
            <Link key={m.id} href={m.href}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group p-5 flex items-center gap-4">
                <div className={`${m.color} w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}>
                  <m.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm leading-tight">{m.label}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        {showAdmin && (
          <>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Administration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ADMIN_MODULES.map(m => (
                <Link key={m.id} href={m.href}>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group p-5 flex items-center gap-4">
                    <div className={`${m.color} w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}>
                      <m.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm leading-tight">{m.label}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
