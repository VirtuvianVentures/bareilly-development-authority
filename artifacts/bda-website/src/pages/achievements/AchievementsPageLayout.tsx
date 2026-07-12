import { Link, useLocation } from "wouter";
import { ChevronRight } from "lucide-react";

interface Props {
  title: string;
  titleHi: string;
  children: React.ReactNode;
}

export function AchievementsPageLayout({ title, titleHi, children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1a3a6e] text-white py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-xs text-blue-200 flex items-center gap-1.5">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/achievements/housing-schemes" className="hover:text-white">Achievements</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white font-medium">{title}</span>
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
