import type { ExampleKey } from '../types';
import { AppStoreScreen } from './AppStoreScreen';
import { PullRequestsScreen } from './PullRequestsScreen';
import { PrDetailScreen } from './PrDetailScreen';
import { TransitionShowcaseScreen } from './TransitionShowcaseScreen';
import { ToolbarScreen } from './ToolbarScreen';
import { SearchBarScreen } from './SearchBarScreen';
import { TabAccessoryScreen } from './TabAccessoryScreen';
import { CalendarScreen } from './CalendarScreen';

export function ExampleScreen({
  route,
}: {
  route: { params: { key: ExampleKey } };
}) {
  switch (route.params.key) {
    case 'appStore':
      return <AppStoreScreen />;
    case 'pullRequests':
      return <PullRequestsScreen />;
    case 'prDetail':
      return <PrDetailScreen />;
    case 'transitionShowcase':
      return <TransitionShowcaseScreen />;
    case 'toolbar':
      return <ToolbarScreen />;
    case 'searchBar':
      return <SearchBarScreen />;
    case 'tabAccessory':
      return <TabAccessoryScreen />;
    case 'calendar':
      return <CalendarScreen />;
  }
}
