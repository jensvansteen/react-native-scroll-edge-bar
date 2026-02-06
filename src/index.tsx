import * as React from 'react';
import { getHostComponent } from 'react-native-nitro-modules';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type {
  RNScrollEdgeBarMethods,
  RNScrollEdgeBarProps,
  RNScrollEdgeBarTopBarMethods,
  RNScrollEdgeBarTopBarProps,
  RNScrollEdgeBarBottomBarMethods,
  RNScrollEdgeBarBottomBarProps,
} from './RNScrollEdgeBar.nitro';

// Generated configs
const RNScrollEdgeBarConfig = require('../nitrogen/generated/shared/json/RNScrollEdgeBarConfig.json');
const RNScrollEdgeBarTopBarConfig = require('../nitrogen/generated/shared/json/RNScrollEdgeBarTopBarConfig.json');
const RNScrollEdgeBarBottomBarConfig = require('../nitrogen/generated/shared/json/RNScrollEdgeBarBottomBarConfig.json');

// Base components
export type ScrollEdgeBarProps = RNScrollEdgeBarProps & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const ScrollEdgeBarBase = getHostComponent<
  RNScrollEdgeBarProps,
  RNScrollEdgeBarMethods
>('RNScrollEdgeBar', () => RNScrollEdgeBarConfig);

export type ScrollEdgeBarTopBarProps = RNScrollEdgeBarTopBarProps & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const TopBar = getHostComponent<
  RNScrollEdgeBarTopBarProps,
  RNScrollEdgeBarTopBarMethods
>('RNScrollEdgeBarTopBar', () => RNScrollEdgeBarTopBarConfig);

export type ScrollEdgeBarBottomBarProps = RNScrollEdgeBarBottomBarProps & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const BottomBar = getHostComponent<
  RNScrollEdgeBarBottomBarProps,
  RNScrollEdgeBarBottomBarMethods
>('RNScrollEdgeBarBottomBar', () => RNScrollEdgeBarBottomBarConfig);

const ScrollEdgeBarComponent = React.forwardRef<
  RNScrollEdgeBarMethods,
  ScrollEdgeBarProps
>((props, ref) =>
  React.createElement(ScrollEdgeBarBase as React.ElementType, { ...props, ref })
);

ScrollEdgeBarComponent.displayName = 'ScrollEdgeBar';

// Compound component
export const ScrollEdgeBar = Object.assign(ScrollEdgeBarComponent, {
  TopBar,
  BottomBar,
});

export type {
  RNScrollEdgeBarMethods,
  RNScrollEdgeBarTopBarMethods,
  RNScrollEdgeBarBottomBarMethods,
};
