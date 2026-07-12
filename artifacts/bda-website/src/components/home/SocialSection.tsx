import { useEffect, useRef, useState } from "react";

const FB_PAGE_URL = "https://www.facebook.com/bareillydevelopmentauthority.bda";
const TW_HANDLE   = "BareillyVc";
const TW_URL      = `https://twitter.com/${TW_HANDLE}`;
const IG_URL      = "https://www.instagram.com/bda_bareilly.official";

/* ── shared follow-button ── */
function FollowBtn({ href, bg, children }: { href: string; bg: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className="mt-2 flex items-center justify-center gap-2 w-full text-center text-white font-semibold text-sm py-2 rounded transition-opacity hover:opacity-90"
       style={{ background: bg }}>
      {children}
    </a>
  );
}

/* ────────────────────────────────────────────────────────────────
   FACEBOOK – official Page Plugin (free, no API key needed)
   Works on any deployed domain. Blocked only in Replit dev proxy.
───────────────────────────────────────────────────────────────── */
function FacebookWidget() {
  const [blocked, setBlocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const src =
    "https://www.facebook.com/plugins/page.php" +
    "?href=" + encodeURIComponent(FB_PAGE_URL) +
    "&tabs=timeline&width=380&height=480" +
    "&small_header=false&adapt_container_width=true" +
    "&hide_cover=false&show_facepile=true&locale=en_US";

  useEffect(() => {
    const t = setTimeout(() => {
      // If iframe is still blank after 4s it's likely blocked by X-Frame-Options
      const iframe = iframeRef.current;
      if (!iframe) return;
      try {
        const doc = iframe.contentDocument;
        if (!doc || doc.body?.innerHTML === "") setBlocked(true);
      } catch {
        setBlocked(true); // cross-origin access throws if blocked
      }
    }, 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="rounded shadow overflow-hidden bg-white border border-gray-200 relative" style={{ minHeight: 480 }}>
      <iframe
        ref={iframeRef}
        src={src}
        width="380"
        height="480"
        style={{ border: "none", display: "block", width: "100%" }}
        scrolling="no"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        title="BDA Facebook Page"
        loading="lazy"
        onError={() => setBlocked(true)}
      />
      {blocked && <DevFallback platform="Facebook" href={FB_PAGE_URL} color="#1877F2" />}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   TWITTER – official timeline widget (free, no API key needed)
   Works on any deployed domain. Rate-limited only in Replit dev.
───────────────────────────────────────────────────────────────── */
function TwitterWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [blocked, setBlocked]   = useState(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const tryLoad = () => {
      if (!(window as any).twttr?.widgets) return;
      (window as any).twttr.widgets.createTimeline(
        { sourceType: "profile", screenName: TW_HANDLE },
        containerRef.current!,
        { height: 480, theme: "light", chrome: "nofooter noborders noheader", tweetLimit: 3 }
      )
        .then((el: any) => { if (el) setRendered(true); else setBlocked(true); })
        .catch(() => setBlocked(true));
    };

    if ((window as any).twttr?.widgets) {
      tryLoad();
    } else {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = tryLoad;
      script.onerror = () => setBlocked(true);
      document.body.appendChild(script);
      // fallback timeout
      setTimeout(() => { if (!rendered) setBlocked(true); }, 8000);
    }
  }, []);

  return (
    <div className="rounded shadow border border-gray-200 bg-white overflow-hidden relative" style={{ minHeight: 480 }}>
      <div ref={containerRef} style={{ minHeight: 480 }} />
      {!rendered && !blocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-7 w-7 text-gray-300" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}
      {blocked && <DevFallback platform="Twitter / X" href={TW_URL} color="#000" />}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   INSTAGRAM – official oEmbed post embed (free, no key needed)
   Instagram does not offer a profile widget; individual post
   embeds via /p/{id}/embed/ are the official free method.
───────────────────────────────────────────────────────────────── */
function InstagramWidget() {
  const [blocked, setBlocked] = useState(false);
  // Official Instagram embed URL for a profile's latest post embed
  const src = "https://www.instagram.com/bda_bareilly.official/embed/";

  return (
    <div className="rounded shadow border border-gray-200 bg-white overflow-hidden relative" style={{ minHeight: 480 }}>
      {/* Profile header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full p-0.5 shrink-0"
             style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
          <div className="w-full h-full rounded-full bg-[#1a3a6e] flex items-center justify-center text-white font-bold text-[10px]">BDA</div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900 leading-tight">bda_bareilly.official</p>
          <p className="text-xs text-gray-500">Bareilly Development Authority</p>
        </div>
        <IgLogo />
      </div>

      {!blocked ? (
        <iframe
          src={src}
          width="100%"
          height="400"
          style={{ border: "none", display: "block" }}
          frameBorder="0"
          scrolling="no"
          title="BDA Instagram"
          loading="lazy"
          onError={() => setBlocked(true)}
        />
      ) : (
        <DevFallback platform="Instagram" href={IG_URL} color="#c13584" />
      )}
    </div>
  );
}

function IgLogo() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22}>
      <defs>
        <linearGradient id="ig-l" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433" /><stop offset="50%" stopColor="#dc2743" /><stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      <path fill="url(#ig-l)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

/* ── shown only when embed is blocked in dev / preview ── */
function DevFallback({ platform, href, color }: { platform: string; href: string; color: string }) {
  return (
    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: color }}>
        <svg viewBox="0 0 24 24" width={24} height={24} fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
      </div>
      <p className="font-semibold text-gray-800 text-sm">{platform} Live Feed</p>
      <p className="text-xs text-gray-500 max-w-[200px] leading-relaxed">
        This embed is blocked by {platform} in the preview environment. It will display live posts when the site is deployed.
      </p>
      <a href={href} target="_blank" rel="noopener noreferrer"
         className="text-xs font-semibold px-4 py-2 rounded text-white"
         style={{ backgroundColor: color }}>
        Open {platform} Page →
      </a>
    </div>
  );
}

/* ── Main ── */
export function SocialSection() {
  return (
    <div className="py-12 bg-[#f5f5f5]">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-2xl font-bold text-center text-[#1a3a6e] mb-2 uppercase tracking-wide">
          Stay Connected
        </h2>
        <div className="w-16 h-1 bg-orange-500 mx-auto mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div>
            <h3 className="text-xl font-extrabold text-gray-800 uppercase tracking-widest mb-3">FACEBOOK</h3>
            <FacebookWidget />
            <FollowBtn href={FB_PAGE_URL} bg="#1877F2">Visit our Facebook Page</FollowBtn>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-gray-800 uppercase tracking-widest mb-3">TWITTER</h3>
            <TwitterWidget />
            <FollowBtn href={TW_URL} bg="#000">Follow us on Twitter / X</FollowBtn>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-gray-800 uppercase tracking-widest mb-3">INSTAGRAM</h3>
            <InstagramWidget />
            <FollowBtn href={IG_URL} bg="linear-gradient(90deg,#833ab4,#fd1d1d,#fcb045)">Follow us on Instagram</FollowBtn>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Live social feeds use the official free embed APIs from each platform and display fully on the published website.
        </p>
      </div>
    </div>
  );
}
