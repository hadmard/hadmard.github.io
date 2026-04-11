import { SiteHeader } from '@/components/layout/SiteHeader';
import {
  AboutSection,
  HeroSection,
  MethodologySection,
  ProjectShowcaseSection,
  ProjectsSection,
  ThinkingSection,
  VersionHistorySection,
} from '@/components/sections';

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <HeroSection />
      <ProjectShowcaseSection />
      <ProjectsSection />
      <ThinkingSection />
      <MethodologySection />
      <VersionHistorySection />
      <AboutSection />
    </main>
  );
}
