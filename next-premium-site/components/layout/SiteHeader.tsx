import { navItems } from '@/config/site';
import { Container } from '@/components/layout/Container';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95">
      <Container className="flex items-center justify-between py-4">
        <a href="#top" className="research-kicker text-[#c6cedd]">
          Yfcccc
        </a>
        <nav className="hidden items-center gap-6 sm:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition-colors duration-200 hover:text-[#d9e2f5]"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </Container>
    </header>
  );
}
