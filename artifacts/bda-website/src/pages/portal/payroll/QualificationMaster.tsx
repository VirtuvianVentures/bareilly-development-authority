import { PayrollSimpleMaster } from "./PayrollSimpleMaster";

export default function QualificationMaster() {
  return (
    <PayrollSimpleMaster
      apiEndpoint="qualifications"
      title="Qualification Master"
      columnLabel="Qualification Name"
      placeholder="e.g. B.Tech, MBA"
    />
  );
}
