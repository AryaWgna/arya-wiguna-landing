import { HeroSection } from "@/components/hero-section";
import { SelectedWork } from "@/components/selected-work";
import { AboutSection } from "@/components/about-section";
import { ExpertiseSection } from "@/components/expertise-section";
import { GitGraphTimeline } from "@/components/git-graph-timeline";
import { CredentialsSection } from "@/components/credentials-section";
import { ContactSection } from "@/components/contact-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SelectedWork />
      <AboutSection />
      <ExpertiseSection />
      <GitGraphTimeline />
      <CredentialsSection />
      <ContactSection />
    </>
  );
}
