import { useState, useEffect } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Loader2, IndianRupee, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BudgetHead { id: number; headCode: string; headName: string; majorHead: string; fyYear: string; allocatedAmount: string; revisedAmount: string; spentAmount: string; }
interface Transaction { id: number; voucherNo: string; transactionDate: string; type: string; headCode: string; amount: string; description: string; partyName: string; status: string; }

const emptyBudget = { headCode: "", headName: "", majorHead: "", minorHead: "", fyYear: "2025-26", allocatedAmount: "0", revisedAmount: "0", spentAmount: "0" };
const emptyTxn = { voucherNo: "", transactionDate: "", type: "receipt", budgetHeadId: 0, headCode: "", amount: "", description: "", partyName: "", chequeNo: "", bankName: "", status: "pending", approvedBy: "", remarks: "" };

export default function FinanceModule() {
  const [budgets, setBudgets] = useState<BudgetHead[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingB, setLoadingB] = useState(true);
  const [loadingT, setLoadingT] = useState(true);
  const [showBForm, setShowBForm] = useState(false);
  const [showTForm, setShowTForm] = useState(false);
  const [budgetForm, setBudgetForm] = useState<any>(emptyBudget);
  const [txnForm, setTxnForm] = useState<any>(emptyTxn);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadB = async () => { setLoadingB(true); const r = await apiFetch("/finance/budget"); setBudgets(await r.json()); setLoadingB(false); };
  const loadT = async () => { setLoadingT(true); const r = await apiFetch("/finance/transactions"); setTransactions(await r.json()); setLoadingT(false); };
  useEffect(() => { loadB(); loadT(); }, []);

  const totalAllocated = budgets.reduce((s, b) => s + Number(b.allocatedAmount), 0);
  const totalSpent = budgets.reduce((s, b) => s + Number(b.spentAmount), 0);
  const totalReceipts = transactions.filter(t => t.type === "receipt").reduce((s, t) => s + Number(t.amount), 0);
  const totalPayments = transactions.filter(t => t.type === "payment").reduce((s, t) => s + Number(t.amount), 0);

  const saveBudget = async () => {
    setSaving(true);
    try { await apiFetch("/finance/budget", { method: "POST", body: JSON.stringify(budgetForm) }); toast({ title: "Budget head added" }); setShowBForm(false); loadB(); }
    catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const saveTxn = async () => {
    setSaving(true);
    try { await apiFetch("/finance/transactions", { method: "POST", body: JSON.stringify(txnForm) }); toast({ title: "Transaction recorded" }); setShowTForm(false); loadT(); }
    catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <PortalLayout title="Integrated Finance Management System" moduleId="finance">
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Budget", value: fmt(totalAllocated), icon: BarChart3, color: "bg-teal-600" },
            { label: "Spent", value: fmt(totalSpent), icon: IndianRupee, color: "bg-blue-600" },
            { label: "Total Receipts", value: fmt(totalReceipts), icon: TrendingUp, color: "bg-green-600" },
            { label: "Total Payments", value: fmt(totalPayments), icon: TrendingDown, color: "bg-red-500" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`${s.color} w-11 h-11 rounded-lg flex items-center justify-center shrink-0`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div><p className="text-lg font-bold text-gray-800">{s.value}</p><p className="text-xs text-gray-500">{s.label}</p></div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="budget">
          <TabsList>
            <TabsTrigger value="budget">Budget Heads</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="budget">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-3">
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <h3 className="font-bold text-gray-800">Budget Heads — FY 2025-26</h3>
                <Button onClick={() => { setBudgetForm(emptyBudget); setShowBForm(true); }} className="bg-teal-600 hover:bg-teal-700 gap-2 text-sm">
                  <Plus className="h-4 w-4" /> Add Budget Head
                </Button>
              </div>
              {loadingB ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div> : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>{["Head Code", "Head Name", "Major Head", "FY Year", "Allocated", "Revised", "Spent", "Balance"].map(h => <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {budgets.length === 0 && <tr><td colSpan={8} className="text-center py-10 text-gray-400">No budget heads yet.</td></tr>}
                    {budgets.map(b => {
                      const balance = Number(b.allocatedAmount) - Number(b.spentAmount);
                      return (
                        <tr key={b.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5 font-mono text-xs text-gray-700">{b.headCode}</td>
                          <td className="px-4 py-2.5 font-medium text-gray-800">{b.headName}</td>
                          <td className="px-4 py-2.5 text-xs text-gray-500">{b.majorHead}</td>
                          <td className="px-4 py-2.5 text-xs text-gray-500">{b.fyYear}</td>
                          <td className="px-4 py-2.5 text-gray-700">{fmt(Number(b.allocatedAmount))}</td>
                          <td className="px-4 py-2.5 text-gray-600">{fmt(Number(b.revisedAmount))}</td>
                          <td className="px-4 py-2.5 text-blue-700">{fmt(Number(b.spentAmount))}</td>
                          <td className={`px-4 py-2.5 font-semibold ${balance >= 0 ? "text-green-700" : "text-red-600"}`}>{fmt(balance)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>
          <TabsContent value="transactions">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-3">
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <h3 className="font-bold text-gray-800">Vouchers / Transactions</h3>
                <Button onClick={() => { setTxnForm(emptyTxn); setShowTForm(true); }} className="bg-teal-600 hover:bg-teal-700 gap-2 text-sm">
                  <Plus className="h-4 w-4" /> Add Voucher
                </Button>
              </div>
              {loadingT ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div> : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>{["Voucher No.", "Date", "Type", "Description", "Party", "Amount", "Status"].map(h => <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {transactions.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-gray-400">No transactions yet.</td></tr>}
                    {transactions.map(t => (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-mono text-xs text-gray-700">{t.voucherNo}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-500">{t.transactionDate}</td>
                        <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${t.type === "receipt" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{t.type}</span></td>
                        <td className="px-4 py-2.5 text-gray-700 max-w-[200px] truncate">{t.description}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-500">{t.partyName}</td>
                        <td className={`px-4 py-2.5 font-bold ${t.type === "receipt" ? "text-green-700" : "text-red-600"}`}>{fmt(Number(t.amount))}</td>
                        <td className="px-4 py-2.5 capitalize text-xs text-gray-500">{t.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Budget Form */}
      {showBForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b"><h3 className="font-bold">Add Budget Head</h3><Button variant="ghost" size="sm" onClick={() => setShowBForm(false)}><X className="h-4 w-4" /></Button></div>
            <div className="px-6 py-5 grid grid-cols-2 gap-4">
              {[["Head Code", "headCode"], ["Head Name", "headName"], ["Major Head", "majorHead"], ["Minor Head", "minorHead"], ["FY Year", "fyYear"], ["Allocated (₹)", "allocatedAmount"], ["Revised (₹)", "revisedAmount"], ["Spent (₹)", "spentAmount"]].map(([label, key]) => (
                <div key={key}><Label className="text-xs text-gray-600">{label}</Label><Input value={budgetForm[key] || ""} onChange={e => setBudgetForm((p: any) => ({ ...p, [key]: e.target.value }))} className="mt-1" /></div>
              ))}
            </div>
            <div className="px-6 pb-5 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowBForm(false)}>Cancel</Button>
              <Button onClick={saveBudget} disabled={saving} className="bg-teal-600 hover:bg-teal-700">{saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Add</Button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Form */}
      {showTForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b"><h3 className="font-bold">Add Voucher</h3><Button variant="ghost" size="sm" onClick={() => setShowTForm(false)}><X className="h-4 w-4" /></Button></div>
            <div className="px-6 py-5 grid grid-cols-2 gap-4">
              <div><Label className="text-xs text-gray-600">Type</Label>
                <select value={txnForm.type} onChange={e => setTxnForm((p: any) => ({ ...p, type: e.target.value }))} className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm">
                  <option value="receipt">Receipt</option><option value="payment">Payment</option>
                </select>
              </div>
              {[["Voucher No.", "voucherNo"], ["Date", "transactionDate", "date"], ["Budget Head Code", "headCode"], ["Amount (₹)", "amount", "number"], ["Party Name", "partyName"], ["Cheque No.", "chequeNo"], ["Bank Name", "bankName"], ["Approved By", "approvedBy"]].map(([label, key, type]) => (
                <div key={key}><Label className="text-xs text-gray-600">{label}</Label><Input type={type || "text"} value={txnForm[key] || ""} onChange={e => setTxnForm((p: any) => ({ ...p, [key]: e.target.value }))} className="mt-1" /></div>
              ))}
              <div className="col-span-2"><Label className="text-xs text-gray-600">Description</Label><Input value={txnForm.description || ""} onChange={e => setTxnForm((p: any) => ({ ...p, description: e.target.value }))} className="mt-1" /></div>
            </div>
            <div className="px-6 pb-5 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowTForm(false)}>Cancel</Button>
              <Button onClick={saveTxn} disabled={saving} className="bg-teal-600 hover:bg-teal-700">{saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Record</Button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
