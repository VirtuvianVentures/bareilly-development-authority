import { Header } from "./Header";
import { Footer } from "./Footer";
import { MinistrySlider } from "./MinistrySlider";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-gray-50">
      <Header />
      <main id="main-content" className="flex-grow w-full focus:outline-none" tabIndex={-1}>
        {children}
      </main>
      <MinistrySlider />
      <Footer />
    </div>
  );
}
