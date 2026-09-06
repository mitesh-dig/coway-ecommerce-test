// Static swatch metadata for the /design-system verification page. Class names are
// literal Tailwind utility strings (not interpolated) so Tailwind's content scanner
// picks them up — see apps/web/tailwind.config.ts for the figma-* color families
// these classes resolve to, sourced from @app/core/tokens (colors.figma).
export interface TokenSwatchEntry {
  name: string;
  hex: string;
  colorClassName: string;
}

export interface TokenGroup {
  title: string;
  entries: TokenSwatchEntry[];
}

export const primitiveGroups: TokenGroup[] = [
  {
    title: 'Brand',
    entries: [
      { name: 'Brand 100', hex: '#e8f7fc', colorClassName: 'bg-figma-brand-100' },
      { name: 'Brand 200', hex: '#bbe7f7', colorClassName: 'bg-figma-brand-200' },
      { name: 'Brand 300', hex: '#68caee', colorClassName: 'bg-figma-brand-300' },
      { name: 'Brand 400', hex: '#36b9e8', colorClassName: 'bg-figma-brand-400' },
      { name: 'Brand 500', hex: '#04a7e2', colorClassName: 'bg-figma-brand-500' },
      { name: 'Brand 600', hex: '#0497cc', colorClassName: 'bg-figma-brand-600' },
      { name: 'Brand 700', hex: '#047ba6', colorClassName: 'bg-figma-brand-700' },
      { name: 'Brand 800', hex: '#02435a', colorClassName: 'bg-figma-brand-800' },
      { name: 'Brand 900', hex: '#01212d', colorClassName: 'bg-figma-brand-900' },
    ],
  },
  {
    title: 'Secondary',
    entries: [
      { name: 'Secondary 100', hex: '#ccd8e1', colorClassName: 'bg-figma-secondary-100' },
      { name: 'Secondary 200', hex: '#99b1c3', colorClassName: 'bg-figma-secondary-200' },
      { name: 'Secondary 300', hex: '#668ba5', colorClassName: 'bg-figma-secondary-300' },
      { name: 'Secondary 400', hex: '#336487', colorClassName: 'bg-figma-secondary-400' },
      { name: 'Secondary 500', hex: '#003d69', colorClassName: 'bg-figma-secondary-500' },
      { name: 'Secondary 600', hex: '#003154', colorClassName: 'bg-figma-secondary-600' },
      { name: 'Secondary 700', hex: '#00253f', colorClassName: 'bg-figma-secondary-700' },
      { name: 'Secondary 800', hex: '#00182a', colorClassName: 'bg-figma-secondary-800' },
      { name: 'Secondary 900', hex: '#000c15', colorClassName: 'bg-figma-secondary-900' },
    ],
  },
  {
    title: 'Neutral',
    entries: [
      { name: 'Neutral 100', hex: '#f9fafa', colorClassName: 'bg-figma-neutral-100' },
      { name: 'Neutral 200', hex: '#d3d9db', colorClassName: 'bg-figma-neutral-200' },
      { name: 'Neutral 300', hex: '#bcc6ca', colorClassName: 'bg-figma-neutral-300' },
      { name: 'Neutral 400', hex: '#a6b3b8', colorClassName: 'bg-figma-neutral-400' },
      { name: 'Neutral 500', hex: '#90a0a6', colorClassName: 'bg-figma-neutral-500' },
      { name: 'Neutral 600', hex: '#738085', colorClassName: 'bg-figma-neutral-600' },
      { name: 'Neutral 700', hex: '#566064', colorClassName: 'bg-figma-neutral-700' },
      { name: 'Neutral 800', hex: '#3a4042', colorClassName: 'bg-figma-neutral-800' },
      { name: 'Neutral 900', hex: '#1d2021', colorClassName: 'bg-figma-neutral-900' },
    ],
  },
  {
    title: 'Green',
    entries: [
      { name: 'Green 100', hex: '#d4f1e5', colorClassName: 'bg-figma-green-100' },
      { name: 'Green 200', hex: '#aae4cc', colorClassName: 'bg-figma-green-200' },
      { name: 'Green 300', hex: '#7fd6b2', colorClassName: 'bg-figma-green-300' },
      { name: 'Green 400', hex: '#55c999', colorClassName: 'bg-figma-green-400' },
      { name: 'Green 500', hex: '#2abb7f', colorClassName: 'bg-figma-green-500' },
      { name: 'Green 600', hex: '#229666', colorClassName: 'bg-figma-green-600' },
      { name: 'Green 700', hex: '#19704c', colorClassName: 'bg-figma-green-700' },
      { name: 'Green 800', hex: '#114b33', colorClassName: 'bg-figma-green-800' },
      { name: 'Green 900', hex: '#082519', colorClassName: 'bg-figma-green-900' },
    ],
  },
  {
    title: 'Red',
    entries: [
      { name: 'Red 100', hex: '#fcdedc', colorClassName: 'bg-figma-red-100' },
      { name: 'Red 200', hex: '#f9bdb9', colorClassName: 'bg-figma-red-200' },
      { name: 'Red 300', hex: '#f79d96', colorClassName: 'bg-figma-red-300' },
      { name: 'Red 400', hex: '#f47c73', colorClassName: 'bg-figma-red-400' },
      { name: 'Red 500', hex: '#f15b50', colorClassName: 'bg-figma-red-500' },
      { name: 'Red 600', hex: '#c14940', colorClassName: 'bg-figma-red-600' },
      { name: 'Red 700', hex: '#913730', colorClassName: 'bg-figma-red-700' },
      { name: 'Red 800', hex: '#602420', colorClassName: 'bg-figma-red-800' },
      { name: 'Red 900', hex: '#301210', colorClassName: 'bg-figma-red-900' },
    ],
  },
  {
    title: 'Yellow',
    entries: [
      { name: 'Yellow 100', hex: '#fcf6d5', colorClassName: 'bg-figma-yellow-100' },
      { name: 'Yellow 200', hex: '#f8edaa', colorClassName: 'bg-figma-yellow-200' },
      { name: 'Yellow 300', hex: '#f5e380', colorClassName: 'bg-figma-yellow-300' },
      { name: 'Yellow 400', hex: '#f1da55', colorClassName: 'bg-figma-yellow-400' },
      { name: 'Yellow 500', hex: '#eed12b', colorClassName: 'bg-figma-yellow-500' },
      { name: 'Yellow 600', hex: '#bea722', colorClassName: 'bg-figma-yellow-600' },
      { name: 'Yellow 700', hex: '#8f7d1a', colorClassName: 'bg-figma-yellow-700' },
      { name: 'Yellow 800', hex: '#5f5411', colorClassName: 'bg-figma-yellow-800' },
      { name: 'Yellow 900', hex: '#302a09', colorClassName: 'bg-figma-yellow-900' },
    ],
  },
  {
    title: 'White (opacity)',
    entries: [
      { name: 'White 10%', hex: '#ffffff1a', colorClassName: 'bg-figma-white-10' },
      { name: 'White 20%', hex: '#ffffff33', colorClassName: 'bg-figma-white-20' },
      { name: 'White 30%', hex: '#ffffff4d', colorClassName: 'bg-figma-white-30' },
      { name: 'White 40%', hex: '#ffffff66', colorClassName: 'bg-figma-white-40' },
      { name: 'White 50%', hex: '#ffffff80', colorClassName: 'bg-figma-white-50' },
      { name: 'White 60%', hex: '#ffffff99', colorClassName: 'bg-figma-white-60' },
      { name: 'White 70%', hex: '#ffffffb2', colorClassName: 'bg-figma-white-70' },
      { name: 'White 80%', hex: '#ffffffcc', colorClassName: 'bg-figma-white-80' },
      { name: 'White 90%', hex: '#ffffffe5', colorClassName: 'bg-figma-white-90' },
      { name: 'White 100%', hex: '#ffffff', colorClassName: 'bg-figma-white-100' },
    ],
  },
  {
    title: 'Black (opacity)',
    entries: [
      { name: 'Black 10%', hex: '#0000001a', colorClassName: 'bg-figma-black-10' },
      { name: 'Black 20%', hex: '#00000033', colorClassName: 'bg-figma-black-20' },
      { name: 'Black 30%', hex: '#0000004d', colorClassName: 'bg-figma-black-30' },
      { name: 'Black 40%', hex: '#00000066', colorClassName: 'bg-figma-black-40' },
      { name: 'Black 50%', hex: '#00000080', colorClassName: 'bg-figma-black-50' },
      { name: 'Black 60%', hex: '#00000099', colorClassName: 'bg-figma-black-60' },
      { name: 'Black 70%', hex: '#000000b2', colorClassName: 'bg-figma-black-70' },
      { name: 'Black 80%', hex: '#000000cc', colorClassName: 'bg-figma-black-80' },
      { name: 'Black 90%', hex: '#000000e5', colorClassName: 'bg-figma-black-90' },
      { name: 'Black 100%', hex: '#000000', colorClassName: 'bg-figma-black-100' },
    ],
  },
];

export const semanticGroups: TokenGroup[] = [
  {
    title: 'Content',
    entries: [
      { name: 'Primary → Neutral 800', hex: '#3a4042', colorClassName: 'bg-figma-content-primary' },
      { name: 'Secondary → Neutral 700', hex: '#566064', colorClassName: 'bg-figma-content-secondary' },
      { name: 'Tertiary → Secondary 500', hex: '#003d69', colorClassName: 'bg-figma-content-tertiary' },
      { name: 'Primary Inverse → White 100%', hex: '#ffffff', colorClassName: 'bg-figma-content-primaryInverse' },
      { name: 'Secondary Inverse → Neutral 300', hex: '#bcc6ca', colorClassName: 'bg-figma-content-secondaryInverse' },
      { name: 'Brand → Brand 500', hex: '#04a7e2', colorClassName: 'bg-figma-content-brand' },
      { name: 'Positive → Green 800', hex: '#114b33', colorClassName: 'bg-figma-content-positive' },
      { name: 'Negative → Red 700', hex: '#913730', colorClassName: 'bg-figma-content-negative' },
      { name: 'Disabled → Neutral 500', hex: '#90a0a6', colorClassName: 'bg-figma-content-disabled' },
    ],
  },
  {
    title: 'Background',
    entries: [
      { name: 'Primary → White 100%', hex: '#ffffff', colorClassName: 'bg-figma-background-primary' },
      { name: 'Secondary → Brand 100', hex: '#e8f7fc', colorClassName: 'bg-figma-background-secondary' },
      { name: 'Tertiary → Secondary 500', hex: '#003d69', colorClassName: 'bg-figma-background-tertiary' },
      { name: 'Brand → Brand 500', hex: '#04a7e2', colorClassName: 'bg-figma-background-brand' },
      { name: 'Disabled → Neutral 200', hex: '#d3d9db', colorClassName: 'bg-figma-background-disabled' },
      { name: 'Positive → Green 200', hex: '#aae4cc', colorClassName: 'bg-figma-background-positive' },
      { name: 'Negative → Red 200', hex: '#f9bdb9', colorClassName: 'bg-figma-background-negative' },
    ],
  },
  {
    title: 'Border',
    entries: [
      { name: 'Primary → Secondary 100', hex: '#ccd8e1', colorClassName: 'bg-figma-border-primary' },
      { name: 'Secondary → Secondary 200', hex: '#99b1c3', colorClassName: 'bg-figma-border-secondary' },
      { name: 'Brand → Brand 500', hex: '#04a7e2', colorClassName: 'bg-figma-border-brand' },
      { name: 'Inverse → White 100%', hex: '#ffffff', colorClassName: 'bg-figma-border-inverse' },
      { name: 'Positive → Green 800', hex: '#114b33', colorClassName: 'bg-figma-border-positive' },
    ],
  },
  {
    title: 'Button',
    entries: [
      { name: 'Brand Active → Brand 500', hex: '#04a7e2', colorClassName: 'bg-figma-button-brand-active' },
      { name: 'Brand Hover → Brand 600', hex: '#0497cc', colorClassName: 'bg-figma-button-brand-hover' },
      { name: 'Brand Focused → Brand 500', hex: '#04a7e2', colorClassName: 'bg-figma-button-brand-focused' },
      { name: 'Brand Pressed → Brand 700', hex: '#047ba6', colorClassName: 'bg-figma-button-brand-pressed' },
      { name: 'Secondary Active → Secondary 500', hex: '#003d69', colorClassName: 'bg-figma-button-secondary-active' },
      { name: 'Secondary Hover → Secondary 600', hex: '#003154', colorClassName: 'bg-figma-button-secondary-hover' },
      { name: 'Secondary Focused → Secondary 500', hex: '#003d69', colorClassName: 'bg-figma-button-secondary-focused' },
      { name: 'Secondary Pressed → Secondary 700', hex: '#00253f', colorClassName: 'bg-figma-button-secondary-pressed' },
      { name: 'Inverse Active → White 100%', hex: '#ffffff', colorClassName: 'bg-figma-button-inverse-active' },
      { name: 'Inverse Hover → Neutral 100', hex: '#f9fafa', colorClassName: 'bg-figma-button-inverse-hover' },
      { name: 'Inverse Focused → White 100%', hex: '#ffffff', colorClassName: 'bg-figma-button-inverse-focused' },
      { name: 'Inverse Pressed → Neutral 200', hex: '#d3d9db', colorClassName: 'bg-figma-button-inverse-pressed' },
      { name: 'Disabled → Neutral 200', hex: '#d3d9db', colorClassName: 'bg-figma-button-disabled' },
    ],
  },
];
