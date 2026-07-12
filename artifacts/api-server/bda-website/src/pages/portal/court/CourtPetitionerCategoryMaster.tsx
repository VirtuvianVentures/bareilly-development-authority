import { CourtMasterLayout } from "./CourtMasterLayout";
import { UsersRound } from "lucide-react";

export default function CourtPetitionerCategoryMaster() {
  return (
    <CourtMasterLayout
      title="Petitioner / Opposition Category Master"
      moduleId="court-master-petitioner"
      icon={UsersRound}
      description="Define petitioner and opposition party categories for court cases."
      extraFields={[
        {
          label: "Party Type",
          labelHi: "पक्षकार प्रकार",
          key: "partyType",
          type: "select",
          options: ["Petitioner", "Opposition", "Both"],
        },
      ]}
    />
  );
}
