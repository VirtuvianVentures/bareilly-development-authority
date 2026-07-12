import { CourtMasterLayout } from "./CourtMasterLayout";
import { Link2 } from "lucide-react";

export default function CourtCaseRelatedMaster() {
  return (
    <CourtMasterLayout
      title="Case Related to Master"
      moduleId="court-master-case-related"
      icon={Link2}
      description="Manage the subject/topic categories that cases can be related to."
      extraFields={[
        { label: "Description", labelHi: "विवरण", key: "description", span: true },
      ]}
    />
  );
}
