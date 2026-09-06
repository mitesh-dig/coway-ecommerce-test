// figma: https://www.figma.com/design/4dDPkRmyanC2TxFEj8cKnr/COWAY-Website?node-id=11152-18487&m=dev
'use client';

// ─── External imports ─────────────────────────────
import { cva } from 'class-variance-authority';

// ─── Internal imports ─────────────────────────────
import { cn } from '../../lib/utils';
import type { ColorSwatchProps } from './ColorSwatch.types';

const colorSwatchVariants = cva('rounded-md border border-figma-neutral-200', {
  variants: {
    size: {
      sm: 'h-10 w-10',
      md: 'h-14 w-14',
      lg: 'h-20 w-20',
    },
  },
  defaultVariants: { size: 'md' },
});

export function ColorSwatch({ name, hex, colorClassName, size, className }: Readonly<ColorSwatchProps>) {
  return (
    <figure className={cn('flex flex-col items-start gap-2', className)}>
      <div className={cn(colorSwatchVariants({ size }), colorClassName)} aria-hidden="true" />
      <figcaption className="flex flex-col">
        <span className="text-sm font-medium text-text-primary">{name}</span>
        <span className="text-sm text-text-muted uppercase">{hex}</span>
      </figcaption>
    </figure>
  );
}

ColorSwatch.displayName = 'ColorSwatch';

export { colorSwatchVariants };
