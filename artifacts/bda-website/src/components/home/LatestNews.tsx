import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const fallbackNewsItems = [
  "Registration open for The Sky-Way Apartment (1 Jun 2025 to 31 Mar 2027)",
  "How to Apply Instructions for Property ITS 2026",
  "बरेली विकास प्राधिकरण द्वारा वित्तीय वर्ष 2024-25 में किये गए कार्यों की समीक्षा",
  "Model Building Construction and Development Byelaws and Model Zoning Regulation, 2025",
  "One Time Settlement (OTS) 2026 for outstanding dues — Apply before 31 March 2026"
];

const fallbackTendersItems = [
  "Supply of Office Furniture and Equipment — Last Date: 30 Jun 2025",
  "Construction of Roads in Ramganga Nagar — Last Date: 15 Jul 2025",
  "Landscaping Works at Ramayan Vatika — Last Date: 20 Jul 2025",
  "Civil Works for EWS Housing Scheme — Last Date: 25 Jul 2025"
];

export interface ImportantLink {
  id: number;
  label: string;
  url: string;
}

export const SEED_IMPORTANT_LINKS: ImportantLink[] = [
  { id: 1, label: "Online Registration",           url: "#" },
  { id: 2, label: "Online Building Plan Approval",  url: "#" },
  { id: 3, label: "JARBT Portal",                  url: "#" },
  { id: 4, label: "Bareilly Master Plan 2031",      url: "#" },
  { id: 5, label: "Raise Query",                   url: "/raise-query" },
  { id: 6, label: "Commissioner Bareilly",          url: "#" },
];

const LINKS_STORAGE_KEY = "bda_important_links_v1";

function loadImportantLinks(): ImportantLink[] {
  try {
    const raw = localStorage.getItem(LINKS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED_IMPORTANT_LINKS;
}

export function LatestNews() {
  const [activeTab, setActiveTab] = useState<'news' | 'tenders'>('news');
  const [news, setNews] = useState<{title: string, isTender: boolean}[]>([]);
  const [importantLinks, setImportantLinks] = useState<ImportantLink[]>(() => loadImportantLinks());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const data = await res.json();
          setNews(data.filter((n: any) => n.isActive));
        }
      } catch (e) {
        console.error("Failed to fetch news", e);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();

    const onStorage = (e: StorageEvent) => {
      if (e.key === LINKS_STORAGE_KEY) setImportantLinks(loadImportantLinks());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const newsItems = loading ? [] : news.filter(n => !n.isTender).map(n => n.title);
  const tendersItems = loading ? [] : news.filter(n => n.isTender).map(n => n.title);

  const displayNews = newsItems.length > 0 ? newsItems : fallbackNewsItems;
  const displayTenders = tendersItems.length > 0 ? tendersItems : fallbackTendersItems;
  const currentItems = activeTab === 'news' ? displayNews : displayTenders;

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8">
        
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button 
                className={`flex-1 py-3 px-4 font-bold text-lg ${activeTab === 'news' ? 'bg-[#1a3a6e] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={() => setActiveTab('news')}
                data-testid="tab-latest-news"
              >
                Latest News
              </button>
              <button 
                className={`flex-1 py-3 px-4 font-bold text-lg ${activeTab === 'tenders' ? 'bg-[#1a3a6e] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={() => setActiveTab('tenders')}
                data-testid="tab-tenders"
              >
                Tenders
              </button>
            </div>
            <div className="p-0">
              <ul className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                {loading ? (
                  Array.from({length: 4}).map((_, i) => (
                    <li key={i} className="p-4"><Skeleton className="h-6 w-full" /></li>
                  ))
                ) : (
                  currentItems.map((item, i) => (
                    <li key={i} className="p-4 hover:bg-orange-50 flex items-start gap-3 transition-colors">
                      <span className="text-orange-500 mt-1 shrink-0">►</span>
                      <a href="#" className="text-gray-800 hover:text-[#1a3a6e] font-medium" lang={item.includes("में") ? "hi" : "en"}>{item}</a>
                    </li>
                  ))
                )}
              </ul>
              <div className="p-3 bg-gray-50 text-right border-t border-gray-200">
                <a href="#" className="text-sm font-bold text-[#1a3a6e] hover:text-orange-600">View All</a>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <Card className="h-full border-t-4 border-t-orange-500">
            <div className="bg-[#1a3a6e] text-white py-3 px-4 flex justify-between items-center rounded-t-sm">
              <h3 className="font-bold text-lg">Important Links</h3>
            </div>
            <CardContent className="p-0">
              <ul className="divide-y divide-gray-100">
                {importantLinks.map((link) => (
                  <li key={link.id}>
                    <a href={link.url} target={link.url.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                      className="flex items-center justify-between p-3 hover:bg-gray-50 text-gray-700 hover:text-[#1a3a6e] font-medium group">
                      {link.label}
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-orange-500" />
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
