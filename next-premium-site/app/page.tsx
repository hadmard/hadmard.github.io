import { AboutSection } from '@/components/sections/AboutSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { MethodologySection } from '@/components/sections/MethodologySection';
import { ProjectShowcaseSection } from '@/components/sections/ProjectShowcaseSection';
import { VersionHistorySection } from '@/components/sections/VersionHistorySection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ProjectShowcaseSection />
      <MethodologySection />
      <VersionHistorySection />
      <AboutSection />
    </main>
  );
}
