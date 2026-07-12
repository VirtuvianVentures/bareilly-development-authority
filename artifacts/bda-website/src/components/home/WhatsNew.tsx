import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Map, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const fallbackWhatsNew = [
  "• बरेली विकास प्राधिकरण में ई-नीलामी के माध्यम से भूखंडों एवं भवन...",
  "• रामगंगा नगर आवासीय योजना के अंतर्गत नई टाउनशिप...",
  "• प्राधिकरण की बैठक में लिए गए महत्वपूर्ण निर्णय..."
];

const mapsPlans = [
  "Greater Bareilly Sec-5B",
  "Greater Bareilly Sec-7A",
  "Greater Bareilly Sec-20 Revised Layout",
  "Greater Bareilly Sec-20 Old Layout",
  "Greater Bareilly Sector 3",
  "Greater Bareilly Sector II",
  "Baburabad (Sec-1)"
];

export function WhatsNew() {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch("/api/whats-new");
        if (res.ok) {
          const data = await res.json();
          setItems(data.filter((n: any) => n.isActive).map((n: any) => n.content));
        }
      } catch (e) {
        console.error("Failed to fetch whats new", e);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  const displayItems = items.length > 0 ? items : fallbackWhatsNew;

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div>
          <h2 className="text-2xl font-bold text-[#1a3a6e] mb-6 flex items-center gap-2 border-b border-gray-200 pb-2">
            <FileText className="text-orange-500" />
            What's New
          </h2>
          <Card className="bg-orange-50/50 border-orange-100">
            <CardContent className="p-6">
              <ul className="space-y-4">
                {loading ? (
                  Array.from({length: 3}).map((_, i) => (
                    <li key={i}><Skeleton className="h-6 w-full" /></li>
                  ))
                ) : (
                  displayItems.map((item, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-700 hover:text-orange-600 font-medium leading-relaxed block" lang="hi">
                        {item.startsWith('•') ? item : `• ${item}`}
                      </a>
                    </li>
                  ))
                )}
              </ul>
              <div className="mt-6 text-right">
                <a href="#" className="text-sm font-bold text-[#1a3a6e] hover:underline">View All Updates</a>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#1a3a6e] mb-6 flex items-center gap-2 border-b border-gray-200 pb-2">
            <Map className="text-green-600" />
            Maps / Master Plans
          </h2>
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0 p-4">
                {mapsPlans.map((plan, i) => (
                  <a key={i} href="#" className="py-2 px-3 hover:bg-gray-50 border-b border-gray-100 text-gray-700 hover:text-green-700 flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"></span>
                    {plan}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
