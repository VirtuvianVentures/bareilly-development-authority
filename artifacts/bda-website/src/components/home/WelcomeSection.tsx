import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const fallbackOfficials = [
  { name: "Shri P. Guruprashad, IAS", designation: "Principal Secretary - Housing and Urban Planning Other Pradesh" },
  { name: "Shri Vipulendra S. Chaudhary, IAS", designation: "Commissioner Bareilly" },
  { name: "Shri Sourabh Pandey, IAS", designation: "Secretary, Bareilly Development Authority" }
];

export function WelcomeSection() {
  const [officials, setOfficials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOfficials() {
      try {
        const res = await fetch("/api/officials");
        if (res.ok) {
          const data = await res.json();
          setOfficials(data.filter((n: any) => n.isActive));
        }
      } catch (e) {
        console.error("Failed to fetch officials", e);
      } finally {
        setLoading(false);
      }
    }
    fetchOfficials();
  }, []);

  const displayOfficials = officials.length > 0 ? officials : fallbackOfficials;

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <h2 className="text-3xl font-bold text-[#1a3a6e] mb-6 inline-block border-b-2 border-orange-500 pb-2">
            Welcome to Bareilly Development Authority
          </h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              The Bareilly Development Authority (BDA) Established on 19th April 1977 under the Uttar Pradesh Urban Planning & Development Act 1973. BDA is the principal agency of the Government of Uttar Pradesh responsible for taking ahead the tradition of planned and sustainable development of Bareilly.
            </p>
            <p>
              The aims and objectives of Bareilly Development Authority are far reaching both in their short term and long term planning. The primary objective of the BDA is to reduce population congestion and provide housing facilities to the weaker section and others. A plan to have restricted individuals per hectare has been proposed. With the purpose of limiting the population of Union Territory of Delhi and maintaining a steady pace of development, national capital region has been conceptualized with parts of Haryana, Rajasthan and U.P. with Delhi being at the centre.
            </p>
          </div>
        </div>
        
        <div className="lg:w-1/3 space-y-4">
          <h3 className="text-xl font-bold text-[#1a3a6e] mb-4 border-b border-gray-200 pb-2">Key Officials</h3>
          {loading ? (
            Array.from({length: 3}).map((_, i) => (
              <Card key={i}><CardContent className="p-4 flex gap-4"><Skeleton className="h-16 w-16 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-2/3" /></div></CardContent></Card>
            ))
          ) : (
            displayOfficials.map((official, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-[#1a3a6e]">
                    <AvatarImage src={official.photoUrl} alt={official.name} />
                    <AvatarFallback className="bg-orange-100 text-[#1a3a6e] font-bold">
                      {official.name.split(' ').filter(Boolean).map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-[#1a3a6e]">{official.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{official.designation}</p>
                    {official.department && <p className="text-xs text-gray-500 mt-0.5">{official.department}</p>}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
