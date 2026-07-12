import { CourtMasterLayout } from "./CourtMasterLayout";
import { ListTree } from "lucide-react";

export default function CourtSubCategoryMaster() {
  return (
    <CourtMasterLayout
      title="Sub Category Master"
      moduleId="court-master-subcategory"
      icon={ListTree}
      description="Manage sub-categories under Petitioner / Opposition categories."
      extraFields={[
        { label: "Parent Category", labelHi: "मूल श्रेणी", key: "parentCategory" },
      ]}
    />
  );
}
