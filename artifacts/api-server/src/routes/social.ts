import { Router } from "express";

const router = Router();

/**
 * Proxy Twitter/X RSS via multiple public Nitter instances.
 * Nitter is a free, open-source Twitter front-end that exposes RSS feeds.
 * We try each mirror in order and return the first successful response.
 */
const NITTER_MIRRORS = [
  "https://nitter.privacydev.net",
  "https://nitter.poast.org",
  "https://nitter.net",
  "https://nitter.1d4.us",
];

const TW_HANDLE = "BareillyVc";

router.get("/social/twitter", async (req, res) => {
  let lastError = "";

  for (const mirror of NITTER_MIRRORS) {
    try {
      const url = `${mirror}/${TW_HANDLE}/rss`;
      const r = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 BDA-Website/1.0" },
        signal: AbortSignal.timeout(5000),
      });
      if (!r.ok) { lastError = `${mirror}: HTTP ${r.status}`; continue; }

      const xml = await r.text();
      const items = parseRssItems(xml).slice(0, 5);
      res.json({ ok: true, source: mirror, items });
      return;
    } catch (e: any) {
      lastError = `${mirror}: ${e.message}`;
    }
  }

  res.status(503).json({ ok: false, error: lastError, items: [] });
});

function parseRssItems(xml: string) {
  const items: { title: string; link: string; pubDate: string; description: string }[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;

  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    const title       = extractTag(block, "title");
    const link        = extractTag(block, "link");
    const pubDate     = extractTag(block, "pubDate");
    const description = stripHtml(extractTag(block, "description"));
    items.push({ title: stripCdata(title), link, pubDate, description: stripCdata(description) });
  }
  return items;
}

function extractTag(xml: string, tag: string) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return m ? m[1].trim() : "";
}

function stripCdata(s: string) {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}

export default router;
