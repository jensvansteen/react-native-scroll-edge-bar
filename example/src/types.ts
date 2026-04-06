export type ExampleKey =
  | 'appStore'
  | 'pullRequests'
  | 'prDetail'
  | 'transitionShowcase'
  | 'toolbar'
  | 'searchBar'
  | 'tabAccessory'
  | 'calendar';

export type RootStackParamList = {
  Home: undefined;
  Example: { key: ExampleKey };
};
