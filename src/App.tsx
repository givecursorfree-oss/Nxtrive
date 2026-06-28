import { AnnouncementBanner } from "@/components/marketing/AnnouncementBanner";
import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import HeroScrollDemo from "@/components/container-scroll-animation-demo";
import { Stats } from "@/components/marketing/Stats";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Features } from "@/components/marketing/Features";
import { WhoItsFor } from "@/components/marketing/WhoItsFor";
import { SystemRequirements } from "@/components/marketing/SystemRequirements";
import { DownloadSection } from "@/components/marketing/Download";
import { SupportedFormats } from "@/components/marketing/SupportedFormats";
import { FaqSection } from "@/components/marketing/Faq";
import { Footer } from "@/components/marketing/Footer";

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-button focus:bg-deep-indigo focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <AnnouncementBanner />
      <Navbar />
      <main id="main">
        <Hero />
        <HeroScrollDemo />
        <Stats />
        <HowItWorks />
        <Features />
        <SupportedFormats />
        <WhoItsFor />
        <SystemRequirements />
        <DownloadSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
