export type ExampleKey =
  | 'appStore'
  | 'pullRequests'
  | 'prDetail'
  | 'transitionShowcase'
  | 'toolbar'
  | 'searchBar'
  | 'tabAccessory'
  | 'calendar';

export type ExampleNavigationConfig = {
  title?: string;
  headerTransparent?: boolean;
  headerLargeTitleEnabled?: boolean;
  headerShadowVisible?: boolean;
  headerBackButtonDisplayMode?: 'default' | 'generic' | 'minimal';
};

export type RootStackParamList = {
  Home: undefined;
  Example: { key: ExampleKey };
};
