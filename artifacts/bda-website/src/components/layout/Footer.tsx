import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronUp } from "lucide-react";

export function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* Policy links row */}
      <div className="bg-[#3a3a3a] py-3">
        <div className="flex flex-wrap justify-center items-center gap-x-0 text-sm text-gray-200">
          <a href="#" className="px-4 hover:text-white hover:underline" data-testid="link-website-policies">
            Website Policies
          </a>
          <span className="text-gray-500">|</span>
          <Link href="/contact" className="px-4 hover:text-white hover:underline" data-testid="link-contact-us">
            Contact Us
          </Link>
          <span className="text-gray-500">|</span>
          <Link href="/about" className="px-4 hover:text-white hover:underline" data-testid="link-about-us">
            About Us
          </Link>
          <span className="text-gray-500">|</span>
          <a href="#" className="px-4 hover:text-white hover:underline" data-testid="link-refund-policy">
            Refund Policy
          </a>
        </div>
      </div>

      {/* Credits row */}
      <div className="bg-[#222222] py-4 text-center">
        <p className="text-gray-400 text-xs leading-6">
          Website Content Managed by{" "}
          <strong className="text-gray-200 font-semibold">Bareilly Development Authority</strong>
        </p>
        <p className="text-gray-400 text-xs">
          Designed &amp; Developed by{" "}
          <a
            href="https://virtuvianventures.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-300"
            data-testid="link-developer"
          >
            Virtuvian Ventures Pvt. Ltd.
          </a>
        </p>
      </div>

      {/* Scroll to top button */}
      {showTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          data-testid="button-scroll-to-top"
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#e05c1a] hover:bg-[#c44d10] text-white flex items-center justify-center shadow-lg transition-colors"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
}
