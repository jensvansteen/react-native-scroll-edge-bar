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

type ScrollEdgeBarComponentType = React.ForwardRefExoticComponent<
  ScrollEdgeBarProps &
    React.RefAttributes<React.ElementRef<typeof RNScrollEdgeBarNativeComponent>>
>;

type ScrollEdgeBarTopBarComponentType = React.ForwardRefExoticComponent<
  ScrollEdgeBarTopBarProps &
    React.RefAttributes<
      React.ElementRef<typeof RNScrollEdgeBarTopBarNativeComponent>
    >
>;

type ScrollEdgeBarBottomBarComponentType = React.ForwardRefExoticComponent<
  ScrollEdgeBarBottomBarProps &
    React.RefAttributes<
      React.ElementRef<typeof RNScrollEdgeBarBottomBarNativeComponent>
    >
>;

export type ScrollEdgeBarCompoundComponent = ScrollEdgeBarComponentType & {
  TopBar: ScrollEdgeBarTopBarComponentType;
  BottomBar: ScrollEdgeBarBottomBarComponentType;
};

const ScrollEdgeBarComponent: ScrollEdgeBarComponentType = React.forwardRef<
  React.ElementRef<typeof RNScrollEdgeBarNativeComponent>,
  ScrollEdgeBarProps
>((props, ref) =>
  React.createElement(RNScrollEdgeBarNativeComponent as React.ElementType, {
    ...props,
    ref,
  })
);

const TopBar: ScrollEdgeBarTopBarComponentType = React.forwardRef<
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

const BottomBar: ScrollEdgeBarBottomBarComponentType = React.forwardRef<
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

export const ScrollEdgeBar: ScrollEdgeBarCompoundComponent = Object.assign(
  ScrollEdgeBarComponent,
  {
    TopBar,
    BottomBar,
  }
);

export type {
  RNScrollEdgeBarProps,
  RNScrollEdgeBarTopBarProps,
  RNScrollEdgeBarBottomBarProps,
};
