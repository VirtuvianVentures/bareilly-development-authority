import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, ChevronDown, Menu, X, LogIn, ChevronRight } from "lucide-react";

const ABOUT_SUBMENU = [
  { label: "Objectives",             path: "/about/objectives" },
  { label: "BDA Officers",           path: "/about/bda-officers" },
  { label: "Board Members",          path: "/about/board-members" },
  { label: "Geographical Area",      path: "/about/geographical-area" },
  { label: "Organisation Structure", path: "/about/organisation-structure" },
];

const ACHIEVEMENTS_SUBMENU = [
  { label: "Housing Schemes",    path: "/achievements/housing-schemes" },
  { label: "Commercial Schemes", path: "/achievements/commercial-schemes" },
  { label: "Investors List",     path: "/achievements/investors-list" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [location] = useLocation();
  const aboutRef = useRef<HTMLLIElement>(null);
  const achievementsRef = useRef<HTMLLIElement>(null);

  const isAboutActive = location.startsWith("/about");
  const isAchievementsActive = location.startsWith("/achievements");

  const handleFontSize = (change: number) => {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    document.documentElement.style.fontSize = `${currentSize + change}px`;
  };

  const toggleContrast = () => {
    document.documentElement.classList.toggle("high-contrast");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) setAboutOpen(false);
      if (achievementsRef.current && !achievementsRef.current.contains(e.target as Node)) setAchievementsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setAboutOpen(false);
    setAchievementsOpen(false);
    setIsOpen(false);
  }, [location]);

  return (
    <header className="w-full bg-white shadow-sm flex flex-col z-50 sticky top-0">
      {/* Top Utility Bar */}
      <div className="bg-[#1a3a6e] text-white text-xs py-1.5 px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="hidden md:inline-block">Government of Uttar Pradesh</span>
          <div className="flex items-center gap-2">
            <button onClick={() => handleFontSize(-1)} className="px-1.5 py-0.5 hover:bg-white/20 rounded" data-testid="btn-font-decrease" aria-label="Decrease Font Size">A-</button>
            <button onClick={() => { document.documentElement.style.fontSize = '16px'; }} className="px-1.5 py-0.5 hover:bg-white/20 rounded" data-testid="btn-font-reset" aria-label="Reset Font Size">A</button>
            <button onClick={() => handleFontSize(1)} className="px-1.5 py-0.5 hover:bg-white/20 rounded" data-testid="btn-font-increase" aria-label="Increase Font Size">A+</button>
            <button onClick={toggleContrast} className="px-2 py-0.5 ml-2 border border-white/40 hover:bg-white/20 rounded" data-testid="btn-high-contrast">High Contrast</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-white focus:text-primary focus:p-2">Skip to Main Content</a>
          <button className="hover:text-gray-300">Screen Reader Access</button>
          <div className="flex gap-2">
            <button className="hover:text-gray-300">English</button>
            <span>|</span>
            <button className="hover:text-gray-300" lang="hi">हिन्दी</button>
          </div>
        </div>
      </div>

      {/* Main Logo Area */}
      <div className="py-4 px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/bda-logo.png" alt="BDA Logo" className="h-16 w-16 object-contain" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-[#1a3a6e] leading-tight">Bareilly Development Authority</h1>
                <p className="text-sm text-gray-600 hidden md:block">Government of Uttar Pradesh</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="hidden lg:flex items-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Seal_of_Uttar_Pradesh.svg" alt="UP Govt Logo" className="h-16 w-auto" />
        </div>
        <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)} data-testid="btn-mobile-menu">
          {isOpen ? <X className="h-6 w-6 text-[#1a3a6e]" /> : <Menu className="h-6 w-6 text-[#1a3a6e]" />}
        </button>
      </div>

      {/* Navigation Bar */}
      <nav className={`${isOpen ? 'block' : 'hidden'} lg:block bg-[#1a3a6e] w-full`} aria-label="Main Navigation">
        <ul className="flex flex-col lg:flex-row lg:items-center px-4 md:px-8 text-white text-sm font-semibold">

          {/* Home */}
          <li className="border-b border-white/10 lg:border-none">
            <Link href="/" className={`block py-3 px-4 hover:bg-white/10 ${location === "/" ? "bg-white/20" : ""}`}>Home</Link>
          </li>

          {/* About Us — with dropdown */}
          <li ref={aboutRef} className="border-b border-white/10 lg:border-none relative">
            {/* Desktop: hover/click button */}
            <button
              className={`hidden lg:flex items-center gap-1 py-3 px-4 hover:bg-white/10 w-full text-left ${isAboutActive ? "bg-white/20" : ""}`}
              onClick={() => setAboutOpen((o) => !o)}
              aria-haspopup="true"
              aria-expanded={aboutOpen}
            >
              About Us
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Mobile: link + toggle */}
            <div className="flex lg:hidden items-center">
              <Link href="/about/objectives" className={`flex-1 py-3 px-4 hover:bg-white/10 ${isAboutActive ? "bg-white/20" : ""}`}>About Us</Link>
              <button className="px-4 py-3 hover:bg-white/10" onClick={() => setAboutOpen((o) => !o)} aria-label="Toggle About Us submenu">
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Dropdown panel */}
            {aboutOpen && (
              <ul className="lg:absolute lg:top-full lg:left-0 bg-[#8b3a00] min-w-[220px] shadow-lg z-50 lg:rounded-b">
                {ABOUT_SUBMENU.map((item) => (
                  <li key={item.path} className="border-b border-white/10 last:border-0">
                    <Link
                      href={item.path}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-[#a84400] transition-colors
                        ${location === item.path ? "bg-[#a84400] font-semibold" : ""}`}
                    >
                      <ChevronRight className="h-3 w-3 flex-shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Schemes */}
          <li className="border-b border-white/10 lg:border-none">
            <Link href="/schemes" className={`block py-3 px-4 hover:bg-white/10 ${location === "/schemes" ? "bg-white/20" : ""}`}>Schemes</Link>
          </li>

          {/* Achievements — with dropdown */}
          <li ref={achievementsRef} className="border-b border-white/10 lg:border-none relative">
            <button
              className={`hidden lg:flex items-center gap-1 py-3 px-4 hover:bg-white/10 w-full text-left ${isAchievementsActive ? "bg-white/20" : ""}`}
              onClick={() => setAchievementsOpen((o) => !o)}
              aria-haspopup="true"
              aria-expanded={achievementsOpen}
            >
              Achievements
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${achievementsOpen ? "rotate-180" : ""}`} />
            </button>
            <div className="flex lg:hidden items-center">
              <Link href="/achievements/housing-schemes" className={`flex-1 py-3 px-4 hover:bg-white/10 ${isAchievementsActive ? "bg-white/20" : ""}`}>Achievements</Link>
              <button className="px-4 py-3 hover:bg-white/10" onClick={() => setAchievementsOpen((o) => !o)} aria-label="Toggle Achievements submenu">
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${achievementsOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
            {achievementsOpen && (
              <ul className="lg:absolute lg:top-full lg:left-0 bg-[#8b3a00] min-w-[200px] shadow-lg z-50 lg:rounded-b">
                {ACHIEVEMENTS_SUBMENU.map((item) => (
                  <li key={item.path} className="border-b border-white/10 last:border-0">
                    <Link
                      href={item.path}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-[#a84400] transition-colors
                        ${location === item.path ? "bg-[#a84400] font-semibold" : ""}`}
                    >
                      <ChevronRight className="h-3 w-3 flex-shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Remaining nav items */}
          {[
            { name: "Rules & Acts", path: "/rules-acts" },
            { name: "Media",        path: "/media" },
            { name: "Contact Us",   path: "/contact" },
            { name: "Raise Query",  path: "/raise-query" },
          ].map((item) => (
            <li key={item.name} className="border-b border-white/10 lg:border-none">
              <Link href={item.path} className={`block py-3 px-4 hover:bg-white/10 ${location === item.path ? "bg-white/20" : ""}`}>
                {item.name}
              </Link>
            </li>
          ))}

          {/* Portal Login */}
          <li className="border-b border-white/10 lg:border-none lg:ml-2">
            <Link href="/portal/login" className="flex items-center gap-1.5 py-3 px-4 hover:bg-orange-600/80 bg-orange-600 text-white font-semibold transition-colors">
              <LogIn className="h-4 w-4" />
              <span>Portal Login</span>
            </Link>
          </li>

          {/* Search */}
          <li className="ml-auto p-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-4 py-1.5 rounded-sm text-black text-sm w-48 focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Search website"
                data-testid="input-search"
              />
              <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-500" />
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}
