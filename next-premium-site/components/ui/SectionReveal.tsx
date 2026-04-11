'use client';

import { useEffect, useRef, useState } from 'react';

type SectionRevealProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionReveal({ children, className }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[
        'will-change-transform transition-opacity transition-transform duration-700',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  );
}
