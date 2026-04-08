import type { ExampleRouteName } from './types';

export const exampleList: Array<{
  route: ExampleRouteName;
  title: string;
  subtitle: string;
  symbol: string;
}> = [
  {
    route: 'AppStore',
    title: 'App Store Listing',
    subtitle: 'Segmented control top bar',
    symbol: 'bag',
  },
  {
    route: 'PullRequests',
    title: 'Pull Requests',
    subtitle: 'Filter chips with large title',
    symbol: 'arrow.triangle.pull',
  },
  {
    route: 'PrDetail',
    title: 'PR Detail',
    subtitle: 'Review banner + action buttons',
    symbol: 'text.page.badge.magnifyingglass',
  },
  {
    route: 'TransitionShowcase',
    title: 'Transition Showcase',
    subtitle: 'Top and bottom bars over color blocks',
    symbol: 'paintpalette',
  },
  {
    route: 'Toolbar',
    title: 'Toolbar',
    subtitle: 'Bottom edge bar emphasis',
    symbol: 'hammer',
  },
  {
    route: 'SearchBar',
    title: 'Search Bar',
    subtitle: 'Search-like screen with segmented top bar',
    symbol: 'magnifyingglass',
  },
  {
    route: 'TabAccessory',
    title: 'Tab Accessory',
    subtitle: 'Large bottom accessory-style bar',
    symbol: 'music.note.list',
  },
  {
    route: 'Calendar',
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
