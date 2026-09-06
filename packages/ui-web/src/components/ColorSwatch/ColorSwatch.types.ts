import type { VariantProps } from 'class-variance-authority';
import type { colorSwatchVariants } from './ColorSwatch';

export interface ColorSwatchProps extends VariantProps<typeof colorSwatchVariants> {
  name: string;
  hex: string;
  colorClassName: string;
  className?: string;
}
