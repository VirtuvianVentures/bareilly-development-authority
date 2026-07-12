import { AboutPageLayout } from "./AboutPageLayout";
import { WelcomeSection } from "@/components/home/WelcomeSection";

export default function Objectives() {
  return (
    <AboutPageLayout title="Objectives" titleHi="उद्देश्य">
      {/* Remove default padding — WelcomeSection has its own layout */}
      <div className="-m-6">
        <WelcomeSection />
      </div>
    </AboutPageLayout>
  );
}
