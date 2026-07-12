export interface PrintGrievance {
  ticketNo: string;
  applicantName: string;
  mobile: string;
  email?: string | null;
  address?: string | null;
  subject?: string | null;
  category?: string | null;
  description?: string | null;
  status?: string | null;
  assignedTo?: string | null;
  assignedDepartment?: string | null;
  resolution?: string | null;
  createdAt: string;
}

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted", acknowledged: "Acknowledged", in_progress: "In Progress",
  resolved: "Resolved", closed: "Closed", rejected: "Rejected",
};
const CATEGORY_LABEL: Record<string, string> = {
  property: "Property", maintenance: "Maintenance", allotment: "Allotment",
  construction: "Construction", water_sewage: "Water/Sewage", road: "Road",
  park: "Park", corruption: "Corruption", service_delay: "Service Delay", other: "Other",
};

export function printComplaint(g: PrintGrievance) {
  const dateStr = new Date(g.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const printDate = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const statusLabel = STATUS_LABEL[g.status ?? ""] || g.status || "Submitted";
  const categoryLabel = CATEGORY_LABEL[g.category ?? ""] || g.category || "—";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Complaint Receipt — ${g.ticketNo}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,sans-serif;font-size:13px;color:#111;background:#fff;padding:20px}
.page{max-width:700px;margin:auto;border:2px solid #1a3a6e}
.header{background:#1a3a6e;color:#fff;padding:16px 24px;display:flex;align-items:center;gap:16px}
.header-seal{width:70px;height:70px;border-radius:50%;background:rgba(255,255,255,0.15);border:2px solid rgba(255,255,255,0.4);display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0}
.header-text h1{font-size:17px;font-weight:bold;letter-spacing:.5px}
.header-text p{font-size:11px;opacity:.82;margin-top:2px}
.orange-bar{background:#f97316;color:#fff;text-align:center;padding:8px;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase}
.ticket-bar{background:#f0f4fb;border-bottom:1px solid #d0daea;padding:10px 24px;display:flex;justify-content:space-between;align-items:center}
.ticket-no{font-family:monospace;font-size:22px;font-weight:bold;color:#1a3a6e}
.ticket-meta{text-align:right;font-size:11px;color:#555;line-height:1.8}
.status-badge{display:inline-block;padding:2px 12px;border-radius:20px;font-size:11px;font-weight:bold;background:#dcfce7;color:#166534;border:1px solid #bbf7d0}
.section{padding:12px 24px;border-bottom:1px solid #e5e7eb}
.section-title{font-size:10px;font-weight:bold;color:#1a3a6e;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;border-left:3px solid #f97316;padding-left:6px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.field-label{font-size:10px;color:#888;text-transform:uppercase;font-weight:bold}
.field-value{font-size:13px;color:#111;margin-top:1px}
.full{grid-column:1/-1}
.desc-box{background:#f9fafb;border:1px solid #e5e7eb;border-radius:4px;padding:10px;font-size:12px;line-height:1.7;color:#333;margin-top:6px;white-space:pre-wrap;word-break:break-word}
.res-box{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:4px;padding:10px;font-size:12px;line-height:1.7;color:#166534;margin-top:6px}
.sig-row{display:flex;justify-content:space-between;align-items:flex-end;padding:16px 24px}
.sig-box{text-align:center;font-size:11px;color:#555}
.sig-line{margin-top:44px;border-top:1px solid #333;padding-top:4px;width:150px}
.seal-circle{width:80px;height:80px;border:1px dashed #bbb;border-radius:50%;margin:0 auto;display:flex;align-items:center;justify-content:center;font-size:10px;color:#aaa;text-align:center;line-height:1.4}
.footer{padding:10px 24px 14px;background:#f9fafb}
.note{font-size:10px;color:#666;text-align:center;border-top:1px dashed #d1d5db;padding-top:10px;line-height:1.8}
@media print{body{padding:0}}
</style>
</head>
<body>
<div class="page">

<div class="header">
  <div class="header-seal">🏛️</div>
  <div class="header-text">
    <h1>BAREILLY DEVELOPMENT AUTHORITY</h1>
    <p>Government of Uttar Pradesh, India</p>
    <p>Phone: 0581-2510081 &nbsp;|&nbsp; Website: www.bdabareilly.com</p>
    <p>Civil Lines, Bareilly — 243001 (U.P.)</p>
  </div>
</div>

<div class="orange-bar">Complaint Acknowledgment Receipt</div>

<div class="ticket-bar">
  <div>
    <div style="font-size:10px;color:#888;margin-bottom:3px;">COMPLAINT TICKET NUMBER</div>
    <div class="ticket-no">${g.ticketNo}</div>
  </div>
  <div class="ticket-meta">
    <div>Date of Complaint: <strong>${dateStr}</strong></div>
    <div>Date of Print: <strong>${printDate}</strong></div>
    <div style="margin-top:5px;"><span class="status-badge">${statusLabel}</span></div>
  </div>
</div>

<div class="section">
  <div class="section-title">Complainant Details</div>
  <div class="grid">
    <div><div class="field-label">Full Name</div><div class="field-value">${g.applicantName}</div></div>
    <div><div class="field-label">Mobile Number</div><div class="field-value">${g.mobile}</div></div>
    <div><div class="field-label">Email Address</div><div class="field-value">${g.email || "—"}</div></div>
    <div><div class="field-label">Address</div><div class="field-value">${g.address || "—"}</div></div>
  </div>
</div>

<div class="section">
  <div class="section-title">Complaint Details</div>
  <div class="grid">
    <div><div class="field-label">Subject</div><div class="field-value">${g.subject || "—"}</div></div>
    <div><div class="field-label">Category</div><div class="field-value">${categoryLabel}</div></div>
    <div class="full">
      <div class="field-label">Description of Complaint</div>
      <div class="desc-box">${g.description || "—"}</div>
    </div>
  </div>
</div>

<div class="section">
  <div class="section-title">Assignment &amp; Resolution</div>
  <div class="grid">
    <div><div class="field-label">Assigned Officer</div><div class="field-value">${g.assignedTo || "Pending Assignment"}</div></div>
    <div><div class="field-label">Department</div><div class="field-value">${g.assignedDepartment || "Pending"}</div></div>
    ${g.resolution ? `<div class="full"><div class="field-label">Resolution / Action Taken</div><div class="res-box">${g.resolution}</div></div>` : ""}
  </div>
</div>

<div class="sig-row">
  <div class="sig-box"><div class="sig-line">Complainant&apos;s Signature</div></div>
  <div class="sig-box"><div class="seal-circle">OFFICE<br/>SEAL</div></div>
  <div class="sig-box"><div class="sig-line">Receiving Officer&apos;s Signature</div></div>
</div>

<div class="footer">
  <div class="note">
    ⚠ Please preserve this receipt for future reference. Quote your Ticket Number in all correspondence with BDA.<br/>
    This complaint will be addressed within <strong>30 working days</strong> from the date of submission.<br/>
    For queries, contact BDA office at <strong>0581-2510081</strong> or visit <strong>www.bdabareilly.com</strong>
  </div>
</div>

</div>
<script>window.onload=function(){window.print();}</script>
</body>
</html>`;

  const w = window.open("", "_blank", "width=780,height=950,scrollbars=yes");
  if (w) { w.document.write(html); w.document.close(); }
}
