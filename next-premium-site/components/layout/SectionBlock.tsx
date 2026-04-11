import type { PropsWithChildren } from 'react';

import { Container } from '@/components/layout/Container';
import { SectionReveal } from '@/components/ui/SectionReveal';

type SectionBlockProps = PropsWithChildren<{
  id?: string;
  className?: string;
  containerClassName?: string;
}>;

export function SectionBlock({ id, className, containerClassName, children }: SectionBlockProps) {
  return (
    <section id={id} className={['px-6 py-24 sm:px-10 lg:px-16 lg:py-28', className ?? ''].join(' ')}>
      <SectionReveal>
        <Container className={containerClassName}>{children}</Container>
      </SectionReveal>
    </section>
  );
}
