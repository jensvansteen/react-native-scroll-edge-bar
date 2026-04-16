import type { ExampleRoutePath } from './types';

export const exampleList: Array<{
  route: ExampleRoutePath;
  title: string;
  subtitle: string;
  symbol: string;
}> = [
  {
    route: '/app-store',
    title: 'App Store Listing',
    subtitle: 'Segmented control top bar',
    symbol: 'bag',
  },
  {
    route: '/pull-requests',
    title: 'Pull Requests',
    subtitle: 'Filter chips with large title',
    symbol: 'arrow.triangle.pull',
  },
  {
    route: '/pr-detail',
    title: 'PR Detail',
    subtitle: 'Review banner + action buttons',
    symbol: 'text.page.badge.magnifyingglass',
  },
  {
    route: '/transition-showcase',
    title: 'Transition Showcase',
    subtitle: 'Top and bottom bars over color blocks',
    symbol: 'paintpalette',
  },
  {
    route: '/toolbar',
    title: 'Toolbar',
    subtitle: 'Bottom edge bar emphasis',
    symbol: 'hammer',
  },
  {
    route: '/search-bar',
    title: 'Search Bar',
    subtitle: 'Search-like screen with segmented top bar',
    symbol: 'magnifyingglass',
  },
  {
    route: '/calendar',
    title: 'Calendar',
    subtitle: 'Week selector with stronger top bar',
    symbol: 'calendar',
  },
];

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
