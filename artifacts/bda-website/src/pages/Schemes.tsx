import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Lock } from "lucide-react";

interface SchemeItem {
  id: number;
  type: "scheme" | "survey";
  title: string;
  imageUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  fees: string | null;
  bookletUrl: string | null;
  isActive: boolean;
  isOpenForRegistration: boolean;
}

interface SimpleCard {
  id: number;
  section: string;
  title: string;
  imageUrl: string | null;
  displayOrder: number;
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/* Card for Section 1 (open) — shows dates, fees, Apply button */
function OpenCard({ s }: { s: SchemeItem }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white w-44 flex-shrink-0">
      <div className="h-28 bg-gray-100 overflow-hidden">
        {s.imageUrl
          ? <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-gray-400 text-[11px] p-2 text-center">{s.title}</div>
        }
      </div>
      <div className="p-2">
        <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2 mb-1">{s.title}</p>
        <p className="text-[10px] text-green-700 font-semibold">Start :- {fmtDate(s.startDate)}</p>
        <p className="text-[10px] text-red-600 font-semibold">End :- {fmtDate(s.endDate)}</p>
        {s.fees && (
          <p className="text-[10px] text-gray-500 font-medium mt-0.5">Fee: ₹{Number(s.fees).toLocaleString("en-IN")}</p>
        )}
      </div>
      <Link href={`/schemes/${s.id}/apply`}>
        <button className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1.5 transition-colors">
          Apply
        </button>
      </Link>
      {s.bookletUrl && (
        <div className="flex items-center justify-center gap-1 text-[9px] text-purple-600 bg-purple-50 border-t border-purple-100 py-0.5">
          <Lock className="h-2.5 w-2.5" /> Booklet after payment
        </div>
      )}
    </div>
  );
}

/* Card for Section 2 (closed) — greyed out overlay */
function ClosedCard({ s }: { s: SchemeItem }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white w-44 flex-shrink-0 opacity-80">
      <div className="h-28 bg-gray-100 overflow-hidden relative">
        {s.imageUrl
          ? <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover grayscale-[40%]" />
          : <div className="w-full h-full flex items-center justify-center text-gray-400 text-[11px] p-2 text-center">{s.title}</div>
        }
        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
          <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">CLOSED</span>
        </div>
      </div>
      <div className="p-2">
        <p className="text-xs font-semibold text-gray-700 leading-tight line-clamp-2 mb-1">{s.title}</p>
        <p className="text-[10px] text-green-700 font-semibold">Start :- {fmtDate(s.startDate)}</p>
        <p className="text-[10px] text-red-600 font-semibold">End :- {fmtDate(s.endDate)}</p>
      </div>
    </div>
  );
}

/* Card for Sections 3 & 4 — only image + orange-label title */
function DisplayCard({ c }: { c: SimpleCard }) {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow w-44 h-28 flex-shrink-0 group">
      {c.imageUrl
        ? <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        : <div className="w-full h-full bg-gradient-to-br from-[#1a3a6e] to-[#0d2447]" />
      }
      <div className="absolute bottom-0 left-0 right-0 bg-orange-600 px-2 py-1.5">
        <p className="text-white text-xs font-bold text-center uppercase leading-tight line-clamp-2">{c.title}</p>
      </div>
    </div>
  );
}

function SectionHeading({ title, count, countCls }: { title: string; count?: number; countCls?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-lg font-bold text-gray-800 border-b-2 border-[#1a3a6e] pb-2 inline-block">{title}</h2>
      {count !== undefined && count > 0 && (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${countCls ?? "bg-green-100 text-green-700"}`}>
          {count} Open
        </span>
      )}
    </div>
  );
}

export default function Schemes() {
  const [all, setAll] = useState<SchemeItem[]>([]);
  const [cards, setCards] = useState<SimpleCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/schemes").then(r => r.json()),
      fetch("/api/scheme-cards").then(r => r.json()),
    ])
      .then(([schemes, sCards]) => {
        setAll(schemes);
        setCards(sCards);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Section 1: ALL open items (both surveys + schemes) — isOpenForRegistration=true
  const openItems = all.filter(s => s.isActive && s.isOpenForRegistration);

  // Section 2: ALL closed items (both surveys + schemes) — isActive but registration closed
  const closedItems = all.filter(s => s.isActive && !s.isOpenForRegistration);

  // Section 3: Ongoing Schemes display cards
  const ongoingCards = cards.filter(c => c.section === "ongoing");

  // Section 4: Schemes display cards
  const schemeCards = cards.filter(c => c.section === "schemes");

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-gray-500">
        Loading schemes...
      </div>
    );
  }

  const hasContent = openItems.length > 0 || closedItems.length > 0 || ongoingCards.length > 0 || schemeCards.length > 0;

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-8 space-y-10">

        {/* Section 1 — Open Survey and Registrations */}
        {openItems.length > 0 && (
          <section>
            <SectionHeading title="Open Survey and Registrations" count={openItems.length} />
            <div className="flex flex-wrap gap-4">
              {openItems.map(s => <OpenCard key={s.id} s={s} />)}
            </div>
          </section>
        )}

        {/* Section 2 — Recently Closed Survey/Scheme */}
        {closedItems.length > 0 && (
          <section>
            <SectionHeading title="Recently Closed Survey/Scheme" />
            <div className="flex flex-wrap gap-4">
              {closedItems.map(s => <ClosedCard key={s.id} s={s} />)}
            </div>
          </section>
        )}

        {/* Section 3 — Ongoing Schemes (simple display cards) */}
        {ongoingCards.length > 0 && (
          <section>
            <SectionHeading title="Ongoing Schemes" />
            <div className="flex flex-wrap gap-4">
              {ongoingCards.map(c => <DisplayCard key={c.id} c={c} />)}
            </div>
          </section>
        )}

        {/* Section 4 — Schemes (simple display cards) */}
        {schemeCards.length > 0 && (
          <section>
            <SectionHeading title="Schemes" />
            <div className="flex flex-wrap gap-4">
              {schemeCards.map(c => <DisplayCard key={c.id} c={c} />)}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!hasContent && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No schemes or surveys available at this time.</p>
            <p className="text-sm mt-1">Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
