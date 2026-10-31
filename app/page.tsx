import { HeroSection } from "@/components/hero-section";
import { SelectedWork } from "@/components/selected-work";
import { AboutSection } from "@/components/about-section";
import { ExpertiseSection } from "@/components/expertise-section";
import { TimelineSection } from "@/components/timeline";
import { CredentialsSection } from "@/components/credentials-section";
import { ContactSection } from "@/components/contact-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SelectedWork />
      <AboutSection />
      <ExpertiseSection />
      <TimelineSection kind="experience" />
      <TimelineSection kind="education" />
      <CredentialsSection />
      <ContactSection />
    </>
  );
}
