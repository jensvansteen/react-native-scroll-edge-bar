import * as React from 'react';
import { getHostComponent } from 'react-native-nitro-modules';
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
const ScrollEdgeBarBase = getHostComponent<
  RNScrollEdgeBarProps,
  RNScrollEdgeBarMethods
>('RNScrollEdgeBar', () => RNScrollEdgeBarConfig);

const TopBar = getHostComponent<
  RNScrollEdgeBarTopBarProps,
  RNScrollEdgeBarTopBarMethods
>('RNScrollEdgeBarTopBar', () => RNScrollEdgeBarTopBarConfig);

const BottomBar = getHostComponent<
  RNScrollEdgeBarBottomBarProps,
  RNScrollEdgeBarBottomBarMethods
>('RNScrollEdgeBarBottomBar', () => RNScrollEdgeBarBottomBarConfig);

const ScrollEdgeBarComponent = React.forwardRef<
  RNScrollEdgeBarMethods,
  RNScrollEdgeBarProps
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
  RNScrollEdgeBarProps,
  RNScrollEdgeBarMethods,
  RNScrollEdgeBarTopBarProps,
  RNScrollEdgeBarTopBarMethods,
  RNScrollEdgeBarBottomBarProps,
  RNScrollEdgeBarBottomBarMethods,
};
