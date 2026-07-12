import { useState } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { FileSearch, Search, FileText, Languages, Sparkles, ChevronRight, UploadCloud, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const TOOLS = [
  {
    id: "extract",
    icon: FileSearch,
    color: "bg-blue-600",
    badge: "Document AI",
    badgeColor: "bg-blue-100 text-blue-700",
    title: "Document Auto-Extract",
    titleHi: "दस्तावेज़ से डेटा निकालें",
    desc: "Court notice, order या कोई भी PDF/image upload करें — AI case number, parties, date, court name automatically extract करेगा।",
    status: "available",
  },
  {
    id: "search",
    icon: Search,
    color: "bg-violet-600",
    badge: "Smart Search",
    badgeColor: "bg-violet-100 text-violet-700",
    title: "Natural Language Search",
    titleHi: "भाषा में खोजें",
    desc: "\"Ramesh ki property case\" जैसे plain Hindi/English में type करें — AI relevant court cases filter करेगा।",
    status: "available",
  },
  {
    id: "summary",
    icon: FileText,
    color: "bg-emerald-600",
    badge: "Case AI",
    badgeColor: "bg-emerald-100 text-emerald-700",
    title: "Case Summary Generator",
    titleHi: "केस सारांश बनाएं",
    desc: "Case details paste करें — AI ek clean, professional summary generate करेगा जो officer को directly share की जा सके।",
    status: "available",
  },
  {
    id: "translate",
    icon: Languages,
    color: "bg-orange-500",
    badge: "Translation",
    badgeColor: "bg-orange-100 text-orange-700",
    title: "Hindi ↔ English Translation",
    titleHi: "अनुवाद",
    desc: "Court orders, notices, ya any text को Hindi से English ya English से Hindi mein instantly translate करें।",
    status: "available",
  },
];

type ActiveTool = "extract" | "search" | "summary" | "translate" | null;

export default function AITools() {
  const [active, setActive] = useState<ActiveTool>(null);

  return (
    <PortalLayout title="AI Tools — Intelligent Assistance" moduleId="ai-tools">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">AI-Powered Tools</h2>
            <p className="text-sm text-gray-500">Court data management ke liye intelligent assistance</p>
          </div>
        </div>

        {/* Tool Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {TOOLS.map(tool => {
            const Icon = tool.icon;
            const isActive = active === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActive(isActive ? null : tool.id as ActiveTool)}
                className={`text-left rounded-xl border-2 p-5 transition-all hover:shadow-md
                  ${isActive ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 bg-white hover:border-blue-300"}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${tool.color} w-11 h-11 rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tool.badgeColor}`}>{tool.badge}</span>
                    </div>
                    <p className="font-bold text-gray-800 text-sm">{tool.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5" lang="hi">{tool.titleHi}</p>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed" lang="hi">{tool.desc}</p>
                  </div>
                  <ChevronRight className={`h-4 w-4 mt-1 shrink-0 transition-transform ${isActive ? "rotate-90 text-blue-500" : "text-gray-300"}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Tool Panels */}
        {active === "extract"  && <ExtractPanel   onClose={() => setActive(null)} />}
        {active === "search"   && <SearchPanel    onClose={() => setActive(null)} />}
        {active === "summary"  && <SummaryPanel   onClose={() => setActive(null)} />}
        {active === "translate"&& <TranslatePanel onClose={() => setActive(null)} />}

        {/* Coming soon footer */}
        <div className="mt-6 bg-gradient-to-r from-violet-50 to-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
          <Sparkles className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-600">
            <span className="font-semibold text-violet-700">और features आएंगे!</span>{" "}
            Use karke batayein kya kaam aaya — uske hisaab se aur AI features add kar sakte hain.
          </p>
        </div>
      </div>
    </PortalLayout>
  );
}

/* ─────────────────────────────────────────────
   PANEL 1 — Document Extract
───────────────────────────────────────────── */
function ExtractPanel({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | Record<string, string>>(null);
  const [text, setText] = useState("");

  const handleExtract = async () => {
    if (!text.trim()) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/ai/extract", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) setResult(await res.json());
      else setResult({ error: "API se response nahi aaya. Please retry." });
    } catch {
      setResult({ error: "Network error. Please try again." });
    } finally { setLoading(false); }
  };

  return (
    <PanelWrapper title="Document Auto-Extract" icon={FileSearch} color="bg-blue-600" onClose={onClose}>
      <p className="text-xs text-gray-500 mb-3">Court notice / order ka text paste karein — AI fields extract karega.</p>
      <Textarea
        value={text} onChange={e => setText(e.target.value)}
        placeholder="यहाँ court document का text paste करें..."
        className="min-h-[120px] text-sm mb-3" lang="hi"
      />
      <Button onClick={handleExtract} disabled={loading || !text.trim()} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
        {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Extract हो रहा है...</> : <><FileSearch className="h-4 w-4 mr-2" />Extract करें</>}
      </Button>
      {result && !result.error && (
        <div className="mt-4 border border-green-200 rounded-lg bg-green-50 p-4">
          <p className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Extracted Fields</p>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {Object.entries(result).map(([k, v]) => (
              <div key={k}>
                <dt className="text-[10px] uppercase tracking-wide text-gray-400">{k}</dt>
                <dd className="text-sm font-medium text-gray-800">{v || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      {result?.error && <p className="mt-3 text-sm text-red-600">{result.error}</p>}
    </PanelWrapper>
  );
}

/* ─────────────────────────────────────────────
   PANEL 2 — Smart Search
───────────────────────────────────────────── */
function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/ai/search", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (res.ok) { const d = await res.json(); setResult(d.result); }
      else setResult("API se response nahi aaya.");
    } catch { setResult("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const examples = ["Ramesh ki property case", "2024 ke pending cases", "High Court mein BDA ke cases"];

  return (
    <PanelWrapper title="Natural Language Search" icon={Search} color="bg-violet-600" onClose={onClose}>
      <p className="text-xs text-gray-500 mb-3">Hindi ya English mein apna query type karein.</p>
      <div className="flex gap-2 mb-3">
        <Input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="e.g. Ramesh ki property case..." className="text-sm"
          onKeyDown={e => e.key === "Enter" && handleSearch()} />
        <Button onClick={handleSearch} disabled={loading || !query.trim()} className="bg-violet-600 hover:bg-violet-700 text-white shrink-0">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {examples.map(ex => (
          <button key={ex} onClick={() => setQuery(ex)}
            className="text-xs px-2 py-1 rounded-full bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200">
            {ex}
          </button>
        ))}
      </div>
      {result && (
        <div className="border border-violet-200 rounded-lg bg-violet-50 p-4 text-sm text-gray-700 whitespace-pre-wrap">{result}</div>
      )}
    </PanelWrapper>
  );
}

/* ─────────────────────────────────────────────
   PANEL 3 — Case Summary
───────────────────────────────────────────── */
function SummaryPanel({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) { const d = await res.json(); setResult(d.summary); }
      else setResult("API se response nahi aaya.");
    } catch { setResult("Network error."); }
    finally { setLoading(false); }
  };

  return (
    <PanelWrapper title="Case Summary Generator" icon={FileText} color="bg-emerald-600" onClose={onClose}>
      <p className="text-xs text-gray-500 mb-3">Case details paste karein — AI ek professional summary banayega.</p>
      <Textarea value={text} onChange={e => setText(e.target.value)}
        placeholder="Case details yahan paste karein..."
        className="min-h-[120px] text-sm mb-3" />
      <Button onClick={handleSummarize} disabled={loading || !text.trim()} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">
        {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Summary ban rahi hai...</> : <><FileText className="h-4 w-4 mr-2" />Summary Generate Karein</>}
      </Button>
      {result && (
        <div className="mt-4 border border-emerald-200 rounded-lg bg-emerald-50 p-4">
          <p className="text-xs font-semibold text-emerald-700 mb-2 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Generated Summary</p>
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </PanelWrapper>
  );
}

/* ─────────────────────────────────────────────
   PANEL 4 — Translation
───────────────────────────────────────────── */
function TranslatePanel({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  const [direction, setDirection] = useState<"hi-en" | "en-hi">("hi-en");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/ai/translate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, direction }),
      });
      if (res.ok) { const d = await res.json(); setResult(d.translation); }
      else setResult("API se response nahi aaya.");
    } catch { setResult("Network error."); }
    finally { setLoading(false); }
  };

  return (
    <PanelWrapper title="Hindi ↔ English Translation" icon={Languages} color="bg-orange-500" onClose={onClose}>
      <div className="flex gap-2 mb-3">
        <button onClick={() => setDirection("hi-en")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors
            ${direction === "hi-en" ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"}`}>
          Hindi → English
        </button>
        <button onClick={() => setDirection("en-hi")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors
            ${direction === "en-hi" ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"}`}>
          English → Hindi
        </button>
      </div>
      <Textarea value={text} onChange={e => setText(e.target.value)}
        placeholder={direction === "hi-en" ? "Hindi text yahan likhein..." : "Type English text here..."}
        className="min-h-[100px] text-sm mb-3"
        lang={direction === "hi-en" ? "hi" : "en"} />
      <Button onClick={handleTranslate} disabled={loading || !text.trim()} className="bg-orange-500 hover:bg-orange-600 text-white w-full">
        {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Translate ho raha hai...</> : <><Languages className="h-4 w-4 mr-2" />Translate Karein</>}
      </Button>
      {result && (
        <div className="mt-4 border border-orange-200 rounded-lg bg-orange-50 p-4">
          <p className="text-xs font-semibold text-orange-700 mb-2 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Translation</p>
          <p className="text-sm text-gray-800 leading-relaxed">{result}</p>
        </div>
      )}
    </PanelWrapper>
  );
}

/* ─────────────────────────────────────────────
   Shared Panel Wrapper
───────────────────────────────────────────── */
function PanelWrapper({ title, icon: Icon, color, onClose, children }: {
  title: string; icon: React.ElementType; color: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border-2 border-blue-200 shadow-sm p-5 mb-6 relative">
      <div className="flex items-center gap-3 mb-4">
        <div className={`${color} w-8 h-8 rounded-lg flex items-center justify-center shrink-0`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <h3 className="font-bold text-gray-800">{title}</h3>
        <button onClick={onClose} className="ml-auto text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-100">✕ Close</button>
      </div>
      {children}
    </div>
  );
}
