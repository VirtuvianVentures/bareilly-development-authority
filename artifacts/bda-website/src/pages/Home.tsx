import { NewsTicker } from "@/components/home/NewsTicker";
import { HeroSlider } from "@/components/home/HeroSlider";
import { QuickLinks } from "@/components/home/QuickLinks";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { LatestNews } from "@/components/home/LatestNews";
import { RulesActs } from "@/components/home/RulesActs";
import { WhatsNew } from "@/components/home/WhatsNew";
import { GallerySection } from "@/components/home/GallerySection";
import { SocialSection } from "@/components/home/SocialSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSlider />
      <NewsTicker />
      <QuickLinks />
      <WelcomeSection />
      <LatestNews />
      <RulesActs />
      <WhatsNew />
      <GallerySection />
      <SocialSection />
    </div>
  );
}
