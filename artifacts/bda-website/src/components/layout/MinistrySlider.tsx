const ministries = [
  {
    name: "UDYOG BANDHU",
    svgIcon: (
      <svg viewBox="0 0 44 44" className="w-11 h-11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="10" stroke="#555" strokeWidth="2.5" fill="none"/>
        {[0,45,90,135,180,225,270,315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 22 + 10 * Math.cos(rad);
          const y1 = 22 + 10 * Math.sin(rad);
          const x2 = 22 + 16 * Math.cos(rad);
          const y2 = 22 + 16 * Math.sin(rad);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#555" strokeWidth="3" strokeLinecap="round"/>;
        })}
        <circle cx="22" cy="22" r="4" fill="#555"/>
        <circle cx="22" cy="22" r="18" stroke="#555" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
    color: "#444444",
  },
  {
    name: "Ministry of External Affairs",
    svgIcon: (
      <svg viewBox="0 0 44 44" className="w-11 h-11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="9" r="5" fill="#8B4513"/>
        <rect x="17" y="14" width="10" height="13" rx="1" fill="#8B4513"/>
        <rect x="11" y="27" width="22" height="3.5" rx="1" fill="#8B4513"/>
        <rect x="9" y="30.5" width="26" height="2.5" rx="1" fill="#8B4513"/>
        <line x1="15" y1="33" x2="13" y2="40" stroke="#8B4513" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="29" y1="33" x2="31" y2="40" stroke="#8B4513" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
    color: "#8B4513",
  },
  {
    name: "Ministry of Overseas Indian Affairs",
    svgIcon: (
      <svg viewBox="0 0 44 44" className="w-11 h-11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="18" stroke="#1a6bbf" strokeWidth="2" fill="none"/>
        <ellipse cx="22" cy="22" rx="9" ry="18" stroke="#1a6bbf" strokeWidth="1.5" fill="none"/>
        <line x1="4" y1="22" x2="40" y2="22" stroke="#1a6bbf" strokeWidth="1.5"/>
        <line x1="7" y1="14" x2="37" y2="14" stroke="#1a6bbf" strokeWidth="1"/>
        <line x1="7" y1="30" x2="37" y2="30" stroke="#1a6bbf" strokeWidth="1"/>
      </svg>
    ),
    color: "#1a6bbf",
  },
  {
    name: "Housing and Urban Planning Department",
    svgIcon: (
      <svg viewBox="0 0 44 44" className="w-11 h-11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 6 L38 22 H6 Z" stroke="#2c7a3a" strokeWidth="2" fill="none" strokeLinejoin="round"/>
        <rect x="15" y="22" width="14" height="16" rx="1" stroke="#2c7a3a" strokeWidth="2" fill="none"/>
        <rect x="19" y="27" width="6" height="11" rx="1" fill="#2c7a3a"/>
      </svg>
    ),
    color: "#2c7a3a",
  },
  {
    name: "Awas Bandhu",
    svgIcon: (
      <svg viewBox="0 0 44 44" className="w-11 h-11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="38" height="38" rx="5" fill="#e05c1a"/>
        <path d="M22 10 L36 24 H8 Z" fill="white"/>
        <rect x="15" y="24" width="14" height="17" rx="1" fill="white"/>
        <rect x="19" y="29" width="6" height="12" rx="1" fill="#e05c1a"/>
      </svg>
    ),
    color: "#e05c1a",
  },
  {
    name: "UPFC",
    svgIcon: (
      <svg viewBox="0 0 44 44" className="w-11 h-11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="8" width="36" height="28" rx="4" stroke="#1a3a8e" strokeWidth="2" fill="none"/>
        <text x="22" y="27" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1a3a8e" fontFamily="sans-serif">UPFC</text>
      </svg>
    ),
    color: "#1a3a8e",
  },
  {
    name: "Digital India",
    svgIcon: (
      <svg viewBox="0 0 44 44" className="w-11 h-11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="10" width="34" height="22" rx="3" stroke="#f4a020" strokeWidth="2" fill="none"/>
        <path d="M10 22 L17 16 L24 23 L30 17 L37 21" stroke="#f4a020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="16" y1="32" x2="28" y2="32" stroke="#f4a020" strokeWidth="2"/>
        <line x1="22" y1="32" x2="22" y2="38" stroke="#f4a020" strokeWidth="2"/>
      </svg>
    ),
    color: "#f4a020",
  },
  {
    name: "Swachh Bharat Mission",
    svgIcon: (
      <svg viewBox="0 0 44 44" className="w-11 h-11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="18" stroke="#27ae60" strokeWidth="2" fill="none"/>
        <path d="M13 23 L19 29 L31 15" stroke="#27ae60" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "#27ae60",
  },
  {
    name: "National Urban Livelihoods Mission",
    svgIcon: (
      <svg viewBox="0 0 44 44" className="w-11 h-11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="14" r="6" stroke="#6a0dad" strokeWidth="2" fill="none"/>
        <path d="M10 38 C10 29 34 29 34 38" stroke="#6a0dad" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="12" cy="20" r="4" stroke="#6a0dad" strokeWidth="1.5" fill="none"/>
        <circle cx="32" cy="20" r="4" stroke="#6a0dad" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
    color: "#6a0dad",
  },
];

const items = [...ministries, ...ministries, ...ministries];

export function MinistrySlider() {
  return (
    <div
      className="bg-[#f0f0f0] border-t-2 border-b border-gray-300 py-4 overflow-hidden"
      aria-label="Government Ministry Partners"
      style={{ position: "relative" }}
    >
      <div
        className="ministry-track flex items-center gap-14"
        style={{
          width: "max-content",
          animation: "ministryMarquee 35s linear infinite",
        }}
      >
        {items.map((m, i) => (
          <div
            key={i}
            className="flex items-center gap-3 shrink-0"
            data-testid={`ministry-logo-${i % ministries.length}`}
          >
            <div className="flex-shrink-0 drop-shadow-sm">{m.svgIcon}</div>
            <span
              className="text-[13px] font-bold leading-tight"
              style={{ color: m.color, maxWidth: 110, whiteSpace: "normal", display: "inline-block" }}
            >
              {m.name}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ministryMarquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .ministry-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
