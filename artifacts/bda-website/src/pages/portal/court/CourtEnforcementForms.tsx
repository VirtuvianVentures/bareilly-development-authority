import { useState, useMemo } from "react";
import { useCourtMasters } from "./CourtMasterContext";
import { CourtLayout } from "@/components/court/CourtLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ChevronUp, ChevronDown, Plus, Save, RotateCcw } from "lucide-react";

/* ── helpers ── */
function SectionHeader({
  title, open, onToggle,
}: { title: string; open: boolean; onToggle: () => void }) {
  return (
    <div
      className="flex items-center justify-between bg-[#1a3a6e] text-white px-4 py-2 cursor-pointer select-none rounded-t"
      onClick={onToggle}
    >
      <span className="font-semibold text-sm tracking-wide">{title}</span>
      {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
    </div>
  );
}

function Section({
  title, children,
}: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-gray-300 rounded mb-4 shadow-sm bg-white">
      <SectionHeader title={title} open={open} onToggle={() => setOpen(o => !o)} />
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}

function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-gray-700 font-medium">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

function SInput({ placeholder, type = "text", value, onChange, disabled }: {
  placeholder?: string; type?: string; value?: string;
  onChange?: (v: string) => void; disabled?: boolean;
}) {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      value={value ?? ""}
      onChange={e => onChange?.(e.target.value)}
      disabled={disabled}
      className="h-8 text-sm border-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
    />
  );
}

function SSelect({ placeholder, options, value, onChange }: {
  placeholder: string; options: string[]; value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 text-sm border-gray-300">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(o => <SelectItem key={o} value={o} className="text-sm">{o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

/* ── districts list ── */
const DISTRICTS = ["Bareilly", "Badaun", "Pilibhit", "Shahjahanpur", "Rampur"];

/* ── default form state ── */
const EMPTY = {
  courtType: "", courtName: "", caseType: "", year: "", caseNo: "",
  caseRelatedTo: "", subjectOfWrit: "", dateOfReceivingWrit: "",
  advocate: "", connectedWithCaseNo: "", noticeNo: "", noticeDate: "",
  noOfPetitioner: "", petitionerCategory: "",
  petName: "", petFatherName: "", petAddress: "", petDistrict: "",
  petitionerCouncil: "", petCouncilNo: "", petitionerDetails: "",
  noOfOpposite: "", oppositeCategory: "",
  oppName: "", oppFatherName: "", oppAddress: "", oppDistrict: "",
  oppositeCouncil: "", oppCouncilNo: "", oppositeDetails: "",
  caseStatus: "", courtOrderDate: "", dateOfHearing: "",
  orderStatus: "", complianceRequired: "", dueComplianceData: "",
  complianceStatus: "", complianceByWhom: "", complianceActualDate: "",
  dateOfSendingNarrativeToShashan: "", dateOfDisposal: "",
  email: "", principalSecretaryInParty: "", caRaStatus: "",
  dueDateOfCAFilling: "", dateOfCounterAffidavitFilling: "",
  remark: "", narrativeAt: "N/A", narrativeDate: "",
  writFileDate: "", writFileTitle: "",
  counterFileDate: "", counterFileTitle: "",
  judgementFileDate: "", judgementFileTitle: "",
  complianceFileDate: "", complianceFileTitle: "",
};

type FormState = typeof EMPTY;

/* ── saved cases table columns ── */
const TABLE_COLS = [
  "S.No", "Case No", "Year", "Court Type", "Court Name", "Case Type",
  "Advocate", "Subject of Writ", "Petitioner", "Opposite", "Case Status",
  "Date of Hearing", "Action",
];

type SavedCase = FormState & { sno: number };

const STORAGE_KEY = "bda_fresh_cases_v1";

function loadSaved(): SavedCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

/* ══════════════════════════════════════════════════════════════ */
export default function CourtEnforcementForms() {
  const { courtTypes, courts, caseTypes, advocates } = useCourtMasters();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [saved, setSaved] = useState<SavedCase[]>(loadSaved);
  const [viewTable, setViewTable] = useState(false);

  const set = (key: keyof FormState) => (v: string) =>
    setForm(f => ({ ...f, [key]: v }));

  /* ── Court Type change — cascade reset Court Name & Case Type ── */
  const setCourtType = (v: string) =>
    setForm(f => ({ ...f, courtType: v, courtName: "", caseType: "" }));

  /* ── Derived options from master data ── */
  const activeCourtTypes = useMemo(
    () => courtTypes.filter(ct => ct.status === "active"),
    [courtTypes]
  );

  const selectedCourtTypeId = useMemo(
    () => courtTypes.find(ct => ct.nameEn === form.courtType)?.id ?? 0,
    [courtTypes, form.courtType]
  );

  const filteredCourts = useMemo(
    () => courts.filter(c => c.status === "active" && (selectedCourtTypeId === 0 || c.courtTypeId === selectedCourtTypeId)),
    [courts, selectedCourtTypeId]
  );

  const filteredCaseTypes = useMemo(
    () => caseTypes.filter(ct => ct.status === "active" && (selectedCourtTypeId === 0 || ct.courtTypeId === selectedCourtTypeId)),
    [caseTypes, selectedCourtTypeId]
  );

  const activeAdvocates = useMemo(
    () => advocates.filter(a => a.status === "active"),
    [advocates]
  );

  function handleSave() {
    if (!form.caseNo || !form.year) {
      alert("Case No. और Year अनिवार्य हैं।");
      return;
    }
    const entry: SavedCase = { ...form, sno: saved.length + 1 };
    const updated = [...saved, entry];
    setSaved(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
    setForm(EMPTY);
    setViewTable(true);
    alert("Case successfully registered!");
  }

  function handleReset() {
    if (window.confirm("Form reset करें? सारा डेटा हट जाएगा।"))
      setForm(EMPTY);
  }

  function handleDelete(sno: number) {
    if (!window.confirm("इस case को delete करें?")) return;
    const updated = saved.filter(c => c.sno !== sno);
    setSaved(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
  }

  return (
    <CourtLayout title="Fresh Case Registration">
      <div className="max-w-5xl mx-auto">

        {/* Tab toggle */}
        <div className="flex gap-2 mb-4">
          <Button size="sm" variant={!viewTable ? "default" : "outline"}
            onClick={() => setViewTable(false)}
            className={!viewTable ? "bg-[#1a3a6e] text-white" : ""}>
            New Case Registration
          </Button>
          <Button size="sm" variant={viewTable ? "default" : "outline"}
            onClick={() => setViewTable(true)}
            className={viewTable ? "bg-[#1a3a6e] text-white" : ""}>
            Registered Cases ({saved.length})
          </Button>
        </div>

        {/* ══ FORM VIEW ══ */}
        {!viewTable && (
          <form onSubmit={e => { e.preventDefault(); handleSave(); }}>

            {/* ── Case Information ── */}
            <Section title="Case Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Elementary Information */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 border-b pb-1">
                    Elementary Information
                  </p>
                  <div className="space-y-3">
                    <Field label="Court Type">
                      <SSelect placeholder="Select Court Type"
                        options={activeCourtTypes.map(ct => ct.nameEn)}
                        value={form.courtType} onChange={setCourtType} />
                    </Field>
                    <Field label="Court Name">
                      <SSelect placeholder={form.courtType ? "Select Court Name" : "Select Court Type first"}
                        options={filteredCourts.map(c => c.nameEn)}
                        value={form.courtName} onChange={set("courtName")} />
                    </Field>
                    <Field label="Case Type">
                      <SSelect placeholder={form.courtType ? "Select Case Type" : "Select Court Type first"}
                        options={filteredCaseTypes.map(ct => ct.nameEn)}
                        value={form.caseType} onChange={set("caseType")} />
                    </Field>
                    <Field label="Year" required>
                      <SInput placeholder="e.g. 2024" value={form.year} onChange={set("year")} />
                    </Field>
                    <Field label="Case No." required>
                      <SInput placeholder="Case Number" value={form.caseNo} onChange={set("caseNo")} />
                    </Field>
                    <Field label="Case Related To">
                      <SSelect placeholder="Case Related To"
                        options={["Land", "Building", "Plot", "Layout", "Other"]}
                        value={form.caseRelatedTo} onChange={set("caseRelatedTo")} />
                    </Field>
                    <Field label="Subject Of Writ">
                      <SSelect placeholder="Select Subject"
                        options={[
                          "Illegal Construction", "Land Dispute", "Scheme Allotment",
                          "Service Matter", "Compounding", "Other"
                        ]}
                        value={form.subjectOfWrit} onChange={set("subjectOfWrit")} />
                    </Field>
                    <Field label="Date of Receiving Writ">
                      <SInput type="date" value={form.dateOfReceivingWrit} onChange={set("dateOfReceivingWrit")} />
                    </Field>
                  </div>
                </div>

                {/* Right: Case Information */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 border-b pb-1">
                    Case Information
                  </p>
                  <div className="space-y-3">
                    <Field label="Advocate">
                      <SSelect placeholder="Select Advocate"
                        options={activeAdvocates.map(a => a.nameEn)}
                        value={form.advocate} onChange={set("advocate")} />
                    </Field>
                    <Field label="Connected With Case No.">
                      <SInput placeholder="Connected Case No." value={form.connectedWithCaseNo} onChange={set("connectedWithCaseNo")} />
                    </Field>
                    <Field label="Notice No.">
                      <SInput placeholder="Notice Number" value={form.noticeNo} onChange={set("noticeNo")} />
                    </Field>
                    <Field label="Notice Date">
                      <SInput type="date" value={form.noticeDate} onChange={set("noticeDate")} />
                    </Field>
                  </div>
                </div>
              </div>
            </Section>

            {/* ── Petitioner Information ── */}
            <Section title="Petitioner Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 border-b pb-1">
                    Petitioner
                  </p>
                  <div className="space-y-3">
                    <Field label="No. of Petitioner">
                      <SInput placeholder="0" value={form.noOfPetitioner} onChange={set("noOfPetitioner")} />
                    </Field>
                    <Field label="Category">
                      <SSelect placeholder="Select Category"
                        options={["Individual", "Organization", "Government"]}
                        value={form.petitionerCategory} onChange={set("petitionerCategory")} />
                    </Field>
                  </div>
                </div>

                {/* Right */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 border-b pb-1">
                    Petitioner Details
                  </p>
                  <div className="space-y-3">
                    <Field label="Name">
                      <SInput placeholder="Petitioner Name" value={form.petName} onChange={set("petName")} />
                    </Field>
                    <Field label="Father Name">
                      <SInput placeholder="Father's Name" value={form.petFatherName} onChange={set("petFatherName")} />
                    </Field>
                    <Field label="Address">
                      <SInput placeholder="Address" value={form.petAddress} onChange={set("petAddress")} />
                    </Field>
                    <Field label="District">
                      <SSelect placeholder="Select District"
                        options={DISTRICTS}
                        value={form.petDistrict} onChange={set("petDistrict")} />
                    </Field>
                    <Field label="Petitioner Council">
                      <SInput placeholder="Petitioner Council" value={form.petitionerCouncil} onChange={set("petitionerCouncil")} />
                    </Field>
                    <Field label="Council No.">
                      <div className="flex gap-2">
                        <SInput placeholder="Council No." value={form.petCouncilNo} onChange={set("petCouncilNo")} />
                        <Button type="button" size="sm" className="bg-[#1a3a6e] text-white h-8 px-3">
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </Field>
                  </div>
                </div>
              </div>

              {/* Petitioner Details textarea */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 border-b pb-1">
                  Petitioner Details
                </p>
                <Textarea
                  rows={4}
                  placeholder="Additional petitioner details..."
                  value={form.petitionerDetails}
                  onChange={e => set("petitionerDetails")(e.target.value)}
                  className="text-sm border-gray-300 resize-y"
                />
              </div>
            </Section>

            {/* ── Opposite Information ── */}
            <Section title="Opposite Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 border-b pb-1">
                    Opposite
                  </p>
                  <div className="space-y-3">
                    <Field label="No. of Petitioner">
                      <SInput placeholder="0" value={form.noOfOpposite} onChange={set("noOfOpposite")} />
                    </Field>
                    <Field label="Category">
                      <SSelect placeholder="Select Category"
                        options={["Individual", "Organization", "Government"]}
                        value={form.oppositeCategory} onChange={set("oppositeCategory")} />
                    </Field>
                  </div>
                </div>

                {/* Right */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 border-b pb-1">
                    Opposite Details
                  </p>
                  <div className="space-y-3">
                    <Field label="Name">
                      <SInput placeholder="Opposite Name" value={form.oppName} onChange={set("oppName")} />
                    </Field>
                    <Field label="Father Name">
                      <SInput placeholder="Father's Name" value={form.oppFatherName} onChange={set("oppFatherName")} />
                    </Field>
                    <Field label="Address">
                      <SInput placeholder="Address" value={form.oppAddress} onChange={set("oppAddress")} />
                    </Field>
                    <Field label="District">
                      <SSelect placeholder="Select District"
                        options={DISTRICTS}
                        value={form.oppDistrict} onChange={set("oppDistrict")} />
                    </Field>
                    <Field label="Opposite Council">
                      <SInput placeholder="Opposite Council" value={form.oppositeCouncil} onChange={set("oppositeCouncil")} />
                    </Field>
                    <Field label="Council No.">
                      <div className="flex gap-2">
                        <SInput placeholder="Council No." value={form.oppCouncilNo} onChange={set("oppCouncilNo")} />
                        <Button type="button" size="sm" className="bg-[#1a3a6e] text-white h-8 px-3">
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </Field>
                  </div>
                </div>
              </div>

              {/* Opposite Details textarea */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 border-b pb-1">
                  Opposite Details
                </p>
                <Textarea
                  rows={4}
                  placeholder="Additional opposite details..."
                  value={form.oppositeDetails}
                  onChange={e => set("oppositeDetails")(e.target.value)}
                  className="text-sm border-gray-300 resize-y"
                />
              </div>
            </Section>

            {/* ── Case Progress Information ── */}
            <Section title="Case Progress Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left */}
                <div className="space-y-3">
                  <Field label="Case Status">
                    <SSelect placeholder="Select Status"
                      options={["Active", "Disposed", "Stayed", "Pending", "Decided"]}
                      value={form.caseStatus} onChange={set("caseStatus")} />
                  </Field>
                  <Field label="Court Order Date">
                    <SInput type="date" value={form.courtOrderDate} onChange={set("courtOrderDate")} />
                  </Field>
                  <Field label="Date of Hearing">
                    <SInput type="date" value={form.dateOfHearing} onChange={set("dateOfHearing")} />
                  </Field>
                  <Field label="Order Status">
                    <SSelect placeholder="Select"
                      options={["Favorable", "Unfavorable", "Partial", "Pending"]}
                      value={form.orderStatus} onChange={set("orderStatus")} />
                  </Field>
                  <Field label="Compliance Required">
                    <SSelect placeholder="select"
                      options={["Yes", "No"]}
                      value={form.complianceRequired} onChange={set("complianceRequired")} />
                  </Field>
                  <Field label="Due Compliance Data">
                    <SInput type="date" value={form.dueComplianceData} onChange={set("dueComplianceData")} />
                  </Field>
                  <Field label="Compliance Status">
                    <SInput placeholder="Compliance Status"
                      value={form.complianceStatus} onChange={set("complianceStatus")}
                      disabled={form.complianceRequired !== "Yes"} />
                  </Field>
                  <Field label="Compliance By Whom">
                    <SInput placeholder="Compliance By Whom"
                      value={form.complianceByWhom} onChange={set("complianceByWhom")}
                      disabled={form.complianceRequired !== "Yes"} />
                  </Field>
                  <Field label="Compliance Actual Date">
                    <SInput type="date"
                      value={form.complianceActualDate} onChange={set("complianceActualDate")}
                      disabled={form.complianceRequired !== "Yes"} />
                  </Field>
                  <Field label="Date of Sending Narrative To Shashan">
                    <SInput type="date" value={form.dateOfSendingNarrativeToShashan} onChange={set("dateOfSendingNarrativeToShashan")} />
                  </Field>
                  <Field label="Date of Disposal">
                    <SInput type="date" value={form.dateOfDisposal} onChange={set("dateOfDisposal")} />
                  </Field>
                </div>

                {/* Right */}
                <div className="space-y-3">
                  <Field label="Email">
                    <SInput type="email" placeholder="Email" value={form.email} onChange={set("email")} />
                  </Field>
                  <Field label="If Principal secretary in Party">
                    <SSelect placeholder="Select"
                      options={["Yes", "No"]}
                      value={form.principalSecretaryInParty} onChange={set("principalSecretaryInParty")} />
                  </Field>
                  <Field label="CA/RA Status">
                    <SSelect placeholder="Select CA/RA Status"
                      options={["CA Filed", "RA Filed", "Pending", "Not Required"]}
                      value={form.caRaStatus} onChange={set("caRaStatus")} />
                  </Field>
                  <Field label="Due Date of CA Filling">
                    <SInput type="date" value={form.dueDateOfCAFilling} onChange={set("dueDateOfCAFilling")} />
                  </Field>
                  <Field label="Date of Counter Affidavit Filling">
                    <SInput type="date" value={form.dateOfCounterAffidavitFilling} onChange={set("dateOfCounterAffidavitFilling")} />
                  </Field>
                  <Field label="Remark (Max 300 Characters)">
                    <Textarea
                      rows={4}
                      maxLength={300}
                      placeholder="Remarks..."
                      value={form.remark}
                      onChange={e => set("remark")(e.target.value)}
                      className="text-sm border-gray-300 resize-none"
                    />
                    <span className="text-xs text-gray-400 text-right">{form.remark.length}/300</span>
                  </Field>
                  <Field label="Narrative At">
                    <SInput placeholder="N/A" value={form.narrativeAt} onChange={set("narrativeAt")} />
                  </Field>
                  <Field label="Narrative Date">
                    <SInput type="date" value={form.narrativeDate} onChange={set("narrativeDate")} />
                  </Field>
                </div>
              </div>

              {/* File Uploads */}
              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide border-b pb-1">
                  Document Uploads
                </p>
                {[
                  { label: "Writ/Relevant Copy",                   dateKey: "writFileDate",       titleKey: "writFileTitle" },
                  { label: "Counter Affidavit",                    dateKey: "counterFileDate",    titleKey: "counterFileTitle" },
                  { label: "Judgement Copy",                       dateKey: "judgementFileDate",  titleKey: "judgementFileTitle" },
                  { label: "Compliance Order Supporting Documents",dateKey: "complianceFileDate", titleKey: "complianceFileTitle" },
                ].map(({ label, dateKey, titleKey }) => (
                  <div key={label} className="grid grid-cols-1 md:grid-cols-4 items-center gap-3 border-b pb-3">
                    <span className="text-xs font-medium text-gray-700 col-span-1">{label}</span>
                    <div className="flex items-center gap-2 col-span-1">
                      <input type="file" className="text-xs text-gray-600 file:mr-2 file:py-1 file:px-2
                        file:rounded file:border-0 file:text-xs file:font-medium
                        file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 w-full" />
                    </div>
                    <SInput type="date" placeholder="File Process Date"
                      value={(form as Record<string, string>)[dateKey]}
                      onChange={set(dateKey as keyof FormState)} />
                    <SInput placeholder="File Title"
                      value={(form as Record<string, string>)[titleKey]}
                      onChange={set(titleKey as keyof FormState)} />
                  </div>
                ))}
              </div>
            </Section>

            {/* ── Action Buttons ── */}
            <div className="flex justify-end gap-3 mt-2 mb-8">
              <Button type="button" variant="outline" onClick={handleReset}
                className="gap-2 border-gray-400 text-gray-700 hover:bg-gray-100">
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
              <Button type="submit"
                className="gap-2 bg-[#1a3a6e] hover:bg-[#15306b] text-white">
                <Save className="h-4 w-4" /> Save
              </Button>
            </div>
          </form>
        )}

        {/* ══ TABLE VIEW ══ */}
        {viewTable && (
          <div className="bg-white rounded border border-gray-300 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-[#1a3a6e] rounded-t">
              <h2 className="text-white font-semibold text-sm">Registered Fresh Cases</h2>
              <Button size="sm" variant="outline"
                className="bg-white text-[#1a3a6e] border-white hover:bg-gray-100 text-xs h-7"
                onClick={() => setViewTable(false)}>
                + New Case
              </Button>
            </div>

            {saved.length === 0 ? (
              <div className="text-center text-gray-400 py-16 text-sm">
                कोई case registered नहीं है। नया case add करें।
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      {TABLE_COLS.map(col => (
                        <th key={col} className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {saved.map((c, i) => (
                      <tr key={c.sno} className={`border-b hover:bg-blue-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        <td className="px-3 py-2">{c.sno}</td>
                        <td className="px-3 py-2 font-medium text-blue-800">{c.caseNo}</td>
                        <td className="px-3 py-2">{c.year}</td>
                        <td className="px-3 py-2">{c.courtType}</td>
                        <td className="px-3 py-2">{c.courtName}</td>
                        <td className="px-3 py-2">{c.caseType}</td>
                        <td className="px-3 py-2">{c.advocate}</td>
                        <td className="px-3 py-2">{c.subjectOfWrit}</td>
                        <td className="px-3 py-2">{c.petName}</td>
                        <td className="px-3 py-2">{c.oppName}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold
                            ${c.caseStatus === "Active" ? "bg-green-100 text-green-700" :
                              c.caseStatus === "Disposed" ? "bg-gray-200 text-gray-600" :
                              c.caseStatus === "Stayed" ? "bg-yellow-100 text-yellow-700" :
                              "bg-blue-100 text-blue-700"}`}>
                            {c.caseStatus || "Pending"}
                          </span>
                        </td>
                        <td className="px-3 py-2">{c.dateOfHearing}</td>
                        <td className="px-3 py-2">
                          <button onClick={() => handleDelete(c.sno)}
                            className="text-red-500 hover:text-red-700 font-medium">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </CourtLayout>
  );
}
