import type { PropsWithChildren } from 'react';

type ContainerProps = PropsWithChildren<{
  className?: string;
}>;

export function Container({ className, children }: ContainerProps) {
  return <div className={['mx-auto w-full max-w-5xl', className ?? ''].join(' ')}>{children}</div>;
}
