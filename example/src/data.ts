import type { ExampleKey } from './types';

export const exampleList: Array<{
  key: ExampleKey;
  title: string;
  subtitle: string;
  symbol: string;
  tint: string;
}> = [
  {
    key: 'appStore',
    title: 'App Store Listing',
    subtitle: 'Segmented control top bar',
    symbol: 'bag',
    tint: '#2563eb',
  },
  {
    key: 'pullRequests',
    title: 'Pull Requests',
    subtitle: 'Filter chips with large title',
    symbol: 'arrow.triangle.pull',
    tint: '#16a34a',
  },
  {
    key: 'prDetail',
    title: 'PR Detail',
    subtitle: 'Review banner + action buttons',
    symbol: 'text.page.badge.magnifyingglass',
    tint: '#7c3aed',
  },
  {
    key: 'transitionShowcase',
    title: 'Transition Showcase',
    subtitle: 'Top and bottom bars over color blocks',
    symbol: 'paintpalette',
    tint: '#db2777',
  },
  {
    key: 'toolbar',
    title: 'Toolbar',
    subtitle: 'Bottom edge bar emphasis',
    symbol: 'hammer',
    tint: '#d97706',
  },
  {
    key: 'searchBar',
    title: 'Search Bar',
    subtitle: 'Search-like screen with segmented top bar',
    symbol: 'magnifyingglass',
    tint: '#0891b2',
  },
  {
    key: 'tabAccessory',
    title: 'Tab Accessory',
    subtitle: 'Large bottom accessory-style bar',
    symbol: 'music.note.list',
    tint: '#ea580c',
  },
  {
    key: 'calendar',
    title: 'Calendar',
    subtitle: 'Week selector with stronger top bar',
    symbol: 'calendar',
    tint: '#dc2626',
  },
];

export const titleByKey: Record<ExampleKey, string> = Object.fromEntries(
  exampleList.map((item) => [item.key, item.title])
) as Record<ExampleKey, string>;

export const appColors = [
  '#4fd1c5',
  '#68d391',
  '#63b3ed',
  '#f6ad55',
  '#fc8181',
  '#b794f4',
];

export const transitionColors = [
  { name: 'Midnight', value: '#1f1f2e' },
  { name: 'Ivory', value: '#f5f0e7' },
  { name: 'Navy', value: '#1b2d47' },
  { name: 'Cream', value: '#f4ecdc' },
  { name: 'Plum', value: '#2f1f3d' },
  { name: 'Mist', value: '#eef2f1' },
];
