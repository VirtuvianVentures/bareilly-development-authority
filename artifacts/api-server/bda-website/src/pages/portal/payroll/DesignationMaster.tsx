import { PayrollSimpleMaster } from "./PayrollSimpleMaster";

export default function DesignationMaster() {
  return (
    <PayrollSimpleMaster
      apiEndpoint="designations"
      title="Designation Master"
      columnLabel="Designation Name"
      placeholder="e.g. Junior Engineer"
    />
  );
}
