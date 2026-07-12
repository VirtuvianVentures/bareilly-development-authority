import { PayrollSimpleMaster } from "./PayrollSimpleMaster";

export default function BranchMaster() {
  return (
    <PayrollSimpleMaster
      apiEndpoint="branches"
      title="Branch Master"
      columnLabel="Branch Name"
      placeholder="e.g. Engineering Branch"
    />
  );
}
