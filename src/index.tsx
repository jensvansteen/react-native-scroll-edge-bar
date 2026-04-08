import * as React from 'react';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import RNScrollEdgeBarNativeComponent, {
  type NativeProps as RNScrollEdgeBarProps,
} from './fabric/RNScrollEdgeBarNativeComponent';
import RNScrollEdgeBarTopBarNativeComponent, {
  type NativeProps as RNScrollEdgeBarTopBarProps,
} from './fabric/RNScrollEdgeBarTopBarNativeComponent';
import RNScrollEdgeBarBottomBarNativeComponent, {
  type NativeProps as RNScrollEdgeBarBottomBarProps,
} from './fabric/RNScrollEdgeBarBottomBarNativeComponent';

export interface RNScrollEdgeBarMethods {}
export interface RNScrollEdgeBarTopBarMethods {}
export interface RNScrollEdgeBarBottomBarMethods {}

export type ScrollEdgeBarProps = RNScrollEdgeBarProps & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export type ScrollEdgeBarTopBarProps = RNScrollEdgeBarTopBarProps & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export type ScrollEdgeBarBottomBarProps = RNScrollEdgeBarBottomBarProps & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const ScrollEdgeBarComponent = React.forwardRef<
  React.ElementRef<typeof RNScrollEdgeBarNativeComponent>,
  ScrollEdgeBarProps
>((props, ref) =>
  React.createElement(RNScrollEdgeBarNativeComponent as React.ElementType, {
    ...props,
    ref,
  })
);

const TopBar = React.forwardRef<
  React.ElementRef<typeof RNScrollEdgeBarTopBarNativeComponent>,
  ScrollEdgeBarTopBarProps
>((props, ref) =>
  React.createElement(
    RNScrollEdgeBarTopBarNativeComponent as React.ElementType,
    {
      ...props,
      ref,
    }
  )
);

const BottomBar = React.forwardRef<
  React.ElementRef<typeof RNScrollEdgeBarBottomBarNativeComponent>,
  ScrollEdgeBarBottomBarProps
>((props, ref) =>
  React.createElement(
    RNScrollEdgeBarBottomBarNativeComponent as React.ElementType,
    {
      ...props,
      ref,
    }
  )
);

ScrollEdgeBarComponent.displayName = 'ScrollEdgeBar';
TopBar.displayName = 'ScrollEdgeBar.TopBar';
BottomBar.displayName = 'ScrollEdgeBar.BottomBar';

export const ScrollEdgeBar = Object.assign(ScrollEdgeBarComponent, {
  TopBar,
  BottomBar,
});

export type {
  RNScrollEdgeBarProps,
  RNScrollEdgeBarTopBarProps,
  RNScrollEdgeBarBottomBarProps,
};
