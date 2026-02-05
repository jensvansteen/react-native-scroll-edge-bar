import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
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
  /** React children rendered inside the host view */
  children?: ReactNode;
  /** Style for the host view */
  style?: StyleProp<ViewStyle>;
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
