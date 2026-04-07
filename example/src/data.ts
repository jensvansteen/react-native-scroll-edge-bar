import type { ExampleKey, ExampleNavigationConfig } from './types';

export const exampleList: Array<{
  key: ExampleKey;
  title: string;
  subtitle: string;
  symbol: string;
  navigation?: ExampleNavigationConfig;
}> = [
  {
    key: 'appStore',
    title: 'App Store Listing',
    subtitle: 'Segmented control top bar',
    symbol: 'bag',
    navigation: {
      title: 'App Store Listing',
      headerTransparent: true,
      headerLargeTitleEnabled: false,
      headerShadowVisible: false,
      headerBackButtonDisplayMode: 'minimal',
    },
  },
  {
    key: 'pullRequests',
    title: 'Pull Requests',
    subtitle: 'Filter chips with large title',
    symbol: 'arrow.triangle.pull',
    navigation: {
      title: 'Pull Requests',
      headerTransparent: true,
      headerLargeTitleEnabled: true,
      headerShadowVisible: false,
      headerBackButtonDisplayMode: 'minimal',
    },
  },
  {
    key: 'prDetail',
    title: 'PR Detail',
    subtitle: 'Review banner + action buttons',
    symbol: 'text.page.badge.magnifyingglass',
    navigation: {
      title: 'PR Detail',
      headerTransparent: true,
      headerLargeTitleEnabled: true,
      headerShadowVisible: false,
      headerBackButtonDisplayMode: 'minimal',
    },
  },
  {
    key: 'transitionShowcase',
    title: 'Transition Showcase',
    subtitle: 'Top and bottom bars over color blocks',
    symbol: 'paintpalette',
    navigation: {
      title: 'Transition Showcase',
      headerTransparent: true,
      headerLargeTitleEnabled: true,
      headerShadowVisible: false,
      headerBackButtonDisplayMode: 'minimal',
    },
  },
  {
    key: 'toolbar',
    title: 'Toolbar',
    subtitle: 'Bottom edge bar emphasis',
    symbol: 'hammer',
    navigation: {
      title: 'Toolbar',
      headerTransparent: true,
      headerLargeTitleEnabled: true,
      headerShadowVisible: false,
      headerBackButtonDisplayMode: 'minimal',
    },
  },
  {
    key: 'searchBar',
    title: 'Search Bar',
    subtitle: 'Search-like screen with segmented top bar',
    symbol: 'magnifyingglass',
    navigation: {
      title: 'Search Bar',
      headerTransparent: true,
      headerLargeTitleEnabled: true,
      headerShadowVisible: false,
      headerBackButtonDisplayMode: 'minimal',
    },
  },
  {
    key: 'tabAccessory',
    title: 'Tab Accessory',
    subtitle: 'Large bottom accessory-style bar',
    symbol: 'music.note.list',
    navigation: {
      title: 'Tab Accessory',
      headerTransparent: true,
      headerLargeTitleEnabled: true,
      headerShadowVisible: false,
      headerBackButtonDisplayMode: 'minimal',
    },
  },
  {
    key: 'calendar',
    title: 'Calendar',
    subtitle: 'Week selector with stronger top bar',
    symbol: 'calendar',
    navigation: {
      title: 'Calendar',
      headerTransparent: true,
      headerLargeTitleEnabled: true,
      headerShadowVisible: false,
      headerBackButtonDisplayMode: 'minimal',
    },
  },
];

export const titleByKey: Record<ExampleKey, string> = Object.fromEntries(
  exampleList.map((item) => [item.key, item.title])
) as Record<ExampleKey, string>;

export const navigationByKey: Record<ExampleKey, ExampleNavigationConfig> =
  Object.fromEntries(
    exampleList.map((item) => [item.key, item.navigation ?? {}])
  ) as Record<ExampleKey, ExampleNavigationConfig>;

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
