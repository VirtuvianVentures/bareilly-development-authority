import { Link, useLocation } from "wouter";
import { ChevronRight } from "lucide-react";

const ABOUT_LINKS = [
  { label: "Objectives",            labelHi: "उद्देश्य",          path: "/about/objectives" },
  { label: "BDA Officers",          labelHi: "बी.डी.ए. अधिकारी", path: "/about/bda-officers" },
  { label: "Board Members",         labelHi: "बोर्ड सदस्य",       path: "/about/board-members" },
  { label: "Geographical Area",     labelHi: "भौगोलिक क्षेत्र",   path: "/about/geographical-area" },
  { label: "Organisation Structure",labelHi: "संगठन संरचना",      path: "/about/organisation-structure" },
];

interface Props {
  title: string;
  titleHi: string;
  children: React.ReactNode;
}

export function AboutPageLayout({ title, titleHi, children }: Props) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page title banner */}
      <div className="bg-[#1a3a6e] text-white py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-blue-200" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/about/objectives" className="hover:text-white">About Us</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white font-medium">{title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <main className="bg-white border border-gray-200 rounded shadow-sm p-6 min-h-[400px]" id="main-content">
          <h2 className="text-xl font-bold text-[#1a3a6e] border-b-2 border-[#8b3a00] pb-2 mb-6">
            {title}
            <span className="text-base font-normal text-gray-500 ml-2" lang="hi">({titleHi})</span>
          </h2>
          {children}
        </main>
      </div>
    </div>
  );
}
