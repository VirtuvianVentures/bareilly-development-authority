import { PayrollSimpleMaster } from "./PayrollSimpleMaster";
export default function PayBillGroupMaster() {
  return <PayrollSimpleMaster apiEndpoint="paybill-groups" title="PayBill Group Master" columnLabel="PayBill Group Name" placeholder="e.g. 01 - Regular" />;
}
