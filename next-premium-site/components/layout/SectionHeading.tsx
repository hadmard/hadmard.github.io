type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeading({ title, subtitle, className }: SectionHeadingProps) {
  return (
    <div className={className}>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-5 max-w-2xl text-sm leading-7 text-muted sm:text-base">{subtitle}</p> : null}
    </div>
  );
}
