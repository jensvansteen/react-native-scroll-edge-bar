import type {
  HybridView,
  HybridViewMethods,
  HybridViewProps,
} from 'react-native-nitro-modules';

// Main container
export interface RNScrollEdgeBarProps extends HybridViewProps {
  /** Estimated top bar height (used before layout to prevent flicker) */
  estimatedTopBarHeight?: number;
  /** Estimated bottom bar height (used before layout to prevent flicker) */
  estimatedBottomBarHeight?: number;
  /** Extra offset to push the top bar below a transparent header */
  topBarOffset?: number;
  /** Extra offset to lift the bottom bar above a tab bar */
  bottomBarOffset?: number;
}
export interface RNScrollEdgeBarMethods extends HybridViewMethods {}

export type RNScrollEdgeBar = HybridView<
  RNScrollEdgeBarProps,
  RNScrollEdgeBarMethods
>;

// Top bar slot
export interface RNScrollEdgeBarTopBarProps extends HybridViewProps {}
export interface RNScrollEdgeBarTopBarMethods extends HybridViewMethods {}

export type RNScrollEdgeBarTopBar = HybridView<
  RNScrollEdgeBarTopBarProps,
  RNScrollEdgeBarTopBarMethods
>;

// Bottom bar slot
export interface RNScrollEdgeBarBottomBarProps extends HybridViewProps {}
export interface RNScrollEdgeBarBottomBarMethods extends HybridViewMethods {}

export type RNScrollEdgeBarBottomBar = HybridView<
  RNScrollEdgeBarBottomBarProps,
  RNScrollEdgeBarBottomBarMethods
>;
