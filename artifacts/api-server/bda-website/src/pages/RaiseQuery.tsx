import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Loader2, CheckCircle, Search, Send, ClipboardList, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { printComplaint } from "@/lib/printComplaint";

interface Subject { id: number; subject: string; officerName: string | null; officerMobile: string | null; officerEmail: string | null; }

const STATUS_STEPS = ["submitted", "acknowledged", "in_progress", "resolved", "closed"];
const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted", acknowledged: "Acknowledged", in_progress: "In Progress",
  resolved: "Resolved", closed: "Closed", rejected: "Rejected",
};
const STATUS_COLOR: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-700", acknowledged: "bg-yellow-100 text-yellow-700",
  in_progress: "bg-orange-100 text-orange-700", resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-600", rejected: "bg-red-100 text-red-700",
};

const empty = { applicantName: "", mobile: "", email: "", description: "", subjectId: "" };

export default function RaiseQuery() {
  const [tab, setTab] = useState<"submit" | "track">("submit");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<any | null>(null);
  const [ticketInput, setTicketInput] = useState("");
  const [tracking, setTracking] = useState(false);
  const [tracked, setTracked] = useState<any>(null);
  const [trackError, setTrackError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/grievance-masters/subjects")
      .then(r => r.ok ? r.json() : [])
      .then((data: Subject[]) => setSubjects(data.filter((s: any) => s.isActive)))
      .catch(() => {});
  }, []);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const selectedSubject = subjects.find(s => String(s.id) === form.subjectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.applicantName || !form.mobile || !form.subjectId) {
      toast({ title: "Please fill all required fields", variant: "destructive" }); return;
    }
    setSubmitting(true);
    try {
      const payload = {
        applicantName: form.applicantName,
        mobile: form.mobile,
        email: form.email,
        description: form.description || form.applicantName,
        subject: selectedSubject?.subject || "",
        category: "other",
      };
      const res = await fetch("/api/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSubmitted(data);
      setForm(empty);
    } catch {
      toast({ title: "Submission failed. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async () => {
    if (!ticketInput.trim()) return;
    setTracking(true); setTrackError(""); setTracked(null);
    try {
      const res = await fetch(`/api/grievances/track/${ticketInput.trim().toUpperCase()}`);
      if (!res.ok) { setTrackError("No grievance found with this ticket number."); return; }
      setTracked(await res.json());
    } catch {
      setTrackError("Error fetching ticket. Please try again.");
    } finally {
      setTracking(false);
    }
  };

  const stepIndex = (status: string) => STATUS_STEPS.indexOf(status);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex text-sm text-gray-500">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li className="mx-2">/</li>
            <li className="text-gray-900 font-medium">Raise Query / Register Complaint</li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold text-[#1a3a6e] mb-2 border-b-2 border-orange-500 pb-2 inline-block">
          Raise Query / Register Complaint
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mt-6 mb-6">
          {[
            { key: "submit", label: "Register Complaint", icon: Send },
            { key: "track", label: "Track Complaint", icon: Search },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key}
              onClick={() => { setTab(key as any); setSubmitted(null); setTracked(null); setTrackError(""); }}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${tab === key ? "bg-[#1a3a6e] text-white border-[#1a3a6e]" : "bg-white text-gray-600 border-gray-300 hover:border-[#1a3a6e]"}`}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {/* ── SUBMIT TAB ── */}
        {tab === "submit" && (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left illustration side */}
            <div className="hidden md:flex md:w-2/5 bg-[#e8f4f8] rounded-xl items-center justify-center p-8">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-[#1a3a6e] rounded-full flex items-center justify-center">
                  <ClipboardList className="h-16 w-16 text-white" />
                </div>
                <p className="text-[#1a3a6e] font-bold text-lg">Register Your Complaint</p>
                <p className="text-xs text-gray-500 mt-2">Your grievance will be addressed within 30 working days</p>
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Complaint Registered!</h2>
                  <p className="text-gray-500 mb-4">Your ticket number is:</p>
                  <div className="inline-block bg-green-50 border border-green-200 rounded-lg px-8 py-3 mb-4">
                    <span className="text-2xl font-mono font-bold text-green-700">{submitted.ticketNo}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-6">Please note this ticket number to track your complaint status.</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button onClick={() => setSubmitted(null)} variant="outline">Register Another</Button>
                    <Button onClick={() => printComplaint(submitted)} variant="outline" className="border-orange-400 text-orange-600 hover:bg-orange-50">
                      <Printer className="h-4 w-4 mr-2" /> Print Receipt
                    </Button>
                    <Button onClick={() => { setTab("track"); setTicketInput(submitted.ticketNo); setSubmitted(null); }}
                      className="bg-[#1a3a6e] hover:bg-[#16305c]">
                      <Search className="h-4 w-4 mr-2" /> Track Complaint
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-xs text-red-500 font-medium">Note: Do not refresh page until you submit your complaint.</p>

                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Complainant Name <span className="text-red-500">*</span></Label>
                    <Input value={form.applicantName} onChange={e => set("applicantName", e.target.value)}
                      className="mt-1" placeholder="Enter Your Name" required />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">Mobile <span className="text-red-500">*</span></Label>
                      <Input value={form.mobile} onChange={e => set("mobile", e.target.value)}
                        className="mt-1" placeholder="Enter 10 Digit Mobile Number" maxLength={10} required />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">Email (*)</Label>
                      <Input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                        className="mt-1" placeholder="Enter Email id" />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Select Subject (*) <span className="text-red-500">*</span></Label>
                    <select value={form.subjectId} onChange={e => set("subjectId", e.target.value)} required
                      className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6e]">
                      <option value="">-- Subjects --</option>
                      {subjects.length > 0
                        ? subjects.map(s => <option key={s.id} value={s.id}>{s.subject}</option>)
                        : <option disabled>No subjects configured</option>}
                    </select>
                  </div>

                  {/* Officer info (auto-filled based on subject selection) */}
                  {selectedSubject && (selectedSubject.officerName || selectedSubject.officerMobile) && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-blue-700 space-y-0.5">
                      <p className="font-semibold">Responsible Officer:</p>
                      {selectedSubject.officerName && <p>👤 {selectedSubject.officerName}</p>}
                      {selectedSubject.officerMobile && <p>📞 {selectedSubject.officerMobile}</p>}
                      {selectedSubject.officerEmail && <p>✉️ {selectedSubject.officerEmail}</p>}
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Write Your Complaint Here</Label>
                    <textarea value={form.description} onChange={e => set("description", e.target.value)}
                      rows={5} placeholder="Write your complaint in 1000 words"
                      className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1a3a6e]" />
                  </div>

                  <Button type="submit" disabled={submitting} className="bg-[#1a3a6e] hover:bg-[#16305c] px-8 h-10">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                    Submit Complaint
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── TRACK TAB ── */}
        {tab === "track" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
            <div className="flex gap-2 mb-6">
              <Input value={ticketInput} onChange={e => setTicketInput(e.target.value.toUpperCase())}
                placeholder="Enter ticket number (e.g. BDA-ABC123)" className="font-mono"
                onKeyDown={e => e.key === "Enter" && handleTrack()} />
              <Button onClick={handleTrack} disabled={tracking} className="bg-[#1a3a6e] hover:bg-[#16305c] px-6">
                {tracking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>

            {trackError && (
              <div className="text-center py-8 text-gray-400">
                <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">{trackError}</p>
              </div>
            )}

            {tracked && (
              <div className="space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <span className="text-xs text-gray-400">Ticket No.</span>
                    <p className="font-mono font-bold text-lg text-[#1a3a6e]">{tracked.ticketNo}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLOR[tracked.status]}`}>
                    {STATUS_LABEL[tracked.status]}
                  </span>
                </div>

                {tracked.status !== "rejected" && (
                  <div className="flex items-center gap-0">
                    {STATUS_STEPS.map((step, i) => {
                      const current = stepIndex(tracked.status);
                      const done = i <= current;
                      return (
                        <div key={step} className="flex items-center flex-1">
                          <div className="flex flex-col items-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${done ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-300 text-gray-400"}`}>
                              {done ? "✓" : i + 1}
                            </div>
                            <span className={`text-[10px] mt-1 text-center w-16 ${done ? "text-green-600 font-medium" : "text-gray-400"}`}>
                              {STATUS_LABEL[step]}
                            </span>
                          </div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div className={`h-0.5 flex-1 mb-4 ${i < stepIndex(tracked.status) ? "bg-green-400" : "bg-gray-200"}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 text-sm border-t pt-4">
                  {[
                    ["Applicant", tracked.applicantName],
                    ["Mobile", tracked.mobile],
                    ["Subject", tracked.subject],
                    ["Date Submitted", new Date(tracked.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })],
                    ["Assigned To", tracked.assignedTo || "Pending assignment"],
                    ["Department", tracked.assignedDepartment || "—"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span className="text-xs text-gray-400">{label}</span>
                      <p className="font-medium text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>

                {tracked.resolution && (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-sm">
                    <p className="text-xs font-semibold text-green-700 mb-1">Resolution</p>
                    <p className="text-gray-700">{tracked.resolution}</p>
                  </div>
                )}
              </div>
            )}

            {!tracked && !trackError && !tracking && (
              <div className="text-center py-8 text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Enter your ticket number above to check the status of your complaint.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
