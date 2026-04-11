import { SiteHeader } from '@/components/layout/SiteHeader';
import {
  AboutSection,
  HeroSection,
  MethodologySection,
  ProjectShowcaseSection,
  VersionHistorySection,
} from '@/components/sections';

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <HeroSection />
      <ProjectShowcaseSection />
      <MethodologySection />
      <VersionHistorySection />
      <AboutSection />
    </main>
  );
}
