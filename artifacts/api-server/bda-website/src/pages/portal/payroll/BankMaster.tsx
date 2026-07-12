import { PayrollSimpleMaster } from "./PayrollSimpleMaster";

export default function BankMaster() {
  return (
    <PayrollSimpleMaster
      apiEndpoint="banks"
      title="Bank Master"
      columnLabel="Bank Name"
      placeholder="e.g. State Bank of India"
    />
  );
}
