import type {
  HybridView,
  HybridViewMethods,
  HybridViewProps,
} from 'react-native-nitro-modules';

export interface ScrollEdgeBarProps extends HybridViewProps {
  color: string;
}
export interface ScrollEdgeBarMethods extends HybridViewMethods {}

export type ScrollEdgeBar = HybridView<
  ScrollEdgeBarProps,
  ScrollEdgeBarMethods
>;
