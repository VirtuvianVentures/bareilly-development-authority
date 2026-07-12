import { useState, useEffect } from "react";

interface MarqueeItem {
  id: number;
  title: string;
  fileUrl: string | null;
  fileType: string | null;
  isActive: boolean;
}

const fallback: MarqueeItem[] = [
  { id: 0, title: "One Time Settlement (OTS) 2026 – Apply Now", fileUrl: null, fileType: null, isActive: true },
  { id: 1, title: "नई टाउनशिप भूमि की बिक्री पीलीभीत बाईपास के निकट", fileUrl: null, fileType: null, isActive: true },
  { id: 2, title: "Registration open for The Sky-Way Apartment (1 Jun 2025 to 31 Mar 2027)", fileUrl: null, fileType: null, isActive: true },
  { id: 3, title: "How to Apply Instructions for Property ITS 2026", fileUrl: null, fileType: null, isActive: true },
  { id: 4, title: "Model Building Construction and Development Byelaws and Model Zoning Regulation, 2025", fileUrl: null, fileType: null, isActive: true },
];

export function NewsTicker() {
  const [items, setItems] = useState<MarqueeItem[]>(fallback);

  useEffect(() => {
    fetch("/api/marquee")
      .then((r) => r.json())
      .then((data: MarqueeItem[]) => {
        if (Array.isArray(data) && data.length > 0) setItems(data);
      })
      .catch(() => {});
  }, []);

  const duration = Math.max(40, items.length * 12);

  const handleClick = (item: MarqueeItem) => {
    if (item.fileUrl) {
      window.open(item.fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="bg-orange-500 text-white overflow-hidden py-2 flex items-center">
      <div className="font-bold shrink-0 px-4 bg-orange-500 border-r-2 border-white/40 mr-0 z-10 hidden md:flex items-center gap-1 text-sm uppercase tracking-wide" style={{ whiteSpace: "nowrap" }}>
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
          <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
        </svg>
        NEWS
      </div>

      <div className="flex-1 overflow-hidden">
        <div
          className="whitespace-nowrap inline-block"
          style={{
            animation: `tickerScroll ${duration}s linear infinite`,
            willChange: "transform",
          }}
        >
          {[...items, ...items].map((item, idx) => (
            <span key={idx}>
              {item.fileUrl ? (
                <button
                  onClick={() => handleClick(item)}
                  className="inline-flex items-center gap-1 hover:underline underline-offset-2 cursor-pointer bg-transparent border-none text-white text-sm"
                  title="Click to open attachment"
                >
                  {item.fileType === "pdf" && (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0 opacity-90">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  )}
                  {item.fileType === "image" && (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0 opacity-90">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  )}
                  {item.title}
                </button>
              ) : (
                <span className="text-sm">{item.title}</span>
              )}
              <span className="mx-4 opacity-60">|</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
