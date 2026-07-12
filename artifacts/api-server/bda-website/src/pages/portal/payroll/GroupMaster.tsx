import { PayrollSimpleMaster } from "./PayrollSimpleMaster";

export default function GroupMaster() {
  return (
    <PayrollSimpleMaster
      apiEndpoint="groups"
      title="Group Master"
      columnLabel="Group Name"
      placeholder="e.g. A, A+, DW-B"
    />
  );
}
